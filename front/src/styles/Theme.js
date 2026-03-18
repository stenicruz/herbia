export const THEME = {
  // Cores de Identidade que NÃO mudam (Verde Herbia)
  primary: '#47e426', 
  primaryDark: '#36b11d',
  white: '#FFFFFF',
  black: '#000000',
  error: '#FF4444',

  // Configurações do Modo ESCURO (Baseado nas suas imagens)
  dark: {
    background: '#010501',      // Fundo preto profundo
    card: '#121411',            // Cards de histórico e seções
    input: '#161D14',           // Fundo dos inputs verde-escuro
    inputBorder: '#232D20',     // Borda sutil dos campos
    textPrimary: '#FFFFFF',     // Títulos e nomes
    textSecondary: '#adadad',
    text3: '#b3fca2ab',//'#a8f697',   // Subtítulos e datas
    border: '#1E261C',          // Divisórias
    tabBar: '#0D100C',          // Menu inferior
    tabInactive: '#707070',     // Ícones não selecionados
  },

  // Configurações do Modo CLARO (Para quando o switch for desativado)
  light: {
    background: '#FFFFFF',      // Fundo branco
    card: '#F8F9FA',            // Cards cinza bem claro
    input: '#F5F5F5',           // Fundo dos inputs cinza
    inputBorder: '#E0E0E0',     // Borda cinza clara
    textPrimary: '#1B1919',     // Títulos pretos
    textSecondary: '#666666',   // Subtítulos cinza escuro
    border: '#EEEEEE',          // Divisórias claras
    tabBar: '#FFFFFF',          // Menu inferior branco
    tabInactive: '#CCCCCC',     // Ícones cinza claro
  }
};

// Atalho para espaçamentos responsivos
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};