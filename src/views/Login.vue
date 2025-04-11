<template>
    <h1>Login to your Account</h1>
    <div class="register-container">
        <div class="register-grid">
        <label>Email : </label>
        <input type="email" placeholder="Email" v-model="email" />
        <label>Password : </label>
        <input type="password" placeholder="Password" v-model="password" />
        </div>
        <button @click="login">Login</button>
        <p v-if="error" style="color: red;">{{ error }}</p>
    </div>
</template>

<script setup>
import useLogin from '@/composables/useLogin';

const { email, password, error, login } = useLogin();
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
  