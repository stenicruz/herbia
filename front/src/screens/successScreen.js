import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CircleCheck, ChevronLeft, ArrowRight, ShieldCheck } from 'lucide-react-native';

export default function SuccessScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header com botão voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={styles.backButtonCircle}>
          <ChevronLeft color="#1B1919" size={24} />
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Ícone Estático com Efeito Glow */}
        <View style={styles.iconOuterRing}>
          <View style={styles.iconMiddleRing}>
            <View style={styles.iconInnerCircle}>
              <CircleCheck color="#FFF" size={90} strokeWidth={1.5} />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Senha Alterada!</Text>
        <Text style={styles.subtitle}>
          Sua senha foi redefinida com sucesso. Agora você pode fazer login.
        </Text>

        {/* Card de Status */}
        <View style={styles.statusCard}>
          <View style={styles.shieldIconContainer}>
            <ShieldCheck color="#47e426" size={24} />
          </View>
          <View>
            <Text style={styles.statusTitle}>Conta Protegida</Text>
            <Text style={styles.statusSubtitle}>Última atualização: agora mesmo</Text>
          </View>
        </View>

        {/* Botão Principal */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Ir para Login</Text>
          <ArrowRight color="#1B1919" size={20} style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  backButton: { paddingHorizontal: 25, marginTop: 55 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 30, justifyContent: 'center', paddingBottom: 100, },
  iconOuterRing: {
    width: 120,
    height: 120,
    borderRadius: 85,
    backgroundColor: 'rgba(70, 228, 38, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInnerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#47e426',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1C1E', marginTop: 30, marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#6C7278', textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  statusCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F9F0',
    width: '100%',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 60,
  },
  shieldIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#D7F2D7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statusTitle: { fontSize: 16, fontWeight: '700', color: '#1A1C1E' },
  statusSubtitle: { fontSize: 13, color: '#6C7278' },
  button: { 
    backgroundColor: '#47e426', 
    width: '100%', 
    height: 60, 
    borderRadius: 18, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  buttonText: { color: '#1B1919', fontSize: 18, fontWeight: 'bold' }
});