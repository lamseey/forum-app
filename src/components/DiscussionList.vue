<template>
  <NewDiscussionForm @discussion-added="updateDiscussions"></NewDiscussionForm>
  <div v-for="discussion in discussions" :key="discussion.id">
    <DiscussionItem :discussion="discussion" />
  </div>

</template>

<script setup>
import NewDiscussionForm from "/src/components/NewDiscussionForm.vue";
import { ref, onMounted } from 'vue';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "/src/firebase";
import DiscussionItem from "@/components/DiscussionItem.vue";

const discussions = ref([]);

async function fetchDiscussions() {
  const query = await getDocs(collection(db, "discussions"));
  discussions.value = query.docs.map(doc => ({
    id: doc.id,
    ...doc.data(), // Extract the document data
  }));
}
onMounted(() => {
  fetchDiscussions();
})

function updateDiscussions(newDiscussion) {
  // add to database
  addDoc(collection(db, "discussions"), newDiscussion);
  alert("Discussion added " + newDiscussion.titre);
  fetchDiscussions();
}


</script>