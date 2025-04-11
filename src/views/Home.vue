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
import { onMounted, ref } from "vue";
import NavBar from "/src/components/Navbar.vue";
import DiscussionList from "/src/components/DiscussionList.vue";
import getUser from "@/composables/getUser";

</script>