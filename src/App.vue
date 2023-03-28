
<template > 
  <el-container class="main-interface">
    <el-header class="top-bar">
      <a href="#" class="faq-link" @click.prevent="toggleHelp">FAQ</a>
    </el-header>
    <el-main>
    <Auth @save-key="onSaveKey(key)" 
    :disabled="curr_stage!=1"
    />
    <FileUpload 
    @file-upload="onUploadFile"
    :disabled="curr_stage!=2"
    />
    <Help :if="showHelp"/>
    </el-main>
  </el-container>

</template>
<script setup lang="ts">
import FileUpload from './components/FileUpload.vue'
import Auth from './components/Auth.vue'
import Help from './components/Help.vue'
import {ref,provide} from 'vue'

enum auth_method_type{
  access_token,
  webhook
}


const showHelp = ref(false);
const key = ref('');
const curr_stage = ref(1)
const task_list = ref<{task_id:string,task_title:string}[]>([]);
const webhook = ref('');
const client_id = ref('');
const step1 = ref(false);
let username = ref('');
let password = ref('');
const auth_method = ref<auth_method_type>(auth_method_type.access_token);
const backend_type = ref("wekan");
  const change_backend_type = (new_type:string)=>{backend_type.value = new_type;}
provide("backend_type",{backend_type,change_backend_type})
function toggleHelp() {
  showHelp.value = !showHelp.value;
}
function onSaveKey(key_in:string){
  key.value = key_in;
  curr_stage.value = 2;
}
async function beforeStart() {
  // upload 

// fetch boards attached to a user



  // set the auth state to "access_token"
  auth_method.value = auth_method_type.access_token;
  const access_token = 'abc123'; // replace with your own access token

  // get all tasks in project
  const project_id = '123456'; // replace with your own project ID
  const tasks = await fetch(`https://dev.worktile.com/api/mission/projects/${project_id}/tasks`, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }).then(response => response.json());

  console.log(tasks); // do something with the tasks data
}

function onUploadFile(url:string){
  beforeStart();
  //declare a request 


  if (auth_method.value==auth_method_type.access_token)
  {
    request['task_list'] = task_list.value
  }

  curr_stage.value = 3;
}

function submitResult(){
  // declare request as a JSON
  
}
</script>
<style scoped>


</style>
