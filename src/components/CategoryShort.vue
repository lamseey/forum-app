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
    <router-link :to="'/category/' + categories[0].id" v-if="categories.length > 0">{{categories[0].name}}</router-link>
  </div>
  <div>
    <router-link :to="'/category/' + categories[1].id" v-if="categories.length > 1">{{categories[1].name}}</router-link>
  </div>
  <div>
    <router-link :to="'/category/' + categories[2].id" v-if="categories.length > 2">{{categories[2].name}}</router-link>
  </div>
  <router-link to="/categorylist">
    <h1 v-if="categories.length > 3">Show more categories</h1>
  </router-link>
</template>

<style scoped>

</style>