import React from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/SearchBar_styles"

type Props = {
  address: string;
  setAddress: (text: string) => void;
  searchAddress: () => void;
  searchLoading: boolean;
};

export default function SearchBar({ address, setAddress, searchAddress, searchLoading }: Props) {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#666" style={{ marginHorizontal: 8 }} />
      <TextInput
        style={styles.input}
        placeholder="Rechercher une adresse..."
        placeholderTextColor="#999"
        value={address}
        onChangeText={setAddress}
        onSubmitEditing={searchAddress}
      />

      {searchLoading ? (
        <ActivityIndicator style={{ marginRight: 8 }} size="small" color="#4A90E2" />
      ) : (
        address.length > 0 && (
          <TouchableOpacity onPress={() => setAddress("")}>
            <Ionicons name="close-circle" size={20} color="#999" style={{ marginRight: 8 }} />
          </TouchableOpacity>
        )
      )}
    </View>
  );
}
