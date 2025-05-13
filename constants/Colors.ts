const tintColorLight = '#0B4619';  // Darker forest green
const tintColorDark = '#1B5E20';   // Rich dark green

export default {
  shared: {
    tint: '#0B4619',
    tintDark: '#072F10',
    success: '#1B5E20',     // Darker success green
    error: '#B71C1C',       // Deep red
    warning: '#E65100',     // Dark orange
    grass: '#1B5E20',       // Dark grass green
    lines: '#FFFFFF',       // Field lines
    ball: '#5D4037',        // Darker football brown
  },
  light: {
    text: '#0A3714',         // Dark green text
    textDim: '#2E5238',      // Muted green text
    background: '#E8F5E9',   // Light grass tint
    backgroundPress: '#C8E6C9',
    tint: tintColorLight,
    tabIconDefault: '#558B2F',
    tabIconSelected: tintColorLight,
    tabBackground: '#FFFFFF',
    tabBorder: '#C8E6C9',
    headerBackground: '#FFFFFF',
    headerTint: '#0A3714',
    cardBackground: '#FFFFFF',
    border: '#C8E6C9',
  },
  dark: {
    text: '#E8F5E9',         // Light green text
    textDim: '#81C784',      // Muted light green
    background: '#051B0C',   // Very dark green
    backgroundPress: '#0A3714',
    tint: tintColorDark,
    tabIconDefault: '#81C784',
    tabIconSelected: tintColorDark,
    tabBackground: '#051B0C',
    tabBorder: '#1B5E20',
    headerBackground: '#051B0C',
    headerTint: '#E8F5E9',
    cardBackground: '#0A3714',
    border: '#1B5E20',
  },
};