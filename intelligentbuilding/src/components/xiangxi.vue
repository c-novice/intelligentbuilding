<template>
  <el-container>
    <el-header class="head" height="35px">
      <el-image style="height: 65%" :src="require('../assets/返回.png')" @click="goBack"></el-image>
      <div  @click="goBack" style="margin-right: 20px;margin-left: 5px">返回</div>
      <el-switch v-model="switchRoaming" :disabled="!ableRoaming" active-text="漫游模式" inactive-text=" "
                 @change="roamingChange"></el-switch>
    </el-header>
    <div id="container"></div>
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
      // 漫游与巡视按钮
      ableRoaming: true,
      switchRoaming: false,
      ablePatrol: true,
      switchPatrol: false
    }
  },
  mounted () {
    this.init()
    this.animate()
  },
  destroyed () {
    this.ableRoaming = true
    this.switchRoaming = false
    this.ablePatrol = true
    this.switchPatrol = false
    for (let i = 0; i < 70; ++i) {
      if (tweens[i] != null) tweens[i].stop()
    }
    for (let i = 100; i < 700; ++i) {
      if (tweens[i] != null) tweens[i].stop()
    }
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'home' })
    },
    // 漫游
    roamingChange (state) {
      this.switchRoaming = !!this.switchRoaming
      if (state) { // 执行漫游
        // 设置禁用关系
        this.ablePatrol = false
        this.ableTree = true
        // 获取当前的选中楼层
        let checked = 0
        // 执行漫游
        tweens[checked % 10 * 10].start()
        this.$message.success('您已进入漫游模式')
        // 监控鼠标单击
        let cur = 1
        document.onclick = () => {
          if (this.switchRoaming) {
            cur = (cur + 1) % 2
            if (cur === 0) {
              // 提示进入漫游
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
      this.switchPatrol = !!this.switchPatrol
      if (state) { // 执行巡视
        // 设置禁用关系
        this.ableRoaming = false
        this.ableTree = true
        // 获取当前的选中楼层
        let checked = null
        for (let i = 11; i <= 16; i++) {
          if (this.isLoaded[i]) {
            checked = i
            break
          }
        }
        // 执行巡视
        tweens[checked % 10 * 100].start()
        // 监控鼠标单击
        let cur = 1
        document.onclick = () => {
          if (this.switchPatrol) {
            cur = (cur + 1) % 2
            if (cur === 0) {
              // 提示进入巡视
              this.$message.success('您已进入巡视模式，点击触摸屏会暂停15s')
              tweens[checked % 10 * 100].start()
            } else if (cur === 1) {
              let count = 0
              let myVar = setInterval(() => {
                count++
                if (count === 4) {
                  tweens[checked % 10 * 100].start()
                  clearInterval(myVar)
                  cur = 0
                }
              }, 1000)
              for (let i = 100; i < 700; ++i) {
                if (tweens[i] != null) tweens[i].stop()
              }
            }
          }
        }
      } else { // 停止巡视
        this.$message.success('您已退出巡视模式')
        // 解除禁用关系
        this.ableRoaming = true
        this.ableTree = false
        for (let i = 100; i < 700; ++i) {
          if (tweens[i] != null) tweens[i].stop()
        }
      }
    },
    // 初始化
    init () {
      // 创建场景对象Scene
      this.container = document.getElementById('container')
      this.container.style.height = window.innerHeight + 'px'
      scene = new THREE.Scene()
      // 创建渲染器对象
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
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
      for (let i = 1; i <= 6; ++i) {
        this.objectLoader('./static/' + i.toString() + 'L/' + i.toString() + 'L.gltf', 'floor', i)
      }
      // 漫游数据
      // 位置
      // 整体
      positions[0] = { px: 20, py: 10, pz: 10 }
      positions[1] = { px: 25, pz: -22, py: 10 }
      positions[2] = { px: -13, pz: -22, py: 10 }
      positions[3] = { px: -16, pz: 10, py: 10 }
      positions[4] = { px: 20, py: 10, pz: 10 }
      // 1L
      positions[10] = { px: 20, py: 5, pz: 10 }
      positions[11] = { px: 25, pz: -22, py: 5 }
      positions[12] = { px: -13, pz: -22, py: 5 }
      positions[13] = { px: -16, pz: 10, py: 5 }
      positions[14] = { px: 20, py: 5, pz: 10 }
      // 2L
      positions[20] = { px: 20, py: 6, pz: 10 }
      positions[21] = { px: 25, pz: -22, py: 6 }
      positions[22] = { px: -13, pz: -22, py: 6 }
      positions[23] = { px: -16, pz: 10, py: 6 }
      positions[24] = { px: 20, py: 6, pz: 10 }
      // 3L
      positions[30] = { px: 20, py: 7, pz: 10 }
      positions[31] = { px: 25, pz: -22, py: 7 }
      positions[32] = { px: -13, pz: -22, py: 7 }
      positions[33] = { px: -16, pz: 10, py: 7 }
      positions[34] = { px: 20, py: 7, pz: 10 }
      // 4L
      positions[40] = { px: 20, py: 8, pz: 10 }
      positions[41] = { px: 25, pz: -22, py: 8 }
      positions[42] = { px: -13, pz: -22, py: 8 }
      positions[43] = { px: -16, pz: 10, py: 8 }
      positions[44] = { px: 20, py: 8, pz: 10 }
      // 5L
      positions[50] = { px: 20, py: 9, pz: 10 }
      positions[51] = { px: 25, pz: -22, py: 9 }
      positions[52] = { px: -13, pz: -22, py: 9 }
      positions[53] = { px: -16, pz: 10, py: 9 }
      positions[54] = { px: 20, py: 9, pz: 10 }
      // 6L
      positions[60] = { px: 20, py: 10, pz: 10 }
      positions[61] = { px: 25, pz: -22, py: 10 }
      positions[62] = { px: -13, pz: -22, py: 10 }
      positions[63] = { px: -16, pz: 10, py: 10 }
      positions[64] = { px: -16, pz: 10, py: 10 }
      // 动画
      for (let i = 0; i <= 6; ++i) {
        for (let j = 0; j <= 4; ++j) {
          tweens[i * 10 + j] = new TWEEN.Tween(positions[i * 10 + j]).to(positions[(j + 1) % 5 === 0 ? i * 10 + j - 4 : i * 10 + j + 1], 7000)
            .onUpdate(function (object) {
              camera.position.x = object.px
              camera.position.z = object.pz
              camera.position.y = object.py
              if (i === 0) camera.lookAt(6.5, 1, -6)
              else if (i === 1) camera.lookAt(6.5, 2, -6)
              else if (i === 2) camera.lookAt(6.5, 2, -6)
              else if (i === 3) camera.lookAt(6.5, 3, -6)
              else if (i === 4) camera.lookAt(6.5, 4, -6)
              else if (i === 5) camera.lookAt(6.5, 4, -6)
              else if (i === 6) camera.lookAt(6.5, 5, -6)
            })
          tweens[i * 10 + j].easing(TWEEN.Easing.Quadratic.Out)
        }
      }
      // 连接
      for (let i = 0; i <= 6; ++i) {
        for (let j = 0; j <= 4; ++j) {
          tweens[i * 10 + j].chain(tweens[(j + 1) % 5 === 0 ? i * 10 + j - 4 : i * 10 + j + 1])
        }
      }
      // 巡视数据
      // 1L
      positions[100] = { px: 2.12, pz: -9.75, py: 0.31 }
      positions[101] = { px: 10.4, pz: -9.75, py: 0.31 }
      positions[102] = { px: 10.4, pz: -9.75, py: 0.31 }
      positions[103] = { px: 10.4, pz: -2, py: 0.31 }
      positions[104] = { px: 10.4, pz: -2, py: 0.31 }
      positions[105] = { px: 2.12, pz: -2, py: 0.31 }
      positions[106] = { px: 2.12, pz: -2, py: 0.31 }
      positions[107] = { px: 2.12, pz: -9.75, py: 0.31 }
      positions[108] = { px: 2.12, pz: -9.75, py: 0.31 }
      // 2L
      positions[200] = { px: 2.12, pz: -9.75, py: 1.2 }
      positions[201] = { px: 10.4, pz: -9.75, py: 1.2 }
      positions[202] = { px: 10.4, pz: -9.75, py: 1.2 }
      positions[203] = { px: 10.4, pz: -2, py: 1.2 }
      positions[204] = { px: 10.4, pz: -2, py: 1.2 }
      positions[205] = { px: 2.12, pz: -2, py: 1.2 }
      positions[206] = { px: 2.12, pz: -2, py: 1.2 }
      positions[207] = { px: 2.12, pz: -9.75, py: 1.2 }
      positions[208] = { px: 2.12, pz: -9.75, py: 1.2 }
      // 3L
      positions[300] = { px: 2.12, pz: -9.75, py: 1.98 }
      positions[301] = { px: 10.4, pz: -9.75, py: 1.98 }
      positions[302] = { px: 10.4, pz: -9.75, py: 1.98 }
      positions[303] = { px: 10.4, pz: -2, py: 1.98 }
      positions[304] = { px: 10.4, pz: -2, py: 1.98 }
      positions[305] = { px: 2.12, pz: -2, py: 1.98 }
      positions[306] = { px: 2.12, pz: -2, py: 1.98 }
      positions[307] = { px: 2.12, pz: -9.75, py: 1.98 }
      positions[308] = { px: 2.12, pz: -9.75, py: 1.98 }
      // 4L
      positions[400] = { px: 2.12, pz: -9.75, py: 2.87 }
      positions[401] = { px: 10.4, pz: -9.75, py: 2.87 }
      positions[402] = { px: 10.4, pz: -9.75, py: 2.87 }
      positions[403] = { px: 10.4, pz: -2, py: 2.87 }
      positions[404] = { px: 10.4, pz: -2, py: 2.87 }
      positions[405] = { px: 2.12, pz: -2, py: 2.87 }
      positions[406] = { px: 2.12, pz: -2, py: 2.87 }
      positions[407] = { px: 2.12, pz: -9.75, py: 2.87 }
      positions[408] = { px: 2.12, pz: -9.75, py: 2.87 }
      // 5L
      positions[500] = { px: 2.12, pz: -9.75, py: 3.77 }
      positions[501] = { px: 10.4, pz: -9.75, py: 3.77 }
      positions[502] = { px: 10.4, pz: -9.75, py: 3.77 }
      positions[503] = { px: 10.4, pz: -2, py: 3.77 }
      positions[504] = { px: 10.4, pz: -2, py: 3.77 }
      positions[505] = { px: 2.12, pz: -2, py: 3.77 }
      positions[506] = { px: 2.12, pz: -2, py: 3.77 }
      positions[507] = { px: 2.12, pz: -9.75, py: 3.77 }
      positions[508] = { px: 2.12, pz: -9.75, py: 3.77 }
      // 6L
      positions[600] = { px: 2.12, pz: -9.75, py: 4.57 }
      positions[601] = { px: 10.4, pz: -9.75, py: 4.57 }
      positions[602] = { px: 10.4, pz: -9.75, py: 4.57 }
      positions[603] = { px: 10.4, pz: -2, py: 4.57 }
      positions[604] = { px: 10.4, pz: -2, py: 4.57 }
      positions[605] = { px: 2.12, pz: -2, py: 4.57 }
      positions[606] = { px: 2.12, pz: -2, py: 4.57 }
      positions[607] = { px: 2.12, pz: -9.75, py: 4.57 }
      positions[608] = { px: 2.12, pz: -9.75, py: 4.57 }
      for (let i = 1; i <= 6; ++i) {
        for (let j = 0; j <= 8; j++) {
          let times = 2
          if (j % 2 !== 0) {
            times = 1
          }
          tweens[i * 100 + j] = new TWEEN.Tween(positions[i * 100 + j]).to(positions[(j + 1) % 9 === 0 ? i * 100 + j - 8 : i * 100 + j + 1], 5000 * times)
            .onUpdate(function (object) {
              camera.position.x = object.px
              camera.position.z = object.pz
              camera.position.y = object.py
              for (let m = 0; m <= 8; ++m) {
                positions[100 * i + m].px = Math.floor(positions[100 * i + m].px * 100) / 100.0
              }
              if (camera.position.x > positions[100 * i].px && camera.position.x < positions[100 * i + 1].px && camera.position.z === positions[100 * i].pz) {
                switch (i) {
                  case 1:
                    camera.lookAt(10.4, 0.31, -9.75)
                    break
                  case 2:
                    camera.lookAt(10.4, 1.2, -9.75)
                    break
                  case 3:
                    camera.lookAt(10.4, 1.98, -9.75)
                    break
                  case 4:
                    camera.lookAt(10.4, 2.87, -9.75)
                    break
                  case 5:
                    camera.lookAt(10.4, 3.77, -9.75)
                    break
                  case 6:
                    camera.lookAt(10.4, 4.57, -9.75)
                }
              } else if (camera.position.z > positions[100 * i + 1].pz && camera.position.z < positions[100 * i + 3].pz && camera.position.x === positions[100 * i + 3].px) {
                switch (i) {
                  case 1:
                    camera.lookAt(10.4, 0.31, -2)
                    break
                  case 2:
                    camera.lookAt(10.4, 1.2, -2)
                    break
                  case 3:
                    camera.lookAt(10.4, 1.98, -2)
                    break
                  case 4:
                    camera.lookAt(10.4, 2.87, -2)
                    break
                  case 5:
                    camera.lookAt(10.4, 3.77, -2)
                    break
                  case 6:
                    camera.lookAt(10.4, 4.57, -2)
                }
              } else if (camera.position.x > positions[100 * i + 5].px && camera.position.x < positions[100 * i + 3].px && camera.position.z === positions[100 * i + 5].pz) {
                switch (i) {
                  case 1:
                    camera.lookAt(2.12, 0.31, -2)
                    break
                  case 2:
                    camera.lookAt(2.12, 1.2, -2)
                    break
                  case 3:
                    camera.lookAt(2.12, 1.98, -2)
                    break
                  case 4:
                    camera.lookAt(2.12, 2.87, -2)
                    break
                  case 5:
                    camera.lookAt(2.12, 3.77, -2)
                    break
                  case 6:
                    camera.lookAt(2.12, 4.57, -2)
                }
              } else if (camera.position.z > positions[100 * i].pz && camera.position.z < positions[100 * i + 5].pz && camera.position.x === positions[100 * i].pz) {
                switch (i) {
                  case 1:
                    camera.lookAt(2.12, 0.31, -9.75)
                    break
                  case 2:
                    camera.lookAt(2.12, 1.2, -9.75)
                    break
                  case 3:
                    camera.lookAt(2.12, 1.98, -9.75)
                    break
                  case 4:
                    camera.lookAt(2.12, 2.87, -9.75)
                    break
                  case 5:
                    camera.lookAt(2.12, 3.77, -9.75)
                    break
                  case 6:
                    camera.lookAt(2.12, 4.57, -9.75)
                }
              } else if (camera.position.z === positions[100 * i].pz && camera.position.x === positions[100 * i].px && camera.position.y === positions[100 * i].py) {
                camera.rotateY(-0.016)
              } else if (camera.position.z === [100 * i + 1].pz && camera.position.x === positions[100 * i + 1].px && camera.position.y === positions[100 * i + 1].py) {
                camera.rotateY(-0.016)
              } else if (camera.position.z === positions[100 * i + 3].pz && camera.position.x === positions[100 * i + 3].px && camera.position.y === positions[100 * i + 3].py) {
                camera.rotateY(0.016)
              } else if (camera.position.z === positions[100 * i + 5].pz && camera.position.x === positions[100 * i + 5].px && camera.position.y === positions[100 * i + 5].py) {
                camera.rotateY(-0.016)
              }
            })
          tweens[i * 100 + j].easing(TWEEN.Easing.Quadratic.Out)
        }
      }
      // 连接
      for (let i = 1; i <= 6; ++i) {
        for (let j = 0; j <= 8; ++j) {
          tweens[i * 100 + j].chain(tweens[(j + 1) % 9 === 0 ? i * 100 + j - 8 : i * 100 + j + 1])
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
        obj.position.x = obj.position.y = obj.position.z = 0
        obj.scale.x = obj.scale.y = obj.scale.z = 0.2
        if (type === 'floor') {
          floor[id] = new THREE.Group()
          floor[id].add(obj)
          scene.add(floor[id])
          floor[id].visible = true
        } else if (type === 'context') {
          context[id] = new THREE.Group()
          context[id].add(obj)
          scene.add(context[id])
          context[id].visible = true
        }
      })
    }
  }
}
</script>

<style>
body {
  background-color: rgb(192,201,201);
}

.head {
  display: flex;
  vertical-align:middle;
  margin-top: 10px;
}
</style>
