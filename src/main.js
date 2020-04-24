import Vue from 'vue'
import App from './App.vue'
import elSlider from '../src/common/slider'
// import vAudio from '../dist/v-audio.min'
import vAudio from './lib/Index'

Vue.use(elSlider)
Vue.use(vAudio)

new Vue({
  el: '#app',
  render: h => h(App)
})
