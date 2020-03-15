<template>
  <div id="app">
    <div>
      <el-select
        v-model="taskName"
        placeholder="Task Type"
        @change="updateJobList"
        :clearable="true"
      >
        <el-option v-for="item in taskNameList" :key="item" :label="item" :value="item"></el-option>
      </el-select>

      <el-select v-if="taskName" v-model="jobName" placeholder="Job Name" :clearable="true">
        <el-option v-for="item in jobList" :key="item.name" :label="item.name" :value="item.name"></el-option>
      </el-select>

      <el-button v-if="jobName && taskName" @click="startQuery">Start</el-button>

      <el-tabs type="border" v-if="tableData && treeData">
        <el-tab-pane label="table">
          <data-tables :data="tableData" :table-props="tableProps">
            <el-table-column
              v-for="title in tableTitles"
              :prop="title.prop"
              :label="title.label"
              :key="title.prop"
              sortable="custom"
              align="left"
            ></el-table-column>
          </data-tables>
        </el-tab-pane>

        <el-tab-pane label="tree">
          <el-tree :data="treeData" :props="treeProps" default-expand-all>
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-tag v-if="data.result" type="success" size="mini">pass</el-tag>
                <el-tag v-if="!data.result" type="warning" size="mini">todo</el-tag>
              </span>
            </span>
          </el-tree>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // replace this link with your real backend
      backUrl: "http://127.0.0.1:9410/api/v1",
      // urls
      backJobQueryListUrl: "",
      backJobQueryTreeUrl: "",
      backTaskAllQueryUrl: "",
      backJobAllQueryUrl: "",

      // value
      taskNameList: [],
      jobList: [],
      taskName: "",
      jobName: "",
      // table
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
      },
      // tree
      treeData: "",
      treeProps: {
        label: "name",
        children: "sub_nodes"
      }
    };
  },
  mounted() {
    this.backJobQueryListUrl = this.backUrl + "/job/single/list";
    this.backJobQueryTreeUrl = this.backUrl + "/job/single/tree";
    this.backTaskAllQueryUrl = this.backUrl + "/task/all";
    this.backJobAllQueryUrl = this.backUrl + "/job/all";

    this.updateTaskNameList();
  },
  methods: {
    clearOptions() {
      this.jobList = [];
      this.taskName = "";
      this.jobName = "";
      this.tableData = "";
      this.treeData = "";
    },

    updateTaskNameList() {
      this.httpGet(this.backTaskAllQueryUrl, {}, "taskNameList");
    },

    updateJobList(tn) {
      if (!tn) {
        this.clearOptions();
        return;
      }
      this.httpGet(
        this.backJobAllQueryUrl,
        {
          task_name: this.taskName
        },
        "jobList"
      );
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

    httpGet(url, params, writeTo) {
      console.log(url);
      console.log(params);
      this.$http
        .get(url, { params: params })
        .then(response => {
          let statusCode = response.status;
          if (statusCode == 200) {
            this[writeTo] = response.data;
            console.log(response.data);
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
    },

    startQuery() {
      let jobQueryParams = {
        task_name: this.taskName,
        job_name: this.jobName
      };
      this.httpGet(this.backJobQueryListUrl, jobQueryParams, "tableData");
      this.httpGet(this.backJobQueryTreeUrl, jobQueryParams, "treeData");
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
