<template>
  <div class="response-item">
    <div class="account">
      <img :src="response.authorPDP" alt="">
      <p>{{ response.authorName }}</p>
    </div>
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

<style>
.account {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  margin: 10px 0;
}

.account img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.account p {
  margin: 0;
  font-weight: bold;
  color: #333;
  font-size: 1.1em;
}
</style>