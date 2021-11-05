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
import { DirectionalLightShadow, HemisphereLight, Scene } from 'three'
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
    const hemisphereLight = new THREE.HemisphereLight(0xa2cd5a, 0x9a32cd, 0.8)
    hemisphereLight.position.set(0, 50, 0)
    scene.add(hemisphereLight)
    const hemisphereLightHelper = new THREE.HemisphereLightHelper(
      hemisphereLight,
      10
    )
    scene.add(hemisphereLightHelper)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(-50, 50, 10)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.camera.left = -50
    directionalLight.shadow.camera.right = 50
    directionalLight.shadow.camera.top = 50
    directionalLight.shadow.camera.bottom = -50
    directionalLight.shadow.camera.far = 3500
    directionalLight.shadow.bias = -0.001
    scene.add(directionalLight)
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      10
    )
    scene.add(directionalLightHelper)
    return {
      hemisphereLight,
      hemisphereLightHelper,
      directionalLight,
      directionalLightHelper
    }
  }

  initContent(scene: THREE.Scene) {
    const textureLoader = new THREE.TextureLoader()
    console.log(window.location)
    const groundTexture = textureLoader.load(
      require('./texture/terrain/grasslight-big.jpg')
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
      groundGeometry,
      groundMaterial,
      ground,
      sphereGeometry,
      sphereMaterial,
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
    return controls
  }

  initGUI(
    hemiLight: THREE.HemisphereLight,
    scene: THREE.Scene,
    hemiLightHelper: THREE.HemisphereLightHelper
  ): GUI {
    class GuiControls {
      private hemiLight = true
      private intensity: number
      private skyColor: string
      private groundColor: string
      constructor(hemiLight: THREE.HemisphereLight) {
        this.intensity = hemiLight.intensity
        this.skyColor = hemiLight.color.getStyle()
        this.groundColor = hemiLight.groundColor.getStyle()
      }
    }
    const guiControls = new GuiControls(hemiLight)
    const gui = new GUI()
    gui.add(guiControls, 'hemiLight').onChange(e => {
      if (!e) {
        scene.remove(hemiLight)
        scene.remove(hemiLightHelper)
      } else {
        scene.add(hemiLight)
        scene.add(hemiLightHelper)
      }
    })
    gui.add(guiControls, 'intensity', 0, 1).onChange(e => {
      hemiLight.intensity = e
    })
    gui.addColor(guiControls, 'skyColor').onChange(e => {
      hemiLight.color = new THREE.Color(e)
    })
    gui.addColor(guiControls, 'groundColor').onChange(e => {
      hemiLight.groundColor = new THREE.Color(e)
    })
    return gui
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
    const {
      hemisphereLight,
      hemisphereLightHelper,
      directionalLight,
      directionalLightHelper
    } = vm.initLight(scene)
    const {
      groundGeometry,
      groundMaterial,
      ground,
      sphereGeometry,
      sphereMaterial,
      sphere
    } = vm.initContent(scene)
    const orbitControls = vm.initOrbitControls(camera, webGlRenderer)
    const gui = vm.initGUI(hemisphereLight, scene, hemisphereLightHelper)
    ;(<HTMLElement>vm.$refs.WidgetGUI).append(gui.domElement)

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
      hemisphereLightHelper.update()
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
