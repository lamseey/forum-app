<template>
  <h1 id="homepage">HOME PAGE</h1>
  <!-- Check if the user is loaded properly -->
  <p v-if="user !== null">Welcome, {{ user.displayName || user.email }}!</p>
  <p v-else>Not logged in.</p>
  <DiscussionList></DiscussionList>
</template>

<style>
body {
  margin: 0;
}
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
import { ref } from 'vue';
import DiscussionList from "/src/components/DiscussionList.vue";
import getUser from '@/composables/getUser';  // Import getUser function

// Get the user from the getUser function
const user = getUser();  // Now calling getUser() as defined
</script>
