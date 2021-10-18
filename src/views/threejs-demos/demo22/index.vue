<template>
  <div :ref="divName" class="threejs-container">
    <div ref="WidgetStats" class="stats-output"></div>
    <div ref="WidgetGUI" class="gui-output"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { GridHelper } from 'three'

@Component({
  name: 'MyThreeDemosHomeDemo22'
})
export default class extends Vue {
  private divName = 'domThreejs'
  private domThreejs: HTMLElement = this.$refs[this.divName] as HTMLElement

  mounted() {
    this.preInit()
    this.init()
  }

  preInitStats(domRefName: string): HTMLElement {
    return this.$refs[domRefName] as HTMLElement
  }

  initStats(domWidgetStats: HTMLElement): Stats {
    if (!domWidgetStats) {
      throw new Error('[initStats]:miss dom')
    }
    const stats = new Stats()
    stats.setMode(0) // 0:显示 fps, 1:ms
    // 调整插件布局
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0px'
    stats.domElement.style.top = '0px'
    // 加入画布
    domWidgetStats.append(stats.domElement)
    return stats
  }

  preInit() {
    if (!this.domThreejs) {
      this.domThreejs = this.$refs[this.divName] as HTMLElement
    }
  }

  init() {
    const vm = this
    // 初始化性能插件
    const domWidgetStats = vm.preInitStats('WidgetStats')
    const stats = this.initStats(domWidgetStats)
    if (!vm.domThreejs) {
      throw new Error('[init]:miss threejs dom container')
    }
    const domThreejsObj = vm.domThreejs
    const viewWidth = domThreejsObj.offsetWidth
    const viewHeight = domThreejsObj.offsetHeight
    const viewSolution = domThreejsObj.offsetWidth / domThreejsObj.offsetWidth
    // 创建渲染器
    const webGlRenderer = new THREE.WebGLRenderer()
    webGlRenderer.setSize(viewWidth, viewHeight)
    webGlRenderer.setClearColor(0x050505)
    domThreejsObj.appendChild(webGlRenderer.domElement)
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(0, 300, 600)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    // 创建场景
    const scene = new THREE.Scene()
    // 灯光
    const spotLight = new THREE.SpotLight(0xe3e3e30)
    spotLight.position.set(-100, 200, 300)
    scene.add(spotLight)
    scene.add(new THREE.AmbientLight(0xb3b3b3))
    // 实体
    const gridHelper = new GridHelper(1200, 60, 0xcd3333, 0x4a4a4a)
    // scene.add(gridHelper)
    const sphereGeometry = new THREE.SphereGeometry(20, 50, 50)
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x9370db
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.position.y = 25
    sphere.position.x = -400
    sphere.name = 'sphere'
    scene.add(sphere)
    // 初始化 Tween
    const shpereObj = scene.getObjectByName('sphere')
    if (shpereObj) {
      const tweenShpere = new TWEEN.Tween(shpereObj.position)
      tweenShpere.to({ x: 400 }, 2000)
      //   tweenShpere.easing(TWEEN.Easing.Elastic.InOut)
      tweenShpere.start()
      tweenShpere.onUpdate(() => {
        console.log('tweenSphere:update')
      })
      //   const shpereObj1 = scene.getObjectByName('sphere')
      const tweenSphereBack = new TWEEN.Tween(shpereObj.position)
      tweenSphereBack.to({ x: -400 }, 2000)
      tweenShpere.chain(tweenSphereBack)
      tweenSphereBack.chain(tweenShpere)
    }
    // 初始化controls
    const controls = new TrackballControls(camera, webGlRenderer.domElement)

    // 窗口大小改变触发的方法
    window.addEventListener(
      'resize',
      () => {
        vm.onViewContainerResize(domThreejsObj, camera, webGlRenderer)
      },
      false
    )
    // 渲染方法
    function render(): void {
      // 更新性能插件
      stats.update()
      TWEEN.update()
      controls.update()
    }
    function animate(): void {
      requestAnimationFrame(animate)
      // 开始渲染
      webGlRenderer.render(scene, camera)
      render()
    }
    animate()
  }

  // 视图展示区域随窗口缩放
  onViewContainerResize(
    viewDom: HTMLElement,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ): void {
    camera.aspect = viewDom.offsetWidth / viewDom.offsetHeight
    camera.updateProjectionMatrix() // 更新相机的投影矩阵
    renderer.setSize(viewDom.offsetWidth, viewDom.offsetHeight) // 重新设置渲染器大小
  }
}
</script>
<style lang="scss" scoped>
.threejs-container {
  width: auto;
  height: 100%;
  position: relative;
  .gui-output {
    position: absolute;
    top: 0px;
    right: 0px;
  }
}
</style>
