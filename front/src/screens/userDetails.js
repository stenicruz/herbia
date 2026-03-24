import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  Modal, TouchableWithoutFeedback, Image, Platform, StatusBar,
  ActivityIndicator, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Share2, Trash2, Eye, EyeOff, ChevronDown, Check, Calendar as CalendarIcon, X
} from 'lucide-react-native';
import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, ConfirmationModal } from '../components/central.js';
import adminService from '../services/adminService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDetailsScreen({ navigation, route }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const ACTIVE_GREEN = THEME.primary;
  const inactiveColor = isDarkMode ? '#666' : '#999';

  const { userId } = route.params || {};

  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [modalConfig, setModalConfig] = useState({ visible: false, type: '', targetId: null, title: '', message: '' });
  const [filtroPlanta, setFiltroPlanta] = useState('Todas');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [menuAberto, setMenuAberto] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dataSelecionadaFormatada, setDataSelecionadaFormatada] = useState(null);

// 1. Unifique os UseEffects e corrija o nome da função
useEffect(() => {
  const inicializarTela = async () => {
    // Carrega o admin logado
    const userStorage = await AsyncStorage.getItem('@Herbia:user');
    if (userStorage) {
      setCurrentUser(JSON.parse(userStorage));
    }
    // Carrega os dados do usuário da página
    await loadData(); 
  };

  inicializarTela();
}, [userId]);

