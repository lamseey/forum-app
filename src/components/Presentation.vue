<template>

    <section class="presentation-container text-center" ref="presentationSection">
      <div class="content">
        <img src="https://i.postimg.cc/XvNcyxhR/Logo-Sqwak.png" alt="Sqwak Logo" class="logo mb-3" />
        <h1 class="display-4 fw-bold text-success">Welcome to Sqwak</h1>
        <p class="lead text-muted">A space to share thoughts, memes, and meaningful discussions.</p>
        <div class="btn-group mt-4 mb-4">
          <button class="btn btn-success btn-lg me-3" @click="scrollDown">Explore Forum</button>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const presentationSection = ref(null)
  
  const scrollDown = () => {
    if (!presentationSection.value) return
    const sectionBottom = presentationSection.value.getBoundingClientRect().bottom + window.scrollY
    window.scrollTo({
      top: sectionBottom,
      behavior: 'smooth'
    })
  }
  </script>
  
  <style scoped>
  .presentation-container {
    height: 100vh;
    background-color: #ffffff;
    padding: 80px 20px;
    border-bottom: 6px solid #915039;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .content {
    max-width: 700px;
    margin: auto;
  }
  
  .logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #ffffff;
    padding: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .btn-group .btn {
    transition: transform 0.2s ease;
  }
  
  .btn-group .btn:hover {
    transform: scale(1.05);
  }
  </style>

