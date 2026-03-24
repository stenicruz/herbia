import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity,
  ScrollView, Alert, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Info, Stethoscope, ShieldCheck, AlertTriangle, Bookmark, Home, Trash2
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { PrimaryButton, ConfirmationModal, AppHeader } from '../components/central';
import plantService from '../services/plantService';
import adminService from '../services/adminService';

  // ✅ Fora do componente principal — evita re-renders
  const ExpandableText = ({ text, isDarkMode, expanded, onToggle, style }) => {
  const [showButton, setShowButton] = useState(false);

  return (
    <View style={style}>
      <Text
        style={[styles.cardBody, { color: isDarkMode ? '#CCC' : '#555' }]}
        numberOfLines={expanded ? undefined : 10} // ✅ Limita a 5 linhas quando não expandido
        onTextLayout={(e) => {
          // ✅ Só mostra o botão se o texto original tiver mais de 5 linhas
          if (e.nativeEvent.lines.length > 10 && !expanded) {
            setShowButton(true);
          }
        }}
      >
        {text}
      </Text>
      
      {showButton && (
        <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
          <Text style={[styles.verMais, { color: isDarkMode ? THEME.primary : '#1B1919' }]}>
            {expanded ? "Ver menos" : "Ver mais..."}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function DiagnosticResultScreen({ navigation, route }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  // Dados vindos do ConfirmPhoto ou do histórico (admin)
  const { resultado, imageUri, isLoggedIn, isAdminView, analiseId } = route.params || {};

  const isFromHistory = !!analiseId || !!resultado?.id;

  const [expandDesc, setExpandDesc] = useState(false);
  const [expandTreat, setExpandTreat] = useState(false);
  const [expandPrev, setExpandPrev] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deletando, setDeletando] = useState(false);

  const activeColor = THEME.primary;

  // Dados do resultado — suporta tanto resultado da IA como do histórico
  const planta = resultado?.planta || resultado?.planta_nome || 'Desconhecido';
  const doenca = resultado?.doenca || resultado?.nome || 'Não identificado';
  const estado = resultado?.estado || 'N/A';
  const descricao = resultado?.descricao || '';
  const prevencao = resultado?.prevencao || '';
  const caseiro = resultado?.caseiro || resultado?.tratamento_caseiro || '';
  const convencional = resultado?.convencional || resultado?.tratamento_convencional || '';
  const precisao = resultado?.precisao || 0;

  // O histórico usa 'imagem_url', a análise local usa 'imagem' ou 'imageUri'
  const imagemUrl = resultado?.imagem_url || resultado?.imagem || imageUri || '';

  const [expandConv, setExpandConv] = useState(false);

  const handleAction = async () => {
  if (isAdminView) {
    setModalVisible(true);
    return;
  }

  if (isLoggedIn) {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  } else {
    // --- NOVO: Guardar temporariamente para salvar após login ---
    const analisePendente = {
      planta,
      doenca,
      estado,
      precisao,
      descricao,
      prevencao,
      caseiro,
      convencional,
      imagem: imagemUrl,
      classe_ia: resultado?.classe_ia 
    };

    try {
      await AsyncStorage.setItem('@Herbia:analise_pendente', JSON.stringify(analisePendente));
      
      Alert.alert(
        "Guardar Diagnóstico",
        "Para guardar este diagnóstico no histórico precisa de estar logado.",
        [
          { text: "Depois", style: "cancel", onPress: () => navigation.navigate('Main') },
          { text: "Fazer Login", onPress: () => navigation.navigate('Login') }
        ]
      );
    } catch (e) {
      console.error("Erro ao guardar análise pendente", e);
    }
  }
  };

  const handleDelete = async () => {
    try {
      setDeletando(true);
      setModalVisible(false);

      // Verifica se é admin ou utilizador normal
      const storedUser = await AsyncStorage.getItem('@Herbia:user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user?.role === 'admin') {
        await adminService.eliminarAnalise(analiseId);
      } else {
        await plantService.deletarAnalise(analiseId);
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível eliminar esta análise.");
    } finally {
      setDeletando(false);
    }
  };



  const isSaudavel = estado === 'Saudável';

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {(isAdminView || isFromHistory) && (
        <AppHeader title="" showBack={true} />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Imagem Original */}
        <View style={styles.imageWrapper}>
          {imagemUrl ? (
            <Image
              source={{ uri: imagemUrl }}
              style={[styles.mainImage, isDarkMode && { opacity: 0.85 }]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.mainImage, { backgroundColor: isDarkMode ? '#1A1D19' : '#E8F5E9' }]} />
          )}
          <View style={styles.labelPhoto}>
            <Text style={styles.labelText}>Foto Original</Text>
          </View>
        </View>

        {/* Cabeçalho do Diagnóstico */}
        <View style={styles.titleSection}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.foundText, { color: isSaudavel ? activeColor : '#FF5252' }]}>
              {isSaudavel ? 'Planta Saudável' : 'Doença Detectada'}
            </Text>
            <Text style={[styles.plantaText, { color: currentTheme.textSecondary }]}>
              {planta}
            </Text>
            <Text style={[styles.diseaseTitle, { color: currentTheme.textPrimary }]}>
              {doenca}
            </Text>
          </View>
          <View style={[styles.confidenceBadge, { borderColor: activeColor }]}>
            <Text style={[styles.confidenceValue, { color: activeColor }]}>{precisao}%</Text>
            <Text style={[styles.confidenceLabel, { color: activeColor }]}>Confiança</Text>
          </View>
        </View>

        {/* Card Descrição */}
        {descricao ? (
          <View style={[styles.card, { backgroundColor: isDarkMode ? 'rgba(71, 228, 38, 0.1)' : '#d4f9c6' }]}>
            <View style={styles.cardHeader}>
              <Info color={activeColor} size={22} />
              <Text style={[styles.cardTitle, { color: isDarkMode ? activeColor : '#1B1919' }]}>Descrição</Text>
            </View>
            <ExpandableText
              text={descricao}
              isDarkMode={isDarkMode}
              expanded={expandDesc} // ✅ Corrigido para expandDesc
              onToggle={() => setExpandDesc(!expandDesc)} // ✅ Corrigido para setExpandDesc
            />
          </View>
        ) : null}

        {/* Card Tratamento — só aparece se tiver conteúdo real */}
        {(caseiro && caseiro !== 'N/A') || (convencional && convencional !== 'N/A') ? (
          <View style={[styles.card, {
            backgroundColor: isDarkMode ? '#121411' : '#FFF',
            borderWidth: 1, borderColor: isDarkMode ? '#333' : '#EEE'
          }]}>
            <View style={styles.cardHeader}>
              <Stethoscope color={activeColor} size={22} />
              <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Tratamento</Text>
            </View>

            {caseiro && caseiro !== 'N/A' && (
              <View style={[styles.innerBox, { backgroundColor: isDarkMode ? '#1A1D19' : '#edf2f0' }]}>
                <Text style={[styles.innerTitle, { color: isDarkMode ? activeColor : '#1B1919' }]}>
                  Solução Caseira
                </Text>
                <ExpandableText
                  text={caseiro}
                  isDarkMode={isDarkMode}
                  expanded={expandTreat}
                  onToggle={() => setExpandTreat(!expandTreat)}
                />
              </View>
            )}

            {convencional && convencional !== 'N/A' && (
              <ExpandableText
                text={convencional}
                isDarkMode={isDarkMode}
                expanded={expandConv}
                onToggle={() => setExpandConv(!expandConv)}
                style={{ marginTop: 8 }}
              />
            )}
          </View>
        ) : null}

        {/* Card Prevenção */}
        {prevencao && prevencao !== 'N/A' ? (
          <View style={[styles.card, { backgroundColor: isDarkMode ? '#1A1D19' : '#f5f5f5' }]}>
            <View style={styles.cardHeader}>
              <ShieldCheck color={activeColor} size={22} />
              <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>Prevenção</Text>
            </View>
            <ExpandableText
              text={prevencao}
              isDarkMode={isDarkMode}
              expanded={expandPrev}
              onToggle={() => setExpandPrev(!expandPrev)}
            />
          </View>
        ) : null}

        {/* Aviso de Isenção */}
        <View style={[styles.alertBox, { backgroundColor: isDarkMode ? '#233814' : '#c6f9cc' }]}>
          <AlertTriangle color={isDarkMode ? activeColor : "#1B1919"} size={24} />
          <Text style={[styles.alertText, { color: isDarkMode ? '#FFF' : '#1B1919' }]}>
            Este diagnóstico é um apoio e não substitui um especialista agrícola.
          </Text>
        </View>

        {/* Botão de Acção */}
        <View style={{ paddingHorizontal: 20, marginTop: 10, marginBottom: 10 }}>
          {isAdminView ? (
            <PrimaryButton
              variant='danger'
              title="Eliminar do Histórico"
              onPress={handleAction}
              icon={Trash2}
              iconSize={22}
              loading={deletando}
            />
          ) : isFromHistory ? (
            // ✅ SE FOR HISTÓRICO: Não mostra nenhum botão de ação lá embaixo
            null 
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
              <Text style={[styles.saveButtonText, { color: isDarkMode ? '#AAA' : '#666' }]}>
                Guardar no Histórico
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={modalVisible}
        title="Eliminar Registo"
        description="Tem a certeza que deseja eliminar permanentemente este diagnóstico?"
        confirmText="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setModalVisible(false)}
        loading={deletando}
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
  plantaText: { fontSize: 14, marginTop: 2, fontWeight: '600' },
  diseaseTitle: { marginTop: 5, fontSize: 24, fontWeight: '900' },
  confidenceBadge: { borderWidth: 1.5, borderRadius: 14, padding: 9, alignItems: 'center', minWidth: 70 },
  confidenceValue: { fontWeight: '900', fontSize: 18 },
  confidenceLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', marginTop: 3 },
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