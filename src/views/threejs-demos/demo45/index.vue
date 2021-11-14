<template>
  <div :ref="divName" class="threejs-container"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { TrackballControls } from 'three-trackballcontrols-ts'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { OrbitControls } from '@three-ts/orbit-controls'
import {
  AmbientLight,
  ArrowHelper,
  DirectionalLightHelper,
  EventDispatcher,
  Group,
  ImageUtils,
  MeshBasicMaterial,
  Object3D,
  ParametricGeometry,
  WireframeGeometry,
} from 'three'
import { VelocityNode } from 'three/examples/jsm/nodes/Nodes'

import { Face3, Geometry } from 'three/examples/jsm/deprecated/Geometry'
import { normalize } from 'gsap/dist/gsap'
import {
  CSS3DObject,
  CSS3DRenderer,
} from 'three/examples/jsm/renderers/CSS3DRenderer'
import { render } from 'nprogress'
const SceneUtils = require('three/examples/jsm/utils/SceneUtils')

@Component({
  name: 'MyThreeDemosHomeDemo43',
})
export default class extends Vue {
  private divName = 'domThreejs'
  private domThreejs: HTMLElement = this.$refs[this.divName] as HTMLElement
  private renderer: CSS3DRenderer
  private camera: THREE.PerspectiveCamera
  private scene: THREE.Scene
  private target = new THREE.Vector3() // 相机聚焦点
  // 经纬度是相机的聚焦点
  private lon = 90
  private lat = 0
  // 弧度制相机聚焦点
  private phi = 0
  private theta = 0
  // 移动端输入的 x,y
  private touchX = 0
  private touchY = 0
  // 图片路径
  private imgSrc = 'demo45_images/siximg/par.front.jpg'
  // 为了保证 mouseDown 和 mouseUp添加MouseMove事件对象统一，此处将 MouseMove事件引用声明为全局对象
  private eventMouseMove: any = null
  private eventMouseUp: any = null

  mounted() {
    this.preInit()
  }

  preInit() {
    const vm = this
    if (!vm.domThreejs) {
      vm.domThreejs = vm.$refs[vm.divName] as HTMLElement
    }
    // 因为㲏加载比较慢，可以先设置一个背景图
    vm.domThreejs.style.backgroundImage = `url(${vm.imgSrc})`
    vm.domThreejs.style.backgroundRepeat = 'no-repeat'
    vm.domThreejs.style.backgroundSize = `${vm.domThreejs.offsetWidth}px ${vm.domThreejs.offsetHeight}px`
    const img = new Image()
    // img.src = require(vm.imgSrc)
    img.src = vm.imgSrc
    // 图片加载完成后调用
    img.onload = () => {
      vm.init(img.width)
      animate()
    }

    function animate() {
      requestAnimationFrame(animate)
      vm.lat = Math.max(-85, Math.min(85, vm.lat))
      vm.phi = THREE.MathUtils.degToRad(90 - vm.lat)
      vm.theta = THREE.MathUtils.degToRad(vm.lon)

      vm.target.x = Math.sin(vm.phi) * Math.cos(vm.theta)
      vm.target.y = Math.cos(vm.phi)
      vm.target.z = Math.sin(vm.phi) * Math.sin(vm.theta)

      vm.camera.lookAt(vm.target)
      vm.renderer.render(vm.scene, vm.camera)
    }
  }

