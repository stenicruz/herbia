import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react-native';

export const AnalysisCard = ({ item, onPress }) => {
  const isSuccess = item.status === 'success' || item.status === 'Saudável';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        {/* Placeholder ou Imagem Real */}
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Text style={styles.plantName}>{item.plant || item.planta}</Text>
            {isSuccess ? (
              <CheckCircle2 size={16} color="#47e426" style={styles.statusIcon} />
            ) : (
              <XCircle size={16} color="#E74C3C" style={styles.statusIcon} />
            )}
          </View>
          
          {item.user && <Text style={styles.userText}>{item.user}</Text>}
          <Text style={styles.dateText}>{item.date || item.data}</Text>
        </View>

        <ChevronRight color="#EEE" size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, backgroundColor: '#EBF5FB' },
  info: { flex: 1, marginLeft: 15 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  plantName: { fontSize: 16, fontWeight: '700', color: '#1B1919' },
  statusIcon: { marginLeft: 6 },
  userText: { fontSize: 13, color: '#666', fontStyle: 'italic' },
  dateText: { fontSize: 12, color: '#BBB', marginTop: 2 },
});