import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList,
  Modal, TextInput, Pressable, KeyboardAvoidingView, Platform,
  Image, StatusBar, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, ConfirmationModal } from '../components/central';
import adminService from '../services/adminService';

const ACTIVE_GREEN = '#47e426';

export default function CulturesScreen() {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  // Modal adicionar
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState(null);

  // Modal editar
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCulture, setSelectedCulture] = useState(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState(null);

  // Modal eliminar
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadCultures();
  }, []);

  const loadCultures = async () => {
    try {
      setLoading(true);
      const data = await adminService.listarCulturas();
      setCultures(data);
    } catch (err) {
      Alert.alert("Erro", err.error || "Não foi possível carregar as culturas.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria.");
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) return result.assets[0].uri;
    return null;
  };

  const handleAdd = async () => {
    if (!newName.trim()) {
      Alert.alert("Atenção", "Insere o nome da cultura.");
      return;
    }
    try {
      setSaving(true);
      await adminService.criarCultura(newName.trim(), newImage);
      setNewName('');
      setNewImage(null);
      setAddModalVisible(false);
      await loadCultures();
    } catch (err) {
      Alert.alert("Erro", err.error || "Não foi possível criar a cultura.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditOpen = (culture) => {
    setSelectedCulture(culture);
    setEditName(culture.nome);
    setEditImage(null);
    setEditModalVisible(true);
  };

  const handleEdit = async () => {
    if (!editName.trim()) {
      Alert.alert("Atenção", "Insere o nome da cultura.");
      return;
    }
    try {
      setSaving(true);
      await adminService.editarCultura(selectedCulture.id, editName.trim(), editImage);
      setEditModalVisible(false);
      await loadCultures();
    } catch (err) {
      Alert.alert("Erro", err.error || "Não foi possível editar a cultura.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePress = (id) => {
    setDeleteId(id);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteModalVisible(false);
      await adminService.eliminarCultura(deleteId);
      await loadCultures();
    } catch (err) {
      Alert.alert("Erro", err.error || "Não foi possível eliminar a cultura.");
    }
  };

  const filtradas = cultures.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.cultureItem} onPress={() => handleEditOpen(item)}>
      <View style={[styles.cultureImageWrapper, { borderColor: isDarkMode ? '#1A2E1A' : '#3D522C' }]}>
        {item.imagem_url ? (
          <Image source={{ uri: item.imagem_url }} style={styles.cultureImage} />
        ) : (
          <View style={[styles.cultureImagePlaceholder, { backgroundColor: isDarkMode ? '#1A1D19' : '#E1F2FF' }]} />
        )}
      </View>
      <Text style={[styles.cultureName, { color: currentTheme.textPrimary }]}>{item.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Gerenciar Culturas" />

      <View style={[styles.searchContainer, {
        backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
        borderColor: isDarkMode ? '#333' : '#E0EEDF'
      }]}>
        <MaterialCommunityIcons name="magnify" size={24} color={isDarkMode ? '#AAA' : '#666'} />
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

          {loading ? (
            <ActivityIndicator size="large" color={ACTIVE_GREEN} style={{ marginTop: 30 }} />
          ) : filtradas.length === 0 ? (
            <Text style={[styles.emptyText, { color: isDarkMode ? '#444' : '#999' }]}>
              Nenhuma cultura encontrada.
            </Text>
          ) : (
            <FlatList
              data={filtradas}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.gridRow}
            />
          )}
        </ScrollView>
      </View>

      {/* MODAL ADICIONAR */}
      <Modal animationType="slide" transparent visible={addModalVisible}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <Pressable style={styles.modalOverlayInner} onPress={() => setAddModalVisible(false)}>
            <Pressable style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]} onPress={e => e.stopPropagation()}>
              <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>Adicionar Cultura</Text>

              <TouchableOpacity
                style={[styles.uploadArea, {
                  backgroundColor: isDarkMode ? '#121411' : '#F8FFF5',
                  borderColor: isDarkMode ? '#333' : ACTIVE_GREEN
                }]}
                onPress={async () => {
                  const uri = await pickImage();
                  if (uri) setNewImage(uri);
                }}
              >
                {newImage ? (
                  <Image source={{ uri: newImage }} style={styles.previewImage} />
                ) : (
                  <>
                    <View style={[styles.cameraIconCircle, { backgroundColor: isDarkMode ? '#1A2E1A' : '#D4FFCC' }]}>
                      <Camera color={ACTIVE_GREEN} size={32} />
                    </View>
                    <Text style={[styles.uploadText, { color: isDarkMode ? '#AAA' : '#555' }]}>
                      Toca para escolher imagem
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#666' }]}>Nome da Cultura</Text>
                <View style={[styles.inputWrapper, { borderColor: isDarkMode ? '#333' : '#EEE' }]}>
                  <TextInput
                    placeholder="Ex: Tomateiro"
                    placeholderTextColor={isDarkMode ? "#555" : "#BBB"}
                    style={[styles.input, { color: currentTheme.textPrimary }]}
                    value={newName}
                    onChangeText={setNewName}
                  />
                </View>
              </View>

              {saving ? (
                <ActivityIndicator size="large" color={ACTIVE_GREEN} style={{ marginVertical: 10 }} />
              ) : (
                <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                  <Text style={styles.saveBtnText}>Salvar</Text>
                </TouchableOpacity>
              )}
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL EDITAR */}
      <Modal animationType="slide" transparent visible={editModalVisible}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <Pressable style={styles.modalOverlayInner} onPress={() => setEditModalVisible(false)}>
            <Pressable style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]} onPress={e => e.stopPropagation()}>
              <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>Editar Cultura</Text>

              <TouchableOpacity
                style={[styles.editImageContainer, { backgroundColor: isDarkMode ? '#121411' : '#F0F0F0' }]}
                onPress={async () => {
                  const uri = await pickImage();
                  if (uri) setEditImage(uri);
                }}
              >
                <Image
                  source={{ uri: editImage || selectedCulture?.imagem_url || 'https://via.placeholder.com/300' }}
                  style={styles.editImage}
                  resizeMode="cover"
                />
                <View style={styles.cameraEditOverlay}>
                  <Camera color="#FFF" size={24} />
                </View>
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#666' }]}>Nome da Cultura</Text>
                <View style={[styles.inputWrapper, { borderColor: isDarkMode ? '#333' : '#EEE' }]}>
                  <TextInput
                    placeholderTextColor={isDarkMode ? "#555" : "#BBB"}
                    style={[styles.input, { color: currentTheme.textPrimary }]}
                    value={editName}
                    onChangeText={setEditName}
                  />
                </View>
              </View>

              {saving ? (
                <ActivityIndicator size="large" color={ACTIVE_GREEN} style={{ marginVertical: 10 }} />
              ) : (
                <>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleEdit}>
                    <Text style={styles.saveBtnText}>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => {
                      setEditModalVisible(false);
                      handleDeletePress(selectedCulture.id);
                    }}
                  >
                    <Text style={styles.deleteBtnText}>Eliminar</Text>
                  </TouchableOpacity>
                </>
              )}
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <ConfirmationModal
        visible={deleteModalVisible}
        title="Eliminar Cultura?"
        description="Isto vai apagar também todas as doenças associadas a esta cultura."
        confirmText="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  addBtn: {
    backgroundColor: ACTIVE_GREEN, height: 45, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginVertical: 20, marginBottom: 40
  },
  addBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 15, fontWeight: '600' },
  gridRow: { justifyContent: 'space-between', marginBottom: 25 },
  cultureItem: { alignItems: 'center', width: '30%' },
  cultureImageWrapper: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 2,
    overflow: 'hidden', marginBottom: 8
  },
  cultureImage: { width: '100%', height: '100%' },
  cultureImagePlaceholder: { flex: 1 },
  cultureName: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  searchContainer: {
    width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, height: 50,
    marginBottom: 0, marginTop: 20
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  modalOverlayInner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: {
    width: '88%', borderRadius: 30, padding: 25,
    alignItems: 'center', elevation: 10
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  uploadArea: {
    width: '100%', height: 160, borderRadius: 20, borderStyle: 'dashed',
    borderWidth: 1.5, justifyContent: 'center', alignItems: 'center',
    marginBottom: 20, overflow: 'hidden'
  },
  previewImage: { width: '100%', height: '100%' },
  cameraIconCircle: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center'
  },
  uploadText: { fontSize: 13, textAlign: 'center', marginTop: 12, paddingHorizontal: 20 },
  editImageContainer: {
    width: '100%', height: 180, borderRadius: 20,
    overflow: 'hidden', marginBottom: 20, position: 'relative'
  },
  editImage: { width: '100%', height: '100%' },
  cameraEditOverlay: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)', width: 42, height: 42,
    borderRadius: 21, justifyContent: 'center', alignItems: 'center'
  },
  inputGroup: { width: '100%', marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderRadius: 15, paddingHorizontal: 15, height: 55
  },
  input: { flex: 1 },
  saveBtn: {
    backgroundColor: ACTIVE_GREEN, width: '100%', height: 45,
    borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 12
  },
  saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  deleteBtn: {
    backgroundColor: '#CC0000', width: '100%', height: 45,
    borderRadius: 15, justifyContent: 'center', alignItems: 'center'
  },
  deleteBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
});