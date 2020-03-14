<template>
  <div id="app">
    <div>
      <el-select
        v-model="taskName"
        placeholder="Task Type"
        @change="updateJobNameList"
        :clearable="true"
      >
        <el-option v-for="item in taskNameList" :key="item" :label="item" :value="item"></el-option>
      </el-select>

      <el-select v-if="taskName" v-model="jobName" placeholder="Job Name" :clearable="true">
        <el-option
          v-for="item in jobNameList"
          :key="item.job_name"
          :label="item.job_name"
          :value="item.job_name"
        ></el-option>
      </el-select>

      <el-button v-if="jobName && taskName" @click="startQuery">Start</el-button>
      <data-tables v-if="tableData" :data="tableData" :table-props="tableProps">
        <el-table-column
          v-for="title in tableTitles"
          :prop="title.prop"
          :label="title.label"
          :key="title.prop"
          sortable="custom"
          align="left"
        ></el-table-column>
      </data-tables>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // replace this link with your real backend
      backUrl: "http://127.0.0.1:9647/api/v1",
      // urls
      backJobQueryUrl: "",
      backTaskAllQueryUrl: "",
      backJobAllQueryUrl: "",

      // value
      taskNameList: [],
      jobNameList: [],
      taskName: "",
      jobName: "",
      tableData: "",
      tableTitles: [
        {
          key: "name",
          label: "name",
          prop: "name"
        },
        {
          key: "parent_name",
          label: "parent_name",
          prop: "parent_name"
        },
        {
          key: "desc",
          label: "desc",
          prop: "desc"
        }
      ],
      tableProps: {
        "row-class-name": this.tableRowClassName
      }
    };
  },
  mounted() {
    this.backJobQueryUrl = this.backUrl + "/job/single";
    this.backTaskAllQueryUrl = this.backUrl + "/task/all";
    this.backJobAllQueryUrl = this.backUrl + "/job/all";

    this.updateTaskNameList();
  },
  methods: {
    updateTaskNameList() {
      this.$http.get(this.backTaskAllQueryUrl).then(response => {
        console.log("task list: " + response.data);
        this.taskNameList = response.data;
      });
    },

    updateJobNameList(tn) {
      console.log("calling update job name list");
      let targetUrl = this.backJobAllQueryUrl + "?task_name=" + this.taskName;
      console.log("update job: " + targetUrl);
      this.$http.get(targetUrl).then(response => {
        console.log("job list: " + response.data);
        this.jobNameList = response.data;
      });
    },

    tableRowClassName({ row, rowIndex }) {
      console.log("calling tablerowclass, result: " + row.result);
      if (row.result == false) {
        return "warning-row";
      } else if (row.result == true) {
        return "success-row";
      }
      return "";
    },

    startQuery() {
      console.log(this.backJobQueryUrl);
      this.$http
        .get(this.backJobQueryUrl + "?task_name=yewu1&job_name=job1")
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
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
