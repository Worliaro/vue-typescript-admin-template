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
  name: 'MyThreeDemosHomeDemo35',
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
      5000
    )
    camera.position.set(0, 1000, 2500)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return camera
  }

  initScene() {
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0x050505)
    // scene.fog = new THREE.Fog(scene.background, 2000, 3500)
    return scene
  }

  initLight() {}

  initContent(scene: THREE.Scene) {
    // 分段数
    const segments = 1000
    const geometry = new THREE.BufferGeometry()
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
    })
    const positions = []
    const colors = []
    const r = 1000
    for (let i = 0; i < segments; i++) {
      const x = Math.random() * r - r / 2
      const y = Math.random() * r - r / 2
      const z = Math.random() * r - r / 2
      // 位置
      positions.push(x, y, z)
      // 颜色
      colors.push(x / r + 0.5)
      colors.push(y / r + 0.5)
      colors.push(z / r + 0.5)
    }
    // 次数传递的position 和 color 是固定的
    geometry.addAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    )
    geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geometry.computeBoundingSphere
    const lines = new THREE.Line(geometry, material)
    lines.computeLineDistances()
    scene.add(lines)
    return {
      lines,
      material,
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
    controls.enableRotate = false
    // controls.enablePan = false
    return controls
  }

  initGUI(
    material: THREE.LineBasicMaterial,
    stepObj: { step: number },
    lines: THREE.Line
  ) {
    class GuiControls {
      private rotation = true
      private vertexColors = true
      private color: string
      private opacity: number
      private transparent = false
      private lineMaterial = 'LineBasicMaterial'
      constructor(material: THREE.LineBasicMaterial) {
        this.color = material.color.getStyle()
        this.rotation = stepObj.step > 0
        this.opacity = material.opacity
      }
    }
    const gui = new GUI()
    const guiControls = new GuiControls(material)
    gui.add(guiControls, 'rotation').onChange((e) => {
      if (e) {
        stepObj.step = 0.005
      } else {
        stepObj.step = 0
      }
    })
    gui.add(guiControls, 'vertexColors').onChange((e) => {
      material.vertexColors = e
      material.needsUpdate = true
    })
    gui.addColor(guiControls, 'color').onChange((e) => {
      material.color.setStyle(e)
      material.needsUpdate = true
    })
    gui.add(guiControls, 'opacity', 0, 1).onChange((e) => {
      material.opacity = e
    })
    gui.add(guiControls, 'transparent').onChange((e) => {
      material.transparent = e
    })
    gui
      .add(guiControls, 'lineMaterial', [
        'LineBasicMaterial',
        'LineDashedMaterial',
      ])
      .onChange((e) => {
        switch (e) {
          case 'LineBasicMaterial':
            material = new THREE.LineBasicMaterial({
              vertexColors: e,
            })
            break
          case 'LineDashedMaterial':
            material = new THREE.LineDashedMaterial({
              vertexColors: true,
              gapSize: 2,
            })
            break
        }
        lines.material = material
      })
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
    // vm.initLight()
    const { lines, material } = vm.initContent(scene)
    const orbitControls = vm.initOrbitControls(camera, webGlRenderer)
    const stepObj: { step: number } = { step: 0.01 }
    const { gui } = vm.initGUI(material, stepObj, lines)
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
      lines.rotation.y -= stepObj.step
      lines.rotation.z -= stepObj.step
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
