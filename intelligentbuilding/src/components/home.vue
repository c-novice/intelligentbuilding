<template>
  <div class="main">
    <el-image style="position: fixed;left: 0;top: 0" :src="require('../assets/logo.png')"></el-image>
    <el-image class="title" :src="require('../assets/title.png')" style="width: 70%"></el-image>
    <el-row type="flex" :gutter="24" style="margin-bottom: 20px">
      <el-col :push="3" :span="8" @click.native="switchTo('normal','1')">
        <el-image style="width: 50%;height: 95%;" :src="require('../assets/1L.png')"></el-image>
      </el-col>
      <el-col :span="8" @click.native="switchTo('normal','2')">
        <el-image style="width: 50%;height: 95%" :src="require('../assets/2L.png')"></el-image>
      </el-col>
      <el-col :pull="3" :span="8" @click.native="switchTo('normal','3')">
        <el-image style="width: 50%;height: 95%" :src="require('../assets/3L.png')"></el-image>
      </el-col>
    </el-row>

    <el-row type="flex" :gutter="24" style="margin-bottom: 20px">
      <el-col :push="3" :span="8" @click.native="switchTo('normal','4')">
        <el-image style="width: 50%;height: 95%" :src="require('../assets/4L.png')"></el-image>
      </el-col>
      <el-col :span="8" @click.native="switchTo('normal','5')">
        <el-image style="width: 50%;height: 95%" :src="require('../assets/5L.png')"></el-image>
      </el-col>
      <el-col :pull="3" :span="8" @click.native="switchTo('normal','6')">
        <el-image style="width: 50%;height: 95%" :src="require('../assets/6L.png')"></el-image>
      </el-col>
    </el-row>

    <el-row type="flex" :gutter="24" style="margin-bottom: 20px">
      <el-col :push="3" :span="8" @click.native="switchTo('zhengti')">
        <el-image style="width: 50%;height: 95%" :src="require('../assets/zhengti.png')"></el-image>
      </el-col>
      <el-col :span="8" @click.native="switchTo('xiangxi')">
        <el-image style="width: 50%;height: 95%" :src="require('../assets/xiangxi.png')"></el-image>
      </el-col>
      <el-col :pull="3" :span="8">
        <el-image style="width: 50%;height: 95%" :src="require('../assets/shezhi.png')"></el-image>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fit: 'none'
    }
  },
  methods: {
    switchTo (name, cur) {
      this.$router.push({ name: name, query: { cur: cur } })
    }
  }
}
</script>

<style>

.main {
  text-align: center;
  background: url("../assets/background.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

.title {
  margin-top: 40px;
  width: 60%;
  margin-bottom: 10px;
}

body {
  margin: 0;
}
</style>
