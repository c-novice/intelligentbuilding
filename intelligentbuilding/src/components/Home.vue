<template>
  <el-container>
    <el-main>
      <div id="container"></div>
    </el-main>
    <el-aside width='150px'>
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
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'

// 场景和控制器
let scene = null
let controls = null
let camera = null
// 详细模型的楼板
let floor = new Array(10)
// 详细模型的桌椅
let context = new Array(10)
// 漫游模式
let tweens = new Array(100)
let positions = new Array(100)
// eslint-disable-next-line no-unused-vars
let centers = new Array(10)

export default {
  data () {
    return {
      // 树形组件
      simpleData: [{
        id: 0,
        label: '整体模型',
        children: [{ id: 200, label: '整体漫游' }]
      }],
      detailData: [{
        id: 1,
        label: '详细模型',
        children: [
          {
            id: 11,
            label: '1L',
            children: [{ id: 101, label: '1L墙体' }, { id: 102, label: '1L桌椅' }, { id: 201, label: '1L漫游' }]
          },
          {
            id: 12,
            label: '2L',
            children: [{ id: 103, label: '2L墙体' }, { id: 104, label: '2L桌椅' }, { id: 202, label: '2L漫游' }]
          },
          {
            id: 13,
            label: '3L',
            children: [{ id: 105, label: '3L墙体' }, { id: 106, label: '3L桌椅' }, { id: 203, label: '3L漫游' }]
          },
          {
            id: 14,
            label: '4L',
            children: [{ id: 107, label: '4L墙体' }, { id: 108, label: '4L桌椅' }, { id: 204, label: '4L漫游' }]
          },
          {
            id: 15,
            label: '5L',
            children: [{ id: 109, label: '5L墙体' }, { id: 110, label: '5L桌椅' }, { id: 205, label: '5L漫游' }]
          },
          {
            id: 16,
            label: '6L',
            children: [{ id: 111, label: '6L墙体' }, { id: 112, label: '6L桌椅' }, { id: 206, label: '6L漫游' }]
          }
        ]
      }],
      defaultProps: {
        children: 'children',
        label:
          'label'
      },
      // 场景组件
      renderer: null,
      mesh: null,
      clock: null,
      // 判断加载
      isLoaded_0: false,
      isLoaded_1: false,
      isLoaded_11: false,
      isLoaded_12: false,
      isLoaded_13: false,
      isLoaded_14: false,
      isLoaded_15: false,
      isLoaded_16: false,
      // 判断动画
      isTween_0: false,
      isTween_1: false,
      isTween_2: false,
      isTween_3: false,
      isTween_4: false,
      isTween_5: false,
      isTween_6: false
    }
  },
  mounted () {
    this.init()
    this.animate()
  },
  methods: {
    // 菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
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
    handleTreeNodeClick (data) {
      // 模拟tree加载情况
      if (data.id === 0) {
        this.resetChecked()
        if (!this.isLoaded_0) this.setCheckedKeys(0)
        this.isLoaded_0 = !this.isLoaded_0
        if (this.isLoaded_0) {
          floor[1].visible = floor[2].visible = floor[3].visible = floor[4].visible = floor[5].visible = floor[6].visible = true
          context[1].visible = context[2].visible = context[3].visible = context[4].visible = context[5].visible = context[6].visible = false
        } else {
          floor[1].visible = floor[2].visible = floor[3].visible = floor[4].visible = floor[5].visible = floor[6].visible = false
          context[1].visible = context[2].visible = context[3].visible = context[4].visible = context[5].visible = context[6].visible = false
        }
        return
      } else {
        if (this.isLoaded_0) {
          this.resetChecked()
          this.isLoaded_0 = false
          this.setCheckedKeys(data.id)
          floor[1].visible = floor[2].visible = floor[3].visible = floor[4].visible = floor[5].visible = floor[6].visible = false
          context[1].visible = context[2].visible = context[3].visible = context[4].visible = context[5].visible = context[6].visible = false
        }
      }
      this.isLoaded_11 = !!(floor[1].visible && context[1].visible)
      this.isLoaded_12 = !!(floor[2].visible && context[2].visible)
      this.isLoaded_13 = !!(floor[3].visible && context[3].visible)
      this.isLoaded_14 = !!(floor[4].visible && context[4].visible)
      this.isLoaded_15 = !!(floor[5].visible && context[5].visible)
      this.isLoaded_16 = !!(floor[6].visible && context[6].visible)
      this.isLoaded_1 = !!(floor[1].visible && context[1].visible && floor[2].visible && context[2].visible &&
        floor[3].visible && context[3].visible && floor[4].visible && context[4].visible &&
        floor[5].visible && context[5].visible && floor[6].visible && context[6].visible)
      // 加载和删除模型
      switch (data.id) {
        case 1:
          this.isLoaded_1 = !this.isLoaded_1
          floor[1].visible = this.isLoaded_1
          context[1].visible = this.isLoaded_1
          floor[2].visible = this.isLoaded_1
          context[2].visible = this.isLoaded_1
          floor[3].visible = this.isLoaded_1
          context[3].visible = this.isLoaded_1
          floor[4].visible = this.isLoaded_1
          context[4].visible = this.isLoaded_1
          floor[5].visible = this.isLoaded_1
          context[5].visible = this.isLoaded_1
          floor[6].visible = this.isLoaded_1
          context[6].visible = this.isLoaded_1
          break
        case 11:
          this.isLoaded_11 = !this.isLoaded_11
          floor[1].visible = this.isLoaded_11
          context[1].visible = this.isLoaded_11
          break
        case 12:
          this.isLoaded_12 = !this.isLoaded_12
          floor[2].visible = this.isLoaded_12
          context[2].visible = this.isLoaded_12
          break
        case 13:
          this.isLoaded_13 = !this.isLoaded_13
          floor[3].visible = this.isLoaded_13
          context[3].visible = this.isLoaded_13
          break
        case 14:
          this.isLoaded_14 = !this.isLoaded_14
          floor[4].visible = this.isLoaded_14
          context[4].visible = this.isLoaded_14
          break
        case 15:
          this.isLoaded_15 = !this.isLoaded_15
          floor[5].visible = this.isLoaded_15
          context[5].visible = this.isLoaded_15
          break
        case 16:
          this.isLoaded_16 = !this.isLoaded_16
          floor[6].visible = this.isLoaded_16
          context[6].visible = this.isLoaded_16
          break
        case 101:
          floor[1].visible = !floor[1].visible
          break
        case 102:
          context[1].visible = !context[1].visible
          break
        case 103:
          floor[2].visible = !floor[2].visible
          break
        case 104:
          context[2].visible = !context[2].visible
          break
        case 105:
          floor[3].visible = !floor[3].visible
          break
        case 106:
          context[3].visible = !context[3].visible
          break
        case 107:
          floor[4].visible = !floor[4].visible
          break
        case 108:
          context[4].visible = !context[4].visible
          break
        case 109:
          floor[5].visible = !floor[5].visible
          break
        case 110:
          context[5].visible = !context[5].visible
          break
        case 111:
          floor[6].visible = !floor[6].visible
          break
        case 112:
          context[6].visible = !context[6].visible
          break
        default:
          this.tweenSolve(data.id)
      }
    },
    // 初始化
    async init () {
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
      camera.position.set(25, 15, 15) // 设置相机位置
      camera.lookAt(0, 0, 0)
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
        // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        camera.updateProjectionMatrix()
      }
      controls = new OrbitControls(camera, this.renderer.domElement)
      controls.target.set(5, 0, -10)
      controls.update()
      // 模型加载
      this.objectLoader('./static/1楼墙体/1楼墙体.gltf', 'floor', 1)
      this.objectLoader('./static/2楼墙体/2楼墙体.gltf', 'floor', 2)
      this.objectLoader('./static/3楼墙体/3楼墙体.gltf', 'floor', 3)
      this.objectLoader('./static/4楼墙体/4楼墙体.gltf', 'floor', 4)
      this.objectLoader('./static/5楼墙体/5楼墙体.gltf', 'floor', 5)
      this.objectLoader('./static/6楼墙体/6楼墙体.gltf', 'floor', 6)
      this.objectLoader('./static/1楼桌椅/1楼桌椅.gltf', 'context', 1)
      this.objectLoader('./static/2楼桌椅/2楼桌椅.gltf', 'context', 2)
      this.objectLoader('./static/3楼桌椅/3楼桌椅.gltf', 'context', 3)
      this.objectLoader('./static/4楼桌椅/4楼桌椅.gltf', 'context', 4)
      this.objectLoader('./static/5楼桌椅/5楼桌椅.gltf', 'context', 5)
      this.objectLoader('./static/6楼桌椅/6楼桌椅.gltf', 'context', 6)
      console.log('load successfully')
      // 漫游数据
      // 位置
      // 整体
      positions[0] = { px: 20, py: 15, pz: 10 }
      positions[1] = { px: 25, pz: -22, py: 10 }
      positions[2] = { px: -13, pz: -22, py: 10 }
      positions[3] = { px: -16, pz: 10, py: 10 }
      // 1L
      positions[4] = { px: 20, py: 15, pz: 10 }
      positions[5] = { px: 25, pz: -22, py: 10 }
      positions[6] = { px: -13, pz: -22, py: 10 }
      positions[7] = { px: -16, pz: 10, py: 10 }
      // 2L
      positions[8] = { px: 20, py: 15, pz: 10 }
      positions[9] = { px: 25, pz: -22, py: 10 }
      positions[10] = { px: -13, pz: -22, py: 10 }
      positions[11] = { px: -16, pz: 10, py: 10 }
      // 3L
      positions[12] = { px: 20, py: 15, pz: 10 }
      positions[13] = { px: 25, pz: -22, py: 10 }
      positions[14] = { px: -13, pz: -22, py: 10 }
      positions[15] = { px: -16, pz: 10, py: 10 }
      // 4L
      positions[16] = { px: 20, py: 15, pz: 10 }
      positions[17] = { px: 25, pz: -22, py: 10 }
      positions[18] = { px: -13, pz: -22, py: 10 }
      positions[19] = { px: -16, pz: 10, py: 10 }
      // 5L
      positions[20] = { px: 20, py: 15, pz: 10 }
      positions[21] = { px: 25, pz: -22, py: 10 }
      positions[22] = { px: -13, pz: -22, py: 10 }
      positions[23] = { px: -16, pz: 10, py: 10 }
      // 6L
      positions[24] = { px: 20, py: 15, pz: 10 }
      positions[25] = { px: 25, pz: -22, py: 10 }
      positions[26] = { px: -13, pz: -22, py: 10 }
      positions[27] = { px: -16, pz: 10, py: 10 }
      // 动画
      for (let i = 0; i <= 27; ++i) {
        tweens[i] = new TWEEN.Tween(positions[i]).to(positions[(i + 1) % 4 === 0 ? i - 3 : i + 1], 6000)
          .onUpdate(function (object) {
            camera.position.x = object.px
            camera.position.z = object.pz
            camera.position.y = object.py
            camera.lookAt(6.5, 2, -6)
          })
        tweens[i].easing(TWEEN.Easing.Quadratic.Out)
      }
      for (let i = 0; i <= 27; ++i) { tweens[i].chain(tweens[(i + 1) % 4 === 0 ? i - 3 : i + 1]) }
    },
    // 更新
    animate () {
      TWEEN.update()
      requestAnimationFrame(this.animate)
      this.renderer.render(scene, camera)
    },
    // 模型加载
    objectLoader (url, type, id) {
      this.gltfLoader = new GLTFLoader()
      this.gltfLoader.load(url, (gltf) => {
        const obj = gltf.scene
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = 0
        obj.scale.x = 0.2
        obj.scale.y = 0.2
        obj.scale.z = 0.2
        // eslint-disable-next-line camelcase
        if (type === 'floor') {
          floor[id] = new THREE.Group()
          floor[id].add(obj)
          scene.add(floor[id])
          floor[id].visible = false
        } else if (type === 'context') {
          context[id] = new THREE.Group()
          context[id].add(obj)
          scene.add(context[id])
          context[id].visible = false
        }
      })
    },
    // 动画处理
    tweenSolve (id) {
      floor[1].visible = floor[2].visible = floor[3].visible = floor[4].visible = floor[5].visible = floor[6].visible = false
      context[1].visible = context[2].visible = context[3].visible = context[4].visible = context[5].visible = context[6].visible = false
      switch (id) {
        case 200:
          this.isTween_0 = !this.isTween_0
          if (this.isTween_0) {
            console.log(tweens[0])
            floor[1].visible = floor[2].visible = floor[3].visible = floor[4].visible = floor[5].visible = floor[6].visible = true
            tweens[0].start()
            console.log('why')
          } else {
            tweens[0].stop()
          }
          break
        case 201:
          this.isTween_1 = !this.isTween_1
          if (this.isTween_1) {
            floor[1].visible = context[1].visible = true
            tweens[4].start()
          } else {
            tweens[4].stop()
          }
          break
        case 202:
          this.isTween_2 = !this.isTween_2
          if (this.isTween_2) {
            floor[2].visible = context[2].visible = true
            tweens[8].start()
          } else {
            tweens[8].stop()
          }
          break
        case 203:
          this.isTween_3 = !this.isTween_3
          if (this.isTween_3) {
            floor[3].visible = context[3].visible = true
            tweens[12].start()
          } else {
            tweens[12].stop()
          }
          break
        case 204:
          this.isTween_4 = !this.isTween_4
          if (this.isTween_4) {
            floor[4].visible = context[4].visible = true
            tweens[16].start()
          } else {
            tweens[16].stop()
          }
          break
        case 205:
          this.isTween_5 = !this.isTween_5
          if (this.isTween_5) {
            floor[5].visible = context[5].visible = true
            tweens[20].start()
          } else {
            tweens[20].stop()
          }
          break
        case 206:
          this.isTween_6 = !this.isTween_6
          if (this.isTween_6) {
            floor[6].visible = context[6].visible = true
            tweens[24].start()
          } else {
            tweens[24].stop()
          }
          break
      }
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
