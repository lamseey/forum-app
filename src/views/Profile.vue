<template>
  <h1>Profile PAGE</h1>
  <div v-if="logged_in">
    <h2>{{ userDoc?.username }}</h2>
    <p>{{ userDoc?.bio }}</p>
    <img :src="userDoc?.pdp" width="52px" height="52px" alt="" />
  </div>
  <div v-else>
    <p>You're not logged in</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import getUser from "@/composables/getUser";

const { user } = getUser(); // reactive user
const db = getFirestore();

const logged_in = ref(false);
const userDoc = ref(null);

onMounted(async () => {
  if (user.value && user.value.uid) {
    logged_in.value = true;
    try {
      const docSnap = await getDoc(doc(db, "users", user.value.uid));
      if (docSnap.exists()) {
        userDoc.value = docSnap.data();
        console.log("User data:", userDoc.value);
      } else {
        console.log("No such user doc");
      }
    } catch (error) {
      console.error("Error loading user doc:", error);
    }
  } else {
    logged_in.value = false;
    console.log("No user logged in");
  }
});
</script>

<style scoped>
img {
  border-radius: 50%;
}
</style>
