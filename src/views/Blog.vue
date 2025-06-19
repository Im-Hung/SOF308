<!-- <script setup>
import { ref } from "vue";
import FormPost from "@/components/FormPost.vue";
import PostList from "@/components/PostList.vue";

const reloadCounter = ref(0);
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-4">📝 Bài viết mới nhất </h2>
    <FormPost @post-success="reloadCounter++" />
    <PostList :reload="reloadCounter" />
  </div>
</template> -->


<script setup>
import { ref } from "vue";
import FormPost from "@/components/FormPost.vue";
import PostList from "@/components/PostList.vue";

const reloadCounter = ref(0);
const editingPost = ref(null);
const showForm = ref(false);

// Handle post success (create or update)
function handlePostSuccess() {
  reloadCounter.value++;
  editingPost.value = null;
  showForm.value = false;
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
    // If editing, ask for confirmation
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
</script>

<template>
  <div class="container mt-4">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">📝 Quản lý bài viết</h2>
        <p class="text-muted mb-0">Tạo, chỉnh sửa và quản lý các bài viết của bạn</p>
      </div>
      <button 
        @click="toggleForm" 
        :class="`btn ${showForm ? 'btn-outline-secondary' : 'btn-primary'}`"
      >
        <i :class="`fas ${showForm ? 'fa-times' : 'fa-plus'} me-2`"></i>
        {{ showForm ? (editingPost ? 'Hủy chỉnh sửa' : 'Đóng form') : 'Tạo bài viết mới' }}
      </button>
    </div>

    <!-- Form Section -->
    <div v-if="showForm" class="mb-4">
      <div class="card shadow-sm">
        <div class="card-header bg-light">
          <h5 class="mb-0">
            <i :class="`fas ${editingPost ? 'fa-edit text-warning' : 'fa-plus text-success'} me-2`"></i>
            {{ editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới' }}
          </h5>
        </div>
        <div class="card-body">
          <FormPost 
            :edit-post="editingPost"
            @post-success="handlePostSuccess" 
            @cancel-edit="handleCancelEdit"
          />
        </div>
      </div>
    </div>

    <!-- Posts List Section -->
    <div class="card shadow-sm">
      <div class="card-header bg-light">
        <h5 class="mb-0">
          <i class="fas fa-list text-primary me-2"></i>
          Danh sách bài viết
        </h5>
      </div>
      <div class="card-body p-0">
        <PostList 
          :reload="reloadCounter" 
          @edit-post="handleEditPost"
        />
      </div>
    </div>
  </div>
  <div class="container mt-3 p-2">
    <div class="post-card">
      <div class="post-title">🚀 V-TEC Mayfest 2025 | Công bố kết quả CHÍNH THỨC</div>
      <div class="post-meta">
        V-TEC Team · 2 giờ trước · <span class="badge bg-primary">Announcement</span>
      </div>
      <br />
      <a href="/post" class="btn btn-primary">Xem thêm</a>
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Tạo bài viết mới</h2>
      <router-link class="btn btn-info text-white" to="createPost">Đăng bài</router-link>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: none;
  border-radius: 12px;
}

.card-header {
  border-bottom: 1px solid #e9ecef;
  border-radius: 12px 12px 0 0 !important;
}

.btn {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .d-flex.justify-content-between {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem;
  }
  
  .d-flex.justify-content-between button {
    align-self: stretch;
  }
}
</style>
