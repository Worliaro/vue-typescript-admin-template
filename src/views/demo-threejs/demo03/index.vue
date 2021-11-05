<template>
  <div :ref="divName" class="threejs-container">
    <div class="control-tools">
      <div class="widget-geometry-change">
        <select
          v-model="geometryTypeSelected"
          @change="handlerGeometryTypeChange"
        >
          <option
            v-for="item in geometryTypeOptions"
            :key="item.id"
            :value="item.value"
          >
            {{ item.label }}
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

enum GeometryType {
  Box = 'Box',
  Sphere = 'Sphere',
  Cylinder = 'Cylinder',
  Octahedron = 'Octahedron',
  Dodecahedron = 'Dodecahedron',
  Icosahedron = 'Icosahedron'
}

@Component({
  name: 'ThreeJsDemo03'
})
export default class extends Vue {
  private divName = 'ThreeDiv'
  private domThree: HTMLElement = this.$refs[this.divName] as HTMLElement
  private scene: THREE.Scene | null = null
  private camera: THREE.Camera | null = null
  private renderer: THREE.WebGLRenderer | null = null

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
  handlerGeometryTypeChange(): void {
    const showGeometryType = this.geometryTypeSelected
    const sceneObj = this.scene
    if (!sceneObj) {
      alert('scene未初始化')
      return
    }
    const meshOld = sceneObj.children.find(
      item => item.type && item.type === 'Mesh'
    )
    if (meshOld) {
      sceneObj.remove(meshOld)
    }
    let showGeometry: THREE.BufferGeometry
    if (showGeometryType === GeometryType.Box) {
      showGeometry = new THREE.BoxGeometry(100, 100, 100)
    } else if (showGeometryType === GeometryType.Sphere) {
      showGeometry = new THREE.SphereGeometry(40, 60, 60)
    } else if (showGeometryType === GeometryType.Cylinder) {
      showGeometry = new THREE.CylinderGeometry(50, 50, 100, 25)
    } else if (showGeometryType === GeometryType.Octahedron) {
      showGeometry = new THREE.OctahedronGeometry(50)
    } else if (showGeometryType === GeometryType.Dodecahedron) {
      showGeometry = new THREE.DodecahedronGeometry(50)
    } else if (showGeometryType === GeometryType.Icosahedron) {
      showGeometry = new THREE.IcosahedronGeometry(50)
    } else {
      alert('没有匹配到的几何体类型，采用默认的几何体类型--立方体')
      showGeometry = new THREE.BoxGeometry(100, 100, 100)
    }
    const material = new THREE.MeshLambertMaterial({
      color: '0x0000ff'
    })
    const meshNew = new THREE.Mesh(showGeometry, material)
    sceneObj.add(meshNew)
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

  init(domThreejs: HTMLElement) {
    this.scene = new THREE.Scene()
    const sceneObj = this.scene
    const showGeometryType = this.geometryTypeSelected
    let showGeometry: THREE.BufferGeometry
    if (showGeometryType === GeometryType.Box) {
      showGeometry = new THREE.BoxGeometry(100, 100, 100)
    } else if (showGeometryType === GeometryType.Sphere) {
      showGeometry = new THREE.SphereGeometry(40, 60, 60)
    } else if (showGeometryType === GeometryType.Cylinder) {
      showGeometry = new THREE.CylinderGeometry(50, 50, 100, 25)
    } else if (showGeometryType === GeometryType.Octahedron) {
      showGeometry = new THREE.OctahedronGeometry(50)
    } else if (showGeometryType === GeometryType.Dodecahedron) {
      showGeometry = new THREE.DodecahedronGeometry(50)
    } else if (showGeometryType === GeometryType.Icosahedron) {
      showGeometry = new THREE.IcosahedronGeometry(50)
    } else {
      alert('没有匹配到的几何体类型，采用默认的几何体类型--立方体')
      showGeometry = new THREE.BoxGeometry(100, 100, 100)
    }
    const material = new THREE.MeshLambertMaterial({
      color: '0x0000ff'
    })
    const mesh = new THREE.Mesh(showGeometry, material)
    sceneObj.add(mesh)
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(400, 200, 300)
    sceneObj.add(pointLight)
    const ambientLight = new THREE.AmbientLight(0x444444)
    sceneObj.add(ambientLight)

    const viewAreaWidth = domThreejs.offsetWidth
    const viewAreaHeight = domThreejs.offsetHeight
    const k = viewAreaWidth / viewAreaHeight
    const s = 200
    this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
    const camera = this.camera
    camera.position.set(200, 300, 200)
    camera.lookAt(sceneObj.position)

    this.renderer = new THREE.WebGLRenderer()
    const renderer = this.renderer
    renderer.setSize(viewAreaWidth, viewAreaHeight)
    renderer.setClearColor(0xb9d3ff, 1)
    renderer.domElement.style.borderRadius = '4px'
    domThreejs.appendChild(renderer.domElement)
    function render() {
      renderer.render(sceneObj, camera)
      requestAnimationFrame(render)
    }
    render()
    const controls = new OrbitControls(camera, renderer.domElement)
    console.log(controls)
  }
}
</script>
<style lang="scss" scoped>
.threejs-container {
  width: 100%;
  height: 100%;
  position: relative;
  .control-tools {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 221px;
    padding: 6px;
    border-radius: 4px;
    background-color: #faccc1;
    .widget-geometry-change {
      padding: 10px 10px 0px 10px;
      select {
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
