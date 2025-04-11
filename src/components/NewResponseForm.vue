<template>
  <button @click = "addForm = !addForm">
    {{(addForm) ? "Cancel": "Add response" }}
  </button>
  <div v-if="addForm">
    <form>
      <input v-model="response.titre" placeholder="Titre" required class="form-input">
      <br>
      <textarea v-model="response.contenu" placeholder="Contenu" required class="form-textarea"></textarea>
      <br>
      <button @click.prevent="addResponse" class="submit-button">Submit</button>
    </form>
  </div>
</template>
<script setup>
import { ref, defineProps } from 'vue';
import { db } from "@/firebase";
import {doc, updateDoc, arrayUnion } from "firebase/firestore";

let properties = defineProps({
  discussionId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["responseAdded"]);

const response = ref({
  titre: "",
  contenu: "",
  date: null,
  upvote: 0,
  downvote: 0
});

const addForm = ref(false);
function addResponse() {
  if (response.value.titre === "" || response.value.contenu === "") {
    alert("Please fill in all fields");
    return;
  }
  response.value.date = new Date();
  const discussionRef = doc(db, "discussions", properties.discussionId);
  updateDoc(discussionRef, {
    responselist: arrayUnion(response.value)
  });
  addForm.value = false;
  emit("responseAdded", response.value);
  response.value = { titre: "", contenu: "", date: null, upvote: 0, downvote: 0 };
}

</script>