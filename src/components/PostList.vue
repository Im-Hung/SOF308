<template>
  <div class="container-fluid py-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-3 text-muted">Đang tải danh sách bài viết...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
      <i class="fas fa-exclamation-triangle me-2"></i>
      <div>{{ error }}</div>
    </div>

    <!-- Empty State -->
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
              :src="post.thumbnail"
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
              <div class="d-flex justify-content-between align-items-center mb-2">
                <small class="text-muted d-flex align-items-center">
                  <i class="fas fa-clock me-1"></i>
                  {{ formatDate(post.createdAt) }}
                </small>
                <small class="text-muted">
                  ID: {{ post.id }}
                </small>
              </div>
              
              <!-- Action Buttons với Dropdown -->
              <div class="d-flex gap-2">
                <!-- Nút Bình luận riêng -->
                <button class="btn btn-outline-success btn-sm flex-fill" @click="viewComments(post)">
                  <i class="fas fa-comments me-1"></i>Bình luận
                </button>
                
                <!-- Dropdown Menu cho các action -->
                <div class="dropdown">
                  <button 
                    class="btn btn-outline-secondary btn-sm dropdown-toggle" 
                    type="button" 
                    :id="`dropdownMenu${post.id}`"
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    :disabled="deleting === post.id"
                  >
                    <span v-if="deleting === post.id" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="fas fa-ellipsis-v"></i>
                  </button>
                  <ul class="dropdown-menu" :aria-labelledby="`dropdownMenu${post.id}`">
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="viewPost(post)">
                        <i class="fas fa-eye me-2 text-primary"></i>Xem chi tiết
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="editPost(post)">
                        <i class="fas fa-edit me-2 text-warning"></i>Chỉnh sửa
                      </a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                      <a class="dropdown-item text-danger" href="#" @click.prevent="deletePost(post.id)">
                        <i class="fas fa-trash me-2"></i>Xóa bài viết
                      </a>
                    </li>
                  </ul>
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
const deleting = ref(null);
const props = defineProps({ reload: Number });
const emit = defineEmits(['view-comments', 'edit-post']);

async function fetchPosts() {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch("http://localhost:3001/posts");
    if (!res.ok) throw new Error("Không thể lấy danh sách bài viết!");
    const data = await res.json();
    posts.value = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    error.value = err.message;
  }
  loading.value = false;
}

async function deletePost(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
  
  deleting.value = id;
  try {
    const res = await fetch(`http://localhost:3001/posts/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Không thể xóa bài viết!');
    
    posts.value = posts.value.filter(post => post.id !== id);
  } catch (err) {
    error.value = err.message;
  }
  deleting.value = null;
}

function editPost(post) {
  emit('edit-post', post);
}

function viewPost(post) {
  console.log('Viewing post:', post);
  // Có thể mở modal hoặc chuyển trang chi tiết
}

function viewComments(post) {
  emit('view-comments', post);
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
</script>

<style scoped>
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

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border-radius: 8px;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.dropdown-item.text-danger:hover {
  background-color: #f8d7da;
  color: #721c24 !important;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

@media (max-width: 768px) {
  .col-lg-6 {
    margin-bottom: 1rem;
  }
  
  .d-flex.gap-2 {
    flex-direction: column;
  }
}
</style>
