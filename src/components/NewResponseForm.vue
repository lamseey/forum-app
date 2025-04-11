<template>
  <button @click = "addForm = !addForm">
    {{(addForm) ? "Cancel": "Add response" }}
  </button>
  <div v-if="addForm">
    <form>
      <textarea v-model="response.contenu" placeholder="Contenu" required class="form-textarea"></textarea>
      <br>
      <button @click.prevent="addResponse" class="submit-button">Submit</button>
    </form>
  </div>
</template>
<script setup>
import { ref, defineProps } from 'vue';

let properties = defineProps({
  discussionId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["responseAdded"]);

let response = ref({
  contenu: "",
  date: null,
  upvote: 0,
  downvote: 0,
});

const addForm = ref(false);
function addResponse() {
  if (response.value.titre === "" || response.value.contenu === "") {
    alert("Please fill in all fields");
    return;
  }
  response.value.date = new Date();
  response.value.discussionId = properties.discussionId;
  emit("responseAdded", response.value);
  addForm.value = false;
}

</script>