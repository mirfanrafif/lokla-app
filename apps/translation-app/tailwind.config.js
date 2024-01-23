const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontSize: {
        header1: '24px',
        header2: '18px',
        header3: '16px',
      },
      colors: {
        primary: {
          default: 'var(--primary-default)',
          hover: 'var(--primary-hover)',
          darkBg: 'var(--primary-dark-bg)',
        },
      },
    },
  },
  plugins: [],
};
