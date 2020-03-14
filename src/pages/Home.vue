<template>
  <div>
    <img src="../assets/logo.png">
    <div>
      <el-button @click="pingBaidu">Ping</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    pingBaidu () {
      // this.$http == axios
      // https://www.kancloud.cn/yunye/axios/234845
      this.$http.get('http://www.baidu.com')
        .then((response) => {
          let statusCode = response.status

          if (statusCode == 200) {
            this.$notify({
              title: 'Ping works!',
              type: 'success',
              message: statusCode
            })
          } else {
            this.$notify({
              title: 'Ping failed!',
              type: 'error',
              message: statusCode
            })
          }
        })
        .catch(error => {
          console.error(error)
          this.$notify({
            title: 'Ping error!',
            type: 'error',
            message: error
          })
        })
    }
  }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>

