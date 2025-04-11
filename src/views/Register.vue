<template>
  <h1>Create a new Account</h1>
  <div class="register-container">
    <div class="register-grid">
      <label>Username : </label>
      <input type="text" placeholder="Username" v-model="username" />
      <label>Email : </label>
      <input type="email" placeholder="Email" v-model="email" />
      <label>Password : </label>
      <input type="password" placeholder="Password" v-model="password" />
    </div>
    <button @click="register">Submit</button>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<script setup>
import useSignup from '@/composables/useSignup';

const { email, password, username, error, register } = useSignup();
</script>

<style scoped>
.register-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}

.register-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  width: 30%;
  text-align: left;
  row-gap: 10px;
}
</style>
