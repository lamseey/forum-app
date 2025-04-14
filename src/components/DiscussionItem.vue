<template>
  <div v-if="discussion" class="card shadow-sm mb-4">
    <div class="card-body">
      <!-- Top Action Buttons -->
      <div class="d-flex justify-content-between align-items-start mb-3">
        <router-link
          v-if="inHome"
          :to="'/discussion/' + discussion.id"
          class="btn btn-outline-primary btn-sm">
          <i class="bi bi-eye me-1"></i> View Details
        </router-link>

        <div class="d-flex gap-2">
          <button
            v-if="user && (user.uid === discussion.authorId || userInfo?.role === 'moderator')"
            class="btn btn-outline-danger btn-sm"
            @click="DeleteDiscussion(discussion.id)"
            title="Delete discussion">
            <i class="bi bi-trash-fill"></i>
          </button>
          <button
            v-if="user && user.uid === discussion.authorId"
            class="btn btn-outline-warning btn-sm"
            @click="editing = !editing"
            title="Edit discussion">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button
            @click="report"
            class="btn btn-outline-secondary btn-sm"
            title="Report discussion">
            <i class="bi bi-flag-fill"></i>
          </button>
        </div>
      </div>

      <!-- Author Info -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center">
          <img :src="discussion.authorPDP" class="rounded-circle me-2" width="40" height="40" />
          <div>
            <h6 class="mb-0 fw-bold">{{ discussion.authorName }}</h6>
            <small class="text-muted">{{ discussion.date?.toDate?.()?.toLocaleString() || new Date(discussion.date).toLocaleString() }}</small>
          </div>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-if="editing" class="mb-3">
        <input class="form-control mb-2" v-model="discussion.titre" placeholder="Title" />
        <textarea class="form-control mb-2" v-model="discussion.contenu" rows="3" placeholder="Content"></textarea>
        <div class="d-flex gap-2">
          <button class="btn btn-primary btn-sm" @click="UpdateDiscussion(discussion.id)">Save Changes</button>
          <button class="btn btn-outline-secondary btn-sm" @click="editing = false">Cancel</button>
        </div>
      </div>

      <!-- View Mode -->
      <div v-else>
        <h4 class="card-title fw-bold mb-2">{{ discussion.titre }}</h4>
        <p class="card-text text-muted mb-3">{{ discussion.contenu }}</p>
      </div>

      <!-- Tags Section -->
      <div class="d-flex flex-wrap gap-2 mb-3">
        <div v-if="discussion.category">
          <router-link
            :to="'/category/' + discussion.category.id"
            class="badge text-bg-primary text-decoration-none"
            title="Category">
            <i class="bi bi-folder-fill me-1"></i> {{ discussion.category.name }}
          </router-link>
        </div>
        <div v-if="discussion.subcategory">
          <span class="badge text-bg-info" title="Subcategory">
            <i class="bi bi-tag-fill me-1"></i> {{ discussion.subcategory }}
          </span>
        </div>
      </div>

      <!-- Voting -->
      <div class="d-flex align-items-center gap-3 mb-3">
        <button
          class="btn btn-sm p-0 border-0 bg-transparent"
          :disabled="discussion.upvoters?.includes(user?.value?.uid)"
          @click="upvote">
          <i class="bi bi-arrow-up-circle-fill fs-5" :class="{'text-success': discussion.upvoters?.includes(user?.value?.uid), 'text-muted': !discussion.upvoters?.includes(user?.value?.uid)}"></i>
        </button>
        <small class="fw-bold">{{ upvoter_num }}</small>
        <button
          class="btn btn-sm p-0 border-0 bg-transparent"
          :disabled="discussion.downvoters?.includes(user?.value?.uid)"
          @click="downvote">
          <i class="bi bi-arrow-down-circle-fill fs-5" :class="{'text-danger': discussion.downvoters?.includes(user?.value?.uid), 'text-muted': !discussion.downvoters?.includes(user?.value?.uid)}"></i>
        </button>
        <small class="fw-bold">{{ downvoter_num }}</small>
      </div>

      <!-- Responses -->
      <ResponseList v-if="discussion?.id" :discussionId="discussion.id" />
    </div>
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
const emit = defineEmits(["discussionDeleted", "reportDiscussion"]);
const router = useRouter();

const props = defineProps({
  discussionId: {
    type: String,
    required: true
  }
});

function report(){
  const message = prompt("Why do you want to report this message?");
  if (message) {
    const report = {
    message: message,
    discussionId: props.discussionId,
    userId: user.value.uid,
    date: new Date()
  };
    emit("reportDiscussion", report);
    alert("Your message has been sent to the moderators");
  } else {
    alert("Please fill in all fields");
  }
}

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
.card {
  border-radius: 0.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  color: #212529;
}

.card-text {
  font-size: 0.95rem;
  line-height: 1.6;
}

.btn-outline-danger:hover {
  color: white;
}

.btn-outline-warning:hover {
  color: #212529;
}

.badge {
  padding: 0.35em 0.65em;
  font-size: 0.75em;
  font-weight: 500;
}

.account-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.vote-btn:disabled {
  opacity: 1;
}

.vote-btn:focus {
  box-shadow: none;
}

.w-fit-content {
  width: fit-content;
}
</style>