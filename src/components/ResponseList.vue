<template>
  <div class="response-list container-fluid p-0">
    <!-- New Response Form -->
    <NewResponseForm :discussion-id="discussionId" @response-added="addResponse" />

    <button v-if="responses.length > 0"
            @click="showResponses = !showResponses"
            class="btn btn-outline-primary mb-3">
      <i class="bi bi-chat-left-text me-2"></i>
      {{ showResponses ? "Hide Responses" : `Show Responses (${responses.length})` }}
    </button>

    <div v-if="showResponses" class="responses ps-3 ms-2">
      <!-- Responses List -->
      <ul class="list-group list-group-flush">
        <li v-for="response in responses" :key="response.id" class="list-group-item p-3 mb-2 rounded">
          <!-- Response Item -->
          <ResponseItem
            @response-edited="fetchResponses"
            @response-deleted="fetchResponses"
            :response="response"
            class="mb-2"
          />
          <ResponseList :discussion-id="response.id" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import ResponseItem from "@/components/ResponseItem.vue";
import { defineProps, ref, onMounted, watch } from 'vue';
import { db } from "@/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import NewResponseForm from "@/components/NewResponseForm.vue";

const props = defineProps({
  discussionId: {
    type: String,
    required: true
  }
});

let responses = ref([]);
let showResponses = ref(false);

// Watch for changes in discussionId and fetch responses accordingly
watch(() => props.discussionId, async () => {
  await fetchResponses();
});

// Fetch responses for the current discussion
async function fetchResponses() {
  const query = await getDocs(collection(db, "responses"));
  responses.value = query.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })).filter(response => response.discussionId === props.discussionId);
}

function addResponse(response) {
  if (response.contenu === "") {
    alert("Please fill in all fields");
    return;
  }
  response.discussionId = props.discussionId;
  response.date = new Date();
  addDoc(collection(db, "responses"), response);
  fetchResponses();
}

onMounted(() => {
  fetchResponses();
});
</script>

<style scoped>
.responses {
  border-left: 2px solid #dee2e6;
}

/* Keep any custom styles that Bootstrap doesn't cover */
</style>