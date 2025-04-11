<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/register">Register</router-link>
    <router-link to="/login">Login</router-link>
    <button class="logout" @click="logout">Logout</button>
  </nav>

</template>

<script setup>
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
const logout = async () => {
  try {
    await signOut(auth);
    console.log("lougged out sucessfully");
  } catch (err) {
    console.log("there was a error while logging out");
  }
};
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

.logout{
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
</style>
