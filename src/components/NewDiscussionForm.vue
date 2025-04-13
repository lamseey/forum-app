<template>
  <button @click="addForm = !addForm" class="toggle-button">
    {{ addForm ? "Cancel" : "Add Discussion" }}
  </button>
  <form v-if="addForm" class="discussion-form">
    <input v-model="discussion.titre" placeholder="Titre" required class="form-input">
    <br>
    <textarea v-model="discussion.contenu" placeholder="Contenu" required class="form-textarea"></textarea>
    <br>
    <select v-if="notSelected" multiple>
      <option disabled value="">Select your category</option>
      <option @click="addCategory">Add a new category</option>
      <option v-for="category in categories" :key="category.id" @click="discussion.category = category; notSelected = false" :value="category.name">
        {{ category.name }}
      </option>
    </select>
    <p v-else>
      <strong>Selected Category:</strong> {{ discussion.category.name }}
      <button @click="notSelected = true">Change Category</button>
    </p>
    <button @click.prevent="addDiscussion" class="submit-button">Submit</button>
  </form>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "/src/firebase";
import router from '@/router';


const userInfo = inject('userDoc'); 
const emit = defineEmits(["discussionAdded"]);

const addForm = ref(false);
const categories = ref([])
let notSelected = ref(true);
const discussion = ref({
  titre: "",
  contenu: "",
  authorName: "",
  authorId: "",
  authorPDP: "",
  upvoters: [],
  downvoters: [],
  category: {
    name: "",
    id: "",
  },
  edited: false,
  date: new Date()
});

async function fetchCategories() {
  const query = await getDocs(collection(db, "categories"));
  categories.value = query.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
onMounted(() => {
  fetchCategories();
});

function addCategory() {
  const newCategory = prompt("Enter the name of the new category:");
  if (newCategory) {
    addDoc(collection(db, "categories"), { name: newCategory });
    fetchCategories();
  }
}


function addDiscussion() {
  if (!discussion.value.titre || !discussion.value.contenu) {
    alert("Please fill in all fields");
    return;
  }

  if (!userInfo?.value) {
    if (confirm("You need to login or create an account first")) {
      router.push("/login");
    }
    return;
  }

  discussion.value.authorName = userInfo.value.username;
  discussion.value.authorPDP = userInfo.value.pdp;
  discussion.value.date = new Date();
  discussion.value.authorId = userInfo.value.uid;

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