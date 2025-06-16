<template>
  <div>
    <!-- Navbar -->

    <!-- Content -->
    <div class="container mt-4">
      <div class="row">
        <!-- Left Column -->
        <div class="col-lg-8">
          <div class="post-card">
            <div class="post-title">🚀 Viblo Mayfest 2025 | Công bố kết quả CHÍNH THỨC</div>
            <div class="post-meta">
              Viblo Team · 2 giờ trước · <span class="badge bg-primary">Announcement</span>
            </div>
          </div>

          <div class="post-card">
            <div class="post-title">📚 Học viên Pro nhận offer ANZ sau chuỗi bài tập!</div>
            <div class="post-meta">
              EngineerPro · 5 giờ trước · <span class="badge bg-secondary">Tag1</span>
              <span class="badge bg-secondary">Career</span>
            </div>
          </div>

          <div class="post-card">
            <div class="post-title">🔐 Keycloak API Document</div>
            <div class="post-meta">
              Minh Phạm · 7 giờ trước · <span class="badge bg-secondary">OAuth</span>
            </div>
          </div>

          <!-- Phân trang -->
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <router-link class="page-link" to="/pagi">1</router-link>
              </li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item"><a class="page-link" href="#">...</a></li>
              <li class="page-item"><a class="page-link" href="#">2074</a></li>
            </ul>
          </nav>
        </div>

        <!-- Right Column -->
        <div class="col-lg-4">
          <div class="sidebar-box">
            <h6 class="fw-bold mb-3">📌 Câu hỏi mới nhất</h6>
            <p class="mb-1">Cách sử dụng ransackable_scopes trong ROR?</p>
            <small class="text-muted">7 giờ trước · 10 lượt xem</small>
            <hr />
            <p class="mb-1">Chạy docker với nextjs app bị lỗi</p>
            <small class="text-muted">3 giờ trước · 90 lượt xem</small>
          </div>

          <div class="sidebar-box">
            <h6 class="fw-bold mb-3">🏆 Các tác giả hàng đầu</h6>

            <div class="d-flex align-items-center mb-2">
              <img src="https://i.pravatar.cc/36?img=1" class="author-img me-2" />
              <div>
                <div class="fw-bold">Minh Monem</div>
                <small>4.6K 🌟 · 351.7K 👁️</small>
              </div>
            </div>

            <div class="d-flex align-items-center mb-2">
              <img src="https://i.pravatar.cc/36?img=2" class="author-img me-2" />
              <div>
                <div class="fw-bold">Viblo Algorithm</div>
                <small>11.4K 🌟 · 1.8M 👁️</small>
              </div>
            </div>

            <div class="d-flex align-items-center">
              <img src="https://i.pravatar.cc/36?img=3" class="author-img me-2" />
              <div>
                <div class="fw-bold">Quang Binh Trương</div>
                <small>136 🌟 · 1.0K 👁️</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
  </div>
</template>

<script setup>
// Tạm thời chưa cần xử lý logic, sẽ thêm sau
</script>

<style>
body {
  background: #f7f9fc;
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
}

.navbar {
  backdrop-filter: blur(6px);
  border-radius: 0 0 10px 10px;
}

.banner {
  background: linear-gradient(90deg, #5a00e0, #7f3dff);
  color: white;
  padding: 12px;
  text-align: center;
  font-weight: 600;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  font-size: 0.95rem;
}

.post-card,
.sidebar-box {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #e3e7ed;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

.post-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.post-meta {
  font-size: 0.85rem;
  color: #666;
}

.footer {
  background: #0b1c3a;
  color: #eee;
  padding: 40px 0;
  font-size: 0.9rem;
}

.footer a {
  color: #ccc;
  text-decoration: none;
  display: block;
  margin-bottom: 6px;
}

.footer a:hover {
  color: #fff;
}

.footer .title {
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
}

.author-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
}

.pagination .page-link {
  background: white;
  border: 1px solid #ddd;
  margin: 0 4px;
  color: #333;
  transition: all 0.2s ease;
}

.pagination .page-link:hover {
  background: #eef1f7;
}

input.form-control {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ccc;
  color: #333;
  padding: 6px 10px;
  font-size: 0.9rem;
  border-radius: 6px;
  box-shadow: none;
  transition: border 0.2s;
}

input.form-control:focus {
  border-color: #0d6efd;
  outline: none;
  box-shadow: 0 0 0 0.1rem rgba(13, 110, 253, 0.25);
}
</style>
