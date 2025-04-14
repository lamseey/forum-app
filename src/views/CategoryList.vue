<script setup>
import { ref, onMounted } from 'vue';
import {getDocs , collection} from 'firebase/firestore';
import { db } from '/src/firebase';

const categories = ref([]);
onMounted(() => {
  fetchCategories();
})
async function fetchCategories() {
  const query = await getDocs(collection(db, "categories"));
  categories.value = query.docs.map( doc => ({
    id: doc.id,
    ... doc.data()
      })
  );
}
</script>

<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Category List</h1>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="category in categories" :key="category.id">
        <div class="card h-100">
          <router-link
            :to="'/category/' + category.id"
            class="text-decoration-none"
          >
            <div class="card-body text-center">
              <h5 class="card-title">{{ category.name }}</h5>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.card-body {
  padding: 1.5rem;

}
.card-title {
  color: blue;
  margin: 0;
}
</style>