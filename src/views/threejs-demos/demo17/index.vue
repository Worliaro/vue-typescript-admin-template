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
    stats.setMode(0)
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0px'
    stats.domElement.style.top = '0px'
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
    if (!this.domInstructions) {
      this.domInstructions = this.$refs[this.instructionsDivName] as HTMLElement
    }
  }

  init() {
    const vm = this
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

    const webGlRenderer = new THREE.WebGLRenderer({
      antialias: true
    })
    webGlRenderer.autoClear = true
    webGlRenderer.setClearColor(0x050505)
    webGlRenderer.setSize(viewWidth, viewHeight)
    domThreejsObj.append(webGlRenderer.domElement)
    const camera = new THREE.PerspectiveCamera(45, viewSolution, 0.1, 10000)
    camera.position.set(0, 60, 600)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    const scene = new THREE.Scene()
    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-300, 600, -400)
    spotLight.castShadow = true
    scene.add(spotLight)
    scene.add(new THREE.AmbientLight(0xc1c1c1))
    const gridHelper = new GridHelper(1200, 60, 0xcd2626, 0x5c5c5c)
    scene.add(gridHelper)
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
    const pointerLockControls = new PointerLockControls(camera)
    scene.add(pointerLockControls.getObject())
    const gui = new GUI()
    ;(<HTMLElement>vm.$refs.WidgetGUI).appendChild(gui.domElement)

    const havePointerLock = this.supportPointerLock()
    if (!havePointerLock) {
      domInstructionsObj.innerHTML =
        "Your browser doesn't seem to support Pointer Lock API"
      return
    }
    const element = document.body
    let controlsEnable = false
    const pointerlockChange = function(event) {
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
    document.addEventListener('pointerlockChange', pointerlockChange)
    document.addEventListener('mozpointerlockchange', pointerlockChange)
    document.addEventListener('webkitpointerlockchange', pointerlockChange)
    const pointerlockError = function(event) {
      alert('pointer lock error')
    }
    document.addEventListener('pointerlockerror', pointerlockError)
    document.addEventListener('mozpointerlockerror', pointerlockError)
    document.addEventListener('webkitpointerlockerror', pointerlockError)

    domBlockObj.addEventListener(
      'click',
      () => {
        vm.blockVisible = false
        element.requestPointerLock =
          element.requestPointerLock ||
          element.mozRequestPointerLock ||
          element.webkitRequestPointerLock
        element.requestPointerLock()
      },
      false
    )
    window.addEventListener('keypress', event => {
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

    window.addEventListener(
      'resize',
      () => {
        vm.onViewContainerResize(domThreejsObj, camera, webGlRenderer)
      },
      false
    )
    function render(): void {
      stats.update()
      webGlRenderer.render(scene, camera)
    }
    function animate(): void {
      requestAnimationFrame(animate)
      render()
    }
    animate()
  }

  onViewContainerResize(
    viewDom: HTMLElement,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ): void {
    camera.aspect = viewDom.offsetWidth / viewDom.offsetHeight
    camera.updateProjectionMatrix()
    renderer.setSize(viewDom.offsetWidth, viewDom.offsetHeight)
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
