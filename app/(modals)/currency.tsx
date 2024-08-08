import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";

export default function CurrencyModal() {
  const [selectedCurrency, setSelectedCurrency] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    async function fetchCurrencies() {
      console.log("hi");
      try {
        const currenciesRes = await fetch(
          "https://openexchangerates.org/api/currencies.json",
        );
        const currenciesData = await currenciesRes.json();
        setCurrencies(currenciesData);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    }

    fetchCurrencies();
  }, []);

  return (
    <ThemedView>
      <ThemedText type="title">Select a Currency</ThemedText>
      <Picker
        selectedValue={selectedCurrency}
        onValueChange={(itemValue, itemIndex) => setSelectedCurrency(itemValue)}
      >
        {Object.entries(currencies).map(([code, name]) => (
          <Picker.Item key={code} label={`${code} - ${name}`} value={code} />
        ))}
      </Picker>
    </ThemedView>
  );
}
