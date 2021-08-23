<template>
  <el-container>
    <el-aside>
      <el-switch v-model="switchRoaming" :disabled="!ableRoaming" active-text="漫游模式" inactive-text=" "
                 @change="roamingChange"></el-switch>
      <el-switch v-model="switchPatrol" :disabled="!ablePatrol" active-text="楼层巡视" inactive-text=" "
                 @change="patrolChange"></el-switch>
      <br><br>
      <el-tree :data="simpleData" show-checkbox default-expand-all node-key="id" ref="tree1" highlight-current
               :props="defaultProps" @check="handleTreeNodeClick">
      </el-tree>
      <el-tree :data="detailData" show-checkbox default-expand-all node-key="id" ref="tree2" highlight-current
               :props="defaultProps" @check="handleTreeNodeClick">
      </el-tree>
    </el-aside>
    <el-main>
      <div id="container"></div>
    </el-main>
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
// 漫游和巡视模式
let tweens = new Array(1000)
let positions = new Array(1000)

export default {
  data () {
    return {
      // 树形组件控制
      ableTree: false,
      // 漫游与巡视按钮
      ableRoaming: false,
      switchRoaming: false,
      ablePatrol: false,
      switchPatrol: false,
      // 树形组件
      simpleData: [{ id: 0, label: '整体模型' }],
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
        ],
        disabled: this.ableTree
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
      isLoaded: Array.apply(null, Array(20)).map(() => false)
    }
  },
  mounted () {
    this.init()
    this.animate()
  },
  methods: {
    // 漫游
    roamingChange (state) {
      this.switchRoaming = !!this.switchRoaming
      if (state) { // 执行漫游
        // 设置禁用关系
        this.ablePatrol = false
        this.ableTree = true
        // 获取当前的选中楼层
        let checked = null
        if (this.isLoaded[0]) {
          checked = 0
        } else {
          for (let i = 11; i <= 16; i++) {
            if (this.isLoaded[i]) {
              checked = i
              break
            }
          }
        }
        // 执行漫游
        if (checked === null) console.assert('roaming bug')
        else {
          tweens[checked % 10 * 10].start()
          // 监控鼠标单击
          let cur = 1
          document.onclick = () => {
            if (!this.switchRoaming) return
            cur = (cur + 1) % 2
            if (cur === 0) {
              // 提示进入漫游
              this.$message.success('您已进入漫游模式，点击触摸屏会暂停15s')
              tweens[checked % 10 * 10].start()
            } else if (cur === 1) {
              let count = 0
              let myVar = setInterval(() => {
                count++
                if (count === 4) {
                  tweens[checked % 10 * 10].start()
                  clearInterval(myVar)
                  cur = 0
                }
              }, 1000)
              for (let i = 0; i < 70; ++i) {
                if (tweens[i] != null) tweens[i].stop()
              }
            }
          }
        }
      } else { // 停止漫游
        this.$message.success('您已退出漫游模式')
        // 解除禁用关系
        this.ablePatrol = true
        this.ableTree = false
        for (let i = 0; i < 70; ++i) {
          if (tweens[i] != null) tweens[i].stop()
        }
      }
    },
    // 巡视
    patrolChange (state) {
      this.switchPatrol = !this.switchPatrol
      if (state) { // 执行巡视
        // 获取当前的选中楼层
        let checked = null
        for (let i = 11; i <= 16; i++) {
          if (this.isLoaded[i]) {
            checked = i
            break
          }
        }
        // 执行漫游
        if (checked === null) console.assert('patrol bug')
        else {
          tweens[checked % 10 * 100].start()
        }
      } else { // 停止巡视
        for (let i = 100; i < 700; ++i) {
          tweens[i].stop()
        }
      }
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
      // 强制退出漫游和巡视模式
      if (this.switchRoaming) {
        this.roamingChange(false)
        this.switchRoaming = false
      } else if (this.switchPatrol) {
        this.patrolChange(false)
        this.switchPatrol = false
      }
      // 模拟tree加载情况
      // 模型加载模块
      if (data.id === 0) { // 整体模型
        this.resetChecked()
        if (!this.isLoaded[0]) this.setCheckedKeys(0)
        this.isLoaded[0] = !this.isLoaded[0]
        if (this.isLoaded[0]) {
          floor[1].visible = floor[2].visible = floor[3].visible = floor[4].visible = floor[5].visible = floor[6].visible = true
          context[1].visible = context[2].visible = context[3].visible = context[4].visible = context[5].visible = context[6].visible = false
        } else {
          floor[1].visible = floor[2].visible = floor[3].visible = floor[4].visible = floor[5].visible = floor[6].visible = false
          context[1].visible = context[2].visible = context[3].visible = context[4].visible = context[5].visible = context[6].visible = false
        }
      } else { // 详细模型
        if (this.isLoaded[0]) {
          this.resetChecked()
          this.isLoaded[0] = false
          this.setCheckedKeys(data.id)
          floor[1].visible = floor[2].visible = floor[3].visible = floor[4].visible = floor[5].visible = floor[6].visible = false
          context[1].visible = context[2].visible = context[3].visible = context[4].visible = context[5].visible = context[6].visible = false
        }
      }
      // 楼层状态更新
      this.isLoaded[11] = floor[1].visible && context[1].visible
      this.isLoaded[12] = floor[2].visible && context[2].visible
      this.isLoaded[13] = floor[3].visible && context[3].visible
      this.isLoaded[14] = floor[4].visible && context[4].visible
      this.isLoaded[15] = floor[5].visible && context[5].visible
      this.isLoaded[16] = floor[6].visible && context[6].visible
      this.isLoaded[1] = floor[1].visible && context[1].visible && floor[2].visible && context[2].visible &&
        floor[3].visible && context[3].visible && floor[4].visible && context[4].visible &&
        floor[5].visible && context[5].visible && floor[6].visible && context[6].visible
      // 加载和删除模型
      switch (data.id) {
        case 1:
          this.isLoaded[1] = !this.isLoaded[1]
          floor[1].visible = floor[2].visible = floor[3].visible = floor[4].visible = floor[5].visible = floor[6].visible = this.isLoaded[1]
          context[1].visible = context[2].visible = context[3].visible = context[4].visible = context[5].visible = context[6].visible = this.isLoaded[1]
          break
        case 11:
          this.isLoaded[11] = !this.isLoaded[11]
          floor[1].visible = context[1].visible = this.isLoaded[11]
          break
        case 12:
          this.isLoaded[12] = !this.isLoaded[12]
          floor[2].visible = context[2].visible = this.isLoaded[12]
          break
        case 13:
          this.isLoaded[13] = !this.isLoaded[13]
          floor[3].visible = context[3].visible = this.isLoaded[13]
          break
        case 14:
          this.isLoaded[14] = !this.isLoaded[14]
          floor[4].visible = context[4].visible = this.isLoaded[14]
          break
        case 15:
          this.isLoaded[15] = !this.isLoaded[15]
          floor[5].visible = context[5].visible = this.isLoaded[15]
          break
        case 16:
          this.isLoaded[16] = !this.isLoaded[16]
          floor[6].visible = context[6].visible = this.isLoaded[16]
          break
        case 101:
          floor[1].visible = !floor[1].visible
          if (floor[1].visible === context[1].visible) this.isLoaded[11] = floor[1].visible
          break
        case 102:
          context[1].visible = !context[1].visible
          if (floor[1].visible === context[1].visible) this.isLoaded[11] = floor[1].visible
          break
        case 103:
          floor[2].visible = !floor[2].visible
          if (floor[2].visible === context[2].visible) this.isLoaded[12] = floor[2].visible
          break
        case 104:
          context[2].visible = !context[2].visible
          if (floor[2].visible === context[2].visible) this.isLoaded[12] = floor[2].visible
          break
        case 105:
          floor[3].visible = !floor[3].visible
          if (floor[3].visible === context[3].visible) this.isLoaded[13] = floor[3].visible
          break
        case 106:
          context[3].visible = !context[3].visible
          if (floor[3].visible === context[3].visible) this.isLoaded[13] = floor[3].visible
          break
        case 107:
          floor[4].visible = !floor[4].visible
          if (floor[4].visible === context[4].visible) this.isLoaded[14] = floor[4].visible
          break
        case 108:
          context[4].visible = !context[4].visible
          if (floor[4].visible === context[4].visible) this.isLoaded[14] = floor[4].visible
          break
        case 109:
          floor[5].visible = !floor[5].visible
          if (floor[5].visible === context[5].visible) this.isLoaded[15] = floor[5].visible
          break
        case 110:
          context[5].visible = !context[5].visible
          if (floor[5].visible === context[5].visible) this.isLoaded[15] = floor[5].visible
          break
        case 111:
          floor[6].visible = !floor[6].visible
          if (floor[6].visible === context[6].visible) this.isLoaded[16] = floor[6].visible
          break
        case 112:
          context[6].visible = !context[6].visible
          if (floor[6].visible === context[6].visible) this.isLoaded[16] = floor[6].visible
          break
      }
      // 漫游和巡视模块
      let countLoad = 0
      let isConsistSingle = false
      for (let i = 11; i <= 16; ++i) {
        if (this.isLoaded[i]) countLoad++
        if (context[i % 10].visible !== floor[i % 10].visible) isConsistSingle = true
      }
      console.log(countLoad, isConsistSingle)
      this.ableRoaming = (!isConsistSingle && countLoad === 1) || this.isLoaded[0]
      this.ablePatrol = !isConsistSingle && (countLoad === 1)
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
      const axesHelper = new THREE.AxesHelper(150)
      scene.add(axesHelper)
      // 漫游数据
      // 位置
      // 整体
      positions[0] = { px: 20, py: 10, pz: 10 }
      positions[1] = { px: 25, pz: -22, py: 10 }
      positions[2] = { px: -13, pz: -22, py: 10 }
      positions[3] = { px: -16, pz: 10, py: 10 }
      // 1L
      positions[10] = { px: 20, py: 5, pz: 10 }
      positions[11] = { px: 25, pz: -22, py: 5 }
      positions[12] = { px: -13, pz: -22, py: 5 }
      positions[13] = { px: -16, pz: 10, py: 5 }
      // 2L
      positions[20] = { px: 20, py: 6, pz: 10 }
      positions[21] = { px: 25, pz: -22, py: 6 }
      positions[22] = { px: -13, pz: -22, py: 6 }
      positions[23] = { px: -16, pz: 10, py: 6 }
      // 3L
      positions[30] = { px: 20, py: 7, pz: 10 }
      positions[31] = { px: 25, pz: -22, py: 7 }
      positions[32] = { px: -13, pz: -22, py: 7 }
      positions[33] = { px: -16, pz: 10, py: 7 }
      // 4L
      positions[40] = { px: 20, py: 8, pz: 10 }
      positions[41] = { px: 25, pz: -22, py: 8 }
      positions[42] = { px: -13, pz: -22, py: 8 }
      positions[43] = { px: -16, pz: 10, py: 8 }
      // 5L
      positions[50] = { px: 20, py: 9, pz: 10 }
      positions[51] = { px: 25, pz: -22, py: 9 }
      positions[52] = { px: -13, pz: -22, py: 9 }
      positions[53] = { px: -16, pz: 10, py: 9 }
      // 6L
      positions[60] = { px: 20, py: 10, pz: 10 }
      positions[61] = { px: 25, pz: -22, py: 10 }
      positions[62] = { px: -13, pz: -22, py: 10 }
      positions[63] = { px: -16, pz: 10, py: 10 }
      // 动画
      for (let i = 0; i <= 6; ++i) {
        for (let j = 0; j <= 3; ++j) {
          tweens[i * 10 + j] = new TWEEN.Tween(positions[i * 10 + j]).to(positions[(j + 1) % 4 === 0 ? i * 10 + j - 3 : i * 10 + j + 1], 5500)
            .onUpdate(function (object) {
              camera.position.x = object.px
              camera.position.z = object.pz
              camera.position.y = object.py
              switch (i) {
                case 0:
                  camera.lookAt(6.5, 1, -6)
                  break
                case 1:
                  camera.lookAt(6.5, 2, -6)
                  break
                case 2:
                  camera.lookAt(6.5, 2, -6)
                  break
                case 3:
                  camera.lookAt(6.5, 3, -6)
                  break
                case 4:
                  camera.lookAt(6.5, 4, -6)
                  break
                case 5:
                  camera.lookAt(6.5, 4, -6)
                  break
                case 6:
                  camera.lookAt(6.5, 5, -6)
                  break
              }
            })
          tweens[i * 10 + j].easing(TWEEN.Easing.Quadratic.Out)
        }
      }
      // 连接
      for (let i = 0; i <= 6; ++i) {
        for (let j = 0; j <= 3; ++j) {
          tweens[i * 10 + j].chain(tweens[(j + 1) % 4 === 0 ? i * 10 + j - 3 : i * 10 + j + 1])
        }
      }
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
</style>
