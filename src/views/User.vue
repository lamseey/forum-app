<template>
    <div v-if="user != null">
        <img :src="user.pdp" alt="" width="52px">
        <p>{{user.username}}</p>
        <p>{{user.email}}</p>
        <p>{{user.bio}}</p>
        <p>{{user.birthday}}</p>
        <p>{{created_at}}</p>
        <p>role: {{user.role}}</p>
        <p v-if="user.blocked">state: blocked</p>
        <p v-else> state: trusted</p>
        <button v-if="userInfo != null && userInfo.role == 'moderator' && user.role == 'user'" @click="makeUserModerator">Make Moderator</button>
        <button v-if="userInfo != null && userInfo.role == 'moderator' && user.role == 'moderator'" @click="revokeModerator">Revoke Moderator</button>
    </div>
</template>

<script setup>
import getUser from "@/composables/getUser";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { computed, inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const userInfo = inject('userDoc');
const route = useRoute();
let id = route.params.id;
const user = ref({});
const created_at = ref("");
onMounted(async () => {
    const userSnap = await getDoc(doc(db, 'users', id));
    if (userSnap.exists()) {
        user.value = userSnap.data();
        console.log(user);
        var a = new Date(user.value.createdAt.seconds*1000);
        created_at.value = a.toLocaleString();
        console.log(created_at.value);
    } else {
        console.log("error");
    }
})
async function revokeModerator() {
  const userRef = doc(db, 'users', id);
  try {
    await updateDoc(userRef, {
      role: 'user',
    })
    user.value.role = 'user';
    console.log('user is not longer moderator!');

  } catch (error) {
    console.error("can't make moderator", error);
  }
}

async function makeUserModerator() {
  const userRef = doc(db, 'users', id);
  try {
    await updateDoc(userRef, {
      role: 'moderator',
    })
    user.value.role = 'moderator';
    console.log('user is now moderator!');
  } catch (error) {
    console.error("can't make moderator", error);
  }
}
</script>

<style scoped>

</style>