<template>
  <div class="flex justify-center items-center h-screen">
    <el-card class="max-w-sm w-full">
      <div slot="header" class="text-gray-700 font-bold">
        Upload a file
      </div>
      <el-upload class="upload" 
      :auto-upload="false" 
      :show-file-list="false" 
      :before-upload="beforeFileUpload"
      :after-upload="afterFileUpload"
      :action="file_url" accept="video/mp4, audio/mp3">
        <el-button type="primary" size="small">选择视频/音频文件</el-button>
      </el-upload>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineEmits,ref } from 'vue';
import type { UploadInstance,UploadProps } from 'element-plus'
import {backend} from "../api/wekan.js";
const uploadRef = ref<UploadInstance>()
const file_url = ref(backend)
const emit = defineEmits(['fileUpload']);
const beforeFileUpload:UploadProps['beforeUpload'] = (file)=>{
  // Determine the MIME type of the file
  const type = file.type;

  

  // Append the file name to the WebDAV URL
  file_url.value = backend+file.name.substring(file.name.lastIndexOf('.') + 1);
  return true;
}
function afterFileUpload() {
  // get url of file 
  emit('fileUpload',file_url.value)
}
</script>

<style scoped>
.text-gray-700 {
  color: #4a5568;
}
.font-bold {
  font-weight: 700;
}
.max-w-sm {
  max-width: 30rem;
}
.w-full {
  width: 100%;
}
.flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.items-center {
  align-items: center;
}
.h-screen {
  height: 100vh;
}
.upload {
  border: 1px dashed #409eff;
  border-radius: 4px;
  padding: 20px 0;
  text-align: center;
}
.text-gray-500 {
  color: #718096;
}
.text-sm {
  font-size: 0.875rem;
}
</style>