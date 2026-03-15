import React from 'react';
import { 
  StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Platform 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Info, 
  Stethoscope, 
  ShieldCheck, 
  AlertTriangle, 
  Bookmark,
  Home,
  History,
  Camera,
  User,
  ChevronRight
} from 'lucide-react-native';

const plantPhoto = require('../../assets/check.jpg'); // Imagem que foi analisada

export default function DiagnosticResultScreen() {
  const insets = useSafeAreaInsets();
  const activeColor = '#47e426';

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Imagem com Label "Foto Original" */}
        <View style={styles.imageWrapper}>
          <Image source={plantPhoto} style={styles.mainImage} />
          <View style={styles.labelPhoto}>
            <Text style={styles.labelText}>Foto Original</Text>
          </View>
        </View>

        {/* Título do Diagnóstico e Confiança */}
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

        {/* Cartão Descrição (Verde Claro) */}
        <View style={[styles.card, styles.descCard]}>
          <View style={styles.cardHeader}>
            <Info color={activeColor} size={22} />
            <Text style={styles.cardTitle}>Descrição</Text>
          </View>
          <Text style={styles.cardBody} numberOfLines={4}>
            Veja a saúde da sua planta com apenas uma foto, analise agora... (texto exemplo do design)
          </Text>
          <TouchableOpacity><Text style={styles.verMais}>Ver mais...</Text></TouchableOpacity>
        </View>

        {/* Cartão Tratamento (Branco com borda) */}
        <View style={[styles.card, styles.treatmentCard]}>
          <View style={styles.cardHeader}>
            <Stethoscope color={activeColor} size={22} />
            <Text style={styles.cardTitle}>Tratamento</Text>
          </View>
          
          <View style={styles.innerBox}>
            <Text style={styles.innerTitle}>Solução caseira</Text>
            <Text style={styles.innerBody}>Texto sobre solução caseira conforme o design...</Text>
            <TouchableOpacity><Text style={styles.verMais}>Ver mais...</Text></TouchableOpacity>
          </View>

          <Text style={styles.cardBody}>Informação adicional de tratamento...</Text>
          <TouchableOpacity><Text style={styles.verMais}>Ver mais...</Text></TouchableOpacity>
        </View>

        {/* Cartão Prevenção (Cinza muito claro) */}
        <View style={[styles.card, styles.prevCard]}>
          <View style={styles.cardHeader}>
            <ShieldCheck color={activeColor} size={22} />
            <Text style={styles.cardTitle}>Prevenção</Text>
          </View>
          <Text style={styles.cardBody}>Veja como prevenir que esta doença volte a afetar suas plantas...</Text>
          <TouchableOpacity><Text style={styles.verMais}>Ver mais...</Text></TouchableOpacity>
        </View>

        {/* Aviso Amarelo/Atenção */}
        <View style={styles.alertBox}>
          <AlertTriangle color="#1B1919" size={24} />
          <Text style={styles.alertText}>
            Este diagnóstico é um apoio, não substitui um especialista.
          </Text>
        </View>

        {/* Botão Guardar Diagnóstico */}
        <TouchableOpacity style={styles.saveButton}>
          <Bookmark color="#666" size={24} />
          <Text style={styles.saveButtonText}>Guardar Diagnóstico</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Tab Bar (Reutilizando seu estilo padrão com insets) */}
      <View style={[
        styles.tabBar, 
        { paddingBottom: Platform.OS === 'android' ? insets.bottom + 10 : insets.bottom + 15 }
      ]}>
        <TouchableOpacity style={styles.tabItem}>
          <Home color={activeColor} size={26} fill={activeColor} />
          <Text style={[styles.tabLabel, { color: activeColor }]}>Casa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <History color="#999" size={26} />
          <Text style={styles.tabLabel}>Histórico</Text>
        </TouchableOpacity>
        <View style={styles.cameraTabWrapper}>
          <TouchableOpacity style={styles.cameraTabBtn}><Camera color="#47e426" size={47} fill="#fff" /></TouchableOpacity>
          <Text style={styles.tabLabel}>Câmera</Text>
        </View>
        <TouchableOpacity style={styles.tabItem}>
          <User color="#999" size={26} fill="#999" />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
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
  confidenceBadge: { 
    borderWidth: 1, 
    borderColor: '#47e426', 
    borderRadius: 12, 
    padding: 8, 
    alignItems: 'center' },
  confidenceValue: { color: '#47e426', fontWeight: 'bold', fontSize: 17 },
  confidenceLabel: { fontSize: 12, color: '#47e426' },

  card: { marginHorizontal: 20, borderRadius: 20, padding: 15, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginLeft: 10, color: '#1B1919' },
  cardBody: { color: '#555', fontSize: 14, lineHeight: 20 },
  verMais: { color: '#555', fontWeight: 'bold', marginTop: 10, fontSize: 13 },

  descCard: { backgroundColor: '#d4f9c6' }, // Verde bem claro
  treatmentCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE' },
  prevCard: { backgroundColor: '#f5f5f5' },

  innerBox: { backgroundColor: '#edf2f0', borderRadius: 15, padding: 12, marginVertical: 10 },
  innerTitle: { fontWeight: '700', marginBottom: 4 },
  innerBody: { fontSize: 13, color: '#666' },

  alertBox: { 
    flexDirection: 'row', 
    backgroundColor: '#c6f9cc', 
    marginHorizontal: 20, 
    padding: 15, 
    borderRadius: 15, 
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30 },
  alertText: { flex: 1, marginLeft: 10, fontSize: 13, fontWeight: '500' },
  questionText: { textAlign: 'center', color: '#999', marginVertical: 15, fontSize: 13 },
  
  saveButton: { 
    flexDirection: 'row', 
    backgroundColor: '#edf2f0', 
    marginHorizontal: 20, 
    padding: 18, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 30 },
  saveButtonText: { marginLeft: 10, fontWeight: 'bold', color: '#666' },

 // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: 12,
  },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 12, marginTop: 4, fontWeight: '600', color: '#999'},
  
  cameraTabWrapper: { alignItems: 'center', marginTop: -40 },
  cameraTabBtn: {
    backgroundColor: '#47e426',
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#a5ef95',
    elevation: 8,
    shadowColor: '#000000c4',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  }
});