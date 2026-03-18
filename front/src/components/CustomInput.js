import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/Theme';

export const CustomInput = ({ 
  label, 
  icon: Icon, 
  isPassword, 
  error, 
  style, 
  ...props 
}) => {
  const [secure, setSecure] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false);
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text style={[styles.label, { color: currentTheme.textPrimary }]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.container, 
        { 
          backgroundColor: isDarkMode ? '#121411' : '#FDFDFD',
          borderColor: error 
            ? '#FF4444' 
            : isFocused 
              ? THEME.primary 
              : isDarkMode ? '#222' : '#E8E8E8'
        }
      ]}>
        {Icon && (
          <Icon 
            color={isFocused ? THEME.primary : (isDarkMode ? '#aca7a7' : '#828282')} 
            size={20} 
            style={styles.icon} 
            strokeWidth={2}
          />
        )}
        
        <TextInput 
          style={[styles.input, { color: currentTheme.textPrimary }]} 
          secureTextEntry={secure}
          placeholderTextColor={isDarkMode ? '#949292' : '#999'}
          autoCapitalize="none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props} 
        />

        {isPassword && (
          <TouchableOpacity 
            onPress={() => setSecure(!secure)}
            style={styles.eyeBtn}
            activeOpacity={0.7}
          >
            {secure ? (
              <EyeOff color={isDarkMode ? '#949292' : '#999'} size={20} />
            ) : (
              <Eye color={isDarkMode ? '#949292' : '#999'} size={20} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    marginLeft: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5, // Aumentado levemente para destacar o foco
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 58, // Um pouco mais alto para uma pegada mais moderna
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeBtn: {
    padding: 5,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 8,
    fontWeight: '500',
  }
});