import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from "../styles/Filters_styles"

type Props = {
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  radius: number;
  setRadius: (r: number) => void;
  filterFee: 'all' | 'free' | 'paid';
  setFilterFee: (f: 'all' | 'free' | 'paid') => void;
  onRadiusChange: (val: number) => void;
};

export default function Filters({
  showFilters,
  setShowFilters,
  radius,
  setRadius,
  filterFee,
  setFilterFee,
  onRadiusChange,
}: Props) {

  return (
    <Modal visible={showFilters} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filtres</Text>

          <Text>Distance :</Text>
          {[0.5, 1, 2, 5].map((val) => (
            <TouchableOpacity
              key={val}
              style={[styles.filterOption, radius === val ? styles.filterOptionActive : styles.filterOptionInactive]}
              onPress={() => {
                setRadius(val);
                onRadiusChange(val);
                setShowFilters(false);
              }}
            >
              <Text style={radius === val ? styles.filterOptionTextActive : styles.filterOptionTextInactive}>
                {val} km
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={{ marginTop: 10 }}>Tarif :</Text>
          {['all', 'free', 'paid'].map((val) => (
            <TouchableOpacity
              key={val}
              style={[styles.filterOption, filterFee === val ? styles.filterOptionActive : styles.filterOptionInactive]}
              onPress={() => {
                setFilterFee(val as 'all' | 'free' | 'paid');
                setShowFilters(false);
              }}
            >
              <Text style={filterFee === val ? styles.filterOptionTextActive : styles.filterOptionTextInactive}>
                {val === 'all' ? 'Tous' : val === 'free' ? 'Gratuit' : 'Payant'}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowFilters(false)}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
