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
import { ConeBufferGeometry, SphereGeometry } from 'three'

@Component({
  name: 'MyThreeDemosHomeDemo05'
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

    // 创建webGl渲染器
    const webGlRenderer = new THREE.WebGLRenderer()
    webGlRenderer.antialias = true
    webGlRenderer.autoClear = true
    webGlRenderer.setClearColor(0x050505)
    webGlRenderer.setSize(viewWidth, viewHeight)
    // 开启阴影效果
    // webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap
    webGlRenderer.shadowMap.enabled = true
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(0, 200, 300)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    // 常见场景
    const scene = new THREE.Scene()
    // 创建灯光
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)
    // 添加光源
    const spotLight = new THREE.SpotLight(0xcccccc)
    spotLight.position.set(-100, 300, 10)
    spotLight.castShadow = true
    // 设置阴影分辨率
    spotLight.shadow.mapSize.width = 2048
    spotLight.shadow.mapSize.height = 2048
    scene.add(spotLight)
    // 创建平面
    const planeGeometry = new THREE.PlaneGeometry(400, 400)
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x6d6565 })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    // 绕x轴旋转90度
    plane.rotation.x = -0.5 * Math.PI
    plane.position.y = -10
    plane.position.z = -80
    scene.add(plane)
    // 创建球体
    const sphereGeometry = new THREE.SphereGeometry(5, 20, 20)
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.position.y = 30
    sphere.position.z = -60
    sphere.castShadow = true
    scene.add(sphere)
    // 创建立方体
    const cubeGeometry = new THREE.BoxGeometry(40, 40, 40)
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.position.x = 10
    cube.position.z = 150
    cube.castShadow = true
    scene.add(cube)
    // 创建轴心点
    const pivotPoint = new THREE.Object3D()
    pivotPoint.add(cube)
    sphere.add(pivotPoint)

    // 将渲染器添加到画布
    domThreejsObj.append(webGlRenderer.domElement)
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
      // 旋转
      sphere.rotation.y += 0.01
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
