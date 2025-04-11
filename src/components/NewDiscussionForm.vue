<template>
  <button @click="addForm = !addForm">{{(addForm) ? "Cancel" : "Add Discussion"}}</button>
  <form v-if="addForm">
    <input v-model="discussion.titre" placeholder="Titre" required>
    <br>
    <textarea v-model="discussion.contenu" placeholder="Contenu" required></textarea>
    <br>
    <button @click.prevent="addDiscussion">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { collection, addDoc } from "firebase/firestore";
import { db } from "/src/firebase";


function addDiscussion() {
  if (discussion.value.titre === "" || discussion.value.contenu === "") {
    alert("Please fill in all fields");
    return;
  }
  discussion.value.date = new Date();
  addDoc(collection(db, "discussions"), {
    titre: discussion.value.titre,
    contenu: discussion.value.contenu,
    date: discussion.value.date,
  });
  alert("Discussion added successfully");
  addForm.value = false;
}

let addForm = ref(false);
let discussion = ref({
  titre: "",
  contenu: "",
  date: new Date(),
});

</script>