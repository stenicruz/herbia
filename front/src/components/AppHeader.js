import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/Theme';

export const AppHeader = ({ title, showBack = true, rightElement, variant }) => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();

  // 1. Se 'variant' for passada manualmente (ex: 'dark' no scanner), ela manda.
  // 2. Se não houver variant, ele segue o tema global (isDarkMode).
  const isHeaderDark = variant === 'dark' || (isDarkMode && variant !== 'light');

  const currentTheme = isHeaderDark ? THEME.dark : THEME.light;

  return (
    <View style={[
      styles.container, 
      { backgroundColor: currentTheme.background }
    ]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ChevronLeft 
              color={isHeaderDark ? "#FFF" : "#1B1919"} 
              size={30} 
              strokeWidth={2.5} 
            />
          </TouchableOpacity>
        )}
        <Text style={[
          styles.title, 
          { color: currentTheme.textPrimary }
        ]}>
          {title}
        </Text>
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
    minHeight: 60, // Aumentado levemente para melhor responsividade
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    marginRight: 8,
    padding: 4, 
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  }
});