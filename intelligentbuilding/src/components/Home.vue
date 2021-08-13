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

export default {
  data () {
    return {
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      group1: null,
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null,
      clock: null
    }
  },
  mounted () {
    this.init()
    this.animate()
  },
  methods: {
    // 点击树节点事件处理
    handleTreeNodeClick (data, node, elem) {
      this.scene.remove(this.group1)
      for (const sceneKey in this.scene) {
        console.log(sceneKey)
      }
    },
    getCheckedNodes () {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    getCheckedKeys () {
      console.log(this.$refs.tree.getCheckedKeys())
    },
    setCheckedNodes () {
      this.$refs.tree.setCheckedNodes([{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 9,
        label: '三级 1-1-1'
      }])
    },
    setCheckedKeys () {
      this.$refs.tree.setCheckedKeys([3])
    },
    resetChecked () {
      this.$refs.tree.setCheckedKeys([])
    },
    // 初始化
    init () {
      // 创建场景对象Scene
      this.container = document.getElementById('container')
      this.container.style.height = window.innerHeight + 'px'
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xbfd1e5)

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
      this.scene.add(point) // 点光源添加到场景中
      // 环境光
      let ambient = new THREE.AmbientLight(0x444444)
      this.scene.add(ambient)

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

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.target.set(5, 0, -10)
      this.controls.update()

      // 模型加载
      this.objectLoader('/static/4楼墙体/4楼墙体.gltf')
    },
    // 动画
    animate () {
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    },
    // 模型加载
    objectLoader (url) {
      this.gltfLoader = new GLTFLoader()
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        this.group1 = new THREE.Group()
        this.group1.add(obj)
        this.scene.add(this.group1)
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
