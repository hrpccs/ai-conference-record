<template>
  <div class="floating-frame" :class="{ 'is-active': isActive }">
    <div class="floating-content">
      <div class="floating-header">
        <span class="floating-title">Floating Component</span>
        <i class="el-icon-close floating-close" @click="close"></i>
      </div>
      <div class="floating-body">
        <p>This is a floating component.</p>
        <p>Click the button below to toggle it on and off.</p>
        <el-button @click="toggle" type="primary">{{ isActive ? 'Disable' : 'Enable' }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';

  const state = reactive({
    isActive: false,
    bodyStyle: {}
  });

  const toggle = () => {
    state.isActive = !state.isActive;
    if (state.isActive) {
      state.bodyStyle = {
        'margin-right': 'calc(100vw - 100%)',
        'overflow': 'hidden',
      };
    } else {
      state.bodyStyle = {};
    }
  };

  const close = () => {
    state.isActive = false;
    state.bodyStyle = {};
  };
</script>

<style scoped>
  .floating-frame {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease, visibility 0.5s ease;
  }
  .floating-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  .floating-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .floating-title {
    font-size: 18px;
  }
  .floating-close {
    font-size: 20px;
    cursor: pointer;
  }
  .floating-body {
    margin: 0 -20px;
  }
  .floating-frame.is-active {
    opacity: 1;
    visibility: visible;
  }
  .floating-frame.is-active + * {
    transition: margin-right 0.5s ease, overflow 0.5s ease;
  }
</style>