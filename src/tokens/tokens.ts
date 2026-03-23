/**
 * Quill Web UI Kit — TypeScript Token Object
 *
 * Use these tokens in .tsx files (logic, inline styles, theme values).
 * Do NOT import this file inside .module.css — use variables.css custom properties instead.
 */

export const tokens = {
  color: {
    primary: {
      main: '#005d9f',
      hover: '#004d87',
      light: '#e3f0fa',
    },
    text: {
      primary: '#000000de',
      secondary: '#00000099',
      disabled: '#00000061',
      inverse: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#fdecea',
    },
    warning: {
      main: '#ed6c02',
      light: '#fff4e5',
    },
    info: {
      main: '#0288d1',
      light: '#e5f6fd',
    },
    success: {
      main: '#2e7d32',
      light: '#edf7ed',
    },
    background: '#ffffff',
    surface: '#ffffff',
    surfaceRaised: '#f5f5f5',
    action: {
      active: '#0000008f',
      hover: '#0000000a',
      selected: '#00000014',
      disabled: '#00000042',
      disabledBg: '#0000001f',
    },
    divider: '#0000001f',
  },
  typography: {
    fontFamily: {
      base: "'Roboto', system-ui, sans-serif",
      mono: "'Roboto Mono', monospace",
    },
    fontSize: {
      xs: '11px',
      sm: '13px',
      md: '14px',
      xl: '20px',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
    },
    lineHeight: {
      xs: '16px',
      sm: '20px',
      md: '20px',
      xl: '28px',
    },
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    full: '100px',
  },
  shadow: {
    1: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    2: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    4: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    standard: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

export type Tokens = typeof tokens
