<template>
  <div class="discussion-list">
    <NewDiscussionForm :categoryID="categoryID" @discussion-added="addDiscussion" />
    <div v-if="discussions.length === 0" class="no-discussions">
      <p>No discussions available.</p>
    </div>
    <span>Filter by: </span>
    <select>
      <option disabled value=""> Select a category</option>
      <option @click="categoryID = undefined">All</option>
      <option v-for="category in categories" :key="category.id" @click="categoryID = category.id; fetchDiscussions()">
        {{ category.name }}
      </option>
    </select>
    <div v-for="discussion in discussions" :key="discussion.id" class="discussion-item">
      <DiscussionItem :discussion-id="discussion.id" :discussion="discussion" @discussion-deleted="fetchDiscussions" />
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

const categories = ref([]);
async function fetchCategories() {
  const query = await getDocs(collection(db, "categories"));
  categories.value = query.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

const props = defineProps({
  categoryID: {
    type: String,
  },
  search: {
    type: String,
  }
});


async function fetchDiscussions() {
    const query = await getDocs(collection(db, "discussions"));
    discussions.value = query.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (props.categoryID) {
      discussions.value = discussions.value.filter(discussion => discussion.category.id === props.categoryID);
    }
    if (props.search) {
      discussions.value = discussions.value.filter(discussion => discussion.titre.toLowerCase().includes(props.search.toLowerCase()));
    }

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
  fetchCategories();
})
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
