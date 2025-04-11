<template>
  <Navbar/>
  <router-view/>
</template>
<script setup>
import Navbar from './components/Navbar.vue'
</script>
<style>
  * {
    font-family: Arial, sans-serif;
    font-size: 105%;
  }
  nav {
    background-color: #333;
    color: white;
    padding: 10px;
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
