<template>
  <div class="container mt-4">
    <!-- Header với Login/Logout -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4 rounded">
      <div class="container-fluid">
        <span class="navbar-brand">📝 Blog System</span>
        <div class="d-flex align-items-center">
          <div v-if="!isAuthenticated" class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm" @click="showLoginModal = true">
              <i class="fas fa-sign-in-alt me-1"></i>Đăng nhập
            </button>
          </div>
          <div v-else class="d-flex align-items-center gap-3">
            <span class="text-muted">{{ currentUser?.username }}</span>
            <span :class="`badge ${isAdmin() ? 'bg-danger' : 'bg-secondary'}`">
              {{ isAdmin() ? 'Admin' : 'User' }}
            </span>
            <button class="btn btn-outline-secondary btn-sm" @click="logout">
              <i class="fas fa-sign-out-alt me-1"></i>Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Navigation Tabs -->
    <ul class="nav nav-pills nav-fill bg-light rounded p-2 mb-4">
      <li class="nav-item">
        <button 
          :class="`nav-link ${activeTab === 'all' ? 'active' : ''}`"
          @click="setActiveTab('all')"
        >
          <i class="fas fa-globe me-2"></i>Tất cả bài viết
        </button>
      </li>
      <li v-if="isAuthenticated" class="nav-item">
        <button 
          :class="`nav-link ${activeTab === 'my-posts' ? 'active' : ''}`"
          @click="setActiveTab('my-posts')"
        >
          <i class="fas fa-user-edit me-2"></i>Bài viết của tôi
        </button>
      </li>
      <li v-if="isAuthenticated" class="nav-item">
        <button 
          :class="`nav-link ${activeTab === 'create' ? 'active' : ''}`"
          @click="setActiveTab('create')"
        >
          <i class="fas fa-plus me-2"></i>Tạo bài viết
        </button>
      </li>
      <li v-if="isAdmin()" class="nav-item">
        <button 
          :class="`nav-link ${activeTab === 'admin' ? 'active' : ''}`"
          @click="setActiveTab('admin')"
        >
          <i class="fas fa-shield-alt me-2"></i>Quản trị
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- All Posts Tab -->
      <div v-if="activeTab === 'all'">
        <PostList 
          :reload="reloadCounter" 
          :show-all="true"
          @edit-post="handleEditPost"
          @reaction-updated="handleReactionUpdate"
        />
      </div>

      <!-- My Posts Tab -->
      <div v-if="activeTab === 'my-posts' && isAuthenticated">
        <UserPosts 
          :user-id="currentUser.id"
          :reload="reloadCounter"
          @edit-post="handleEditPost"
        />
      </div>

      <!-- Create Post Tab -->
      <div v-if="activeTab === 'create' && isAuthenticated">
        <FormPost 
          :edit-post="editingPost"
          @post-success="handlePostSuccess" 
          @cancel-edit="handleCancelEdit"
        />
      </div>

      <!-- Admin Panel Tab -->
      <div v-if="activeTab === 'admin' && isAdmin()">
        <AdminPanel 
          :reload="reloadCounter"
          @content-updated="handleContentUpdate"
        />
      </div>
    </div>

    <!-- Login Modal -->
    <LoginModal 
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FormPost from "@/components/FormPost.vue";
import PostList from "@/components/PostList.vue";
import UserPosts from "@/components/UserPosts.vue";
import AdminPanel from "@/components/AdminPanel.vue";
import LoginModal from "@/components/LoginModal.vue";
import { useAuth } from '@/composables/auth';

const { 
  currentUser, 
  isAuthenticated, 
  isAdmin, 
  logout, 
  initializeAuth 
} = useAuth();

const activeTab = ref('all');
const reloadCounter = ref(0);
const editingPost = ref(null);
const showLoginModal = ref(false);

function setActiveTab(tab) {
  activeTab.value = tab;
  editingPost.value = null;
}

function handleEditPost(post) {
  editingPost.value = post;
  activeTab.value = 'create';
}

function handlePostSuccess() {
  reloadCounter.value++;
  editingPost.value = null;
  activeTab.value = 'all';
}

function handleCancelEdit() {
  editingPost.value = null;
  activeTab.value = 'all';
}

function handleReactionUpdate() {
  // Update stats if needed
}

function handleContentUpdate() {
  reloadCounter.value++;
}

function handleLoginSuccess() {
  showLoginModal.value = false;
  reloadCounter.value++;
}

onMounted(() => {
  initializeAuth();
});
</script>

<style scoped>
.nav-pills .nav-link {
  color: #6c757d;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-pills .nav-link:hover {
  background-color: #e9ecef;
  color: #495057;
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>
