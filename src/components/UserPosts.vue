<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4><i class="fas fa-user-edit me-2"></i>Bài viết của tôi</h4>
    </div>

    <div v-if="userPosts.length > 0" class="row">
      <div 
        v-for="post in userPosts" 
        :key="post.id" 
        class="col-12 mb-4"
      >
        <div class="card shadow-lg border-primary post-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h5 class="card-title fw-bold text-primary">{{ post.title }}</h5>
              <div class="dropdown">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" 
                        data-bs-toggle="dropdown">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <a class="dropdown-item" href="#" @click.prevent="$emit('edit-post', post)">
                      <i class="fas fa-edit me-2 text-warning"></i>Chỉnh sửa
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item text-danger" href="#" @click.prevent="deletePost(post.id)">
                      <i class="fas fa-trash me-2"></i>Xóa
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <p class="card-text text-muted" v-html="truncateContent(post.content)"></p>
            
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">
                <i class="fas fa-clock me-1"></i>{{ formatDate(post.createdAt) }}
              </small>
              <div class="d-flex gap-2">
                <span class="badge bg-success">
                  <i class="fas fa-thumbs-up me-1"></i>{{ getPostLikes(post.id) }} thích
                </span>
                <span class="badge bg-danger">
                  <i class="fas fa-thumbs-down me-1"></i>{{ getPostDislikes(post.id) }} không thích
                </span>
                <span class="badge bg-info">
                  <i class="fas fa-comments me-1"></i>{{ getPostComments(post.id) }} bình luận
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <div class="card shadow-sm border-0">
        <div class="card-body">
          <i class="fas fa-pen fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Bạn chưa có bài viết nào</h5>
          <p class="text-muted">Hãy tạo bài viết đầu tiên để chia sẻ ý tưởng của bạn!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuth } from '@/composables/auth';

const { currentUser } = useAuth();

const props = defineProps({
  userId: String,
  reload: Number
});

const emit = defineEmits(['edit-post', 'create-post']);

const userPosts = ref([]);
const reactions = ref([]);
const comments = ref([]);

async function fetchUserPosts() {
  try {
    const res = await fetch(`http://localhost:3001/posts?authorId=${props.userId}`);
    const data = await res.json();
    userPosts.value = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error('Error fetching user posts:', err);
  }
}

async function fetchReactions() {
  try {
    const res = await fetch('http://localhost:3001/reactions');
    reactions.value = await res.json();
  } catch (err) {
    console.error('Error fetching reactions:', err);
  }
}

async function fetchComments() {
  try {
    const res = await fetch('http://localhost:3001/comments');
    comments.value = await res.json();
  } catch (err) {
    console.error('Error fetching comments:', err);
  }
}

async function deletePost(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
  
  try {
    const res = await fetch(`http://localhost:3001/posts/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      userPosts.value = userPosts.value.filter(post => post.id !== id);
    }
  } catch (err) {
    console.error('Error deleting post:', err);
  }
}

function getPostLikes(postId) {
  return reactions.value.filter(r => r.postId === postId && r.type === 'like').length;
}

function getPostDislikes(postId) {
  return reactions.value.filter(r => r.postId === postId && r.type === 'dislike').length;
}

function getPostComments(postId) {
  return comments.value.filter(c => c.postId === postId).length;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit", 
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function truncateContent(content, maxLength = 150) {
  const textContent = content.replace(/<[^>]*>/g, '');
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...' 
    : textContent;
}

async function loadAllData() {
  await Promise.all([
    fetchUserPosts(),
    fetchReactions(),
    fetchComments()
  ]);
}

onMounted(loadAllData);
watch(() => props.reload, loadAllData);
</script>

<style scoped>
.post-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
}

.card-title {
  font-size: 1.25rem;
  line-height: 1.4;
}

.card-text {
  line-height: 1.6;
  font-size: 0.95rem;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
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

@media (max-width: 768px) {
  .d-flex.justify-content-between {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem;
  }
  
  .d-flex.gap-2 {
    flex-wrap: wrap;
    gap: 0.5rem !important;
  }
  
  .badge {
    font-size: 0.75rem;
    padding: 0.3rem 0.5rem;
  }
}
</style>
