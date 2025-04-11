<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/register">Register</router-link>
    <router-link to="/login">Login</router-link>
  </nav>
</template>

<style>
  nav {
    background-color: #333;
    color: white;
    padding: 10px;
    text-align: center;
  }
  nav a {
    color: white;
    margin-right: 10px;
    text-decoration: none;
  }
  nav a:hover {
    text-decoration: underline;
  }
</style>
