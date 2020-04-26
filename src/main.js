import Vue from 'vue'
import App from './App.vue'
import vSlider from '../src/common/slider'
// import vAudio from '../dist/v-audio.min'
import vAudio from './lib/Index'

Vue.use(vSlider)
Vue.use(vAudio)

new Vue({
  el: '#app',
  render: h => h(App)
})
