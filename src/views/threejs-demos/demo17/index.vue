/<template>
  <div :ref="divName" class="threejs-container">
    <div ref="WidgetStats" class="stats-output"></div>
    <div ref="WidgetGUI" class="gui-output"></div>
    <div ref="block" v-show="blockVisible" class="block">
      <div ref="instructions" class="instructions">
        <span style="font-size:40px">Click to play</span>
        <br />
        (W, A, S, D = Move, MOUSE = Look around)
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { TrackballControls } from 'three-trackballcontrols-ts'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { WEBGL } from 'three/examples/jsm/WebGL'
import { GridHelper } from 'three'
/**
 * Three.js 源码更新，删除了Detector.js ，采用新的WebGL.js了
 */

@Component({
  name: 'MyThreeDemosHomeDemo10'
})
export default class extends Vue {
  private divName = 'domThreejs'
  private blockDivName = 'block'
  private instructionsDivName = 'instructions'
  private domThreejs: HTMLElement = this.$refs[this.divName] as HTMLElement
  private domBlock: HTMLElement = this.$refs[this.blockDivName] as HTMLElement
  private domInstructions: HTMLElement = this.$refs[
    this.instructionsDivName
  ] as HTMLElement
  private blockVisible: boolean = true

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
      this.domBlock = this.$refs[this.blockDivName] as HTMLElement
    }
    // 说明文档对象
    if (!this.domInstructions) {
      this.domInstructions = this.$refs[this.instructionsDivName] as HTMLElement
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
    const domBlockObj = vm.domBlock
    const domInstructionsObj = vm.domInstructions

    // 创建渲染器
    const webGlRenderer = new THREE.WebGLRenderer({
      antialias: true
    })
    webGlRenderer.autoClear = true
    webGlRenderer.setClearColor(0x050505)
    webGlRenderer.setSize(viewWidth, viewHeight)
    domThreejsObj.append(webGlRenderer.domElement)
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    // 加入点锁定控件也可以设置相机属性
    camera.position.set(0, 60, 600)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    // 创建场景
    const scene = new THREE.Scene()
    // 实体
    // 灯光
    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-300, 600, -400)
    spotLight.castShadow = true
    scene.add(spotLight)
    scene.add(new THREE.AmbientLight(0xc1c1c1))
    // 格网辅助
    const gridHelper = new GridHelper(1200, 60, 0xcd2626, 0x5c5c5c)
    scene.add(gridHelper)
    // 地板
    let floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100)
    floorGeometry.rotateX(-Math.PI / 2)
    floorGeometry = floorGeometry.toNonIndexed()
    const floorColors = this.makeColors(floorGeometry.attributes.position.count)
    floorGeometry.addAttribute(
      'color',
      new THREE.Float32BufferAttribute(floorColors, 3)
    )
    const floorMaterial = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    scene.add(floor)
    // PointerControls
    const pointerLockControls = new PointerLockControls(camera)
    scene.add(pointerLockControls.getObject())
    // GUI
    const gui = new GUI()
    ;(<HTMLElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)

    // 判断浏览器是否支持 PointerLock
    const havePointerLock = this.supportPointerLock()
    if (!havePointerLock) {
      domInstructionsObj.innerHTML =
        "Your browser doesn't seem to support Pointer Lock API"
      return
    }
    const element = document.body
    let controlsEnable = false // 鼠标锁定模式开启
    const pointerlockChange = function(event) {
      debugger
      if (
        document.pointerLockElement === element ||
        document.mozPointerLockElement === element ||
        document.webkitPointerLockElement === element
      ) {
        controlsEnable = true
        pointerLockControls.enabled = true
        vm.blockVisible = false
      } else {
        vm.blockVisible = true
      }
    }
    // 添加 pointerLockChange事件
    document.addEventListener('pointerlockChange', pointerlockChange)
    document.addEventListener('mozpointerlockchange', pointerlockChange)
    document.addEventListener('webkitpointerlockchange', pointerlockChange)
    const pointerlockError = function(event) {
      alert('pointer lock error')
    }
    document.addEventListener('pointerlockerror', pointerlockError)
    document.addEventListener('mozpointerlockerror', pointerlockError)
    document.addEventListener('webkitpointerlockerror', pointerlockError)

    // 窗口点击事件
    domBlockObj.addEventListener(
      'click',
      () => {
        debugger
        vm.blockVisible = false
        // ask the browser to lock the pointer
        element.requestPointerLock =
          element.requestPointerLock ||
          element.mozRequestPointerLock ||
          element.webkitRequestPointerLock
        element.requestPointerLock()
      },
      false
    )
    // Esc事件-退出鼠标锁定模式
    window.addEventListener('keypress', event => {
      debugger
      if (event.code === 27) {
        if (document.pointerLockElement) {
          if (
            document.pointerLockElement === element ||
            document.mozPointerLockElement === element ||
            document.webkitPointerLockElement === element
          ) {
            document.exitPointerLock()
          }
        }
      }
    })

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

  supportPointerLock(): boolean {
    return (
      'pointerLockElement' in document ||
      'mozPointerLockElement' in document ||
      'webkitPointerLockElement' in document
    )
  }

  makeColors(count: number): Array<number> {
    const colors: Array<number> = []
    const color = new THREE.Color()
    for (let i = 0; i < count; i++) {
      color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
      colors.push(color.r, color.g, color.b)
    }
    return colors
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
    text-align: center;
    background-color: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    .instructions {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 255);
      font-weight: bold;
    }
  }
}
</style>
