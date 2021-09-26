<template>
  <div :ref="divName" class="threejs-container">
      <div class="control-tools">
          <div class="widget-geometry-change">
               <el-select
                  v-model="geometryTypeSelected"
                  multiple
                  collapse-tags
                  style="margin-left: 20px;"
                  placeholder="请选择"
                  @change="handlerGeometryTypeChange"
                  >
                  <el-option
                    v-for="item in geometryTypeOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
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

  private geometryTypeSelected = [this.geometryTypeOptions[0].value]
  handlerGeometryTypeChange():void {
    const showGeometryTypes = this.geometryTypeSelected
    // 移除已有的几何体
    const sceneObj = this.scene
    if (!sceneObj) {
      alert('scene未初始化')
      return
    }
    // 移除所有已添加的几何体
    const meshesOld = sceneObj.children.filter(item => item.type && item.type === 'Mesh')
    if (meshesOld.length > 0) {
      // 释放将移除的Mesh对象【网格模型】绑定的几何体和材质所占用的内存
      meshesOld.forEach(item => {
        item.geometry.dispose()
        item.material.dispose()
        sceneObj.remove(item)
      })
    }
    // 添加新的几何体
    const showGeometries = showGeometryTypes.map(item => {
      return this.makeGeometry(item)
    })
    const dicMaterial :{[x:string]:THREE.Material} = {}
    showGeometryTypes.forEach(item => {
      if (item === GeometryType.Sphere) {
        dicMaterial[item] = new THREE.MeshLambertMaterial({
          color: '0x0000ff',
          opacity: 0.6,
          transparent: true
        }) // 透明材质对象
      } else if (item === GeometryType.Dodecahedron) {
        dicMaterial[item] = new THREE.MeshLambertMaterial({
          color: '0x0000ff',
          wireframe: true
        }) // 仅以线框方式渲染
      } else if (item === GeometryType.Cylinder) {
        dicMaterial[item] = new THREE.MeshPhongMaterial({
          color: 0x0000ff,
          specular: 0x4488ee,
          shininess: 12
        })// 高光材质
      } else {
        dicMaterial[item] = new THREE.MeshLambertMaterial({
          color: '0x0000ff'
        }) // 默认的材质对象
      }
    })
    let offDistance = 0
    showGeometries.forEach(item => {
      const meshNew = new THREE.Mesh(item, dicMaterial[item.name]) // 网格模型对象Mesh
      meshNew.translateX(offDistance)
      offDistance += 200
      sceneObj.add(meshNew) // 网格模型添加到场景
    })
  }

  makeGeometry(type:string) {
    let showGeometry:THREE.BufferGeometry
    if (type === GeometryType.Box) {
      showGeometry = new THREE.BoxGeometry(100, 100, 100) // 创建一个立方体几何对象
    } else if (type === GeometryType.Sphere) {
      showGeometry = new THREE.SphereGeometry(60, 40, 40) // 创建一个球体几何对象
    } else if (type === GeometryType.Cylinder) {
      showGeometry = new THREE.CylinderGeometry(50, 50, 100, 25) // 创建一个圆柱体几何对象
    } else if (type === GeometryType.Octahedron) {
      showGeometry = new THREE.OctahedronGeometry(50) // 创建一个正八面体几何对象
    } else if (type === GeometryType.Dodecahedron) {
      showGeometry = new THREE.DodecahedronGeometry(50) // 创建一个正十二面体几何对象
    } else if (type === GeometryType.Icosahedron) {
      showGeometry = new THREE.IcosahedronGeometry(50) // 创建一个正二十面体几何对象
    } else {
      alert('没有匹配到的几何体类型，采用默认的几何体类型--立方体')
      showGeometry = new THREE.BoxGeometry(100, 100, 100) // 创建一个立方体几何对象
    }
    showGeometry.name = type
    return showGeometry
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
    const showGeometryTypes = this.geometryTypeSelected
    if (showGeometryTypes.length <= 0) {
      alert('至少初始化一个几何体')
      return
    }
    const showGeometries = showGeometryTypes.map(item => {
      return this.makeGeometry(item)
    })

    const material = new THREE.MeshLambertMaterial({
      color: '0x0000ff'
    }) // 材质对象
    showGeometries.forEach(item => {
      const mesh = new THREE.Mesh(item, material) // 网格模型对象Mesh
      // 随机移动随机距离
      sceneObj.add(mesh) // 网格模型添加到场景
    })

    // 光源设置
    // 点光源
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(400, 200, 300) // 点光源位置
    sceneObj.add(pointLight) // 光源添加到场景中
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x444444)
    sceneObj.add(ambientLight)

    // 辅助三维坐标系
    const axisHelper = new THREE.AxesHelper(250)
    sceneObj.add(axisHelper)

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
        ::v-deep .el-select{
          margin-left:0px !important;
        }
    }
  }
}
</style>
