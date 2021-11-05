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
import { ArrowHelper, EventDispatcher, Object3D } from 'three'

import { Face3, Geometry } from 'three/examples/jsm/deprecated/Geometry'

@Component({
  name: 'MyThreeDemosHomeDemo31'
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
    camera.position.set(0, 0, 250)
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

  initContent(
    scene: THREE.Scene
  ): {
    sphere: THREE.Mesh
    normalMaterial: THREE.MeshNormalMaterial
  } {
    const sphereGeometry = new THREE.SphereGeometry(80, 35, 35)
    const normalMaterial = new THREE.MeshNormalMaterial()
    normalMaterial.flatShading = true
    const sphere = new THREE.Mesh(sphereGeometry, normalMaterial)
    scene.add(sphere)
    return {
      sphere,
      normalMaterial
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
    scene: THREE.Scene,
    normalMaterial: THREE.MeshNormalMaterial,
    sphere: THREE.Mesh
  ) {
    const vm = this
    class GuiControls {
      private opacity: number
      private transparent: boolean
      private wireframe: boolean
      private flatShading: boolean
      private side = 'front'
      private arrow = false
      constructor(normalMaterial: THREE.MeshNormalMaterial) {
        this.opacity = normalMaterial.opacity
        this.transparent = normalMaterial.transparent
        this.wireframe = normalMaterial.wireframe
        this.flatShading = normalMaterial.flatShading
      }
    }
    const gui = new GUI()
    const guiControls = new GuiControls(normalMaterial)
    gui.add(guiControls, 'opacity', 0, 1).onChange(e => {
      normalMaterial.opacity = e
    })
    gui.add(guiControls, 'transparent').onChange(e => {
      normalMaterial.transparent = e
    })
    gui.add(guiControls, 'wireframe').onChange(e => {
      normalMaterial.wireframe = e
    })
    gui.add(guiControls, 'flatShading').onChange(e => {
      normalMaterial.flatShading = e
      console.log(normalMaterial.flatShading)
      normalMaterial.needsUpdate = true
    })
    gui.add(guiControls, 'arrow').onChange(e => {
      if (e) {
        const sphereGeometry = sphere.geometry as THREE.SphereGeometry
        console.log('oldBufferGeometry', sphereGeometry)
        sphereGeometry.computeVertexNormals()
        sphereGeometry.computeTangents()
        sphereGeometry.computeBoundingSphere()
        sphereGeometry.computeBoundingBox()
        console.log('newBufferGeometry', sphereGeometry)
        const tmpSphereGeometry = new Geometry().fromBufferGeometry(
          sphereGeometry
        )
        console.log('Geometry', tmpSphereGeometry)
        tmpSphereGeometry.faces.forEach(face => {
          const centroid = new THREE.Vector3(0, 0, 0)
          centroid.add(tmpSphereGeometry.vertices[face.a])
          centroid.add(tmpSphereGeometry.vertices[face.b])
          centroid.add(tmpSphereGeometry.vertices[face.c])
          centroid.divideScalar(3)
          const arrow = new ArrowHelper(
            face.normal,
            centroid,
            10,
            0x33ffff,
            10,
            0.1
          )
          sphere.add(arrow)
        })
      } else {
        scene.remove(sphere)
        vm.initContent(scene)
      }
    })

    gui.add(guiControls, 'side', ['front', 'back', 'double']).onChange(e => {
      switch (e) {
        case 'front':
          normalMaterial.side = THREE.FrontSide
          break
        case 'back':
          normalMaterial.side = THREE.BackSide
          break
        case 'double':
          normalMaterial.side = THREE.DoubleSide
          break
      }
      normalMaterial.needsUpdate = true
    })

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
    const {} = vm.initLight(scene)
    const { sphere, normalMaterial } = vm.initContent(scene)
    const { gui, guiControls } = vm.initGUI(scene, normalMaterial, sphere)
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
      sphere.rotation.y -= 0.01
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
