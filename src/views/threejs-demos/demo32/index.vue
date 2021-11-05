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
  ArrowHelper,
  EventDispatcher,
  Group,
  MeshBasicMaterial,
  Object3D
} from 'three'

import { Face3, Geometry } from 'three/examples/jsm/deprecated/Geometry'

@Component({
  name: 'MyThreeDemosHomeDemo32'
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
    webGlRenderer.setClearColor(0x050505)
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
    camera.position.set(120, 100, 100)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return camera
  }

  initScene() {
    const scene = new THREE.Scene()
    return scene
  }

  initLight(scene: THREE.Scene): THREE.SpotLight {
    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-10, 200, 30)
    scene.add(spotLight)
    return spotLight
  }

  initContent(scene: THREE.Scene) {
    const vm = this
    const group = new Group()
    const matArray = [
      new MeshBasicMaterial({ color: 0xff7f50 }),
      new MeshBasicMaterial({ color: 0x9b30ff }),
      new MeshBasicMaterial({ color: 0x9acd32 }),
      new MeshBasicMaterial({ color: 0x63bbff }),
      new MeshBasicMaterial({ color: 0xc41e3a }),
      new MeshBasicMaterial({ color: 0xffffff })
    ]
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const boxGeometry = new THREE.BoxGeometry(10.8, 10.8, 10.8)
          const box = new THREE.Mesh(boxGeometry, matArray)
          box.position.set(x * 11 - 11, y * 11 - 11, z * 11 - 11)
          group.add(box)
        }
      }
    }
    scene.add(group)
    return {
      group
    }
  }

  initOrbitControls(
    camera: THREE.Camera,
    webglRenderer: THREE.WebGLRenderer
  ): OrbitControls {
    const controls = new OrbitControls(camera, webglRenderer.domElement)
    controls.enableDamping = true
    controls.rotateSpeed = 0.05
    controls.maxDistance = 500
    controls.minDistance = 100
    return controls
  }

  initGUI(scene: THREE.Scene) {
    const vm = this
    class GuiControls {}
    const gui = new GUI()
    const guiControls = new GuiControls()

    return {
      gui,
      guiControls
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
    const { gui, guiControls } = vm.initGUI(scene)
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
      group.rotation.y += 0.01
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
