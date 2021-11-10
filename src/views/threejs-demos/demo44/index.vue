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
  ParametricGeometry,
  WireframeGeometry,
} from 'three'
import { VelocityNode } from 'three/examples/jsm/nodes/Nodes'

import { Face3, Geometry } from 'three/examples/jsm/deprecated/Geometry'
import { normalize } from 'gsap/dist/gsap'

@Component({
  name: 'MyThreeDemosHomeDemo43',
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
    camera.position.set(30, 20, 50)
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
    const vm = this
    const dir = new THREE.Vector3(0, 2, 0)
    dir.normalize()
    const origin = new THREE.Vector3(0, 0, 0)
    const length = 5
    const hex = 0xff0000
    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex)
    scene.add(arrowHelper)
    const sphere = vm.createSphere(1000, 50, 50)
    scene.add(sphere)
    return {
      sphere,
    }
  }

  createSphere(
    radius: number,
    widthSegments: number,
    heightSegments: number,
    phiStart?: number,
    phiLength?: number,
    thetaStart?: number,
    thetaLength?: number
  ) {
    if (!phiStart) {
      phiStart = 0
    }
    if (phiLength) {
      phiLength = Math.PI * 2
    }
    if (!thetaStart) {
      thetaStart = 0
    }
    if (!thetaLength) {
      thetaLength = Math.PI
    }
    // 构造Geometry
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
      phiStart,
      phiLength,
      thetaStart,
      thetaLength
    )
    sphereGeometry.scale(-1, 1, 1)
    sphereGeometry.name = 'sphereGeometry'
    // 构造Material
    const texture = new THREE.TextureLoader().load(
      require('./images/scenery.jpg')
    )
    const sphereMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    })
    sphereMaterial.name = 'sphereMaterial'
    // 构造Mesh
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.name = 'sphereMesh'

    return sphere
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
    const vm = this
    class GuiControls {
      private radius = 1
      private widthSegments = 4
      private heightSegments = 4
      private phiStart = 0
      private phiLength = Math.PI * 2
      private thetaStart = 0
      private thetaLength = Math.PI
      constructor(sphereGeometry: THREE.SphereGeometry) {
        this.radius = sphereGeometry.parameters.radius
        this.widthSegments = sphereGeometry.parameters.widthSegments
        this.heightSegments = sphereGeometry.parameters.heightSegments
        this.phiStart = sphereGeometry.parameters.phiStart
        this.phiLength = sphereGeometry.parameters.phiLength
        this.thetaStart = sphereGeometry.parameters.thetaStart
        this.thetaLength = sphereGeometry.parameters.thetaLength
      }
    }
    const gui = new GUI()
    const sphere = scene.getObjectByName('sphereMesh') as THREE.Mesh
    debugger
    if (sphere) {
      const sphereGeometry = sphere.geometry as THREE.SphereGeometry
      if (sphereGeometry) {
        const guiControls = new GuiControls(sphereGeometry)
        gui.add(guiControls, 'radius', 1, 2000).onChange((e) => {
          const oldSphere = scene.getObjectByName('sphereMesh') as THREE.Mesh
          if (oldSphere) {
            const oldSphereGeometry = oldSphere.geometry as THREE.SphereGeometry
            if (oldSphereGeometry) {
              const {
                radius,
                widthSegments,
                heightSegments,
                phiStart,
                phiLength,
                thetaStart,
                thetaLength,
              } = oldSphereGeometry.parameters
              const newSphere = vm.createSphere(
                e,
                widthSegments,
                heightSegments,
                phiStart,
                phiLength,
                thetaStart,
                thetaLength
              )
              scene.remove(oldSphere)
              scene.add(newSphere)
            }
          }
        })
        gui.add(guiControls, 'widthSegments', 3, 8).onChange((e) => {
          const oldSphere = scene.getObjectByName('sphereMesh') as THREE.Mesh
          if (oldSphere) {
            const oldSphereGeometry = oldSphere.geometry as THREE.SphereGeometry
            if (oldSphereGeometry) {
              const {
                radius,
                widthSegments,
                heightSegments,
                phiStart,
                phiLength,
                thetaStart,
                thetaLength,
              } = oldSphereGeometry.parameters
              const newSphere = vm.createSphere(
                radius,
                e,
                heightSegments,
                phiStart,
                phiLength,
                thetaStart,
                thetaLength
              )
              scene.remove(oldSphere)
              scene.add(newSphere)
            }
          }
        })
        gui.add(guiControls, 'heightSegments', 2, 6).onChange((e) => {
          const oldSphere = scene.getObjectByName('sphereMesh') as THREE.Mesh
          if (oldSphere) {
            const oldSphereGeometry = oldSphere.geometry as THREE.SphereGeometry
            if (oldSphereGeometry) {
              const {
                radius,
                widthSegments,
                heightSegments,
                phiStart,
                phiLength,
                thetaStart,
                thetaLength,
              } = oldSphereGeometry.parameters
              const newSphere = vm.createSphere(
                radius,
                widthSegments,
                e,
                phiStart,
                phiLength,
                thetaStart,
                thetaLength
              )
              scene.remove(oldSphere)
              scene.add(newSphere)
            }
          }
        })
        gui.add(guiControls, 'phiStart', 0, Math.PI * 2).onChange((e) => {
          const oldSphere = scene.getObjectByName('sphereMesh') as THREE.Mesh
          if (oldSphere) {
            const oldSphereGeometry = oldSphere.geometry as THREE.SphereGeometry
            if (oldSphereGeometry) {
              const {
                radius,
                widthSegments,
                heightSegments,
                phiStart,
                phiLength,
                thetaStart,
                thetaLength,
              } = oldSphereGeometry.parameters
              const newSphere = vm.createSphere(
                radius,
                widthSegments,
                heightSegments,
                e,
                phiLength,
                thetaStart,
                thetaLength
              )
              scene.remove(oldSphere)
              scene.add(newSphere)
            }
          }
        })
        gui.add(guiControls, 'phiLength', 0, Math.PI).onChange((e) => {
          const oldSphere = scene.getObjectByName('sphereMesh') as THREE.Mesh
          if (oldSphere) {
            const oldSphereGeometry = oldSphere.geometry as THREE.SphereGeometry
            if (oldSphereGeometry) {
              const {
                radius,
                widthSegments,
                heightSegments,
                phiStart,
                phiLength,
                thetaStart,
                thetaLength,
              } = oldSphereGeometry.parameters
              const newSphere = vm.createSphere(
                radius,
                widthSegments,
                heightSegments,
                phiStart,
                e,
                thetaStart,
                thetaLength
              )
              scene.remove(oldSphere)
              scene.add(newSphere)
            }
          }
        })
        gui.add(guiControls, 'thetaStart', 0, Math.PI * 2).onChange((e) => {
          const oldSphere = scene.getObjectByName('sphereMesh') as THREE.Mesh
          if (oldSphere) {
            const oldSphereGeometry = oldSphere.geometry as THREE.SphereGeometry
            if (oldSphereGeometry) {
              const {
                radius,
                widthSegments,
                heightSegments,
                phiStart,
                phiLength,
                thetaStart,
                thetaLength,
              } = oldSphereGeometry.parameters
              const newSphere = vm.createSphere(
                radius,
                widthSegments,
                heightSegments,
                phiStart,
                phiLength,
                e,
                thetaLength
              )
              scene.remove(oldSphere)
              scene.add(newSphere)
            }
          }
        })
        gui.add(guiControls, 'thetaLength', 0, Math.PI * 2).onChange((e) => {
          const oldSphere = scene.getObjectByName('sphereMesh') as THREE.Mesh
          if (oldSphere) {
            const oldSphereGeometry = oldSphere.geometry as THREE.SphereGeometry
            if (oldSphereGeometry) {
              const {
                radius,
                widthSegments,
                heightSegments,
                phiStart,
                phiLength,
                thetaStart,
                thetaLength,
              } = oldSphereGeometry.parameters
              const newSphere = vm.createSphere(
                radius,
                widthSegments,
                heightSegments,
                phiStart,
                phiLength,
                thetaStart,
                e
              )
              scene.remove(oldSphere)
              scene.add(newSphere)
            }
          }
        })
      }
    }
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
    const { sphere } = vm.initContent(scene)
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
      // 变化
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
