<template>
  <div :ref="divName" class="threejs-container">
    <div ref="WidgetStats" class="stats-output"></div>
    <div ref="WidgetGUI" class="gui-output"></div>
    <div :ref="divNameBlock" class="block">
      <div :ref="divNameInstructions" class="instructions">
        <span>Click to play</span>
        <br />
        (W, A, S, D = Move, SPACE = Jump, MOUSE = Look around)
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { WEBGL } from 'three/examples/jsm/WebGL'
import { Raycaster } from 'three'
import { dataTool } from 'echarts'
/**
 * Three.js 源码更新，删除了Detector.js ，采用新的WebGL.js了
 */

@Component({
  name: 'MyThreeDemosHomeDemo16'
})
export default class extends Vue {
  private divName = 'domThreejs'
  private divNameBlock = 'block'
  private divNameInstructions = 'instructions'
  private domThreejs: HTMLElement = this.$refs[this.divName] as HTMLElement
  private domBlock: HTMLElement = this.$refs[this.divNameBlock] as HTMLElement
  // 说明文档对象
  private domInstructions: HTMLElement = this.$refs[
    this.divNameInstructions
  ] as HTMLElement

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
    if (!this.domBlock) {
      this.domBlock = this.$refs[this.divNameBlock] as HTMLElement
    }
    if (!this.domInstructions) {
      this.domInstructions = this.$refs[this.divNameInstructions] as HTMLElement
    }
  }

  init() {
    const vm = this

    const element = document.body
    const domDivBlock = this.domBlock
    const domDivInstructions = this.domInstructions
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
    // 创建WebGLRenderer
    const webGlRenderer = new THREE.WebGLRenderer({
      antialias: true
    })
    webGlRenderer.setPixelRatio(window.devicePixelRatio)
    webGlRenderer.setSize(viewWidth, viewHeight)
    domThreejsObj.appendChild(webGlRenderer.domElement)
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, viewSolution, 1, 1000)
    // 创建场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    scene.fog = new THREE.Fog(0xffffff, 0, 750)
    // 灯光
    const hemiSphereLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
    hemiSphereLight.position.set(0.5, 1, 0.75)
    scene.add(hemiSphereLight)
    // 不知道是干什么
    // 初始化控制器
    const pointerLockControls = new PointerLockControls(camera)
    scene.add(pointerLockControls.getObject())
    // 控制器默认参数
    let controlsEnabled = false
    let moveForward = false
    let moveBackward = false
    let moveLeft = false
    let moveRight = false
    let canJump = false
    let prevTime = performance.now()
    const velocity = new THREE.Vector3()
    const direction = new THREE.Vector3()
    const vertex = new THREE.Vector3()
    const color = new THREE.Color()
    const objects: Array<THREE.Mesh> = []
    const havePointerLock =
      'pointerLockElement' in document ||
      'mozPointerLockElement' in document ||
      'webkitPointerLockElement' in document
    if (!havePointerLock) {
      domDivInstructions.innerHTML =
        "Your browser doesn't seem to support Pointer Lock API"
    } else {
      const pointerlockChange = function(event) {
        if (
          document.pointerLockElement === element ||
          document.mozPointerLockElement == element ||
          document.webkitPointerLockElement === element
        ) {
          controlsEnabled = true
          pointerLockControls.enabled = true
          domDivBlock.style.display = 'none'
        } else {
          pointerLockControls.enabled = false
          domDivBlock.style.display = 'block'
          domDivInstructions.style.display = ''
        }
      }
      const pointerlockError = function(event) {
        domDivInstructions.style.display = ''
      }
      document.addEventListener('pointerlockchange', pointerlockChange, false)
      document.addEventListener(
        'mozpointerlockchange',
        pointerlockChange,
        false
      )
      document.addEventListener(
        'webkitpointerlockchange',
        pointerlockChange,
        false
      )
      // 错误回调
      document.addEventListener('pointerlockerror', pointerlockError, false)
      document.addEventListener('mozpointerlockerror', pointerlockError, false)
      document.addEventListener(
        'webkitpointerlockerror',
        pointerlockError,
        false
      )
      // 判断以下当前浏览器是否支持鼠标锁定   并绑定到了鼠标点击事件
      domDivBlock.addEventListener(
        'click',
        event => {
          // 使 div 隐藏
          domDivInstructions.style.display = 'none'
          // Ask the browser to lock the pointer
          element.requestPointerLock =
            element.requestPointerLock ||
            element.mozRequestPointerLock ||
            element.webkitRequestPointerLock
          element.requestPointerLock()
        },
        false
      )
    }
    // 键盘按下触发事件
    const onKeyDown = function(event) {
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          // 向前移动
          moveForward = true
          break
        case 37: // left
        case 65: // a
          // 向左移动
          moveLeft = true
          break
        case 40: // down
        case 83: // s
          // 向后移动
          moveBackward = true
          break
        case 39: // right
        case 68: // d
          // 向后移动
          moveRight = true
          break
        case 32: // space
          // 弹跳
          if (canJump) {
            velocity.y += 350
            canJump = false
          }
          break
      }
    }
    // 键盘抬起触发事件
    const onKeyUp = function(event) {
      switch (event.keyCode) {
        case 38:
        case 87:
          moveForward = false
          break
        case 37:
        case 65:
          moveLeft = false
          break
        case 40:
        case 83:
          moveBackward = false
          break
        case 39:
        case 68:
          moveRight = false
          break
      }
    }
    document.addEventListener('keyDown', onKeyDown, false)
    document.addEventListener('keyUp', onKeyUp, false)
    // 射线投手
    const rayCaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0),
      0,
      10
    )
    // 地板
    let floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100)
    floorGeometry.rotateX(-Math.PI / 2)
    // vertex displacement
    const position = floorGeometry.attributes.position
    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i)
      // 产生复杂的地板纹路
      vertex.x += Math.random() * 20 - 10
      vertex.y += Math.random() * 2
      vertex.z += Math.random() * 20 - 10
      position.setXYZ(i, vertex.x, vertex.y, vertex.z)
    }
    // return a non-index version of indexed BufferGeometry
    floorGeometry = floorGeometry.toNonIndexed()
    const count = floorGeometry.attributes.position.count
    const colors: Array<number> = []
    for (let i = 0; i < count; i++) {
      color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
      colors.push(color.r, color.g, color.b)
    }
    floorGeometry.addAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    )
    // 地板材质
    const floorMaterial = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    scene.add(floor)
    // objects
    let boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20)
    // 确保每一个面都有唯一的顶点
    boxGeometry = boxGeometry.toNonIndexed() // ensue each face has unique vertices
    const tmpColors: Array<number> = []
    for (let i = 0; i < boxGeometry.attributes.position.count; i++) {
      color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
      tmpColors.push(color.r, color.g, color.b)
    }
    boxGeometry.addAttribute(
      'color',
      new THREE.Float32BufferAttribute(tmpColors, 3)
    )
    for (let i = 0; i < 500; i++) {
      const boxMaterial = new THREE.MeshPhongMaterial({
        specular: 0xffffff,
        flatShading: true,
        vertexColors: THREE.VertexColors
      })
      boxMaterial.color.setHSL(
        Math.random() * 0.2 + 0.5,
        0.75,
        Math.random() * 0.25 + 0.75
      )
      const box = new THREE.Mesh(boxGeometry, boxMaterial)
      box.position.x = Math.floor(Math.random() * 20 - 10) * 20
      box.position.y = Math.floor(Math.random() * 20) * 20 + 10
      box.position.z = Math.floor(Math.random() * 20 - 10) * 20
      scene.add(box)
      objects.push(box)
    }
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
      // 开始渲染
      webGlRenderer.render(scene, camera)
    }
    function animate(): void {
      requestAnimationFrame(animate)

      if (controlsEnabled) {
        // 射线起点位置
        rayCaster.ray.origin.copy(pointerLockControls.getObject().position)
        rayCaster.ray.origin.y -= 10
        const intersections = rayCaster.intersectObjects(objects)
        const onObject = intersections.length > 0
        const time = performance.now()
        const delta = (time - prevTime) / 1000
        velocity.x -= velocity.x * 10.0 * delta
        velocity.z -= velocity.z * 10.0 * delta
        velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass
        direction.z = Number(moveForward) - Number(moveBackward)
        direction.z = Number(moveLeft) - Number(moveRight)
        direction.normalize() // this ensure consistent movements in all directions
        if (moveForward || moveBackward) {
          velocity.z -= direction.z * 400.0 * delta
        }
        if (moveLeft || moveRight) {
          velocity.z -= direction.x * 400.0 * delta
        }
        if (onObject) {
          velocity.y = Math.max(0, velocity.y)
          canJump = true
        }
        pointerLockControls.getObject().translateX(velocity.x * delta)
        pointerLockControls.getObject().translateY(velocity.y * delta)
        pointerLockControls.getObject().translateZ(velocity.z * delta)
        if (pointerLockControls.getObject().position.y < 10) {
          velocity.y = 0
          pointerLockControls.getObject().position.y = 10
          canJump = true
        }
        prevTime = time
      }
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
  .block {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    .instructions {
      color: #ffffff;
      text-align: center;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
