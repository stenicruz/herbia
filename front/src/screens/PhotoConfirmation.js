import React from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';

// a imagem deve vir de uma outra tela.
const capturedPhoto = require('../../assets/check.jpg'); 

export default function PhotoConfirmationScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* Botão de Fechar (X) no topo esquerdo */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 10 : 0 }]}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation?.goBack()}
        >
          <X color="#FFF" size={28} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Área da Imagem Centralizada */}
      <View style={styles.imageContainer}>
        <Image 
          source={capturedPhoto} 
          style={styles.image} 
          resizeMode="cover" 
        />
      </View>

      {/* Botão de Confirmação (Check Verde) na parte inferior */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => {
            // Lógica para enviar a foto ou ir para o resultado
            console.log("Foto confirmada");
          }}
        >
          <Check color="#FFF" size={45} strokeWidth={2} />
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fundo preto total como no design
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
    // Se a imagem capturada for menor, você pode ajustar para conter:
    // resizeMode: 'contain'
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingTop: 40,
  },
  confirmButton: {
    width: 70,
    height: 70,
    borderRadius: 42.5,
    backgroundColor: '#47e426', // Verde vibrante Herbia
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra para dar profundidade
    elevation: 8,
    shadowColor: '#47e426',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});