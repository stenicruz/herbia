import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { PrimaryButton } from './PrimaryButton';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/Theme';

export const ConfirmationModal = ({ 
  visible, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "Confirmar",
  variant = "danger",
  loading = false  // ✅ nova prop
}) => {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const getIconColors = () => {
    if (variant === 'danger') {
      return {
        bg: isDarkMode ? 'rgba(212, 11, 11, 0.15)' : '#FFF0F0',
        icon: '#FF4444'
      };
    }
    return {
      bg: isDarkMode ? 'rgba(71, 228, 38, 0.15)' : '#F0F9F0',
      icon: '#47e426'
    };
  };

  const iconColors = getIconColors();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={loading ? null : onClose}>
        <Pressable style={[styles.modalContent, { backgroundColor: isDarkMode ? '#121411' : '#FFF' }]}>
          
          <View style={[styles.iconCircle, { backgroundColor: iconColors.bg }]}>
            <AlertTriangle color={iconColors.icon} size={35} />
          </View>

          <Text style={[styles.title, { color: currentTheme.textPrimary }]}>{title}</Text>
          <Text style={[styles.description, { color: currentTheme.textSecondary }]}>{description}</Text>

          <View style={styles.buttonContainer}>
            {loading ? (
              // ✅ Mostra loading em vez dos botões
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={THEME.primary} />
                <Text style={[styles.loadingText, { color: currentTheme.textSecondary }]}>
                  A processar...
                </Text>
              </View>
            ) : (
              <>
                <PrimaryButton
                  title={confirmText}
                  variant={variant}
                  onPress={onConfirm}
                  style={styles.btn}
                />
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                  activeOpacity={0.6}
                >
                  <Text style={[styles.cancelText, { color: isDarkMode ? '#666' : '#999' }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25
  },
  modalContent: {
    width: '100%',
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  iconCircle: {
    width: 75, height: 75, borderRadius: 38,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20
  },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  description: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 30, paddingHorizontal: 10 },
  buttonContainer: { width: '100%' },
  btn: { height: 55, marginBottom: 5 },
  cancelBtn: { padding: 15, alignItems: 'center' },
  cancelText: { fontWeight: '700', fontSize: 15 },
  loadingContainer: { 
    alignItems: 'center', 
    paddingVertical: 20 
  },
  loadingText: { 
    marginTop: 12, 
    fontSize: 15, 
    fontWeight: '600' 
  }
});