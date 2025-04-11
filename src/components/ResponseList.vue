<template>
  <div class="response-list">
    <NewResponseForm :discussion-id="discussionId" @response-added="addResponse" />
    <ul>
      <li v-for="response in responses" :key="response.id">
        <ResponseItem :response="response"/>
        <ResponseList :discussion-id="response.id" />
      </li>
    </ul>
  </div>
</template>
<script setup>
import ResponseItem from "@/components/ResponseItem.vue";
import { defineProps, ref, onMounted } from 'vue';
import { db } from "@/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import NewResponseForm from "@/components/NewResponseForm.vue";
const props = defineProps({
  discussionId: {
    type: Number,
    required: true
  }
});

let responses = ref([]);

function addResponse(response) {
  if (response.contenu === "") {
    alert("Please fill in all fields");
    return;
  }
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