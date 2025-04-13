<template>
  <div class="discussion-list">
    <NewDiscussionForm @discussion-added="addDiscussion" />
    <div v-for="discussion in discussions" :key="discussion.id" class="discussion-item">
      <div v-if="categoryID">
        <div v-if="discussion.category.id === categoryID">
          <DiscussionItem @discussion-deleted="fetchDiscussions" :discussionId="discussion.id" />
        </div>
      </div>
      <div v-else>
        <DiscussionItem @discussion-deleted="fetchDiscussions" :discussionId="discussion.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "/src/firebase";
import DiscussionItem from "@/components/DiscussionItem.vue";
import NewDiscussionForm from "@/components/NewDiscussionForm.vue";
const discussions = ref([]);

const props = defineProps({
  categoryID: {
    type: String,
  }
});


async function fetchDiscussions() {
    const query = await getDocs(collection(db, "discussions"));
    discussions.value = query.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

}

function addDiscussion(discussion) {
  if (discussion.titre === "" || discussion.contenu === "") {
    alert("Please fill in all fields");
    return;
  }
  discussion.date = new Date();
  addDoc(collection(db, "discussions"), discussion);
  fetchDiscussions();
}

onMounted(() => {
  fetchDiscussions();
})
</script>

<style scoped>
.discussion-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: white;
}

</style>
