<template>
  <NewDiscussionForm @discussion-added="updateDiscussions"></NewDiscussionForm>
  
  <!-- Loading message while fetching discussions -->
  <div v-if="loading" class="loading-title">Loading...</div>
  
  <div class="discussion-list">
    <div v-for="discussion in discussions" :key="discussion.id" class="discussion-item">
      <DiscussionItem :discussion="discussion" />
    </div>
  </div>
</template>

<script setup>
import NewDiscussionForm from "/src/components/NewDiscussionForm.vue";
import { ref, onMounted } from 'vue';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "/src/firebase";
import DiscussionItem from "@/components/DiscussionItem.vue";

const discussions = ref([]);
const loading = ref(true); // Adding loading state

async function fetchDiscussions() {
  try {
    const query = await getDocs(collection(db, "discussions"));
    discussions.value = query.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } finally {
    loading.value = false; // Turn off loading after fetching is complete
  }
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

.loading-title {
  color:red;
  text-align: center;
  font-size: 1.2rem;
  margin: 3rem;
}
</style>
