<template>
  <div class="background">
    <div id="demo">
      <div id="greenBox" class="box green"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TweenMax, TweenLite, Linear } from 'gsap'

@Component({
  name: 'MyThreeDemosHomeDemo18'
})
export default class extends Vue {
  mounted() {
    this.init()
  }

  init() {
    const vm = this
    const domBox = document.getElementById('greenBox')
    if (!domBox) {
      alert('box dom not init')
    }
    let count = 0
    const tween = TweenMax.to(domBox, 2, {
      left: '760px',
      repeat: 10,
      yoyo: true,
      onRepeat: onRepeat,
      repeatDelay: 0.5,
      ease: Linear.easeNone
    })
    function onRepeat() {
      count++
      if (domBox) {
        domBox.innerHTML = count + ''
        TweenLite.set(domBox, {
          backgroundColor: `hsl(${Math.random() * 255},90%,60%)`
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.background {
  background-color: #1d1d1d;
  font-family: 'Asap', sans-serif;
  color: #989898;
  font-size: 16px;
  width: auto;
  height: 100%;
  position: relative;
}
#demo {
  height: 100%;
  position: relative;
  top: 10px;
  left: 10px;
  overflow: hidden;
  .box {
    width: 100px;
    height: 100px;
    position: relative;
    border-radius: 6px;
    text-align: center;
    line-height: 100px;
    color: black;
    font-size: 80px;
  }
  .green {
    background-color: #6fb936;
  }
}
</style>
