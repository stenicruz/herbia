import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert 
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

import { PrimaryButton, ConfirmationModal, AppHeader } from '../components/central';

const plantPhoto = require('../../assets/check.jpg');



export default function DiagnosticResultScreen({ navigation, route }) {
  const { isAdminView } = route.params || {};

  // Estados para o "Ver Mais"
  const [expandDesc, setExpandDesc] = useState(false);
  const [expandTreat, setExpandTreat] = useState(false);
  const [expandPrev, setExpandPrev] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const isLoggedIn = true; 

const handleAction = () => {
    if (isAdminView) {
      // Se for admin, abre o modal de confirmação em vez de ir para a home
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

  const confirmDelete = () => {
    setModalVisible(false);
    // Aqui viria a lógica de deletar no banco de dados
    
    // Feedback e Redirecionamento
    navigation.reset({
      index: 0,
      routes: [{ name: 'AdminMain' }],
    });
  };

  const activeColor = '#47e426';

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <AppHeader
        showBack={isAdminView ? true :false} 
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Imagem Original */}
        <View style={styles.imageWrapper}>
          <Image source={plantPhoto} style={styles.mainImage} />
          <View style={styles.labelPhoto}>
            <Text style={styles.labelText}>Foto Original</Text>
          </View>
        </View>

        {/* Cabeçalho do Diagnóstico */}
        <View style={styles.titleSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.foundText}>Diagnóstico encontrado</Text>
            <Text style={styles.diseaseTitle}>Oidio / Powdery Mildew</Text>
          </View>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceValue}>96%</Text>
            <Text style={styles.confidenceLabel}>Confiança</Text>
          </View>
        </View>

        {/* Card Descrição */}
        <View style={[styles.card, styles.descCard]}>
          <View style={styles.cardHeader}>
            <Info color={activeColor} size={22} />
            <Text style={styles.cardTitle}>Descrição</Text>
          </View>
          <Text 
            style={styles.cardBody} 
            numberOfLines={expandDesc ? undefined : 3}
          >
            O oídio é uma doença fúngica que afeta uma ampla gama de plantas. Esta doença pode ser identificada por manchas brancas pulverulentas que se formam nas folhas e caules. Com o tempo, as folhas podem ficar amareladas e secas, prejudicando o crescimento.
          </Text>
          <TouchableOpacity onPress={() => setExpandDesc(!expandDesc)}>
            <Text style={styles.verMais}>{expandDesc ? "Ver menos" : "Ver mais..."}</Text>
          </TouchableOpacity>
        </View>

        {/* Card Tratamento */}
        <View style={[styles.card, styles.treatmentCard]}>
          <View style={styles.cardHeader}>
            <Stethoscope color={activeColor} size={22} />
            <Text style={styles.cardTitle}>Tratamento</Text>
          </View>

          {/* CARD INTERNO: Solução Caseira */}
          <View style={styles.innerBox}>
            <Text style={styles.innerTitle}>Solução caseira</Text>
            <Text style={styles.innerBody}>
              Misture 1 colher de sopa de bicarbonato de sódio com 1 colher de chá de detergente líquido em 4 litros de água.
            </Text>
          </View>

          <Text 
            style={styles.cardBody} 
            numberOfLines={expandTreat ? undefined : 3}
          >
            Remova as partes afetadas imediatamente para evitar a propagação. Aplique fungicidas à base de enxofre se a infestação for severa. O controle da umidade e a ventilação são cruciais para a recuperação.
          </Text>
          <TouchableOpacity onPress={() => setExpandTreat(!expandTreat)}>
            <Text style={styles.verMais}>{expandTreat ? "Ver menos" : "Ver mais..."}</Text>
          </TouchableOpacity>
        </View>

        {/* Card Prevenção */}
        <View style={[styles.card, styles.prevCard]}>
          <View style={styles.cardHeader}>
            <ShieldCheck color={activeColor} size={22} />
            <Text style={styles.cardTitle}>Prevenção</Text>
          </View>
          <Text 
            style={styles.cardBody} 
            numberOfLines={expandPrev ? undefined : 3}
          >
            Mantenha um espaçamento adequado entre as plantas para garantir a circulação de ar. Evite regar as folhas diretamente e certifique-se de que a planta receba luz solar adequada para reduzir a umidade.
          </Text>
          <TouchableOpacity onPress={() => setExpandPrev(!expandPrev)}>
            <Text style={styles.verMais}>{expandPrev ? "Ver menos" : "Ver mais..."}</Text>
          </TouchableOpacity>
        </View>

        {/* Aviso de Isenção */}
        <View style={styles.alertBox}>
          <AlertTriangle color="#1B1919" size={24} />
          <Text style={styles.alertText}>
            Este diagnóstico é um apoio e não substitui um especialista.
          </Text>
        </View>

        {/* Botão Dinâmico Baseado no Perfil */}
        <View style={{ paddingHorizontal: 20, marginTop: 10, marginBottom: 10 }}>
          {isAdminView ? (
            // BOTÃO PARA ADMIN: DELETAR
            // Note que usamos backgroundColor direto se o PrimaryButton suportar, 
            // ou passamos via objeto de estilo.
            <PrimaryButton 
              variant='danger'
              title="Eliminar do Histórico" 
              onPress={handleAction} 
              icon={Trash2}
              iconSize={22}
              // Forçamos a cor vermelha para indicar perigo
            />
          ) : isLoggedIn ? (
            // BOTÃO PARA USUÁRIO LOGADO
            <PrimaryButton 
              variant='outline'
              title="Voltar para a Home" 
              onPress={handleAction} 
              icon={Home}
              iconSize={22}
            />
          ) : (
            // BOTÃO PARA CONVIDADO
            <TouchableOpacity style={styles.saveButton} onPress={handleAction}>
              <Bookmark color="#666" size={24} />
              <Text style={styles.saveButtonText}>Guardar no Histórico</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>

      <ConfirmationModal
        visible={modalVisible}
        title="Eliminar Registro"
        message="Tem certeza que deseja excluir permanentemente este diagnóstico do histórico do sistema?"
        confirmText="Sim, Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onClose={() => setModalVisible(false)} // Se o seu componente aceitar tipo para mudar a cor do botão do modal
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  imageWrapper: { margin: 20, height: 270, borderRadius: 20, overflow: 'hidden', position: 'relative' },
  mainImage: { width: '100%', height: '100%' },
  labelPhoto: { position: 'absolute', top: 15, left: 15, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  labelText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  titleSection: { flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center', marginBottom: 25 },
  foundText: { color: '#47e426', fontWeight: 'bold', fontSize: 15 },
  diseaseTitle: { marginTop: 5, fontSize: 22, fontWeight: '800', color: '#1B1919' },
  confidenceBadge: { borderWidth: 1, borderColor: '#47e426', borderRadius: 12, padding: 8, alignItems: 'center' },
  confidenceValue: { color: '#47e426', fontWeight: 'bold', fontSize: 17 },
  confidenceLabel: { fontSize: 12, color: '#47e426' },
  card: { marginHorizontal: 20, borderRadius: 20, padding: 15, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginLeft: 10, color: '#1B1919' },
  cardBody: { color: '#555', fontSize: 14, lineHeight: 20 },
  verMais: { color: '#1B1919', fontWeight: 'bold', marginTop: 10, fontSize: 13 },
  descCard: { backgroundColor: '#d4f9c6' },
  treatmentCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE' },
  prevCard: { backgroundColor: '#f5f5f5' },
  
  // Estilos do Card Caseiro Interno
  innerBox: { backgroundColor: '#edf2f0', borderRadius: 15, padding: 12, marginVertical: 10 },
  innerTitle: { fontWeight: '700', marginBottom: 4, color: '#1B1919' },
  innerBody: { fontSize: 13, color: '#666' },

  alertBox: { flexDirection: 'row', backgroundColor: '#c6f9cc', marginHorizontal: 20, padding: 15, borderRadius: 15, alignItems: 'center', marginTop: 15, marginBottom: 20 },
  alertText: { flex: 1, marginLeft: 10, fontSize: 13, fontWeight: '500' },
  saveButton: { flexDirection: 'row', backgroundColor: '#edf2f0', padding: 18, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  saveButtonText: { marginLeft: 10, fontWeight: 'bold', color: '#666', fontSize: 16 },
});