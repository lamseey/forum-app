<template>
  <div v-if="discussion" class="discussion-item card mb-3 p-3">
    <!-- Delete/Edit Buttons (visible only to author or moderators) -->
    <div class="d-flex justify-content-end mb-2">
      <button v-if="user != null && (user.uid == discussion.authorId || user.role == 'moderator')" class="btn btn-danger btn-sm me-2" @click="DeleteDiscussion(discussion.id)">
        <i class="bi bi-trash-fill"></i> Delete
      </button>
      <button v-if="user != null && user.uid == discussion.authorId" class="btn btn-warning btn-sm" @click="editing = !editing">
        <i class="bi bi-pencil-fill"></i> {{ editing ? "Cancel" : "Edit" }}
      </button>
    </div>

    <!-- View Details Button -->
    <router-link v-if="inHome" :to="'/discussion/' + discussion.id" class="btn btn-outline-success mb-3">
      <i class="bi bi-eye"></i> View Details
    </router-link>

    <!-- Author Info -->
    <div class="account mb-3 d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <img :src="discussion.authorPDP" alt="author profile picture" class="rounded-circle me-3" width="50" height="50"/>
        <p class="mb-0">{{ discussion.authorName }}</p>
      </div>
      <span class="text-muted">{{ discussion.date?.toDate?.()?.toLocaleString() || new Date(discussion.date).toLocaleString() }}</span>
    </div>

    <!-- Edit Form -->
    <div v-if="editing">
      <input class="form-control mb-2" v-model="discussion.titre" placeholder="Title"/>
      <textarea class="form-control mb-2" v-model="discussion.contenu" placeholder="Content"></textarea>
      <button class="btn btn-primary" @click="UpdateDiscussion(discussion.id)">Confirm</button>
    </div>

    <!-- View Mode -->
    <div v-else>
      <h2 class="discussion-title">{{ discussion.titre }}</h2>
      <p class="discussion-content">{{ discussion.contenu }}</p>
    </div>

    <!-- Category and Date -->
    <div class="d-flex justify-content-between align-items-center">
      <span><strong>Category:</strong> 
        <router-link v-if="discussion.category" :to="'/category/' + discussion.category.id" class="text-decoration-none text-success">
          {{ discussion.category.name }}
        </router-link>
      </span>
      <span><strong>Subcategory</strong></span>
    <p>{{discussion.subcategory}}</p>
    </div>

    <!-- Upvote and Downvote Section with Icons -->
    <div class="d-flex justify-content-between align-items-center mt-2">
      <div class="discussion-votes">
        <span class="me-3">
          <i class="bi bi-arrow-up-circle-fill text-success"></i> 
          {{ discussion.upvote?.size || 0 }}
        </span>
        <span>
          <i class="bi bi-arrow-down-circle-fill text-danger"></i> 
          {{ discussion.downvote?.size || 0 }}
        </span>
      </div>
    </div>

    <ResponseList :discussionId="discussion.id" />
  </div>
  
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { db } from "/src/firebase";
import { doc, deleteDoc, getDocs, collection, updateDoc, getDoc } from "firebase/firestore";
import ResponseList from "@/components/ResponseList.vue";
import { useRoute } from "vue-router";

const discussion = ref({});
const emit = defineEmits(["discussionDeleted"]);
const user = inject('userDoc');

const props = defineProps({
  discussionId: {
    type: String,
    required: true
  }
});

onMounted(async () => {
  await fetchDiscussion();
});

const route = useRoute();
const inHome = ref(false);
if (route.path === "/") {
  inHome.value = true;
}

let editing = ref(false);

function DeleteDiscussion(id) {
  if (confirm("Are you sure you want to delete this discussion?")) {
    deleteDoc(doc(db, "discussions", id));
    deleteRecursive(id);
    emit("discussionDeleted", id);
  }
}

function UpdateDiscussion(id) {
  const updatedDiscussion = { ...discussion.value };
  updatedDiscussion.date = new Date();
  updatedDiscussion.edited = true;
  updateDoc(doc(db, "discussions", id), updatedDiscussion);
  editing.value = false;
  fetchDiscussion();
}

async function deleteRecursive(id) {
  const query = await getDocs(collection(db, "responses"));
  for (let i = 0; i < query.docs.length; i++) {
    if (query.docs[i].data().discussionId === id) {
      await deleteDoc(doc(db, "responses", query.docs[i].id));
      await deleteRecursive(query.docs[i].id);
    }
  }
}

async function fetchDiscussion() {
  const mydoc = doc(db, "discussions", props.discussionId);
  const docSnap = await getDoc(mydoc);
  discussion.value = {
    id: docSnap.id,
    ...docSnap.data(),
  };
}
</script>

<style scoped>
.discussion-item {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.discussion-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.discussion-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.discussion-content {
  font-size: 16px;
  margin-bottom: 10px;
  color: #555;
}

.discussion-date {
  font-size: 14px;
  color: #777;
}

.account {
  display: flex;
  align-items: center;
  gap: 10px;
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

.discussion-votes {
  font-size: 16px;
  color: #555;
}

.discussion-votes i {
  font-size: 18px;
  margin-right: 5px;
}

.btn {
  transition: transform 0.2s ease;
}

.btn:hover {
  transform: scale(1.05);
}
</style>
