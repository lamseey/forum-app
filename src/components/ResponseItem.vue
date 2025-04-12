<template>
  <div class="response-item">
    <button @click="DeleteDiscussion(response.id)"> Delete </button>
    <button @click="editing = !editing"> {{(editing) ? "Confirm" : "Edit" }}</button>
    <div v-if="editing">
      <div class="account">
        <img :src="response.authorPDP" alt="">
        <p>{{ response.authorName }}</p>
      </div>
      <input v-model="response.contenu" placeholder="contenu"> <br>
      <p class="response-upvote"><strong>Upvotes:</strong> {{ response.upvote }}</p>
      <p class="response-downvote"><strong>Downvotes:</strong> {{ response.downvote }}</p>
      <p class="response-date"><strong>Date:</strong> {{ response.date.toDate().toLocaleString() }}</p>
      <button @click = UpdateResponse(response.id)>Confirm</button>
    </div>
    <div v-else>
      <div class="account">
        <img :src="response.authorPDP" alt="">
        <p>{{ response.authorName }}</p>
      </div>
      <p class="response-content">{{ response.contenu }}</p>
      <p class="response-upvote"><strong>Upvotes:</strong> {{ response.upvote }}</p>
      <p class="response-downvote"><strong>Downvotes:</strong> {{ response.downvote }}</p>
      <p class="response-date"><strong>Date:</strong> {{ response.date.toDate().toLocaleString() }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import {collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";
import {db} from "@/firebase";

const emit = defineEmits(["responseDeleted", "responseEdited"])

let props = defineProps({
  response: {
    type: Object,
    required: true,
  },
});

let editing = ref(false);

function DeleteDiscussion(id) {
  if (confirm("Are you sure you want to delete this discussion?")) {
    deleteDoc(doc(db, "responses", id));
    deleteRecursive(id);
    emit("responseDeleted", id);
  }
}

function UpdateResponse(id) {
  editing.value = false;
  const updatedResponse= {... props.response};
  updatedResponse.date = new Date();
  updateDoc(doc(db, "responses", id), updatedResponse);
  emit("responseEdited", id)
}

async function deleteRecursive(id) {
  const query = await getDocs(collection(db, "responses"));
  for (let i = 0; i < query.docs.length; i++){
    if (query.docs[i].data().discussionId === id){
      await deleteDoc(doc(db, "responses", query.docs[i].id))
      await deleteRecursive(query.docs[i].id);
    }
  }
}

</script>

<style>
.account {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  margin: 10px 0;
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
</style>