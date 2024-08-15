import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Text, Button, Modal, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CurrencyModal({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencies, setCurrencies] = useState(["Select a currency"]);

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const currenciesRes = await fetch(
          "https://openexchangerates.org/api/currencies.json",
        );
        const currenciesData = await currenciesRes.json();
        setCurrencies((curr) => ({ ...curr, ...currenciesData }));
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    }

    fetchCurrencies();
  }, []);

  async function setCurrency(currency: string) {
    console.log(currency);
    setSelectedCurrency("");
    const oldCurrencies = await AsyncStorage.getItem("currencies");
    const oldCurrenciesParsed = oldCurrencies ? JSON.parse(oldCurrencies) : [];
    const newCurrencies = [...oldCurrenciesParsed, currency];
    console.log(oldCurrencies, newCurrencies);
    await AsyncStorage.setItem("currencies", JSON.stringify(newCurrencies));
  }

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <ThemedView style={styles.modalView}>
        <ThemedText type="title">Select a Currency</ThemedText>
        <Picker
          selectedValue={selectedCurrency}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedCurrency(itemValue)
          }
        >
          {Object.entries(currencies).map(([code, name]) => (
            <Picker.Item
              key={code}
              label={code !== "0" ? `${code} - ${name}` : name}
              value={code}
            />
          ))}
        </Picker>
        <ThemedView style={styles.container}>
          <Button
            title="Cancel"
            onPress={() => {
              onClose();
            }}
            color={"#94a3b8"}
          />
          <Button
            onPress={() => {
              setCurrency(selectedCurrency);
              onClose();
            }}
            title="Add"
            disabled={selectedCurrency === ""}
          />
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
});
