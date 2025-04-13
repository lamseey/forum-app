<template>
  <h1>Profile PAGE</h1>
  <div class="account">
    <img :src="userInfo?.pdp" >
    <p>{{ userInfo?.username }}</p>
  </div>
  <p>{{ userInfo?.bio }}</p>
</template>

<script setup>


defineProps({
  userID: {
    type: String,
    required: true
  }
});

</script>
