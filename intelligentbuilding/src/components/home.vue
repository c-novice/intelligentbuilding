<template>
  <div class="main">
    <el-row :gutter="20">
      <el-col :span="6"  @click.native="switchTo('normal','1')">
        <div class="grid-content" style="background: aquamarine">
          1L
        </div>
      </el-col>
      <el-col :span="6"  @click.native="switchTo('normal','2')">
        <div class="grid-content" style="background: aqua">
          2L
        </div>
      </el-col>
      <el-col :span="6"  @click.native="switchTo('normal','3')">
        <div class="grid-content" style="background: aliceblue">
          3L
        </div>
      </el-col>
      <el-col :span="6"  @click.native="switchTo('normal','4')">
        <div class="grid-content" style="background: beige">
          4L
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6"  @click.native="switchTo('normal','5')">
        <div class="grid-content" style="background: burlywood">
          5L
        </div>
      </el-col>
      <el-col :span="6"  @click.native="switchTo('normal','6')">
        <div class="grid-content" style="background: red">
          6L
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content" style="background: cornflowerblue">整体</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content" style="background: cadetblue">详细</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6"  @click.native="switchTo('special')">
        <div class="grid-content" style="background: darkgray">
          自由组合
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content" style="background: darkkhaki"></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content" style="background: coral"></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content" style="background: darkturquoise"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    switchTo (name, cur) {
      this.$router.push({ name: name, query: { cur: cur } })
    }
  }
}
</script>

<style>
.grid-content {
  display: flex;
  border-radius: 4px;
  margin: 30px;
  min-height: 120px;
  align-items: center;
  text-align: center;
  justify-content: center;
}

</style>
