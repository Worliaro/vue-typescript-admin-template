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
  ConeBufferGeometry,
  CylinderGeometry,
  SphereGeometry,
  TorusGeometry,
  WebGLExtensions
} from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'
const ThreeBSP = require('jthreebsp')(THREE)

@Component({
  name: 'MyThreeDemosHomeDemo09'
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
    webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap
    domThreejsObj.append(webGlRenderer.domElement)
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(0, 200, 300)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    const scene = new THREE.Scene()
    const ambientLight = new THREE.AmbientLight(0xeee0e5)
    scene.add(ambientLight)
    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-100, 200, -200)
    scene.add(spotLight)
    const trackballControls = new TrackballControls(
      camera,
      webGlRenderer.domElement
    )
    class Controls {
      private objects: Array<ThreeBSP>
      public intersect: Function = this.createMesh('intersect')
      public union: Function = this.createMesh('union')
      public subtract: Function = this.createMesh('subtract')
      constructor(bspObjects: Array<ThreeBSP>) {
        this.objects = bspObjects
      }

      private createMesh(type: string): Function {
        return () => {
          const tmpMesh = scene.getObjectByName('mesh')
          if (tmpMesh) {
            scene.remove(tmpMesh)
          }
          let result: any = null
          switch (type) {
            case 'subtract':
              result = this.objects[0].subtract(this.objects[1])
              break
            case 'union':
              result = this.objects[0].union(this.objects[1])
              break
            case 'intersect':
              result = this.objects[0].intersect(this.objects[1])
              break
          }
          const mesh = result.toMesh()
          mesh.material = this.objects[2]
          mesh.name = 'mesh'
          scene.add(mesh)
        }
      }
    }
    const cylinderGeometry = new THREE.CylinderGeometry(100, 100, 20, 50, 20)
    const boxGeometry = new THREE.BoxGeometry(100, 100, 100, 30, 30)
    const material1 = new THREE.MeshLambertMaterial({
      wireframe: true,
      color: 0x9aff9a
    })
    const material2 = new THREE.MeshLambertMaterial({
      wireframe: false,
      color: 0x9f79ee
    })
    const cylinder = new THREE.Mesh(cylinderGeometry, material1)
    const box = new THREE.Mesh(boxGeometry, material1)
    scene.add(cylinder)
    scene.add(box)
    const cylinderBSP = new ThreeBSP(cylinder)
    const boxBSP = new ThreeBSP(box)
    const bspObjects = [cylinderBSP, boxBSP, material2]
    const controls = new Controls(bspObjects)
    const gui = new GUI()
    gui.add(controls, 'intersect')
    gui.add(controls, 'union')
    gui.add(controls, 'subtract')
    gui.close()
    ;(<HTMLElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)

    window.addEventListener(
      'resize',
      () => {
        vm.onViewContainerResize(domThreejsObj, camera, webGlRenderer)
      },
      false
    )
    function render(): void {
      stats.update()
      trackballControls.update()
      trackballControls.handleResize()
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
