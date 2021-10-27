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
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
import {
  CylinderGeometry,
  DirectionalLightShadow,
  HemisphereLight,
  MeshStandardMaterial,
  Scene
} from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'

@Component({
  name: 'MyThreeDemosHomeDemo25'
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
      antialias: true
    })
    // 设置渲染器的像素比例，按照设备
    webGlRenderer.setPixelRatio(window.devicePixelRatio)
    // 渲染范围
    webGlRenderer.setSize(domView.offsetWidth, domView.offsetHeight)
    // 开启阴影支持
    webGlRenderer.shadowMap.enabled = true
    // 阴影类型
    webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap
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
      0.1,
      5000
    )
    camera.position.set(0, 20, 40)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return camera
  }

  /**
   * 创建场景
   */
  initScene() {
    const scene = new THREE.Scene()
    return scene
  }

  /**
   * 创建灯光
   */
  initLight(scene: THREE.Scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)
    // 实例化矩形面光源  10 * 10 光源强度为1
    const rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10)
    rectLight.position.set(5, 6, 0)
    scene.add(rectLight)
    // 创建矩形网格  便于操作和测试
    const rectLightMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(),
      new THREE.MeshBasicMaterial()
    )
    rectLightMesh.scale.x = rectLight.width
    rectLightMesh.scale.y = rectLight.height
    rectLightMesh.rotation.x = -Math.PI
    // 将矩形面光源与 plane绑定
    rectLight.add(rectLightMesh)
    const rectLightMeshBack = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0x808080
      })
    )
    // 绕y轴旋转180° 形成与面光源的背面效果
    rectLightMeshBack.rotation.y = Math.PI
    rectLightMesh.add(rectLightMeshBack)
    return {
      ambientLight,
      rectLight,
      rectLightMesh
    }
  }

  /**
   * 场景中内容
   */
  initContent(scene: THREE.Scene) {
    // 地板
    const floorGeometry = new THREE.BoxBufferGeometry(2000, 1, 2000)
    // 使用矩形平面光源  必须使用 MeshStandardMaterial 或者 MeshPhysicalMaterial 来实现反射效果
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x636363,
      roughness: 0,
      metalness: 0
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    scene.add(floor)
    const standardMaterial = new THREE.MeshStandardMaterial({
      color: 0xa00000,
      roughness: 0,
      metalness: 0
    })
    // 立方体
    const cubeGeometry = new THREE.BoxBufferGeometry(4, 4, 4)
    const cube = new THREE.Mesh(cubeGeometry, standardMaterial)
    cube.position.set(-5, 2, 0)
    scene.add(cube)
    // 球体
    const sphereGeometry = new THREE.SphereGeometry(2, 50, 50)
    const sphere = new THREE.Mesh(sphereGeometry, standardMaterial)
    sphere.position.set(0, 3, 0)
    scene.add(sphere)
    // 圆桶体
    const cylindeGeometry = new THREE.TorusBufferGeometry(2, 0.3, 50, 50)
    const cylinder = new THREE.Mesh(cylindeGeometry, standardMaterial)
    cylinder.rotation.x = -0.5 * Math.PI
    cylinder.position.set(5, 2, 0)
    scene.add(cylinder)

    return {
      floor,
      cube,
      sphere,
      cylinder,
      standardMaterial
    }
  }

  /**
   * 创建控制器
   */
  initOrbitControls(
    camera: THREE.Camera,
    webglRenderer: THREE.WebGLRenderer
  ): OrbitControls {
    const controls = new OrbitControls(camera, webglRenderer.domElement)
    // 添加惯性
    controls.enableDamping = true
    // 最大偏移角度
    controls.maxPolarAngle = 0.49 * Math.PI
    // 旋转速度
    controls.rotateSpeed = 0.05
    return controls
  }

  /**
   * GUI
   */
  initGUI(
    ambientLight: THREE.AmbientLight,
    rectLight: THREE.RectAreaLight,
    floor: THREE.Mesh,
    standMaterial: THREE.MeshStandardMaterial,
    rectLigtMesh: THREE.Mesh
  ): GUI {
    class GuiControls {
      private ambientLight: string
      private ambientIntensity: number

      public motion = true
      private width: number
      private height: number
      private rectLightColor: string
      private intensity: number

      private floorColor: string
      private floorRoughness: number
      private floorMetalness: number

      private standMaterialColor: string
      private roughness: number
      private metalness: number
      constructor(
        ambient: THREE.AmbientLight,
        rectLight: THREE.RectAreaLight,
        floor: THREE.Mesh,
        standMaterial: THREE.MeshStandardMaterial
      ) {
        this.ambientLight = ambient.color.getStyle()
        this.ambientIntensity = ambient.intensity
        //
        this.width = rectLight.width
        this.height = rectLight.height
        this.rectLightColor = rectLight.color.getStyle()
        this.intensity = rectLight.intensity
        //
        this.floorColor = floor.material.color.getStyle()
        this.floorRoughness = floor.material.roughness
        this.floorMetalness = floor.material.metalness
        //
        this.standMaterialColor = standMaterial.color.getStyle()
        this.roughness = standMaterial.roughness
        this.metalness = standMaterial.metalness
      }
    }
    const gui = new GUI({ width: 300 }) // 插件宽度
    const guiControls = new GuiControls(
      ambientLight,
      rectLight,
      floor,
      standMaterial
    )
    gui.add(guiControls, 'motion')
    const ambientFolder = gui.addFolder('环境光')
    ambientFolder.addColor(guiControls, 'ambientLight').onChange(e => {
      ambientLight.color.setStyle(e)
    })
    ambientFolder.add(guiControls, 'ambientIntensity').onChange(e => {
      ambientLight.intensity = e
    })
    ambientFolder.open()

    const rectLightFolder = gui.addFolder('矩形面光')
    rectLightFolder.add(guiControls, 'width', 0, 20).onChange(e => {
      rectLight.width = e
      rectLigtMesh.scale.x = rectLight.width
    })
    rectLightFolder.add(guiControls, 'height', 0, 20).onChange(e => {
      rectLight.height = 0
      rectLigtMesh.scale.y = rectLight.height
    })
    rectLightFolder.addColor(guiControls, 'rectLightColor').onChange(e => {
      rectLight.color = new THREE.Color(e)
      rectLigtMesh.material.color.copy(rectLight.color)
    })
    rectLightFolder.add(guiControls, 'intensity', 0, 5).onChange(e => {
      rectLight.intensity = e
    })
    rectLightFolder.open()

    const floorFolder = gui.addFolder('地板')
    floorFolder.addColor(guiControls, 'floorColor').onChange(e => {
      floor.material.color.setStyle(e)
    })
    floorFolder.add(guiControls, 'floorRoughness', 0, 1).onChange(e => {
      floor.material.roughness = e
    })
    floorFolder.add(guiControls, 'floorMetalness', 0, 1).onChange(e => {
      floor.material.metalness = e
    })
    floorFolder.open()

    const standFolder = gui.addFolder('标准材质')
    standFolder.addColor(guiControls, 'standMaterialColor').onChange(e => {
      standMaterial.color.setStyle(e)
    })
    standFolder.add(guiControls, 'roughness', 0, 1).onChange(e => {
      standMaterial.roughness = e
    })
    standFolder.add(guiControls, 'metalness', 0, 1).onChange(e => {
      standMaterial.metalness = e
    })
    standFolder.open()
    return {
      gui,
      guiControls
    }
  }

  init() {
    console.log(RectAreaLightUniformsLib)
    RectAreaLightUniformsLib.init()
    debugger
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
    const { ambientLight, rectLight, rectLightMesh } = vm.initLight(scene)
    const { floor, cube, sphere, cylinder, standardMaterial } = vm.initContent(
      scene
    )
    const orbitControls = vm.initOrbitControls(camera, webGlRenderer)
    const { gui, guiControls } = vm.initGUI(
      ambientLight,
      rectLight,
      floor,
      standardMaterial,
      rectLightMesh
    )
    ;(<HTMLElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)

    const origin = new THREE.Vector3(0, 0, 0)

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
      orbitControls.update()
      if (guiControls.motion) {
        const time = Date.now() / 2000
        const lx = 15.0 * Math.cos(time)
        const lz = 15.0 * Math.sin(time)
        const ly = 5.0 + 5.0 * Math.sin(time / 3.0)
        rectLight.position.set(lx, ly, lz)
        rectLight.lookAt(origin)
      }
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
