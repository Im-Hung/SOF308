<script setup>
import { ref, onMounted } from "vue";
import FormPost from "@/components/FormPost.vue";
import PostList from "@/components/PostList.vue";
import { useStats } from '@/composables/useStats';

const reloadCounter = ref(0);
const editingPost = ref(null);
const showForm = ref(false);

const {
  totalPosts,
  totalViews,
  totalLikes,
  totalDislikes,
  totalComments,
  fetchStats,
  incrementViewCount
} = useStats();

// Handle post success (create or update)
function handlePostSuccess() {
  reloadCounter.value++;
  editingPost.value = null;
  showForm.value = false;
  fetchStats(); // Refresh stats
}

// Handle edit post from PostList
function handleEditPost(post) {
  editingPost.value = post;
  showForm.value = true;
}

// Handle cancel edit
function handleCancelEdit() {
  editingPost.value = null;
  showForm.value = false;
}

// Toggle form visibility
function toggleForm() {
  if (showForm.value && editingPost.value) {
    if (confirm('Bạn có muốn hủy chỉnh sửa bài viết này?')) {
      editingPost.value = null;
      showForm.value = false;
    }
  } else {
    showForm.value = !showForm.value;
    if (!showForm.value) {
      editingPost.value = null;
    }
  }
}

// Create new post
function createNewPost() {
  editingPost.value = null;
  showForm.value = true;
}

// ✅ THÊM FUNCTION NÀY để nhận events từ LikeDislike
function handleReactionUpdate() {
  fetchStats(); // Refresh stats khi có like/dislike
}

onMounted(() => {
  fetchStats();
});
</script>

<template>
  <div class="container mt-4">
    <!-- Hero Section -->
    <div class="hero-section mb-5">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <h1 class="display-5 fw-bold text-primary mb-3">📝 Quản lý bài viết</h1>
          <p class="lead text-muted mb-4">
            Tạo, chỉnh sửa và quản lý các bài viết của bạn một cách dễ dàng và hiệu quả
          </p>
        </div>
        <div class="col-lg-4 text-lg-end">
          <button 
            @click="toggleForm" 
            :class="`btn btn-lg ${showForm ? 'btn-outline-secondary' : 'btn-primary'} px-4 py-2`"
          >
            <i :class="`fas ${showForm ? 'fa-times' : 'fa-plus'} me-2`"></i>
            {{ showForm ? (editingPost ? 'Hủy chỉnh sửa' : 'Đóng form') : 'Tạo bài viết mới' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Form Section -->
    <div v-if="showForm" class="form-section mb-5">
      <div class="card shadow-lg border-0 form-card">
        <div class="card-header bg-gradient-primary text-white py-3">
          <div class="d-flex align-items-center">
            <i :class="`fas ${editingPost ? 'fa-edit' : 'fa-plus'} me-3 fs-4`"></i>
            <div>
              <h4 class="mb-1">{{ editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới' }}</h4>
              <p class="mb-0 opacity-75">
                {{ editingPost ? 'Cập nhật nội dung bài viết của bạn' : 'Chia sẻ ý tưởng và kiến thức với cộng đồng' }}
              </p>
            </div>
          </div>
        </div>
        <div class="card-body p-4">
          <FormPost 
            :edit-post="editingPost"
            @post-success="handlePostSuccess" 
            @cancel-edit="handleCancelEdit"
          />
        </div>
      </div>
    </div>

    <!-- Posts List Section -->
    <div class="posts-section">
      <div class="card shadow-sm border-0">
        <div class="card-header bg-light py-3">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <i class="fas fa-list text-primary me-3 fs-5"></i>
              <div>
                <h5 class="mb-1">Danh sách bài viết</h5>
                <small class="text-muted">Tất cả bài viết được sắp xếp theo thời gian mới nhất</small>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm" @click="fetchStats">
                <i class="fas fa-sync-alt me-1"></i>Làm mới
              </button>
            </div>
          </div>
        </div>
        
        <div class="card-body p-0">
          <!-- ✅ THÊM EVENT LISTENER cho reaction updates -->
          <PostList 
            :reload="reloadCounter" 
            @edit-post="handleEditPost"
            @view-post="incrementViewCount"
            @reaction-updated="handleReactionUpdate"
          />
        </div>
      </div>
    </div>

    <!-- Enhanced Stats Section -->
    <div class="stats-section mt-4">
      <div class="row g-3">
        <div class="col-md-3 col-sm-6">
          <div class="stat-card text-center p-3">
            <i class="fas fa-newspaper text-primary fs-2 mb-2"></i>
            <h6 class="text-muted">Tổng bài viết</h6>
            <h4 class="text-primary">{{ totalPosts }}</h4>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-card text-center p-3">
            <i class="fas fa-eye text-info fs-2 mb-2"></i>
            <h6 class="text-muted">Lượt xem</h6>
            <h4 class="text-info">{{ totalViews.toLocaleString() }}</h4>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-card text-center p-3">
            <i class="fas fa-thumbs-up text-success fs-2 mb-2"></i>
            <h6 class="text-muted">Lượt thích</h6>
            <h4 class="text-success">{{ totalLikes }}</h4>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-card text-center p-3">
            <i class="fas fa-comments text-warning fs-2 mb-2"></i>
            <h6 class="text-muted">Bình luận</h6>
            <h4 class="text-warning">{{ totalComments }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
