<template>
  <div class="response-list">
    <!-- New Response Form -->
    <NewResponseForm :discussion-id="discussionId" @response-added="addResponse" />
    <button v-if="responses.length > 0" @click="showResponses = !showResponses" class="btn btn-link">
          <i class="bi bi-chat-left-text"></i> {{ showResponses ? "Hide Responses" : "Show Responses" }}
        </button>
    <div v-if="showResponses" class="responses">
      <!-- Responses List -->
      <ul class=" mt-3">
        <li v-for="response in responses" :key="response.id" class="list-group-item mb-3">
          <!-- Response Item -->
        <ResponseItem
            @response-edited="fetchResponses"
            @response-deleted="fetchResponses"
            :response="response"
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
.response-list {
  margin-top: 20px;
}

.responses {
  border-left: 2px solid black;
}

.list-group-item {
  padding: 15px;
  font-size: 1rem;
}


button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button:focus {
  outline: none;
}
</style>
