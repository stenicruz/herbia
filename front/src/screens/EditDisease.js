import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar,
  Alert, Modal, FlatList, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, ConfirmationModal } from '../components/central';
import adminService from '../services/adminService';

const ACTIVE_GREEN = '#47e426';

// ✅ InputField FORA do componente principal — evita fecho do teclado
const InputField = ({ label, value, onChange, placeholder, multiline = false, icon, isDarkMode, currentTheme }) => (
  <View style={styles.inputGroup}>
    <View style={styles.labelRow}>
      <MaterialCommunityIcons name={icon} size={18} color={ACTIVE_GREEN} />
      <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#555' }]}>{label}</Text>
    </View>
    <View style={[styles.inputWrapper, {
      backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
      borderColor: isDarkMode ? '#333' : '#E0EEDF',
      minHeight: multiline ? 120 : 55,
    }]}>
      <TextInput
        style={[styles.input, { color: currentTheme.textPrimary }]}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? '#444' : '#BBB'}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  </View>
);

export default function EditDisease({ navigation, route }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const { disease } = route.params || {};
  const isEditing = !!disease;

  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState(disease?.nome || '');
  const [labelIA, setLabelIA] = useState(disease?.classe_ia || '');
  const [descricao, setDescricao] = useState(disease?.descricao || '');
  const [prevencao, setPrevencao] = useState(disease?.prevencao || '');
  const [tratamentoCaseiro, setTratamentoCaseiro] = useState(disease?.tratamento_caseiro || '');
  const [tratamentoConvencional, setTratamentoConvencional] = useState(disease?.tratamento_convencional || '');
  const [culturaSelecionada, setCulturaSelecionada] = useState(null);
  const [estadoSelecionado, setEstadoSelecionado] = useState(
    disease?.estado ? { id: disease.estado, name: disease.estado } : null
  );

  const [modalCulturaVisible, setModalCulturaVisible] = useState(false);
  const [modalEstadoVisible, setModalEstadoVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const listaEstados = [
    { id: 'Saudável', name: 'Saudável', icon: 'check-circle-outline' },
    { id: 'Doente', name: 'Doente', icon: 'alert-circle-outline' },
  ];

  useEffect(() => {
    loadCultures();
  }, []);

  const loadCultures = async () => {
    try {
      setLoading(true);
      const data = await adminService.listarCulturas();
      setCultures(data);

      if (disease?.cultura_id) {
        const cultura = data.find(c => c.id === disease.cultura_id);
        if (cultura) setCulturaSelecionada(cultura);
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar as culturas.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!nome || !culturaSelecionada || !labelIA || !estadoSelecionado) {
      Alert.alert("Erro", "Preencha Nome, Cultura, Estado e Label da IA.");
      return;
    }

    const dados = {
      cultura_id: culturaSelecionada.id,
      classe_ia: labelIA,
      nome,
      estado: estadoSelecionado.id,
      descricao,
      prevencao,
      tratamento_caseiro: tratamentoCaseiro,
      tratamento_convencional: tratamentoConvencional,
    };

    try {
      setSaving(true);
      if (isEditing) {
        await adminService.editarDoenca(disease.id, dados);
        Alert.alert("Sucesso", "Doença actualizada!", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else {
        await adminService.criarDoenca(dados);
        Alert.alert("Sucesso", "Doença criada!", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (err) {
      Alert.alert("Erro", err.error || "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteModalVisible(false);
      await adminService.eliminarDoenca(disease.id);
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", err.error || "Não foi possível eliminar.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title={isEditing ? "Editar Doença" : "Nova Doença"} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <InputField
            label="Nome de Exibição" icon="virus-outline"
            placeholder="Ex: Ferrugem Tardia"
            value={nome} onChange={setNome}
            isDarkMode={isDarkMode} currentTheme={currentTheme}
          />

          {/* Seletor de Cultura */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MaterialCommunityIcons name="sprout" size={18} color={ACTIVE_GREEN} />
              <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#555' }]}>Cultura</Text>
            </View>
            <TouchableOpacity
              style={[styles.inputWrapper, styles.selectTrigger, {
                backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
                borderColor: isDarkMode ? '#333' : '#E0EEDF'
              }]}
              onPress={() => setModalCulturaVisible(true)}
            >
              <Text style={{ color: culturaSelecionada ? currentTheme.textPrimary : '#BBB' }}>
                {culturaSelecionada ? culturaSelecionada.nome : "Selecione uma cultura"}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color={ACTIVE_GREEN} />
            </TouchableOpacity>
          </View>

          {/* Seletor de Estado */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MaterialCommunityIcons name="shield-star-outline" size={18} color={ACTIVE_GREEN} />
              <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#555' }]}>Estado da Planta</Text>
            </View>
            <TouchableOpacity
              style={[styles.inputWrapper, styles.selectTrigger, {
                backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
                borderColor: isDarkMode ? '#333' : '#E0EEDF'
              }]}
              onPress={() => setModalEstadoVisible(true)}
            >
              <Text style={{ color: estadoSelecionado ? currentTheme.textPrimary : '#BBB' }}>
                {estadoSelecionado ? estadoSelecionado.name : "Saudável ou Doente?"}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color={ACTIVE_GREEN} />
            </TouchableOpacity>
          </View>

          <InputField
            label="Label da IA (classe única)" icon="robot-outline"
            placeholder="Ex: Tomate__Ferrugem_Precoce"
            value={labelIA} onChange={setLabelIA}
            isDarkMode={isDarkMode} currentTheme={currentTheme}
          />
          <InputField
            label="Descrição" icon="text-search"
            placeholder="Sintomas ou estado geral..."
            value={descricao} onChange={setDescricao} multiline
            isDarkMode={isDarkMode} currentTheme={currentTheme}
          />
          <InputField
            label="Prevenção / Cuidados" icon="shield-check-outline"
            placeholder="Como evitar ou manter..."
            value={prevencao} onChange={setPrevencao} multiline
            isDarkMode={isDarkMode} currentTheme={currentTheme}
          />
          <InputField
            label="Tratamento Caseiro" icon="leaf"
            placeholder="Alternativa orgânica..."
            value={tratamentoCaseiro} onChange={setTratamentoCaseiro} multiline
            isDarkMode={isDarkMode} currentTheme={currentTheme}
          />
          <InputField
            label="Tratamento Convencional" icon="flask-outline"
            placeholder="Produtos químicos..."
            value={tratamentoConvencional} onChange={setTratamentoConvencional} multiline
            isDarkMode={isDarkMode} currentTheme={currentTheme}
          />

          {saving ? (
            <ActivityIndicator size="large" color={ACTIVE_GREEN} style={{ marginVertical: 20 }} />
          ) : (
            <>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>
                  {isEditing ? "Guardar Alterações" : "Criar Doença"}
                </Text>
              </TouchableOpacity>

              {isEditing && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => setDeleteModalVisible(true)}
                >
                  <Text style={styles.deleteBtnText}>Eliminar Doença</Text>
                </TouchableOpacity>
              )}
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Cultura */}
      <Modal visible={modalCulturaVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>Selecione a Cultura</Text>
            {loading ? (
              <ActivityIndicator size="large" color={ACTIVE_GREEN} />
            ) : (
              <FlatList
                data={cultures}
                keyExtractor={item => item.id.toString()}
                style={{ maxHeight: 300 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.modalOption, culturaSelecionada?.id === item.id && {
                      backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9'
                    }]}
                    onPress={() => { setCulturaSelecionada(item); setModalCulturaVisible(false); }}
                  >
                    <Text style={[styles.modalOptionText, { color: currentTheme.textPrimary },
                      culturaSelecionada?.id === item.id && { color: ACTIVE_GREEN, fontWeight: 'bold' }
                    ]}>
                      {item.nome}
                    </Text>
                    {culturaSelecionada?.id === item.id && (
                      <MaterialCommunityIcons name="check" size={20} color={ACTIVE_GREEN} />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity style={styles.closeModal} onPress={() => setModalCulturaVisible(false)}>
              <Text style={styles.closeModalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Estado */}
      <Modal visible={modalEstadoVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>Estado da Planta</Text>
            {listaEstados.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.modalOption, estadoSelecionado?.id === item.id && {
                  backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9'
                }]}
                onPress={() => { setEstadoSelecionado(item); setModalEstadoVisible(false); }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <MaterialCommunityIcons
                    name={item.icon} size={22}
                    color={item.id === 'Saudável' ? '#4CAF50' : '#F44336'}
                  />
                  <Text style={[styles.modalOptionText, { color: currentTheme.textPrimary },
                    estadoSelecionado?.id === item.id && { color: ACTIVE_GREEN, fontWeight: 'bold' }
                  ]}>
                    {item.name}
                  </Text>
                </View>
                {estadoSelecionado?.id === item.id && (
                  <MaterialCommunityIcons name="check" size={20} color={ACTIVE_GREEN} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeModal} onPress={() => setModalEstadoVisible(false)}>
              <Text style={styles.closeModalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ConfirmationModal
        visible={deleteModalVisible}
        title="Eliminar Doença?"
        description="Esta doença será removida permanentemente."
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
  scrollContent: { padding: 20, paddingBottom: 60 },
  inputGroup: { width: '100%', marginBottom: 25 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  label: { fontSize: 13, fontWeight: '700' },
  inputWrapper: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, justifyContent: 'center' },
  selectTrigger: { height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  input: { flex: 1, fontSize: 15, paddingVertical: 10 },
  saveBtn: {
    backgroundColor: ACTIVE_GREEN, height: 55, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center', marginTop: 10
  },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  deleteBtn: {
    height: 55, borderRadius: 15, justifyContent: 'center',
    alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#FF4444'
  },
  deleteBtnText: { color: '#FF4444', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalOption: {
    paddingVertical: 15, paddingHorizontal: 15,
    borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  modalOptionText: { fontSize: 16 },
  closeModal: {
    marginTop: 10, alignItems: 'center', padding: 15,
    backgroundColor: 'rgba(255, 68, 68, 0.1)', borderRadius: 12,
  },
  closeModalText: { color: '#FF4444', fontWeight: 'bold', fontSize: 16 },
});