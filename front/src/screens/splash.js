import  { React, useEffect, useRef } from 'react';
import { 
  View,
  Text, 
  Image, 
  StyleSheet, 
  StatusBar, 
  Animated, 
  Easing,
  Dimensions
} from 'react-native';
import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const { isDarkMode } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  useEffect(() => {
    // 1. Animação da barra
    Animated.timing(progress, {
      toValue: 1,
      duration: 2800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        // 2. Fade out apenas do conteúdo
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 5250,
          useNativeDriver: true,
        }).start(() => {
          if (onFinish) onFinish();
        });
      }
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={currentTheme.background} 
      />
      
      {/* Envolvemos apenas o que deve sumir nesta Animated.View */}
      <Animated.View style={[styles.innerContent, { opacity: contentOpacity }]}>
        
        <View style={styles.centerContent}>
          <Image 
            source={isDarkMode ? require('../../assets/logo2.png') : require('../../assets/logo1.png')} 
            style={styles.logo}
          />
          <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Herbia</Text>
          <Text style={[styles.tagline, { color: currentTheme.text3 }]}>
            Bem-estar das Plantas e Diagnósticos
          </Text>
        </View>

        <View style={styles.loaderContainer}>
          <View style={[styles.progressBarBackground, { backgroundColor: isDarkMode ? '#333' : '#E0E0E0' }]}>
            <Animated.View 
              style={[
                styles.progressBarFill, 
                { 
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: THEME.primary
                }
              ]} 
            />
          </View>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContent: {
    flex: 1,
    alignItems: 'center',
    // Em vez de padding fixo, usamos proporção
    justifyContent: 'space-around', 
    paddingVertical: SCREEN_HEIGHT * 0.1, // 10% da altura da tela
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  logo: {
    // Logo proporcional à altura da tela
    width: SCREEN_HEIGHT * 0.25, 
    height: SCREEN_HEIGHT * 0.25,
    resizeMode: 'contain',
  },
  title: {
    // Fonte um pouco menor para não quebrar em telas estreitas
    fontSize: SCREEN_HEIGHT > 700 ? 46 : 38, 
    fontWeight: '500',
    marginTop: 10,
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  loaderContainer: { 
    width: '60%',
    alignSelf: 'center',
    marginBottom: 20
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
});