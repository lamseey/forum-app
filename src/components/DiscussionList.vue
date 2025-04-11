<template>
  <NewDiscussionForm></NewDiscussionForm>
  <div v-for="discussion in discussions" :key="discussion.id">
    <h2>{{ discussion.data().titre }}</h2>
    <p>{{ discussion.data().contenu }}</p>
    <p>{{ discussion.data().date.toDate().toLocaleString() }}</p>
  </div>

</template>

<script setup>
import NewDiscussionForm from "/src/components/NewDiscussionForm.vue";
import { ref, onMounted } from 'vue';
import { collection, getDocs } from "firebase/firestore";
import { db } from "/src/firebase";

const discussions = ref([]);

function fetchDiscussions() {
  const query = getDocs(collection(db, "discussions"));
  discussions.value = query.docs;
}

onMounted(() => {
  fetchDiscussions();
})


</script>