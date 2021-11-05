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
import {
  Lensflare,
  LensflareElement
} from 'three/examples/jsm/objects/Lensflare'
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
  name: 'MyThreeDemosHomeDemo27'
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
      alpha: true
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
    camera.position.set(0, 0, 250)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return camera
  }

  initScene() {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xb0e2ff)
    scene.fog = new THREE.Fog(scene.background, 1, 5000)
    return scene
  }

  initLight(scene: THREE.Scene) {
    scene.add(new THREE.AmbientLight(0xb38949))
    const pointLight = new THREE.PointLight(0xfffff, 1, 2000)
    const textureLoader = new THREE.TextureLoader()
    const textFlare0 = textureLoader.load(
      require('./textures/lensflare/lensflare0_alpha.png')
    )
    const textFlare3 = textureLoader.load(
      require('./textures/lensflare/lensflare3.png')
    )
    const lensFlare = new Lensflare()
    lensFlare.addElement(
      new LensflareElement(textFlare0, 500, 0, pointLight.color)
    )
    lensFlare.addElement(
      new LensflareElement(textFlare3, 60, 0.6, pointLight.color)
    )
    lensFlare.addElement(
      new LensflareElement(textFlare3, 100, 0.7, pointLight.color)
    )
    lensFlare.addElement(
      new LensflareElement(textFlare3, 60, 0.9, pointLight.color)
    )
    lensFlare.addElement(
      new LensflareElement(textFlare3, 70, 1, pointLight.color)
    )
    pointLight.add(lensFlare)
    pointLight.position.set(-100, 50, 0)
    scene.add(pointLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.castShadow = true
    directionalLight.position.set(-100, 50, 0)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 3500
    directionalLight.shadow.camera.near = 2
    directionalLight.shadow.camera.left = -50
    directionalLight.shadow.camera.right = 50
    directionalLight.shadow.camera.top = 50
    directionalLight.shadow.camera.bottom = -50
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      10
    )
    scene.add(directionalLightHelper)
    scene.add(directionalLight)

    return {
      pointLight,
      directionalLight,
      directionalLightHelper
    }
  }

  initContent(scene: THREE.Scene) {
    const textureLoader = new THREE.TextureLoader()
    const groundTexture = textureLoader.load(
      require('./textures/terrain/grasslight-big.jpg')
    )
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(25, 25)
    groundTexture.anisotropy = 16
    const groundGeometry = new THREE.PlaneBufferGeometry(10000, 10000)
    const groundMaterial = new THREE.MeshLambertMaterial({
      map: groundTexture
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -0.5 * Math.PI
    ground.position.y = -40
    ground.receiveShadow = true
    scene.add(ground)
    const sphereGeometry = new THREE.SphereGeometry(15, 50, 50)
    const sphereMaterial = new THREE.MeshLambertMaterial()
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.castShadow = true
    scene.add(sphere)
    return {
      ground,
      sphere
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
    controls.maxDistance = 500
    controls.minDistance = 100
    controls.enablePan = false
    controls.enableRotate = false
    return controls
  }

  initGUI(pointLight: THREE.PointLight): GUI {
    class GuiControls {
      public color = ''
      constructor(light: THREE.PointLight) {
        this.color = light.color.getStyle()
      }
    }
    const gui = new GUI({ width: 300 })
    const guiControls = new GuiControls(pointLight)
    gui.addColor(guiControls, 'color').onChange(e => {
      pointLight.color.setStyle(e)
    })
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
    const {
      pointLight,
      directionalLight,
      directionalLightHelper
    } = vm.initLight(scene)
    const { ground, sphere } = vm.initContent(scene)
    const orbitControls = vm.initOrbitControls(camera, webGlRenderer)
    const { gui, guiControls } = vm.initGUI(pointLight)

    window.addEventListener(
      'resize',
      () => {
        vm.onViewContainerResize(domThreejsObj, camera, webGlRenderer)
      },
      false
    )
    let step = 0
    function render(): void {
      stats.update()
      step += 0.02
      orbitControls.update()
      sphere.position.y = -30 + 70 * Math.abs(Math.sin(step))
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