// 2. Garanta que a função se chama loadData (como você já tinha em baixo)
const loadData = async () => {
  try {
    setLoading(true);
    // Busca os dados em paralelo para ser mais rápido
    const [usuarios, historico] = await Promise.all([
      adminService.listarUsuarios(),
      adminService.obterHistoricoPorUsuario(userId),
    ]);

    // Encontra o usuário específico na lista retornada pelo adminService
    const userEncontrado = usuarios.find(u => String(u.id) === String(userId));
    
    setUser(userEncontrado);
    setHistory(historico);
  } catch (err) {
    console.error(err);
    Alert.alert("Erro", "Não foi possível carregar os dados.");
  } finally {
    setLoading(false);
  }
};



  // Opções dinâmicas baseadas no histórico real
  const plantasUnicas = ['Todas', ...new Set(history.map(h => h.planta).filter(Boolean))];
  const opcoesStatus = ['Todos', 'Saudável', 'Doente'];

  const handleOpenModal = (type, id = null) => {
    let title = '';
    let message = '';
    if (type === 'deactivate') {
      title = user?.ativo === 1 ? "Desativar Utilizador?" : "Ativar Utilizador?";
      message = user?.ativo === 1
        ? "O utilizador não poderá aceder ao sistema até ser reactivado."
        : "O utilizador recuperará o acesso ao sistema.";
    } else if (type === 'delete_user') {
      title = "Eliminar Utilizador?";
      message = "Esta acção apagará permanentemente a conta e o histórico.";
    } else if (type === 'delete_analysis') {
      title = "Eliminar Análise?";
      message = "Este registo será removido do histórico do utilizador.";
    }
    setModalConfig({ visible: true, type, targetId: id, title, message });
  };

  const confirmAction = async () => {
    try {
      if (modalConfig.type === 'deactivate') {
        const novoStatus = user?.ativo === 1 ? 0 : 1;
        await adminService.atualizarStatusUsuario(userId, novoStatus);
        setUser(prev => ({ ...prev, ativo: novoStatus }));

      } else if (modalConfig.type === 'delete_user') {
        await adminService.eliminarUsuario(userId);
        navigation.goBack();

      } else if (modalConfig.type === 'delete_analysis') {
        await adminService.eliminarAnalise(modalConfig.targetId);
        setHistory(prev => prev.filter(item => item.id !== modalConfig.targetId));
      }
      setModalConfig({ ...modalConfig, visible: false });
    } catch (err) {
      Alert.alert("Erro", "Não foi possível completar a acção.");
    }
  };

  const dadosFiltrados = history.filter(item => {
    const matchPlanta = filtroPlanta === 'Todas' || item.planta === filtroPlanta;
    const matchStatus = filtroStatus === 'Todos' || item.estado === filtroStatus;
    const matchData = !dataSelecionadaFormatada || item.criado_em?.startsWith(dataSelecionadaFormatada);
    return matchPlanta && matchStatus && matchData;
  });

  const formatarData = (dataStr) => {
    if (!dataStr) return '';
    const d = new Date(dataStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const RenderDropdown = ({ visivel, opcoes, selecionado, aoSelecionar, posicaoEsquerda }) => (
    <Modal visible={visivel} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.dropdownContainer, {
            left: posicaoEsquerda,
            backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
            borderColor: isDarkMode ? '#333' : '#F0F0F0'
          }]}>
            {opcoes.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.dropdownOption, { borderBottomColor: isDarkMode ? '#222' : '#F9F9F9' }]}
                onPress={() => { aoSelecionar(opt); setMenuAberto(null); }}
              >
                {selecionado === opt && <Check color={ACTIVE_GREEN} size={16} style={{ marginRight: 8 }} />}
                <Text style={[
                  styles.dropdownText,
                  { color: isDarkMode ? '#AAA' : '#666' },
                  selecionado === opt && { color: ACTIVE_GREEN, fontWeight: '700' }
                ]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]} edges={['top']}>
        <AppHeader title="Detalhes do Utilizador" showBack={true} />
        <ActivityIndicator size="large" color={ACTIVE_GREEN} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Detalhes do Utilizador" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Perfil */}
        <View style={styles.profileSection}>
          <View style={[styles.avatarWrapper, { borderColor: user?.ativo === 1 ? ACTIVE_GREEN : (isDarkMode ? '#333' : '#CCC') }]}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: isDarkMode ? '#1A1D19' : '#E1F2FF' }]}>
              {user?.foto_perfil ? (
                <Image
                  source={{ uri: user.foto_perfil }}
                  style={[styles.avatarImg, user?.ativo === 0 && { opacity: 0.3 }]}
                />
              ) : (
                <View style={[styles.avatarImg, { backgroundColor: isDarkMode ? '#2A2E28' : '#C8E6C9' }]} />
              )}
            </View>
          </View>
          <Text style={[styles.profileName, { color: currentTheme.textPrimary }]}>
            {user?.nome || 'Utilizador'}
          </Text>
          <Text style={[styles.profileEmail, { color: isDarkMode ? '#777' : '#999' }]}>
            {user?.email || ''}
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.adminBadge, {
              backgroundColor: user?.tipo_usuario === 'admin'
                ? (isDarkMode ? '#1A2E1A' : '#B8FFAD')
                : (isDarkMode ? '#222' : '#EEE')
            }]}>
              <Text style={[styles.adminBadgeText, {
                color: user?.tipo_usuario === 'admin' ? ACTIVE_GREEN : (isDarkMode ? '#AAA' : '#333')
              }]}>
                {user?.tipo_usuario || 'usuario'}
              </Text>
            </View>
            <Text style={[styles.sinceText, { color: isDarkMode ? '#555' : '#b3afaf' }]}>
              • Desde: {formatarData(user?.criado_em)}
            </Text>
          </View>
        </View>

        {/* Métricas */}
        <View style={[styles.metricsCard, {
          backgroundColor: isDarkMode ? '#121411' : '#FFF',
          borderColor: isDarkMode ? '#1A2E1A' : '#F0F0F0'
        }]}>
          <View>
            <Text style={[styles.metricsTitle, { color: currentTheme.textPrimary }]}>Total de Análises</Text>
            <Text style={[styles.metricsValue, { color: ACTIVE_GREEN }]}>{history.length}</Text>
          </View>
        </View>

        {/* Botões de Acção */}
        {currentUser?.id !== userId && (
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, user?.ativo === 1
              ? (isDarkMode ? styles.deactivateBtnDark : styles.deactivateBtn)
              : styles.inactiveBtn
            ]}
            onPress={() => handleOpenModal('deactivate')}
          >
            {user?.ativo === 1
              ? <Eye color={ACTIVE_GREEN} size={18} />
              : <EyeOff color="#999" size={18} />
            }
            <Text style={[styles.actionBtnText, { color: user?.ativo === 1 ? ACTIVE_GREEN : '#999' }]}>
              {user?.ativo === 1 ? 'Desactivar' : 'Activar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, isDarkMode ? styles.deleteBtnDark : styles.deleteBtn]}
            onPress={() => handleOpenModal('delete_user')}
          >
            <Trash2 color="#db2626" size={18} />
            <Text style={[styles.actionBtnText, { color: '#db2626' }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
        )}

        {/* Histórico */}
        <View style={styles.historySection}>
          <Text style={[styles.historyTitle, { color: currentTheme.textPrimary }]}>Histórico de Análises</Text>

          <View style={styles.filtersRow}>
            <TouchableOpacity
              style={[styles.filterBtn, {
                backgroundColor: isDarkMode ? '#121411' : '#FFF',
                borderColor: isDarkMode ? '#333' : '#EEE'
              }, dataSelecionadaFormatada && styles.filterBtnActive, styles.btnDate]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.filterBtnText, { color: inactiveColor }, dataSelecionadaFormatada && styles.filterBtnTextActive]}>
                {dataSelecionadaFormatada || "Data"}
              </Text>
              {dataSelecionadaFormatada && (
                <TouchableOpacity onPress={() => setDataSelecionadaFormatada(null)} style={{ marginLeft: 5 }}>
                  <X color="#e4e9e1" size={15} strokeWidth={3.5} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterBtn, {
                backgroundColor: isDarkMode ? '#121411' : '#FFF',
                borderColor: isDarkMode ? '#333' : '#EEE'
              }, filtroPlanta !== 'Todas' && styles.filterBtnActive]}
              onPress={() => setMenuAberto('planta')}
            >
              <Text style={[styles.filterBtnText, { color: inactiveColor }, filtroPlanta !== 'Todas' && styles.filterBtnTextActive]}>
                {filtroPlanta}
              </Text>
              <ChevronDown color={filtroPlanta !== 'Todas' ? "#FFF" : inactiveColor} size={16} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterBtn, {
                backgroundColor: isDarkMode ? '#121411' : '#FFF',
                borderColor: isDarkMode ? '#333' : '#EEE'
              }, filtroStatus !== 'Todos' && styles.filterBtnActive]}
              onPress={() => setMenuAberto('status')}
            >
              <Text style={[styles.filterBtnText, { color: inactiveColor }, filtroStatus !== 'Todos' && styles.filterBtnTextActive]}>
                {filtroStatus}
              </Text>
              <ChevronDown color={filtroStatus !== 'Todos' ? "#FFF" : inactiveColor} size={16} />
            </TouchableOpacity>
          </View>

          {dadosFiltrados.length === 0 ? (
            <Text style={[styles.emptyText, { color: isDarkMode ? '#444' : '#999' }]}>
              Nenhuma análise encontrada.
            </Text>
          ) : (
            dadosFiltrados.map((item) => (
              <View key={item.id} style={[styles.historyCard, {
                backgroundColor: isDarkMode ? '#121411' : '#FFF',
                borderColor: isDarkMode ? '#1A2E1A' : '#F0F0F0'
              }]}>
                <TouchableOpacity
                  style={styles.historyCardContent}
                  onPress={() => navigation.navigate('DiagnosticResult', {
                    resultado: item,
                    imageUri: item.imagem_url,
                    isAdminView: true,
                    analiseId: item.id
                  })}
                >
                  {item.imagem_url ? (
                    <Image source={{ uri: item.imagem_url }} style={styles.plantImage} />
                  ) : (
                    <View style={[styles.plantImagePlaceholder, { backgroundColor: isDarkMode ? '#1A1D19' : '#E1F2FF' }]} />
                  )}
                  <View style={styles.plantInfo}>
                    <Text style={[styles.plantName, { color: currentTheme.textPrimary }]}>{item.planta}</Text>
                    <Text style={[styles.plantStatus, {
                      color: item.estado === 'Saudável' ? ACTIVE_GREEN : '#E74C3C'
                    }]}>
                      {item.doenca || item.estado}
                    </Text>
                    <Text style={[styles.plantDate, { color: isDarkMode ? '#555' : '#BBB' }]}>
                      {formatarData(item.criado_em)}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.cardDivider, { backgroundColor: isDarkMode ? '#222' : '#EEE' }]} />
                <TouchableOpacity style={styles.trashBtn} onPress={() => handleOpenModal('delete_analysis', item.id)}>
                  <Trash2 color="#db2626" size={24} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          maximumDate={new Date()}
          onChange={(e, d) => {
            setShowDatePicker(false);
            if (d) {
              setDate(d);
              setDataSelecionadaFormatada(
                `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
              );
            }
          }}
          themeVariant={isDarkMode ? 'dark' : 'light'}
        />
      )}

      <RenderDropdown visivel={menuAberto === 'planta'} opcoes={plantasUnicas} selecionado={filtroPlanta} aoSelecionar={setFiltroPlanta} posicaoEsquerda="28%" />
      <RenderDropdown visivel={menuAberto === 'status'} opcoes={opcoesStatus} selecionado={filtroStatus} aoSelecionar={setFiltroStatus} posicaoEsquerda="60%" />

      <ConfirmationModal
        visible={modalConfig.visible}
        onClose={() => setModalConfig({ ...modalConfig, visible: false })}
        onConfirm={confirmAction}
        title={modalConfig.title}
        description={modalConfig.message}
        confirmText="Confirmar"
        variant={modalConfig.type === 'delete_user' || modalConfig.type === 'delete_analysis' ? 'danger' : 'primary'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  profileSection: { alignItems: 'center', marginVertical: 20 },
  avatarWrapper: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, padding: 3, marginBottom: 15 },
  avatarPlaceholder: { flex: 1, borderRadius: 60, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  profileName: { fontSize: 18, fontWeight: '700' },
  profileEmail: { fontSize: 15, marginTop: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  adminBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  adminBadgeText: { fontSize: 10, fontWeight: '700' },
  sinceText: { fontSize: 13 },
  metricsCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 20, padding: 20, marginVertical: 15 },
  metricsTitle: { fontSize: 14, fontWeight: '700' },
  metricsValue: { fontSize: 18, fontWeight: '800', marginTop: 5 },
  actionButtonsRow: { flexDirection: 'row', gap: 15, marginBottom: 30, marginTop: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', height: 45, borderRadius: 22, justifyContent: 'center', alignItems: 'center', gap: 8 },
  deactivateBtn: { backgroundColor: '#e8fcea' },
  deactivateBtnDark: { backgroundColor: '#1A2E1A' },
  inactiveBtn: { backgroundColor: '#F5F5F5' },
  deleteBtn: { backgroundColor: '#fdd8d8' },
  deleteBtnDark: { backgroundColor: '#2D1616' },
  actionBtnText: { fontWeight: '700', fontSize: 14 },
  historySection: { marginTop: 10 },
  historyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 20 },
  filtersRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap:10 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  filterBtnActive: { backgroundColor: '#47e426', borderColor: '#47e426' },
  filterBtnText: { fontSize: 13, fontWeight: '700' },
  filterBtnTextActive: { color: '#FFF' },
  btnDate: { flexDirection: 'row' },
  historyCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 20, padding: 15, marginBottom: 12 },
  historyCardContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  plantImage: { width: 60, height: 60, borderRadius: 15 },
  plantImagePlaceholder: { width: 60, height: 60, borderRadius: 15 },
  plantInfo: { marginLeft: 15 },
  plantName: { fontSize: 15, fontWeight: '700' },
  plantStatus: { fontSize: 13, fontWeight: '700', marginVertical: 2 },
  plantDate: { fontSize: 11 },
  cardDivider: { width: 1, height: '70%', marginHorizontal: 15 },
  trashBtn: { padding: 5 },
  emptyText: { textAlign: 'center', marginTop: 30, fontSize: 14, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownContainer: { position: 'absolute', top: 640, width: 140, borderRadius: 15, elevation: 10, borderWidth: 1 },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1 },
  dropdownText: { fontSize: 13 },
});