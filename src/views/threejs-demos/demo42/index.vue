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
  BufferGeometry,
  DirectionalLightHelper,
  EventDispatcher,
  Group,
  MeshBasicMaterial,
  Object3D,
  ParametricGeometry,
  TorusGeometry,
  WireframeGeometry,
} from 'three'
import { VelocityNode } from 'three/examples/jsm/nodes/Nodes'

import { Face3, Geometry } from 'three/examples/jsm/deprecated/Geometry'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

@Component({
  name: 'MyThreeDemosHomeDemo42',
})
export default class extends Vue {
  private publicPath: string = process.env.BASE_URL
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
    camera.position.set(30, 0, 10)
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
    const group = new THREE.Group()
    // 创建一个球体
    const boxGeometry = new THREE.BoxGeometry(5, 10, 5, 20, 30, 20)
    const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 10, 30, 30)
    const box = vm.createPointsCloud(boxGeometry)
    const cylinder = vm.createPointsCloud(cylinderGeometry)

    box.position.x = -10
    cylinder.position.x = 10

    group.add(box)
    group.add(cylinder)
    scene.add(group)
    const loader = new OBJLoader()
    // 该路径在public文件夹下
    loader.setPath(`${window.origin}/${this.publicPath}/models/walt/`)
    loader.load('WaltHead.obj', (object) => {
      const mesh = object.children[0]
      if (mesh) {
        const geometry = vm.createPointsCloud(mesh.geometry)
        const points = vm.createPointsCloud(geometry.geometry)
        points.scale.set(0.15, 0.15, 0.15)
        points.position.y = -5
        group.add(points)
      }
    })

    return {
      group,
    }
  }

  createPointsCloud(geometry: BufferGeometry) {
    const vm = this
    // 精灵材质
    const spriteMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.23,
      transparent: true,
      map: vm.generateSprite(),
    })
    const points = new THREE.Points(geometry, spriteMaterial)
    return points
  }

  generateSprite() {
    // 常见画布并设置宽高
    const canvas = document.createElement('canvas')
    canvas.width = 8
    canvas.height = 8
    // 创建图形
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      )
      gradient.addColorStop(0, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.2, 'rgba(0,255,255,1')
      gradient.addColorStop(0.6, 'rgba(0,0,64,1)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const texture = new THREE.Texture(canvas)
      texture.needsUpdate = true
      return texture
    }
    return null
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
    const { group } = vm.initContent(scene)
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
      group.rotation.y += 0.01
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
