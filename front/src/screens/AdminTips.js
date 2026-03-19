import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, 
  TextInput, Modal, Alert, KeyboardAvoidingView, Platform, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, Trash2, Send, X 
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, ConfirmationModal } from '../components/central.js';

export default function AdminTipsScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const ACTIVE_GREEN = THEME.primary;

  const [tips, setTips] = useState([
    { id: '1', title: 'Solo Ideal', content: 'Mantenha o solo úmido, mas nunca encharcado para evitar fungos nas raízes.' },
    { id: '2', title: 'Luz Solar', content: 'O tomateiro precisa de pelo menos 6 horas de sol direto por dia.' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedTipId, setSelectedTipId] = useState(null);

  const handleAddTip = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      Alert.alert("Atenção", "Preencha o título e o conteúdo.");
      return;
    }
    const tip = { id: Math.random().toString(), title: newTitle, content: newContent };
    setTips([tip, ...tips]);
    setNewTitle('');
    setNewContent('');
    setModalVisible(false);
  };

  const confirmDelete = (id) => {
    setSelectedTipId(id);
    setDeleteModalVisible(true);
  };

  const handleDelete = () => {
    setTips(tips.filter(t => t.id !== selectedTipId));
    setDeleteModalVisible(false);
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

        {tips.map((item) => (
          <View key={item.id} style={[styles.tipCard, { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#1A2E1A' : '#F2F2F2' }]}>
            <View style={styles.tipHeader}>
              <Text style={[styles.tipTitle, { color: currentTheme.textPrimary }]}>{item.title}</Text>
              <TouchableOpacity 
                onPress={() => confirmDelete(item.id)}
                style={styles.deleteBtn}
              >
                <Trash2 color="#FF5252" size={20} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.tipDescription, { color: isDarkMode ? '#BBB' : '#555' }]}>{item.content}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Modal de Cadastro */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]}>
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

            <TouchableOpacity style={[styles.publishBtn, { backgroundColor: ACTIVE_GREEN }]} onPress={handleAddTip}>
              <Send color="#FFF" size={20} />
              <Text style={styles.publishBtnText}>Publicar agora</Text>
            </TouchableOpacity>
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
  
  infoBox: { 
    padding: 18, 
    borderRadius: 20, 
    marginBottom: 10, 
    borderWidth: 1, 
  },
  infoText: { fontSize: 13, textAlign: 'center', lineHeight: 20, fontWeight: '500' },
  
  addRectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 20,
    marginBottom: 30,
    gap: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  addRectBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  tipCard: { 
    borderRadius: 22, 
    padding: 20, 
    marginBottom: 16,
    borderWidth: 1, 
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  tipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tipTitle: { fontSize: 18, fontWeight: '800', flex: 1, marginRight: 10 },
  deleteBtn: { padding: 6 },
  tipDescription: { fontSize: 14, lineHeight: 24, fontWeight: '500' },

  // Estilos Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 30, paddingBottom: 60 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 24, fontWeight: '800' },
  input: { borderRadius: 18, padding: 20, fontSize: 16, marginBottom: 18, fontWeight: '500' },
  textArea: { height: 150, textAlignVertical: 'top' },
  publishBtn: { 
    borderRadius: 18, 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 12,
    marginTop: 10
  },
  publishBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});