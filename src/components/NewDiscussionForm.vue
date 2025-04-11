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

const emit = defineEmits(["discussionAdded"]);

function addDiscussion() {
  if (discussion.value.titre === "" || discussion.value.contenu === "") {
    alert("Please fill in all fields");
    return;
  }
  discussion.value.date = new Date();
  emit("discussionAdded", discussion.value);
  discussion.value.titre = "";
  discussion.value.contenu = "";
  addForm.value = false;
}

let addForm = ref(false);
let discussion = ref({
  titre: "",
  contenu: "",
  date: new Date(),
});

</script>