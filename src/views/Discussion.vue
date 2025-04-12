<template>
  <DiscussionItem @discussion-edited="null" @discussion-deleted="null" :discussionId="discussionId" />
</template>

<script setup>
import DiscussionItem from "@/components/DiscussionItem.vue";
import {useRoute} from "vue-router";

const route = useRoute();
const discussionId = route.params.id;



</script>