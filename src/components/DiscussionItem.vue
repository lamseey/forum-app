<template>
  <div class="discussion-item">
    <h2 class="discussion-title">{{ discussion.titre }}</h2>
    <p class="discussion-content">{{ discussion.contenu }}</p>
    <p class="discussion-date"><strong>Date:</strong> {{ discussion.date.toDate().toLocaleString() }}</p>
    <p class="discussion-upvote"><strong>Upvotes:</strong> {{ discussion.upvote }}</p>
    <p class="discussion-downvote"><strong>Downvotes:</strong> {{ discussion.downvote }}</p>
    <NewResponseForm @response-added="sendToList" :discussionId="discussion.id" />
    <ResponseList :responses="discussion.responselist" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import ResponseList from "@/components/ResponseList.vue";
import NewResponseForm from "@/components/NewResponseForm.vue";

let p = defineProps({
  discussion: {
    type: Object,
    required: true
  }
});

console.log(p.discussion)


const emit = defineEmits(["responseAdded"]);

function sendToList(response) {
  emit("responseAdded", response);
}
</script>

<style scoped>
.discussion-item {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.discussion-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.discussion-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.discussion-content {
  font-size: 16px;
  margin-bottom: 10px;
  color: #555;
}

.discussion-date {
  font-size: 14px;
  color: #777;
}
</style>