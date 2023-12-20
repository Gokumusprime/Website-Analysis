import Vue from "vue"
import { createPinia, PiniaVuePlugin } from "pinia"
import Dashboard from './components/dashboard.vue'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make Pinia available to project
Vue.use(PiniaVuePlugin);
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// Create initial view under the dashboard element
new Vue({
  el: '#dashboard',
  pinia: createPinia(),
  render: (h) => h(Dashboard)
});


