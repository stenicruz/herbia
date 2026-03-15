import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Alert, Modal, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Zap, Image as ImageIcon, HelpCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function CameraScanner() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState('off');
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) return <View style={styles.container} />;
  
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 100 }}>
          Precisamos de acesso à câmera.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.captureButtonOuter}>
          <Text style={{ color: '#fff' }}>Permitir</Text>
        </TouchableOpacity>
      </View>
    );
  }

const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true, // Reativamos o editor nativo
    aspect: [1, 1],      // Forçar um quadrado ajuda a centralizar a UI longe das bordas
    quality: 1,
  });

  if (!result.canceled) {
    console.log("Imagem editada e pronta:", result.assets[0].uri);
    // Aqui segues para o diagnóstico
  }
  if (!result.canceled) {
  const uriOriginal = result.assets[0].uri;
  
  // Navega enviando a imagem
  navigation.navigate('ConfirmPhoto', { imageUri: uriOriginal });
}
};
  const takePicture = async () => {
  if (cameraRef.current) {
    const photo = await cameraRef.current.takePictureAsync();
    
    // Para a foto tirada também abrir o editor nativo:
    let editedPhoto = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      // Passamos a foto que acabámos de tirar como base
      base64: false,
    });
    
    if (!editedPhoto.canceled) {
       console.log("Foto editada:", editedPhoto.assets[0].uri);
    }
    if (!result.canceled) {
  const uriOriginal = result.assets[0].uri;
  
  // Navega enviando a imagem
  navigation.navigate('ConfirmPhoto', { imageUri: uriOriginal });
}
  }
};

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <CameraView 
        style={StyleSheet.absoluteFill} 
        facing="back" 
        // Alteração fundamental: enableTorch liga o LED de fato
        enableTorch={flash === 'on'} 
        ref={cameraRef}
      >
        <View style={styles.overlayContainer}>
          
          {/* Top Bar */}
          <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity><X color="#FFF" size={28} /></TouchableOpacity>
            
            {/* Lógica de interface do Flash */}
            <TouchableOpacity onPress={() => setFlash(prev => prev === 'off' ? 'on' : 'off')}>
              <Zap 
                color={flash === 'on' ? "#FFE600" : "#FFF"} 
                fill={flash === 'on' ? "#FFE600" : "transparent"} 
                size={28} 
              />
            </TouchableOpacity>
          </View>

          {/* Scanner Frame */}
          <View style={styles.scannerContainer}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          {/* Bottom Bar */}
          <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
            <TouchableOpacity style={styles.sideButton} onPress={pickImage}>
              <ImageIcon color="#FFF" size={32} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButtonOuter} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideButton} onPress={() => setModalVisible(true)}>
              <HelpCircle color="#FFF" size={32} />
            </TouchableOpacity>
          </View>

        </View>
      </CameraView>

      {/* MODAL DE DICAS */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setModalVisible(false)} 
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Dicas de diagnóstico</Text>
            
            <View style={styles.tipRow}>
              <Text style={styles.tipNumber}>1.</Text>
              <Text style={styles.tipText}>
                Aproxime-se da planta e certifique-se de enquadrar bem os danos.
              </Text>
            </View>

            <View style={styles.tipRow}>
              <Text style={styles.tipNumber}>2.</Text>
              <Text style={styles.tipText}>
                Certifique-se que a imagem esteja bem visível.
              </Text>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlayContainer: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 },
  scannerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scannerFrame: { width: width * 0.75, height: height * 0.45 },
  corner: { position: 'absolute', width: 45, height: 45, borderColor: '#FFF' },
  topLeft: { top: 0, left: 0, borderLeftWidth: 4, borderTopWidth: 4, borderTopLeftRadius: 25 },
  topRight: { top: 0, right: 0, borderRightWidth: 4, borderTopWidth: 4, borderTopRightRadius: 25 },
  bottomLeft: { bottom: 0, left: 0, borderLeftWidth: 4, borderBottomWidth: 4, borderBottomLeftRadius: 25 },
  bottomRight: { bottom: 0, right: 0, borderRightWidth: 4, borderBottomWidth: 4, borderBottomRightRadius: 25 },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  captureButtonOuter: { width: 84, height: 84, borderRadius: 42, borderWidth: 5, borderColor: '#4ADE80', justifyContent: 'center', alignItems: 'center' },
  captureButtonInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#4ADE80' },
  sideButton: { width: 60, height: 60, justifyContent: 'center', alignItems: 'center' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 30,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '100%',
  },
  tipNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  tipText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    flex: 1,
  },
});