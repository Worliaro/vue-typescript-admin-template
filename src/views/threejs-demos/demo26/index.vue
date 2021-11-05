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
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
import {
  CylinderGeometry,
  DirectionalLightShadow,
  HemisphereLight,
  MeshStandardMaterial,
  Scene
} from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'

@Component({
  name: 'MyThreeDemosHomeDemo25'
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
      antialias: true
    })
    webGlRenderer.setPixelRatio(window.devicePixelRatio)
    webGlRenderer.setSize(domView.offsetWidth, domView.offsetHeight)
    webGlRenderer.shadowMap.enabled = true
    webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap
    domView.appendChild(webGlRenderer.domElement)
    return webGlRenderer
  }

  initCamera(domView: HTMLElement): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      45,
      domView.offsetWidth / domView.offsetHeight,
      0.1,
      5000
    )
    camera.position.set(0, 20, 40)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return camera
  }

  initScene() {
    const scene = new THREE.Scene()
    return scene
  }

  initLight(scene: THREE.Scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)
    const rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10)
    rectLight.position.set(5, 6, 0)
    scene.add(rectLight)
    const rectLightMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(),
      new THREE.MeshBasicMaterial()
    )
    rectLightMesh.scale.x = rectLight.width
    rectLightMesh.scale.y = rectLight.height
    rectLightMesh.rotation.x = -Math.PI
    rectLight.add(rectLightMesh)
    const rectLightMeshBack = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0x808080
      })
    )
    rectLightMeshBack.rotation.y = Math.PI
    rectLightMesh.add(rectLightMeshBack)
    return {
      ambientLight,
      rectLight,
      rectLightMesh
    }
  }

  initContent(scene: THREE.Scene) {
    const floorGeometry = new THREE.BoxBufferGeometry(2000, 1, 2000)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x636363,
      roughness: 0,
      metalness: 0
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    scene.add(floor)
    const standardMaterial = new THREE.MeshStandardMaterial({
      color: 0xa00000,
      roughness: 0,
      metalness: 0
    })
    const cubeGeometry = new THREE.BoxBufferGeometry(4, 4, 4)
    const cube = new THREE.Mesh(cubeGeometry, standardMaterial)
    cube.position.set(-5, 2, 0)
    scene.add(cube)
    const sphereGeometry = new THREE.SphereGeometry(2, 50, 50)
    const sphere = new THREE.Mesh(sphereGeometry, standardMaterial)
    sphere.position.set(0, 3, 0)
    scene.add(sphere)
    const cylindeGeometry = new THREE.TorusBufferGeometry(2, 0.3, 50, 50)
    const cylinder = new THREE.Mesh(cylindeGeometry, standardMaterial)
    cylinder.rotation.x = -0.5 * Math.PI
    cylinder.position.set(5, 2, 0)
    scene.add(cylinder)

    return {
      floor,
      cube,
      sphere,
      cylinder,
      standardMaterial
    }
  }

  initOrbitControls(
    camera: THREE.Camera,
    webglRenderer: THREE.WebGLRenderer
  ): OrbitControls {
    const controls = new OrbitControls(camera, webglRenderer.domElement)
    controls.enableDamping = true
    controls.maxPolarAngle = 0.49 * Math.PI
    controls.rotateSpeed = 0.05
    return controls
  }

  initGUI(
    ambientLight: THREE.AmbientLight,
    rectLight: THREE.RectAreaLight,
    floor: THREE.Mesh,
    standMaterial: THREE.MeshStandardMaterial,
    rectLigtMesh: THREE.Mesh
  ): GUI {
    class GuiControls {
      private ambientLight: string
      private ambientIntensity: number

      public motion = true
      private width: number
      private height: number
      private rectLightColor: string
      private intensity: number

      private floorColor: string
      private floorRoughness: number
      private floorMetalness: number

      private standMaterialColor: string
      private roughness: number
      private metalness: number
      constructor(
        ambient: THREE.AmbientLight,
        rectLight: THREE.RectAreaLight,
        floor: THREE.Mesh,
        standMaterial: THREE.MeshStandardMaterial
      ) {
        this.ambientLight = ambient.color.getStyle()
        this.ambientIntensity = ambient.intensity
        this.width = rectLight.width
        this.height = rectLight.height
        this.rectLightColor = rectLight.color.getStyle()
        this.intensity = rectLight.intensity
        this.floorColor = floor.material.color.getStyle()
        this.floorRoughness = floor.material.roughness
        this.floorMetalness = floor.material.metalness
        this.standMaterialColor = standMaterial.color.getStyle()
        this.roughness = standMaterial.roughness
        this.metalness = standMaterial.metalness
      }
    }
    const gui = new GUI({ width: 300 })
    const guiControls = new GuiControls(
      ambientLight,
      rectLight,
      floor,
      standMaterial
    )
    gui.add(guiControls, 'motion')
    const ambientFolder = gui.addFolder('环境光')
    ambientFolder.addColor(guiControls, 'ambientLight').onChange(e => {
      ambientLight.color.setStyle(e)
    })
    ambientFolder.add(guiControls, 'ambientIntensity').onChange(e => {
      ambientLight.intensity = e
    })
    ambientFolder.open()

    const rectLightFolder = gui.addFolder('矩形面光')
    rectLightFolder.add(guiControls, 'width', 0, 20).onChange(e => {
      rectLight.width = e
      rectLigtMesh.scale.x = rectLight.width
    })
    rectLightFolder.add(guiControls, 'height', 0, 20).onChange(e => {
      rectLight.height = 0
      rectLigtMesh.scale.y = rectLight.height
    })
    rectLightFolder.addColor(guiControls, 'rectLightColor').onChange(e => {
      rectLight.color = new THREE.Color(e)
      rectLigtMesh.material.color.copy(rectLight.color)
    })
    rectLightFolder.add(guiControls, 'intensity', 0, 5).onChange(e => {
      rectLight.intensity = e
    })
    rectLightFolder.open()

    const floorFolder = gui.addFolder('地板')
    floorFolder.addColor(guiControls, 'floorColor').onChange(e => {
      floor.material.color.setStyle(e)
    })
    floorFolder.add(guiControls, 'floorRoughness', 0, 1).onChange(e => {
      floor.material.roughness = e
    })
    floorFolder.add(guiControls, 'floorMetalness', 0, 1).onChange(e => {
      floor.material.metalness = e
    })
    floorFolder.open()

    const standFolder = gui.addFolder('标准材质')
    standFolder.addColor(guiControls, 'standMaterialColor').onChange(e => {
      standMaterial.color.setStyle(e)
    })
    standFolder.add(guiControls, 'roughness', 0, 1).onChange(e => {
      standMaterial.roughness = e
    })
    standFolder.add(guiControls, 'metalness', 0, 1).onChange(e => {
      standMaterial.metalness = e
    })
    standFolder.open()
    return {
      gui,
      guiControls
    }
  }

  init() {
    console.log(RectAreaLightUniformsLib)
    RectAreaLightUniformsLib.init()
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
    const { ambientLight, rectLight, rectLightMesh } = vm.initLight(scene)
    const { floor, cube, sphere, cylinder, standardMaterial } = vm.initContent(
      scene
    )
    const orbitControls = vm.initOrbitControls(camera, webGlRenderer)
    const { gui, guiControls } = vm.initGUI(
      ambientLight,
      rectLight,
      floor,
      standardMaterial,
      rectLightMesh
    )
    ;(<HTMLElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)

    const origin = new THREE.Vector3(0, 0, 0)

    window.addEventListener(
      'resize',
      () => {
        vm.onViewContainerResize(domThreejsObj, camera, webGlRenderer)
      },
      false
    )
    function render(): void {
      stats.update()
      orbitControls.update()
      if (guiControls.motion) {
        const time = Date.now() / 2000
        const lx = 15.0 * Math.cos(time)
        const lz = 15.0 * Math.sin(time)
        const ly = 5.0 + 5.0 * Math.sin(time / 3.0)
        rectLight.position.set(lx, ly, lz)
        rectLight.lookAt(origin)
      }
    }
    function animate(): void {
      requestAnimationFrame(animate)
      webGlRenderer.render(scene, camera)
      render()
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
