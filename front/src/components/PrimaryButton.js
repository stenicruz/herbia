import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  View 
} from 'react-native';

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
  
  // Lógica de estilos baseada na variante
  const getButtonStyle = () => {
    switch (variant) {
      case 'outline': return styles.btnOutline;
      case 'danger': return styles.btnDanger;
      default: return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline': return styles.textOutline;
      case 'danger': return styles.textDanger;
      default: return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.baseButton, getButtonStyle(), { borderRadius }, style]} 
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#47e426' : "#FFF"} />
      ) : (
        <View style={[styles.content, reverse && { flexDirection: 'row-reverse' }, { gap }]}>
          <Text style={[styles.baseText, getTextStyle(), textStyle]}>
            {title}
          </Text>

          {Icon && (
            <Icon 
              size={iconSize} 
              color={variant === 'primary' ? '#FFF' : '#47e426' || 'danger' ? '#d40b0b' : '#47e426'} 
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
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },
  btnPrimary: {
    backgroundColor: '#47e426',
    // Sombra leve para destaque
    elevation: 3,
    shadowColor: '#000000ce',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#47e426',
  },
  btnDanger: {
    backgroundColor: '#FFECEC',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  baseText: {
    fontSize: 16,
    fontWeight: '700',
  },
  textPrimary: { color: '#FFF' },
  textOutline: { color: '#47e426' },
  textDanger: { color: '#db2626' },
  icon: { marginRight: 10 }
});