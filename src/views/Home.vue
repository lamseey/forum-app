<template>
  <NavBar></NavBar>
  <h1 id="homepage">HOME PAGE</h1>
  <DiscussionList></DiscussionList>
</template>

<style>
  * {
    text-align: left;
  }
  #homepage {
    text-align: center;
    font-size: 2em;
    margin-top: 20px;
  }
</style>

<script setup>
import NavBar from '/src/components/Navbar.vue'
import DiscussionList from "/src/components/DiscussionList.vue"
</script>