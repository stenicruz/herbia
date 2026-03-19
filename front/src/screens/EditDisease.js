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

  const listaCulturas = [
    { id: '1', name: 'Tomateiro' },
    { id: '2', name: 'Soja' },
    { id: '3', name: 'Videira' },
    { id: '4', name: 'Milho' },
    { id: '5', name: 'Abacate' },
    { id: '6', name: 'Cereja' },
    { id: '7', name: 'Cereja' },
  ];

  const handleSave = () => {
    if (!nome || !culturaSelecionada || !labelIA) {
      Alert.alert("Erro", "Preencha Nome, Cultura e Label da IA.");
      return;
    }
    Alert.alert("Sucesso", "Doença registrada!");
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
      <AppHeader title="Configurar Doença" />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <InputField label="Nome da Doença" icon="virus-outline" placeholder="Ex: Ferrugem" value={nome} onChange={setNome} />

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

          <InputField label="Label da IA" icon="robot-outline" placeholder="Ex: tomato_rust" value={labelIA} onChange={setLabelIA} />
          <InputField label="Descrição" icon="text-search" placeholder="Sintomas..." value={descricao} onChange={setDescricao} multiline />
          <InputField label="Prevenção" icon="shield-check-outline" placeholder="Como evitar..." value={prevencao} onChange={setPrevencao} multiline />
          <InputField label="Tratamento Bio" icon="leaf" placeholder="Caseiro..." value={tratamentoCaseiro} onChange={setTratamentoCaseiro} multiline />
          <InputField label="Tratamento Químico" icon="flask-outline" placeholder="Convencional..." value={tratamentoConvencional} onChange={setTratamentoConvencional} multiline />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Salvar Doença</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal 
  visible={modalCulturaVisible} 
  transparent 
  animationType="slide" 
  onRequestClose={() => setModalCulturaVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]}>
      <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>
        Selecione a Cultura
      </Text>
      
      {/* Ajustamos a altura para ~275. 
        Como cada item + padding tem cerca de 55-60px, 
        isso mostrará 4 itens inteiros e o 5º ou 6º pela metade.
      */}
      <View style={styles.listContainer}> 
        <FlatList
          data={listaCulturas}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={true} // Ativa a barra lateral para dar a dica
          renderItem={({ item }) => {
            const isSelected = culturaSelecionada?.id === item.id;
            return (
              <TouchableOpacity 
                style={[
                  styles.modalOption, 
                  isSelected && { backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9', borderRadius: 10 }
                ]} 
                onPress={() => { setCulturaSelecionada(item); setModalCulturaVisible(false); }}
              >
                <Text style={[
                  styles.modalOptionText, 
                  { color: currentTheme.textPrimary },
                  isSelected && { color: ACTIVE_GREEN, fontWeight: 'bold' }
                ]}>
                  {item.name}
                </Text>
                {isSelected ? <MaterialCommunityIcons name="check" size={20} color={ACTIVE_GREEN} /> : null}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <TouchableOpacity style={styles.closeModal} onPress={() => setModalCulturaVisible(false)}>
        <Text style={styles.closeModalText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
}

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