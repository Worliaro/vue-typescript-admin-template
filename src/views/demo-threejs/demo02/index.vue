<template>
  <div :ref="divName" class="threejs-container">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as THREE from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'
@Component({
  name: 'ThreeJsDemo02'
})
export default class extends Vue {
  private divName = 'ThreeDiv';
  private domThree: HTMLElement = this.$refs[this.divName] as HTMLElement

  mounted() {
    this.getThreeDivOption()
    if (this.domThree) {
      this.init(this.domThree)
    }
  }

  getThreeDivOption() {
    if (!this.domThree) {
      this.domThree = this.$refs[this.divName] as HTMLElement
    }
  }

  init(domThreejs:HTMLElement) {
    // 创建场景对象Scene
    const scene = new THREE.Scene()
    // 创建网格模型
    const sphereGeometry = new THREE.SphereGeometry(40, 60, 60) // 创建一个球体几何对象
    const boxGeometry = new THREE.BoxGeometry(100, 100, 100) // 创建一个立方体几何对象
    const material = new THREE.MeshLambertMaterial({
      color: '0x0000ff'
    }) // 材质对象
    const mesh = new THREE.Mesh(boxGeometry, material) // 网格模型对象Mesh
    scene.add(mesh) // 网格模型添加到场景

    // 光源设置
    // 点光源
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(400, 200, 300) // 点光源位置
    scene.add(pointLight) // 光源添加到场景中
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x444444)
    scene.add(ambientLight)

    // 相机设置
    const viewAreaWidth = domThreejs.offsetWidth// 可视区域宽
    const viewAreaHeight = domThreejs.offsetHeight // 可视区域高
    const k = viewAreaWidth / viewAreaHeight // 可视区域宽高比
    const s = 200 // 三维场景显示范围控制系数  系数越大 显示的范围越大
    // 创建相机
    const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
    camera.position.set(200, 300, 200) // 设置相机位置
    camera.lookAt(scene.position) // 设置相机方向（指向的场景方向）

    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(viewAreaWidth, viewAreaHeight) // 设置渲染区域尺寸
    renderer.setClearColor(0xb9d3ff, 1) // 设置背景颜色
    renderer.domElement.style.borderRadius = '4px' // 设置canvas样式
    domThreejs.appendChild(renderer.domElement) // 视窗dom中插入canvas对象
    // 执行渲染操作  指定场景 相机
    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()
    const controls = new OrbitControls(camera, renderer.domElement)// 创建控件对象
  }
}
</script>
<style lang="scss" scoped>
.threejs-container {
  width: 100%;
  height: 100%;
}
</style>
