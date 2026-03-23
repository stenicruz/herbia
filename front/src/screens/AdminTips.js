import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, 
  TextInput, Modal, Alert, KeyboardAvoidingView, Platform, StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Trash2, Send, X } from 'lucide-react-native';
import { Keyboard } from 'react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, ConfirmationModal } from '../components/central.js';
import adminService from '../services/adminService';

export default function AdminTipsScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const ACTIVE_GREEN = THEME.primary;

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTipId, setSelectedTipId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const handleEditOpen = (tip) => {
    setSelectedTip(tip);
    setEditTitle(tip.titulo);
    setEditContent(tip.conteudo);
    setEditModalVisible(true);
  };

  const handleEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      Alert.alert("Atenção", "Preencha o título e o conteúdo.");
      return;
    }
    try {
      setSaving(true);
      await adminService.editarDica(selectedTip.id, editTitle.trim(), editContent.trim());
      setEditModalVisible(false);
      await loadTips();
    } catch (err) {
      Alert.alert("Erro", err.error || "Não foi possível editar a dica.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Carrega as dicas do backend
  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    try {
      setLoading(true);
      const data = await adminService.listarDicas();
      setTips(data);
    } catch (err) {
      Alert.alert("Erro", err.error || "Não foi possível carregar as dicas.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTip = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      Alert.alert("Atenção", "Preencha o título e o conteúdo.");
      return;
    }

    try {
      setSaving(true);
      await adminService.criarDica(newTitle.trim(), newContent.trim());
      setNewTitle('');
      setNewContent('');
      setModalVisible(false);
      // Recarrega a lista
      await loadTips();
    } catch (err) {
      Alert.alert("Erro", err.error || "Não foi possível criar a dica.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id) => {
    setSelectedTipId(id);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteModalVisible(false);
      await adminService.eliminarDica(selectedTipId);
      // Recarrega a lista
      await loadTips();
    } catch (err) {
      Alert.alert("Erro", err.error || "Não foi possível eliminar a dica.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Gerenciar Dicas" showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoBox, { backgroundColor: isDarkMode ? '#121411' : '#F9F9F9', borderColor: isDarkMode ? '#1A2E1A' : '#EEE' }]}>
          <Text style={[styles.infoText, { color: isDarkMode ? '#AAA' : '#666' }]}>
            Estas dicas são exibidas na tela inicial dos Usuários para auxiliar no manejo das culturas.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addRectBtn, { backgroundColor: ACTIVE_GREEN }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus color="#FFF" size={22} />
          <Text style={styles.addRectBtnText}>Adicionar Nova Dica</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={ACTIVE_GREEN} style={{ marginTop: 30 }} />
        ) : tips.length === 0 ? (
          <Text style={[styles.emptyText, { color: isDarkMode ? '#444' : '#999' }]}>
            Nenhuma dica cadastrada ainda.
          </Text>
        ) : (
          tips.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.tipCard, { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#1A2E1A' : '#F2F2F2' }]}
              onPress={() => handleEditOpen(item)}
              activeOpacity={0.8}
            >
              <View style={styles.tipHeader}>
                <Text style={[styles.tipTitle, { color: currentTheme.textPrimary }]}>{item.titulo}</Text>
                <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteBtn}>
                  <Trash2 color="#FF5252" size={20} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.tipDescription, { color: isDarkMode ? '#BBB' : '#555' }]}>{item.conteudo}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal de Cadastro */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={[
            styles.modalContent, 
            { 
              backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
              paddingBottom: keyboardVisible ? 370 : 70  // ✅ dinâmico
            }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>Nova Dica</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color={isDarkMode ? "#AAA" : "#666"} size={24} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: isDarkMode ? '#121411' : '#F5F5F5', color: currentTheme.textPrimary }]}
              placeholder="Título da Dica"
              value={newTitle}
              onChangeText={setNewTitle}
              placeholderTextColor={isDarkMode ? "#555" : "#AAA"}
            />

            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: isDarkMode ? '#121411' : '#F5F5F5', color: currentTheme.textPrimary }]}
              placeholder="Descreva a dica detalhadamente..."
              value={newContent}
              onChangeText={setNewContent}
              multiline
              placeholderTextColor={isDarkMode ? "#555" : "#AAA"}
            />

            {saving ? (
              <ActivityIndicator size="large" color={ACTIVE_GREEN} style={{ marginVertical: 15 }} />
            ) : (
              <TouchableOpacity style={[styles.publishBtn, { backgroundColor: ACTIVE_GREEN }]} onPress={handleAddTip}>
                <Send color="#FFF" size={20} />
                <Text style={styles.publishBtnText}>Publicar agora</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal de Edição */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={[
            styles.modalContent, 
            { 
              backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
              paddingBottom: keyboardVisible ? 370 : 70  // ✅ dinâmico
            }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>Editar Dica</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <X color={isDarkMode ? "#AAA" : "#666"} size={24} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: isDarkMode ? '#121411' : '#F5F5F5', color: currentTheme.textPrimary }]}
              placeholder="Título da Dica"
              value={editTitle}
              onChangeText={setEditTitle}
              placeholderTextColor={isDarkMode ? "#555" : "#AAA"}
            />

            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: isDarkMode ? '#121411' : '#F5F5F5', color: currentTheme.textPrimary }]}
              placeholder="Conteúdo da dica..."
              value={editContent}
              onChangeText={setEditContent}
              multiline
              placeholderTextColor={isDarkMode ? "#555" : "#AAA"}
            />

            {saving ? (
              <ActivityIndicator size="large" color={ACTIVE_GREEN} style={{ marginVertical: 15 }} />
            ) : (
              <TouchableOpacity style={[styles.publishBtn, { backgroundColor: ACTIVE_GREEN }]} onPress={handleEdit}>
                <Send color="#FFF" size={20} />
                <Text style={styles.publishBtnText}>Guardar alterações</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ConfirmationModal
        visible={deleteModalVisible}
        title="Eliminar Dica"
        description="Deseja remover esta dica? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onClose={() => setDeleteModalVisible(false)}
        confirmText="Eliminar"
        variant="danger"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  infoBox: { padding: 18, borderRadius: 20, marginBottom: 10, borderWidth: 1 },
  infoText: { fontSize: 13, textAlign: 'center', lineHeight: 20, fontWeight: '500' },
  addRectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 18, borderRadius: 20, marginBottom: 30, gap: 10,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8
  },
  addRectBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 15, fontWeight: '600' },
  tipCard: {
    borderRadius: 22, padding: 20, marginBottom: 16, borderWidth: 1,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10
  },
  tipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tipTitle: { fontSize: 18, fontWeight: '800', flex: 1, marginRight: 10 },
  deleteBtn: { padding: 6 },
  tipDescription: { fontSize: 14, lineHeight: 24, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 30, },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 24, fontWeight: '800' },
  input: { borderRadius: 18, padding: 20, fontSize: 16, marginBottom: 18, fontWeight: '500' },
  textArea: { height: 150, textAlignVertical: 'top' },
  publishBtn: {
    borderRadius: 18, padding: 20, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 10
  },
  publishBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});