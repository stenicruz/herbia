import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  View 
} from 'react-native';
import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';

export const PrimaryButton = ({ 
  title, 
  onPress, 
  loading = false, 
  variant = 'primary', 
  icon: Icon,        
  reverse = false, 
  borderRadius = 16, 
  iconSize = 20,     
  iconStrokeWidth = 2, // Nova prop: valor padrão é 2
  gap = 10,          
  style,
  textStyle
}) => {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  
  // Lógica de Cores Inteligente
  const colors = {
    primary: {
      bg: THEME.primary,
      text: isDarkMode ? THEME.dark.background : '#fff',
      icon: isDarkMode ? THEME.dark.background : '#fff',
      border: 'transparent'
    },
    outline: {
      bg: 'transparent',
      text: isDarkMode ? THEME.text3 : THEME.primary,
      icon: THEME.primary,
      border: '#47e426', // Borda mais discreta no Dark
    },
    danger: {
      bg: isDarkMode ? '#2D1616' : '#FFECEC', // Fundo escuro avermelhado no Dark
      text: THEME.error,
      icon: THEME.error,
      border: 'transparent'
    }
  };

  const currentColors = colors[variant] || colors.primary;

  return (
    <TouchableOpacity 
      style={[
        styles.baseButton, 
        { 
          backgroundColor: currentColors.bg, 
          borderColor: currentColors.border,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderRadius 
        }, 
        style
      ]} 
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={currentColors.text} />
      ) : (
        <View style={[styles.content, reverse && { flexDirection: 'row-reverse' }, { gap }]}>
          {/* Se o título for um objeto (como na tela Decision), renderiza direto */}
          {typeof title === 'object' ? (
            title
          ) : (
            <Text style={[styles.baseText, { color: currentColors.text }, textStyle]}>
              {title}
            </Text>
          )}

          {Icon && (
            <Icon 
              size={iconSize} 
              color={currentColors.icon} 
              strokeWidth={iconStrokeWidth}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // Removi o marginVertical fixo para dar mais controle de responsividade às telas
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18, // Respiro interno para o conteúdo
  },
  baseText: {
    fontSize: 16,
    fontWeight: '700',
  },
});