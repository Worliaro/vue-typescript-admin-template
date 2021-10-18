<template>
  <div class="background">
    <div id="demo">
      <p>The start times of each animation are staggered by 0.5 seconds</p>
      <div class="box green"></div>
      <div class="box grey"></div>
      <div class="box orange"></div>
      <div class="box green"></div>
      <div class="box grey"></div>
      <div class="box orange"></div>
      <div class="box green"></div>
      <div class="box grey"></div>
      <div class="box orange"></div>
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
    TweenMax.staggerTo(
      '.box',
      1,
      {
        rotation: 360,
        y: 100
      },
      0.5
    )
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
  p {
    line-height: 22px;
    margin-bottom: 16px;
    width: 650px;
  }
  .box {
    width: 50px;
    height: 50px;
    position: relative;
    border-radius: 6px;
    text-align: center;
    line-height: 100px;
    color: black;
    font-size: 80px;
    display: inline-block;
  }
  .green {
    background-color: #6fb936;
  }
  .grey {
    background-color: #989898;
  }
  .orange {
    background-color: #f38630;
  }
}
</style>
