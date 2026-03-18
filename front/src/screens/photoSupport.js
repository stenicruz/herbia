import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Maximize, 
  Sun, 
  HelpCircle, 
  CheckCircle2, 
  ChevronLeft
} from 'lucide-react-native';

import { AppHeader } from '../components/AppHeader';

export default function PhotoGuideScreen({ navigation }) {
  const activeColor = '#47e426';

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      {/* Header com seta de voltar */}
      <AppHeader
      title={"Guia de Fotografia"} />
      

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner de Exemplo Ideal */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require('../../assets/exemplo.jpg')} 
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Exemplo Ideal</Text>
            </View>
            <Text style={styles.bannerTitle}>Como Tirar uma boa foto para diagnóstico</Text>
          </View>
        </View>

        {/* Título da Seção com Indicador Vertical */}
        <View style={styles.sectionTitleRow}>
          <View style={styles.verticalIndicator} />
          <Text style={styles.sectionTitle}>Passos para precisão</Text>
        </View>

        {/* Card 1: Enquadramento */}
        <View style={styles.guideCard}>
          <View style={styles.iconCircle}>
            <Maximize color={activeColor} size={26} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Enquadramento Central</Text>
            <Text style={styles.cardSub}>Mantenha a folha ou área afectada no centro do visor</Text>
          </View>
        </View>

        {/* Card 2: Iluminação */}
        <View style={styles.guideCard}>
          <View style={styles.iconCircle}>
            <Sun color={activeColor} size={26} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Iluminação Natural</Text>
            <Text style={styles.cardSub}>Evite sombras fortes ou luz direta intensa</Text>
          </View>
        </View>

        {/* Card 3: Dicas Extra */}
        <View style={styles.extraTipsCard}>
          <View style={styles.extraHeader}>
            <View style={styles.iconCircle}>
              <HelpCircle color={activeColor} size={26} />
            </View>
            <Text style={styles.extraTitle}>Dicas Extra</Text>
          </View>
          
          <View style={styles.tipRow}>
            <CheckCircle2 color={activeColor} size={20} fill="#FFF" />
            <Text style={styles.tipText}>Limpe a lente da câmera antes de começar</Text>
          </View>

          <View style={styles.tipRow}>
            <CheckCircle2 color={activeColor} size={20} fill="#FFF" />
            <Text style={styles.tipText}>Evitar fundos muito poluídos</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 30 },

  // Estilização do Banner
  bannerContainer: { 
    width: '100%', 
    height: 230, 
    borderRadius: 24, 
    overflow: 'hidden', 
    marginBottom: 30,
    marginTop: 10 
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    padding: 20, 
    justifyContent: 'flex-end' 
  },
  badge: { 
    backgroundColor: 'rgba(0, 0, 0, 0.48)', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 10, 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(7, 7, 7, 0.11)'
  },
  badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  bannerTitle: { 
    color: '#FFF', 
    fontSize: 19, 
    fontWeight: '700', 
    lineHeight: 26 
  },

  // Título com indicador
  sectionTitleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 35,
    marginTop: 10 
  },
  verticalIndicator: { 
    width: 4, 
    height: 25, 
    backgroundColor: '#47e426', 
    borderRadius: 2, 
    marginRight: 15 
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1B1919' },

  // Cards de Instrução
  guideCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ecf7ea', 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EBF9E8'
  },
  iconCircle: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center',
    // Pequena borda para destacar o ícone
    borderWidth: 1,
    borderColor: '#EBF9E8'
  },
  cardTextContent: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1B1919' },
  cardSub: { fontSize: 13, color: '#888', marginTop: 4, lineHeight: 18 },

  // Dicas Extra
  extraTipsCard: {
    marginBottom: 50, 
    backgroundColor: '#F9FFF8', 
    borderRadius: 20, 
    padding: 20, 
    borderWidth: 1,
    borderColor: '#EBF9E8'
  },
  extraHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  extraTitle: { fontSize: 16, fontWeight: '700', color: '#1B1919', marginLeft: 15 },
  tipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  tipText: { 
    fontSize: 14, 
    color: '#555', 
    marginLeft: 12, 
    fontWeight: '500',
    flex: 1 
  }
});