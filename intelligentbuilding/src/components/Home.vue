<template>
  <el-container>
    <el-main>
      <div id="container"></div>
    </el-main>
    <el-aside width="150">
      <el-tree :data="simpleData" show-checkbox default-expand-all node-key="id" ref="tree1" highlight-current
               :props="defaultProps" @check="handleTreeNodeClick">
      </el-tree>
      <el-tree :data="detailData" show-checkbox default-expand-all node-key="id" ref="tree2" highlight-current
               :props="defaultProps" @check="handleTreeNodeClick">
      </el-tree>
    </el-aside>
  </el-container>
</template>

<script>
import * as THREE from 'three/build/three.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// 场景和控制器
let scene = null
let controls = null
let camera = null

// 详细模型的楼板
// eslint-disable-next-line camelcase
let floor_1 = null
// eslint-disable-next-line camelcase
let floor_2 = null
// eslint-disable-next-line camelcase
let floor_3 = null
// eslint-disable-next-line camelcase
let floor_4 = null
// eslint-disable-next-line camelcase
let floor_5 = null
// eslint-disable-next-line camelcase
let floor_6 = null

// 详细模型的桌椅
// eslint-disable-next-line camelcase
let context_1 = null
// eslint-disable-next-line camelcase
let context_2 = null
// eslint-disable-next-line camelcase
let context_3 = null
// eslint-disable-next-line camelcase
let context_4 = null
// eslint-disable-next-line camelcase
let context_5 = null
// eslint-disable-next-line camelcase
let context_6 = null

