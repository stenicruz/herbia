import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck, ArrowRight, ShieldCheck } from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { PrimaryButton } from '../components/central';

export default function SuccessScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={currentTheme.background} 
      />

      <View style={styles.content}>
        {/* Ícone com Efeito Glow Dinâmico */}
        <View style={styles.iconContainer}>
          <View style={[
            styles.iconInnerCircle, 
            { 
              backgroundColor: THEME.primary,
              shadowColor: THEME.primary,
              elevation: isDarkMode ? 20 : 10,
              shadowOpacity: isDarkMode ? 0.6 : 0.3,
            }
          ]}>
            <CircleCheck color={currentTheme.background} size={90} strokeWidth={1} />
          </View>
        </View>

        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
          Senha Alterada!
        </Text>
        <Text style={[styles.subtitle, { color: currentTheme.textSecondary }]}>
          Sua senha foi redefinida com sucesso. Agora você pode fazer login e cuidar das suas plantas.
        </Text>

        {/* Card de Status - Adaptado para Dark Mode */}
        <View style={[
          styles.statusCard, 
          { backgroundColor: isDarkMode ? '#121411' : '#F0F9F0' }
        ]}>
          <View style={[
            styles.shieldIconContainer, 
            { backgroundColor: isDarkMode ? 'rgba(71, 228, 38, 0.1)' : '#D7F2D7' }
          ]}>
            <ShieldCheck color={THEME.primary} size={24} />
          </View>
          <View>
            <Text style={[styles.statusTitle, { color: currentTheme.textPrimary }]}>
              Conta Protegida
            </Text>
            <Text style={[styles.statusSubtitle, { color: currentTheme.textSecondary }]}>
              Última atualização: agora mesmo
            </Text>
          </View>
        </View>

        {/* Botão Principal */}
        <PrimaryButton
          title={"Ir para Login"}
          icon={ArrowRight}
          onPress={() => navigation.navigate('Login')}
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    paddingHorizontal: 30, 
    justifyContent: 'center', 
    paddingBottom: 60 
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconInnerCircle: {
    width: 90,
    height: 90,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombras para iOS
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
  },
  title: { 
    fontSize: 30, 
    fontWeight: '800', 
    marginTop: 20, 
    marginBottom: 12,
    textAlign: 'center'
  },
  subtitle: { 
    fontSize: 16, 
    textAlign: 'center', 
    lineHeight: 24, 
    marginBottom: 40,
    paddingHorizontal: 10
  },
  statusCard: {
    flexDirection: 'row',
    width: '100%',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 50,
    // Leve borda no Dark Mode para separação
    borderWidth: 1,
    borderColor: 'transparent',
  },
  shieldIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statusTitle: { 
    fontSize: 17, 
    fontWeight: '700' 
  },
  statusSubtitle: { 
    fontSize: 13, 
    marginTop: 2 
  }
});