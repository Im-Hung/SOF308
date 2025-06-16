<!-- src/layouts/MainLayout.vue -->
<template>
  <div>
    <!-- Navbar -->
    <Navbar />

    <!-- Banner -->
    <div class="banner">
      🎉 Viblo May Fest đã khép lại. Cảm ơn các bạn đã đồng hành cùng chúng tôi trong sứ mệnh lan
      tỏa tri thức Việt!
    </div>

    <!-- Main content + Sidebar -->
    <div class="container mt-4">
      <div class="row">
        <!-- Main Content -->
        <div>
          <router-view />
          <!-- Chỗ các trang con sẽ hiển thị -->
        </div>

        <!-- Sidebar -->
        <!-- <Sidebar /> -->
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
// Tách các phần navbar, sidebar, footer ra component riêng cho sạch
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import Footer from '../components/Footer.vue'
</script>

<style scoped>
/* Style giữ nguyên hoặc tuỳ chỉnh nhẹ */
</style>
