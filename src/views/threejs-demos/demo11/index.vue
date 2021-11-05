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
const ThreejsFontJson = require('three/examples/fonts/gentilis_regular.typeface.json')

@Component({
  name: 'MyThreeDemosHomeDemo11'
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

  init() {
    const vm = this
    const domWidgetStats = vm.preInitStats('WidgetStats')
    const stats = this.initStats(domWidgetStats)
    if (!vm.domThreejs) {
      throw new Error('[init]:miss threejs dom container')
    }
    const domThreejsObj = vm.domThreejs
    const viewWidth = domThreejsObj.offsetWidth
    const viewHeight = domThreejsObj.offsetHeight
    const viewSolution = domThreejsObj.offsetWidth / domThreejsObj.offsetWidth

    const webGlRenderer = new THREE.WebGLRenderer()
    webGlRenderer.antialias = true
    webGlRenderer.autoClear = true
    webGlRenderer.setClearColor(0x050505)
    webGlRenderer.setSize(viewWidth, viewHeight)
    webGlRenderer.shadowMap.enabled = true
    webGlRenderer.shadowMap.type = THREE.PCFShadowMap
    domThreejsObj.append(webGlRenderer.domElement)
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(0, 200, 300)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    const scene = new THREE.Scene()
    const spotLight = new THREE.SpotLight(0xeedfcc)
    spotLight.position.set(-100, 200, 100)
    spotLight.castShadow = true
    scene.add(spotLight)
    scene.add(new THREE.AmbientLight(0xd1d1d1))
    const gridHelper = new THREE.GridHelper(1200, 60, 0xcd3700, 0x424242)
    scene.add(gridHelper)
    const textContent = 'three.js'
    const fontLoader = new THREE.FontLoader()
    const ThreejsFont = fontLoader.parse(ThreejsFontJson)
    const fontConfig: THREE.TextGeometryParameters = {
      font: ThreejsFont,
      size: 100,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelSegments: 5
    }
    const textGeometry = new THREE.TextGeometry(textContent, fontConfig)
    textGeometry.computeBoundingBox()
    const textMaterial = new THREE.MeshNormalMaterial()
    const text = new THREE.Mesh(textGeometry, textMaterial)
    const textMeshBoundingBox = textGeometry.boundingBox
    if (textMeshBoundingBox) {
      text.position.x =
        -(textMeshBoundingBox.max.x - textMeshBoundingBox.min.x) / 2
    }
    scene.add(text)

    const orbitControls = new OrbitControls(camera, webGlRenderer.domElement)

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
      webGlRenderer.render(scene, camera)
    }
    function animate(): void {
      requestAnimationFrame(animate)
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
