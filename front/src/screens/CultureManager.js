import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList, Modal, TextInput, Pressable, KeyboardAvoidingView, Platform, Image, StatusBar 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Home, Users, Leaf, User as UserIcon, Camera 
} from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/AppHeader';

const ACTIVE_GREEN = '#47e426';


export default function CulturesScreen() {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const insets = useSafeAreaInsets();
  
  const [search, setSearch] = useState('');

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
      <View style={[styles.cultureImageWrapper, { borderColor: isDarkMode ? '#1A2E1A' : '#3D522C' }]}>
        <View style={[styles.cultureImagePlaceholder, { backgroundColor: isDarkMode ? '#1A1D19' : '#E1F2FF' }]} />
      </View>
      <Text style={[styles.cultureName, { color: currentTheme.textPrimary }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <AppHeader
      title={'Gerenciar Culturas'}/>
      
      <View style={[
        styles.searchContainer, 
        { 
          backgroundColor: isDarkMode ? '#1A1D19' : '#FFF', 
          borderColor: isDarkMode ? '#333' : '#E0EEDF' 
        }
      ]}>
        <MaterialCommunityIcons 
          name="magnify" 
          size={24} 
          color={isDarkMode ? '#AAA' : '#666'} 
        />
        <TextInput
          style={[styles.searchInput, { color: currentTheme.textPrimary }]}
          placeholder="Pesquisar cultura..."
          placeholderTextColor={isDarkMode ? '#555' : '#b1adad'}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      
      <View style={styles.mainContent}>

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

      {/* MODAL ADICIONAR */}
      <Modal animationType="fade" transparent={true} visible={addModalVisible} onRequestClose={() => setAddModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <Pressable style={styles.modalOverlayInner} onPress={() => setAddModalVisible(false)}>
            <Pressable style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]} onPress={e => e.stopPropagation()}>
              <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>Adicionar Cultura</Text>
              
              <TouchableOpacity style={[styles.uploadArea, { backgroundColor: isDarkMode ? '#121411' : '#F8FFF5', borderColor: isDarkMode ? '#333' : ACTIVE_GREEN }]}>
                <View style={[styles.cameraIconCircle, { backgroundColor: isDarkMode ? '#1A2E1A' : '#D4FFCC' }]}>
                  <Camera color={ACTIVE_GREEN} size={32} />
                  <View style={styles.plusBadge}><Text style={styles.plusText}>+</Text></View>
                </View>
                <Text style={[styles.uploadText, { color: isDarkMode ? '#AAA' : '#555' }]}>Upload da imagem da cultura</Text>
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#666' }]}>Nome da Cultura</Text>
                <View style={[styles.inputWrapper, { borderColor: isDarkMode ? '#333' : '#EEE' }]}>
                  <TextInput 
                    placeholder="Ex: Tomateiro" 
                    placeholderTextColor={isDarkMode ? "#555" : "#BBB"} 
                    style={[styles.input, { color: currentTheme.textPrimary }]} 
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={() => setAddModalVisible(false)}>
                <Text style={styles.saveBtnText}>Salvar</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL EDITAR */}
      <Modal animationType="fade" transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <Pressable style={styles.modalOverlayInner} onPress={() => setEditModalVisible(false)}>
            <Pressable style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]} onPress={e => e.stopPropagation()}>
              <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>Editar Cultura</Text>
              
              <View style={[styles.editImageContainer, { backgroundColor: isDarkMode ? '#121411' : '#F0F0F0' }]}>
                <Image 
                  source={{ uri: 'https://via.placeholder.com/300' }} // Substitua pelo seu asset
                  style={styles.editImage} 
                  resizeMode="cover" 
                />
                <TouchableOpacity style={styles.cameraEditOverlay}>
                  <Camera color="#FFF" size={24} />
                  <View style={styles.plusBadgeSmall}><Text style={styles.plusTextSmall}>+</Text></View>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#666' }]}>Nome da Cultura</Text>
                <View style={[styles.inputWrapper, { borderColor: isDarkMode ? '#333' : '#EEE' }]}>
                  <TextInput 
                    defaultValue="Tomateiro" 
                    placeholderTextColor={isDarkMode ? "#555" : "#BBB"} 
                    style={[styles.input, { color: currentTheme.textPrimary }]} 
                  />
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
  container: { flex: 1 },
  mainContent: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 60, marginTop: 10 },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 10 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  addBtn: { backgroundColor: ACTIVE_GREEN, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginVertical: 20, marginBottom: 40 },
  addBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  gridRow: { justifyContent: 'space-between', marginBottom: 25 },
  cultureItem: { alignItems: 'center', width: '30%' },
  cultureImageWrapper: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, padding: 3, marginBottom: 8 },
  cultureImagePlaceholder: { flex: 1, borderRadius: 40 },
  cultureName: { fontSize: 12, fontWeight: '500' },
  bottomNav: { flexDirection: 'row', width: '100%', borderTopWidth: 1, alignItems: 'center' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 11, marginTop: 4, color: '#999', fontWeight: '600' },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  modalOverlayInner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '88%', borderRadius: 30, padding: 25, alignItems: 'center', elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  
  editImageContainer: { width: '100%', height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 20, position: 'relative' },
  editImage: { width: '100%', height: '100%' },
  cameraEditOverlay: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  plusBadgeSmall: { position: 'absolute', bottom: 5, right: 5, backgroundColor: ACTIVE_GREEN, width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
  plusTextSmall: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  uploadArea: { width: '100%', height: 160, borderRadius: 20, borderStyle: 'dashed', borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  cameraIconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  plusBadge: { position: 'absolute', bottom: 2, right: 2, backgroundColor: ACTIVE_GREEN, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  plusText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  uploadText: { fontSize: 13, textAlign: 'center', marginTop: 12, paddingHorizontal: 20 },
  
  inputGroup: { width: '100%', marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 15, paddingHorizontal: 15, height: 55 },
  input: { flex: 1 },
  
searchContainer: {
  width:'90%',
  alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0EEDF',
    height: 50,
    marginBottom: 0,
    marginTop:20
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },

  saveBtn: { backgroundColor: ACTIVE_GREEN, width: '100%', height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  deleteBtn: { backgroundColor: '#CC0000', width: '100%', height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  deleteBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 }
});