<template>
  <div class="response-item">
    <h3 class="response-title">{{ response.titre }}</h3>
    <p class="response-content">{{ response.contenu }}</p>
    <p class="response-date"><strong>Date:</strong> {{ response.date }}</p>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';

defineProps({
  response: {
    type: Object,
    required: true
  }
});

</script>