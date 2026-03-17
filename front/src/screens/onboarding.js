import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRightCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    id: 1,
    image: require('../../assets/onboarding1.jpg'),
    titlePart1: "Cuide melhor das suas ",
    titleHighlight: "Plantas",
    description: "Identifique doenças e aprenda a prevenir doenças com inteligência",
    buttonText: "Próximo",
  },
  {
    id: 2,
    image: require('../../assets/care.jpg'),
    titlePart1: "Cultive um mundo mais ",
    titleHighlight: "Verde",
    description: "Aprenda métodos de combate às doenças e contribua para um ecossistema mais saudável.",
    buttonText: "Próximo",
  },
  {
    id: 3,
    image: require('../../assets/onboarding2.jpg'),
    titlePart1: "Diagnóstico por ",
    titleHighlight: "Fotos",
    description: "Basta tirar uma foto da folha para identificar doenças e receber dicas de tratamento",
    buttonText: "Continuar",
  }
];

export default function Onboarding({ navigation, onFinish }) {
  const [currentStep, setCurrentStep] = useState(0);
  const insets = useSafeAreaInsets();

  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (onFinish) onFinish();
    }
  };

  const handleSkip = () => {
    if (onFinish) onFinish();
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
          {ONBOARDING_STEPS.map((_, index) => (
            <View 
              key={index}
              style={[
                styles.dot, 
                currentStep === index ? styles.dotActive : styles.dotInactive
              ]} 
            />
          ))}
        </View>

        <View style={[styles.footer, isLastStep && styles.footerCentered]}>
          
          {!isLastStep && (
            <TouchableOpacity style={styles.skipContainer} onPress={handleSkip}>
              <Text style={styles.skipText}>Pular</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.button, isLastStep && styles.buttonFull]} 
            onPress={handleNext}
          >
            {isLastStep && <View style={{ width: 0 }} />}
            <View style={{ width: 0 }} />
            <Text style={styles.buttonText}>{data.buttonText}</Text>
              <ArrowRightCircle color="#FFF" size={36} strokeWidth={1} />
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
    marginTop: '30',
  },
  mainImage: { width: '100%', height: width * 0.91, borderRadius: 30, resizeMode: 'cover' },
  textBlock: { marginTop: -5,},
  title: { marginBottom: '10',fontSize: 30, fontWeight: '900', color: '#000', lineHeight: 34, textAlign:'center', },
  greenText: { color: '#47e426' },
  description: { fontSize: 16, color: '#666', marginTop: 10, lineHeight: 24, textAlign:'center', },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10, marginTop:'-5', },
  dot: { height: 10, borderRadius: 5, marginHorizontal: 5 },
  dotActive: { width: 25, backgroundColor: '#47e426' },
  dotInactive: { width: 10, backgroundColor: '#cef3c6' },
  
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  footerCentered: {
    justifyContent: 'center', 
  },
  skipContainer: {
    marginLeft: 30,
    padding: 15,
    marginRight: 65
  },
  skipText: { 
    fontSize: 16, 
    color: '#999',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#47e426',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10, // Reduzi um pouco para a seta colar mais na borda
    borderRadius: 30,
    width:'45%',
    justifyContent: 'space-between', // ISSO joga a seta para o final
  },
  buttonFull: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '60%', // Alterado para 100% para ocupar a largura do wrapper
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
});