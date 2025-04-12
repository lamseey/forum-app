<template>
  <div class="response-list">
    <NewResponseForm :discussion-id="discussionId" @response-added="addResponse" />
    <ul class="response-list-items">
      <li v-for="response in responses" :key="response.id" class="response-list-item">
        <ResponseItem @response-edited="fetchResponses" @response-deleted="fetchResponses" :response="response" />
        <ResponseList :discussion-id="response.id" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import ResponseItem from "@/components/ResponseItem.vue";
import {defineProps, ref, onMounted} from 'vue';
import {db} from "@/firebase";
import {collection, getDocs, addDoc} from "firebase/firestore";
import NewResponseForm from "@/components/NewResponseForm.vue";

const props = defineProps({
  discussionId: {
    type: String,
    required: true
  }
});

let responses = ref([]);

function addResponse(response) {
  if (response.contenu === "") {
    alert("Please fill in all fields");
    return;
  }
  response.discussionId = props.discussionId;
  addDoc(collection(db, "responses"), response);
  fetchResponses();
}

async function fetchResponses() {
  const query = await getDocs(collection(db, "responses"));
  responses.value = query.docs.map(doc => ({
    id: doc.id, ...doc.data()
  })).filter(response => response.discussionId === props.discussionId);
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
  font-size : 85%;
}

.response-list-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.response-list-item:last-child {
  margin-bottom: 0;
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

textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.25);
}
</style>