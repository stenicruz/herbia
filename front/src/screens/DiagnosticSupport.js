import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  TrendingUp, 
  Target, 
  HelpCircle 
} from 'lucide-react-native';

import { AppHeader } from '../components/AppHeader';

export default function DiagnosisGuideScreen({ navigation }) {
  const activeColor = '#47e426';

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      {/* Header */}
      <AppHeader
      title={"Guia de Diagnósticos"} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Ilustrativo */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require('../../assets/diagnosis.jpg')} 
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Exemplo Ideal</Text>
            </View>
            <Text style={styles.bannerTitle}>Como Tirar uma boa foto para diagnóstico</Text>
          </View>
        </View>

        {/* Texto Introdutório */}
        <Text style={styles.introText}>
          Nossa Inteligência Artificial analiza padrões visuais nas folhas para identificar anomalias, veja como interpretar cada parte do resultado
        </Text>

        {/* Card 1: Confiança da IA */}
        <View style={styles.infoCard}>
          <View style={styles.iconContainer}>
            <TrendingUp color={activeColor} size={30} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Confiança da IA</Text>
            <Text style={styles.cardSub}>Indica o grau de certeza da nossa IA sobre a identificação</Text>
          </View>
        </View>

        {/* Card 2: Identificação da Patologia */}
        <View style={styles.infoCard}>
          <View style={styles.iconContainer}>
            <Target color={activeColor} size={30} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Identificação da Patologia</Text>
            <Text style={styles.cardSub}>O nome Científico ou popular da condição detectada</Text>
          </View>
        </View>

        {/* Card 3: Acções Recomendadas */}
        <View style={styles.infoCard}>
          <View style={styles.iconContainer}>
            <HelpCircle color={activeColor} size={30} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Acções Recomendadas</Text>
            <Text style={styles.cardSub}>Sujestões de tratamentos e prevenção sugeridas</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 30 },

  // Banner
  bannerContainer: { 
    width: '100%', 
    height: 200, 
    borderRadius: 20, 
    overflow: 'hidden', 
    marginBottom: 20,
    marginTop: 20
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.25)', 
    padding: 20, 
    justifyContent: 'flex-end' 
  },
  badge: { 
    backgroundColor: 'rgba(255,255,255,0.25)', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 8, 
    marginBottom: 8 
  },
  badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  bannerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', lineHeight: 24 },

  // Introdução
  introText: { 
    fontSize: 15, 
    color: '#666', 
    textAlign: 'start', 
    lineHeight: 22, 
    marginBottom: 30,
    paddingHorizontal: 7
  },

  // Cards
  infoCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9FFF8', 
    borderRadius: 20, 
    padding: 15, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EBF9E8'
  },
  iconContainer: { 
    width: 55, 
    height: 55, 
    borderRadius: 15, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBF9E8'
  },
  cardTextContent: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1B1919' },
  cardSub: { fontSize: 13, color: '#888', marginTop: 5, lineHeight: 18 },
});