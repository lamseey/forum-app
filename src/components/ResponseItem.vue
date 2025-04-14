<template>
  <div class="card p-3 mb-3 shadow-sm">
    <!-- Account info -->
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <img :src="response.authorPDP" alt="Profile" class="rounded-circle me-2" width="40" height="40">
        <span class="fw-bold text-primary">{{ response.authorName }}</span>
      </div>

      <!-- Delete & Edit buttons -->
      <div class="d-flex align-items-center">
        <button v-if="user && (user.uid === response.authorId || userInfo?.role === 'moderator')"
                class="btn btn-outline-danger btn-sm me-2"
                @click="DeleteResponse(response.id)">
          <i class="bi bi-trash-fill"></i> Delete
        </button>
        <button v-if="user && user.uid === response.authorId"
                class="btn btn-outline-warning btn-sm"
                @click="editing = !editing">
          <i class="bi bi-pencil-fill"></i> {{ editing ? "Cancel" : "Edit" }}
        </button>
      </div>
    </div>

    <!-- Editing form -->
    <div v-if="editing" class="mt-3">
      <textarea v-model="response.contenu" class="form-control mb-2" rows="3" placeholder="Edit content"></textarea>
      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-outline-secondary btn-sm" @click="editing = false">Cancel</button>
        <button class="btn btn-success btn-sm" @click="UpdateResponse(response.id)">Save Changes</button>
      </div>
    </div>

    <!-- Response content -->
    <div v-else class="mt-3">
      <p class="mb-0">{{ response.contenu }}</p>
    </div>

    <!-- Metadata & Voting -->
    <div class="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
      <div class="text-muted small">
        <span v-if="response.edited" class="badge bg-light text-dark me-2">Edited</span>
        <i class="bi bi-clock me-1"></i>
        {{ response.date?.toDate?.()?.toLocaleString() || new Date().toLocaleString() }}
      </div>

      <!-- Vote buttons -->
      <div class="d-flex align-items-center gap-2">
        <button
          class="btn btn-sm p-0 border-0 bg-transparent"
          :disabled="response.upvoters?.includes(user?.uid)"
          @click="upvote">
          <i class="bi bi-arrow-up-circle-fill fs-5" :class="{'text-success': !response.upvoters?.includes(user?.uid), 'text-muted': response.upvoters?.includes(user?.uid)}"></i>
        </button>
        <small class="fw-bold" :class="{'text-success': upvoter_num > 0}">{{ upvoter_num }}</small>

        <button
          class="btn btn-sm p-0 border-0 bg-transparent"
          :disabled="response.downvoters?.includes(user?.uid)"
          @click="downvote">
          <i class="bi bi-arrow-down-circle-fill fs-5" :class="{'text-danger': !response.downvoters?.includes(user?.uid), 'text-muted': response.downvoters?.includes(user?.uid)}"></i>
        </button>
        <small class="fw-bold" :class="{'text-danger': downvoter_num > 0}">{{ downvoter_num }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, inject } from "vue";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";
import getUser from "@/composables/getUser";

const userInfo = inject('userDoc');
const { user } = getUser();
const router = useRouter();
const emit = defineEmits(["responseDeleted", "responseEdited"]);

const props = defineProps({
  response: {
    type: Object,
    required: true,
  },
});

const editing = ref(false);

// Computed vote counts
const upvoter_num = computed(() => props.response.upvoters?.length || 0);
const downvoter_num = computed(() => props.response.downvoters?.length || 0);

// Delete response
function DeleteResponse(id) {
  if (confirm("Are you sure you want to delete this response?")) {
    deleteDoc(doc(db, "responses", id));
    deleteRecursive(id);
    emit("responseDeleted", id);
  }
}

// Recursive delete for threaded replies (if any)
async function deleteRecursive(id) {
  const query = await getDocs(collection(db, "responses"));
  for (let i = 0; i < query.docs.length; i++) {
    if (query.docs[i].data().discussionId === id) {
      await deleteDoc(doc(db, "responses", query.docs[i].id));
      await deleteRecursive(query.docs[i].id);
    }
  }
}

// Update response content
function UpdateResponse(id) {
  editing.value = false;
  const updatedResponse = { ...props.response };
  updatedResponse.date = new Date();
  updatedResponse.edited = true;
  updateDoc(doc(db, "responses", id), updatedResponse);
  emit("responseEdited", id);
}

// Upvote
async function upvote() {
  if (!user.value || !user.value.uid) {
    if (confirm("You need to log in or create an account first")) {
      router.push("/login");
    }
    return;
  }

  const userId = user.value.uid;
  const responseRef = doc(db, "responses", props.response.id);
  const currentUpvoters = props.response.upvoters || [];
  const currentDownvoters = props.response.downvoters || [];

  if (currentUpvoters.includes(userId)) return;

  const updatedUpvoters = [...currentUpvoters, userId];
  const updatedDownvoters = currentDownvoters.filter(id => id !== userId);

  await updateDoc(responseRef, {
    upvoters: updatedUpvoters,
    downvoters: updatedDownvoters
  });

  emit("responseEdited", props.response.id);
}

// Downvote
async function downvote() {
  if (!user.value || !user.value.uid) {
    if (confirm("You need to log in or create an account first")) {
      router.push("/login");
    }
    return;
  }

  const userId = user.value.uid;
  const responseRef = doc(db, "responses", props.response.id);
  const currentUpvoters = props.response.upvoters || [];
  const currentDownvoters = props.response.downvoters || [];

  if (currentDownvoters.includes(userId)) return;

  const updatedDownvoters = [...currentDownvoters, userId];
  const updatedUpvoters = currentUpvoters.filter(id => id !== userId);

  await updateDoc(responseRef, {
    upvoters: updatedUpvoters,
    downvoters: updatedDownvoters
  });

  emit("responseEdited", props.response.id);
}
</script>

<style scoped>
/* Custom styles that Bootstrap doesn't cover */
.card {
  border-radius: 0.5rem;
  font-size : 0.9rem;
  border: none;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}
</style>