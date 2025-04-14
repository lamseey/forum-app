<template>
  <div class="discussion-list container mt-4">
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <NewDiscussionForm :categoryID="dcategoryID" @discussion-added="addDiscussion" />
      </div>
    </div>

    <div v-if="discussions.length === 0" class="alert alert-info">
      <p class="mb-0">No discussions available.</p>
    </div>

    <div class="filter-section mb-4 p-3 bg-light rounded">
      <div class="row align-items-center">
        <div class="col-md-12">
          <div class="d-flex flex-wrap align-items-center gap-3">
            <span class="fw-bold">Filter by:</span>

            <select class="form-select form-select-sm" style="width: auto;">
              <option disabled value="">Category</option>
              <option @click="dcategoryID = undefined; fetchDiscussions()">All</option>
              <option v-for="category in categories" :key="category.id" @click="dcategoryID = category.id; fetchDiscussions()">
                {{ category.name }}
              </option>
            </select>

            <button
              @click="DateIncreasing = !DateIncreasing; byDate=true;fetchDiscussions()"
              class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            >
              <span>Date</span>
              <span v-if="byDate">
                <i :class="DateIncreasing ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
              </span>
            </button>

            <button
              @click="PopuIncreasing= !PopuIncreasing; byDate = false;fetchDiscussions()"
              class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            >
              <span>Popularity</span>
              <span v-if="!byDate">
                <i :class="PopuIncreasing ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="discussions-container">
      <div v-for="discussion in discussions" :key="discussion.id" class="mb-3">
        <DiscussionItem :discussion-id="discussion.id" :discussion="discussion" @discussion-deleted="fetchDiscussions" />
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
  max-width: 800px;
  margin: 0 auto;
}

.filter-section {
  background-color: #f8f9fa;
}

.discussions-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Add some responsive adjustments */
@media (max-width: 768px) {
  .filter-section .d-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>