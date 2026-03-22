import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ScrollView, KeyboardAvoidingView, Platform, StatusBar, Alert, Modal, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/AppHeader';

const ACTIVE_GREEN = '#47e426';

export default function EditDisease({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  
  const [nome, setNome] = useState('');
  const [labelIA, setLabelIA] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prevencao, setPrevencao] = useState('');
  const [tratamentoCaseiro, setTratamentoCaseiro] = useState('');
  const [tratamentoConvencional, setTratamentoConvencional] = useState('');

  const [culturaSelecionada, setCulturaSelecionada] = useState(null);
  const [modalCulturaVisible, setModalCulturaVisible] = useState(false);

  // --- NOVO ESTADO PARA O CAMPO ESTADO ---
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);
  const [modalEstadoVisible, setModalEstadoVisible] = useState(false);

  const listaCulturas = [
    { id: '1', name: 'Tomateiro' },
    { id: '2', name: 'Mandioca' },
    { id: '3', name: 'Batateira' },
    { id: '4', name: 'Milho' },
  ];

  // Opções para o novo seletor
  const listaEstados = [
    { id: 'saudavel', name: 'Saudável', icon: 'check-circle-outline' },
    { id: 'doente', name: 'Doente', icon: 'alert-circle-outline' },
  ];

  const handleSave = () => {
    // Adicionada validação do estado selecionado
    if (!nome || !culturaSelecionada || !labelIA || !estadoSelecionado) {
      Alert.alert("Erro", "Preencha Nome, Cultura, Estado e Label da IA.");
      return;
    }
    Alert.alert("Sucesso", "Registro concluído!");
    navigation.goBack();
  };

  const InputField = ({ label, value, onChange, placeholder, multiline = false, icon }) => (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <MaterialCommunityIcons name={icon} size={18} color={ACTIVE_GREEN} />
        <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#555' }]}>{label}</Text>
      </View>
      <View style={[
        styles.inputWrapper, 
        { 
          backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
          borderColor: isDarkMode ? '#333' : '#E0EEDF',
          minHeight: multiline ? 120 : 55,
        }
      ]}>
        <TextInput
          style={[styles.input, { color: currentTheme.textPrimary }]}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#444' : '#BBB'}
          value={value}
          onChangeText={onChange}
          multiline={multiline}
          scrollEnabled={multiline}
          numberOfLines={multiline ? 4 : 1}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Configurar Registro" />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <InputField label="Nome de Exibição" icon="virus-outline" placeholder="Ex: Ferrugem Tardia" value={nome} onChange={setNome} />

          {/* SELETOR DE CULTURA */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MaterialCommunityIcons name="sprout" size={18} color={ACTIVE_GREEN} />
              <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#555' }]}>Cultura (Planta)</Text>
            </View>
            <TouchableOpacity 
              style={[styles.inputWrapper, styles.selectTrigger, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF', borderColor: isDarkMode ? '#333' : '#E0EEDF' }]}
              onPress={() => setModalCulturaVisible(true)}
            >
              <Text style={{ color: culturaSelecionada ? currentTheme.textPrimary : '#BBB' }}>
                {culturaSelecionada ? culturaSelecionada.name : "Selecione uma cultura"}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color={ACTIVE_GREEN} />
            </TouchableOpacity>
          </View>

          {/* --- NOVO SELETOR DE ESTADO --- */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MaterialCommunityIcons name="Shield-star-outline" size={18} color={ACTIVE_GREEN} />
              <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#555' }]}>Estado da Planta</Text>
            </View>
            <TouchableOpacity 
              style={[styles.inputWrapper, styles.selectTrigger, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF', borderColor: isDarkMode ? '#333' : '#E0EEDF' }]}
              onPress={() => setModalEstadoVisible(true)}
            >
              <Text style={{ color: estadoSelecionado ? currentTheme.textPrimary : '#BBB' }}>
                {estadoSelecionado ? estadoSelecionado.name : "Saudável ou Doente?"}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color={ACTIVE_GREEN} />
            </TouchableOpacity>
          </View>

          <InputField label="Label da IA (Chave única)" icon="robot-outline" placeholder="Ex: Tomate__Ferrugem_Precoce" value={labelIA} onChange={setLabelIA} />
          <InputField label="Descrição" icon="text-search" placeholder="Sintomas ou estado geral..." value={descricao} onChange={setDescricao} multiline />
          <InputField label="Prevenção / Cuidados" icon="shield-check-outline" placeholder="Como evitar ou manter..." value={prevencao} onChange={setPrevencao} multiline />
          <InputField label="Tratamento Caseiro / Dica" icon="leaf" placeholder="Alternativa orgânica..." value={tratamentoCaseiro} onChange={setTratamentoCaseiro} multiline />
          <InputField label="Tratamento Convencional" icon="flask-outline" placeholder="Produtos químicos..." value={tratamentoConvencional} onChange={setTratamentoConvencional} multiline />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Salvar Registro</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL CULTURA (Mantido) */}
      <Modal visible={modalCulturaVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>Selecione a Cultura</Text>
            <View style={styles.listContainer}> 
              <FlatList
                data={listaCulturas}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.modalOption, culturaSelecionada?.id === item.id && { backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9' }]} 
                    onPress={() => { setCulturaSelecionada(item); setModalCulturaVisible(false); }}
                  >
                    <Text style={[styles.modalOptionText, { color: currentTheme.textPrimary }, culturaSelecionada?.id === item.id && { color: ACTIVE_GREEN, fontWeight: 'bold' }]}>
                      {item.name}
                    </Text>
                    {culturaSelecionada?.id === item.id && <MaterialCommunityIcons name="check" size={20} color={ACTIVE_GREEN} />}
                  </TouchableOpacity>
                )}
              />
            </View>
            <TouchableOpacity style={styles.closeModal} onPress={() => setModalCulturaVisible(false)}>
              <Text style={styles.closeModalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- NOVO MODAL ESTADO --- */}
      <Modal visible={modalEstadoVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>Estado da Planta</Text>
            <View style={{ marginBottom: 10 }}> 
              {listaEstados.map((item) => (
                <TouchableOpacity 
                  key={item.id}
                  style={[styles.modalOption, estadoSelecionado?.id === item.id && { backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9' }]} 
                  onPress={() => { setEstadoSelecionado(item); setModalEstadoVisible(false); }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <MaterialCommunityIcons name={item.icon} size={22} color={item.id === 'saudavel' ? '#4CAF50' : '#F44336'} />
                    <Text style={[styles.modalOptionText, { color: currentTheme.textPrimary }, estadoSelecionado?.id === item.id && { color: ACTIVE_GREEN, fontWeight: 'bold' }]}>
                      {item.name}
                    </Text>
                  </View>
                  {estadoSelecionado?.id === item.id && <MaterialCommunityIcons name="check" size={20} color={ACTIVE_GREEN} />}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.closeModal} onPress={() => setModalEstadoVisible(false)}>
              <Text style={styles.closeModalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
// ... (mantenha os estilos que você já tem no arquivo)
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40, marginTop: 12 },
  inputGroup: { width: '100%', marginBottom: 25 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  label: { fontSize: 13, fontWeight: '700' },
  inputWrapper: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, justifyContent: 'center' },
  selectTrigger: { height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  input: { flex: 1, fontSize: 15, paddingVertical: 10 },
  saveBtn: { backgroundColor: ACTIVE_GREEN, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 25, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 55 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  // Container com altura calculada para "cortar" a lista
  listContainer: { 
    height: 275, // Altura estratégica para mostrar o início do próximo item
    marginBottom: 10 
  },
  modalOption: { 
    paddingVertical: 15, 
    paddingHorizontal: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(150,150,150,0.1)', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    height: 55 // Altura fixa para previsibilidade do scroll
  },
  modalOptionText: { 
    fontSize: 16 
  },
  closeModal: { 
    marginTop: 10, 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: 'rgba(255, 68, 68, 0.1)', 
    borderRadius: 12,
  },
  closeModalText: { 
    color: '#FF4444', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});