
<template>
  <div id="upload-container"
    :class="{'is-dragover':isDragover}"
    @drop="handleDrop"
    @click="handleClick"
    @dragover.prevent
    @dragenter.prevent="isDragover = true"
    @dragleave.prevent="isDragover = false"
  > 
    <template v-if="selectedFile.url">
      <el-image
      style="width: 100px; height: 100px"
      v-if="selectedFile.file.type.indexOf('image') > -1"
      :src="selectedFile.url"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="selectedFile.preView"
      :initial-index="4"
      fit="cover"
    />
      <video
        controls
        v-if="selectedFile.file.type.indexOf('video') > -1"
        :src="selectedFile.url"
      ></video>
    </template>
    <el-icon :size="30" v-else><Files /></el-icon>
  </div>

  <el-button>开始上传</el-button>
  <div draggable="true">拖拽</div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { reactive ,toRefs} from "vue";
  const {isDragover , selectedFile} = toRefs(
    reactive({
      isDragover : false,
      selectedFile:{url:'',file:null,preView:[]}
    })
  )
  const handleDrop = (e)=>{
    e.preventDefault();
    const { files } = e.dataTransfer;
    console.log("files: ", files);
    if(files.length === 0) return;
    const isMedia = files[0].type.indexOf("image") > -1 || files[0].type.indexOf('video')  > -1
    if(!isMedia){
      return ElMessage.warning('只能上传图片或者视频');
    }
    selectedFile.value = {
      url:URL.createObjectURL(files[0]),
      file:files[0],
      preView:[URL.createObjectURL(files[0])]
    }
  }
  const handleClick = (e)=>{
    if(selectedFile.preView.length > 0 ) return;
    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", (e) => {
      const { files } = e.target;
      console.log("files: ", files);
      if(files.length === 0) return;
      const isMedia = files[0].type.indexOf("image") > -1 || files[0].type.indexOf('video')  > -1
      if(!isMedia){
        return ElMessage.warning('只能上传图片或者视频');
      }
      selectedFile.value = {
        url:URL.createObjectURL(files[0]),
        file:files[0],
        preView:[URL.createObjectURL(files[0])]
      }
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
