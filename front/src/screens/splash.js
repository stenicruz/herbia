import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Animated, Easing } from 'react-native';

export default function SplashScreen({ onFinish }) {
  const progress = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current; // Opacidade apenas do conteúdo

  useEffect(() => {
    // 1. Animação da barra
    Animated.timing(progress, {
      toValue: 1,
      duration: 2800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        // 2. Fade out apenas do conteúdo (Logo + Texto + Loader)
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 550,
          useNativeDriver: true,
        }).start(() => {
          if (onFinish) onFinish();
        });
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Envolvemos apenas o que deve sumir nesta Animated.View */}
      <Animated.View style={[styles.innerContent, { opacity: contentOpacity }]}>
        
        <View style={styles.centerContent}>
          <Image 
            source={require('../../assets/logo1.png')} 
            style={styles.logo}
          />
          <Text style={styles.title}>Herbia</Text>
          <Text style={styles.tagline}>Bem-estar das Plantas e Diagnósticos</Text>
        </View>

        <View style={styles.loaderContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View 
              style={[
                styles.progressBarFill, 
                { 
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }) 
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fundo sempre branco e sólido
  },
  innerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 150,
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  logo: {
    width: 190,
    height: 190,
    resizeMode: 'contain',
    backgroundColor: 'transparent', // Garante que a imagem não tenha fundo próprio
  },
  title: {
    fontSize: 46,
    fontWeight: '500',
    color: '#000',
    marginTop: 13,
  },
  tagline: {
    fontSize: 14,
    color: '#828282',
    textAlign: 'center',
    marginTop: 8,
  },
  loaderContainer: {
    width: '40%',
    alignSelf: 'center'
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#47e426',
    borderRadius: 10,
  },
});