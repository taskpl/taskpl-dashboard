<template>
  <div id="app">
    <div>
      <!-- dev -->
      <el-dialog title="endpoint" :visible.sync="devMode" width="30%">
        <el-input v-model="backUrl" placeholder="backend api url"></el-input>
        <el-input v-model="fileUrl" placeholder="file server url"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="changeEndPoint">OK</el-button>
        </span>
      </el-dialog>

      <!-- new job -->
      <el-dialog title="create a new job" :visible.sync="newJobMode" width="30%">
        <el-input v-model="newJobName" placeholder="what's your job name?"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createNewJob">OK</el-button>
        </span>
      </el-dialog>

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

      <el-button v-if="taskName && !jobName" @click="switchNewJob" type="primary">NewJob</el-button>
      <el-button v-if="jobName && taskName" @click="startQuery">Start</el-button>
      <!-- debug only -->
      <el-button v-if="!taskNameList" @click="switchDev">Endpoint Configure</el-button>

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
            <el-table-column label="操作" align="left">
              <template slot-scope="scope">
                <el-button size="mini" @click="jumpToFileServer(scope.row.path_str)">跳转</el-button>
              </template>
            </el-table-column>
          </data-tables>
        </el-tab-pane>

        <el-tab-pane label="tree">
          <el-tree :data="treeData" :props="treeProps" default-expand-all>
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="custom-tree-node-inside">{{ node.label }}</span>
              <span class="custom-tree-node-inside">
                <el-tag v-if="data.result" type="success" size="mini">pass</el-tag>
                <el-tag v-if="!data.result" type="warning" size="mini">todo</el-tag>
                <el-button size="mini" v-on:click="jumpToFileServer(data.path_str)">跳转</el-button>
              </span>
            </span>
          </el-tree>
        </el-tab-pane>

        <el-tab-pane label="summary" :disabled="true"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // replace this link with your real backend
      backendUrlList: ["http://127.0.0.1:20317/api/v1"],
      fileUrlList: ["http://127.0.0.1:20316/files"],
      devMode: false,

      // urls
      backJobQueryListUrl: "",
      backJobQueryTreeUrl: "",
      backTaskAllQueryUrl: "",
      backJobAllQueryUrl: "",

      // value
      taskNameList: null,
      jobList: null,
      taskName: "",
      jobName: "",
      // new job
      newJobName: "",
      newJobMode: false,

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
        },
        {
          key: "path_str",
          label: "path_str",
          prop: "path_str"
        }
      ],
      tableProps: {
        "row-class-name": this.tableRowClassName,
        border: true
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
    this.backUrl = this.backendUrlList[0];
    this.fileUrl = this.fileUrlList[0];
    this.updateUrlList();

    this.updateTaskNameList();
  },
  methods: {
    switchDev() {
      this.devMode = !this.devMode;
    },

    switchNewJob() {
      this.newJobMode = !this.newJobMode;
    },

    changeEndPoint() {
      this.devMode = false;
      this.updateUrlList();
      this.clearOptions();
      this.updateTaskNameList();
    },

    updateUrlList() {
      this.backJobQueryListUrl = this.backUrl + "/job/single/list";
      this.backJobQueryTreeUrl = this.backUrl + "/job/single/tree";
      this.backJobNewUrl = this.backUrl + "/job/single";
      this.backTaskAllQueryUrl = this.backUrl + "/task/all";
      this.backJobAllQueryUrl = this.backUrl + "/job/all";
    },

    createNewJob() {
      this.newJobMode = false;
      this.httpPost(
        this.backJobNewUrl,
        {
          task_name: this.taskName,
          job_name: this.newJobName
        },
        null
      );
      this.clearOptions();
    },

    clearOptions() {
      this.jobList = [];
      this.taskName = "";
      this.jobName = "";
      this.tableData = "";
      this.treeData = "";
    },

    jumpToFileServer(urlPath) {
      let fullUrl =
        this.fileUrl + `/${this.taskName}/${this.jobName}/${urlPath}`;
      this.jumpToUrl(fullUrl);
    },

    jumpToUrl(url) {
      console.log("trying to jump: " + url);
      // should be port 80
      window.open(url, "_blank");
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

    httpPost(url, params, writeTo) {
      console.log(url);
      console.log(params);
      this.$http
        .post(url, null, { params: params })
        .then(response => {
          let statusCode = response.status;
          if (statusCode == 200) {
            this[writeTo] = response.data;
            console.log(response.data);
            this.$notify({
              title: "Post successful",
              type: "success",
              message: statusCode
            });
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
