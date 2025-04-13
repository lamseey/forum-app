<template>
  <div v-if="discussion" class="card shadow-sm p-3 mb-3">
    <!-- Top Action Buttons -->
    <div class="d-flex justify-content-end mb-2 gap-2">
      <button 
        v-if="user?.value && (user.value.uid == discussion.authorId || userInfo?.role == 'moderator')" 
        class="btn btn-danger btn-sm"
        @click="DeleteDiscussion(discussion.id)">
        <i class="bi bi-trash-fill"></i>Delete
      </button>
      <button 
        v-if="user?.value && user.value.uid == discussion.authorId" 
        class="btn btn-warning btn-sm"
        @click="editing = !editing">
        <i class="bi bi-pencil-fill"></i>
      </button>
    </div>

    <!-- View Details (Home page only) -->
    <router-link 
      v-if="inHome" 
      :to="'/discussion/' + discussion.id" 
      class="btn btn-outline-success btn-sm mb-2 w-fit-content">
      <i class="bi bi-eye"></i> View
    </router-link>

    <!-- Author Info -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div class="d-flex align-items-center">
        <img :src="discussion.authorPDP" class="rounded-circle me-2" width="36" height="36" />
        <small class="fw-semibold">{{ discussion.authorName }}</small>
      </div>
      <small class="text-muted">{{ discussion.date?.toDate?.()?.toLocaleString() || new Date(discussion.date).toLocaleString() }}</small>

    </div>

    <!-- Edit Mode -->
    <div v-if="editing">
      <input class="form-control form-control-sm mb-2" v-model="discussion.titre" placeholder="Title" />
      <textarea class="form-control form-control-sm mb-2" v-model="discussion.contenu" placeholder="Content"></textarea>
      <button class="btn btn-sm btn-primary" @click="UpdateDiscussion(discussion.id)">Confirm</button>
    </div>

    <!-- View Mode -->
    <div v-else>
      <h3 class="fw-bold text-dark mb-1">{{ discussion.titre }}</h3>
      <p class="text-muted small mb-2">{{ discussion.contenu }}</p>
    </div>

    <!-- Tags Section -->
    <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
      <div v-if="discussion.category">
        <router-link 
          :to="'/category/' + discussion.category.id" 
          class="badge bg-success text-decoration-none"
          title="Category">
          <i class="bi bi-folder-fill me-1"></i> {{ discussion.category.name }}
        </router-link>
      </div>
      <div v-if="discussion.subcategory">
        <span class="badge bg-secondary" title="Subcategory">
          <i class="bi bi-tag-fill me-1"></i> {{ discussion.subcategory }}
        </span>
      </div>
    </div>



    <!-- Voting -->
    <div class="d-flex align-items-center gap-3">
      <button 
        class="btn btn-sm p-0 border-0 bg-transparent" 
        :disabled="discussion.upvoters?.includes(user?.value?.uid)" 
        @click="upvote">
        <i class="bi bi-arrow-up-circle-fill text-success"></i>
      </button>
      <small>{{ upvoter_num }}</small>
      <button 
        class="btn btn-sm p-0 border-0 bg-transparent" 
        :disabled="discussion.downvoters?.includes(user?.value?.uid)" 
        @click="downvote">
        <i class="bi bi-arrow-down-circle-fill text-danger"></i>
      </button>
      <small>{{ downvoter_num }}</small>
    </div>

    <!-- Responses -->
    <ResponseList v-if="discussion?.id" :discussionId="discussion.id" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import { db } from "@/firebase";
import { doc, deleteDoc, getDocs, collection, updateDoc, getDoc } from "firebase/firestore";
import ResponseList from "@/components/ResponseList.vue";
import { useRoute, useRouter } from "vue-router";
import getUser from "@/composables/getUser";

const { user } = getUser(); 
const userInfo = inject('userInfo')
const discussion = ref({});
const emit = defineEmits(["discussionDeleted"]);
const router = useRouter();

const props = defineProps({
  discussionId: {
    type: String,
    required: true
  }
});

const route = useRoute();
const inHome = ref(route.path === "/");

let editing = ref(false);

async function fetchDiscussion() {
  const docSnap = await getDoc(doc(db, "discussions", props.discussionId));
  discussion.value = {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

onMounted(fetchDiscussion);

function DeleteDiscussion(id) {
  if (confirm("Are you sure you want to delete this discussion?")) {
    deleteDoc(doc(db, "discussions", id));
    deleteRecursive(id);
    emit("discussionDeleted", id);
  }
}

async function UpdateDiscussion(id) {
  const updatedDiscussion = { ...discussion.value };
  updatedDiscussion.date = new Date();
  updatedDiscussion.edited = true;
  await updateDoc(doc(db, "discussions", id), updatedDiscussion);
  editing.value = false;
  await fetchDiscussion();
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

// Computed values for reactive vote counts
const upvoter_num = computed(() => discussion.value.upvoters?.length || 0);
const downvoter_num = computed(() => discussion.value.downvoters?.length || 0);

// Upvote function
async function upvote() {
  if (!user.value || !user.value.uid) {
    if (confirm("You need to log in or create an account first")) {
      router.push('/login');
    }
    return;
  }

  const userId = user.value.uid;
  const currentUpvoters = discussion.value.upvoters || [];
  const currentDownvoters = discussion.value.downvoters || [];

  if (currentUpvoters.includes(userId)) return;

  const updatedUpvoters = [...currentUpvoters, userId];
  const updatedDownvoters = currentDownvoters.filter(id => id !== userId);

  await updateDoc(doc(db, "discussions", discussion.value.id), {
    upvoters: updatedUpvoters,
    downvoters: updatedDownvoters
  });

  await fetchDiscussion();
}

// Downvote function
async function downvote() {
  if (!user.value || !user.value.uid) return;

  const userId = user.value.uid;
  const currentUpvoters = discussion.value.upvoters || [];
  const currentDownvoters = discussion.value.downvoters || [];

  if (currentDownvoters.includes(userId)) return;

  const updatedDownvoters = [...currentDownvoters, userId];
  const updatedUpvoters = currentUpvoters.filter(id => id !== userId);

  await updateDoc(doc(db, "discussions", discussion.value.id), {
    upvoters: updatedUpvoters,
    downvoters: updatedDownvoters
  });

  await fetchDiscussion();
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
  background-color: #ffffff !important;
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