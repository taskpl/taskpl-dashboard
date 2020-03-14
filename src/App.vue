<template>
  <div id="app">
    <el-container>
      <el-aside>
        <sideBar/>
      </el-aside>

      <el-container>
        <el-header>
          <topBar/>
        </el-header>

        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import SideBar from './components/SideBar.vue'

export default {
  components: {
    topBar: TopBar,
    sideBar: SideBar,
  }
}
</script>

