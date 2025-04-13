<template>
  <nav class="navbar navbar-expand-lg px-4 py-2 shadow" style="background-color: #2e7d32;">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <!-- Logo qui redirige vers le HOME -->
      <router-link class="navbar-brand d-flex align-items-center text-white fw-bold fs-4 me-4" to="/">
        <img src="https://i.postimg.cc/XvNcyxhR/Logo-Sqwak.png" alt="logo" width="40" class="me-2">
        Sqwak
      </router-link>

      <!-- Barre de Recherche -->
      <form class="d-flex flex-grow-1 mx-4" role="search">
        <input v-model="search" @keyup.enter="searchDiscussion" class="form-control me-2" type="search" placeholder="Search Squaks..." aria-label="Search">
        <button class="btn btn-light" @keyup.enter="searchDiscussion" type="submit">Search</button>
      </form>

      <!-- User / Guest section -->
      <div class="d-flex align-items-center position-relative">

      <!-- Notification icon (always takes space, toggles visibility) -->
      <div class="notif-placeholder me-3">
        <button class="btn position-relative text-white p-0" v-show="logged_in">
          <i class="bi bi-bell-fill fs-5"></i>
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            3
          </span>
        </button>
      </div>

        <!-- Dropdown -->
        <div class="dropdown">
          <button class="btn dropdown-toggle d-flex align-items-center text-white" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <img
              v-if="logged_in"
              :src="userInfo?.pdp"
              alt="pdp"
              class="rounded-circle me-2"
              width="40"
              height="40"
            />
            <span class="fw-semibold">{{ logged_in ? userInfo?.username : 'Guest' }}</span>
          </button>

          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <template v-if="!logged_in">
              <li><router-link class="dropdown-item" to="/register">Register</router-link></li>
              <li><router-link class="dropdown-item" to="/login">Login</router-link></li>
            </template>
            <template v-else>
              <li><router-link class="dropdown-item" to="/profile">View Profile</router-link></li>
              <li><button class="dropdown-item text-danger" @click="logout">Logout</button></li>
            </template>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom brown border -->
    <div class="brown-accent position-absolute bottom-0 start-0 w-100" style="height: 6px;"></div>
  </nav>
</template>

<script setup>
import { inject, ref } from 'vue'
import { signOut } from "firebase/auth"
import { auth } from "@/firebase"
import router from "@/router"

const search = ref("");
const logged_in = inject('logged_in')
const userInfo = inject('userDoc')
const logout = async () => {
  try {
    await signOut(auth)
    console.log("Logged out successfully")
    router.push("/")
  } catch (err) {
    console.log("Error while logging out:", err)
  }
}

const searchDiscussion = () => {
  if (search.value) {
    router.push({ path: '/search', query: { q: search.value } })
  }
}
</script>

<style scoped>
.brown-accent {
  background-color: #915039;
  border-radius: 0 0 8px 8px;
}

/* Logo image */
.navbar-brand img {
  border-radius: 50%;
}

/* Dropdown tweaks */
.dropdown-toggle {
  background-color: transparent;
  padding: 6px 12px;
  border-radius: 7px;
  transition: all 0.2s ease;
}


.dropdown-menu {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  padding: 10px 0;
}

.dropdown-item {
  font-weight: 500;
  padding: 10px 20px;
  color: #333;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.dropdown-item.text-danger {
  color: #d9534f;
}

.dropdown-item.text-danger:hover {
  background-color: #fbeaea;
}

/* PDP image */
.dropdown-toggle img {
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

/* Notification icon */
.notif-placeholder {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

button, .btn {
  transition: transform 0.2s ease, background-color 0.2s ease;
}

button:hover {
  transform: scale(1.03);
}
</style>