  init(width: number) {
    const vm = this
    const viewWidth = vm.domThreejs.offsetWidth
    const viewHeight = vm.domThreejs.offsetHeight
    const solution = viewWidth / viewHeight
    vm.camera = new THREE.PerspectiveCamera(75, solution, 1, 1000)
    vm.scene = new THREE.Scene()
    // 图片路径
    const src = vm.imgSrc.substring(0, vm.imgSrc.indexOf('.'))
    // 图片格式
    const format = vm.imgSrc.slice(vm.imgSrc.lastIndexOf('.') + 1)
    //  以下六个面 拼接成立方体
    const sides = [
      {
        url: `${src}.left.${format}`,
        position: [-width / 2, 0, 0],
        rotation: [0, Math.PI / 2, 0],
      },
      {
        url: `${src}.right.${format}`,
        position: [width / 2, 0, 0],
        rotation: [0, -Math.PI / 2, 0],
      },
      {
        url: `${src}.top.${format}`,
        position: [0, width / 2, 0],
        rotation: [Math.PI / 2, 0, Math.PI],
      },
      {
        url: `${src}.bottom.${format}`,
        position: [0, -width / 2, 0],
        rotation: [-Math.PI / 2, 0, Math.PI],
      },
      {
        url: `${src}.back.${format}`,
        position: [0, 0, width / 2],
        rotation: [0, Math.PI, 0],
      },
      {
        url: `${src}.front.${format}`,
        position: [0, 0, -width / 2],
        rotation: [0, 0, 0],
      },
    ]

    for (let i = 0; i < sides.length; i++) {
      const side = sides[i]
      const element = document.createElement('img')
      element.width = width + 6
      element.src = side.url
      const css3Loader = new CSS3DObject(element)
      css3Loader.position.fromArray(side.position)
      css3Loader.rotation.fromArray(side.rotation)
      vm.scene.add(css3Loader)
    }

    vm.renderer = new CSS3DRenderer()
    vm.renderer.setSize(viewWidth, viewHeight)
    vm.domThreejs.appendChild(vm.renderer.domElement)

    vm.domThreejs.addEventListener('mousedown', vm.onDocumentMouseDown, false)
    vm.domThreejs.addEventListener('wheel', vm.onDocumentMouseWheel, false)
    vm.domThreejs.addEventListener('touchstart', vm.onDocumentTouchStart, false)
    vm.domThreejs.addEventListener('touchmove', vm.onDocumentTouchMove, false)
    vm.domThreejs.addEventListener('resize', vm.onWindowResize, false)
  }

  onDocumentMouseDown(event: any) {
    const vm = this
    event.preventDefault()
    // 为全局的mouseMov属性赋值
    vm.domThreejs.style.cursor = 'move'
    vm.domThreejs.addEventListener('mousemove', vm.onDoucmentMousMove, false)
    vm.domThreejs.addEventListener('mouseup', vm.onDocumentMouseUp, false)
  }

  onDoucmentMousMove(event) {
    const vm = this
    const movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0
    const movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0
    // 拖动速度随相机视角的变动而变动
    const speed = vm.camera.fov * 0.0015
    // 经纬度平移速度
    vm.lon -= movementX * speed
    vm.lat += movementY * speed
  }

  onDocumentMouseUp(event) {
    const vm = this
    event.preventDefault()
    vm.domThreejs.style.cursor = 'auto'
    vm.domThreejs.removeEventListener('mousemove', vm.onDoucmentMousMove)
    vm.domThreejs.removeEventListener('mouseup', vm.onDocumentMouseUp)
  }

  onDocumentMouseWheel(event) {
    const vm = this
    // 缩放速度
    const speed = 0.008
    const fov = vm.camera.fov + event.deltaY * speed
    // 角度缩放最值
    vm.camera.fov = THREE.MathUtils.clamp(fov, 45, 95)
    vm.camera.updateProjectionMatrix()
  }

  onDocumentTouchStart(event) {
    const vm = this
    event.preventDefault()
    const touch = event.touches[0]
    vm.touchX = touch.screenX
    vm.touchY = touch.screenY

    console.log('touchX', vm.touchX)
    console.log('touchY', vm.touchY)
  }

  onDocumentTouchMove(event) {
    const vm = this
    event.preventDefault()
    const touch = event.touches[0]
    vm.lon -= (touch.screenX - vm.touchX) * 0.1
    vm.lat += (touch.screenY - vm.touchY) * 0.1

    vm.touchX = touch.screenX
    vm.touchY = touch.screenY
  }

  onWindowResize() {
    const vm = this
    vm.camera.aspect = vm.domThreejs.offsetWidth / vm.domThreejs.offsetHeight
    vm.camera.updateProjectionMatrix()
    vm.renderer.setSize(vm.domThreejs.offsetWidth, vm.domThreejs.offsetHeight)
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
