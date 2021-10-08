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
import { ConeBufferGeometry, SphereGeometry, WebGLExtensions } from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'

@Component({
  name: 'MyThreeDemosHomeDemo08'
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
    stats.setMode(0) // 0:显示 fps, 1:ms
    // 调整插件布局
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0px'
    stats.domElement.style.top = '0px'
    // 加入画布
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
    // 初始化性能插件
    const domWidgetStats = vm.preInitStats('WidgetStats')
    const stats = this.initStats(domWidgetStats)
    if (!vm.domThreejs) {
      throw new Error('[init]:miss threejs dom container')
    }
    const domThreejsObj = vm.domThreejs
    const viewWidth = domThreejsObj.offsetWidth
    const viewHeight = domThreejsObj.offsetHeight
    const viewSolution = domThreejsObj.offsetWidth / domThreejsObj.offsetWidth

    // 创建WebGlRenderer
    const webGlRenderer = new THREE.WebGLRenderer()
    webGlRenderer.antialias = true
    webGlRenderer.autoClear = true
    webGlRenderer.setClearColor(0xff0000)
    webGlRenderer.setSize(viewWidth, viewHeight)
    webGlRenderer.shadowMap.enabled = true
    webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap
    domThreejsObj.append(webGlRenderer.domElement)
    // 创建场景
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0xffffff, 0.015, 100)
    scene.background = new THREE.Color(0xff0000)
    // 覆盖属性
    // scene.overrideMaterial = new THREE.MeshLambertMaterial({
    //   color: 0xf39600,
    //   wireframe: true
    // })
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(-30, 40, 30)
    camera.lookAt(scene.position)
    // 创建场景中的实体对象
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1)
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    plane.rotation.x = -0.5 * Math.PI
    scene.add(plane)
    // 灯光
    const ambientLight = new THREE.AmbientLight(0x0c0c0c)
    scene.add(ambientLight)
    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-40, 60, -10)
    spotLight.castShadow = true
    spotLight.shadow.mapSize.height = 2048
    spotLight.shadow.mapSize.width = 2048
    scene.add(spotLight)

    class Controls {
      private rotationSpeed = 0.02
      private numberOfObjects = 0
      private color: any = null
      constructor(scene: THREE.Scene) {
        const sceneFog = scene.fog
        this.color = sceneFog?.color.getStyle()
      }

      getRotationSpeed() {
        return this.rotationSpeed
      }

      addCube() {
        const cubeSize = Math.ceil(Math.random() * 3)
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
        const cubeMaterial = new THREE.MeshLambertMaterial({
          color: Math.random() * 0xffffff
        })
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cube.castShadow = true
        cube.receiveShadow = true
        cube.position.x =
          -30 + Math.round(Math.random() * planeGeometry.parameters.width)
        cube.position.y = 5 + Math.round(Math.random() * 5)
        cube.position.z =
          -20 + Math.round(Math.random() * planeGeometry.parameters.height)
        scene.add(cube)
        this.numberOfObjects =
          scene.children.filter(item => item instanceof THREE.Mesh).length - 1
      }

      removeCube() {
        const allChildren = scene.children
        const lastObject = allChildren[allChildren.length - 1]
        if (lastObject instanceof THREE.Mesh) {
          scene.remove(lastObject)
          this.numberOfObjects =
            scene.children.filter(item => item instanceof THREE.Mesh).length - 1
        }
      }
    }
    // 创建 gui
    const controls = new Controls(scene)
    const gui = new GUI()
    gui.add(controls, 'rotationSpeed', 0, 0.5)
    gui.add(controls, 'addCube')
    gui.add(controls, 'removeCube')
    gui.add(controls, 'numberOfObjects').listen()
    gui.addColor(controls, 'color').onChange((e: any) => {
      if (scene.fog instanceof THREE.Fog) {
        scene.fog.color.setStyle(e)
      }
    })
    ;(<HTMLElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)

    // 窗口大小改变触发的方法
    window.addEventListener(
      'resize',
      () => {
        vm.onViewContainerResize(domThreejsObj, camera, webGlRenderer)
      },
      false
    )
    // 渲染方法
    function render(): void {
      // 更新性能插件
      stats.update()
      // reaverse 方法在 scene 和 其所有子对象 children上执行回调
      scene.traverse((e: any) => {
        if (e instanceof THREE.Mesh && e !== plane) {
          e.rotation.x += controls.getRotationSpeed()
          e.rotation.y += controls.getRotationSpeed()
          e.rotation.z += controls.getRotationSpeed()
        }
      })
      // 开始渲染
      webGlRenderer.render(scene, camera)
    }
    function animate(): void {
      requestAnimationFrame(animate)
      render()
    }
    animate()
  }

  // 视图展示区域随窗口缩放
  onViewContainerResize(
    viewDom: HTMLElement,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ): void {
    camera.aspect = viewDom.offsetWidth / viewDom.offsetHeight
    camera.updateProjectionMatrix() // 更新相机的投影矩阵
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
