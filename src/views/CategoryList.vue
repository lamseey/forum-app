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
  <h1>Category list</h1>
  <div v-for="category in categories" :key="category.id">
    <router-link :to="'/category/' + category.id">{{category.name}}</router-link>
  </div>

</template>

<style scoped>

</style>