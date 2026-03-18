import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, 
  TextInput, Modal, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, Trash2, Send, X 
} from 'lucide-react-native';

// Importando seus componentes
import { AppHeader, ConfirmationModal } from '../components/central.js';

const ACTIVE_GREEN = '#47e426';

export default function AdminTipsScreen({ navigation }) {
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Gerenciar Dicas" showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Estas dicas são exibidas na tela inicial dos Usuários para auxiliar no manejo das culturas.
          </Text>
        </View>

        {/* Botão de Adicionar Retangular - Logo abaixo da infoBox */}
        <TouchableOpacity 
          style={styles.addRectBtn} 
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus color="#FFF" size={22} />
          <Text style={styles.addRectBtnText}>Adicionar Nova Dica</Text>
        </TouchableOpacity>

        {tips.map((item) => (
          <View key={item.id} style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipTitle}>{item.title}</Text>
              <TouchableOpacity 
                onPress={() => confirmDelete(item.id)}
                style={styles.deleteBtn}
              >
                <Trash2 color="#FF4444" size={20} />
              </TouchableOpacity>
            </View>
            <Text style={styles.tipDescription}>{item.content}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Modal de Cadastro */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Dica</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#666" size={24} />
              </TouchableOpacity>
            </View>

            <TextInput 
              style={styles.input} 
              placeholder="Título da Dica"
              value={newTitle}
              onChangeText={setNewTitle}
              placeholderTextColor="#AAA"
            />

            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Descreva a dica detalhadamente..."
              value={newContent}
              onChangeText={setNewContent}
              multiline
              placeholderTextColor="#AAA"
            />

            <TouchableOpacity style={styles.publishBtn} onPress={handleAddTip}>
              <Send color="#FFF" size={20} />
              <Text style={styles.publishBtnText}>Publicar agora</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ConfirmationModal
        visible={deleteModalVisible}
        title="Eliminar Dica"
        message="Deseja remover esta dica? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onClose={() => setDeleteModalVisible(false)}
        confirmText="Eliminar"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  infoBox: { 
    backgroundColor: '#F9F9F9', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 10, // Menor para aproximar o botão
    borderWidth: 1, 
    borderColor: '#EEE'
  },
  infoText: { color: '#666', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  
  addRectBtn: {
    backgroundColor: ACTIVE_GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 15,
    marginBottom: 25,
    gap: 8,
    elevation: 2,
    shadowColor: ACTIVE_GREEN,
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  addRectBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  tipCard: { 
    backgroundColor: '#FFF', borderRadius: 20, padding: 18, marginBottom: 15,
    borderWidth: 1, borderColor: '#F2F2F2',
    elevation: 1
  },
  tipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tipTitle: { fontSize: 17, fontWeight: '800', color: '#1B1919', flex: 1, marginRight: 10 },
  deleteBtn: { padding: 4 },
  tipDescription: { fontSize: 14, color: '#555', lineHeight: 22 },

  // Estilos Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 70 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1B1919' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 15, padding: 18, fontSize: 16, color: '#333', marginBottom: 15 },
  textArea: { height: 130, textAlignVertical: 'top' },
  publishBtn: { 
    backgroundColor: ACTIVE_GREEN, borderRadius: 15, padding: 18, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10
  },
  publishBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});