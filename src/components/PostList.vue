<template>
  <div class="container-fluid">
    <!-- Guest Notice -->
    <div v-if="isGuest" class="alert alert-info mb-4">
      <i class="fas fa-info-circle me-2"></i>
      <strong>Chào mừng!</strong> Bạn đang xem ở chế độ khách. 
      <button class="btn btn-link p-0 ms-2" @click="$emit('show-login')">
        Đăng nhập
      </button> để thích, bình luận và tạo bài viết.
    </div>

    <!-- Posts Grid -->
    <div v-if="posts.length > 0" class="row">
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
          </div>
          
          <!-- Card Body -->
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-primary mb-2">
              {{ post.title }}
            </h5>
            
            <div class="card-text flex-grow-1 mb-3">
              <div class="content-preview" v-html="truncateContent(post.content)"></div>
            </div>
            
            <!-- Author & Date -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <small class="text-muted">
                <i class="fas fa-user me-1"></i>{{ getAuthorName(post.authorId) }}
              </small>
              <small class="text-muted">
                <i class="fas fa-clock me-1"></i>{{ formatDate(post.createdAt) }}
              </small>
            </div>
            
            <!-- Like/Dislike - Only for authenticated users -->
            <div v-if="hasPermission(PERMISSIONS.LIKE_POSTS)" class="mb-3">
              <LikeDislike 
                :post-id="post.id" 
                @reaction-updated="$emit('reaction-updated')"
              />
            </div>
            <div v-else class="mb-3">
              <div class="text-muted small text-center p-2 bg-light rounded">
                <i class="fas fa-lock me-1"></i>
                Đăng nhập để thích bài viết
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm flex-fill" @click="viewPost(post)">
                <i class="fas fa-eye me-1"></i>Xem
              </button>
              
              <button 
                v-if="hasPermission(PERMISSIONS.COMMENT_POSTS)"
                class="btn btn-outline-success btn-sm flex-fill" 
                @click="viewComments(post)"
              >
                <i class="fas fa-comments me-1"></i>Bình luận
              </button>
              
              <!-- Edit/Delete for authorized users -->
              <div v-if="canEditPost(post) || canDeletePost(post)" class="dropdown">
                <button 
                  class="btn btn-outline-secondary btn-sm dropdown-toggle" 
                  type="button" 
                  :id="`dropdownMenu${post.id}`"
                  data-bs-toggle="dropdown"
                >
                  <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu">
                  <li v-if="canEditPost(post)">
                    <a class="dropdown-item" href="#" @click.prevent="$emit('edit-post', post)">
                      <i class="fas fa-edit me-2"></i>Sửa
                    </a>
                  </li>
                  <li v-if="canDeletePost(post)">
                    <a class="dropdown-item text-danger" href="#" @click.prevent="deletePost(post.id)">
                      <i class="fas fa-trash me-2"></i>Xóa
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-5">
      <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">Chưa có bài viết nào</h5>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import LikeDislike from "@/components/LikeDislike.vue";
import { useAuth } from '@/composables/auth';

const { 
  isGuest, 
  hasPermission, 
  canEditPost, 
  canDeletePost, 
  PERMISSIONS 
} = useAuth();

const props = defineProps({
  reload: Number,
  showAll: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['edit-post', 'reaction-updated', 'show-login']);

const posts = ref([]);
const loading = ref(false);

async function fetchPosts() {
  loading.value = true;
  try {
    const res = await fetch("http://localhost:3001/posts");
    const data = await res.json();
    posts.value = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error('Error fetching posts:', err);
  }
  loading.value = false;
}

async function deletePost(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
  
  try {
    const res = await fetch(`http://localhost:3001/posts/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      posts.value = posts.value.filter(post => post.id !== id);
    }
  } catch (err) {
    console.error('Error deleting post:', err);
  }
}

function viewPost(post) {
  console.log('Viewing post:', post);
}

function viewComments(post) {
  console.log('Viewing comments for:', post);
}

function getAuthorName(authorId) {
  const authors = { 1: 'Admin', 2: 'HungVu' };
  return authors[authorId] || 'Unknown';
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN");
}

function truncateContent(content, maxLength = 150) {
  const textContent = content.replace(/<[^>]*>/g, '');
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...' 
    : textContent;
}

onMounted(fetchPosts);
watch(() => props.reload, fetchPosts);
</script>
