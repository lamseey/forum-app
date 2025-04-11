<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/register">Register</router-link>
    <router-link to="/login">Login</router-link>
  </nav>
</template>

<style scoped>
nav {
  background: linear-gradient(90deg, #4caf50, #81c784);
  padding: 15px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

nav a {
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  text-decoration: none;
  margin: 0 15px;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.2s;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

nav a:active {
  transform: scale(1.05);
}
</style>