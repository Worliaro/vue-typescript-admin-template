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
  name: 'MyThreeDemosHomeDemo04'
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
    webGlRenderer.antialias = true // 抗锯齿
    webGlRenderer.autoClear = true // 自动清除
    webGlRenderer.setClearColor(0x050505) // 渲染背景色
    webGlRenderer.setSize(viewWidth, viewHeight) // 渲染范围
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(0, 400, 800)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    // 创建场景
    const scene = new THREE.Scene()
    // 创建定点小球
    const ballGeometrySmall = new THREE.SphereGeometry(10, 100, 100)
    const ballMaterialSmall = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    })
    const ballSmall = new THREE.Mesh(ballGeometrySmall, ballMaterialSmall)
    ballSmall.position.y = 90
    scene.add(ballSmall)
    // 创建动点大球
    const ballGeometryBig = new THREE.SphereGeometry(20, 100, 100)
    const ballMaterialBig = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    })
    const ballBig = new THREE.Mesh(ballGeometryBig, ballMaterialBig)
    ballBig.position.z = 290
    scene.add(ballBig)
    // 创建轴心点
    const pivotPoint = new THREE.Object3D()
    pivotPoint.add(ballBig)
    ballSmall.add(pivotPoint)
    // 创建光源 ambientLight: 环境光  directionalLight 平行光
    const ambientLight = new THREE.AmbientLight(0x404040)
    const directionalLight1 = new THREE.DirectionalLight(0xc0c090)
    const directionalLight2 = new THREE.DirectionalLight(0xc0c090)
    directionalLight1.position.set(-300, -400, 300)
    directionalLight2.position.set(300, 400, -300)
    scene.add(ambientLight)
    scene.add(directionalLight1)
    scene.add(directionalLight2)
    // 创建网格辅助
    const gridHelper = new THREE.GridHelper(1200, 50, 0xff4444, 0x404040)
    scene.add(gridHelper)
    // 创建轨迹球空间
    const trackballControls = new TrackballControls(
      camera,
      webGlRenderer.domElement
    )
    // 创建图形调试空间中的组件
    class Controls {
      private rotationSpeed = 0.02
      private wireframe = false
      private color: any = null
      private girdHelper = false
      private backGround: any = null
      constructor(
        material: THREE.MeshLambertMaterial,
        webGlRenderer: THREE.WebGLRenderer
      ) {
        this.wireframe = material.wireframe
        this.color = material.color.getStyle()
        this.backGround = webGlRenderer
          .getClearColor(new THREE.Color())
          .getHex()
      }

      getRotationSpeed() {
        return this.rotationSpeed
      }
    }
    // 创建图形调试空间
    const gui = new GUI()
    // 创建 helerGUI目录，包含 gridHelper组件
    const helperGui = gui.addFolder('Helper')
    const controls = new Controls(ballMaterialSmall, webGlRenderer)
    helperGui.add(controls, 'girdHelper').onChange(function(e: any) {
      if (e) {
        scene.remove(gridHelper)
      } else {
        scene.add(gridHelper)
      }
    })
    // 创建 meshGui目录，目录下包含组件  wireframe color rotationSpeed
    const meshGui = gui.addFolder('Mesh')
    meshGui.add(controls, 'wireframe').onChange(function(e: any) {
      ballMaterialSmall.wireframe = e
    })
    meshGui.addColor(controls, 'color').onChange(function(e: any) {
      ballMaterialSmall.color.setStyle(e)
    })
    meshGui.add(controls, 'rotationSpeed', 0, 0.1)
    // 创建 sceneGui目录，目录下包含 backGround组件
    const sceneGui = gui.addFolder('Scene')
    sceneGui.addColor(controls, 'backGround').onChange(function(e: any) {
      webGlRenderer.setClearColor(e)
    })
    // 将渲染器添加到画布
    domThreejsObj.append(webGlRenderer.domElement)
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
      // 小球旋转
      ballSmall.rotation.y += controls.getRotationSpeed()
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
