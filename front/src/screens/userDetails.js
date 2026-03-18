import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, Image, Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Share2, Trash2, Eye, EyeOff, ChevronDown, Check, Calendar as CalendarIcon 
} from 'lucide-react-native';

import { AppHeader, ConfirmationModal } from '../components/central.js';

const ACTIVE_GREEN = '#47e426';

export default function UserDetailsScreen({ navigation }) {
  // --- ESTADOS DE CONTROLE DE USUÁRIO ---
  const [isUserActive, setIsUserActive] = useState(true);
  const [modalConfig, setModalConfig] = useState({ visible: false, type: '', targetId: null });

  // --- ESTADOS DOS FILTROS ---
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

  // --- FUNÇÕES DE AÇÃO ---
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
    if (modalConfig.type === 'deactivate') {
      setIsUserActive(!isUserActive);
    } else if (modalConfig.type === 'delete_analysis') {
      setHistory(prev => prev.filter(item => item.id !== modalConfig.targetId));
    }
    setModalConfig({ ...modalConfig, visible: false });
  };

  // --- FILTRAGEM ---
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
          <View style={[styles.dropdownContainer, { left: posicaoEsquerda }]}>
            {opcoes.map((opt) => (
              <TouchableOpacity key={opt} style={styles.dropdownOption} onPress={() => { aoSelecionar(opt); setMenuAberto(null); }}>
                {selecionado === opt && <Check color={ACTIVE_GREEN} size={16} style={{marginRight: 8}} />}
                <Text style={[styles.dropdownText, selecionado === opt && {color: ACTIVE_GREEN, fontWeight: '700'}]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Detalhes do usuário" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Perfil Central */}
        <View style={styles.profileSection}>
          <View style={[styles.avatarWrapper, !isUserActive && {borderColor: '#CCC'}]}>
            <View style={[styles.avatarPlaceholder, !isUserActive && {backgroundColor: '#EEE'}]}>
                <Image source={{uri: 'https://via.placeholder.com/120'}} style={[styles.avatarImg, !isUserActive && {opacity: 0.5}]} />
            </View>
          </View>
          <Text style={styles.profileName}>Sebastião Miguel</Text>
          <Text style={styles.profileEmail}>sebastiao@gmail.com</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.adminBadge, !isUserActive && {backgroundColor: '#EEE'}]}>
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
            <Text style={styles.sinceText}>• Desde: 05/08/2020</Text>
          </View>
        </View>

        {/* Card de Métricas - Reflete o total real (sem filtros) */}
        <View style={styles.metricsCard}>
          <View>
            <Text style={styles.metricsTitle}>Total de Análises</Text>
            <Text style={styles.metricsValue}>{history.length}</Text>
          </View>
          <TouchableOpacity style={styles.shareBtn}>
            <Share2 color="#FFF" size={20} />
          </TouchableOpacity>
        </View>

        {/* Botões de Acção Rápida */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, isUserActive ? styles.deactivateBtn : styles.inactiveBtn]} 
            onPress={() => handleOpenModal('deactivate')}
          >
            {isUserActive ? <Eye color={ACTIVE_GREEN} size={18} /> : <EyeOff color="#999" size={18} />}
            <Text style={[styles.actionBtnText, {color: isUserActive ? ACTIVE_GREEN : '#999'}]}>
              {isUserActive ? 'Desactivar' : 'Ativar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleOpenModal('delete_user')}>
            <Trash2 color="#db2626" size={18} fill="#cc0303" />
            <Text style={[styles.actionBtnText, {color: '#db2626'}]}>Deletar</Text>
          </TouchableOpacity>
        </View>

        {/* Histórico de Análises */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Histórico de Análises</Text>
          
          <View style={styles.filtersRow}>
            <TouchableOpacity style={[styles.filterBtn, dataSelecionadaFormatada && styles.filterBtnActive]} onPress={() => setShowDatePicker(true)}>
              <CalendarIcon color={dataSelecionadaFormatada ? "#FFF" : "#999"} size={16} />
              <Text style={[styles.filterBtnText, dataSelecionadaFormatada && styles.filterBtnTextActive]}>{dataSelecionadaFormatada || "Data"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterBtn, filtroPlanta !== 'Todas' && styles.filterBtnActive]} onPress={() => setMenuAberto('planta')}>
              <Text style={[styles.filterBtnText, filtroPlanta !== 'Todas' && styles.filterBtnTextActive]}>{filtroPlanta}</Text>
              <ChevronDown color={filtroPlanta !== 'Todas' ? "#FFF" : "#999"} size={16} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterBtn, filtroStatus !== 'Todos' && styles.filterBtnActive]} onPress={() => setMenuAberto('status')}>
              <Text style={[styles.filterBtnText, filtroStatus !== 'Todos' && styles.filterBtnTextActive]}>{filtroStatus}</Text>
              <ChevronDown color={filtroStatus !== 'Todos' ? "#FFF" : "#999"} size={16} />
            </TouchableOpacity>
          </View>

          {dadosFiltrados.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <TouchableOpacity style={styles.historyCardContent} onPress={() => navigation.navigate('DiagnosticResult', { item, isAdminView: true })}>
                <View style={styles.plantImagePlaceholder} />
                <View style={styles.plantInfo}>
                  <Text style={styles.plantName}>{item.plant}</Text>
                  <Text style={[styles.plantStatus, {color: item.cor}]}>{item.status}</Text>
                  <Text style={styles.plantDate}>{item.date}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.cardDivider} />
              <TouchableOpacity style={styles.trashBtn} onPress={() => handleOpenModal('delete_analysis', item.id)}>
                <Trash2 color="#db2626" size={24} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={(e, d) => {
          setShowDatePicker(false);
          if (d) setDataSelecionadaFormatada(`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`);
        }} />
      )}

      <RenderDropdown visivel={menuAberto === 'planta'} opcoes={opcoesPlanta} selecionado={filtroPlanta} aoSelecionar={setFiltroPlanta} posicaoEsquerda="31%" />
      <RenderDropdown visivel={menuAberto === 'status'} opcoes={opcoesStatus} selecionado={filtroStatus} aoSelecionar={setFiltroStatus} posicaoEsquerda="60%" />

      <ConfirmationModal 
        visible={modalConfig.visible}
        onClose={() => setModalConfig({ ...modalConfig, visible: false })}
        onConfirm={confirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  profileSection: { alignItems: 'center', marginVertical: 20 },
  avatarWrapper: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: ACTIVE_GREEN, padding: 3, marginBottom: 15 },
  avatarPlaceholder: { flex: 1, backgroundColor: '#E1F2FF', borderRadius: 60, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  profileName: { fontSize: 18, fontWeight: '700', color: '#333' },
  profileEmail: { fontSize: 15, color: '#999', marginTop: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  adminBadge: { backgroundColor: '#B8FFAD', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  adminBadgeText: { fontSize: 10, fontWeight: '700', color: '#333' },
  sinceText: { fontSize: 13, color: '#b3afaf' },
  metricsCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 20, padding: 20, marginVertical: 15, elevation: 2 },
  metricsTitle: { fontSize: 14, fontWeight: '700', color: '#333' },
  metricsValue: { fontSize: 18, fontWeight: '800', color: ACTIVE_GREEN, marginTop: 5 },
  shareBtn: { backgroundColor: ACTIVE_GREEN, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  
  actionButtonsRow: { flexDirection: 'row', gap: 15, marginBottom: 30, marginTop: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', height: 45, borderRadius: 22, justifyContent: 'center', alignItems: 'center', gap: 8 },
  deactivateBtn: { backgroundColor: '#e8fcea' },
  inactiveBtn: { backgroundColor: '#F5F5F5' },
  deleteBtn: { backgroundColor: '#fdd8d8' },
  actionBtnText: { fontWeight: '700', fontSize: 14 },

  historySection: { marginTop: 10 },
  historyTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 20 },
  filtersRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', backgroundColor: '#FFF' },
  filterBtnActive: { backgroundColor: ACTIVE_GREEN, borderColor: ACTIVE_GREEN },
  filterBtnText: { fontSize: 13, color: '#999', fontWeight: '600' },
  filterBtnTextActive: { color: '#FFF' },
  historyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 20, padding: 15, marginBottom: 12 },
  historyCardContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  plantImagePlaceholder: { width: 60, height: 60, borderRadius: 15, backgroundColor: '#E1F2FF' },
  plantInfo: { marginLeft: 15 },
  plantName: { fontSize: 15, fontWeight: '700', color: '#333' },
  plantStatus: { fontSize: 13, fontWeight: '700', marginVertical: 2 },
  plantDate: { fontSize: 11, color: '#BBB' },
  cardDivider: { width: 1, height: '70%', backgroundColor: '#EEE', marginHorizontal: 15 },
  trashBtn: { padding: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownContainer: { position: 'absolute', top: 400, width: 140, backgroundColor: '#FFF', borderRadius: 15, elevation: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F9F9F9' },
  dropdownText: { fontSize: 13, color: '#666' },
});