import { useState, useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Hook que monitoriza o estado da ligação à internet.
 * 
 * Devolve:
 *   isOnline        → true/false (estado actual)
 *   isConnected     → alias de isOnline
 *   voltouOnline    → true só no momento em que passa de offline → online
 *   tipoConexao     → 'wifi' | 'cellular' | 'none' | 'unknown'
 */
export const useNetworkStatus = () => {
  const [isOnline,     setIsOnline    ] = useState(true);
  const [voltouOnline, setVoltouOnline] = useState(false);
  const [tipoConexao,  setTipoConexao ] = useState('unknown');

  // Referência para saber o estado anterior (detectar transição offline → online)
  const eraOffline = useRef(false);

  useEffect(() => {
    // Leitura inicial
    NetInfo.fetch().then((state) => {
      const online = !!(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);
      setTipoConexao(state.type || 'unknown');
      eraOffline.current = !online;
    });

    // Listener contínuo
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = !!(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);
      setTipoConexao(state.type || 'unknown');

      // Detecta transição offline → online
      if (eraOffline.current && online) {
        setVoltouOnline(true);
        // Reset após 3 segundos para não disparar sync múltiplas vezes
        setTimeout(() => setVoltouOnline(false), 3000);
      }

      eraOffline.current = !online;
    });

    return () => unsubscribe();
  }, []);

  return {
    isOnline,
    isConnected: isOnline,
    voltouOnline,
    tipoConexao,
  };
};
