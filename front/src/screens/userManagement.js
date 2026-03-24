import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Modal, StatusBar, ActivityIndicator, Alert, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { 
  Search, Trash2, User as UserIcon, Mail, Lock, X, Eye
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/central.js';
import adminService from '../services/adminService'; // Importação do serviço

export default function UserManagementScreen({navigation}) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const ACTIVE_GREEN = THEME.primary;

  // --- ESTADOS DE DADOS ---
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, ativos: 0, inativos: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE UI ---
  const [registerVisible, setRegisterVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ visible: false, type: '', userId: null });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', '1', '0'
  const [filterRole, setFilterRole] = useState('All'); // 'All', 'admin', 'user'

  // --- ESTADOS DO FORMULÁRIO ---
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // --- CARREGAR DADOS DO BACK-END ---
  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await adminService.listarUsuarios();
      setUsers(data);
      
      // Cálculo das estatísticas dinâmicas
      setStats({
        total: data.length,
        ativos: data.filter(u => u.ativo === 1).length,
        inativos: data.filter(u => u.ativo === 0).length,
        admins: data.filter(u => u.tipo_usuario === 'admin').length
      });
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarUsuarios();
    }, [])
  );

  // --- LÓGICA DE FILTRAGEM ---
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || 
                          (filterStatus === 'Active' ? user.ativo === 1 : user.ativo === 0);
    const matchesRole = filterRole === 'All' || 
                        (filterRole === 'Admin' ? user.tipo_usuario === 'admin' : user.tipo_usuario === 'usuario');
    return matchesSearch && matchesStatus && matchesRole;
  });

  // --- AÇÕES (CRIAR, STATUS, DELETAR) ---
  const handleCreateAdmin = async () => {
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As palavras-passe não coincidem.");
      return;
    }
    try {
      await adminService.criarAdmin(nome, email, senha);
      setRegisterVisible(false);
      setNome(''); setEmail(''); setSenha(''); setConfirmarSenha('');
      carregarUsuarios();
    } catch (error) {
      Alert.alert("Erro", error.error || "Erro ao criar admin.");
    }
  };

  const handleConfirmAction = async () => {
  try {
    if (confirmModal.type === 'deletar') {
      await adminService.eliminarUsuario(confirmModal.userId);
    } else {
      const novoStatus = confirmModal.type === 'ativar' ? 1 : 0;
      await adminService.atualizarStatusUsuario(confirmModal.userId, novoStatus);
    }
    setConfirmModal({ ...confirmModal, visible: false });
    carregarUsuarios();
  } catch (error) {
    Alert.alert("Erro", error.error || "Não foi possível completar a acção.");
  }
};

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
      <AppHeader title="Gestão de Usuários" showBack={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.statsRow}>
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Activos" value={stats.ativos} />
          <StatCard label="Inactivos" value={stats.inativos} />
          <StatCard label="Admins" value={stats.admins} />
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
            <TouchableOpacity style={[styles.filterChip, { backgroundColor: isDarkMode ? '#121411' : '#F0F0F0' }, filterStatus === 'All' && styles.activeChip]} onPress={() => setFilterStatus('All')}>
              <Text style={[styles.filterChipText, { color: isDarkMode ? '#AAA' : '#666' }, filterStatus === 'All' && styles.activeChipText]}>Todos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterChip, { backgroundColor: isDarkMode ? '#121411' : '#F0F0F0' }, filterStatus === 'Active' && styles.activeChip]} onPress={() => setFilterStatus('Active')}>
              <Text style={[styles.filterChipText, { color: isDarkMode ? '#AAA' : '#666' }, filterStatus === 'Active' && styles.activeChipText]}>Ativos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterChip, { backgroundColor: isDarkMode ? '#121411' : '#F0F0F0' }, filterStatus === 'Inactive' && styles.activeChip]} onPress={() => setFilterStatus('Inactive')}>
              <Text style={[styles.filterChipText, { color: isDarkMode ? '#AAA' : '#666' }, filterStatus === 'Inactive' && styles.activeChipText]}>Inativos</Text>
            </TouchableOpacity>

            <View style={[styles.filterDivider, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]} />

            <TouchableOpacity style={[styles.filterChip, { backgroundColor: isDarkMode ? '#121411' : '#F0F0F0' }, filterRole === 'Admin' && styles.activeChip]} onPress={() => setFilterRole(filterRole === 'Admin' ? 'All' : 'Admin')}>
              <Text style={[styles.filterChipText, { color: isDarkMode ? '#AAA' : '#666' }, filterRole === 'Admin' && styles.activeChipText]}>Admins</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterChip, { backgroundColor: isDarkMode ? '#121411' : '#F0F0F0' }, filterRole === 'User' && styles.activeChip]} onPress={() => setFilterRole(filterRole === 'User' ? 'All' : 'User')}>
              <Text style={[styles.filterChipText, { color: isDarkMode ? '#AAA' : '#666' }, filterRole === 'User' && styles.activeChipText]}>Usuários</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <TouchableOpacity style={[styles.createBtn, { backgroundColor: ACTIVE_GREEN }]} onPress={() => setRegisterVisible(true)}>
          <Text style={styles.createBtnText}>Criar Administrador</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color={ACTIVE_GREEN} />
        ) : (
          filteredUsers.map((user) => (
            <View key={user.id} style={[styles.userCard, { 
              backgroundColor: isDarkMode ? '#121411' : '#FFF', 
              borderColor: isDarkMode ? '#1A2E1A' : '#F5F5F5' 
            }]}>
              <View style={styles.userHeader}>
                <View style={styles.avatarPlaceholder}>
                {user.foto_perfil ? (
                  <Image 
                    source={{ uri: user.foto_perfil }} 
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <UserIcon color={isDarkMode ? "#333" : "#A1C9FF"} size={28} />
                )}
              </View>
                <View style={styles.userInfo}>
                  <View style={styles.nameRoleRow}>
                    <Text style={[styles.userName, { color: currentTheme.textPrimary }]}>{user.nome}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: user.tipo_usuario === 'admin' ? (isDarkMode ? '#1A2E1A' : '#B8FFAD') : (isDarkMode ? '#222' : '#EEE') }]}>
                      <Text style={[styles.roleText, { color: user.tipo_usuario === 'admin' ? ACTIVE_GREEN : (isDarkMode ? '#AAA' : '#333') }]}>{user.tipo_usuario}</Text>
                    </View>
                  </View>
                  <Text style={[styles.userEmail, { color: isDarkMode ? '#777' : '#999' }]}>{user.email}</Text>
                  <Text style={[styles.userDate, { color: isDarkMode ? '#555' : '#BBB' }]}>Desde: {new Date(user.criado_em).toLocaleDateString()}</Text>
                </View>               
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={[styles.statusBtn, { backgroundColor: user.ativo === 1 ? ACTIVE_GREEN : (isDarkMode ? '#333' : '#BBB') }]}
                  onPress={() => handleAction(user.ativo === 1 ? 'desativar' : 'ativar', user.id)}
                >
                  <Text style={styles.btnText}>{user.ativo === 1 ? 'Desactivar' : 'Activar'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.visualizeBtn, { backgroundColor: isDarkMode ? '#1A2E1A' : '#B8FFAD' }]} onPress={() => navigation.navigate('UserDetails', { userId: user.id })}>
                  <Text style={[styles.btnTextGreen, { color: isDarkMode ? ACTIVE_GREEN : '#333' }]}>Visualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleAction('deletar', user.id)}><Trash2 color="#FFF" size={18} /></TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
              <View style={styles.modalInputGroup}>
                <Text style={[styles.modalLabel, { color: isDarkMode ? '#AAA' : '#666' }]}>Nome Completo</Text>
                <View style={[styles.modalInputWrapper, { borderColor: isDarkMode ? '#333' : '#EEE', backgroundColor: isDarkMode ? '#121411' : '#FFF' }]}>
                  <UserIcon color="#555" size={20} />
                  <TextInput value={nome} onChangeText={setNome} placeholder="Nome do Administrador" placeholderTextColor="#555" style={[styles.modalInput, { color: currentTheme.textPrimary }]} />
                </View>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={[styles.modalLabel, { color: isDarkMode ? '#AAA' : '#666' }]}>E-mail</Text>
                <View style={[styles.modalInputWrapper, { borderColor: isDarkMode ? '#333' : '#EEE', backgroundColor: isDarkMode ? '#121411' : '#FFF' }]}>
                  <Mail color="#555" size={20} />
                  <TextInput value={email} onChangeText={setEmail} placeholder="email@exemplo.com" placeholderTextColor="#555" style={[styles.modalInput, { color: currentTheme.textPrimary }]} />
                </View>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={[styles.modalLabel, { color: isDarkMode ? '#AAA' : '#666' }]}>Palavra-Passe</Text>
                <View style={[styles.modalInputWrapper, { borderColor: isDarkMode ? '#333' : '#EEE', backgroundColor: isDarkMode ? '#121411' : '#FFF' }]}>
                  <Lock color="#555" size={20} />
                  <TextInput value={senha} onChangeText={setSenha} secureTextEntry={!showPass} placeholder=".........." placeholderTextColor="#555" style={[styles.modalInput, { color: currentTheme.textPrimary }]} />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    <Eye color={showPass ? ACTIVE_GREEN : "#555"} size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={[styles.modalLabel, { color: isDarkMode ? '#AAA' : '#666' }]}>Confirmar Palavra-Passe</Text>
                <View style={[styles.modalInputWrapper, { borderColor: isDarkMode ? '#333' : '#EEE', backgroundColor: isDarkMode ? '#121411' : '#FFF' }]}>
                  <Lock color="#555" size={20} />
                  <TextInput value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry={!showConfirmPass} placeholder=".........." placeholderTextColor="#555" style={[styles.modalInput, { color: currentTheme.textPrimary }]} />
                  <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                    <Eye color={showConfirmPass ? ACTIVE_GREEN : "#555"} size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={[styles.modalSubmitBtn, { backgroundColor: ACTIVE_GREEN }]} onPress={handleCreateAdmin}>
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
            <View  style={styles.confirmActions}>
              <TouchableOpacity style={styles.cancelActionBtn} onPress={() => setConfirmModal({ ...confirmModal, visible: false })}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmActionBtn, { backgroundColor: confirmModal.type === 'deletar' ? '#db2626' : ACTIVE_GREEN }]} 
                onPress={handleConfirmAction}
              >
                <Text style={styles.confirmBtnText}>Confirmar</Text>
              </TouchableOpacity>
            </View >
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// OS ESTILOS PERMANECEM EXATAMENTE OS MESMOS QUE VOCÊ ENVIOU
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
  activeChip: { backgroundColor: '#47e426' }, 
  filterChipText: { fontSize: 13, fontWeight: '600' },
  activeChipText: { color: '#FFF', fontWeight: '800' },
  filterDivider: { width: 1, height: 20, marginHorizontal: 5, alignSelf: 'center' },
  createBtn: { height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 25, elevation: 2 },
  createBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  userCard: { borderRadius: 22, padding: 18, marginBottom: 16, borderWidth: 1, elevation: 1 },
  userHeader: { flexDirection: 'row', marginBottom: 18 },
  avatarPlaceholder: { 
  width: 55, 
  height: 55, 
  borderRadius: 18,
  overflow: 'hidden', // Importante para a imagem respeitar o arredondamento
  justifyContent: 'center',
  alignItems: 'center'
},
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