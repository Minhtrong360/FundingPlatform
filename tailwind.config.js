/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,jsx,ts,tsx,vue,js}',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
      },
      fontFamily: {
        'body': [
          'Inter', 
          'ui-sans-serif', 
        ],
        'sans': [
          'Inter', 
          'ui-sans-serif', 
          
        ]
      }
    },
  },
  plugins: [
    //require('preline/plugin'),
    require('@tailwindcss/forms'),
    require('flowbite/plugin'),
    require('flowbite-typography'),
  ],
}
