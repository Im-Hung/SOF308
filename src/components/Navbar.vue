<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
    <div class="container">
      <router-link class="navbar-brand fs-3 fw-bold text-primary" to="/">V-TEC</router-link>
      <ul class="navbar-nav me-auto ms-3">
        <li class="nav-item"><router-link class="nav-link" to="/blog">Bài Viết</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/qna">Câu Hỏi</router-link></li>
        <li class="nav-item">
          <router-link class="nav-link" to="/discussion">Thảo Luận</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/about">Về Chúng Tôi</router-link>
        </li>
      </ul>

      <form class="d-flex me-3">
        <input class="form-control" type="search" placeholder="Tìm kiếm trên Viblo" />
      </form>
      <router-link to="/login" class="btn btn1 btn-outline-primary btn-sm">Đăng nhập</router-link>
      <router-link to="/register" class="btn btn-outline-primary btn-sm">Đăng ký</router-link>
    </div>
  </nav>
</template>

<style scoped>
.btn1 {
  margin-right: 10px;
}
</style>
