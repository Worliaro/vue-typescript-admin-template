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
// require('three/examples/js/controls/TrackballControls')
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { WEBGL } from 'three/examples/jsm/WebGL'
import { BaseEvent, GridHelper, Raycaster } from 'three'
/**
 * Three.js 源码更新，删除了Detector.js ，采用新的WebGL.js了
 */

@Component({
  name: 'MyThreeDemosHomeDemo14'
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
    // 创建WebGLRenderer并检查兼容
    const webGlRenderer = new THREE.WebGLRenderer({
      antialias: true
    })
    webGlRenderer.setClearColor(0x050505)
    webGlRenderer.setSize(viewWidth, viewHeight)
    domThreejsObj.append(webGlRenderer.domElement)
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(0, 400, 600)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    // 创建场景
    const scene = new THREE.Scene()
    // 创建内容
    // 灯光
    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-300, 600, -400)
    spotLight.castShadow = true
    scene.add(spotLight)
    const ambientLight = new THREE.AmbientLight(0x5c5c5c)
    scene.add(ambientLight)
    // 网格模型
    const gridHelper = new GridHelper(1200, 50, 0xcd3700, 0x4a4a4a)
    scene.add(gridHelper)
    const cubeGeometry = new THREE.BoxGeometry(100, 100, 100)
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0x9370db
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.position.y = 50
    cube.name = 'cube'
    cube.addEventListener('click', event => {
      console.log(event.message)
      vm.changeMeshMaterial(event.target)
    })
    scene.add(cube)
    const sphereGeometry = new THREE.SphereGeometry(50, 50, 50, 50)
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x3cb371
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.position.x = 200
    sphere.position.y = 50
    sphere.name = 'sphere'
    scene.add(sphere)
    const cylinderGeometry = new THREE.CylinderGeometry(50, 50, 100, 100)
    const cylinderMaterial = new THREE.MeshLambertMaterial({
      color: 0xcd7054
    })
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
    cylinder.position.x = -200
    cylinder.position.y = 50
    cylinder.name = 'cylinder'
    scene.add(cylinder)
    // 轨道控件
    const trackballControls = new TrackballControls(
      camera,
      webGlRenderer.domElement
    )
    // const trackballControls = new THREE.TrackballControls(
    //   camera,
    //   webGlRenderer.domElement
    // )
    // GUI
    const gui = new GUI()
    ;(<HTMLElement>vm.$refs.WidgetGUI).append(gui.domElement)
    // 事件监听
    // 鼠标点击

    // 窗口大小改变触发的方法
    window.addEventListener(
      'resize',
      () => {
        vm.onViewContainerResize(domThreejsObj, camera, webGlRenderer)
      },
      false
    )
    domThreejsObj.addEventListener('click', event => {
      vm.handlerMeshClick(event, camera, scene, domThreejsObj)
    })
    // 渲染方法
    function render(): void {
      // 更新性能插件
      stats.update()
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
  // 鼠标点选Mesh处理函数
  handlerMeshClick(
    event: any,
    camera: THREE.Camera,
    scene: THREE.Scene,
    domViewThreejs?: HTMLElement
  ) {
    // 获取 raycaster和所有模型相交的数据，其中的元素按照距离排序，越近的越靠前
    const intersects = this.toolsCalculateIntersectsMeshByClick(
      event,
      camera,
      scene,
      domViewThreejs
    )
    // 获取最近的 Mesh 对象
    if (intersects.length !== 0 && intersects[0].object instanceof THREE.Mesh) {
      if (intersects[0].object.name === 'cube') {
        intersects[0].object.dispatchEvent({
          type: 'click',
          message: 'mouse click you'
        })
      } else {
        const selectObject = intersects[0].object
        this.changeMeshMaterial(selectObject)
      }
    } else {
      console.log('[handlerMeshClick]:未点中Mesh')
    }
  }
  // 更改点中的Mesh的材质
  changeMeshMaterial(meshObj: THREE.Mesh) {
    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff * Math.random(),
      transparent: meshObj.material.transparent ? false : true,
      opacity: 0.8
    })
    meshObj.material = material
  }
  // 计算鼠标点击的射线上是否存在至少一个Mesh
  toolsCalculateIntersectsMeshByClick(
    event: any,
    camera: THREE.Camera,
    scene: THREE.Scene,
    domViewThreejs?: HTMLElement
  ): THREE.Intersection[] {
    console.log(
      '[toolsCalculateIntersectsMeshByClick]event.clientX:',
      event.clientX
    )
    console.log(
      '[toolsCalculateIntersectsMeshByClick]event.clientY:',
      event.clientY
    )
    // 声明 raycaster 和 mouse 变量
    const rayCaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    // 通过鼠标点击的位置，计算出 raycaster所需点的位置，以屏幕为中心点，范围  -1到1之间
    if (domViewThreejs) {
      const offsetTop = domViewThreejs.getBoundingClientRect().top
      const offsetLeft = domViewThreejs.getBoundingClientRect().left
      mouse.x =
        ((event.clientX - offsetLeft) / domViewThreejs.offsetWidth) * 2 - 1
      mouse.y =
        -((event.clientY - offsetTop) / domViewThreejs.offsetHeight) * 2 + 1
    } else {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    // 通过鼠标点击的位置（二维坐标和当前相机的矩阵计算出射线位置）
    rayCaster.setFromCamera(mouse, camera)
    // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
    const intersects = rayCaster.intersectObjects(scene.children)
    return intersects
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
