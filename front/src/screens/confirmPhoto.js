import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function ConfirmPhoto({ route, navigation }) {
  const insets = useSafeAreaInsets();
  // Recebemos a URI da imagem vinda do Scanner (já recortada)
  const { imageUri } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Cabeçalho com botão de fechar/voltar */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.goBack()}
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
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => {
            console.log("Iniciando diagnóstico com:", imageUri);
            // Próximo passo: navegação para tela de processamento
          }}
        >
          <Check color="#FFF" size={45} strokeWidth={3} />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 10,
  },
  image: {
    width: '100%',
    height: '80%', // Deixa espaço para os botões
    borderRadius: 8,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    width: 90,
    height: 90,
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