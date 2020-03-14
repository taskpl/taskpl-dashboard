import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import DataTables from 'vue-data-tables'

import App from './App.vue'

Vue.use(DataTables)
Vue.use(ElementUI)
Vue.use(VueAxios, axios)

new Vue({
  el: '#app',
  render: h => h(App)
})
