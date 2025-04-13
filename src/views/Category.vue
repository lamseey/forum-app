<script setup>
import DiscussionList from "@/components/DiscussionList.vue";
import { onMounted, ref } from "vue";
import {getDoc , doc} from 'firebase/firestore';
import { db } from '/src/firebase';
import { useRoute } from 'vue-router';

const route = useRoute();
const category = ref({});
const categoryId = route.params.id;
async function fetchCategory() {
  const query = await getDoc(doc(db, "categories", categoryId));
  category.value = {
    id: query.id,
    ...query.data()
  };
}

onMounted(() => {
  fetchCategory();
})



</script>

<template>
  <h1>{{category.name}}</h1>
  <DiscussionList :categoryID="category.id"></DiscussionList>
</template>

<style scoped>

</style>