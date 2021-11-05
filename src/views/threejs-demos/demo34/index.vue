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
import {
  AmbientLight,
  ArrowHelper,
  DirectionalLightHelper,
  EventDispatcher,
  Group,
  MeshBasicMaterial,
  Object3D,
} from 'three'

import { Face3, Geometry } from 'three/examples/jsm/deprecated/Geometry'

@Component({
  name: 'MyThreeDemosHomeDemo34',
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

  initLight(scene: THREE.Scene): {
    ambientLight: THREE.AmbientLight
    directionalLight: THREE.DirectionalLight
    directionalLightHelper: THREE.DirectionalLightHelper
  } {
    const ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
    directionalLight.position.set(-50, 50, 10)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.camera.left = -50
    directionalLight.shadow.camera.right = 50
    directionalLight.shadow.camera.top = 50
    directionalLight.shadow.camera.bottom = -50
    directionalLight.shadow.camera.far = 35000
    directionalLight.shadow.bias = -0.001
    scene.add(directionalLight)
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      10
    )
    scene.add(directionalLightHelper)
    return {
      ambientLight,
      directionalLight,
      directionalLightHelper,
    }
  }

  initContent(scene: THREE.Scene): {
    group: THREE.Mesh
    sphere: THREE.Mesh
  } {
    const groupGeometry = new THREE.PlaneBufferGeometry(10000, 10000)
    const groupMaterial = new THREE.MeshLambertMaterial({
      color: 0x6c7b8b,
    })
    const group = new THREE.Mesh(groupGeometry, groupMaterial)
    group.rotation.x = -0.5 * Math.PI
    group.position.y = -80
    group.receiveShadow = true
    scene.add(group)
    const sphereGeometry = new THREE.SphereGeometry(30, 50, 50)
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x836fff,
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.castShadow = true
    scene.add(sphere)
    return {
      group,
      sphere,
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
    ambientLight: THREE.AmbientLight,
    directionalLight: THREE.DirectionalLight,
    sphere: THREE.Mesh
  ) {
    class GuiControls {
      private ambientColor: string
      private directionalLightColor: string
      private opacity = 1
      private transparent = true
      private color = '0xaabbcc'
      private emissive = '0xaabbcc'
      private wireframe = false
      private shininess = 100
      private specular = '0xaabbcc'
      constructor(
        ambientLight: THREE.AmbientLight,
        directionalLight: THREE.DirectionalLight,
        sphere: THREE.Mesh
      ) {
        this.ambientColor = ambientLight.color.getStyle()
        this.directionalLightColor = directionalLight.color.getStyle()
        const sphereMaterial = sphere.material as THREE.MeshPhongMaterial
        if (sphereMaterial) {
          this.opacity = sphereMaterial.opacity
          this.transparent = sphereMaterial.transparent
          this.color = sphereMaterial.color.getStyle()
          this.emissive = sphereMaterial.emissive.getStyle()
          this.wireframe = sphereMaterial.wireframe
          this.shininess = sphereMaterial.shininess
          this.specular = sphereMaterial.specular.getStyle()
        }
      }
    }
    const guiControls = new GuiControls(ambientLight, directionalLight, sphere)
    const gui = new GUI()
    gui.addColor(guiControls, 'ambientColor').onChange((e) => {
      ambientLight.color.setStyle(e)
    })
    gui.addColor(guiControls, 'directionalLightColor').onChange((e) => {
      directionalLight.color.setStyle(e)
    })
    const materialFolder = gui.addFolder('MeshLambertMaterial')
    const sphereMaterial = sphere.material as THREE.MeshPhongMaterial
    materialFolder.add(guiControls, 'opacity', 0, 1).onChange((e) => {
      if (sphereMaterial) {
        sphereMaterial.opacity = e
      }
    })
    materialFolder.add(guiControls, 'transparent').onChange((e) => {
      if (sphereMaterial) {
        sphereMaterial.transparent = e
      }
    })
    materialFolder.addColor(guiControls, 'color').onChange((e) => {
      if (sphereMaterial) {
        sphereMaterial.color.setStyle(e)
      }
    })
    materialFolder.addColor(guiControls, 'emissive').onChange((e) => {
      if (sphereMaterial) {
        sphereMaterial.emissive.setStyle(e)
      }
    })
    materialFolder.add(guiControls, 'wireframe').onChange((e) => {
      if (sphereMaterial) {
        sphereMaterial.wireframe = e
      }
    })
    materialFolder.add(guiControls, 'shininess', 0, 200).onChange((e) => {
      if (sphereMaterial) {
        sphereMaterial.shininess = e
      }
    })
    materialFolder.addColor(guiControls, 'specular').onChange((e) => {
      sphereMaterial.specular.setStyle(e)
    })
    materialFolder.open()
    return {
      gui,
      guiControls,
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
    const { ambientLight, directionalLight, directionalLightHelper } =
      vm.initLight(scene)
    const { group, sphere } = vm.initContent(scene)
    const { gui, guiControls } = vm.initGUI(
      ambientLight,
      directionalLight,
      sphere
    )
    ;(<HTMLElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)
    const orbitControls = vm.initOrbitControls(camera, webGlRenderer)

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
      directionalLightHelper.update()
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
