import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Linking, StatusBar
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronRight, Camera, Share2, Mail 
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/central';

export default function SupportScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const activeColor = THEME.primary;

  const handleEmailSupport = () => {
    Linking.openURL('mailto:suporte@herbia.com?subject=Ajuda com o App');
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Ajuda e Suporte" onBack={() => navigation.goBack()} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 80 }}
      >
        {/* Cards de Dúvidas Frequentes */}
        <TouchableOpacity 
          style={[styles.supportCard, { 
            backgroundColor: isDarkMode ? '#121411' : '#FFF', 
            borderColor: isDarkMode ? '#222' : '#E8F9E4' 
          }]} 
          onPress={() => navigation.navigate('PhotoSupport')}
        >
          <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1A1D19' : '#F2FBF0' }]}>
            <Camera color={activeColor} size={24} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Como tirar uma Foto</Text>
            <Text style={[styles.cardSub, { color: isDarkMode ? '#888' : '#999' }]}>Dicas para obter a melhor imagem</Text>
          </View>
          <ChevronRight color={isDarkMode ? "#444" : "#666"} size={20} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.supportCard, { 
            backgroundColor: isDarkMode ? '#121411' : '#FFF', 
            borderColor: isDarkMode ? '#222' : '#E8F9E4' 
          }]} 
          onPress={() => navigation.navigate('DiagnosticSupport')}
        >
          <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1A1D19' : '#F2FBF0' }]}>
            <Share2 color={activeColor} size={24} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Entendendo Resultados</Text>
            <Text style={[styles.cardSub, { color: isDarkMode ? '#888' : '#999' }]}>Como interpretar as análises</Text>
          </View>
          <ChevronRight color={isDarkMode ? "#444" : "#666"} size={20} />
        </TouchableOpacity>

        {/* Seção Fale Conosco */}
        <Text style={[styles.sectionLabel, { color: currentTheme.textPrimary }]}>Fale Conosco</Text>
        
        <TouchableOpacity 
          style={[styles.emailContainer, { 
            backgroundColor: isDarkMode ? '#1A1D19' : '#ebf7e8',
            borderColor: activeColor 
          }]} 
          onPress={handleEmailSupport}
          activeOpacity={0.7}
        >
          <View style={[styles.emailIconBox, { backgroundColor: activeColor }]}>
            <Mail color="#FFF" size={32} />
          </View>
          <Text style={[styles.emailTitle, { color: currentTheme.textPrimary }]}>Enviar Email</Text>
          <Text style={[styles.emailSub, { color: isDarkMode ? '#AAA' : '#333' }]}>Respondemos em até 24 horas úteis</Text>
        </TouchableOpacity>

        {/* Links de Documentos */}
        <View style={[styles.linksContainer, { 
          borderColor: isDarkMode ? '#222' : '#E8F9E4',
          backgroundColor: isDarkMode ? '#121411' : 'transparent'
        }]}>
          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('TermsOfUse')}>
            <Text style={[styles.linkText, { color: currentTheme.textPrimary }]}>Termos de uso</Text>
            <ChevronRight color={isDarkMode ? activeColor : "#1B1919"} size={20} />
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: isDarkMode ? '#222' : '#E8F9E4' }]} />
          
          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('PrivacyPolicy', { isLogged: true })}>
            <Text style={[styles.linkText, { color: currentTheme.textPrimary }]}>Política de Privacidade</Text>
            <ChevronRight color={isDarkMode ? activeColor : "#1B1919"} size={20} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.versionText, { color: isDarkMode ? '#444' : '#BBB' }]}>Herbia v1.0.5</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  supportCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderRadius: 24, 
    padding: 16, 
    marginBottom: 15,
    marginTop: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10
  },
  iconCircle: { 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cardTextContent: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  cardSub: { fontSize: 13, marginTop: 3 },

  sectionLabel: { 
    fontSize: 20, 
    fontWeight: '900', 
    marginTop: 25, 
    marginBottom: 15 
  },
  
  emailContainer: { 
    borderRadius: 28, 
    padding: 30, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderStyle: 'dashed' 
  },
  emailIconBox: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    justifyContent: 'center',
    alignItems: 'center', 
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#47e426',
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  emailTitle: { fontSize: 19, fontWeight: '800' },
  emailSub: { fontSize: 13, marginTop: 6, fontWeight: '500' },

  linksContainer: { 
    marginTop: 35, 
    borderWidth: 1, 
    borderRadius: 24, 
    paddingHorizontal: 20 
  },
  linkRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 20 
  },
  linkText: { fontSize: 16, fontWeight: '700' },
  divider: { height: 1 },

  versionText: { 
    textAlign: 'center', 
    marginTop: 40, 
    fontSize: 14, 
    fontWeight: '700' 
  },
});