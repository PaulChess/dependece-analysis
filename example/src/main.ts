import Vue from 'vue'
import App from './App.vue'
import './styles/reset.css'
import { initTheme } from '@atom/b2c-tokens'
import "@atom/b2c-tokens/dist/variables_750_rem.css"
import '@atom/atom-icons/icons/arrow-right'
import '@exposure-lib/polyfill'
import { Button, Tooltip, Icon, BottomSheet, Cell, Tabs as AtomTab } from '@atom/atom-ui'
import { Button as VantButton } from 'vant'

initTheme()

function hello () {
  const Vue = '1111';
}

Vue.use(Button).use(Tooltip)
  .use(Icon)
  .use(BottomSheet)
  .use(Cell)
  .use(VantButton) 

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
