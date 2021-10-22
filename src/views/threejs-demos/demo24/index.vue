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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { WEBGL } from 'three/examples/jsm/WebGL'
import { SpotLight, SpotLightHelper } from 'three'
/**
 * Three.js 源码更新，删除了Detector.js ，采用新的WebGL.js了
 */

@Component({
  name: 'MyThreeDemosHomeDemo24'
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
  makeWebGlRenderer(domView: HTMLElement): THREE.WebGLRenderer {
    const webGlRenderer = new THREE.WebGLRenderer({
      antialias: true
    })
    webGlRenderer.setPixelRatio(window.devicePixelRatio) // 设置渲染器的像素比例，按照设备
    webGlRenderer.setClearColor(0x050505) // 渲染背景色
    webGlRenderer.setSize(domView.offsetWidth, domView.offsetHeight) // 渲染范围
    webGlRenderer.shadowMap.enabled = true // 开启阴影支持
    webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap // 阴影类型
    domView.append(webGlRenderer.domElement)
    return webGlRenderer
  }

  /**
   * 创建相机
   */
  makeCamera(domView: HTMLElement): THREE.Camera {
    const camera = new THREE.PerspectiveCamera(
      45,
      domView.offsetWidth / domView.offsetHeight,
      0.1,
      10000
    )
    camera.position.set(-100, 300, 300)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return camera
  }

  /**
   * 创建Scene
   */
  makeScene(): THREE.Scene {
    return new THREE.Scene()
  }

  /**
   * 创建灯光
   */
  initLight(
    scene: THREE.Scene
  ): {
    spotLight: THREE.SpotLight
    shadowCameraHelper: THREE.CameraHelper
    spotLightHelper: THREE.SpotLightHelper
  } {
    scene.add(new THREE.AmbientLight(0xcccccc))
    const spotLight = new THREE.SpotLight()
    spotLight.color = new THREE.Color(0xffffff)
    spotLight.castShadow = true
    spotLight.position.set(-80, 180, -80)
    // 光强
    spotLight.intensity = 1
    // 从发光点发出的距离，光的亮度，会随着距离的远近线性衰减
    spotLight.distance = 350
    // 光色散角度，默认是  Math.PI*2
    spotLight.angle = 0.4
    // 光影的减弱程度，默认值为0 取值范围  0--1  之间
    spotLight.penumbra = 0.1
    // 光在距离上的量值，和光的强度类似（衰减指数）
    spotLight.decay = 1
    // 设置阴影分辨率
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    // 投影近点---从距离光源的那一侧产生阴影
    spotLight.shadow.camera.near = 0.1
    // 投影远点---到光源的那一侧位置不产生阴影
    spotLight.shadow.camera.far = 300
    // 投影视场
    spotLight.shadow.camera.fov = 40
    scene.add(spotLight)
    // 阴影相机助手
    const shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
    scene.add(shadowCameraHelper)
    // 聚光光源助手
    const spotLightHelper = new THREE.SpotLightHelper(spotLight)
    scene.add(spotLightHelper)
    return {
      spotLight: spotLight,
      shadowCameraHelper: shadowCameraHelper,
      spotLightHelper: spotLightHelper
    }
  }
  /**
   * 场景中内容
   */
  initContent(
    scene: THREE.Scene
  ): {
    plane: THREE.Mesh
    cube: THREE.Mesh
  } {
    // 接收阴影的片面段，也会对阴影产生一定的效果，片面段越多，阴影分辨率越清晰
    const planeGeometry = new THREE.PlaneGeometry(300, 300, 300, 300)
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0x666666
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    // 绕 x 轴旋转 -90 度
    plane.rotation.x = -0.5 * Math.PI
    plane.receiveShadow = true
    scene.add(plane)

    const cubeGeometry = new THREE.BoxGeometry(20, 5, 10)
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0x99cccc
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.castShadow = true
    cube.position.y = 15
    scene.add(cube)
    return {
      plane: plane,
      cube: cube
    }
  }

  initTrackballControls(
    camera: THREE.Camera,
    domRenderer: HTMLElement
  ): OrbitControls {
    const controls = new OrbitControls(camera, domRenderer)
    // 添加惯性
    controls.enableDamping = true
    // 最大偏移角度
    controls.maxPolarAngle = 0.45 * Math.PI
    // 禁止移动
    controls.noPan = true
    // 旋转速度
    controls.rotateSpeed = 0.05
    // 最大可视距离
    controls.maxDistance = 500
    // 最小可视距离
    controls.minDistance = 100
    return controls
  }

  /**
   * 创建GUI
   */
  initGUI(spotLight: THREE.SpotLight): GUI {
    class GuiControls {
      private spotLightColor = 0xffffff
      private intensity = 1
      private distance = 350
      private angle = 0.4
      private penumbra = 0.1
      private castShadow = true
      private decay = 1
    }
    const guiControls = new GuiControls()
    const gui = new GUI()
    gui.addColor(guiControls, 'spotLightColor').onChange(e => {
      spotLight.color = new THREE.Color(e)
    })
    gui.add(guiControls, 'intensity', 0, 4).onChange(e => {
      spotLight.intensity = e
    })
    gui.add(guiControls, 'distance', 200, 500).onChange(e => {
      spotLight.distance = e
    })
    gui.add(guiControls, 'angle', 0, 1).onChange(e => {
      spotLight.angle = e
    })
    gui.add(guiControls, 'penumbra', 0, 1).onChange(e => {
      spotLight.penumbra = e
    })
    gui.add(guiControls, 'castShadow').onChange(e => {
      spotLight.castShadow = e
    })
    gui.add(guiControls, 'decay', 0, 1).onChange(e => {
      spotLight.decay = e
    })
    return gui
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
    const webGlRenderer = vm.makeWebGlRenderer(domThreejsObj)
    const camera = vm.makeCamera(domThreejsObj)
    const scene = vm.makeScene()
    const { spotLight, shadowCameraHelper, spotLightHelper } = vm.initLight(
      scene
    )
    const { plane, cube } = vm.initContent(scene)
    const orbitControls = vm.initTrackballControls(
      camera,
      webGlRenderer.domElement
    )
    const gui = vm.initGUI(spotLight)
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
      orbitControls.update()
      shadowCameraHelper.update()
      spotLightHelper.update()
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
