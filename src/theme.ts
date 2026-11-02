// Colors, title sizing and button geometry from Figma's Check - 1 frame (9:505).
export const theme = {
  colors: {
    background: '#F4F5FA',
    surface: '#FFFFFF',
    ink: '#1B1F3B',
    muted: '#616883',
    inactive: '#9CA1BD',
    primary: '#4B4FD9',
    border: '#E1E4EE',
    disabledFill: '#D5D8E6',
    disabledText: '#8A8FAA',
  },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  radius: { button: 14, card: 16, chip: 24 },
} as const;
