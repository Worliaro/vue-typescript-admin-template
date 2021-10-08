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
import { OrbitControls } from '@three-ts/orbit-controls'

@Component({
  name: 'MyThreeDemosHomeDemo07'
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
    webGlRenderer.setClearColor(0xeeeeee)
    webGlRenderer.setSize(viewWidth, viewHeight)
    webGlRenderer.shadowMap.enabled = true
    webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap
    domThreejsObj.append(webGlRenderer.domElement)
    // 创建场景
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0xffffff, 0.015, 100) // 定义线性雾，密度随着距离的增加而线性增长
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(-30, 40, 30)
    camera.lookAt(scene.position)

    // 创建场景中的实体
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1)
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    plane.rotation.x = -0.5 * Math.PI
    scene.add(plane)
    // 光
    const ambientLight = new THREE.AmbientLight(0x0c0c0c)
    scene.add(ambientLight)
    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-40, 60, -10)
    spotLight.castShadow = true
    spotLight.shadow.mapSize.height = 2048
    spotLight.shadow.mapSize.width = 2048
    scene.add(spotLight)

    // 参数调节面板
    class Controls {
      private rotationSpeed = 0.02
      private numberOfObjects = 0
      private color: any = null
      private near: any = null
      private far: any = null
      constructor(scene: THREE.Scene) {
        const sceneFog = scene.fog as THREE.Fog
        if (sceneFog) {
          this.color = sceneFog.color.getStyle()
          this.near = sceneFog.near
          this.far = sceneFog.far
        }
      }
      getRotationSpeed() {
        return this.rotationSpeed
      }

      addCube(): void {
        const cubeSize = Math.ceil(Math.random() * 3)
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
        const cubeMaterial = new THREE.MeshLambertMaterial({
          color: Math.random() * 0xffffff
        })
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cube.castShadow = true
        cube.receiveShadow = true
        // 让随机出现的小立方体位置限制在平面之内
        cube.position.x =
          -30 + Math.round(Math.random() * planeGeometry.parameters.width)
        cube.position.y = 5 + Math.round(Math.random() * 5)
        cube.position.z =
          -20 + Math.round(Math.random() * planeGeometry.parameters.height)
        scene.add(cube)
        debugger
        this.numberOfObjects = this.numberOfObjects =
          scene.children.filter(item => item instanceof THREE.Mesh).length - 1
      }

      removeCube(): void {
        const allChildren = scene.children
        const lastObject = allChildren[allChildren.length - 1]
        if (lastObject instanceof THREE.Mesh) {
          scene.remove(lastObject)
          this.numberOfObjects =
            scene.children.filter(item => item instanceof THREE.Mesh).length - 1
        }
      }
    }
    const controls = new Controls(scene)
    const gui = new GUI()
    gui.add(controls, 'rotationSpeed', 0, 0.5)
    gui.add(controls, 'addCube')
    gui.add(controls, 'removeCube')
    gui.add(controls, 'numberOfObjects').listen()
    const fogGui = gui.addFolder('Fog')
    fogGui.addColor(controls, 'color').onChange(function(e: any) {
      const sceneFog = scene.fog as THREE.Fog
      if (sceneFog) {
        sceneFog.color.setStyle(e)
      }
    })
    fogGui.add(controls, 'near', 0, 1)
    fogGui.add(controls, 'far', 0, 10000)
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
      // traverse 方法 在这个对象scene 和所有子对象 children上执行回调
      scene.traverse(function(e: any) {
        console.log(e)
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
