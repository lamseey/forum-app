<template>
  <button @click="addForm = !addForm" class="toggle-button">
    {{ addForm ? "Cancel" : "Add Discussion" }}
  </button>
  <form v-if="addForm" class="discussion-form">
    <input v-model="discussion.titre" placeholder="Titre" required class="form-input">
    <br>
    <textarea v-model="discussion.contenu" placeholder="Contenu" required class="form-textarea"></textarea>
    <br>
    <button @click.prevent="addDiscussion" class="submit-button">Submit</button>
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

<style scoped>
.toggle-button {
  background-color: #007bff;
  display: block;
  margin: 0 auto;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.toggle-button:hover {
  background-color: #0056b3;
}

.discussion-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}


.form-input{
  text-align: center;
}
.form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.form-textarea {
  height: 100px;
  resize: none;
}

.submit-button {
  display: block;
  margin: 0 auto;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #218838;
}
</style>