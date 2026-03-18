import React from 'react';
import { 
  StyleSheet, View, Text, ScrollView, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Gavel, 
  Lock, 
  CheckCircle2
} from 'lucide-react-native';

// Importações do Tema e Contexto
import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/central';

export default function TermsOfUseScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const activeColor = THEME.primary;

  // Componente interno ajustado para o Dark Mode
  const CardSection = ({ icon: Icon, title, children }) => (
    <View style={[
      styles.card, 
      { 
        backgroundColor: isDarkMode ? '#121411' : '#FFF', 
        borderColor: isDarkMode ? '#1A2E17' : '#EBF9E8' 
      }
    ]}>
      <View style={styles.cardHeader}>
        <Icon color={activeColor} size={24} fill={activeColor} fillOpacity={0.1} />
        <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const BulletItem = ({ text }) => (
    <View style={styles.bulletRow}>
      <CheckCircle2 color={activeColor} size={18} />
      <Text style={[styles.bulletText, { color: currentTheme.textSecondary }]}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={currentTheme.background} 
      />

      {/* Header - Certifique-se que o AppHeader aceite o estilo do tema internamente */}
      <AppHeader 
        title="Termos de Uso" 
        onBack={() => navigation.goBack()} 
      />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Bloco 1: Aceitação */}
        <CardSection icon={Gavel} title="Aceitação de Termos">
          <Text style={[styles.cardDescription, { color: currentTheme.textSecondary }]}>
            Ao criar uma conta ou utilizar as ferramentas de identificação de doenças em plantas, você declara ter lido, compreendido e aceitado todos os termos. Se não concordar com qualquer parte, por favor, interrompa o uso do aplicativo imediatamente.
          </Text>
        </CardSection>

        {/* Bloco 2: Privacidade */}
        <CardSection icon={Lock} title="Privacidade">
          <Text style={[styles.cardDescription, { color: currentTheme.textSecondary }]}>
            Sua privacidade é nossa prioridade. as imagens enviadas são processadas anonimamente para melhorar nossos algoritmos de reconhecimento.
          </Text>
          <BulletItem text="Criptografia de ponta a ponta" />
          <BulletItem text="Você mantém a propriedade intelectual de suas fotos" />
        </CardSection>

        {/* Bloco 3: Uso Responsável */}
        <CardSection icon={Lock} title="Uso Responsável">
          <BulletItem text="Você é responsável por manter a confidencialidade da sua conta e senha" />
          <BulletItem text="As imagens enviadas para identificação devem ser de sua propriedade ou de domínio público" />
          <BulletItem text="É proibido o uso do aplicativo para atividades ilegais ou que violam direitos de terceiros" />
        </CardSection>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  scrollContent: { 
    paddingHorizontal: 25, 
    paddingBottom: 60, 
    paddingTop: 10 
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    // Sombra leve para o modo Light
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    marginLeft: 12 
  },
  cardDescription: { 
    fontSize: 14, 
    lineHeight: 20, 
    marginBottom: 15 
  },
  bulletRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 15 
  },
  bulletText: { 
    fontSize: 13, 
    marginLeft: 12, 
    flex: 1, 
    lineHeight: 18 
  },
});