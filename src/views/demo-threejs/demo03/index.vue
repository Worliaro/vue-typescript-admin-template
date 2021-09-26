<template>
  <div :ref="divName" class="threejs-container">
      <div class="control-tools">
          <div class="widget-geometry-change">
              <select v-model="geometryTypeSelected" @change="handlerGeometryTypeChange">
                    <option v-for="item in geometryTypeOptions" :key="item.id" :value="item.value">
                      {{item.label}}
                    </option>
              </select>
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as THREE from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'

enum GeometryType{
    Box='Box',
    Sphere='Sphere',
    Cylinder='Cylinder',
    Octahedron='Octahedron',
    Dodecahedron='Dodecahedron',
    Icosahedron='Icosahedron'
}

@Component({
  name: 'ThreeJsDemo03'
})

export default class extends Vue {
  // threejs 对象
  private divName = 'ThreeDiv';
  private domThree: HTMLElement = this.$refs[this.divName] as HTMLElement
  private scene:THREE.Scene;
  private camera:THREE.Camera;
  private renderer:THREE.WebGLRenderer;

  // 几何体类型选择组件
  private geometryTypeOptions = [
    {
      id: 0,
      label: '长方体',
      value: 'Box'
    },
    {
      id: 1,
      label: '球体',
      value: 'Sphere'
    },
    {
      id: 2,
      label: '圆柱体',
      value: 'Cylinder'
    },
    {
      id: 3,
      label: '正八面体',
      value: 'Octahedron'
    },
    {
      id: 4,
      label: '正十二面体',
      value: 'Dodecahedron'
    },
    {
      id: 5,
      label: '正二十面体',
      value: 'Icosahedron'
    }
  ]

  private geometryTypeSelected = this.geometryTypeOptions[0].value
  handlerGeometryTypeChange():void {
    const showGeometryType = this.geometryTypeSelected
    // 移除已有的几何体
    const sceneObj = this.scene
    if (!sceneObj) {
      alert('scene未初始化')
      return
    }
    const meshOld = sceneObj.children.find(item => item.type && item.type === 'Mesh')
    debugger
    if (meshOld) {
      // 释放将移除的Mesh对象【网格模型】绑定的几何体和材质所占用的内存
      meshOld.geometry.dispose()
      meshOld.material.dispose()
      sceneObj.remove(meshOld)
    }
    let showGeometry:THREE.BufferGeometry
    if (showGeometryType === GeometryType.Box) {
      showGeometry = new THREE.BoxGeometry(100, 100, 100) // 创建一个立方体几何对象
    } else if (showGeometryType === GeometryType.Sphere) {
      showGeometry = new THREE.SphereGeometry(40, 60, 60) // 创建一个球体几何对象
    } else if (showGeometryType === GeometryType.Cylinder) {
      showGeometry = new THREE.CylinderGeometry(50, 50, 100, 25) // 创建一个圆柱体几何对象
    } else if (showGeometryType === GeometryType.Octahedron) {
      showGeometry = new THREE.OctahedronGeometry(50) // 创建一个正八面体几何对象
    } else if (showGeometryType === GeometryType.Dodecahedron) {
      showGeometry = new THREE.DodecahedronGeometry(50) // 创建一个正十二面体几何对象
    } else if (showGeometryType === GeometryType.Icosahedron) {
      showGeometry = new THREE.IcosahedronGeometry(50) // 创建一个正二十面体几何对象
    } else {
      alert('没有匹配到的几何体类型，采用默认的几何体类型--立方体')
      showGeometry = new THREE.BoxGeometry(100, 100, 100) // 创建一个立方体几何对象
    }
    const material = new THREE.MeshLambertMaterial({
      color: '0x0000ff'
    }) // 材质对象
    const meshNew = new THREE.Mesh(showGeometry, material) // 网格模型对象Mesh
    sceneObj.add(meshNew) // 网格模型添加到场景
  }

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
    // 1 创建场景对象Scene
    this.scene = new THREE.Scene()
    const sceneObj = this.scene
    // 创建网格模型
    const showGeometryType = this.geometryTypeSelected
    let showGeometry:THREE.BufferGeometry
    if (showGeometryType === GeometryType.Box) {
      showGeometry = new THREE.BoxGeometry(100, 100, 100) // 创建一个立方体几何对象
    } else if (showGeometryType === GeometryType.Sphere) {
      showGeometry = new THREE.SphereGeometry(40, 60, 60) // 创建一个球体几何对象
    } else if (showGeometryType === GeometryType.Cylinder) {
      showGeometry = new THREE.CylinderGeometry(50, 50, 100, 25) // 创建一个圆柱体几何对象
    } else if (showGeometryType === GeometryType.Octahedron) {
      showGeometry = new THREE.OctahedronGeometry(50) // 创建一个正八面体几何对象
    } else if (showGeometryType === GeometryType.Dodecahedron) {
      showGeometry = new THREE.DodecahedronGeometry(50) // 创建一个正十二面体几何对象
    } else if (showGeometryType === GeometryType.Icosahedron) {
      showGeometry = new THREE.IcosahedronGeometry(50) // 创建一个正二十面体几何对象
    } else {
      alert('没有匹配到的几何体类型，采用默认的几何体类型--立方体')
      showGeometry = new THREE.BoxGeometry(100, 100, 100) // 创建一个立方体几何对象
    }
    const material = new THREE.MeshLambertMaterial({
      color: '0x0000ff'
    }) // 材质对象
    const mesh = new THREE.Mesh(showGeometry, material) // 网格模型对象Mesh
    sceneObj.add(mesh) // 网格模型添加到场景
    // 光源设置
    // 点光源
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(400, 200, 300) // 点光源位置
    sceneObj.add(pointLight) // 光源添加到场景中
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x444444)
    sceneObj.add(ambientLight)

    // 2 相机设置
    const viewAreaWidth = domThreejs.offsetWidth// 可视区域宽
    const viewAreaHeight = domThreejs.offsetHeight // 可视区域高
    const k = viewAreaWidth / viewAreaHeight // 可视区域宽高比
    const s = 200 // 三维场景显示范围控制系数  系数越大 显示的范围越大
    // 创建相机
    this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
    const camera = this.camera
    camera.position.set(200, 300, 200) // 设置相机位置
    camera.lookAt(sceneObj.position) // 设置相机方向（指向的场景方向）

    // 创建渲染器对象
    this.renderer = new THREE.WebGLRenderer()
    const renderer = this.renderer
    renderer.setSize(viewAreaWidth, viewAreaHeight) // 设置渲染区域尺寸
    renderer.setClearColor(0xb9d3ff, 1) // 设置背景颜色
    renderer.domElement.style.borderRadius = '4px' // 设置canvas样式
    domThreejs.appendChild(renderer.domElement) // 视窗dom中插入canvas对象
    // 执行渲染操作  指定场景 相机
    function render() {
      renderer.render(sceneObj, camera)
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
  position: relative;
  .control-tools{
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 221px;
    padding: 6px;
    border-radius: 4px;
    background-color: #faccc1;
    .widget-geometry-change{
        padding: 10px 10px 0px 10px;
        select{
            width: 100%;
            padding: 2px;
            border-radius: 4px;
            border-color: #1890ff;
            font-size: 14px;
        }
    }
  }
}
</style>
