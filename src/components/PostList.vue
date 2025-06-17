<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <!-- Header -->
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-gradient-primary text-white">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <i class="fas fa-newspaper me-2"></i>
                <h4 class="mb-0">Danh sách bài viết</h4>
              </div>
              <div class="d-flex align-items-center">
                <span class="badge bg-light text-dark me-2">
                  {{ posts.length }} bài viết
                </span>
                <button 
                  @click="fetchPosts" 
                  class="btn btn-outline-light btn-sm"
                  :disabled="loading"
                >
                  <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State! -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-3 text-muted">Đang tải danh sách bài viết...</p>
        </div>

        <!-- Error State! -->
        <div v-else-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>
          <div>{{ error }}</div>
        </div>

        <div v-else-if="posts.length === 0" class="text-center py-5">
          <div class="card border-0">
            <div class="card-body">
              <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
              <h5 class="text-muted">Chưa có bài viết nào</h5>
              <p class="text-muted">Hãy tạo bài viết đầu tiên của bạn!</p>
            </div>
          </div>
        </div>

        <!-- Posts Grid -->
        <div v-else class="row">
          <div 
            v-for="post in posts" 
            :key="post.id" 
            class="col-lg-6 col-xl-4 mb-4"
          >
            <div class="card h-100 shadow-sm border-0 post-card">
              <!-- Thumbnail -->
              <div v-if="post.thumbnail" class="position-relative">
                <img
                  :src="`/images/${post.thumbnail}`"
                  :alt="post.title"
                  class="card-img-top"
                  style="height: 200px; object-fit: cover;"
                />
                <div class="position-absolute top-0 end-0 m-2">
                  <span class="badge bg-primary">
                    <i class="fas fa-image me-1"></i>Có ảnh
                  </span>
                </div>
              </div>
              
              <!-- Card Body -->
              <div class="card-body d-flex flex-column">
                <div class="mb-2">
                  <h5 class="card-title fw-bold text-primary mb-2">
                    {{ post.title }}
                  </h5>
                </div>
                
                <!-- Content Preview -->
                <div class="card-text flex-grow-1 mb-3">
                  <div 
                    class="content-preview" 
                    v-html="truncateContent(post.content)"
                  ></div>
                </div>
                
                <!-- Footer -->
                <div class="card-footer bg-transparent border-0 px-0 pb-0">
                  <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted d-flex align-items-center">
                      <i class="fas fa-clock me-1"></i>
                      {{ formatDate(post.createdAt) }}
                    </small>
                    <div class="btn-group" role="group">
                      <button class="btn btn-outline-primary btn-sm" @click="viewPost(post)">
                        <i class="fas fa-eye me-1"></i>Xem
                      </button>
                      <button class="btn btn-outline-secondary btn-sm">
                        <i class="fas fa-share me-1"></i>Chia sẻ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const posts = ref([]);
const loading = ref(true);
const error = ref("");
const props = defineProps({ reload: Number });

async function fetchPosts() {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch("http://localhost:3001/posts");
    if (!res.ok) throw new Error("Không thể lấy danh sách bài viết!");
    posts.value = await res.json();
  } catch (err) {
    error.value = err.message;
  }
  loading.value = false;
}

onMounted(fetchPosts);

watch(() => props.reload, () => {
  fetchPosts();
});

function formatDate(dateString) {
  const options = { 
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit", 
    hour: "2-digit", 
    minute: "2-digit" 
  };
  return new Date(dateString).toLocaleDateString("vi-VN", options);
}

function truncateContent(content, maxLength = 150) {
  const textContent = content.replace(/<[^>]*>/g, '');
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...' 
    : textContent;
}

function viewPost(post) {
  // Logic để xem chi tiết bài viết
  console.log('Viewing post:', post);
}
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.post-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.card-img-top {
  transition: transform 0.3s ease;
}

.post-card:hover .card-img-top {
  transform: scale(1.05);
}

.content-preview {
  line-height: 1.6;
  color: #6c757d;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

@media (max-width: 768px) {
  .col-lg-6 {
    margin-bottom: 1rem;
  }
}
</style>
