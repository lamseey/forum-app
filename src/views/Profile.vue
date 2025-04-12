<template>
  <h1>Profile PAGE</h1>
  <div class="account">
    <img :src="userInfo?.pdp" >
    <p>{{ userInfo?.username }}</p>
  </div>
  <p>{{ userInfo?.bio }}</p>
</template>

<script setup>
import { inject } from 'vue'

const userInfo = inject('userDoc')
</script>


