import Vue from 'vue'
import App from './App.vue'
import './styles/reset.css'
import { initTheme } from '@atom/b2c-tokens'
import "@atom/b2c-tokens/dist/variables_750_rem.css"
import '@atom/atom-icons/icons/arrow-right'
import '@exposure-lib/polyfill'
import { Button, Tooltip, Icon, BottomSheet, Cell } from '@atom/atom-ui'
import { Button as VantButton } from 'vant'

initTheme()

Vue.use(Button)
  .use(Tooltip)
  .use(Icon)
  .use(BottomSheet)
  .use(Cell)
Vue.use(VantButton)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
