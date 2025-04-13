<template>
  <Navbar/>
  <router-view />
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { ref, watch, provide } from "vue"
import { getFirestore, getDoc, doc } from "firebase/firestore"
import getUser from "@/composables/getUser"

const { user } = getUser()
const db = getFirestore()

const logged_in = ref(false)
const userDoc = ref(null)

provide('logged_in', logged_in)
provide('userDoc', userDoc)

// reactively update login status & fetch current user info
watch(user, async (newUser) => {
  if (newUser && newUser.uid) {
    logged_in.value = true
    try {
      const docSnap = await getDoc(doc(db, "users", newUser.uid))
      if (docSnap.exists()) {
        userDoc.value = {
          uid: newUser.uid,
          ...docSnap.data()
        }
      } else {
        console.log("No such user doc")
      }
    } catch (error) {
      console.error("Error loading user doc:", error)
    }
  } else {
    logged_in.value = false
    userDoc.value = null
    console.log("No user logged in")
  }
}) 
</script>

<style>
  * {
    font-family: Arial, sans-serif;
    font-size: 105%;
  }
  body {
    background-color: #f2f7f3; /* light green background */
  }
</style>