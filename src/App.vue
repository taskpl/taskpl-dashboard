<template>
  <div id="app">
    <div>
      <el-button @click="startHacking">Start</el-button>
      <data-tables :data="tableData">
        <el-table-column
          v-for="title in titles"
          :prop="title.prop"
          :label="title.label"
          :key="title.prop"
          sortable="custom"
        ></el-table-column>
      </data-tables>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      backUrl: "http://127.0.0.1:9410/api/v1",
      // in mounted
      backJobUrl: "",
      taskName: "yewu1",
      jobName: "job1",
      tableData: {},
      titles: [
        {
          key: "name",
          label: "name",
          prop: "name"
        },
        {
          key: "parent_stage_name",
          label: "parent_stage_name",
          prop: "parent_stage_name"
        },
        {
          key: "result",
          label: "result",
          prop: "result"
        }
      ]
    };
  },
  mounted() {
    this.backJobQueryUrl = this.backUrl + "/job/single"
  },
  methods: {
    startHacking() {
      console.log(this.backJobQueryUrl)
      this.$http
        .get(
          this.backJobQueryUrl + "?task_name=yewu1&job_name=job1"
        )
        .then(response => {
          let statusCode = response.status;
          if (statusCode == 200) {
            this.$notify({
              title: "Ping works!",
              type: "success",
              message: statusCode
            });
            console.log(response.data);
            this.tableData = response.data;
          } else {
            this.$notify({
              title: "Ping failed!",
              type: "error",
              message: statusCode
            });
          }
        })
        .catch(error => {
          console.error(error);
          this.$notify({
            title: "Ping error!",
            type: "error",
            message: error
          });
        });
    }
  }
};
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
