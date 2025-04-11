<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/register">Register</router-link>
    <router-link to="/login">Login</router-link>
    <button @click="logout">Logout</button>
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
    background-color: #333;
    color: white;
    padding: 10px;
    text-align: center;
  }
  nav a {
    color: white;
    margin-right: 10px;
    text-decoration: none;
  }
  nav a:hover {
    text-decoration: underline;
  }
</style>
>>>>>>> main
