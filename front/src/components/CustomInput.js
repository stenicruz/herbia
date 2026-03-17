import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

export const CustomInput = ({ 
  label, 
  icon: Icon, 
  isPassword, 
  error, 
  style, 
  ...props 
}) => {
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.container, 
        error && styles.errorBorder,
        // Adiciona um leve destaque quando o input recebe foco (opcional)
      ]}>
        {Icon && (
          <Icon 
            color="#828282" 
            size={20} 
            style={styles.icon} 
            strokeWidth={2}
          />
        )}
        
        <TextInput 
          style={styles.input} 
          secureTextEntry={secure}
          placeholderTextColor="#999"
          autoCapitalize="none"
          {...props} 
        />

        {isPassword && (
          <TouchableOpacity 
            onPress={() => setSecure(!secure)}
            style={styles.eyeBtn}
          >
            {secure ? (
              <EyeOff color="#999" size={20} />
            ) : (
              <Eye color="#999" size={20} />
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
    color: '#333',
    marginBottom: 8,
    fontWeight: '550',
    marginLeft: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDFDFD', 
    borderWidth: 1, 
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
  },
  errorBorder: {
    borderColor: '#FF4444',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#000',
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
    marginLeft: 5,
  }
});