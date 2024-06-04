import { View, Text } from "react-native";
import React, { useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign } from '@expo/vector-icons'

const countries = ["VN", "USA", "UK", "Cam"];

const CountryDropdown = () => {
  const [selectedCountry, setSelectedCountry] = useState("VN");

  return (
    <View >
      <SelectDropdown
        data={countries}
        onSelect={(selectedItem, index) => {
          setSelectedCountry(selectedItem);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        buttonStyle={{ width: 70,  backgroundColor: "white" }}
        renderCustomizedButtonChild={(selectedItem, index) => {
          return (
            <View style={{ justifyContent: "space-around", alignItems: 'center', flexDirection: "row" }}>
              <Text>{selectedCountry}</Text>
              <AntDesign name="caretdown" size={10} color="gray" />

            </View>
          );
        }}
      />
    </View>
  );
};

export default CountryDropdown;
