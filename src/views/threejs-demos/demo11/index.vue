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
import { OrbitControls } from '@three-ts/orbit-controls'
/**
 * Three.js 源码更新，删除了Detector.js ，采用新的WebGL.js了
 */
// const XingShuFontJson = require('./font/XingShu.json') // 由typeface生成的json文件即可
const ThreejsFontJson = require('three/examples/fonts/gentilis_regular.typeface.json')

@Component({
  name: 'MyThreeDemosHomeDemo11'
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

    // 创建WebGlRenderer
    const webGlRenderer = new THREE.WebGLRenderer()
    webGlRenderer.antialias = true
    webGlRenderer.autoClear = true
    webGlRenderer.setClearColor(0x050505)
    webGlRenderer.setSize(viewWidth, viewHeight)
    webGlRenderer.shadowMap.enabled = true
    webGlRenderer.shadowMap.type = THREE.PCFShadowMap
    domThreejsObj.append(webGlRenderer.domElement)
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(0, 200, 300)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    // 创建场景
    const scene = new THREE.Scene()
    // 灯光
    const spotLight = new THREE.SpotLight(0xeedfcc)
    spotLight.position.set(-100, 200, 100)
    spotLight.castShadow = true
    scene.add(spotLight)
    scene.add(new THREE.AmbientLight(0xd1d1d1))
    // girdHelper
    const gridHelper = new THREE.GridHelper(1200, 60, 0xcd3700, 0x424242)
    scene.add(gridHelper)
    // 文字
    const textContent = 'three.js'
    // 使用FontLoader加载字体
    const fontLoader = new THREE.FontLoader()
    // const XingShuFont = fontLoader.parse(XingShuFontJson)
    const ThreejsFont = fontLoader.parse(ThreejsFontJson)
    debugger
    // 文字配置
    const fontConfig: THREE.TextGeometryParameters = {
      font: ThreejsFont,
      size: 100,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelSegments: 5
    }
    // TextGeometry文本几何对象
    const textGeometry = new THREE.TextGeometry(textContent, fontConfig)
    textGeometry.computeBoundingBox() // 绑定盒子模型
    //   textGeometry.center()
    // 文字材质
    const textMaterial = new THREE.MeshNormalMaterial()
    const text = new THREE.Mesh(textGeometry, textMaterial)
    // 计算出整个模型宽度的一般，不然模型就会绕着 x =0 中心旋转
    const textMeshBoundingBox = textGeometry.boundingBox
    if (textMeshBoundingBox) {
      text.position.x =
        -(textMeshBoundingBox.max.x - textMeshBoundingBox.min.x) / 2
    }
    scene.add(text)

    // 创建 轨道控制器
    const orbitControls = new OrbitControls(camera, webGlRenderer.domElement)

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
      orbitControls.update()
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
