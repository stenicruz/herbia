import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Gavel, 
  Lock, 
  CheckCircle2,
  Home,
  History,
  Camera,
  User
} from 'lucide-react-native';

export default function TermsOfUseScreen({ navigation }) {
  const activeColor = '#47e426';

  const CardSection = ({ icon: Icon, title, children }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon color={activeColor} size={24} fill={activeColor} fillOpacity={0.1} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const BulletItem = ({ text }) => (
    <View style={styles.bulletRow}>
      <CheckCircle2 color={activeColor} size={18} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#666" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Termos de Uso</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Bloco 1: Aceitação */}
        <CardSection icon={Gavel} title="Aceitação de Termos">
          <Text style={styles.cardDescription}>
            Ao criar uma conta ou utilizar as ferramentas de identificação de doenças em plantas, você declara ter lido, compreendido e aceitado todos os termos. Se não concordar com qualquer parte, por favor, interrompa o uso do aplicativo imediatamente.
          </Text>
        </CardSection>

        {/* Bloco 2: Privacidade */}
        <CardSection icon={Lock} title="Privacidade">
          <Text style={styles.cardDescription}>
            Sua privacidade é nossa prioridade. as imagens enviadas são processadas anonimamente para melhorar nossos algoritmos de reconhecimento.
          </Text>
          <BulletItem text="Criptografia de ponta a ponta" />
          <BulletItem text="Você mantém a propriedade intelectual de suas fotos" />
        </CardSection>

        {/* Bloco 3: Uso Responsável */}
        <CardSection icon={Lock} title="Uso Responsável">
          <BulletItem text="Você é responsável por manter a confidencialidade da sua conta e senha" />
          <BulletItem text="As imagens enviadas para identificação devem ser de sua propriedade ou de domínio público" />
          <BulletItem text="é proibido o uso do aplicativo para actividades ilegais ou que violam direitos de terceiros" />
        </CardSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333', flex: 1, marginLeft: 18, marginVertical: 20 },
  
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },

  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EBF9E8',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#1B1919', marginLeft: 12 },
  cardDescription: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 15 },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  bulletText: { fontSize: 13, color: '#444', marginLeft: 12, flex: 1, lineHeight: 18 },

});