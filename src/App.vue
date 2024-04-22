
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

  <el-button @click="handlerUpload">开始上传</el-button>
  <div draggable="true">拖拽</div>
  {{ Object.keys(progressInfo).length }}
  <template v-if="Object.keys(progressInfo).length > 0">
    <div class="progress" v-for="(percent, name) in progressInfo" :key="name">
      <span>{{ name }}</span>
      <el-progress :percentage="percent"></el-progress>
    </div>
  </template>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { reactive ,toRefs} from "vue";
import axiosInstance from './api/index';
import getFilename from './getFilename';
import createChunks from './createChunk'
  const {isDragover , selectedFile,progressInfo} = toRefs(
    reactive({
      isDragover : false,
      selectedFile:{url:'',file:null,preView:[]},
      progressInfo:{
        name: "",
        percent: ''
      }
    })
  )
  // const handlerUpload = async ()=>{
  //   if (!selectedFile.value.file) {
  //   return ElMessage.warning("请先选择文件");
  // }
  // const file = selectedFile.value.file;
  // const fileName = await getFilename(file);
  // const CHUNK_SIZE = 100 * 1024 * 1024;
  // const chunks = createChunk(file,CHUNK_SIZE,fileName)
  // console.log("chunkes:",chunks);
  // const requests = chunks.map(chunkInfo=>{
  //   return axiosInstance
  //   .post(`/upload/${fileName}`, file, {
  //     headers: {
  //       "Content-Type": "application/octet-stream",
  //     },
  //     params:{
  //       chunkFilename:chunkInfo.chunkFilename,
  //     },
  //     onUploadProgress(progressEvent) {
  //       progressInfo.value[chunkInfo.chunkFilename] = Math.round(
  //         (progressEvent.loaded * 100) / progressEvent.total
  //       );
  //     },
  //   })
  // })
  // await Promise.all(requests);
  // ElMessage.success('上传分片成功')
  // }
  const handlerUpload = async () => {
  if (!selectedFile.value.file) {
    return ElMessage.warning("请先选择文件");
  }
  const file = selectedFile.value.file;

  // 获取文件名
  const filename = await getFilename(file);
  const CHUNK_SIZE = 100 * 1024 * 1024;
  // 创建分片
  const chunks = createChunks(file, CHUNK_SIZE, filename);

  // 批量上传分片
  const requests = chunks.map((chunkInfo) => {
    return axiosInstance.post(`/upload/${filename}`, chunkInfo.chunk, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
      params: {
        chunkFilename: chunkInfo.chunkFilename,
      },
      onUploadProgress(progressEvent) {
        progressInfo.value[chunkInfo.chunkFilename] = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    });
  });
  await Promise.all(requests);
  ElMessage.success("上传分片完成");
};
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
    if(selectedFile.preView?.length > 0 ) return;
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
