<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4><i class="fas fa-user-edit me-2"></i>Bài viết của tôi</h4>
      <button class="btn btn-primary" @click="$emit('create-post')">
        <i class="fas fa-plus me-2"></i>Tạo bài viết mới
      </button>
    </div>

    <div v-if="userPosts.length > 0" class="row">
      <div 
        v-for="post in userPosts" 
        :key="post.id" 
        class="col-lg-6 mb-4"
      >
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h5 class="card-title">{{ post.title }}</h5>
              <div class="dropdown">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" 
                        data-bs-toggle="dropdown">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#" @click.prevent="$emit('edit-post', post)">
                      <i class="fas fa-edit me-2"></i>Chỉnh sửa
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item text-danger" href="#" @click.prevent="deletePost(post.id)">
                      <i class="fas fa-trash me-2"></i>Xóa
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <p class="card-text" v-html="truncateContent(post.content)"></p>
            
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">{{ formatDate(post.createdAt) }}</small>
              <div class="d-flex gap-2">
                <span class="badge bg-info">{{ post.viewCount || 0 }} lượt xem</span>
                <span class="badge bg-success">{{ post.likeCount || 0 }} thích</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="fas fa-pen fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">Bạn chưa có bài viết nào</h5>
      <button class="btn btn-primary mt-3" @click="$emit('create-post')">
        <i class="fas fa-plus me-2"></i>Tạo bài viết đầu tiên
      </button>
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

async function fetchUserPosts() {
  try {
    const res = await fetch(`http://localhost:3001/posts?authorId=${props.userId}`);
    const data = await res.json();
    userPosts.value = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error('Error fetching user posts:', err);
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

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN");
}

function truncateContent(content, maxLength = 100) {
  const textContent = content.replace(/<[^>]*>/g, '');
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...' 
    : textContent;
}

onMounted(fetchUserPosts);
watch(() => props.reload, fetchUserPosts);
</script>
