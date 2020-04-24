<template>
  <div>
    <div class="container_box" id="audio_detail">
      <div>
        <audio autoplay="autoplay" ref="audioPlayer" id="audioPlayer" preload="auto" :src="audio.src">
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
    <div slot="footer" class="dialog-footer">
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

<style lang="scss">
  .call-list .dialog-footer {
    padding: 0px 20px 0;
    display: flex;
  }
  .call-list .dialog-footer > div {
    flex: 1;
  }
  .call-list .dialog-footer .audio-ctr {
    display: flex;
    justify-content: center;
  }
  .call-list .dialog-footer .audio-ctr .audio-ctr-button {
    margin: 0 10px;
    /*flex: 1;*/
    width: 22px;
    height: 22px;
    cursor: pointer;
  }
  .call-list .dialog-footer .audio-ctr .play, .call-list .dialog-footer .audio-ctr .pause {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: relative;
    top: -10px;
    box-shadow: 0px 5px 10px 0px rgba(0, 188, 188, 0.3);
  }
  .call-list .dialog-footer .audio-ctr .play {
    background: url("./img/pause.png") no-repeat;
    background-size: contain;
  }
  .call-list .dialog-footer .audio-ctr .pause {
    background: url("./img/play.png") no-repeat;
    background-size: contain;
  }
  .call-list .dialog-footer .audio-ctr .back {
    background: url("./img/back.png") no-repeat;
    background-size: contain;
  }
  .call-list .dialog-footer .audio-ctr .back:hover {
    background: url("./img/back-hover.png") no-repeat;
    background-size: contain;
  }
  .call-list .dialog-footer .audio-ctr .forward {
    background: url("./img/forward.png") no-repeat;
    background-size: contain;
  }
  .call-list .dialog-footer .audio-ctr .forward:hover {
    background: url("./img/forward-hover.png") no-repeat;
    background-size: contain;
  }
  .call-list .dialog-footer .audio-vol {
    width: 150px;
    display: flex;
  }
  .call-list .dialog-footer .audio-vol .vol {
    width: 20px;
    height: 20px;
    cursor: pointer;
    background: url("./img/vol.png");
    background-size: contain;
  }
  .call-list .dialog-footer .audio-vol .vol-mute {
    background: url("./img/mute.png");
    background-size: contain;
  }
  .call-list .dialog-footer .audio-vol .el-slider {
    width: 60px;
    margin-left: 5px;
    position: relative;
    top: -7px;
  }
  .call-list .dialog-footer .audio-vol .el-slider .el-slider__runway {
    height: 3px;
  }
  .call-list .dialog-footer .audio-vol .el-slider .el-slider__runway .el-slider__bar {
    height: 3px;
    background-color: #696D83;
  }
  .call-list .dialog-footer .audio-vol .el-slider .el-slider__runway .el-slider__button-wrapper {
    width: 20px;
    height: 20px;
    top: -11px;
  }
  .call-list .dialog-footer .audio-vol .el-slider .el-slider__runway .el-slider__button {
    width: 7px;
    height: 7px;
    border-color: #696D7F;
  }
  .call-list .dialog-footer .play-speed {
    text-align: right;
  }
  .call-list .container_box {
    user-select: none;
  }
  .call-list .container_box .audioBox_slider:hover .el-slider__button {
    opacity: 1;
  }
  .call-list .container_box .el-slider__button {
    transition: all 0.3s;
    opacity: 0;
  }
  .call-list .container_box .audioBox {
    padding: 10px 15px;
  }
  .call-list .container_box .audio-time {
    display: flex;
  }
  .call-list .container_box .audio-time .audioBox_left {
    flex: 1;
    color: #999;
    font-size: 12px;
    width: 14%;
    text-align: left;
  }
  .call-list .container_box .audio-time .audioBox_mid {
    color: #f00;
  }
  .call-list .container_box .audio-time .audioBox_right {
    flex: 1;
    text-align: right;
    color: #999;
    font-size: 12px;
    width: 14%;
  }
  .call-list .container_box .audioBox_slider {
    width: 100%;
  }
</style>
