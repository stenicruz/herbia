import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';

/**
 * Banner de linha fina para usar no topo de telas específicas.
 * O indicador global (ícone flutuante CloudOff) está no App.js.
 * Use este componente quando quiser um aviso contextual numa tela.
 *
 * Props:
 *   isOnline   → bool
 *   isSyncing  → bool (opcional)
 *   mensagem   → string personalizada (opcional)
 */
export const OfflineBanner = ({ isOnline, isSyncing = false, mensagem }) => {
  if (isOnline && !isSyncing) return null;

  const config = isSyncing
    ? { bg: '#2563eb', icon: <RefreshCw color="#fff" size={13} />, text: 'A sincronizar dados...' }
    : {
        bg: '#f59e0b',
        icon: <WifiOff color="#fff" size={13} />,
        text: mensagem || 'Sem ligação à internet · Modo offline activo',
      };

  return (
    <View style={[styles.banner, { backgroundColor: config.bg }]}>
      {config.icon}
      <Text style={styles.texto}>{config.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, paddingVertical: 7, paddingHorizontal: 16,
  },
  texto: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
