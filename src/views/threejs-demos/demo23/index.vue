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
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { Color, DirectionalLightShadow } from 'three'

@Component({
  name: 'MyThreeDemosHomeDemo23'
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
    webGlRenderer.setClearColor(0xeeeeee)
    webGlRenderer.setSize(viewWidth, viewHeight)
    webGlRenderer.shadowMap.enabled = true
    webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap
    domThreejsObj.append(webGlRenderer.domElement)
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(-35, 20, 25)
    camera.lookAt(new THREE.Vector3(10, 0, 0))
    const scene = new THREE.Scene()
    const ambitneLightColor = '#1c1c1c'
    const ambientLight = new THREE.AmbientLight(ambitneLightColor)
    scene.add(ambientLight)
    const parallelLightColor = '#f0f0f0'
    const directionalLight = new THREE.DirectionalLight(parallelLightColor)
    directionalLight.position.set(-40, 60, -10)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.near = 2
    directionalLight.shadow.camera.far = 200
    directionalLight.shadow.camera.left = -50
    directionalLight.shadow.camera.right = 50
    directionalLight.shadow.camera.top = 50
    directionalLight.shadow.camera.bottom = -50
    directionalLight.intensity = 0.5
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    scene.add(directionalLight)
    const sphereLightGeometry = new THREE.SphereGeometry(0.2)
    const sphereLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xac6c25
    })
    const sphereLight = new THREE.Mesh(sphereLightGeometry, sphereLightMaterial)
    sphereLight.castShadow = true
    sphereLight.position.set(3, 20, 3)
    scene.add(sphereLight)
    const planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20)
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(15, -5, 0)
    scene.add(plane)

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xff3333
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.castShadow = true
    cube.position.set(-4, 3, 0)
    scene.add(cube)

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ff
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.castShadow = true
    sphere.position.set(20, 0, 2)
    scene.add(sphere)

    class GUIControls {
      rotationSpeed = 0.03
      bouncingSpeed = 0.03
      ambientColor = ambitneLightColor
      pointColor = parallelLightColor
      intensity = 0.5
      distance = 0
      angle = 0.1
      debug = false
      castShadow = true
      target = 'Plane'
    }
    const guiControls = new GUIControls()
    const gui = new GUI()
    gui.addColor(guiControls, 'ambientColor').onChange(e => {
      ambientLight.color = new Color(e)
    })
    gui.addColor(guiControls, 'pointColor').onChange(e => {
      directionalLight.color = new Color(e)
    })
    gui.add(guiControls, 'intensity', 0, 5).onChange(e => {
      directionalLight.intensity = e
    })
    gui.add(guiControls, 'debug').onChange(e => {
      if (e) {
        const debug = new THREE.CameraHelper(directionalLight.shadow.camera)
        debug.name = 'debug'
        scene.add(debug)
      } else {
        const debug = scene.getObjectByName('debug')
        if (debug) {
          scene.remove(debug)
        }
      }
    })
    gui.add(guiControls, 'castShadow').onChange(e => {
      directionalLight.castShadow = e
    })
    gui.add(guiControls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(e => {
      switch (e) {
        case 'Plane':
          directionalLight.target = plane
          break
        case 'Sphere':
          directionalLight.target = sphere
          break
        case 'Cube':
          directionalLight.target = cube
          break
      }
    })
    ;(<HTMLElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)

    window.addEventListener(
      'resize',
      () => {
        vm.onViewContainerResize(domThreejsObj, camera, webGlRenderer)
      },
      false
    )

    let step = 0
    function viewUpdate() {
      cube.rotation.x += guiControls.rotationSpeed
      cube.rotation.y += guiControls.rotationSpeed
      cube.rotation.z += guiControls.rotationSpeed

      step += guiControls.bouncingSpeed
      sphere.position.x = 20 + 10 * Math.cos(step)
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))

      sphereLight.position.z = -8
      sphereLight.position.y = 27 * Math.sin(step / 3)
      sphereLight.position.x = 10 + 26 * Math.cos(step / 3)

      directionalLight.position.copy(sphereLight.position)
    }
    function render(): void {
      stats.update()
      viewUpdate()
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
