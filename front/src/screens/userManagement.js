import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Pressable, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, Trash2, User as UserIcon, Mail, Lock, EyeOff, X, Eye
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/central.js';

export default function UserManagementScreen({navigation}) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const ACTIVE_GREEN = THEME.primary;

  const [registerVisible, setRegisterVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ visible: false, type: '', userId: null });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRole, setFilterRole] = useState('All');

  const USER_DATA = [
    { id: '1', name: 'Julian Rivers', email: 'julian@gmail.com', date: '05/08/2020', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Julian Rivers', email: 'julian@gmail.com', date: '05/08/2020', role: 'User', status: 'Inactive' },
    { id: '3', name: 'Adriana Silva', email: 'adriana@gmail.com', date: '10/01/2021', role: 'User', status: 'Active' },
  ];

  const filteredUsers = USER_DATA.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleAction = (type, id) => {
    setConfirmModal({ visible: true, type, userId: id });
  };

  const StatCard = ({ label, value }) => (
    <View style={[styles.statCard, { 
      backgroundColor: isDarkMode ? '#121411' : '#fafcf9',
      borderColor: isDarkMode ? '#1A2E1A' : '#cfc9c9'
    }]}>
      <Text style={[styles.statValue, { color: ACTIVE_GREEN }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: isDarkMode ? '#AAA' : '#3f3d3d' }]}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Gestão de Usuários" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.statsRow}>
          <StatCard label="Total" value={USER_DATA.length} />
          <StatCard label="Activos" value={USER_DATA.filter(u => u.status === 'Active').length} />
          <StatCard label="Inactivos" value={USER_DATA.filter(u => u.status === 'Inactive').length} />
          <StatCard label="Admins" value={USER_DATA.filter(u => u.role === 'Admin').length} />
        </View>

        <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#121411' : '#F8F8F8' }]}>
          <Search color={isDarkMode ? "#555" : "#CCC"} size={20} />
          <TextInput 
            placeholder="Pesquise por nome ou email" 
            style={[styles.searchInput, { color: currentTheme.textPrimary }]} 
            placeholderTextColor={isDarkMode ? "#555" : "#CCC"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {/* Filtro Todos */}
            <TouchableOpacity 
              style={[styles.filterChip, { backgroundColor: isDarkMode ? '#121411' : '#F0F0F0' }, filterStatus === 'All' && styles.activeChip]} 
              onPress={() => setFilterStatus('All')}>
              <Text style={[styles.filterChipText, { color: isDarkMode ? '#AAA' : '#666' }, filterStatus === 'All' && styles.activeChipText]}>Todos</Text>
            </TouchableOpacity>

            {/* Filtro Ativos */}
            <TouchableOpacity 
              style={[styles.filterChip, { backgroundColor: isDarkMode ? '#121411' : '#F0F0F0' }, filterStatus === 'Active' && styles.activeChip]} 
              onPress={() => setFilterStatus('Active')}>
              <Text style={[styles.filterChipText, { color: isDarkMode ? '#AAA' : '#666' }, filterStatus === 'Active' && styles.activeChipText]}>Ativos</Text>
            </TouchableOpacity>

            {/* Filtro Inativos - CORRIGIDO AQUI */}
            <TouchableOpacity 
              style={[styles.filterChip, { backgroundColor: isDarkMode ? '#121411' : '#F0F0F0' }, filterStatus === 'Inactive' && styles.activeChip]} 
              onPress={() => setFilterStatus('Inactive')}>
              <Text style={[styles.filterChipText, { color: isDarkMode ? '#AAA' : '#666' }, filterStatus === 'Inactive' && styles.activeChipText]}>Inativos</Text>
            </TouchableOpacity>

            <View style={[styles.filterDivider, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]} />

            {/* Filtro Admins */}
            <TouchableOpacity 
              style={[styles.filterChip, { backgroundColor: isDarkMode ? '#121411' : '#F0F0F0' }, filterRole === 'Admin' && styles.activeChip]} 
              onPress={() => setFilterRole(filterRole === 'Admin' ? 'All' : 'Admin')}>
              <Text style={[styles.filterChipText, { color: isDarkMode ? '#AAA' : '#666' }, filterRole === 'Admin' && styles.activeChipText]}>Admins</Text>
            </TouchableOpacity>

            {/* Filtro Usuários */}
            <TouchableOpacity 
              style={[styles.filterChip, { backgroundColor: isDarkMode ? '#121411' : '#F0F0F0' }, filterRole === 'User' && styles.activeChip]} 
              onPress={() => setFilterRole(filterRole === 'User' ? 'All' : 'User')}>
              <Text style={[styles.filterChipText, { color: isDarkMode ? '#AAA' : '#666' }, filterRole === 'User' && styles.activeChipText]}>Usuários</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <TouchableOpacity style={[styles.createBtn, { backgroundColor: ACTIVE_GREEN }]} onPress={() => setRegisterVisible(true)}>
          <Text style={styles.createBtnText}>Criar Administrador</Text>
        </TouchableOpacity>

        {filteredUsers.map((user) => (
          <View key={user.id} style={[styles.userCard, { 
            backgroundColor: isDarkMode ? '#121411' : '#FFF', 
            borderColor: isDarkMode ? '#1A2E1A' : '#F5F5F5' 
          }]}>
            <View style={styles.userHeader}>
              <View style={[styles.avatarPlaceholder, { backgroundColor: isDarkMode ? '#1A1D19' : '#E1F2FF' }]} />
              <View style={styles.userInfo}>
                <View style={styles.nameRoleRow}>
                  <Text style={[styles.userName, { color: currentTheme.textPrimary }]}>{user.name}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: user.role === 'Admin' ? (isDarkMode ? '#1A2E1A' : '#B8FFAD') : (isDarkMode ? '#222' : '#EEE') }]}>
                    <Text style={[styles.roleText, { color: user.role === 'Admin' ? ACTIVE_GREEN : (isDarkMode ? '#AAA' : '#333') }]}>{user.role}</Text>
                  </View>
                </View>
                <Text style={[styles.userEmail, { color: isDarkMode ? '#777' : '#999' }]}>{user.email}</Text>
                <Text style={[styles.userDate, { color: isDarkMode ? '#555' : '#BBB' }]}>Desde: {user.date}</Text>
              </View>              
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.statusBtn, { backgroundColor: user.status === 'Active' ? ACTIVE_GREEN : (isDarkMode ? '#333' : '#BBB') }]}
                onPress={() => handleAction(user.status === 'Active' ? 'desativar' : 'ativar', user.id)}
              >
                <Text style={styles.btnText}>{user.status === 'Active' ? 'Desactivar' : 'Activar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.visualizeBtn, { backgroundColor: isDarkMode ? '#1A2E1A' : '#B8FFAD' }]} onPress={() => navigation.navigate('UserDetails')}>
                <Text style={[styles.btnTextGreen, { color: isDarkMode ? ACTIVE_GREEN : '#333' }]}>Visualizar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleAction('deletar', user.id)}><Trash2 color="#FFF" size={18} /></TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* --- MODAL CADASTRAR ADM --- */}
      <Modal animationType="slide" transparent={true} visible={registerVisible}>
        <View style={styles.modalOverlay}>
          <View style={[styles.registerModalContainer, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setRegisterVisible(false)}>
              <X color={isDarkMode ? "#AAA" : "#333"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.modalHeaderTitle, { color: currentTheme.textPrimary }]}>Cadastrar ADM</Text>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
              {/* Nome e Email dinâmicos */}
              {[
                { label: 'Nome Completo', icon: <UserIcon color="#555" size={20} />, placeholder: 'Nome do Administrador' },
                { label: 'E-mail', icon: <Mail color="#555" size={20} />, placeholder: 'email@exemplo.com' }
              ].map((input, index) => (
                <View key={index} style={styles.modalInputGroup}>
                  <Text style={[styles.modalLabel, { color: isDarkMode ? '#AAA' : '#666' }]}>{input.label}</Text>
                  <View style={[styles.modalInputWrapper, { borderColor: isDarkMode ? '#333' : '#EEE', backgroundColor: isDarkMode ? '#121411' : '#FFF' }]}>
                    {input.icon}
                    <TextInput placeholder={input.placeholder} placeholderTextColor="#555" style={[styles.modalInput, { color: currentTheme.textPrimary }]} />
                  </View>
                </View>
              ))}

              {/* Senha */}
              <View style={styles.modalInputGroup}>
                <Text style={[styles.modalLabel, { color: isDarkMode ? '#AAA' : '#666' }]}>Palavra-Passe</Text>
                <View style={[styles.modalInputWrapper, { borderColor: isDarkMode ? '#333' : '#EEE', backgroundColor: isDarkMode ? '#121411' : '#FFF' }]}>
                  <Lock color="#555" size={20} />
                  <TextInput secureTextEntry={!showPass} placeholder=".........." placeholderTextColor="#555" style={[styles.modalInput, { color: currentTheme.textPrimary }]} />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    <Eye color={showPass ? ACTIVE_GREEN : "#555"} size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmar Senha - ADICIONADO */}
              <View style={styles.modalInputGroup}>
                <Text style={[styles.modalLabel, { color: isDarkMode ? '#AAA' : '#666' }]}>Confirmar Palavra-Passe</Text>
                <View style={[styles.modalInputWrapper, { borderColor: isDarkMode ? '#333' : '#EEE', backgroundColor: isDarkMode ? '#121411' : '#FFF' }]}>
                  <Lock color="#555" size={20} />
                  <TextInput secureTextEntry={!showConfirmPass} placeholder=".........." placeholderTextColor="#555" style={[styles.modalInput, { color: currentTheme.textPrimary }]} />
                  <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                    <Eye color={showConfirmPass ? ACTIVE_GREEN : "#555"} size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={[styles.modalSubmitBtn, { backgroundColor: ACTIVE_GREEN }]} onPress={() => setRegisterVisible(false)}>
                <Text style={styles.modalSubmitText}>Cadastrar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL CONFIRMAÇÃO */}
      <Modal animationType="fade" transparent={true} visible={confirmModal.visible}>
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmBox, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]}>
            <Text style={[styles.confirmTitle, { color: currentTheme.textPrimary }]}>Confirmar Acção</Text>
            <Text style={[styles.confirmText, { color: isDarkMode ? '#AAA' : '#666' }]}>Deseja {confirmModal.type} este usuário?</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={styles.cancelActionBtn} onPress={() => setConfirmModal({ ...confirmModal, visible: false })}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmActionBtn, { backgroundColor: confirmModal.type === 'deletar' ? '#db2626' : ACTIVE_GREEN }]} 
                onPress={() => setConfirmModal({ ...confirmModal, visible: false })}
              >
                <Text style={styles.confirmBtnText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 20 },
  statCard: { width: '23%', paddingVertical: 12, alignItems: 'center', borderRadius: 15, borderWidth: 1 },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '700', marginTop: 4, textTransform: 'uppercase' },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50, marginBottom: 15 },
  searchInput: { flex: 1, marginLeft: 10, fontWeight: '500' },
  filterSection: { marginBottom: 20 },
  filterScroll: { gap: 10, paddingRight: 20 },
  filterChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  activeChip: { backgroundColor: '#47e426' }, // Verde sólido quando ativo
  filterChipText: { fontSize: 13, fontWeight: '600' },
  activeChipText: { color: '#FFF', fontWeight: '800' },
  filterDivider: { width: 1, height: 20, marginHorizontal: 5, alignSelf: 'center' },
  createBtn: { height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 25, elevation: 2 },
  createBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  userCard: { borderRadius: 22, padding: 18, marginBottom: 16, borderWidth: 1, elevation: 1 },
  userHeader: { flexDirection: 'row', marginBottom: 18 },
  avatarPlaceholder: { width: 55, height: 55, borderRadius: 18 },
  userInfo: { marginLeft: 15, flex: 1 },
  nameRoleRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  userName: { fontSize: 16, fontWeight: '800' },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  roleText: { fontSize: 10, fontWeight: '800' },
  userEmail: { fontSize: 13, marginTop: 4, fontWeight: '500' },
  userDate: { fontSize: 11, marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 10 },
  statusBtn: { flex: 1, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  visualizeBtn: { flex: 1, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { width: 45, height: 40, borderRadius: 12, backgroundColor: '#db2626', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  btnTextGreen: { fontSize: 12, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  registerModalContainer: { width: '90%', borderRadius: 30, padding: 25, maxHeight: '85%' },
  closeBtn: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
  modalHeaderTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 25 },
  modalInputGroup: { marginBottom: 18 },
  modalLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  modalInputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 15, paddingHorizontal: 15, height: 55 },
  modalInput: { flex: 1, marginLeft: 12, fontSize: 15 },
  modalSubmitBtn: { height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  modalSubmitText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  confirmBox: { width: '85%', borderRadius: 25, padding: 25, alignItems: 'center' },
  confirmTitle: { fontSize: 20, fontWeight: '800', marginBottom: 10 },
  confirmText: { fontSize: 15, textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  confirmActions: { flexDirection: 'row', gap: 15 },
  cancelActionBtn: { flex: 1, height: 45, justifyContent: 'center', alignItems: 'center' },
  confirmActionBtn: { flex: 1, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cancelText: { color: '#777', fontWeight: '700' },
  confirmBtnText: { color: '#FFF', fontWeight: '800' }
});