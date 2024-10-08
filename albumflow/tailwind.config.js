import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    colors: {
      'primary': '#464382',
      'secondary': '#8680ff',
      'accent': '#7a75ff',
      'dark-mode-border': '#212121',
      'dark-mode-navbar': '#060606',
      'dark-mode-background': '#080808',
      'dark-mode-slider': '#000000',
      'dark-mode-text': '#ffffff',
      'dark-mode-hover': '#7a75ff',
      'dark-mode-card': '#18181b',
      'dark-mode-searcher-border': '#3f3f46',

      'white-mode-border': '#e5e5e5',
      'white-mode-container': '#fff',
      'white-mode-background': '#fff',
      'white-mode-navbar': '#fff',
      'white-mode-slider': '#fff',
      'white-mode-text': '#000000',
      'white-mode-hover': '#ebebed',
      'white-mode-card': '#18181b',
    }
  },
  darkMode: "class",
  plugins: [
    nextui({
    }),],

}
