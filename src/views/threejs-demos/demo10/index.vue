<template>
  <div :ref="divName" class="threejs-container">
    <div ref="WidgetStats" class="stats-output"></div>
    <div ref="WidgetGUI" class="gui-output"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { TrackballControls } from 'three-trackballcontrols-ts'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { WEBGL } from 'three/examples/jsm/WebGL'
/**
 * Three.js 源码更新，删除了Detector.js ，采用新的WebGL.js了
 */

@Component({
  name: 'MyThreeDemosHomeDemo10'
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
    // 创建WebGLRenderer并检查兼容
    /**
     * Three.js 源码更新，删除了Detector.js ，采用新的WebGL.js了
     * import Detector from 'three/libs/examples/js/Detector.js'
     */
    // if (Detector.webgl) {
    //   renderer = new THREE.WebGLRenderer({ antialias: true, autoClear: true })
    // } else {
    //   renderer = new THREE.CanvasRenderer()
    // }
    const webGlRenderer = new THREE.WebGLRenderer()
    webGlRenderer.antialias = true
    webGlRenderer.autoClear = true
    webGlRenderer.setSize(viewWidth, viewHeight)
    webGlRenderer.setClearColor(0x050505)
    domThreejsObj.append(webGlRenderer.domElement)
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(0, 200, 300)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    // 创建场景
    const scene = new THREE.Scene()
    const spotLight = new THREE.SpotLight(0xeaeaea)
    spotLight.position.set(-100, 200, 300)
    scene.add(spotLight)
    scene.add(new THREE.AmbientLight(0x3d3d3d))
    // 构造线段
    const lineGeometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([-200, -200, -200, 200, 200, 200])
    // lineGeometry.vertices.push(
    //   new THREE.Vector3(-200, -200, -200),
    //   new THREE.Vector3(200, 200, 200)
    // )
    lineGeometry.addAttribute(
      'position',
      new THREE.BufferAttribute(vertices, 3)
    )
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x9b30ff
    })
    const line = new THREE.Line(lineGeometry, lineMaterial)
    // 计算线条间的距离
    line.computeLineDistances()
    scene.add(line)
    // 创建gridHelper
    const gridHelper = new THREE.GridHelper(1200, 60, 0xff4444, 0x404040)
    scene.add(gridHelper)
    // 创建轨迹球控件
    const trackballControls = new TrackballControls(
      camera,
      webGlRenderer.domElement
    )

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
      trackballControls.update()
      trackballControls.handleResize()
      // 开始渲染
      webGlRenderer.render(scene, camera)
    }
    function animate(): void {
      requestAnimationFrame(animate)
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
