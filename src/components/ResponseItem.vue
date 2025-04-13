<template>
  <div class="response-item card mb-3 p-3">
    <!-- Account info (profile picture and name) along with the date, delete and edit buttons -->
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <img :src="response.authorPDP" alt="Profile" class="rounded-circle" width="40" height="40">
        <p class="ms-2 mb-0 fw-bold">{{ response.authorName }}</p>
      </div>

      <!-- Buttons for deleting and editing the response -->
      <div class="d-flex align-items-center">
        <button v-if="user != null && (user.uid == response.authorId || user.role == 'moderator')" 
                class="btn btn-danger btn-sm me-2" 
                @click="DeleteResponse(response.id)">
                <i class="bi bi-trash-fill"></i>Delete
        </button>
        <button v-if="user != null && user.uid == response.authorId" 
                class="btn btn-warning btn-sm" 
                @click="editing = !editing">
                <i class="bi bi-pencil-fill"></i> {{ (editing) ? "Cancel" : "Edit" }}
        </button>
      </div>
    </div>

    <!-- Editing response form -->
    <div v-if="editing" class="mt-3">
      <input v-model="response.contenu" class="form-control mb-2" placeholder="Edit content" />
      <button class="btn btn-success btn-sm" @click="UpdateResponse(response.id)">Confirm</button>
    </div>

    <!-- Display response content -->
    <div v-else class="mt-3">
      <p class="discussion-content">{{ response.contenu }}</p>
    </div>

    <!-- Date and status of editing -->
    <div class="mt-2 text-muted d-flex justify-content-between align-items-center">
      <div>
        <span v-if="response.edited" class="badge bg-secondary">Edited</span>
        <span class="ms-2"><strong>Date:</strong> {{ response.date?.toDate?.()?.toLocaleString() || new Date(discussion.date).toLocaleString() }}</span>
      </div>
      
      <!-- Upvotes and Downvotes with icons -->
      <div class="d-flex align-items-center">
        <p class="mb-0 me-3">
          <i class="bi bi-hand-thumbs-up"></i> <strong>Upvotes:</strong> {{ response.upvote?.size || 0 }}
        </p>
        <p class="mb-0">
          <i class="bi bi-hand-thumbs-down"></i> <strong>Downvotes:</strong> {{ response.downvote?.size || 0 }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, inject, ref } from "vue";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const user = inject("userDoc");
const emit = defineEmits(["responseDeleted", "responseEdited"])

let props = defineProps({
  response: {
    type: Object,
    required: true,
  },
});

let editing = ref(false);

function DeleteResponse(id) {
  if (confirm("Are you sure you want to delete this discussion?")) {
    deleteDoc(doc(db, "responses", id));
    deleteRecursive(id);
    emit("responseDeleted", id);
  }
}

function UpdateResponse(id) {
  editing.value = false;
  const updatedResponse = { ...props.response };
  updatedResponse.date = new Date();
  updatedResponse.edited = true;
  updateDoc(doc(db, "responses", id), updatedResponse);
  emit("responseEdited", id);
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
</script>

<style scoped>
/* Custom styles for response item if needed */
.response-item {
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.discussion-content {
  font-size: 1.1em;
  color: #333;
}
</style>
