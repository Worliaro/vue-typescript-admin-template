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
// import { TrackballControls } from 'three-trackballcontrols-ts'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { WEBGL } from 'three/examples/jsm/WebGL'
import { GridHelper } from 'three'
/**
 * Three.js 源码更新，删除了Detector.js ，采用新的WebGL.js了
 */

@Component({
  name: 'MyThreeDemosHomeDemo15'
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
    const webGlRenderer = new THREE.WebGLRenderer({
      antialias: true
    })
    webGlRenderer.autoClear = true
    webGlRenderer.setSize(viewWidth, viewHeight)
    domThreejsObj.append(webGlRenderer.domElement)
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(0, 400, 600)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    // 创建场景
    const scene = new THREE.Scene()
    // 灯光
    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-300, 600, -400)
    scene.add(spotLight)
    scene.add(new THREE.AmbientLight(0x5c5c5c))
    // 初始化模型
    const gridHeper = new GridHelper(1200, 50, 0xcd3700, 0x4a4a4a)
    scene.add(gridHeper)
    const cubeGeometry = new THREE.BoxGeometry(100, 100, 100)
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0x9370db
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    scene.add(cube)
    // 轨迹
    const trackballControls = new TrackballControls(
      camera,
      webGlRenderer.domElement
    )
    // 平移控件
    const transformControls = new TransformControls(
      camera,
      webGlRenderer.domElement
    )
    scene.add(transformControls)
    // 过滤出类型是Mesh的物体，例如 辅助网格
    const meshObjs = scene.children.filter(item => {
      return item.type === 'Mesh'
    })
    // 拖拽控件
    const dragControls = new DragControls(
      meshObjs,
      camera,
      webGlRenderer.domElement
    )
    // 鼠标掠过
    dragControls.addEventListener('hoveron', event => {
      transformControls.attach(event.object)
    })
    // 开始拖拽
    dragControls.addEventListener('dragstart', event => {
      trackballControls.enabled = false
    })
    // 拖拽结束
    dragControls.addEventListener('dragend', event => {
      trackballControls.enabled = true
    })
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
