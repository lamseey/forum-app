<template>
  <Presentation/>
  <CategoryShort/>
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
import DiscussionList from "/src/components/DiscussionList.vue";
import { onMounted } from "vue";

import getUser from "@/composables/getUser";
import Presentation from "@/components/Presentation.vue";
import CategoryShort from "@/components/CategoryShort.vue";
onMounted(() => {
  getUser();
});

</script>
