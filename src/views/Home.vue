<template>
  <NavBar></NavBar>
  <h1>HOME PAGE</h1>
  <DiscussionList></DiscussionList>
</template>

<style>
  * {
    text-align: left;
  }
</style>

<script setup>
import { ref } from 'vue'
import NavBar from '/src/components/Navbar.vue'
import DiscussionList from "/src/components/DiscussionList.vue"
</script>