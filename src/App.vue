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
        volume: 1,
        src: './src/music/Pascal%20Letoublon%20-%20Friendships.mp3',
        noSources: 'no '
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
