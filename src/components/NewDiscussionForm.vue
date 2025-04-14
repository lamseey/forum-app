<template>
  <div class="container mt-4">
    <button @click="openForm" class="btn btn-primary mb-3">
      {{ addForm ? "Cancel" : "Add Discussion" }}
    </button>

    <form v-if="addForm" class="card p-4 mb-4">
      <div class="mb-3">
        <input v-model="discussion.titre" placeholder="Titre" required class="form-control">
      </div>

      <div class="mb-3">
        <textarea v-model="discussion.contenu" placeholder="Contenu" required class="form-control" rows="5"></textarea>
      </div>

      <div class="mb-3">
        <div v-if="notSelected" class="card p-3">
          <label class="form-label">Select category</label>
          <select class="form-select" multiple>
            <option disabled value="">Select your category</option>
            <option @click="addCategory">Add a new category</option>
            <option v-for="category in categories"
                    :key="category.id"
                    @click="discussion.category = category; notSelected = false"
                    :value="category.name">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div v-else class="card p-3">
          <p class="mb-2"><strong>Selected Category:</strong> {{ discussion.category.name }}</p>
          <button @click="notSelected = true" class="btn btn-sm btn-outline-secondary">Change Category</button>
        </div>
      </div>

      <div class="mb-3" v-if="discussion.category.name">
        <div v-if="notSelected2" class="card p-3">
          <label class="form-label">Select subcategory</label>
          <select class="form-select" multiple>
            <option disabled value="">Select your subcategory</option>
            <option @click="addSubCategory">Add a new subcategory</option>
            <option v-for="subcategory in discussion.category.subcategories"
                    :key="subcategory.id"
                    @click="discussion.category.subcategories.push(subcategory); notSelected2 = false"
                    :value="subcategory.name">
              {{ subcategory.name }}
            </option>
          </select>
        </div>
        <div v-else class="card p-3">
          <p class="mb-2"><strong>Selected Subcategory:</strong> {{ discussion.subcategory }}</p>
          <button @click="notSelected2 = true" class="btn btn-sm btn-outline-secondary">Change SubCategory</button>
        </div>
      </div>

      <button @click.prevent="addDiscussion" class="btn btn-success">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "/src/firebase";
import router from '@/router';


const userInfo = inject('userDoc'); 
const emit = defineEmits(["discussionAdded"]);
const props = defineProps(
  {
    categoryID: {
      type: String,
      required: false
    }
  }
)

const addForm = ref(false);
const categories = ref([])
let notSelected = ref(true);
let notSelected2 = ref(true);
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
    subcategories: []
  },
  subcategory: "",
  edited: false,
  date: new Date()
});

function openForm() {
  addForm.value = !addForm.value; notSelected.value = !(props.categoryID);
  if (props.categoryID) {
    discussion.value.category = categories.value.find(category => category.id === props.categoryID);
  }
}

function addSubCategory() {
  const newSubCategory = prompt("Enter the name of the new subcategory:");
  if (newSubCategory && categories.value.indexOf(newSubCategory) === -1) {
    discussion.value.category.subcategories.push({ name: newSubCategory });
    discussion.value.subcategory = newSubCategory;
    updateDoc(doc(db, "categories", discussion.value.category.id), {
      subcategories: discussion.value.category.subcategories
    });
    fetchCategories();
  }
  else{
    alert("Subcategory already exists or invalid name");
  }
}

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
    addDoc(collection(db, "categories"), { name: newCategory, subcategories: [] });
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