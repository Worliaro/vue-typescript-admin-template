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
} from 'three'

import { Face3, Geometry } from 'three/examples/jsm/deprecated/Geometry'

@Component({
  name: 'MyThreeDemosHomeDemo36',
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
    camera.position.set(0, 10, 200)
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
    const plane = this.createMesh(new THREE.PlaneGeometry(50, 100, 10, 10))
    scene.add(plane)
    return { plane }
  }
  createMesh(geometry: THREE.PlaneGeometry) {
    const meshMaterial = new THREE.MeshNormalMaterial()
    meshMaterial.side = THREE.DoubleSide
    const wireframeMaterial = new THREE.MeshBasicMaterial()
    wireframeMaterial.wireframe = true
    geometry.name = 'planeGeometry'
    const plane = SceneUtils.createMultiMaterialObject(geometry, [
      meshMaterial,
      wireframeMaterial,
    ])
    plane.name = 'planeMesh'
    return plane
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

  initGUI(scene: THREE.Scene, createPlaneMesh: Function) {
    class GuiControls {
      private width: number
      private height: number
      private widthSegments: number
      private heightSegments: number
      constructor(scene: THREE.Scene) {
        const planeMesh = scene.getObjectByName('planeMesh') as THREE.Group
        if (planeMesh) {
          const planeGeometry = planeMesh.children[0].geometry
          if (planeGeometry) {
            this.width = planeGeometry.parameters.width
            this.height = planeGeometry.parameters.height
            this.widthSegments = planeGeometry.parameters.widthSegments
            this.heightSegments = planeGeometry.parameters.heightSegments
          }
        }
      }
    }
    const guiControls = new GuiControls(scene)
    const gui = new GUI()
    gui.add(guiControls, 'width', 0, 200).onChange((e) => {
      const planeMesh = scene.getObjectByName('planeMesh') as THREE.Group
      if (planeMesh) {
        const planeGeometry = planeMesh.children[0].geometry
        if (planeGeometry) {
          const { width, height, widthSegments, heightSegments } =
            planeGeometry.parameters
          scene.remove(planeMesh)
          const newPlane = createPlaneMesh(
            new THREE.PlaneGeometry(e, height, widthSegments, heightSegments)
          )
          scene.add(newPlane)
        }
      }
    })
    gui.add(guiControls, 'height', 0, 200).onChange((e) => {
      const planeMesh = scene.getObjectByName('planeMesh') as THREE.Group
      if (planeMesh) {
        const planeGeometry = planeMesh.children[0].geometry
        if (planeGeometry) {
          const { width, height, widthSegments, heightSegments } =
            planeGeometry.parameters
          scene.remove(planeMesh)
          const newPlane = createPlaneMesh(
            new THREE.PlaneGeometry(width, e, widthSegments, heightSegments)
          )
          scene.add(newPlane)
        }
      }
    })
    gui.add(guiControls, 'widthSegments', 0, 20).onChange((e) => {
      const planeMesh = scene.getObjectByName('planeMesh') as THREE.Group
      if (planeMesh) {
        const planeGeometry = planeMesh.children[0].geometry
        if (planeGeometry) {
          const { width, height, widthSegments, heightSegments } =
            planeGeometry.parameters
          scene.remove(planeMesh)
          const newPlane = createPlaneMesh(
            new THREE.PlaneGeometry(width, height, e, heightSegments)
          )
          scene.add(newPlane)
        }
      }
    })
    gui.add(guiControls, 'heightSegments', 0, 20).onChange((e) => {
      const planeMesh = scene.getObjectByName('planeMesh') as THREE.Group
      if (planeMesh) {
        const planeGeometry = planeMesh.children[0].geometry
        if (planeGeometry) {
          const { width, height, widthSegments, heightSegments } =
            planeGeometry.parameters
          scene.remove(planeMesh)
          const newPlane = createPlaneMesh(
            new THREE.PlaneGeometry(width, height, widthSegments, e)
          )
          scene.add(newPlane)
        }
      }
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
    const { plane } = vm.initContent(scene)
    const orbitControls = vm.initOrbitControls(camera, webGlRenderer)
    const stepObj: { step: number } = { step: 0.01 }
    const { gui } = vm.initGUI(scene, this.createMesh)
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
