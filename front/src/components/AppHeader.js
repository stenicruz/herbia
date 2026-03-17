import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const AppHeader = ({ title, showBack = true, rightElement, variant = 'light' }) => {
  const navigation = useNavigation();

  // Se a variante for 'dark' (para telas como o Scanner), mudamos as cores
  const isDark = variant === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ChevronLeft color={isDark ? "#FFF" : "#1B1919"} size={30} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
      </View>
      
      {rightElement && (
        <View style={styles.rightContainer}>
          {rightElement}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    minHeight: 50, 
  },
  containerDark: {
    backgroundColor: '#000',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    marginRight: 12,
    padding: 4, // Aumenta área de toque
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B1919',
  },
  titleDark: {
    color: '#FFF',
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  }
});