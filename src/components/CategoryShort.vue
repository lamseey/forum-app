<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
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
  <div>
    <h1 v-if="categories.length > 0">{{categories[0]}}</h1>
  </div>
  <div>
    <h1 v-if="categories.length > 1">{{categories[1]}}</h1>
  </div>
  <div>
    <h1 v-if="categories.length > 2">{{categories[2]}}</h1>
  </div>
  <button @click="showMoreCategories">
    Show more categories
  </button>
</template>

<style scoped>

</style>