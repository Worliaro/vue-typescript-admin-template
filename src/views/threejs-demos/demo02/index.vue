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
  name: 'MyThreeDemosHomeDemo02'
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
    webGlRenderer.antialias = true
    webGlRenderer.autoClear = true
    webGlRenderer.setClearColor(0x050505)
    webGlRenderer.setSize(viewWidth, viewHeight)
    webGlRenderer.shadowMap.enabled = true
    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      45,
      viewWidth / viewHeight,
      0.1,
      10000
    )
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
    cube.position.y = 35
    cube.position.x = 10
    cube.position.z = -30
    cube.castShadow = true
    scene.add(cube)

    // 创建轨迹球控件
    const trackballControls = new TrackballControls(
      camera,
      webGlRenderer.domElement
    )

    // 创建图形调试控件
    const gui = new GUI()
    // 创建 helperGUI目录，下面包含 gridHelper
    const helperGui = gui.addFolder('Helper')
    class Controls {
      rotationSpeed: number
      wireframe: boolean
      color: any
      backGround: any
      constructor(
        material: THREE.MeshLambertMaterial,
        renderer: THREE.WebGLRenderer
      ) {
        this.rotationSpeed = 0.02
        this.wireframe = material.wireframe
        this.color = material.color.getStyle()
        this.backGround = renderer.getClearColor(new THREE.Color()).getHex()
      }
    }
    const controls = new Controls(cubeMaterial, webGlRenderer)
    // 创建 meshGui 目录，目录下包含组件  wireframe  color  rotationSpeed
    const meshGui = gui.addFolder('Mesh')
    meshGui.add(controls, 'wireframe').onChange(e => {
      console.log('[helperGui:wireframe]', e)
      cubeMaterial.wireframe = e
    })
    meshGui.addColor(controls, 'color').onChange(e => {
      console.log('[helperGui:color]', e)
      cubeMaterial.color.setStyle(e)
    })
    meshGui.add(controls, 'rotationSpeed', 0, 0.1)

    // 创建 sceneGui 目录，目录下不包含 backGround 组件
    const sceneGui = gui.addFolder('Scene')
    sceneGui.addColor(controls, 'backGround').onChange(e => {
      console.log('[helperGui:Scene]', e)
      webGlRenderer.setClearColor(e)
    })

    // 将渲染器添加到画布
    domThreejsObj.appendChild(webGlRenderer.domElement)
    ;(<HTMLLIElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)

    // 窗口大小改变触发的方法
    window.addEventListener(
      'resize',
      (): void => {
        vm.onViewContainerResize(domThreejsObj, camera, webGlRenderer)
      },
      false
    )
    // 渲染方法
    function render(): void {
      // 更新性能插件
      stats.update()
      // 立方体旋转，速度由调试插件控制
      cube.rotation.x += controls.rotationSpeed
      cube.rotation.y += controls.rotationSpeed
      cube.rotation.z += controls.rotationSpeed
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
