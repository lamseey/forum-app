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
import { ref, defineProps, inject } from 'vue';

const userInfo = inject('userDoc')
let properties = defineProps({
  discussionId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["responseAdded"]);

let response = ref({
  contenu: "",
  date: new Date(),
  upvote: 0,
  downvote: 0,
  discussionId: properties.discussionId,
  authorName: "",
  authorPDP: ""
});

const addForm = ref(false);
function addResponse() {
  if (response.value.titre === "" || response.value.contenu === "") {
    alert("Please fill in all fields");
    return;
  }
  if (!userInfo.value) {
    alert("You need to login or create an account first");
    return;
  }
  response.value.authorName = userInfo.value.username;
  response.value.authorPDP = userInfo.value.pdp;
  emit("responseAdded", response.value);
  addForm.value = false;
}

</script>