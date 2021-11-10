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
import { OrbitControls } from '@three-ts/orbit-controls'
const SceneUtils = require('three/examples/jsm/utils/SceneUtils')
import {
  AmbientLight,
  ArrowHelper,
  DirectionalLightHelper,
  EventDispatcher,
  Group,
  MeshBasicMaterial,
  Object3D,
  ParametricGeometry,
  WireframeGeometry,
} from 'three'
import { VelocityNode } from 'three/examples/jsm/nodes/Nodes'

import { Face3, Geometry } from 'three/examples/jsm/deprecated/Geometry'

@Component({
  name: 'MyThreeDemosHomeDemo41',
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
    stats.setMode(0)
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0px'
    stats.domElement.style.top = '0px'
    domWidgetStats.append(stats.domElement)
    return stats
  }

  preInit() {
    if (!this.domThreejs) {
      this.domThreejs = this.$refs[this.divName] as HTMLElement
    }
  }

  initRenderer(domView: HTMLElement): THREE.WebGLRenderer {
    const webGlRenderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    webGlRenderer.setPixelRatio(window.devicePixelRatio)
    webGlRenderer.setSize(domView.offsetWidth, domView.offsetHeight)
    domView.appendChild(webGlRenderer.domElement)
    return webGlRenderer
  }

  initCamera(domView: HTMLElement): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      45,
      domView.offsetWidth / domView.offsetHeight,
      0.1,
      10000
    )
    camera.position.set(20, 10, 50)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return camera
  }

  initScene() {
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0x050505)
    // scene.fog = new THREE.Fog(scene.background, 2000, 3500)
    return scene
  }

  initLight(scene: THREE.Scene) {}

  initContent(scene: THREE.Scene) {
    const vm = this
    const dirX = new THREE.Vector3(1, 0, 0)
    const dirY = new THREE.Vector3(0, 1, 0)
    const dirZ = new THREE.Vector3(0, 0, 1)
    const origin = new THREE.Vector3(0, 0, 0)
    const length = 10
    const arrowHelperX = new THREE.ArrowHelper(dirX, origin, length, 0xff0000)
    const arrowHelperY = new THREE.ArrowHelper(dirY, origin, length, 0x00ff00)
    const arrowHelperZ = new THREE.ArrowHelper(dirZ, origin, length, 0x0000ff)
    scene.add(arrowHelperX)
    scene.add(arrowHelperY)
    scene.add(arrowHelperZ)
    // 原点
    const spriteOrigin = vm.makeTextSprite(' vector3(0,0,0)', {
      fontsize: 20,
      borderColor: { r: 255, g: 0, b: 0, a: 0.4 },
      backgroundColor: { r: 255, g: 255, b: 255, a: 0.9 },
    })
    if (spriteOrigin) {
      spriteOrigin.center = new THREE.Vector2(0, 0)
      scene.add(spriteOrigin)
      spriteOrigin.position.set(0, -5, 0)
    }
    // Y轴
    const spriteY = vm.makeTextSprite('Y', {
      fontsize: 20,
      borderColor: { r: 255, g: 0, b: 0, a: 0.4 },
      backgroundColor: { r: 255, g: 255, b: 255, a: 0.9 },
    })
    if (spriteY) {
      spriteY.center = new THREE.Vector2(0, 0)
      scene.add(spriteY)
      spriteY.position.set(0, 6, 0)
    }
    // X轴
    const spriteX = vm.makeTextSprite('X', {
      fontsize: 20,
      borderColor: { r: 255, g: 0, b: 0, a: 0.4 },
      backgroundColor: { r: 255, g: 255, b: 255, a: 0.9 },
    })
    if (spriteX) {
      spriteX.center = new THREE.Vector2(0, 0)
      scene.add(spriteX)
      spriteX.position.set(10, -5, 0)
    }
    // Z轴
    const spriteZ = vm.makeTextSprite('Z', {
      fontsize: 20,
      borderColor: { r: 255, g: 0, b: 0, a: 0.4 },
      backgroundColor: { r: 255, g: 255, b: 255, a: 0.9 },
    })
    if (spriteZ) {
      spriteZ.center = new THREE.Vector2(0, 0)
      scene.add(spriteZ)
      spriteZ.position.set(0, -5, 10)
    }
  }

  /**
   * 创建字体精灵
   */
  makeTextSprite(
    message: string,
    parameters: {
      fontface?: string
      fontsize?: number
      borderThickness?: number
      borderColor?: { r: number; g: number; b: number; a: number }
      backgroundColor?: { r: number; g: number; b: number; a: number }
    }
  ) {
    if (!parameters) {
      parameters = {
        fontface: 'Arial',
        fontsize: 18,
        borderThickness: 4,
        borderColor: { r: 0, g: 0, b: 0, a: 1.0 },
        backgroundColor: { r: 255, g: 255, b: 255, a: 1.0 },
      }
    }
    const fontface = parameters.fontface ? parameters.fontface : 'Arial'
    // 字体大小
    const fontsize = parameters.fontsize ? parameters.fontsize : 18
    // 边框厚度
    const borderThickness = parameters.borderThickness
      ? parameters.borderThickness
      : 4
    // 边框颜色
    const borderColor = parameters.borderColor
      ? parameters.borderColor
      : {
          r: 0,
          g: 0,
          b: 0,
          a: 1.0,
        }
    // 背景颜色
    const backgroundColor = parameters.backgroundColor
      ? parameters.backgroundColor
      : {
          r: 255,
          g: 255,
          b: 255,
          a: 1.0,
        }
    // 创建画布
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context) {
      // 字体加粗
      context.font = `Bold ${fontsize}px ${fontface}`
      // 获取文字的大小数据，高度取决于文字的大小
      const metrics = context.measureText(message)
      const textWidth = metrics.width
      // 背景颜色
      context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`
      // 边框颜色
      context.strokeStyle = `rgba(${borderColor.r},${borderColor.g},${borderColor.b},${borderColor.a})`
      context.lineWidth = borderThickness
      // 绘制圆角矩形
      roundRect(
        context,
        borderThickness / 2,
        borderThickness / 2,
        textWidth + borderThickness,
        fontsize * 1.4 + borderThickness,
        6
      )
      // 字体颜色
      context.fillStyle = 'rgba(0,0,0,1.0)'
      context.fillText(message, borderThickness, fontsize + borderThickness)
      // 画布内容用于纹理贴图
      const texture = new THREE.Texture(canvas)
      texture.needsUpdate = true
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
      })
      const sprite = new THREE.Sprite(spriteMaterial)
      console.log(sprite.material)
      // 缩放比例
      sprite.scale.set(10, 5, 0)
      return sprite
    }

    /**
     * 绘制圆角矩形
     */
    function roundRect(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
  }

  initOrbitControls(
    camera: THREE.Camera,
    webglRenderer: THREE.WebGLRenderer
  ): OrbitControls {
    const controls = new OrbitControls(camera, webglRenderer.domElement)
    controls.enableDamping = true
    // controls.maxPolarAngle = 0.49 * Math.PI
    // controls.rotateSpeed = 0.05
    // controls.enableRotate = false
    // controls.enablePan = false
    return controls
  }

  initGUI(scene: THREE.Scene) {
    const gui = new GUI()
    return {
      gui,
    }
  }

  init() {
    const vm = this
    const domWidgetStats = vm.preInitStats('WidgetStats')
    const stats = this.initStats(domWidgetStats)
    if (!vm.domThreejs) {
      throw new Error('[init]:miss threejs dom container')
    }
    const domThreejsObj = vm.domThreejs
    const webGlRenderer = vm.initRenderer(domThreejsObj)
    const camera = vm.initCamera(domThreejsObj)
    const scene = vm.initScene()
    vm.initLight(scene)
    vm.initContent(scene)
    const orbitControls = vm.initOrbitControls(camera, webGlRenderer)
    const { gui } = vm.initGUI(scene)
    ;(<HTMLElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)

    window.addEventListener(
      'resize',
      () => {
        vm.onViewContainerResize(domThreejsObj, camera, webGlRenderer)
      },
      false
    )
    function update(): void {
      stats.update()
      orbitControls.update()
    }
    function animate(): void {
      requestAnimationFrame(animate)
      webGlRenderer.render(scene, camera)
      update()
    }
    animate()
  }

  onViewContainerResize(
    viewDom: HTMLElement,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ): void {
    camera.aspect = viewDom.offsetWidth / viewDom.offsetHeight
    camera.updateProjectionMatrix()
    renderer.setSize(viewDom.offsetWidth, viewDom.offsetHeight)
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
