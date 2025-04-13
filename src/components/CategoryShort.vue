<template>
  <div class="container mt-4">
    <div>Select a categorie : </div>
    <!-- Category List -->
    <div v-if="categories.length > 0">
      <ul class="list-group">
        <li v-for="category in categories.slice(0, 3)" :key="category.id" class="list-group-item">
          <router-link :to="'/category/' + category.id" class="text-decoration-none">
            {{ category.name }}
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Show more categories -->
    <router-link to="/categorylist" class="d-block mt-4">
      <h1 v-if="categories.length > 3" class="btn btn-link">
        Show more categories
      </h1>
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '/src/firebase';

const categories = ref([]);

onMounted(() => {
  fetchCategories();
});

async function fetchCategories() {
  const query = await getDocs(collection(db, "categories"));
  categories.value = query.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
}
</script>

