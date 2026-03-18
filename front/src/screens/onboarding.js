import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRightCircle } from 'lucide-react-native';
import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

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

  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

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
    <View style={[styles.container, { backgroundColor: currentTheme.background, paddingTop: insets.top }]}>
    <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={currentTheme.background} 
      />
      <View style={[styles.wrapper, { paddingBottom: insets.bottom + 40 }]}>
        
        <Image source={data.image} style={styles.mainImage} />

        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
            {data.titlePart1}
            <Text style={styles.greenText}>{data.titleHighlight}</Text>
          </Text>
          <Text style={[styles.description, { color: currentTheme.textSecondary }]}>
            {data.description}
          </Text>
        </View>

        <View style={styles.dotsContainer}>
          {ONBOARDING_STEPS.map((_, index) => (
            <View 
              key={index}
              style={[
                styles.dot, 
                currentStep === index 
                  ? styles.dotActive 
                  : { backgroundColor: isDarkMode ? '#1A2E17' : '#cef3c6', width: 10 }
              ]} 
            />
          ))}
        </View>

        <View style={[styles.footer, isLastStep && styles.footerCentered]}>
          
          {!isLastStep && (
            <TouchableOpacity style={styles.skipContainer} onPress={handleSkip}>
              <Text style={[styles.skipText, { color: currentTheme.textSecondary}]}>Pular</Text>
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
  container: { flex: 1},
  wrapper: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    marginTop: height * 0.035,
  },
  mainImage: { 
    width: '100%', 
    height: height * 0.44,
    borderRadius: 30, 
    resizeMode: 'cover' 
  },
  textBlock: { 
    marginVertical: 2,
  },
  title: { 
    fontSize: width > 360 ? 31 : 24, // Fonte menor em telas pequenas
    fontWeight: '900', 
    lineHeight: 34, 
    textAlign:'center', 
  },
  greenText: { color: '#47e426' },
  description: { 
    fontSize: 16, 
    marginTop: 12, 
    lineHeight: 24, 
    textAlign:'center', 
  },
  dotsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginVertical: 10,
  },
  dot: { 
    height: 10, 
    borderRadius: 5, 
    marginHorizontal: 5 
  },
  dotActive: { 
    width: 25, 
    backgroundColor: '#47e426' 
  },
  
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  footerCentered: {
    justifyContent: 'center', 
  },
  skipContainer: {
    marginLeft: 30,
    padding: 15,
    marginRight: 60
  },
  skipText: { 
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#47e426',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 30,
    minWidth: width * 0.4,
    justifyContent: 'space-between',
  },
  buttonFull: {
    width: '70%',
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    marginRight: 10,
  },
});