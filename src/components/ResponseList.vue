<template>
  <div class="response-list">
    <!-- New Response Form -->
    <NewResponseForm :discussion-id="discussionId" @response-added="addResponse" />
    <button v-if="responses.length > 0" @click="showResponses = !showResponses" class="btn btn-link">
          <i class="bi bi-chat-left-text"></i> {{ showResponses ? "Hide Responses" : "Show Responses" }}
        </button>
    <div v-if="showResponses" class="response-list-items">
      <!-- Responses List -->
      <ul class="list-group mt-3">
        <li v-for="response in responses" :key="response.id" class="list-group-item border rounded-3 mb-3">
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
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.list-group-item {
  padding: 15px;
  font-size: 1rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.list-group-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 1rem;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.25);
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

.response-list-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.response-list-item {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: box-shadow 0.3s ease;
}

.response-list-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.response-list-item:last-child {
  margin-bottom: 0;
}
</style>
