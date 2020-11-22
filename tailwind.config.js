module.exports = {
  purge: [
    "./src/**/*.svelte",
    "./src/**/*.html"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      appearance: ['hover', 'focus', 'disabled']
    },
  },
  plugins: [],
}
