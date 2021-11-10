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
  WireframeGeometry,
} from 'three'
import { VelocityNode } from 'three/examples/jsm/nodes/Nodes'

import { Face3, Geometry } from 'three/examples/jsm/deprecated/Geometry'

@Component({
  name: 'MyThreeDemosHomeDemo40',
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
    camera.position.set(30, 0, 80)
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
    const snowTexture = new THREE.TextureLoader().load(
      require('./texture/particles/snowflake2.png')
    )
    const geometry = new Geometry()
    const pointsMaterial = new THREE.PointsMaterial({
      size: 2,
      transparent: true,
      opacity: 0.8,
      map: snowTexture,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthTest: false,
    })
    const range = 100
    const vertices = [] // position
    const speeds = [] // spped
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * range - range / 2
      const y = Math.random() * range * 1.5
      const z = Math.random() * range - range / 2
      const vertice = new THREE.Vector3(x, y, z)
      // 横向移动速度
      const velocityX = (Math.random() - 0.5) / 3
      // 纵向移动速度
      const velocityY = 0.1 + Math.random() / 15
      // 记录position属性，因为Geometry转换成BufferGeometry后会丢失vertices属性
      vertices.push(x, y, z)
      speeds.push(velocityX, velocityY)
      // 将顶点加入几何
      geometry.vertices.push(vertice)
    }
    geometry.center()
    let snowBufferGeometry = geometry.toBufferGeometry()
    snowBufferGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    )
    snowBufferGeometry.setAttribute(
      'speed',
      new THREE.BufferAttribute(new Float32Array(speeds), 2)
    )
    snowBufferGeometry.getAttribute('position').needsUpdate = true
    const points = new THREE.Points(snowBufferGeometry, pointsMaterial)
    points.position.y = -30
    scene.add(points)
    return {
      snowBufferGeometry,
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
    const { snowBufferGeometry } = vm.initContent(scene)
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
      const positions = snowBufferGeometry.getAttribute('position')
      const vertices = positions.array
      const itemSize = positions.itemSize
      const speeds = snowBufferGeometry.getAttribute('speed')
      debugger
      for (let i = 0; i < vertices.length / itemSize; i++) {
        let velocityX = speeds.getX(i)
        const velocityY = speeds.getY(i)
        const pX = positions.getX(i)
        const pY = positions.getY(i)
        const pZ = positions.getZ(i)
        const newPX = pX - velocityX
        let newPY = pY - velocityY
        const newPZ = pZ
        newPY = newPY <= 0 ? 60 : newPY
        velocityX =
          newPX <= -20 || newPX >= 20 ? (velocityX = velocityX * -1) : velocityX
        positions.setXYZ(i, newPX, newPY, newPZ)
        speeds.setXY(i, velocityX, velocityY)
      }
      positions.needsUpdate = true
      speeds.needsUpdate = true
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
