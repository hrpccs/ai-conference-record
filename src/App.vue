
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

    <FormConfirm 
    :tasksList="wekan_tasks_list"
    :disabled="curr_stage!=4"
    @confirmed="submitToKanban(wekan_tasks_list)"
    />
    <div :if="curr_stage!=3">
    <!-- https://pixabay.com/gifs/load-loading-process-wait-delay-36/ -->
    <img src="./assets/loading.gif" alt="Loading animation" />
    </div>
    <Help :if="showHelp"/>
    </el-main>
  </el-container>

</template>
<script setup lang="ts">
import FileUpload from './components/FileUpload.vue'
import Auth from './components/Auth.vue'
import FormConfirm from './components/FormConfirm.vue'
import Help from './components/Help.vue'
import {ref,provide} from 'vue'
import { backend,UniqueIdMap} from './utils'
import { wekan_url, Card,Board,List,Swimlane  } from './api/wekan'

enum worktile_auth_method_type{
  access_token,
  webhook
}


const showHelp = ref(false);
const key = ref('');
const curr_stage = ref(1)
const wekan_tasks_list = ref<Card[]>([]);
const webhook = ref('');
const client_id = ref('');
const project_id = ref('');
const access_token = ref('');
const auth_method = ref<worktile_auth_method_type>(worktile_auth_method_type.access_token);
const backend_type = ref("wekan");
  let submitted_task_list:{ [key: string]: any }[] = [];
let unique_id_map = new UniqueIdMap()
const change_backend_type = (new_type:string)=>{backend_type.value = new_type;}
provide("backend_type",{
  backend_type,
  change_backend_type
  })
function toggleHelp() {
  showHelp.value = !showHelp.value;
}
function onSaveKey(key_in:string){
  key.value = key_in;
  curr_stage.value = 2;
}
async function pullTasksList(){

  const boardResponse = await fetch(`${wekan_url}/api/boards`);
  const boards: Board[] = await boardResponse.json();

  for (const board of boards) {
    const listResponse = await fetch(`${wekan_url}/api/boards/${board.id}/lists`);
    const lists: List[] = await listResponse.json();

    for (const list of lists) {
        const cardResponse = await fetch(`${wekan_url}/api/boards/${board.id}/lists/${list.id}/cards`);
        const cards: Card[] = await cardResponse.json();

        for (const card of cards) {
          submitted_task_list.push(card);
      }
    }
  }

}
async function onUploadFile(url:string){
  //declare a request 
  let request: { [key: string]: any } = {};
  request['media_url'] = url
  await pullTasksList()
  let obtained_tasks_list = submitted_task_list;
  for (const task in obtained_tasks_list){
    let new_task = {
      project
    }
  }
  request['task_list'] = submitted_task_list
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  };
  try {
  const [result_list, _] = await Promise.all([
    fetch(`${backend}/api`, options),
    new Promise(() => setTimeout(()=>{
      curr_stage.value = 3;
      
    }, 100)), // resolve after 1 second
  ]);
    // handle the response from the server
  } catch (error) {
    // handle any errors that occurred during the fetch
    console.error(error)
  }


}
function submitToKanban(result_tasks_list:Card[]){
  // TODO
  try{
    fetch()
  }catch(error){
    window.alert(error)
  }
}

</script>
<style scoped>


</style>
