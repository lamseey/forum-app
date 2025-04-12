<template>
  <h1>Profile PAGE</h1>
  <div v-if="logged_in" class="account">
      <img :src="userInfo?.pdp" >
      <p>{{ userInfo?.username }}</p>
    </div>
  <div v-else>
    <p>You're not logged in</p>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const logged_in = inject('logged_in')
const userDoc = inject('userDoc')
</script>

<style scoped>
img {
  border-radius: 50%;
  width: 52px;
  height: 52px;
}
</style>
