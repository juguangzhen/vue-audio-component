/*
 * @Author: guangzhen.ju.o
 * @Date: 2020/4/24 6:54 下午
 */
// 导入所有组件
import vAudio from './audio/Index'

const components = [vAudio]
const install = function(vue) {
  if (install.installed) return
  components.map((component) => {
    vue.component(component.name, component)
  })
}
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  vAudio
}
