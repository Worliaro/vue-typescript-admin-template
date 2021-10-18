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
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
// controls
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
// loaders
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { Clock } from 'three'
/**
 * Three.js 源码更新，删除了Detector.js ，采用新的WebGL.js了
 */

@Component({
  name: 'MyThreeDemosHomeDemo18'
})
export default class extends Vue {
  private publicPath: string = process.env.BASE_URL
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
    // 创建渲染器
    const webGlRenderer = new THREE.WebGLRenderer()
    webGlRenderer.setClearColor(0x050505)
    webGlRenderer.setSize(viewWidth, viewHeight)
    webGlRenderer.shadowMap.enabled = true
    webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap
    domThreejsObj.append(webGlRenderer.domElement)
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(0, 120, 200)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    // 创建场景
    const scene = new THREE.Scene()
    // 创建灯光
    const sphere = new THREE.SphereBufferGeometry(1, 16, 8)
    const cube = new THREE.BoxGeometry(2, 2, 1)
    const cone = new THREE.ConeGeometry(2, 4, 20)
    const pointLight1 = new THREE.PointLight(0xfdf5e6, 1, 200)
    pointLight1.add(
      new THREE.Mesh(
        sphere,
        new THREE.MeshBasicMaterial({
          color: 0xfdf5e6
        })
      )
    )
    const pointLight2 = new THREE.PointLight(0xfa8072, 1, 200)
    pointLight2.add(
      new THREE.Mesh(
        cube,
        new THREE.MeshBasicMaterial({
          color: 0xfa8072
        })
      )
    )
    const pointLight3 = new THREE.PointLight(0x9b30ff, 1, 200)
    pointLight3.add(
      new THREE.Mesh(
        cone,
        new THREE.MeshBasicMaterial({
          color: 0x9b30ff
        })
      )
    )
    const lights = [pointLight1, pointLight2, pointLight3]
    scene.add(pointLight1)
    scene.add(pointLight2)
    scene.add(pointLight3)
    // 添加模型
    const mtlLoader = new MTLLoader()
    mtlLoader.setPath(`${window.origin}/${this.publicPath}/models/walt/`)
    mtlLoader.load('WaltHead.mtl', materialCreator => {
      const objLoader = new OBJLoader()
      objLoader.setMaterials(materialCreator)
      objLoader.setPath(`${window.origin}/${this.publicPath}/models/walt/`)
      objLoader.load('WaltHead.obj', group => {
        group.name = 'loadObject'
        scene.add(group)
      })
    })
    // 添加控制器
    const trackballControls = new TrackballControls(
      camera,
      webGlRenderer.domElement
    )
    // 添加时钟
    const clock = new Clock()

    // 窗口大小改变触发的方法
    window.addEventListener(
      'resize',
      () => {
        vm.onViewContainerResize(domThreejsObj, camera, webGlRenderer)
      },
      false
    )
    function viewAction(): void {
      const object = scene.getObjectByName('loadObject')
      if (object) {
        object.rotation.y -= 0.5 * clock.getDelta()
        const time = Date.now() * 0.0005
        lights[0].position.x = Math.sin(time * 0.7) * 30
        lights[0].position.y = Math.cos(time * 0.5) * 40
        lights[0].position.z = Math.cos(time * 0.3) * 30
        lights[1].position.x = Math.sin(time * 0.3) * 30
        lights[1].position.y = Math.cos(time * 0.5) * 40
        lights[1].position.z = Math.cos(time * 0.3) * 30
        lights[2].position.x = Math.sin(time * 0.7) * 30
        lights[2].position.y = Math.cos(time * 0.3) * 40
        lights[2].position.z = Math.cos(time * 0.5) * 30
      }
    }
    // 渲染方法
    function render(): void {
      viewAction()
      trackballControls.update()
      // 更新性能插件
      stats.update()
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
