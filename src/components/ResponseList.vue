<template>
  <div class="response-list">
    <ul>
      <li v-for="response in responses">
        <p>response length {{responses[0].titre}}</p>
        <ResponseItem :response="response" />
      </li>
    </ul>
  </div>
</template>
<script setup>
import ResponseItem from "@/components/ResponseItem.vue";
import { defineProps } from 'vue';
defineProps({
  responses: {
    type: Array,
    required: true
  }
});
</script>