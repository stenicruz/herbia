import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { ConfirmationModal } from '../components/central';
import plantService from '../services/plantService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfirmPhoto({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { imageUri } = route.params;
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

const handleStartDiagnosis = async () => {
  setLoading(true);
  try {
    const resultado = await plantService.analisarPlanta(imageUri);

    const token = await AsyncStorage.getItem('@Herbia:token');
    const isLoggedIn = !!token;

    // Caso 1: IA identificou como Desconhecido (planta não suportada)
    // → vai para resultado independentemente da confiança
    if (resultado.classe_ia === 'Desconhecido') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'DiagnosticResult', params: { resultado, imageUri, isLoggedIn } }],
      });
      return;
    }

    // Caso 2: Baixa confiança (provavelmente não é uma planta)
    // → mostra modal de erro
    if (resultado.precisao < 70) {
      setShowErrorModal(true);
      return;
    }

    // Caso 3: Identificação normal com boa confiança
    navigation.reset({
      index: 0,
      routes: [{ name: 'DiagnosticResult', params: { resultado, imageUri, isLoggedIn } }],
    });

  } catch (error) {
    Alert.alert("Erro", "Não foi possível conectar ao servidor de análise. Tente novamente.");
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <X color="#FFF" size={30} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 40 }]}>
        {loading ? (
          <ActivityIndicator size="large" color="#47e426" />
        ) : (
          <TouchableOpacity style={styles.confirmButton} onPress={handleStartDiagnosis}>
            <Check color="#FFF" size={45} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      <ConfirmationModal
        visible={showErrorModal}
        variant='primary'
        title="Não conseguimos identificar"
        description="Certifique-se de que a foto está nítida e foca numa planta. Deseja tentar novamente?"
        confirmText="Tirar outra foto"
        onConfirm={() => { setShowErrorModal(false); navigation.goBack(); }}
        onClose={() => { setShowErrorModal(false); navigation.navigate('Main'); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { width: '100%', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'flex-start', zIndex: 10 },
  closeButton: { padding: 10 },
  imageWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  footer: { justifyContent: 'center', alignItems: 'center' },
  confirmButton: {
    width: 75, height: 75, borderRadius: 45,
    backgroundColor: '#47e426', justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#47e426',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10,
  },
});