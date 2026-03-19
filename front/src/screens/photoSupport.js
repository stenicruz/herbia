import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Maximize, 
  Sun, 
  HelpCircle, 
  CheckCircle2 
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/central'; // Ajuste conforme seu mapeamento

export default function PhotoGuideScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const activeColor = THEME.primary;

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <AppHeader title="Guia de Fotografia" onBack={() => navigation.goBack()} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner de Exemplo Ideal */}
        <View style={[styles.bannerContainer, { borderColor: isDarkMode ? '#222' : '#EEE', borderWidth: isDarkMode ? 1 : 0 }]}>
          <Image 
            source={require('../../assets/exemplo.jpg')} 
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <View style={[styles.badge, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
              <Text style={styles.badgeText}>Exemplo Ideal</Text>
            </View>
            <Text style={styles.bannerTitle}>Como tirar uma boa foto para diagnóstico</Text>
          </View>
        </View>

        {/* Título da Seção com Indicador Vertical */}
        <View style={styles.sectionTitleRow}>
          <View style={[styles.verticalIndicator, { backgroundColor: activeColor }]} />
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Passos para precisão</Text>
        </View>

        {/* Card 1: Enquadramento */}
        <View style={[
          styles.guideCard, 
          { 
            backgroundColor: isDarkMode ? '#121411' : '#ecf7ea', 
            borderColor: isDarkMode ? '#1A2E1A' : '#EBF9E8' 
          }
        ]}>
          <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF', borderColor: isDarkMode ? '#222' : '#EBF9E8' }]}>
            <Maximize color={activeColor} size={26} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Enquadramento Central</Text>
            <Text style={[styles.cardSub, { color: isDarkMode ? '#888' : '#666' }]}>Mantenha a folha ou área afectada no centro do visor</Text>
          </View>
        </View>

        {/* Card 2: Iluminação */}
        <View style={[
          styles.guideCard, 
          { 
            backgroundColor: isDarkMode ? '#121411' : '#ecf7ea', 
            borderColor: isDarkMode ? '#1A2E1A' : '#EBF9E8' 
          }
        ]}>
          <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF', borderColor: isDarkMode ? '#222' : '#EBF9E8' }]}>
            <Sun color={activeColor} size={26} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Iluminação Natural</Text>
            <Text style={[styles.cardSub, { color: isDarkMode ? '#888' : '#666' }]}>Evite sombras fortes ou luz direta intensa</Text>
          </View>
        </View>

        {/* Card 3: Dicas Extra */}
        <View style={[
          styles.extraTipsCard, 
          { 
            backgroundColor: isDarkMode ? '#0F110E' : '#F9FFF8', 
            borderColor: isDarkMode ? '#1A2E1A' : '#EBF9E8' 
          }
        ]}>
          <View style={styles.extraHeader}>
            <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF', borderColor: isDarkMode ? '#222' : '#EBF9E8' }]}>
              <HelpCircle color={activeColor} size={26} />
            </View>
            <Text style={[styles.extraTitle, { color: currentTheme.textPrimary }]}>Dicas Extra</Text>
          </View>
          
          <View style={styles.tipRow}>
            <CheckCircle2 color={activeColor} size={20} fill={isDarkMode ? "#0F110E" : "#FFF"} />
            <Text style={[styles.tipText, { color: isDarkMode ? '#AAA' : '#555' }]}>Limpe a lente da câmera antes de começar</Text>
          </View>

          <View style={styles.tipRow}>
            <CheckCircle2 color={activeColor} size={20} fill={isDarkMode ? "#0F110E" : "#FFF"} />
            <Text style={[styles.tipText, { color: isDarkMode ? '#AAA' : '#555' }]}>Evitar fundos muito poluídos</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 30 },

  bannerContainer: { 
    width: '100%', 
    height: 230, 
    borderRadius: 28, 
    overflow: 'hidden', 
    marginBottom: 35,
    marginTop: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.35)', 
    padding: 25, 
    justifyContent: 'flex-end' 
  },
  badge: { 
    alignSelf: 'flex-start', 
    paddingHorizontal: 14, 
    paddingVertical: 7, 
    borderRadius: 12, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  badgeText: { color: '#FFF', fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },
  bannerTitle: { 
    color: '#FFF', 
    fontSize: 20, 
    fontWeight: '800', 
    lineHeight: 28 
  },

  sectionTitleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 25,
    marginTop: 5 
  },
  verticalIndicator: { 
    width: 5, 
    height: 24, 
    borderRadius: 3, 
    marginRight: 15 
  },
  sectionTitle: { fontSize: 19, fontWeight: '800' },

  guideCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 24, 
    padding: 18, 
    marginBottom: 15,
    borderWidth: 1,
  },
  iconCircle: { 
    width: 54, 
    height: 54, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
  },
  cardTextContent: { flex: 1, marginLeft: 18 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  cardSub: { fontSize: 13, marginTop: 4, lineHeight: 19, fontWeight: '500' },

  extraTipsCard: {
    marginTop: 15,
    marginBottom: 50, 
    borderRadius: 28, 
    padding: 25, 
    borderWidth: 1,
  },
  extraHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  extraTitle: { fontSize: 18, fontWeight: '800', marginLeft: 15 },
  tipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  tipText: { 
    fontSize: 14, 
    marginLeft: 14, 
    fontWeight: '600',
    flex: 1 
  }
});