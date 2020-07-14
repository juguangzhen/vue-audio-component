/*
 * @Author: guangzhen.ju.o
 * @Date: 2020/4/24 6:53 下午
 */
import vAudio from './Index.vue'
vAudio.install = Vue => Vue.component(vAudio.name, vAudio) // .name就是开始说的vue文件暴露出来的name名，ldcPagination整个组件
export default vAudio
