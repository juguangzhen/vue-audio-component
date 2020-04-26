<template>
  <div id="app">
    <v-audio :audio="musicDetail"></v-audio>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      musicDetail: {
        src: './src/music/Pascal%20Letoublon%20-%20Friendships.mp3'
      }
    }
  },
  created() {
  }
}
</script>

<style>
#app {
  margin-top: 60px;
}
</style>
