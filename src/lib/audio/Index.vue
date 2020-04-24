<template>
  <div class="audio-box">
    <div class="container_box" id="audio_detail">
      <div>
<!--        <audio autoplay="autoplay" ref="audioPlayer" id="audioPlayer" preload="auto" :src="audio.src">-->
        <audio autoplay="autoplay" ref="audioPlayer" id="audioPlayer" preload="auto" src="./src/assets/to%20you%20in%20the%20future.m4a">
          你的浏览器不支持audio标签
        </audio>
        <div class="audioBox">
          <div class="audioBox_top">
            <div class="audio-time">
              <div class="audioBox_left">
                {{ audioCurrentTime }}
              </div>
              <div class="audioBox_mid" v-if="audioPlayer && !audioPlayer.duration">
                {{  audio.noSources || defaultAudio.noSources }}
              </div>
              <div class="audioBox_right">
                {{ audioAllTime }}
              </div>
            </div>
            <div class="audioBox_slider">
              <el-slider v-model="audioTime" @change="onChange" :show-tooltip="false" :step="1" :max="audioTimeLonger"></el-slider>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="audio-footer">
      <div class="audio-vol">
        <div class="vol" :class="{ 'vol-mute' : audioVol === 0 }" @click="setVolMute"></div>
        <el-slider v-model="audioVol" @change="setVol" :show-tooltip="false" :step="0.1" :max="1"></el-slider>
      </div>
      <div class="audio-ctr">
        <div class="audio-ctr-button back" @click="gotoSession(-15)"></div>
        <div class="audio-ctr-button big-icon" :class="isPlay ? 'pause' : 'play'" @click="ctrlAudio"></div>
        <div class="audio-ctr-button forward" @click="gotoSession(15)"></div>
      </div>
      <div class="play-speed" @click="changeMultiple">
        <span>{{ multipleArray[multipleIndex] }}X</span>
        <span>倍速</span>
      </div>
    </div>
  </div>
</template>

<script>
  /*
   * @Author: guangzhen.ju.o
   * @Date: 2020/4/23 2:48 下午
   */

  export default {
    name: "vAudio",
    props: {
      audio: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return{
        defaultAudio: {
          noSources: '没有可播放的资源',
        },
        audioDetail: {}, // 音频详情
        audioTime:0, // 音频进度百分比
        audioVol: 0.5, // 音频音量百分比
        isMute: false, // 是否静音
        backupVol: 0.5, // 保存静音前的音量
        audioTimeLonger: 0,
        audioCurrentTime:'00:00', // 音频当前播放时间
        audioAllTime:'00:00', // 音频总播放时间
        audioAllDuration:0, // 音频总播放秒数
        isPlay:false, // 是否正在播放
        multipleArray:[0.75,1,1.5,2],
        multipleIndex:1,
        audioInterval: null,
        audioPlayer: null
      }
    },
    mounted() {
      this.setAudioInterval()
    },
    beforeDestroy() {
      clearInterval(this.audioInterval)
    },
    methods: {
      close() {
        this.$emit('closeAudio')
      },
      ctrlAudio() {
        if(!this.audioPlayer.duration) {
          return
        }
        if(this.isPlay) {
          this.pauseAudio()
        } else {
          this.playAudio()
        }
      },
      realFormatSecond(second) {
        // let secondType = typeof second
        if (second) {
          this.audioTimeLonger = 100
          second = parseInt(second)
          let minute = Math.floor(second / 60)
          second = second - minute * 60
          return ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2)
        } else {
          return '00:00'
        }
      },
      //设置定时检测
      setAudioInterval(){
        this.audioInterval = setInterval(()=>{
          this.getAudioTime()
          if(!this.audioPlayer) {
            this.audioPlayer = document.getElementById('audioPlayer')
          }
          this.audioPlayer.volume = this.audioVol
          if(this.audioPlayer.ended){
            //播放结束后重置数据
            clearInterval(this.audioInterval)
            this.audioTime = 0
            this.audioPlayer.currentTime = 0
            this.audioCurrentTime = '00:00'
            this.isPlay = false
          }
          this.audioPlayer.paused ? this.isPlay = false : this.isPlay = true
        },500)
      },
      setVolMute() {
        if(this.isMute) {
          this.isMute = false
          this.setVol(this.backupVol)
        } else {
          this.isMute = true
          this.backupVol = this.audioVol ? this.audioVol : 0.5
          this.setVol(0)
        }
      },
      setVol(val) {
        if(!val) {
          this.isMute = true
        }
        this.audioVol = val
        this.audioPlayer.volume = this.audioVol
      },
      //播放
      playAudio(){
        //重设定时器
        clearInterval(this.audioInterval)
        this.getAudioTime()
        this.setAudioInterval()
        this.audioPlayer.volume = this.audioVol
        this.audioPlayer.play()
        this.isPlay = true
      },
      //暂停
      pauseAudio(){
        this.audioPlayer.pause()
        this.isPlay = false
      },
      //获取播放时间
      getAudioTime(){
        if(!this.audioPlayer) {
          this.audioPlayer = document.getElementById('audioPlayer')
        }
        //展示用
        this.audioAllTime = this.realFormatSecond(this.audioPlayer.duration - this.audioPlayer.currentTime)
        this.audioAllDuration = this.audioPlayer.duration
        this.audioCurrentTime = this.realFormatSecond(this.audioPlayer.currentTime)
        //计算当前进度百分比
        this.audioTime = Number((this.audioPlayer.currentTime*100/this.audioPlayer.duration).toFixed(3))
      },
      //滑动进度条
      onChange(value){
        // 设置播放时间
        if(isNaN(value)) return
        this.audioCurrentTime =  this.realFormatSecond(this.audioAllDuration * value / 100)
        this.audioPlayer.currentTime = parseInt(this.audioAllDuration * value / 100)
      },
      gotoSession(number) {
        this.audioPlayer.currentTime += number
        this.getAudioTime()
      },
      //设置倍速播放
      changeMultiple(){
        if(this.multipleIndex < 3) {
          this.multipleIndex++
        } else {
          this.multipleIndex=0
        }
        this.audioPlayer.playbackRate = this.multipleArray[this.multipleIndex]
      },
    }
  }
</script>

<style src="./slider.css"></style>
