import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, Image, Platform, StatusBar
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Share2, Trash2, Eye, EyeOff, ChevronDown, Check, Calendar as CalendarIcon, X 
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, ConfirmationModal } from '../components/central.js';

export default function UserDetailsScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const ACTIVE_GREEN = THEME.primary;
  
  // Define a cor dos ícones e textos inativos baseada no tema
  const inactiveColor = isDarkMode ? '#666' : '#999';

  const [isUserActive, setIsUserActive] = useState(true);
  const [modalConfig, setModalConfig] = useState({ visible: false, type: '', targetId: null });
  const [filtroPlanta, setFiltroPlanta] = useState('Todas');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [menuAberto, setMenuAberto] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dataSelecionadaFormatada, setDataSelecionadaFormatada] = useState(null);

  const [history, setHistory] = useState([
    { id: '1', plant: 'Tomateiro', status: 'Saudável', date: '05/07/2025', cor: '#47e426' },
    { id: '2', plant: 'Tomateiro', status: 'Doente', date: '05/07/2025', cor: '#E74C3C' },
    { id: '3', plant: 'Mandioca', status: 'Saudável', date: '06/07/2025', cor: '#47e426' },
  ]);

  const opcoesPlanta = ['Todas', 'Tomateiro', 'Mandioca', 'Batata'];
  const opcoesStatus = ['Todos', 'Saudável', 'Doente'];

  const handleOpenModal = (type, id = null) => {
    let config = { visible: true, type, targetId: id };
    if (type === 'deactivate') {
      config.title = isUserActive ? "Desativar Usuário?" : "Ativar Usuário?";
      config.message = isUserActive ? "O usuário não poderá acessar o sistema até ser reativado." : "O usuário recuperará o acesso ao sistema.";
    } else if (type === 'delete_user') {
      config.title = "Eliminar Usuário?";
      config.message = "Esta ação apagará permanentemente a conta e o histórico.";
    } else if (type === 'delete_analysis') {
      config.title = "Eliminar Análise?";
      config.message = "Este registro será removido do histórico do usuário.";
    }
    setModalConfig(config);
  };

  const confirmAction = () => {
    if (modalConfig.type === 'deactivate') setIsUserActive(!isUserActive);
    else if (modalConfig.type === 'delete_analysis') {
      setHistory(prev => prev.filter(item => item.id !== modalConfig.targetId));
    }
    setModalConfig({ ...modalConfig, visible: false });
  };

  const dadosFiltrados = history.filter(item => {
    const matchPlanta = filtroPlanta === 'Todas' || item.plant === filtroPlanta;
    const matchStatus = filtroStatus === 'Todos' || item.status === filtroStatus;
    const matchData = !dataSelecionadaFormatada || item.date === dataSelecionadaFormatada;
    return matchPlanta && matchStatus && matchData;
  });

  const RenderDropdown = ({ visivel, opcoes, selecionado, aoSelecionar, posicaoEsquerda }) => (
    <Modal visible={visivel} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
        <View style={styles.modalOverlay}>
          <View style={[
            styles.dropdownContainer, 
            { left: posicaoEsquerda, backgroundColor: isDarkMode ? '#1A1D19' : '#FFF', borderColor: isDarkMode ? '#333' : '#F0F0F0' }
          ]}>
            {opcoes.map((opt) => (
              <TouchableOpacity key={opt} style={[styles.dropdownOption, { borderBottomColor: isDarkMode ? '#222' : '#F9F9F9' }]} onPress={() => { aoSelecionar(opt); setMenuAberto(null); }}>
                {selecionado === opt && <Check color={ACTIVE_GREEN} size={16} style={{marginRight: 8}} />}
                <Text style={[styles.dropdownText, { color: isDarkMode ? '#AAA' : '#666' }, selecionado === opt && {color: ACTIVE_GREEN, fontWeight: '700'}]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Detalhes do usuário" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ... (Perfis e Métricas permanecem iguais) */}
        <View style={styles.profileSection}>
          <View style={[styles.avatarWrapper, { borderColor: isUserActive ? ACTIVE_GREEN : (isDarkMode ? '#333' : '#CCC') }]}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: isDarkMode ? '#1A1D19' : '#E1F2FF' }]}>
              <Image source={{uri: 'https://via.placeholder.com/120'}} style={[styles.avatarImg, !isUserActive && {opacity: 0.3}]} />
            </View>
          </View>
          <Text style={[styles.profileName, { color: currentTheme.textPrimary }]}>Sebastião Miguel</Text>
          <Text style={[styles.profileEmail, { color: isDarkMode ? '#777' : '#999' }]}>sebastiao@gmail.com</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.adminBadge, { backgroundColor: isDarkMode ? '#1A2E1A' : '#B8FFAD' }]}>
              <Text style={[styles.adminBadgeText, { color: isDarkMode ? ACTIVE_GREEN : '#333' }]}>Admin</Text>
            </View>
            <Text style={[styles.sinceText, { color: isDarkMode ? '#555' : '#b3afaf' }]}>• Desde: 05/08/2020</Text>
          </View>
        </View>

        <View style={[styles.metricsCard, { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#1A2E1A' : '#F0F0F0' }]}>
          <View>
            <Text style={[styles.metricsTitle, { color: currentTheme.textPrimary }]}>Total de Análises</Text>
            <Text style={[styles.metricsValue, { color: ACTIVE_GREEN }]}>{history.length}</Text>
          </View>
          <TouchableOpacity style={[styles.shareBtn, { backgroundColor: ACTIVE_GREEN }]}>
            <Share2 color="#FFF" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, isUserActive ? (isDarkMode ? styles.deactivateBtnDark : styles.deactivateBtn) : styles.inactiveBtn]} 
            onPress={() => handleOpenModal('deactivate')}
          >
            {isUserActive ? <Eye color={ACTIVE_GREEN} size={18} /> : <EyeOff color="#999" size={18} />}
            <Text style={[styles.actionBtnText, {color: isUserActive ? ACTIVE_GREEN : '#999'}]}>
              {isUserActive ? 'Desactivar' : 'Ativar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, isDarkMode ? styles.deleteBtnDark : styles.deleteBtn]} onPress={() => handleOpenModal('delete_user')}>
            <Trash2 color="#db2626" size={18} fill={isDarkMode ? "transparent" : "#cc0303"} />
            <Text style={[styles.actionBtnText, {color: '#db2626'}]}>Deletar</Text>
          </TouchableOpacity>
        </View>

        {/* Histórico de Análises */}
        <View style={styles.historySection}>
          <Text style={[styles.historyTitle, { color: currentTheme.textPrimary }]}>Histórico de Análises</Text>
          
          <View style={styles.filtersRow}>
            {/* Filtro Data com botão de limpar */}
            <TouchableOpacity 
              activeOpacity={0.7}
              style={[
                styles.filterBtn, 
                { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#333' : '#EEE' }, 
                dataSelecionadaFormatada && styles.filterBtnActive, styles.btnDate,
              ]} 
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.filterLeftContent}>
                <Text style={[
                  styles.filterBtnText, 
                  { color: inactiveColor }, 
                  dataSelecionadaFormatada && styles.filterBtnTextActive
                ]}>
                  {dataSelecionadaFormatada || "Data"}
                </Text>
              </View>

              {dataSelecionadaFormatada && (
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation(); // Impede de abrir o calendário ao limpar
                    setDataSelecionadaFormatada(null);
                  }} 
                  style={{marginLeft: 5}}
                >
                   <X color="#e4e9e1" size={15} strokeWidth={3.5} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterBtn, { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#333' : '#EEE' }, filtroPlanta !== 'Todas' && styles.filterBtnActive]} 
              onPress={() => setMenuAberto('planta')}
            >
              <Text style={[styles.filterBtnText, { color: inactiveColor }, filtroPlanta !== 'Todas' && styles.filterBtnTextActive]}>{filtroPlanta}</Text>
              <ChevronDown color={filtroPlanta !== 'Todas' ? "#FFF" : inactiveColor} size={16} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterBtn, { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#333' : '#EEE' }, filtroStatus !== 'Todos' && styles.filterBtnActive]} 
              onPress={() => setMenuAberto('status')}
            >
              <Text style={[styles.filterBtnText, { color: inactiveColor }, filtroStatus !== 'Todos' && styles.filterBtnTextActive]}>{filtroStatus}</Text>
              <ChevronDown color={filtroStatus !== 'Todos' ? "#FFF" : inactiveColor} size={16} />
            </TouchableOpacity>
          </View>

          {/* ... (Cards do histórico permanecem iguais) */}
          {dadosFiltrados.map((item) => (
            <View key={item.id} style={[styles.historyCard, { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#1A2E1A' : '#F0F0F0' }]}>
              <TouchableOpacity style={styles.historyCardContent} onPress={() => navigation.navigate('DiagnosticResult', { item, isAdminView: true })}>
                <View style={[styles.plantImagePlaceholder, { backgroundColor: isDarkMode ? '#1A1D19' : '#E1F2FF' }]} />
                <View style={styles.plantInfo}>
                  <Text style={[styles.plantName, { color: currentTheme.textPrimary }]}>{item.plant}</Text>
                  <Text style={[styles.plantStatus, {color: item.cor}]}>{item.status}</Text>
                  <Text style={[styles.plantDate, { color: isDarkMode ? '#555' : '#BBB' }]}>{item.date}</Text>
                </View>
              </TouchableOpacity>
              <View style={[styles.cardDivider, { backgroundColor: isDarkMode ? '#222' : '#EEE' }]} />
              <TouchableOpacity style={styles.trashBtn} onPress={() => handleOpenModal('delete_analysis', item.id)}>
                <Trash2 color="#db2626" size={24} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          maximumDate={new Date()} // BLOQUEIA DATAS FUTURAS
          onChange={(e, d) => {
            setShowDatePicker(false);
            if (d) setDataSelecionadaFormatada(`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`);
          }}
          themeVariant={isDarkMode ? 'dark' : 'light'}
        />
      )}

      <RenderDropdown visivel={menuAberto === 'planta'} opcoes={opcoesPlanta} selecionado={filtroPlanta} aoSelecionar={setFiltroPlanta} posicaoEsquerda="31%" />
      <RenderDropdown visivel={menuAberto === 'status'} opcoes={opcoesStatus} selecionado={filtroStatus} aoSelecionar={setFiltroStatus} posicaoEsquerda="60%" />

      <ConfirmationModal 
        visible={modalConfig.visible}
        onClose={() => setModalConfig({ ...modalConfig, visible: false })}
        onConfirm={confirmAction}
        title={modalConfig.title}
        description={modalConfig.message}
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
  shareBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
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
  filtersRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  
  filterWrapper: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  filterBtnActive: { backgroundColor: '#47e426', borderColor: '#47e426' },
  filterBtnText: { fontSize: 13, fontWeight: '700' }, // FontWeight 700 para consistência
  filterBtnTextActive: { color: '#FFF' },
  clearDateBtn: { position: 'absolute', top: -5, right: -5, zIndex: 10 },
  btnDate: { flexDirection: 'row'},
  historyCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 20, padding: 15, marginBottom: 12 },
  historyCardContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  plantImagePlaceholder: { width: 60, height: 60, borderRadius: 15 },
  plantInfo: { marginLeft: 15 },
  plantName: { fontSize: 15, fontWeight: '700' },
  plantStatus: { fontSize: 13, fontWeight: '700', marginVertical: 2 },
  plantDate: { fontSize: 11 },
  cardDivider: { width: 1, height: '70%', marginHorizontal: 15 },
  trashBtn: { padding: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownContainer: { position: 'absolute', top: 400, width: 140, borderRadius: 15, elevation: 10, borderWidth: 1 },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1 },
  dropdownText: { fontSize: 13 },
});