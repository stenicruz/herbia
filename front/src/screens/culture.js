import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList, Modal, TextInput, Pressable, KeyboardAvoidingView, Platform, Image 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Home, Users, Leaf, User as UserIcon, Camera 
} from 'lucide-react-native';

const ACTIVE_GREEN = '#47e426';

export default function CulturesScreen() {
  const insets = useSafeAreaInsets();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCulture, setSelectedCulture] = useState(null);

  const CULTURES_DATA = Array.from({ length: 9 }, (_, i) => ({
    id: i.toString(),
    name: 'Cultura'
  }));

  const handleEditCulture = (culture) => {
    setSelectedCulture(culture);
    setEditModalVisible(true);
  };

  const renderCultureItem = ({ item }) => (
    <TouchableOpacity style={styles.cultureItem} onPress={() => handleEditCulture(item)}>
      <View style={styles.cultureImageWrapper}>
        <View style={styles.cultureImagePlaceholder} />
      </View>
      <Text style={styles.cultureName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Culturas</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.addBtn} onPress={() => setAddModalVisible(true)}>
            <Text style={styles.addBtnText}>Adicionar nova Cultura</Text>
          </TouchableOpacity>

          <FlatList
            data={CULTURES_DATA}
            renderItem={renderCultureItem}
            keyExtractor={item => item.id}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContainer}
          />
        </ScrollView>
      </View>

      {/* MENU INFERIOR */}
      <View style={[styles.bottomNav, { height: 70 + insets.bottom, paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
        <TouchableOpacity style={styles.navItem}><Home color="#999" size={24} /><Text style={styles.navText}>Casa</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><Users color="#999" size={24} /><Text style={styles.navText}>Users</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><Leaf color={ACTIVE_GREEN} size={24} /><Text style={[styles.navText, {color: ACTIVE_GREEN}]}>Culturas</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><UserIcon color="#999" size={24} /><Text style={styles.navText}>Perfil</Text></TouchableOpacity>
      </View>

      {/* MODAL ADICIONAR */}
      <Modal animationType="none" transparent={true} visible={addModalVisible} onRequestClose={() => setAddModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <Pressable style={styles.modalOverlayInner} onPress={() => setAddModalVisible(false)}>
            <Pressable style={styles.modalContainer} onPress={e => e.stopPropagation()}>
              <Text style={styles.modalTitle}>Adicionar Cultura</Text>
              <TouchableOpacity style={styles.uploadArea}>
                <View style={styles.cameraIconCircle}>
                  <Camera color={ACTIVE_GREEN} size={32} />
                  <View style={styles.plusBadge}><Text style={styles.plusText}>+</Text></View>
                </View>
                <Text style={styles.uploadText}>Upload da imagem da cultura</Text>
              </TouchableOpacity>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome da Cultura</Text>
                <View style={styles.inputWrapper}>
                  <TextInput placeholder="Ex: Tomateiro" placeholderTextColor="#BBB" style={styles.input} />
                </View>
              </View>
              <TouchableOpacity style={styles.saveBtn} onPress={() => setAddModalVisible(false)}>
                <Text style={styles.saveBtnText}>Salvar</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL EDITAR (CONFORME IMAGEM) */}
      {/* MODAL EDITAR */}
<Modal animationType="none" transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
    <Pressable style={styles.modalOverlayInner} onPress={() => setEditModalVisible(false)}>
      <Pressable style={styles.modalContainer} onPress={e => e.stopPropagation()}>
        <Text style={styles.modalTitle}>Editar Cultura</Text>
        
        {/* CONTAINER DA IMAGEM AJUSTADO */}
        <View style={styles.editImageContainer}>
          <Image 
            source={require('../../assets/check.jpg')} 
            style={styles.editImage} 
            resizeMode="cover" 
          />
          <TouchableOpacity style={styles.cameraEditOverlay}>
            <Camera color="#FFF" size={24} />
            <View style={styles.plusBadgeSmall}><Text style={styles.plusTextSmall}>+</Text></View>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome da Cultura</Text>
          <View style={styles.inputWrapper}>
            <TextInput defaultValue="Tomateiro" placeholderTextColor="#BBB" style={styles.input} />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={() => setEditModalVisible(false)}>
          <Text style={styles.saveBtnText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={() => setEditModalVisible(false)}>
          <Text style={styles.deleteBtnText}>Deletar</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  </KeyboardAvoidingView>
</Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  mainContent: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 60, marginTop: 10 },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 10, color: '#333' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  addBtn: { backgroundColor: ACTIVE_GREEN, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginVertical: 20, marginBottom: 40 },
  addBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  gridRow: { justifyContent: 'space-between', marginBottom: 25 },
  cultureItem: { alignItems: 'center', width: '30%' },
  cultureImageWrapper: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#3D522C', padding: 3, marginBottom: 8 },
  cultureImagePlaceholder: { flex: 1, backgroundColor: '#E1F2FF', borderRadius: 40 },
  cultureName: { fontSize: 12, color: '#333', fontWeight: '500' },
  bottomNav: { flexDirection: 'row', width: '100%', borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#FFF', alignItems: 'center' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 11, marginTop: 4, color: '#999', fontWeight: '600' },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalOverlayInner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '88%', backgroundColor: '#FFF', borderRadius: 30, padding: 25, alignItems: 'center', elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, color: '#333' },
  
  // Imagem na Edição
  // Ajuste estas propriedades no seu StyleSheet
  editImageContainer: { 
    width: '100%', 
    height: 180, // Aumentei um pouco a altura para melhor visualização
    borderRadius: 20, 
    overflow: 'hidden', 
    marginBottom: 20, 
    position: 'relative',
    backgroundColor: '#F0F0F0' // Cor de fundo caso a imagem falhe
  },
  editImage: {
    width: '100%',
    height: '100%', // Agora a imagem ocupa todo o container
  },
  cameraEditOverlay: { 
    position: 'absolute', 
    bottom: 12, 
    right: 12, 
    backgroundColor: 'rgba(0,0,0,0.4)', // Leve transparência como na foto
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  plusBadgeSmall: { position: 'absolute', bottom: 8, right: 8, backgroundColor: ACTIVE_GREEN, width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
  plusTextSmall: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  uploadArea: { width: '100%', height: 160, borderRadius: 20, borderStyle: 'dashed', borderWidth: 1.5, borderColor: ACTIVE_GREEN, backgroundColor: '#F8FFF5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  cameraIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#D4FFCC', justifyContent: 'center', alignItems: 'center' },
  plusBadge: { position: 'absolute', bottom: 2, right: 2, backgroundColor: ACTIVE_GREEN, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#D4FFCC' },
  plusText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  uploadText: { fontSize: 13, color: '#555', textAlign: 'center', marginTop: 12, paddingHorizontal: 20 },
  
  inputGroup: { width: '100%', marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 15, paddingHorizontal: 15, height: 55 },
  input: { flex: 1, color: '#333' },
  
  saveBtn: { backgroundColor: ACTIVE_GREEN, width: '100%', height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  deleteBtn: { backgroundColor: '#CC0000', width: '100%', height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  deleteBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 }
});