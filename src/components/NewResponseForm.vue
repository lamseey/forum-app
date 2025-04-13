<template>
  <!-- Add Response Button -->
  <button @click="addForm = !addForm" class="btn btn-primary">
    {{ addForm ? "Cancel" : "Add Response" }}
  </button>

  <!-- Modal Form for Adding Response -->
  <div v-if="addForm" class="modal-overlay">
    <div class="modal-content">
      <form @submit.prevent="addResponse">
        <textarea
          v-model="response.contenu"
          placeholder="Your response..."
          required
          class="form-textarea"
        ></textarea>
        <br />
        <button type="submit" class="submit-button btn btn-success">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';
import { ref, defineProps, inject } from 'vue';

const userInfo = inject('userDoc');
let props = defineProps({
  discussionId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["responseAdded"]);

let response = ref({
  contenu: "",
  date: new Date(),
  upvote: [],
  downvote: [],
  discussionId: props.discussionId,
  authorName: "",
  authorPDP: "",
  edited: false
});

const addForm = ref(false);

function addResponse() {
  if (response.value.contenu === "") {
    alert("Please fill in all fields");
    return;
  }

  if (!userInfo.value) {
    if (confirm("You need to login or create an account first")) {
      router.push("/login");
    }
    return;
  }

  response.value.authorName = userInfo.value.username;
  response.value.authorPDP = userInfo.value.pdp;
  response.value.authorId = userInfo.value.uid;
  emit("responseAdded", response.value);
  addForm.value = false;
  response.value = {
    contenu: "",
    date: new Date(),
    upvote: [],
    downvote: [],
    discussionId: props.discussionId,
    authorName: "",
    authorPDP: "",
    authorId: "",
  };
}
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* Modal Content */
.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
}

/* Textarea Styling */
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 15px;
}

.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

/* Submit Button */
.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

button {
  cursor: pointer;
}
</style>
