import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Platform 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// Trocado ArrowLeft por ChevronLeft
import { ChevronLeft } from 'lucide-react-native';

const CULTURAS = [
  { id: '1', nome: 'Doença' },
  { id: '2', nome: 'Doença' },
  { id: '3', nome: 'Doença' },
  { id: '4', nome: 'Doença' },
  { id: '5', nome: 'Doença' },
  { id: '6', nome: 'Doença' },
];

export default function CulturesScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      
      {/* Header com ChevronLeft */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <ChevronLeft color="#1B1919" size={32} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Culturas Suportadas</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View style={styles.textSection}>
          <Text style={styles.descriptionText}>
            Abaixo são apresentatas todas as culturas suportadas pelo sistema.
          </Text>
        </View>

        {/* Grid Container */}
        <View style={[
          styles.gridWrapper, 
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 30 }
        ]}>
          <View style={styles.grid}>
            {CULTURAS.map((item) => (
              <View key={item.id} style={styles.cultureItem}>
                <View style={styles.circle} />
                <Text style={styles.cultureName}>{item.nome}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15, // Ajustado para o Chevron não ficar muito longe da borda
    paddingTop: 25,
    paddingBottom: 15,
  },
  backButton: {
    marginRight: 10,
    padding: 7, // Aumenta a área de clique para melhor UX
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#1B1919',
  },
  textSection: {
    paddingHorizontal: 25,
    marginTop: 10,
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 23,
  },
  gridWrapper: {
    flex: 1,
    backgroundColor: '#f0f7ee96', 
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 45,
    paddingHorizontal: 15,
    minHeight: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  cultureItem: {
    width: '33.3%',
    alignItems: 'center',
    marginBottom: 35,
  },
  circle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#233814',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cultureName: {
    fontSize: 14,
    color: '#1B1919',
    fontWeight: '500',
  },
});