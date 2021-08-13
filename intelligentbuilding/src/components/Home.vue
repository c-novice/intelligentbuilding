<template>
  <div>
    <el-tree :data="data" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current
             :props="defaultProps" @check="handleTreeNodeClick">
    </el-tree>
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three/build/three.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

let scene = null
let controls = null

export default {
  data () {
    return {
      // 树形组件
      data: [{
        id: 1,
        label: '计算机学院',
        children: [
          { id: 11, label: '1L', children: [{ id: 101, label: '1L墙体' }, { id: 102, label: '1L桌椅' }] },
          { id: 12, label: '2L', children: [{ id: 103, label: '2L墙体' }, { id: 104, label: '2L桌椅' }] },
          { id: 13, label: '3L', children: [{ id: 105, label: '3L墙体' }, { id: 106, label: '3L桌椅' }] },
          { id: 14, label: '4L', children: [{ id: 107, label: '4L墙体' }, { id: 108, label: '4L桌椅' }] },
          { id: 15, label: '5L', children: [{ id: 109, label: '5L墙体' }, { id: 110, label: '5L桌椅' }] },
          { id: 16, label: '6L', children: [{ id: 111, label: '6L墙体' }, { id: 112, label: '6L桌椅' }] }
        ]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 场景组件
      camera: null,
      renderer: null,
      mesh: null,
      clock: null,
      // 模型组件
      floor_1: null,
      floor_2: null,
      floor_3: null,
      floor_4: null,
      floor_5: null,
      floor_6: null,
      context_1: null,
      context_2: null,
      context_3: null,
      context_4: null,
      context_5: null,
      context_6: null,
      // 判断加载
      isLoaded_1: false,
      isLoaded_11: false,
      isLoaded_12: false,
      isLoaded_13: false,
      isLoaded_14: false,
      isLoaded_15: false,
      isLoaded_16: false,
      isLoaded_101: false,
      isLoaded_102: false,
      isLoaded_103: false,
      isLoaded_104: false,
      isLoaded_105: false,
      isLoaded_106: false,
      isLoaded_107: false,
      isLoaded_108: false,
      isLoaded_109: false,
      isLoaded_110: false,
      isLoaded_111: false,
      isLoaded_112: false
    }
  },
  mounted () {
    this.init()
    this.animate()
  },
  methods: {
    // 点击树节点事件处理
    handleTreeNodeClick (data, node, elem) {
      switch (data.id) {
        case 1:
          if (this.isLoaded_1 === true) {
            this.isLoaded_1 = false
            scene.remove(this.floor_1)
            scene.remove(this.floor_2)
            scene.remove(this.floor_3)
            scene.remove(this.floor_4)
            scene.remove(this.floor_5)
            scene.remove(this.floor_6)
            scene.remove(this.context_1)
            scene.remove(this.context_2)
            scene.remove(this.context_3)
            scene.remove(this.context_4)
            scene.remove(this.context_5)
            scene.remove(this.context_6)
          } else {
            this.isLoaded_1 = true
            scene.add(this.floor_1)
            scene.add(this.floor_2)
            scene.add(this.floor_3)
            scene.add(this.floor_4)
            scene.add(this.floor_5)
            scene.add(this.floor_6)
            scene.add(this.context_1)
            scene.add(this.context_2)
            scene.add(this.context_3)
            scene.add(this.context_4)
            scene.add(this.context_5)
            scene.add(this.context_6)
          }
          break
        case 11:
          if (this.isLoaded_11 === true) {
            this.isLoaded_11 = false
            scene.remove(this.floor_1)
            scene.remove(this.context_1)
          } else {
            this.isLoaded_11 = true
            scene.add(this.floor_1)
            scene.add(this.context_1)
          }
          break
        case 12:
          if (this.isLoaded_12 === true) {
            this.isLoaded_12 = false
            scene.remove(this.floor_2)
            scene.remove(this.context_2)
          } else {
            this.isLoaded_12 = true
            scene.add(this.floor_2)
            scene.add(this.context_2)
          }
          break
        case 13:
          if (this.isLoaded_13 === true) {
            this.isLoaded_13 = false
            scene.remove(this.floor_3)
            scene.remove(this.context_3)
          } else {
            this.isLoaded_13 = true
            scene.add(this.floor_3)
            scene.add(this.context_3)
          }
          break
        case 14:
          if (this.isLoaded_14 === true) {
            this.isLoaded_14 = false
            scene.remove(this.floor_4)
            scene.remove(this.context_4)
          } else {
            this.isLoaded_14 = true
            scene.add(this.floor_4)
            scene.add(this.context_4)
          }
          break
        case 15:
          if (this.isLoaded_15 === true) {
            this.isLoaded_15 = false
            scene.remove(this.floor_5)
            scene.remove(this.context_5)
          } else {
            this.isLoaded_15 = true
            scene.add(this.floor_5)
            scene.add(this.context_5)
          }
          break
        case 16:
          if (this.isLoaded_16 === true) {
            this.isLoaded_16 = false
            scene.remove(this.floor_6)
            scene.remove(this.context_6)
          } else {
            this.isLoaded_16 = true
            scene.add(this.floor_6)
            scene.add(this.context_6)
          }
          break
        case 101:
          if (this.isLoaded_101 === true) {
            this.isLoaded_101 = false
            scene.remove(this.floor_1)
          } else {
            this.isLoaded_101 = true
            scene.add(this.floor_1)
          }
          break
        case 102:
          if (this.isLoaded_102 === true) {
            this.isLoaded_102 = false
            scene.remove(this.context_1)
          } else {
            this.isLoaded_102 = true
            scene.add(this.context_1)
          }
          break
        case 103:
          if (this.isLoaded_103 === true) {
            this.isLoaded_103 = false
            scene.remove(this.floor_2)
          } else {
            this.isLoaded_103 = true
            scene.add(this.floor_2)
          }
          break
        case 104:
          if (this.isLoaded_104 === true) {
            this.isLoaded_104 = false
            scene.remove(this.context_2)
          } else {
            this.isLoaded_104 = true
            scene.add(this.context_2)
          }
          break
        case 105:
          if (this.isLoaded_105 === true) {
            this.isLoaded_105 = false
            scene.remove(this.floor_3)
          } else {
            this.isLoaded_105 = true
            scene.add(this.floor_5)
          }
          break
        case 106:
          if (this.isLoaded_106 === true) {
            this.isLoaded_106 = false
            scene.remove(this.context_3)
          } else {
            this.isLoaded_106 = true
            scene.add(this.context_3)
          }
          break
        case 107:
          if (this.isLoaded_107 === true) {
            this.isLoaded_107 = false
            scene.remove(this.floor_4)
          } else {
            this.isLoaded_107 = true
            scene.add(this.floor_4)
          }
          break
        case 108:
          if (this.isLoaded_108 === true) {
            this.isLoaded_108 = false
            scene.remove(this.context_4)
          } else {
            this.isLoaded_108 = true
            scene.add(this.context_4)
          }
          break
        case 109:
          if (this.isLoaded_109 === true) {
            this.isLoaded_109 = false
            scene.remove(this.floor_5)
          } else {
            this.isLoaded_109 = true
            scene.add(this.floor_5)
          }
          break
        case 110:
          if (this.isLoaded_110 === true) {
            this.isLoaded_110 = false
            scene.remove(this.context_5)
          } else {
            this.isLoaded_110 = true
            scene.add(this.context_5)
          }
          break
        case 111:
          if (this.isLoaded_111 === true) {
            this.isLoaded_111 = false
            scene.remove(this.floor_6)
          } else {
            this.isLoaded_111 = true
            scene.add(this.floor_6)
          }
          break
        case 112:
          if (this.isLoaded_112 === true) {
            this.isLoaded_112 = false
            scene.remove(this.context_6)
          } else {
            this.isLoaded_112 = true
            scene.add(this.context_6)
          }
          break
      }
    },
    // 初始化
    init () {
      // 创建场景对象Scene
      this.container = document.getElementById('container')
      this.container.style.height = window.innerHeight + 'px'
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xbfd1e5)

      // 创建渲染器对象
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.container.appendChild(this.renderer.domElement)

      // 相机设置
      const fov = 45
      const aspect = 2
      const near = 0.1
      const far = 100
      this.container = document.getElementById('container')
      this.camera = new THREE.PerspectiveCamera(
        fov, aspect, near, far
      )
      this.camera.position.set(15, 10, 20) // 设置相机位置

      // 光源设置
      // 点光源
      let point = new THREE.PointLight(0xffffff)
      point.position.set(400, 200, 300) // 点光源位置
      scene.add(point) // 点光源添加到场景中
      // 环境光
      let ambient = new THREE.AmbientLight(0x444444)
      scene.add(ambient)

      this.clock = new THREE.Clock()
      // onresize 事件会在窗口被调整大小时发生
      window.onresize = () => {
        // 重置渲染器输出画布canvas尺寸
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
        this.camera.aspect = window.innerWidth / window.innerHeight
        // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
        // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
        // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        this.camera.updateProjectionMatrix()
      }

      controls = new OrbitControls(this.camera, this.renderer.domElement)
      controls.target.set(5, 0, -10)
      controls.update()

      // 模型加载
      this.objectLoader()
    },
    // 动画
    animate () {
      requestAnimationFrame(this.animate)
      this.renderer.render(scene, this.camera)
    },
    // 模型加载
    objectLoader () {
      this.gltfLoader = new GLTFLoader()

      let url
      url = '/static/1楼墙体/4楼墙体.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.floor_1 = new THREE.Group()
        this.floor_1.add(obj)
      })
      url = '/static/1楼桌椅/1楼桌椅.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.context_1 = new THREE.Group()
        this.context_1.add(obj)
      })
      url = '/static/2楼墙体/2楼墙体.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.floor_2 = new THREE.Group()
        this.floor_2.add(obj)
      })
      url = '/static/2楼桌椅/2楼桌椅.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.context_2 = new THREE.Group()
        this.context_2.add(obj)
      })
      url = '/static/3楼墙体/3楼墙体.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.floor_3 = new THREE.Group()
        this.floor_3.add(obj)
      })
      url = '/static/3楼桌椅/3楼桌椅.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.context_3 = new THREE.Group()
        this.context_3.add(obj)
      })
      url = '/static/4楼墙体/4楼墙体.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.floor_4 = new THREE.Group()
        this.floor_4.add(obj)
      })
      url = '/static/4楼桌椅/4楼桌椅.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.context_4 = new THREE.Group()
        this.context_4.add(obj)
      })
      url = '/static/5楼墙体/5楼墙体.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.floor_5 = new THREE.Group()
        this.floor_5.add(obj)
      })
      url = '/static/5楼桌椅/5楼桌椅.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.context_5 = new THREE.Group()
        this.context_5.add(obj)
      })
      url = '/static/6楼墙体/6楼墙体.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.floor_6 = new THREE.Group()
        this.floor_6.add(obj)
      })
      url = '/static/6楼桌椅/6楼桌椅.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.context_6 = new THREE.Group()
        this.context_6.add(obj)
      })
    }
  }
}
</script>

<style>
#container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
