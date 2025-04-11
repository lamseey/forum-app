<template>
  <div class="response-item">
    <p class="response-content">{{ response.contenu }}</p>
    <p class="response-date"><strong>Date:</strong> {{ date }}</p>
  </div>
</template>
<script setup>
import { defineProps } from "vue";

let props = defineProps({
  response: {
    type: Object,
    required: true,
  },
});

const _date = props.response.date;
let date = new Date(_date.seconds * 1000).toLocaleString();
</script>