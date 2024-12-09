
/** @type {import('tailwindcss').Config} */
export default {
  content: [ 
    "./frontend/index.html",
   "./frontend/src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('/src/assets/FONDO.png')",
      },
      colors: {
        "brandPrimary": "#4CAF4F",
        "neutralDGrey": "#4D4D4D",
        "neutralGrey": "#717171",
        "neutralSilver": "#F5F7FA",
        "gray900": "#18191F",
        "neutralBlack": "#263238",
        "tertiary": "#F2F2F7",
        "shadeS5": "#103E13",
      }
    },
  },
  plugins: [require('flowbite/plugin')],
}

