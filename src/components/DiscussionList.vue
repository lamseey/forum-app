<template>
  <div class="discussion-list">
    <NewDiscussionForm :categoryID="dcategoryID" @discussion-added="addDiscussion" />
    <div v-if="discussions.length === 0" class="no-discussions">
      <p>No discussions available.</p>
    </div>
    <span>Filter by: </span>
    <select>
      <option disabled value=""> Category</option>
      <option @click="dcategoryID = undefined; fetchDiscussions()">All</option>
      <option v-for="category in categories" :key="category.id" @click="dcategoryID = category.id; fetchDiscussions()">
        {{ category.name }}
      </option>
    </select>
    <span @click="DateIncreasing = !DateIncreasing; byDate=true;fetchDiscussions()">Date </span>
    <span v-if="byDate">{{(DateIncreasing) ? "UP" : "DOWN"}}</span>
    <span v-else> {{(PopuIncreasing) ? "UP" : "DOWN"}}</span>
    <span @click="PopuIncreasing= !PopuIncreasing; byDate = false;fetchDiscussions()">Popularity </span>

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
const DateIncreasing = ref(false);
const PopuIncreasing = ref(false);
const byDate = ref(true);
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

let dcategoryID = ref(props.categoryID);
let dsearch = ref(props.search);

async function fetchDiscussions() {
    const query = await getDocs(collection(db, "discussions"));
    discussions.value = query.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Filtering by category ID:", dcategoryID.value);
    if (dcategoryID.value) {
      discussions.value = discussions.value.filter(discussion => discussion.category.id === dcategoryID.value);
    }
    if (dsearch.value) {
      discussions.value = discussions.value.filter(discussion => discussion.titre.toLowerCase().includes(dsearch.value.toLowerCase()));
    }
    if (byDate.value) {
      console.log("Sorting by date");
      discussions.value.sort((a, b) => {
        return DateIncreasing.value ? a.date - b.date : b.date - a.date;
      });
    } else {
      discussions.value.sort((a, b) => {
        return PopuIncreasing.value ? a.upvoters.length - b.upvoters.length : b.upvoters.length - a.upvoters.length;
      });
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
  background: white;
}

</style>