export default {
  data () {
    return {
      // 树形组件
      simpleData: [{
        id: 0,
        label: '整体模型'
      }],
      detailData: [{
        id: 1,
        label: '详细模型',
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
      renderer: null,
      mesh: null,
      clock: null,
      // 模型组件

      // 判断加载
      isLoaded_0: false,
      isLoaded_1: false,
      isLoaded_11: false,
      isLoaded_12: false,
      isLoaded_13: false,
      isLoaded_14: false,
      isLoaded_15: false,
      isLoaded_16: false
    }
  },
  mounted () {
    this.init()
    this.animate()
  },
  methods: {
    // 选择状态置空
    resetChecked () {
      this.$refs.tree1.setCheckedKeys([])
      this.$refs.tree2.setCheckedKeys([])
    },
    setCheckedKeys (id) {
      this.$refs.tree1.setCheckedKeys([id])
      this.$refs.tree2.setCheckedKeys([id])
    },
    // 点击树节点事件处理
    handleTreeNodeClick (data, checked, deep) {
      // 模拟tree加载情况
      if (data.id === 0) {
        this.resetChecked()
        if (!this.isLoaded_0) this.setCheckedKeys(0)
        this.isLoaded_0 = !this.isLoaded_0
        if (this.isLoaded_0) {
          floor_1.visible = floor_2.visible = floor_3.visible = floor_4.visible = floor_5.visible = floor_6.visible = true
          context_1.visible = context_2.visible = context_3.visible = context_4.visible = context_5.visible = context_6.visible = false
        } else {
          floor_1.visible = floor_2.visible = floor_3.visible = floor_4.visible = floor_5.visible = floor_6.visible = false
          context_1.visible = context_2.visible = context_3.visible = context_4.visible = context_5.visible = context_6.visible = false
        }
        return
      } else {
        if (this.isLoaded_0) {
          this.resetChecked()
          this.isLoaded_0 = false
          this.setCheckedKeys(data.id)
          floor_1.visible = floor_2.visible = floor_3.visible = floor_4.visible = floor_5.visible = floor_6.visible = false
          context_1.visible = context_2.visible = context_3.visible = context_4.visible = context_5.visible = context_6.visible = false
        }
      }
      this.isLoaded_11 = !!(floor_1.visible && context_1.visible)
      this.isLoaded_12 = !!(floor_2.visible && context_2.visible)
      this.isLoaded_13 = !!(floor_3.visible && context_3.visible)
      this.isLoaded_14 = !!(floor_4.visible && context_4.visible)
      this.isLoaded_15 = !!(floor_5.visible && context_5.visible)
      this.isLoaded_16 = !!(floor_6.visible && context_6.visible)
      this.isLoaded_1 = !!(floor_1.visible && context_1.visible && floor_2.visible && context_2.visible &&
        floor_3.visible && context_3.visible && floor_4.visible && context_4.visible &&
        floor_5.visible && context_5.visible && floor_6.visible && context_6.visible)

      // 加载和删除模型
      switch (data.id) {
        case 1:
          this.isLoaded_1 = !this.isLoaded_1
          floor_1.visible = this.isLoaded_1
          context_1.visible = this.isLoaded_1
          floor_2.visible = this.isLoaded_1
          context_2.visible = this.isLoaded_1
          floor_3.visible = this.isLoaded_1
          context_3.visible = this.isLoaded_1
          floor_4.visible = this.isLoaded_1
          context_4.visible = this.isLoaded_1
          floor_5.visible = this.isLoaded_1
          context_5.visible = this.isLoaded_1
          floor_6.visible = this.isLoaded_1
          context_6.visible = this.isLoaded_1
          break
        case 11:
          this.isLoaded_11 = !this.isLoaded_11
          floor_1.visible = this.isLoaded_11
          context_1.visible = this.isLoaded_11
          break
        case 12:
          this.isLoaded_12 = !this.isLoaded_12
          floor_2.visible = this.isLoaded_12
          context_2.visible = this.isLoaded_12
          break
        case 13:
          this.isLoaded_13 = !this.isLoaded_13
          floor_3.visible = this.isLoaded_13
          context_3.visible = this.isLoaded_13
          break
        case 14:
          this.isLoaded_14 = !this.isLoaded_14
          floor_4.visible = this.isLoaded_14
          context_4.visible = this.isLoaded_14
          break
        case 15:
          this.isLoaded_15 = !this.isLoaded_15
          floor_5.visible = this.isLoaded_15
          context_5.visible = this.isLoaded_15
          break
        case 16:
          this.isLoaded_16 = !this.isLoaded_16
          floor_6.visible = this.isLoaded_16
          context_6.visible = this.isLoaded_16
          break
        case 101:
          floor_1.visible = !floor_1.visible
          break
        case 102:
          context_1.visible = !context_1.visible
          break
        case 103:
          floor_2.visible = !floor_2.visible
          break
        case 104:
          context_2.visible = !context_2.visible
          break
        case 105:
          floor_3.visible = !floor_3.visible
          break
        case 106:
          context_3.visible = !context_3.visible
          break
        case 107:
          floor_4.visible = !floor_4.visible
          break
        case 108:
          context_4.visible = !context_4.visible
          break
        case 109:
          floor_5.visible = !floor_5.visible
          break
        case 110:
          context_5.visible = !context_5.visible
          break
        case 111:
          floor_6.visible = !floor_6.visible
          break
        case 112:
          context_6.visible = !context_6.visible
          break
      }
    },
    // 初始化
    init () {
      function onMouseDblclick (event) {
        console.log((event.clientX / window.innerWidth) * 2 - 1)
        console.log(-(event.clientY / window.innerHeight) * 2 + 1)
      }

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
      const far = 50
      this.container = document.getElementById('container')
      camera = new THREE.PerspectiveCamera(
        fov, aspect, near, far
      )
      camera.position.set(20, 15, 20) // 设置相机位置
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
        camera.aspect = window.innerWidth / window.innerHeight
        // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
        // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
        // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        camera.updateProjectionMatrix()
      }
      controls = new OrbitControls(camera, this.renderer.domElement)
      controls.target.set(5, 0, -10)
      controls.update()

      // 模型加载
      this.objectLoader()

      // 三维坐标系
      const axesHelper = new THREE.AxesHelper(150)
      // 和网格模型Mesh一样，AxesHelper你也可以理解为一个模型对象，需要插入到场景中
      scene.add(axesHelper)
      // 事件绑定
      addEventListener('click', onMouseDblclick, false)
    },
    // 动画
    animate () {
      requestAnimationFrame(this.animate)
      this.renderer.render(scene, camera)
    },
    // 模型加载
    objectLoader () {
      this.gltfLoader = new GLTFLoader()
      let url
      url = '/static/1楼墙体/1楼墙体.gltf'
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        // eslint-disable-next-line camelcase
        floor_1 = new THREE.Group()
        floor_1.add(obj)
        scene.add(floor_1)
        floor_1.visible = false
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
        // eslint-disable-next-line camelcase
        context_1 = new THREE.Group()
        context_1.add(obj)
        scene.add(context_1)
        context_1.visible = false
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
        // eslint-disable-next-line camelcase
        floor_2 = new THREE.Group()
        floor_2.add(obj)
        scene.add(floor_2)
        floor_2.visible = false
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
        // eslint-disable-next-line camelcase
        context_2 = new THREE.Group()
        context_2.add(obj)
        scene.add(context_2)
        context_2.visible = false
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
        // eslint-disable-next-line camelcase
        floor_3 = new THREE.Group()
        floor_3.add(obj)
        scene.add(floor_3)
        floor_3.visible = false
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
        // eslint-disable-next-line camelcase
        context_3 = new THREE.Group()
        context_3.add(obj)
        scene.add(context_3)
        context_3.visible = false
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
        // eslint-disable-next-line camelcase
        floor_4 = new THREE.Group()
        floor_4.add(obj)
        scene.add(floor_4)
        floor_4.visible = false
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
        // eslint-disable-next-line camelcase
        context_4 = new THREE.Group()
        context_4.add(obj)
        scene.add(context_4)
        context_4.visible = false
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
        // eslint-disable-next-line camelcase
        floor_5 = new THREE.Group()
        floor_5.add(obj)
        scene.add(floor_5)
        floor_5.visible = false
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
        // eslint-disable-next-line camelcase
        context_5 = new THREE.Group()
        context_5.add(obj)
        scene.add(context_5)
        context_5.visible = false
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
        // eslint-disable-next-line camelcase
        floor_6 = new THREE.Group()
        floor_6.add(obj)
        scene.add(floor_6)
        floor_6.visible = false
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
        // eslint-disable-next-line camelcase
        context_6 = new THREE.Group()
        context_6.add(obj)
        scene.add(context_6)
        context_6.visible = false
      })
    }
  }
}
</script>

<style>
#container {
  position: absolute;
  right: 0;
  width: 80%;
}

el-container {
  width: 100%;
  height: 100%;
}
</style>
