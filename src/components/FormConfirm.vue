<template>
    <el-card v-for="(task, index) in local_tasks_list" :key="index">
    <el-row :gutter="20">
    <span class="ml-3 w-35 text-gray-600 inline-flex items-center">Board Name</span>
      <el-input v-model="task.board_name"/>
    </el-row>
    <el-row :gutter="20">
    <span class="ml-3 w-35 text-gray-600 inline-flex items-center">List Name</span>
      <el-input v-model="task.list_name"/>
    </el-row>
    <el-row :gutter="20">
    <span class="ml-3 w-35 text-gray-600 inline-flex items-center">Swimlane Name</span>
      <el-input v-model="task.swimlane_name"/>
    </el-row>
    <el-row :gutter="20">
    <span class="ml-3 w-35 text-gray-600 inline-flex items-center">Card Name</span>
      <el-input v-model="task.title"/>
    </el-row>
    <el-row :gutter="20">
    <span class="ml-3 w-35 text-gray-600 inline-flex items-center">Operation</span>
      <el-input v-model="task.operation_type"/>
    </el-row>
    <el-row :gutter="20">
    <span class="ml-3 w-35 text-gray-600 inline-flex items-center">Description</span>
      <el-input v-model="task.description"/>
    </el-row>
    <el-row :gutter="20">
    <span class="ml-3 w-35 text-gray-600 inline-flex items-center">Due At</span>
      <el-input type="date" v-model="task.due_at"/>
    </el-row>
    <el-row :gutter="20">
    <span class="ml-3 w-35 text-gray-600 inline-flex items-center">Spent</span>
      <el-input type="date" v-model="task.spent"/>
    </el-row>
    </el-card>
    <el-button @click="onConfirmed">Confirm</el-button>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, SetupContext } from 'vue';
import {CardSubmitted} from '../api/wekan'

const local_tasks_list = ref<CardSubmitted[]>([])
interface Props {
  tasksList: CardSubmitted[];
}
const props =  defineProps<Props>()
onMounted(()=>{
    local_tasks_list.value = props.tasksList;
})
const emit = defineEmits(['confirmed'])
const onConfirmed = () => {
    emit('confirmed',local_tasks_list.value);
};
  

</script>