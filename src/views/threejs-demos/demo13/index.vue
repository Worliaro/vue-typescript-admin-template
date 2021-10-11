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
import { GridHelper } from 'three'
/**
 * Three.js 源码更新，删除了Detector.js ，采用新的WebGL.js了
 */
// const XingShuFontJson = require('./font/XingShu.json') // 由typeface生成的json文件即可
const ThreejsFontJson = require('three/examples/fonts/gentilis_regular.typeface.json')
import { EventDispatcher } from 'three/build/three.module'

@Component({
  name: 'MyThreeDemosHomeDemo13'
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

  initWebGlRenderer(): THREE.WebGLRenderer {
    const webGlRenderer = new THREE.WebGLRenderer()
    webGlRenderer.antialias = true
    webGlRenderer.autoClear = true
    webGlRenderer.setClearColor(0x050505)
    webGlRenderer.setSize(
      this.domThreejs.offsetWidth,
      this.domThreejs.offsetHeight
    )
    webGlRenderer.shadowMap.enabled = true
    webGlRenderer.shadowMap.type = THREE.PCFShadowMap
    this.domThreejs.append(webGlRenderer.domElement)
    return webGlRenderer
  }

  initCamera(
    position: THREE.Vector3,
    lookAtPoint: THREE.Vector3
  ): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      45,
      this.domThreejs.offsetWidth / this.domThreejs.offsetHeight,
      0.1,
      10000
    )
    const { x, y, z } = position
    camera.position.set(x, y, z)
    camera.lookAt(lookAtPoint)
    return camera
  }

  initScene(): THREE.Scene {
    return new THREE.Scene()
  }

  makeAmbientLight(color: number): THREE.AmbientLight {
    const ambientLight = new THREE.AmbientLight(color)
    return ambientLight
  }

  makeSpotLight(
    color: number,
    position: THREE.Vector3,
    castShadow: boolean
  ): THREE.SpotLight {
    const spotLight = new THREE.SpotLight(color)
    const { x, y, z } = position
    spotLight.position.set(x, y, z)
    spotLight.castShadow = castShadow
    return spotLight
  }

  initGui(domThreeView: HTMLElement): GUI {
    const gui = new GUI()
    domThreeView.appendChild(gui.domElement)
    return gui
  }

  initGridHelper(
    size?: number | undefined,
    divisions?: number | undefined,
    color1?: THREE.ColorRepresentation | undefined,
    color2?: THREE.ColorRepresentation | undefined
  ): GridHelper {
    const girdHelper = new GridHelper(size, divisions, color1, color2)
    return girdHelper
  }

  makeTextGeometry(
    fontParameters: THREE.TextGeometryParameters,
    text: string
  ): THREE.ShapeGeometry {
    // 生成二维字体
    const font = fontParameters.font
    const shapes = font.generateShapes(text, 100)
    const textGeometry = new THREE.ShapeGeometry(shapes)
    textGeometry.computeBoundingBox() // 绑定盒子模型
    return textGeometry
  }

  makeTextMaterial(): THREE.Material {
    const fontMaterial = new THREE.MeshLambertMaterial({
      color: 0x912cee,
      side: THREE.DoubleSide,
      wireframe: false
    })
    return fontMaterial
  }

  loadFont(fontJson: JSON): THREE.Font {
    const fontLoader = new THREE.FontLoader()
    const font = fontLoader.parse(fontJson)
    return font
  }

  makeTextGeometryParams(
    fontParameters: {
      font?: THREE.Font | undefined
      size?: number | undefined
      height?: number | undefined
      curveSegments?: number | undefined
      bevelEnabled?: boolean | undefined
      bevelThickness?: number | undefined
      bevelSize?: number | undefined
      bevelOffset?: number | undefined
      bevelSegments?: number | undefined
    },
    fontJson?: JSON
  ): THREE.TextGeometryParameters {
    if (fontJson) {
      const font = this.loadFont(fontJson)
      fontParameters.font = font
    }
    if (fontParameters.font) {
      return {
        font: fontParameters.font,
        size: fontParameters.size,
        height: fontParameters.height,
        curveSegments: fontParameters.curveSegments,
        bevelEnabled: fontParameters.bevelEnabled,
        bevelThickness: fontParameters.bevelThickness,
        bevelSize: fontParameters.bevelSize,
        bevelOffset: fontParameters.bevelOffset,
        bevelSegments: fontParameters.bevelSegments
      }
    }
    throw new Error('miss font')
  }

  makeTextMesh(
    fontParameters: THREE.TextGeometryParameters,
    text: string
  ): THREE.Mesh {
    const textGeometry = this.makeTextGeometry(fontParameters, text)
    const textMaterial = this.makeTextMaterial()
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    // 计算出整个模型宽度的一半  不然模型会绕着x=0中心旋转
    const textBoundBox = textGeometry.boundingBox
    if (textBoundBox) {
      textMesh.position.x = -(textBoundBox.max.x - textBoundBox.min.x) / 2
    }
    return textMesh
  }

  initOrbitControls(
    camera: THREE.Camera,
    domElement: HTMLElement
  ): OrbitControls {
    const orbitControls = new OrbitControls(camera, domElement)
    return orbitControls
  }

  handlerKeydown(
    event: any,
    position: THREE.Vector3,
    lookAtPoint: THREE.Vector3,
    camera: THREE.PerspectiveCamera,
    domThreejsView: HTMLElement
  ): void {
    switch (event.keyCode) {
      case 13: // 按下 enter 键时触发
        // 重新初始化相机和控制器
        this.initCamera(position, lookAtPoint)
        this.initOrbitControls(camera, domThreejsView)
        break
    }
  }

  handlerWindowResize(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    domThreejsView?: HTMLElement
  ): void {
    if (domThreejsView) {
      camera.aspect = domThreejsView.offsetWidth / domThreejsView.offsetHeight
      camera.updateProjectionMatrix() // 更新相机的投影矩阵
      renderer.setSize(domThreejsView.offsetWidth, domThreejsView.offsetHeight) // 更新渲染器大小
    } else {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix() // 更新相机的投影矩阵
      renderer.setSize(window.innerWidth, window.innerHeight) // 更新渲染器大小
    }
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
    // 创建WebGlRenderer
    const webGlRenderer = this.initWebGlRenderer()
    // 创建相机
    const defaultPosition = new THREE.Vector3(0, 60, 600)
    const defaultLookAtPoint = new THREE.Vector3(0, 0, 0)
    let camera = this.initCamera(defaultPosition, defaultLookAtPoint)
    // 创建场景
    const scene = this.initScene()
    // 灯光
    scene.add(this.makeAmbientLight(0xc1c1c1))
    scene.add(
      this.makeSpotLight(0xffffff, new THREE.Vector3(-300, 600, -400), true)
    )
    // 文字网格模型
    const textGeometryParams = this.makeTextGeometryParams(
      {
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelSegments: 5
      },
      ThreejsFontJson
    )
    const textMesh = this.makeTextMesh(textGeometryParams, 'three.js')
    scene.add(textMesh)
    // 添加平面
    const planeGeometry = new THREE.PlaneGeometry(600, 300)
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0x545454,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    scene.add(plane)
    // 格网辅助
    const gridHelper = this.initGridHelper(1200, 50, 0xcd3700, 0x424242)
    scene.add(gridHelper)
    // GUI
    const gui = this.initGui(<HTMLElement>vm.$refs.WidgetGUI)
    ;(<HTMLElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)
    // 轨道控件
    let orbitControls = this.initOrbitControls(camera, webGlRenderer.domElement)
    // // 窗口大小改变触发的方法
    window.addEventListener(
      'resize',
      (event: any) => {
        vm.handlerWindowResize(camera, webGlRenderer, vm.domThreejs)
      },
      false
    )
    // 回车按键点击事件
    window.addEventListener(
      'keydown',
      (event: any) => {
        switch (event.keyCode) {
          case 13: // 按下 enter 键时触发
            // 重新初始化相机和控制器
            camera = this.initCamera(defaultPosition, defaultLookAtPoint)
            orbitControls = this.initOrbitControls(camera, this.domThreejs)
            break
        }
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
