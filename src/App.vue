
<template>
  <div id="upload-container"
    :class="{'is-dragover':isDragover}"
    @drop="handleDrop"
    @click="handleClick"
    @dragover.prevent
    @dragenter.prevent="isDragover = true"
    @dragleave.prevent="isDragover = false"
  >
    <el-icon :size="30"><Files /></el-icon>
  </div>

  <el-button>开始上传</el-button>
  <div draggable="true">拖拽</div>
</template>

<script setup>
import { reactive ,toRefs} from "vue";
  const {isDragover} = toRefs(
    reactive({
      isDragover : false,
    })
  )
  const handleDrop = (e)=>{
    e.preventDefault();
    const { files } = e.dataTransfer;
    console.log("files: ", files);
  }
  const handleClick = (e)=>{
    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", (e) => {
      const { files } = e.target;
      console.log("files: ", files);
    });
    input.click();
  }
</script>

<style scoped>
#upload-container {
  height: 200px;
  line-height: 200px;
  text-align: center;
  border: 1px dashed #ccc;
  margin-bottom: 20px;
  cursor: pointer;
}
#upload-container:hover,
#upload-container.is-dragover {
  border: 1px dashed #0037ff;
  color: #0037ff;
}
</style>
