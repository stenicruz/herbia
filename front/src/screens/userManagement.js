import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Pressable 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, Trash2, Home, Users, Leaf, User as UserIcon, Mail, Lock, EyeOff, X, Eye 
} from 'lucide-react-native';

const ACTIVE_GREEN = '#47e426';

export default function UserManagementScreen() {
  // --- ESTADOS ---
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

  // --- FILTRAGEM ---
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
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['right', 'top', 'left', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Gestão de Usuários</Text>

        {/* 1. CARDS DE ESTATÍSTICAS (RESTAURADOS) */}
        <View style={styles.statsRow}>
          <StatCard label="Total" value={USER_DATA.length} />
          <StatCard label="Activos" value={USER_DATA.filter(u => u.status === 'Active').length} />
          <StatCard label="Inactivos" value={USER_DATA.filter(u => u.status === 'Inactive').length} />
          <StatCard label="Admins" value={USER_DATA.filter(u => u.role === 'Admin').length} />
        </View>

        <View style={styles.searchBar}>
          <Search color="#CCC" size={20} />
          <TextInput 
            placeholder="Pesquise por nome ou email" 
            style={styles.searchInput} 
            placeholderTextColor="#CCC"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* 2. FILTROS (ADICIONADO USUÁRIO) */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity style={[styles.filterChip, filterStatus === 'All' && styles.activeChip]} onPress={() => setFilterStatus('All')}>
              <Text style={[styles.filterChipText, filterStatus === 'All' && styles.activeChipText]}>Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, filterStatus === 'Active' && styles.activeChip]} onPress={() => setFilterStatus('Active')}>
              <Text style={[styles.filterChipText, filterStatus === 'Active' && styles.activeChipText]}>Ativos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, filterStatus === 'Inactive' && styles.activeChip]} onPress={() => setFilterStatus('Inactive')}>
              <Text style={[styles.filterChipText, filterStatus === 'Inactive' && styles.activeChipText]}>Inativos</Text>
            </TouchableOpacity>
            <View style={styles.filterDivider} />
            <TouchableOpacity style={[styles.filterChip, filterRole === 'Admin' && styles.activeChip]} onPress={() => setFilterRole(filterRole === 'Admin' ? 'All' : 'Admin')}>
              <Text style={[styles.filterChipText, filterRole === 'Admin' && styles.activeChipText]}>Admins</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, filterRole === 'User' && styles.activeChip]} onPress={() => setFilterRole(filterRole === 'User' ? 'All' : 'User')}>
              <Text style={[styles.filterChipText, filterRole === 'User' && styles.activeChipText]}>Usuários</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.createBtn} onPress={() => setRegisterVisible(true)}>
          <Text style={styles.createBtnText}>Criar Administrador</Text>
        </TouchableOpacity>

        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.avatarPlaceholder} />
              <View style={styles.userInfo}>
                <View style={styles.nameRoleRow}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: user.role === 'Admin' ? '#B8FFAD' : '#EEE' }]}>
                    <Text style={styles.roleText}>{user.role}</Text>
                  </View>
                </View>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userDate}>Desde: {user.date}</Text>
              </View>              
            </View>

            <View style={styles.actionRow}>
              {/* CORES DOS BOTÕES CORRIGIDAS */}
              <TouchableOpacity 
                style={[styles.statusBtn, { backgroundColor: user.status === 'Active' ? ACTIVE_GREEN : '#BBB' }]}
                onPress={() => handleAction(user.status === 'Active' ? 'desativar' : 'ativar', user.id)}
              >
                <Text style={styles.btnText}>{user.status === 'Active' ? 'Desactivar' : 'Activar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.visualizeBtn}><Text style={styles.btnTextGreen}>Visualizar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleAction('deletar', user.id)}><Trash2 color="#FFF" size={18} /></TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* --- MODAL CADASTRAR ADM (ADICIONADO INPUT NOME) --- */}
      <Modal animationType="none" transparent={true} visible={registerVisible}>
        <Pressable style={styles.modalOverlay} onPress={() => setRegisterVisible(false)}>
          <Pressable style={styles.registerModalContainer} onPress={(e) => e.stopPropagation()}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setRegisterVisible(false)}><X color="#333" size={24} /></TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Cadastrar ADM</Text>
            
            {/* NOVO INPUT: Nome Completo */}
            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Nome Completo</Text>
              <View style={styles.modalInputWrapper}>
                <UserIcon color="#CCC" size={20} />
                <TextInput placeholder="Nome do Administrador" placeholderTextColor="#999" style={styles.modalInput} />
              </View>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>E-mail</Text>
              <View style={styles.modalInputWrapper}>
                <Mail color="#CCC" size={20} />
                <TextInput placeholder="email@exemplo.com" placeholderTextColor="#999" style={styles.modalInput} />
              </View>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Palavra-Passe</Text>
              <View style={styles.modalInputWrapper}>
                <Lock color="#CCC" size={20} />
                <TextInput secureTextEntry={!showPass} placeholder=".........." placeholderTextColor="#999" style={styles.modalInput} />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  {showPass ? <Eye color={ACTIVE_GREEN} size={20} /> : <EyeOff color="#333" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Confirmar Palavra-Passe</Text>
              <View style={styles.modalInputWrapper}>
                <Lock color="#CCC" size={20} />
                <TextInput secureTextEntry={!showConfirmPass} placeholder=".........." placeholderTextColor="#999" style={styles.modalInput} />
                <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                  {showConfirmPass ? <Eye color={ACTIVE_GREEN} size={20} /> : <EyeOff color="#333" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.modalSubmitBtn} onPress={() => setRegisterVisible(false)}>
              <Text style={styles.modalSubmitText}>Cadastrar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* MODAL CONFIRMAÇÃO (MANTIDO) */}
      <Modal animationType="none" transparent={true} visible={confirmModal.visible}>
        <Pressable style={styles.modalOverlay} onPress={() => setConfirmModal({ ...confirmModal, visible: false })}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Confirmar Acção</Text>
            <Text style={styles.confirmText}>Deseja {confirmModal.type} este usuário?</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={styles.cancelActionBtn} onPress={() => setConfirmModal({ ...confirmModal, visible: false })}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.confirmActionBtn, { backgroundColor: confirmModal.type === 'deletar' ? '#db2626' : ACTIVE_GREEN }]} onPress={() => setConfirmModal({ ...confirmModal, visible: false })}><Text style={styles.confirmBtnText}>Confirmar</Text></TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '700', color: '#333', marginVertical: 30 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: '#fafcf9' ,width: '22%', paddingVertical: 10, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#cfc9c9' },
  statValue: { fontSize: 16, fontWeight: '800', color: ACTIVE_GREEN },
  statLabel: { fontSize: 9, color: ACTIVE_GREEN, fontWeight: '600', textAlign: 'center', color: '#3f3d3d'},
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 12, paddingHorizontal: 15, height: 45, marginBottom: 15 },
  searchInput: { flex: 1, marginLeft: 10, color: '#333' },
  filterSection: { marginBottom: 20 },
  filterScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0' },
  activeChip: { backgroundColor: ACTIVE_GREEN },
  filterChipText: { fontSize: 12, color: '#666' },
  activeChipText: { color: '#FFF', fontWeight: '700' },
  filterDivider: { width: 1, height: 20, backgroundColor: '#EEE', marginHorizontal: 5 },
  createBtn: { backgroundColor: ACTIVE_GREEN, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  createBtnText: { color: '#FFF', fontWeight: '700' },
  userCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#F5F5F5', elevation: 2 },
  userHeader: { flexDirection: 'row', marginBottom: 15 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E1F2FF' },
  userInfo: { marginLeft: 12, flex: 1 },
  nameRoleRow: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  userName: { fontSize: 15, fontWeight: '700', color: '#333' },
  roleBadge: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: 8, backgroundColor: '#EEE' },
  roleText: { fontSize: 10, fontWeight: '700', color: '#333' },
  userEmail: { fontSize: 13, color: '#999', marginTop: 5 },
  userDate: { fontSize: 12, color: '#BBB', marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 10 },
  statusBtn: { flex: 2, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  visualizeBtn: { flex: 2, height: 35, borderRadius: 10, backgroundColor: '#B8FFAD', justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { width: 40, height: 35, borderRadius: 10, backgroundColor: '#db2626', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  btnTextGreen: { color: '#333', fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  registerModalContainer: { width: '85%', backgroundColor: '#FFF', borderRadius: 30, padding: 25, position: 'relative' },
  closeBtn: { position: 'absolute', top: 20, right: 20, zIndex: 1 },
  modalHeaderTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  modalInputGroup: { marginBottom: 15 },
  modalLabel: { fontSize: 13, color: '#666', marginBottom: 5 },
  modalInputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 12, paddingHorizontal: 15, height: 50 },
  modalInput: { flex: 1, marginLeft: 10, color: '#333' },
  modalSubmitBtn: { backgroundColor: ACTIVE_GREEN, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  modalSubmitText: { color: '#FFF', fontWeight: '700' },
  confirmBox: { width: '80%', backgroundColor: '#FFF', borderRadius: 20, padding: 20, alignItems: 'center' },
  confirmTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  confirmText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  confirmActions: { flexDirection: 'row', gap: 10 },
  cancelActionBtn: { flex: 1, height: 40, justifyContent: 'center' },
  confirmActionBtn: { flex: 1, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  cancelText: { color: '#999', textAlign: 'center' },
  confirmBtnText: { color: '#FFF', fontWeight: '700' }
});