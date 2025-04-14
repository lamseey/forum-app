<template>
  <div class="container py-4">
    <div class="mb-3 fw-bold fs-5">Select a category:</div>

    <!-- Category List -->
    <div v-if="categories.length > 0">
      <ul class="list-group">
        <li
          v-for="category in categories.slice(0, 3)"
          :key="category.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <router-link :to="'/category/' + category.id" class="text-decoration-none text-dark">
            {{ category.name }}
          </router-link>
          <i class="bi bi-chevron-right text-muted"></i>
        </li>
      </ul>
    </div>

    <!-- Show more categories -->
    <div v-if="categories.length > 3" class="mt-4 text-center">
      <router-link to="/categorylist" class="btn btn-outline-primary">
        Show more categories
      </router-link>
    </div>
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

