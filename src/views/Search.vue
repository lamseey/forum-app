<script setup>
import {ref} from "vue";
import DiscussionList from "@/components/DiscussionList.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const search = ref(route.params.search);

</script>

<template>
  <h1 class="mb-4 text-center">Results for: "{{search}}"</h1>
  <DiscussionList :search="search"/>
</template>

<style scoped>

</style>