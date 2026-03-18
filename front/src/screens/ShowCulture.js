import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';

import { ChevronLeft } from 'lucide-react-native';

const culturas = [
    { id: 1, nome: 'Tomate', img: require('../../assets/tomate.jpeg') },
    { id: 2, nome: 'Batata', img: require('../../assets/batata.jpeg') },
    { id: 3, nome: 'Milho', img: require('../../assets/milho.jpeg') },
    { id: 4, nome: 'Mandioca', img: require('../../assets/mandioca.jpeg') },
  ];

export default function CulturesScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      
      {/* Header */}
      <AppHeader
      title={'Culturas Suportadas'}
       />

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
        <View style={styles.grid}>
        {culturas.map((item) => ( // Corrigido para minúsculo
          <TouchableOpacity key={item.id} style={styles.cultureItem} activeOpacity={0.7}>
            <View style={styles.circle}>
              <Image 
                source={item.img} 
                style={styles.cultureImage} 
                resizeMode="cover" 
              />
            </View>
            <Text style={styles.cultureName}>{item.nome}</Text>
          </TouchableOpacity>
        ))}
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
    backgroundColor: '#F9F9F9', // Fundo claro para destacar a planta
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', // Corta a imagem no formato do círculo
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cultureImage: {
    width: '100%',
    height: '100%',
  },
  gridWrapper: {
    flex: 1,
    backgroundColor: '#f7faf6', // Um tom de verde quase branco, muito elegante
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 35,
    paddingHorizontal: 10,
    minHeight: 600, // Garante que o fundo colorido cubra a tela
  },
  cultureName: {
    fontSize: 14,
    color: '#1B1919',
    fontWeight: '700', // Um pouco mais de peso para facilitar a leitura
    textAlign: 'center',
  },
});