import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Importação do ícone real
import { ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    id: 1,
    image: require('../assets/onboarding1.jpg'),
    titlePart1: "Cuide melhor das suas ",
    titleHighlight: "Plantas",
    description: "Identifique doenças e aprenda a prevenir doenças com inteligência",
    buttonText: "Próximo",
  },
  {
    id: 2,
    image: require('../assets/onboarding2.jpg'),
    titlePart1: "Diagnóstico por ",
    titleHighlight: "Fotos",
    description: "Basta tirar uma foto da folha para identificar doenças e receber dicas de tratamento",
    buttonText: "Continuar",
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const insets = useSafeAreaInsets();

  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Ir para Tela de Decisão");
    }
  };

  const data = ONBOARDING_STEPS[currentStep];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.wrapper}>
        
        <Image source={data.image} style={styles.mainImage} />

        <View style={styles.textBlock}>
          <Text style={styles.title}>
            {data.titlePart1}
            <Text style={styles.greenText}>{data.titleHighlight}</Text>
          </Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>

        <View style={styles.dotsContainer}>
          <View style={[styles.dot, currentStep === 0 ? styles.dotActive : styles.dotInactive]} />
          <View style={[styles.dot, currentStep === 1 ? styles.dotActive : styles.dotInactive]} />
        </View>

        <View style={[styles.footer, isLastStep && styles.footerCentered]}>
          
          {!isLastStep && (
            <TouchableOpacity>
              <Text style={styles.skipText}>Pular</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.button, isLastStep && styles.buttonFull]} 
            onPress={handleNext}
          >
            {/* 1. View invisível para equilibrar o centro (apenas no botão largo) */}
            {isLastStep && <View style={{ width: 0 }} />}
            <View style={{ width: 4 }} />
            <Text style={styles.buttonText}>{data.buttonText}</Text>
            
            <View style={styles.circleArrow}>
              <ArrowRight color="#FFF" size={18} strokeWidth={3} />
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  wrapper: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 10,
    justifyContent: 'space-between',
    paddingBottom: 70,
    marginTop: '25',
  },
  mainImage: { width: '100%', height: width * 0.93, borderRadius: 30, resizeMode: 'cover' },
  textBlock: { marginTop: 0,},
  title: { marginBottom: '10',fontSize: 30, fontWeight: '900', color: '#000', lineHeight: 34, textAlign:'center', },
  greenText: { color: '#4ADE80' },
  description: { fontSize: 16, color: '#666', marginTop: 10, lineHeight: 24, textAlign:'center', },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10, marginTop:'-5', },
  dot: { height: 10, borderRadius: 5, marginHorizontal: 5 },
  dotActive: { width: 25, backgroundColor: '#4ADE80' },
  dotInactive: { width: 10, backgroundColor: '#C4EFCF' },
  
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-end',
  },
  footerCentered: {
    justifyContent: 'center', 
  },
  skipText: { 
    fontSize: 16, 
    color: '#999',
    fontWeight: '500',
    marginRight: 100, // Você pode diminuir isso se quiser o Pular mais perto
  },
  button: {
    backgroundColor: '#4ADE80',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10, // Reduzi um pouco para a seta colar mais na borda
    borderRadius: 30,
    width:'45%',
    justifyContent: 'space-between', // ISSO joga a seta para o final
  },
  buttonFull: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    width: '60%', // Alterado para 100% para ocupar a largura do wrapper
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    // Retirei o marginRight fixo para não empurrar a seta manualmente
  },
  circleArrow: {
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    borderWidth: 1.5,
    borderColor: '#FFF', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
});