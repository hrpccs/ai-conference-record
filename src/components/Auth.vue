<template>
  <div>
    <el-select v-model="selected" placeholder="Select a service" @change="change_backend_type">
      <!-- <el-option label="飞书" value="feishu"/> -->
      <!-- <el-option label="WorkTile" value="worktile"/> -->
      <el-option label="WeKan" value="wekan"/>
    </el-select>
    <div :if="backend_type=='worktile'">

      <el-input v-model="api_key" placeholder="输入API_KEY"/>
      <el-input v-model="project_id" placeholder="输入Project ID"/>
    <el-input v-model="client_id" placeholder="输入应用的client_id"/>
    <el-input v-model="webhook" placeholder="输入项目的incoming webhook"/>
    <el-button :disabled="!api_key" @click="authorize">Save</el-button>
    </div>


    <div :if="backend_type=='wekan'">
      <el-input v-model="baseURL" placeholder="输入Wekan后端URL"/>
      <el-input type="password" v-model="api_key" placeholder="输入API_KEY"/>
      <el-input v-model="username" placeholder="username或email"/>
      <el-input type="password" v-model="password" placeholder="password" show-password/>
    <el-button :disabled="!api_key" @click="authorize">登录</el-button>

    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, defineEmits,inject } from 'vue';
import {loginUser} from '../api/wekan';
import {isEmail} from '../utils'
const emit = defineEmits(['saveKey'])
const selected = ref('');
const api_key = ref('');

// **** Worktile authentication ****
const project_id = ref('');
const client_id = ref('');
const access_token = ref('');
const webhook = ref('');
// **** WeKan authentication ****
const token = ref('');
const baseURL=ref('');
const username=ref('');
const password=ref('');
const {backend_type,change_backend_type} = inject("backend_type")



async function authorize() {
  if (backend_type.value == "wekan"){
    try{
      if (isEmail(username.value))
      token.value =  await loginUser(baseURL.value,{email:username.value,password:password.value})
      else token.value = await  loginUser(baseURL.value,{username:username.value,password:password.value})
      
    } catch (error){
      window.alert(error)
    }

  }
}
</script>