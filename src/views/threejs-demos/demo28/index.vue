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
import {
  Lensflare,
  LensflareElement
} from 'three/examples/jsm/objects/Lensflare'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
import {
  CylinderGeometry,
  DirectionalLightShadow,
  HemisphereLight,
  MeshStandardMaterial,
  Scene
} from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'

@Component({
  name: 'MyThreeDemosHomeDemo27'
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

  /**
   * 创建渲染器
   */
  initRenderer(domView: HTMLElement): THREE.WebGLRenderer {
    const webGlRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    // 设置渲染器的像素比例，按照设备
    webGlRenderer.setPixelRatio(window.devicePixelRatio)
    // 渲染范围
    webGlRenderer.setSize(domView.offsetWidth, domView.offsetHeight)
    // 开启阴影支持
    webGlRenderer.shadowMap.enabled = true
    // 阴影类型
    webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap
    domView.appendChild(webGlRenderer.domElement)
    return webGlRenderer
  }

  /**
   * 创建相机
   */
  initCamera(domView: HTMLElement): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      45,
      domView.offsetWidth / domView.offsetHeight,
      0.1,
      5000
    )
    camera.position.set(0, 0, 250)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return camera
  }

  /**
   * 创建场景
   */
  initScene() {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050505)
    return scene
  }

  /**
   * 创建灯光
   */
  initLight(scene: THREE.Scene) {
    const ambientLight = new THREE.AmbientLight(0xdbdbdb)
    scene.add(ambientLight)
    return {
      ambientLight
    }
  }

  /**
   * 场景中内容
   */
  initContent(scene: THREE.Scene) {
    // 创建一个换面纠结对象
    const torusKontGeometry = new THREE.TorusKnotGeometry(40, 10, 50, 50)
    const basicMaterial = new THREE.MeshBasicMaterial({
      color: 0x7777ff
    })
    const torusKont = new THREE.Mesh(torusKontGeometry, basicMaterial)
    scene.add(torusKont)
    return {
      torusKont
    }
  }

  /**
   * 创建控制器
   */
  initOrbitControls(
    camera: THREE.Camera,
    webglRenderer: THREE.WebGLRenderer
  ): OrbitControls {
    const controls = new OrbitControls(camera, webglRenderer.domElement)
    // 添加惯性
    controls.enableDamping = true
    // 最大偏移角度
    controls.maxPolarAngle = 0.49 * Math.PI
    // 旋转速度
    controls.rotateSpeed = 0.05
    // 最大可视距离
    controls.maxDistance = 500
    // 最小可视距离
    controls.minDistance = 100
    return controls
  }

  /**
   * GUI
   */
  initGUI(
    scene: THREE.Scene,
    ambientLight: THREE.AmbientLight,
    torusKont: THREE.Mesh
  ): GUI {
    class GuiControls {
      // Scene
      private background = '0x050505'
      private ambientLight
      private fog = false
      private fogColor: string
      // Material
      private transparent = true
      // 如果材料不透明。则这个值的改变会对材料的颜色有影响，为0时材料的颜色会变成白色
      private opacity = 1
      private depthTest = true
      private depthWrite = true
      private visible = true
      private side = 'front'
      // MeshBasicMaterial
      private color = '0x050505'
      private wireframe = false
      private wireframeLinecap = ''
      constructor(
        scene: THREE.Scene,
        ambientLight: THREE.AmbientLight,
        torusKont: THREE.Mesh
      ) {
        const sceneBackground = scene.background as THREE.Color
        if (sceneBackground) {
          this.background = sceneBackground.getStyle()
        }
        this.ambientLight = ambientLight.color.getStyle()
        const sceneFog = scene.fog as THREE.Fog
        if (sceneFog) {
          this.fogColor = sceneFog.color.getStyle()
        } else {
          this.fogColor = sceneBackground.getStyle()
        }
        const torusKontMaterial = torusKont.material as THREE.MeshBasicMaterial
        if (torusKontMaterial) {
          this.color = torusKontMaterial.color.getStyle()
          this.transparent = torusKontMaterial.transparent
          this.opacity = torusKontMaterial.opacity
          this.wireframe = torusKontMaterial.wireframe
          this.wireframeLinecap = torusKontMaterial.wireframeLinecap
        }
      }
    }
    const guiControls = new GuiControls(scene, ambientLight, torusKont)
    const gui = new GUI()
    // scene
    const sceneFolder = gui.addFolder('Scene')
    sceneFolder.addColor(guiControls, 'background').onChange(e => {
      const sceneBackground = scene.background as THREE.Color
      if (sceneBackground) {
        sceneBackground.setStyle(e)
      }
    })
    sceneFolder.addColor(guiControls, 'ambientLight').onChange(e => {
      ambientLight.color.setStyle(e)
    })
    sceneFolder.open()
    // fog
    const fogFolder = sceneFolder.addFolder('scene.fog')
    fogFolder.add(guiControls, 'fog').onChange(e => {
      const sceneBackground = scene.background as THREE.Color
      if (e) {
        if (sceneBackground) {
          scene.fog = new THREE.Fog(sceneBackground.getStyle(), 0.1, 500)
        } else {
          scene.fog = new THREE.Fog('0x050505', 0.1, 500)
        }
      } else {
        scene.fog = null
      }
    })
    fogFolder.addColor(guiControls, 'fogColor').onChange(e => {
      const sceneFog = scene.fog as THREE.Fog
      if (sceneFog) {
        sceneFog.color.setStyle(e)
      }
    })
    fogFolder.open()
    // material
    const torusKontMaterial = torusKont.material as THREE.MeshBasicMaterial
    const materialFolder = gui.addFolder('THREE.Material')
    materialFolder.add(guiControls, 'transparent').onChange(e => {
      if (torusKontMaterial) {
        torusKontMaterial.transparent = e
      }
    })
    materialFolder.add(guiControls, 'opacity', 0.0, 1.0).onChange(e => {
      if (torusKontMaterial) {
        torusKontMaterial.opacity = e
      }
    })
    materialFolder.add(guiControls, 'depthTest').onChange(e => {
      if (torusKontMaterial) {
        torusKontMaterial.depthTest = e
      }
    })
    materialFolder.add(guiControls, 'depthWrite').onChange(e => {
      if (torusKontMaterial) {
        torusKontMaterial.depthWrite = e
      }
    })
    materialFolder.add(guiControls, 'visible').onChange(e => {
      if (torusKontMaterial) {
        torusKontMaterial.visible = e
      }
    })
    materialFolder
      .add(guiControls, 'side', ['front', 'back', 'double'])
      .onChange(e => {
        if (torusKontMaterial) {
          switch (e) {
            case 'front':
              torusKontMaterial.side = THREE.FrontSide
              break
            case 'back':
              torusKontMaterial.side = THREE.BackSide
              break
            case 'double':
              torusKontMaterial.side = THREE.DoubleSide
              break
          }
        }
      })
    materialFolder.open()
    // BasicMaterial
    const basicMaterialFolder = gui.addFolder('THREE.MeshBasicMaterial')
    basicMaterialFolder.addColor(guiControls, 'color').onChange(e => {
      torusKontMaterial.color.setStyle(e)
    })
    basicMaterialFolder.add(guiControls, 'wireframe').onChange(e => {
      torusKontMaterial.wireframe = e
    })
    basicMaterialFolder
      .add(guiControls, 'wireframeLinecap', ['round', 'butt', 'square'])
      .onChange(e => {
        torusKontMaterial.wireframeLinecap = e
      })
    basicMaterialFolder.open()
    return {
      gui,
      guiControls
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
    const webGlRenderer = vm.initRenderer(domThreejsObj)
    const camera = vm.initCamera(domThreejsObj)
    const scene = vm.initScene()
    const { ambientLight } = vm.initLight(scene)
    const { torusKont } = vm.initContent(scene)
    const orbitControls = vm.initOrbitControls(camera, webGlRenderer)
    const { gui, guiControls } = vm.initGUI(scene, ambientLight, torusKont)
    ;(<HTMLElement>vm.$refs.WidgetGUI).append(gui.domElement)

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
      orbitControls.update()
      torusKont.rotation.y += 0.01
      torusKont.rotation.x += 0.01
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
