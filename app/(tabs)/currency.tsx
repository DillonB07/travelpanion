import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { Button, Image, Text, StyleSheet } from "react-native";
import CurrencyModal from "../(modals)/currency";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Table, {
  KeyValueCell,
  Section,
  StaticCell,
} from "react-native-js-tableview";

export default function CurrencyScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(
    {},
  );
  const homeCurrency = "GBP";

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const storedCurrencies = await AsyncStorage.getItem("currencies");
        if (storedCurrencies) {
          setCurrencies(JSON.parse(storedCurrencies));
        }
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    }

    fetchCurrencies();
  }, []);

  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const exchangeRates = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${homeCurrency}`,
        ).then((response) => response.json());
        const rates = exchangeRates.rates;
        setExchangeRates(rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    }
    fetchExchangeRates();
  });

  const onModalClose = () => {
    console.log("boo");
    setModalOpen(false);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.centeredView}>
        <ThemedText type="subtitle">Currency</ThemedText>
        <Button title="Add Currency" onPress={() => setModalOpen(true)} />
        <CurrencyModal isVisible={modalOpen} onClose={onModalClose} />
      </ThemedView>
      {currencies?.map((curr: string) => <Text key={curr}>{curr}</Text>)}
      <Table>
        <Section header="£5 in your currencies">
          <KeyValueCell title="USD" value={`${exchangeRates["USD"] * 5}`} />
          {currencies.map((curr: string) => (
            <KeyValueCell
              key={curr}
              title={curr}
              value={`${exchangeRates[curr] * 5}`}
            />
          ))}
        </Section>
      </Table>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});
