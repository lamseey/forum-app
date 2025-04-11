<template>
  <NewDiscussionForm @discussion-added="updateDiscussions"></NewDiscussionForm>
  <div class="discussion-list">
    <div v-for="discussion in discussions" :key="discussion.id" class="discussion-item">
      <DiscussionItem :discussion="discussion" />
    </div>
  </div>
</template>

<script setup>
import NewDiscussionForm from "/src/components/NewDiscussionForm.vue";
import { ref, onMounted } from 'vue';
import { collection, getDocs, addDoc} from "firebase/firestore";
import {db} from "/src/firebase";
import DiscussionItem from "@/components/DiscussionItem.vue";

const discussions = ref([]);

async function fetchDiscussions() {
  const query = await getDocs(collection(db, "discussions"));
  discussions.value = query.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

onMounted(() => {
  fetchDiscussions();
})

function updateDiscussions(newDiscussion) {
  addDoc(collection(db, "discussions"), newDiscussion);
  fetchDiscussions();
}
</script>

<style scoped>
.discussion-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}


.discussion-item:hover {
  background-color: #f1f1f1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}


</style>