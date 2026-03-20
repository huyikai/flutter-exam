import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground, var(--foreground))',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        'accent-blue': 'var(--accent-blue)',
        'primary-hover': 'var(--primary-hover)',
        'surface-container-high': 'var(--surface-container-high)',
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: '12px',
        sm: '8px',
      },
      fontFamily: {
        sans: ['Geist Variable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'headline': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'title': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'label': ['0.875rem', { lineHeight: '1.5' }],
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'elevation-2': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'primary-glow': '0 4px 14px rgba(5, 83, 177, 0.4)',
      },
    },
  },
  plugins: [typography],
}

