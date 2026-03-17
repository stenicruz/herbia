import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { PrimaryButton } from './PrimaryButton';

export const ConfirmationModal = ({ 
  visible, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "Confirmar",
  variant = "danger" // 'danger' para vermelho, 'primary' para verde
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={[
            styles.iconCircle, 
            { backgroundColor: variant === 'danger' ? '#FFF0F0' : '#F0F9F0' }
          ]}>
            <AlertTriangle color={variant === 'danger' ? '#FF4444' : '#47e426'} size={35} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.buttonContainer}>
            <PrimaryButton 
              title={confirmText}
              variant={variant}
              onPress={onConfirm}
              style={styles.btn}
            />
            
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B1919',
    marginBottom: 10,
    textAlign: 'center'
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30
  },
  buttonContainer: {
    width: '100%',
  },
  btn: {
    height: 50,
    marginBottom: 10
  },
  cancelBtn: {
    padding: 15,
    alignItems: 'center'
  },
  cancelText: {
    color: '#999',
    fontWeight: '600',
    fontSize: 15
  }
});