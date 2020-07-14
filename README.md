# vue-audio-component

> A Audio Component for Vue.js

## INSTALL

``` bash
# install dependencies
npm install supreme-audio
```
## USE
```
# in main.js

import vAudio from 'supreme-audio'

Vue.use(vAudio)


# in template
<v-audio :audio="audioData"></v-audio>

# desc
audio: {
  src: '', // string, audio url
  volume: '', // number, 0 <= 1
  noSources: '' // string tips for no sources
}

```

# build for production with minification
npm run build
```


# Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

