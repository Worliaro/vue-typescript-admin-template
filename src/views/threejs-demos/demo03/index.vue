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

@Component({
  name: 'MyThreeDemosHomeDemo03'
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
    // 创建WebGL渲染器
    const webGlRenderer = new THREE.WebGLRenderer()
    webGlRenderer.antiallias = true
    webGlRenderer.autoClear = true
    webGlRenderer.setClearColor(0x050505)
    webGlRenderer.setSize(viewWidth, viewHeight)
    webGlRenderer.shadowMap.enabled = true
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(200, 150, 200)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    // 创建场景
    const scene = new THREE.Scene()
    // 灯光
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)
    const spotLight = new THREE.SpotLight(0xcccccc)
    spotLight.position.set(-100, 300, 10)
    spotLight.castShadow = true
    // 阴影分辨率
    spotLight.shadow.mapSize.width = 2048
    spotLight.shadow.mapSize.height = 2048
    scene.add(spotLight)
    // 平面
    const planeGeometry = new THREE.PlaneGeometry(200, 400)
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0x6d6565
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    // 绕x轴旋转90度
    plane.rotation.x = -0.5 * Math.PI
    plane.position.y = -10
    plane.position.x = -10
    plane.position.z = -80
    scene.add(plane)
    // 立方体
    const cubeGeometry = new THREE.BoxGeometry(50, 50, 50)
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.castShadow = true
    scene.add(cube)
    // 球体
    const sphereGeometry = new THREE.SphereGeometry(25, 20, 20)
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.castShadow = true
    scene.add(sphere)

    // 创建球体轨迹控件
    const trackballControls = new TrackballControls(
      camera,
      webGlRenderer.domElement
    )

    // 创建 datGUI 面板
    class CubeControls {
      // 立方体可调试属性
      cubeRotationSpeed: number = 0.01
      cubePositionX: number = 10
      cubePositionY: number = 35
      cubePositionZ: number = -30
      // 立方体显隐
      cubeVisible: boolean = false
    }
    class SphereControls {
      // 球体可调试属性
      spherePositionX: number = 8
      spherePositionY: number = 34
      spherePositionZ: number = -25
      sphereWireframe: boolean = false
      sphereColor: any = null
      constructor(sphereMaterial: THREE.MeshLambertMaterial) {
        this.sphereWireframe = sphereMaterial.wireframe
        this.sphereColor = sphereMaterial.color.getStyle()
      }
    }
    class PlaneControls {
      // 平面可调试属性
      planeColor: any = null
      constructor(planeMaterial: THREE.MeshLambertMaterial) {
        this.planeColor = planeMaterial.color.getStyle()
      }
    }
    class OtherControls {
      // 场景背景
      sceneBackground: any = null
      // 灯光开关
      spotLight: boolean = false
      // 下拉选择
      selectMesh: string = 'both'
      constructor(renderer: THREE.WebGLRenderer) {
        this.sceneBackground = renderer
          .getClearColor(new THREE.Color())
          .getHex()
      }
    }
    // 创建dat.GUI 面板
    const gui = new GUI()
    // 立方体调试栏目
    const cubeControlsGUI = gui.addFolder('CubeControls')
    const cubeControls = new CubeControls()
    cubeControlsGUI.add(cubeControls, 'cubeRotationSpeed', 0, 0.5)
    cubeControlsGUI.add(cubeControls, 'cubePositionX', -70, 70)
    cubeControlsGUI.add(cubeControls, 'cubePositionY', 35, 85)
    cubeControlsGUI.add(cubeControls, 'cubePositionZ', -200, 100)
    cubeControlsGUI.add(cubeControls, 'cubePositionX').listen()
    cubeControlsGUI.add(cubeControls, 'cubePositionY').listen()
    cubeControlsGUI.add(cubeControls, 'cubePositionZ').listen()
    cubeControlsGUI
      .add(cubeControls, 'cubeVisible')
      .onChange(function(e: boolean) {
        e ? scene.remove(cube) : scene.add(cube)
      })
    // 球体调试栏目
    const sphereControlsGUI = gui.addFolder('SphereControls')
    const sphereControls = new SphereControls(sphereMaterial)
    sphereControlsGUI.add(sphereControls, 'spherePositionX', 0, 100)
    sphereControlsGUI.add(sphereControls, 'spherePositionY', 0, 100)
    sphereControlsGUI.add(sphereControls, 'spherePositionZ', -200, 100)
    sphereControlsGUI
      .add(sphereControls, 'sphereWireframe')
      .onChange((e: boolean) => {
        sphereMaterial.wireframe = e
      })
    sphereControlsGUI
      .addColor(sphereControls, 'sphereColor')
      .onChange((e: any) => {
        sphereMaterial.color.setStyle(e)
      })
    // 平面调试栏目
    const planeControlsGUI = gui.addFolder('PlaneControls')
    const planeControls = new PlaneControls(planeMaterial)
    planeControlsGUI
      .addColor(planeControls, 'planeColor')
      .onChange((e: any) => {
        planeMaterial.color.setStyle(e)
      })
    // 场景等其他调试栏目
    const otherControlsGUI = gui.addFolder('OtherControls')
    const otherControls = new OtherControls(webGlRenderer)
    otherControlsGUI
      .addColor(otherControls, 'sceneBackground')
      .onChange((e: any) => {
        webGlRenderer.setClearColor(e)
      })
    otherControlsGUI.add(otherControls, 'spotLight').onChange((e: boolean) => {
      e ? scene.remove(spotLight) : scene.add(spotLight)
    })
    otherControlsGUI
      .add(otherControls, 'selectMesh', ['cube', 'sphere', 'both'])
      .onChange((e: string) => {
        scene.remove(cube)
        scene.remove(sphere)
        switch (e) {
          case 'cube':
            scene.add(cube)
            break
          case 'sphere':
            scene.add(sphere)
            break
          case 'both':
            scene.add(cube)
            scene.add(sphere)
        }
      })
    // 让cube和sphere以某个轴同步运动
    const pivotPoint = new THREE.Object3D()
    pivotPoint.add(sphere)
    cube.add(pivotPoint)
    // 将渲染器添加到画布
    domThreejsObj.appendChild(webGlRenderer.domElement)
    ;(<HTMLLIElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)

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
      // 让立方体 绕坐标轴旋转
      cube.rotation.x += cubeControls.cubeRotationSpeed
      cube.rotation.y += cubeControls.cubeRotationSpeed
      cube.rotation.z += cubeControls.cubeRotationSpeed
      cube.position.x = cubeControls.cubePositionX
      cube.position.y = cubeControls.cubePositionY
      cube.position.z = cubeControls.cubePositionZ

      sphere.position.x = sphereControls.spherePositionX
      sphere.position.y = sphereControls.spherePositionY
      sphere.position.z = sphereControls.spherePositionZ
      // 更新轨迹球空间的操作范围
      trackballControls.handleResize()
      // 更新物体位置
      trackballControls.update()
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
