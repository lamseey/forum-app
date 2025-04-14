<template>
  <div class="container py-4">
    <div class="mb-4 fw-bold fs-5">Select a category:</div>

    <!-- Category Cards -->
    <div v-if="categories.length > 0" class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="category in categories.slice(0, 3)" :key="category.id" class="col">
        <router-link :to="'/category/' + category.id" class="text-decoration-none">
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <h5 class="card-title text-primary">{{ category.name }}</h5>
            </div>
          </div>
        </router-link>
      </div>
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

