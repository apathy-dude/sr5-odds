import 'babel-polyfill'
import './object'
import 'vuetify/dist/vuetify.css'
import Vue, { ComponentOptions } from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'

Vue.use(Vuetify)

export default new Vue({
  el: '#app',
  template: '<App/>',
  components: { App: App as ComponentOptions<Vue> }
})
