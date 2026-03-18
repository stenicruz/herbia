import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

import { ConfirmationModal } from '../components/ConfirmationModal';

export default function ConfirmPhoto({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { imageUri } = route.params;

  // Estados para controle da lógica
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleStartDiagnosis = async () => {
    setLoading(true);

    try {
      // SIMULAÇÃO: Espera 2 segundos e gera um score de confiança
      // Em produção, aqui você faria o fetch para sua API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockConfidence = Math.random(); // Gera entre 0 e 1
      console.log("Confiança da IA:", mockConfidence.toFixed(2));

      if (mockConfidence < 0.4) {
        // Se a confiança for menor que 40%, assumimos que não é uma planta ou está ruim
        setShowErrorModal(true);
      } else {
        // Sucesso: Segue para a tela de resultados
        navigation.navigate('DiagnosticResult', { imageUri, confidence: mockConfidence });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Cabeçalho com botão de fechar/voltar */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <X color="#FFF" size={30} />
        </TouchableOpacity>
      </View>

      {/* Visualização da Imagem selecionada */}
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: imageUri }} 
          style={styles.image} 
          resizeMode="contain" 
        />
      </View>

      {/* Footer com o botão de confirmação */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 40 }]}>
        {loading ? (
          <ActivityIndicator size="large" color="#32D74B" />
        ) : (
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleStartDiagnosis}
          >
            <Check color="#FFF" size={45} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

        <ConfirmationModal 
        visible={showErrorModal}
        variant='primary'
        title="Não conseguimos identificar"
        description="Certifique-se de que a foto está nítida e foca em uma planta. Deseja tentar novamente?"
        confirmText="Tirar outra foto"
        cancelText="Ir para Home"
        onConfirm={() => {
          setShowErrorModal(false);
          navigation.goBack(); // Volta para a câmera
        }}
        onClose={() => {
          setShowErrorModal(false);
          navigation.navigate('Main');
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fundo preto total como na imagem
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    zIndex: 10,
  },
  closeButton: {
    padding: 10,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  image: {
    width: '100%',
    height: '500', // Deixa espaço para os botões
    borderRadius: 8,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    width: 75,
    height: 75,
    borderRadius: 45,
    backgroundColor: '#32D74B', // Verde vibrante da imagem
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra para o botão destacar
    elevation: 8,
    shadowColor: '#32D74B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});