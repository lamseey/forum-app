<template>
    <h1>Login to your Account</h1>
    <div class="register-container">
        <div class="register-grid">
        <label>Email : </label>
        <input type="email" placeholder="Email" v-model="email" />
        <label>Password : </label>
        <input type="password" placeholder="Password" v-model="password" />
        </div>
        
        <!-- Forgot Password -->
        <a href="#" @click.prevent="forgotPassword" style="align-self: flex-start; margin-left: 30%;">
        Forgot Password?
        </a>

        <button @click="login">Login</button>
        <p v-if="error" style="color: red;">{{ error }}</p>
        <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    </div>
</template>
  

<script setup>
import { ref } from 'vue'
import useLogin from '@/composables/useLogin'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

const { email, password, error, login } = useLogin()
const successMessage = ref('')

const forgotPassword = async () => {
  const auth = getAuth()
  const db = getFirestore()
  error.value = ''
  successMessage.value = ''

  if (!email.value) {
    error.value = 'Please enter your email to reset your password.'
    return
  }

  try {
    // Step 1: Look for a user in Firestore with the provided email
    const q = query(collection(db, 'users'), where('email', '==', email.value.trim().toLowerCase()))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      error.value = 'No user found with this email in the database.'
      return
    }

    // Step 2: Send the password reset email
    await sendPasswordResetEmail(auth, email.value.trim().toLowerCase())
    successMessage.value = 'Password reset email sent. Check your inbox.'
  } catch (err) {
    error.value = err.message
  }
}
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
    width: 40%;
    text-align: left;
    row-gap: 10px;
}
</style>
