<template>
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
import { onMounted } from "vue";
import DiscussionList from "/src/components/DiscussionList.vue";
import getUser from "@/composables/getUser";
onMounted(() => {
  getUser();
});
</script>