import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Info, 
  Stethoscope, 
  ShieldCheck, 
  AlertTriangle, 
  Bookmark,
  Home,
  Trash2
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { PrimaryButton, ConfirmationModal, AppHeader } from '../components/central';

const plantPhoto = require('../../assets/check.jpg');

export default function DiagnosticResultScreen({ navigation, route }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const { isAdminView } = route.params || {};

  const [expandDesc, setExpandDesc] = useState(false);
  const [expandTreat, setExpandTreat] = useState(false);
  const [expandPrev, setExpandPrev] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const isLoggedIn = true; 
  const activeColor = THEME.primary;

  const handleAction = () => {
    if (isAdminView) {
      setModalVisible(true);
      return;
    }

    if (isLoggedIn) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } else {
      Alert.alert(
        "Atenção",
        "Para salvar este diagnóstico permanentemente, você precisa estar logado.",
        [
          { text: "Depois", style: "cancel" },
          { text: "Fazer Login", onPress: () => navigation.navigate('Login') }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {isAdminView ? <AppHeader showBack={true} />: ''}
      

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Imagem Original */}
        <View style={styles.imageWrapper}>
          <Image source={plantPhoto} style={[styles.mainImage, isDarkMode && { opacity: 0.85 }]} />
          <View style={styles.labelPhoto}>
            <Text style={styles.labelText}>Foto Original</Text>
          </View>
        </View>

        {/* Cabeçalho do Diagnóstico */}
        <View style={styles.titleSection}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.foundText, { color: activeColor }]}>Diagnóstico encontrado</Text>
            <Text style={[styles.diseaseTitle, { color: currentTheme.textPrimary }]}>Oidio / Powdery Mildew</Text>
          </View>
          <View style={[styles.confidenceBadge, { borderColor: activeColor }]}>
            <Text style={[styles.confidenceValue, { color: activeColor }]}>96%</Text>
            <Text style={[styles.confidenceLabel, { color: activeColor }]}>Confiança</Text>
          </View>
        </View>

        {/* Card Descrição - No Dark mode usamos um tom de verde musgo muito sutil */}
        <View style={[
            styles.card, 
            { backgroundColor: isDarkMode ? 'rgba(71, 228, 38, 0.1)' : '#d4f9c6' }
        ]}>
          <View style={styles.cardHeader}>
            <Info color={activeColor} size={22} />
            <Text style={[styles.cardTitle, { color: isDarkMode ? activeColor : '#1B1919' }]}>Descrição</Text>
          </View>
          <Text 
            style={[styles.cardBody, { color: isDarkMode ? '#CCC' : '#555' }]} 
            numberOfLines={expandDesc ? undefined : 3}
          >
            O oídio é uma doença fúngica que afeta uma ampla gama de plantas. Esta doença pode ser identificada por manchas brancas pulverulentas que se formam nas folhas e caules.
          </Text>
          <TouchableOpacity onPress={() => setExpandDesc(!expandDesc)}>
            <Text style={[styles.verMais, { color: isDarkMode ? '#FFF' : '#1B1919' }]}>
                {expandDesc ? "Ver menos" : "Ver mais..."}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card Tratamento - Outline dinâmico */}
        <View style={[
            styles.card, 
            { 
              backgroundColor: isDarkMode ? '#121411' : '#FFF', 
              borderWidth: 1, 
              borderColor: isDarkMode ? '#333' : '#EEE' 
            }
        ]}>
          <View style={styles.cardHeader}>
            <Stethoscope color={activeColor} size={22} />
            <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Tratamento</Text>
          </View>

          <View style={[styles.innerBox, { backgroundColor: isDarkMode ? '#1A1D19' : '#edf2f0' }]}>
            <Text style={[styles.innerTitle, { color: isDarkMode ? activeColor : '#1B1919' }]}>Solução caseira</Text>
            <Text style={[styles.innerBody, { color: isDarkMode ? '#AAA' : '#666' }]}>
              Misture 1 colher de bicarbonato com 4 litros de água.
            </Text>
          </View>

          <Text 
            style={[styles.cardBody, { color: isDarkMode ? '#CCC' : '#555' }]} 
            numberOfLines={expandTreat ? undefined : 3}
          >
            Remova as partes afetadas imediatamente para evitar a propagação.
          </Text>
          <TouchableOpacity onPress={() => setExpandTreat(!expandTreat)}>
            <Text style={[styles.verMais, { color: isDarkMode ? '#FFF' : '#1B1919' }]}>Ver mais...</Text>
          </TouchableOpacity>
        </View>

        {/* Card Prevenção */}
        <View style={[
            styles.card, 
            { backgroundColor: isDarkMode ? '#1A1D19' : '#f5f5f5' }
        ]}>
          <View style={styles.cardHeader}>
            <ShieldCheck color={activeColor} size={22} />
            <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Prevenção</Text>
          </View>
          <Text style={[styles.cardBody, { color: isDarkMode ? '#CCC' : '#555' }]}>
            Mantenha um espaçamento adequado entre as plantas para garantir a circulação de ar.
          </Text>
          <TouchableOpacity onPress={() => setExpandDesc(!expandDesc)}>
            <Text style={[styles.verMais, { color: isDarkMode ? '#FFF' : '#1B1919' }]}>
                {expandDesc ? "Ver menos" : "Ver mais..."}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Aviso de Isenção */}
        <View style={[
            styles.alertBox, 
            { backgroundColor: isDarkMode ? '#233814' : '#c6f9cc' }
        ]}>
          <AlertTriangle color={isDarkMode ? activeColor : "#1B1919"} size={24} />
          <Text style={[styles.alertText, { color: isDarkMode ? '#FFF' : '#1B1919' }]}>
            Este diagnóstico é um apoio e não substitui um especialista.
          </Text>
        </View>

        {/* Botão Dinâmico */}
        <View style={{ paddingHorizontal: 20, marginTop: 10, marginBottom: 10 }}>
          {isAdminView ? (
            <PrimaryButton 
              variant='danger'
              title="Eliminar do Histórico" 
              onPress={handleAction} 
              icon={Trash2}
              iconSize={22}
            />
          ) : isLoggedIn ? (
            <PrimaryButton 
              variant='outline'
              title="Voltar para a Home" 
              onPress={handleAction} 
              icon={Home}
              iconSize={22}
              style={isDarkMode && { borderColor: '#333' }}
              textStyle={isDarkMode && { color: '#FFF' }}
            />
          ) : (
            <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: isDarkMode ? '#1A1D19' : '#edf2f0' }]} 
                onPress={handleAction}
            >
              <Bookmark color={isDarkMode ? '#AAA' : "#666"} size={24} />
              <Text style={[styles.saveButtonText, { color: isDarkMode ? '#AAA' : '#666' }]}>Guardar no Histórico</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>

      <ConfirmationModal
        visible={modalVisible}
        title="Eliminar Registro"
        message="Tem certeza que deseja excluir permanentemente este diagnóstico do histórico?"
        onConfirm={() => { setModalVisible(false); navigation.goBack(); }}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  imageWrapper: { margin: 20, height: 270, borderRadius: 24, overflow: 'hidden', position: 'relative' },
  mainImage: { width: '100%', height: '100%' },
  labelPhoto: { position: 'absolute', top: 15, left: 15, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  labelText: { color: '#FFF', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  
  titleSection: { flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center', marginBottom: 25 },
  foundText: { fontWeight: '800', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
  diseaseTitle: { marginTop: 4, fontSize: 24, fontWeight: '900' },
  
  confidenceBadge: { borderWidth: 1.5, borderRadius: 14, padding: 8, alignItems: 'center', minWidth: 70 },
  confidenceValue: { fontWeight: '900', fontSize: 18 },
  confidenceLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  
  card: { marginHorizontal: 20, borderRadius: 24, padding: 20, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: '800', marginLeft: 10 },
  cardBody: { fontSize: 14, lineHeight: 22 },
  verMais: { fontWeight: '800', marginTop: 12, fontSize: 13 },
  
  innerBox: { borderRadius: 18, padding: 15, marginVertical: 12 },
  innerTitle: { fontWeight: '800', fontSize: 14, marginBottom: 4 },
  innerBody: { fontSize: 13, lineHeight: 18 },

  alertBox: { flexDirection: 'row', marginHorizontal: 20, padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  alertText: { flex: 1, marginLeft: 12, fontSize: 13, fontWeight: '700', lineHeight: 18 },
  
  saveButton: { flexDirection: 'row', padding: 18, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  saveButtonText: { marginLeft: 10, fontWeight: '800', fontSize: 16 },
});