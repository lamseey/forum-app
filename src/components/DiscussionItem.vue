<template>
  <h2>{{ discussion.titre }}</h2>
  <p>{{ discussion.contenu }}</p>
  <p><strong>Date:</strong> {{ discussion.date.toDate().toLocaleString() }}</p>
</template>
<script setup>
import { defineProps } from 'vue';

defineProps({
  discussion: {
    type: Object,
    required: true
  }
});

</script>