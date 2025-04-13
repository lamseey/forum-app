<script setup>
import {ref} from "vue";
import DiscussionList from "@/components/DiscussionList.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const search = ref(route.params.search);

</script>

<template>
  <h1>Search PAGE</h1>
  <div class="search">
    <input type="text" placeholder="Search..." />
    <button>Search</button>
  </div>
  <DiscussionList :search="search"/>
</template>

<style scoped>

</style>