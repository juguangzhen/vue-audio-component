<template>
  <div class="audio-box">
    <div class="container_box" id="audio_detail">
      <div>
        <audio :autoplay="audio.autoplay" ref="audioPlayer" id="audioPlayer" preload="auto" :src="audio.src">
        你的浏览器不支持audio标签
        </audio>
        <div class="audio-box">
          <div class="audio-box_top">
            <div class="audio-time">
              <div class="audio-box_left">
                {{ audioCurrentTime }}
              </div>
              <div class="audio-box_mid" v-if="audioPlayer && !audioPlayer.duration">
                {{  audio.noSources || defaultAudio.noSources }}
              </div>
              <div class="audio-box_right">
                {{ audioAllTime }}
              </div>
            </div>
            <div class="audio-box_slider">
              <v-slider v-model="audioTime" @change="onChange" :step="1" :max="audioTimeLonger"></v-slider>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="audio-footer">
      <div class="audio-vol">
        <div class="vol" :class="{ 'vol-mute' : audioVol === 0 }" @click="setVolMute">
          <img src="../../assets/img/vol.png" alt="">
          <img class="mute" src="../../assets/img/mute.png" alt="">
        </div>
        <v-slider v-model="audioVol" @change="setVol" :step="0.1" :max="1"></v-slider>
      </div>
      <div class="audio-ctr">
        <div class="audio-ctr-button back" @click="gotoSession(-15)">
          <img class="hide" src="../../assets/img/back.png" alt="">
          <img class="hover" src="../../assets/img/back-hover.png" alt="">
        </div>
        <div class="audio-ctr-button big-icon" :class="isPlay ? 'pause' : 'play'" @click="ctrlAudio">
          <img v-show="isPlay" src="../../assets/img/play.png" alt="">
          <img v-show="!isPlay" src="../../assets/img/pause.png" alt="">
        </div>
        <div class="audio-ctr-button forward" @click="gotoSession(15)">
          <img class="hide" src="../../assets/img/forward.png" alt="">
          <img class="hover" src="../../assets/img/forward-hover.png" alt="">
        </div>
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
        required: true
      }
    },
    data() {
      return{
        defaultAudio: {
          noSources: '没有可播放的资源',
        },
        audioDetail: {}, // 音频详情
        audioTime: 0, // 音频进度百分比
        audioVol: 0.8, // 音频音量百分比
        isMute: false, // 是否静音
        backupVol: 0.8, // 保存静音前的音量
        audioTimeLonger: 0,
        audioCurrentTime: '00:00', // 音频当前播放时间
        audioAllTime: '00:00', // 音频总播放时间
        audioAllDuration: 0, // 音频总播放秒数
        isPlay: false, // 是否正在播放
        multipleArray: [0.75, 1, 1.5, 2],
        multipleIndex: 1,
        audioInterval: null,
        audioPlayer: null
      }
    },
    mounted() {
      this.initAudio()
    },
    beforeDestroy() {
      clearInterval(this.audioInterval)
    },
    methods: {
      initAudio() {
        if(typeof this.audio.volume !== 'number' && this.audio.volume !== undefined) {
          throw Error('volume must be a number!')
          return
        }
        if(this.audio.volume) {
          this.audioVol = this.audio.volume > 1 ? 1 : this.audio.volume
        } else if(this.audio.volume === 0) {
          this.isMute = true
          this.audioVol = this.audio.volume
        }
        this.setAudioInterval()
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
        // 边界值，当数值小于15秒并且是后退15秒的时候 second为负值
        if (second && second >= 0) {
          this.audioTimeLonger = 100
          second = parseInt(second)
          let minute = Math.floor(second / 60)
          second = second - minute * 60
          return ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2)
        } else {
          return '00:00'
        }
      },
      // 设置定时检测
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

      // 播放
      playAudio(){
        //重设定时器
        clearInterval(this.audioInterval)
        this.getAudioTime()
        this.setAudioInterval()
        this.audioPlayer.volume = this.audioVol
        this.audioPlayer.play()
        this.isPlay = true
      },
      // 暂停
      pauseAudio(){
        this.audioPlayer.pause()
        this.isPlay = false
      },
      // 获取播放时间
      getAudioTime(){
        if(!this.audioPlayer) {
          this.audioPlayer = document.getElementById('audioPlayer')
        }
        // 播放时间相关
        this.audioAllTime = this.realFormatSecond(this.audioPlayer.duration - this.audioPlayer.currentTime)
        this.audioAllDuration = this.audioPlayer.duration
        this.audioCurrentTime = this.realFormatSecond(this.audioPlayer.currentTime)
        // 计算当前进度百分比
        this.audioTime = Number((this.audioPlayer.currentTime*100/this.audioPlayer.duration).toFixed(3))
      },
      // 滑动进度条
      onChange(value){
        if(isNaN(value)) return
        this.audioCurrentTime =  this.realFormatSecond(this.audioAllDuration * value / 100)
        this.audioPlayer.currentTime = parseInt(this.audioAllDuration * value / 100)
      },
      gotoSession(number) {
        this.audioPlayer.currentTime += number
        this.getAudioTime()
      },
      // 设置倍速播放
      changeMultiple(){
        if(this.multipleIndex < 3) {
          this.multipleIndex ++
        } else {
          this.multipleIndex = 0
        }
        this.audioPlayer.playbackRate = this.multipleArray[this.multipleIndex]
      },
    }
  }
</script>
<style>
  @import "slider.css";
  .audio-box_slider .v-slider__button{
    border: none;
    background: #00bebe;
    width: 14px;
    height: 14px;
  }
</style>
