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
  Lensflare,
  LensflareElement
} from 'three/examples/jsm/objects/Lensflare'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
// 使用叠加混合材料需要引入 SecneUtils 工具类
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils'
import {
  CylinderGeometry,
  DirectionalLightShadow,
  HemisphereLight,
  MeshStandardMaterial,
  Scene
} from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'

@Component({
  name: 'MyThreeDemosHomeDemo27'
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

  /**
   * 创建渲染器
   */
  initRenderer(domView: HTMLElement): THREE.WebGLRenderer {
    const webGlRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    // 设置渲染器的像素比例，按照设备
    webGlRenderer.setPixelRatio(window.devicePixelRatio)
    // 渲染范围
    webGlRenderer.setSize(domView.offsetWidth, domView.offsetHeight)
    domView.appendChild(webGlRenderer.domElement)
    return webGlRenderer
  }

  /**
   * 创建相机
   */
  initCamera(domView: HTMLElement): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      45,
      domView.offsetWidth / domView.offsetHeight,
      20,
      150
    )
    camera.position.set(-50, 40, 50)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return camera
  }

  /**
   * 创建场景
   */
  initScene() {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050505)
    return scene
  }

  /**
   * 创建灯光
   */
  initLight(scene: THREE.Scene) {}

  /**
   * 场景中内容
   */
  initContent(scene: THREE.Scene) {}

  /**
   * 创建控制器
   */
  initOrbitControls(
    camera: THREE.Camera,
    webglRenderer: THREE.WebGLRenderer
  ): OrbitControls {}

  /**
   * GUI
   */
  initGUI(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    class GuiControls {
      private scene: THREE.Scene
      private sceneBackground = 'rgb(255,255,255)'
      private cameraNear: number
      private cameraFar: number
      private numberOfObjects: number
      constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.scene = scene
        const sceneBack = scene.background as THREE.Color
        if (sceneBack) {
          this.sceneBackground = sceneBack.getStyle()
        }
        this.cameraNear = camera.near
        this.cameraFar = camera.far
        this.numberOfObjects = scene.children.length
      }

      addCube() {
        const cubeSize = Math.ceil(3 + Math.random() * 3)
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
        const cubeMaterial = new THREE.MeshLambertMaterial()
        const basicMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff * Math.random()
        })
        basicMaterial.transparent = true
        // 使用叠加混合
        basicMaterial.blending = THREE.MultiplyBlending
        debugger
        const cube = SceneUtils.createMultiMaterialObject(cubeGeometry, [
          cubeMaterial,
          basicMaterial
        ])
        cube.position.x = -60 + Math.round(Math.random() * 100)
        cube.position.y = Math.round(Math.random() * 10)
        cube.position.z = -100 + Math.round(Math.random() * 150)
        this.scene.add(cube)
        this.numberOfObjects = this.scene.children.length
      }

      removeCube() {
        const allChildern = this.scene.children
        const lastObject = allChildern[allChildern.length - 1] as THREE.Mesh
        if (lastObject.isMesh) {
          this.scene.remove(lastObject)
          this.numberOfObjects = this.scene.children.length
        }
      }
    }
    const gui = new GUI({
      width: 300
    })
    const guiControls = new GuiControls(scene, camera)
    gui.addColor(guiControls, 'sceneBackground').onChange(e => {
      const sceneBack = scene.background as THREE.Color
      if (sceneBack) {
        sceneBack.setStyle(e)
      }
    })
    gui.add(guiControls, 'cameraNear', 5, 30).onChange(e => {
      camera.near = e
      console.log('camera near ' + camera.near)
    })
    gui.add(guiControls, 'cameraFar', 150, 500).onChange(e => {
      camera.far = e
      console.log('camera far ' + camera.far)
    })
    gui.add(guiControls, 'addCube')
    gui.add(guiControls, 'removeCube')

    return {
      gui,
      guiControls
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
    const webGlRenderer = vm.initRenderer(domThreejsObj)
    const camera = vm.initCamera(domThreejsObj)
    const scene = vm.initScene()
    const { gui, guiControls } = vm.initGUI(scene, camera)
    ;(<HTMLElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)

    let i = 0
    while (i < 20) {
      guiControls.addCube()
      i++
    }

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
      // 更新相机矩阵投影  不然不能通过 gui 来更新相机的远近距离
      camera.updateProjectionMatrix()
      scene.traverse(e => {
        const mesh = e as THREE.Mesh
        if (mesh.isMesh) {
          mesh.rotation.x += 0.02
          mesh.rotation.y += 0.02
          mesh.rotation.z += 0.02
        }
      })
    }
    function animate(): void {
      requestAnimationFrame(animate)
      // 开始渲染
      webGlRenderer.render(scene, camera)
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
