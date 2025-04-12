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
import { ref, inject } from 'vue';

const userInfo = inject('userDoc'); 
const emit = defineEmits(["discussionAdded"]);

const addForm = ref(false);
const discussion = ref({
  titre: "",
  contenu: "",
  upvote: 0,
  downvote: 0,
  authorName: "",
  authorPDP: "",
  date: new Date()
});

function addDiscussion() {
  if (!discussion.value.titre || !discussion.value.contenu) {
    alert("Please fill in all fields");
    return;
  }

  if (!userInfo?.value) {
    alert("You need to login or create an account first");
    return;
  }

  discussion.value.authorName = userInfo.value.username;
  discussion.value.authorPDP = userInfo.value.pdp;
  discussion.value.date = new Date();

  emit("discussionAdded", { ...discussion.value });

  // reset form
  discussion.value.titre = "";
  discussion.value.contenu = "";
  addForm.value = false;
}
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