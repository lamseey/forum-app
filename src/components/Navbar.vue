<template>
  <nav>
    <router-link to="/">Squak</router-link>
    <div v-if="!logged_in">
      <router-link to="/register">Register</router-link>
      <router-link to="/login">Login</router-link>
    </div>
    <div v-else>
      <router-link to="/profile">Profile</router-link>
      <button class="logout" @click="logout">Logout</button>
    </div>
      <div v-if="logged_in" class="account">
        <img :src="userInfo?.pdp" >
        <p>{{ userInfo?.username }}</p>
      </div>
      <div v-else>
        Guest
      </div>
  </nav>
</template>

<script setup>
import { inject } from 'vue'
import { signOut } from "firebase/auth"
import { auth } from "@/firebase"
import router from "@/router"

const logged_in = inject('logged_in')
const userInfo = inject('userDoc')
const logout = async () => {
  try {
    await signOut(auth)
    console.log("Logged out successfully")
    router.push("/")
  } catch (err) {
    console.log("Error while logging out:", err)
  }
}
</script>

<style scoped>
nav {
  background: linear-gradient(90deg, #4caf50, #81c784);
  padding: 15px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

nav a {
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  text-decoration: none;
  margin: 0 15px;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.2s;
}

.logout {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2em;
}
.logout:hover {
  background-color: #d32f2f;
  transform: scale(1.05);
}
.logout:active {
  transform: scale(0.95);
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

nav a:active {
  transform: scale(1.05);
}
.account {
  display: flex;
  margin-left: 20px;
}
img {
  border-radius: 50%;
  width: 52px;
  height: 52px;
}

</style>