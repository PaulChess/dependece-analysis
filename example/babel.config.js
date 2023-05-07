module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['import', {
      libraryName: '@atom/atom-ui',
      libraryDirectory: 'es_750_rem',
      style: true
    }, '@atom/atom-ui'],
    [
      'import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}
