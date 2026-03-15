import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Home, History, Camera, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const activeColor = '#47e426';
  const inactiveColor = '#999';

  return (
    <View style={[
      styles.tabBar, 
      { paddingBottom: Platform.OS === 'android' ? insets.bottom + 10 : insets.bottom + 15 }
    ]}>
      
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
        <Home color={activeColor} size={26} fill={activeColor} />
        <Text style={[styles.tabLabel, {color: activeColor}]}>Casa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('History')}>
        <History color={inactiveColor} size={26} />
        <Text style={styles.tabLabel}>Histórico</Text>
      </TouchableOpacity>

      <View style={styles.cameraTabWrapper}>
        <TouchableOpacity 
          style={styles.cameraTabBtn} 
          onPress={() => navigation.navigate('Camera')}
        >
          <Camera color="#FFF" size={34} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.tabLabel}>Câmera</Text>
      </View>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Profile')}>
        <User color={inactiveColor} size={26} fill={inactiveColor} />
        <Text style={styles.tabLabel}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row',
    backgroundColor: '#FFF', 
    borderTopWidth: 1, 
    borderTopColor: '#F2F2F2', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    paddingTop: 12 },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 12,
    marginTop: 4, 
    fontWeight: '600', 
    color: '#999'},
  cameraTabWrapper: { alignItems: 'center', marginTop: -42 },
  cameraTabBtn: { 
    backgroundColor: '#47e426', 
    width: 68, 
    height: 68, 
    borderRadius: 34, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 6, 
    borderColor: '#FFF', 
    elevation: 8,
    shadowColor: '#000000c4',
    shadowOpacity: 0.15,
    shadowRadius: 8, }
});