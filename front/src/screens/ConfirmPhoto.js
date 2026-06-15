import React, { useState, useEffect } from 'react';
import {
  View, Image, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, Text, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check, MapPin, MapPinOff, WifiOff } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ConfirmationModal } from '../components/central';
import plantService from '../services/plantService';
import { useNetworkStatus } from '../hooks/useNetworkStatus';


export default function ConfirmPhoto({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { imageUri } = route.params;

  const { isOnline } = useNetworkStatus();

  const [loading,        setLoading       ] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [location,       setLocation      ] = useState(null);
  const [locationStatus, setLocationStatus] = useState('loading');

  useEffect(() => {
    capturarLocalizacao();
  }, []);

  const capturarLocalizacao = async () => {
    try {
      setLocationStatus('loading');

      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert(
          "GPS Desligado",
          "Para registar a localização da análise, active o GPS do seu dispositivo.",
          [
            {
              text: "Activar GPS",
              onPress: async () => {
                try {
                  await Location.enableNetworkProviderAsync();
                  capturarLocalizacao();
                } catch {
                  setLocationStatus('error');
                }
              }
            },
            {
              text: "Continuar sem GPS",
              style: 'cancel',
              onPress: () => setLocationStatus('error'),
            }
          ]
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('denied');
        return;
      }

      const coords = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude:  coords.coords.latitude,
        longitude: coords.coords.longitude,
      });
      setLocationStatus('ok');

    } catch (err) {
      console.warn("Erro ao capturar localização:", err.message);
      setLocationStatus('error');
    }
  };

  // ─── Análise ONLINE ────────────────────────────────────────────────────────
  const analisarOnline = async () => {
    const resultado = await plantService.analisarPlanta(imageUri, location);
    const token     = await AsyncStorage.getItem('@Herbia:token');
    const isLoggedIn = !!token;

    if (resultado.classe_ia === 'Desconhecido') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'DiagnosticResult', params: { resultado, imageUri, isLoggedIn } }],
      });
      return;
    }

    if (resultado.precisao < 30) {
      setShowErrorModal(true);
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'DiagnosticResult', params: { resultado, imageUri, isLoggedIn } }],
    });
  };

  const handleStartDiagnosis = async () => {
    setLoading(true);
    try {
      await analisarOnline();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor. Verifique a sua ligação.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Badge de GPS ─────────────────────────────────────────────────────────
  const renderLocationBadge = () => {
    const configs = {
      loading: {
        icon: <ActivityIndicator size="small" color="#47e426" />,
        text: 'A obter localização...',
        textColor: '#47e426',
        borderColor: 'rgba(71,228,38,0.3)',
      },
      ok: {
        icon: <MapPin color="#47e426" size={14} />,
        text: 'GPS activo',
        textColor: '#47e426',
        borderColor: 'rgba(71,228,38,0.3)',
      },
      denied: {
        icon: <MapPinOff color="#888" size={14} />,
        text: 'Permissão negada',
        textColor: '#888',
        borderColor: 'rgba(255,255,255,0.1)',
      },
      error: {
        icon: <MapPinOff color="#888" size={14} />,
        text: 'Sem localização',
        textColor: '#888',
        borderColor: 'rgba(255,255,255,0.1)',
      },
    };

    const config = configs[locationStatus];
    if (!config) return null;

    return (
      <View style={[styles.badge, { borderColor: config.borderColor }]}>
        {config.icon}
        <Text style={[styles.badgeText, { color: config.textColor }]}>
          {config.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <X color="#FFF" size={30} />
        </TouchableOpacity>

        <View style={styles.badgesRow}>
          {/* Badge offline */}
          {!isOnline && (
            <View style={[styles.badge, { borderColor: 'rgba(239,68,68,0.4)', marginRight: 6 }]}>
              <WifiOff color="#ef4444" size={14} />
              <Text style={[styles.badgeText, { color: '#ef4444' }]}>Offline</Text>
            </View>
          )}
          {renderLocationBadge()}
        </View>
      </View>

      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 40 }]}>
        {loading ? (
          <ActivityIndicator size="large" color="#47e426" />
        ) : (
          <TouchableOpacity style={styles.confirmButton} onPress={handleStartDiagnosis}>
            <Check color="#FFF" size={45} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      <ConfirmationModal
        visible={showErrorModal}
        variant='primary'
        title="Não conseguimos identificar"
        description="Certifique-se de que a foto está nítida e foca numa planta. Deseja tentar novamente?"
        confirmText="Tirar outra foto"
        onConfirm={() => { setShowErrorModal(false); navigation.goBack(); }}
        onClose={() => { setShowErrorModal(false); navigation.navigate('Main'); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    width: '100%', paddingHorizontal: 20,
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', zIndex: 10,
  },
  closeButton: { padding: 10 },
  badgesRow: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  imageWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  offlineWarning: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(245,158,11,0.15)',
    marginHorizontal: 20, padding: 12, borderRadius: 12,
    marginBottom: 10,
  },
  offlineWarningText: { color: '#f59e0b', fontSize: 12, fontWeight: '600', flex: 1 },
  footer: { justifyContent: 'center', alignItems: 'center' },
  confirmButton: {
    width: 75, height: 75, borderRadius: 45,
    backgroundColor: '#47e426', justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#47e426',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10,
  },
});
