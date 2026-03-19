import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  TrendingUp, 
  Target, 
  HelpCircle 
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/central';

export default function DiagnosisGuideScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const activeColor = THEME.primary;

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <AppHeader title="Guia de Diagnósticos" onBack={() => navigation.goBack()} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Ilustrativo */}
        <View style={[styles.bannerContainer, { borderColor: isDarkMode ? '#222' : '#EEE', borderWidth: isDarkMode ? 1 : 0 }]}>
          <Image 
            source={require('../../assets/diagnosis.jpg')} 
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <View style={[styles.badge, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
              <Text style={styles.badgeText}>Exemplo Ideal</Text>
            </View>
            <Text style={styles.bannerTitle}>Como interpretar os resultados do Herbia</Text>
          </View>
        </View>

        {/* Texto Introdutório */}
        <Text style={[styles.introText, { color: isDarkMode ? '#AAA' : '#666' }]}>
          Nossa Inteligência Artificial analisa padrões visuais nas folhas para identificar anomalias. Veja como interpretar cada parte do resultado gerado.
        </Text>

        {/* Card 1: Confiança da IA */}
        <View style={[
          styles.infoCard, 
          { 
            backgroundColor: isDarkMode ? '#121411' : '#F9FFF8', 
            borderColor: isDarkMode ? '#1A2E1A' : '#EBF9E8' 
          }
        ]}>
          <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF', borderColor: isDarkMode ? '#222' : '#EBF9E8' }]}>
            <TrendingUp color={activeColor} size={30} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Confiança da IA</Text>
            <Text style={[styles.cardSub, { color: isDarkMode ? '#888' : '#777' }]}>Indica o grau de certeza da nossa IA sobre a identificação.</Text>
          </View>
        </View>

        {/* Card 2: Identificação da Patologia */}
        <View style={[
          styles.infoCard, 
          { 
            backgroundColor: isDarkMode ? '#121411' : '#F9FFF8', 
            borderColor: isDarkMode ? '#1A2E1A' : '#EBF9E8' 
          }
        ]}>
          <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF', borderColor: isDarkMode ? '#222' : '#EBF9E8' }]}>
            <Target color={activeColor} size={30} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Identificação da Patologia</Text>
            <Text style={[styles.cardSub, { color: isDarkMode ? '#888' : '#777' }]}>O nome científico ou popular da condição detectada.</Text>
          </View>
        </View>

        {/* Card 3: Acções Recomendadas */}
        <View style={[
          styles.infoCard, 
          { 
            backgroundColor: isDarkMode ? '#121411' : '#F9FFF8', 
            borderColor: isDarkMode ? '#1A2E1A' : '#EBF9E8' 
          }
        ]}>
          <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF', borderColor: isDarkMode ? '#222' : '#EBF9E8' }]}>
            <HelpCircle color={activeColor} size={30} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Ações Recomendadas</Text>
            <Text style={[styles.cardSub, { color: isDarkMode ? '#888' : '#777' }]}>Sugestões de tratamentos e prevenção baseadas na análise.</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 30 },

  bannerContainer: { 
    width: '100%', 
    height: 200, 
    borderRadius: 24, 
    overflow: 'hidden', 
    marginBottom: 20,
    marginTop: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    padding: 20, 
    justifyContent: 'flex-end' 
  },
  badge: { 
    alignSelf: 'flex-start', 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 10, 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  badgeText: { color: '#FFF', fontWeight: '800', fontSize: 12, letterSpacing: 0.3 },
  bannerTitle: { color: '#FFF', fontSize: 19, fontWeight: '800', lineHeight: 26 },

  introText: { 
    fontSize: 15, 
    textAlign: 'left', 
    lineHeight: 24, 
    marginBottom: 35,
    paddingHorizontal: 5,
    fontWeight: '500'
  },

  infoCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 24, 
    padding: 18, 
    marginBottom: 18,
    borderWidth: 1,
  },
  iconContainer: { 
    width: 60, 
    height: 60, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
  },
  cardTextContent: { flex: 1, marginLeft: 18 },
  cardTitle: { fontSize: 17, fontWeight: '800' },
  cardSub: { fontSize: 13, marginTop: 5, lineHeight: 19, fontWeight: '500' },
});