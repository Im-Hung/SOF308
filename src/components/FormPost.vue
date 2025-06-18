<script setup>
import { ref, watch } from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const title = ref("");
const content = ref("");
const thumbnailUrl = ref("");
const imagePreview = ref("");
const message = ref("");
const success = ref(true);
const isSubmitting = ref(false);
const fileInput = ref(null);
const editor = ClassicEditor;
const isEditing = ref(false);
const editingPostId = ref(null);

const props = defineProps({
  editPost: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(["post-success", "cancel-edit"]);

const editorConfig = {
  language: "vi",
  licenseKey: "GPL",
};

// Generate random ID like in your db.json
function generateId() {
  return Math.random().toString(36).substr(2, 4);
}

// Watch for edit post prop changes
watch(() => props.editPost, (newPost) => {
  if (newPost) {
    isEditing.value = true;
    editingPostId.value = newPost.id;
    title.value = newPost.title;
    content.value = newPost.content;
    thumbnailUrl.value = newPost.thumbnail || "";
    imagePreview.value = newPost.thumbnail || "";
  }
}, { immediate: true });

const onImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) {
    imagePreview.value = "";
    thumbnailUrl.value = "";
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (ev) => {
    imagePreview.value = ev.target.result;
  };
  reader.readAsDataURL(file);

  // For now, just use the data URL as thumbnail
  // In production, you would upload to a server
  thumbnailUrl.value = imagePreview.value;
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  if (!title.value.trim() || !content.value.trim()) {
    message.value = "Vui lòng nhập đủ tiêu đề và nội dung!";
    success.value = false;
    return;
  }
  
  const post = {
    title: title.value,
    content: content.value,
    thumbnail: thumbnailUrl.value,
    authorId: 2,
    createdAt: isEditing.value ? props.editPost.createdAt : new Date().toISOString(),
    updatedAt: isEditing.value ? new Date().toISOString() : undefined
  };

  if (!isEditing.value) {
    post.id = generateId();
  }
  
  isSubmitting.value = true;
  try {
    const url = isEditing.value 
      ? `http://localhost:3001/posts/${editingPostId.value}`
      : "http://localhost:3001/posts";
    
    const method = isEditing.value ? "PUT" : "POST";
    
    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const responseData = await res.json();
    emit("post-success");
    message.value = isEditing.value ? "Cập nhật bài viết thành công!" : "Đăng bài thành công!";
    success.value = true;
    resetForm();
    setTimeout(() => (message.value = ""), 3000);
    
  } catch (err) {
    console.error('Fetch error:', err);
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      message.value = "Không thể kết nối đến server! Vui lòng kiểm tra JSON Server có đang chạy không.";
    } else {
      message.value = `Có lỗi khi ${isEditing.value ? 'cập nhật' : 'đăng'} bài: ${err.message}`;
    }
    success.value = false;
  }
  isSubmitting.value = false;
};

const resetForm = () => {
  title.value = "";
  content.value = "";
  thumbnailUrl.value = "";
  imagePreview.value = "";
  if (fileInput.value) fileInput.value.value = "";
  isEditing.value = false;
  editingPostId.value = null;
};

const cancelEdit = () => {
  resetForm();
  emit("cancel-edit");
};
</script>

<template>
  <div class="form-container">
    <!-- Alert Messages -->
    <div v-if="message" 
         :class="`alert alert-dismissible fade show ${success ? 'alert-success' : 'alert-danger'}`" 
         role="alert">
      <i :class="`fas ${success ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`"></i>
      {{ message }}
      <button type="button" class="btn-close" @click="message = ''" aria-label="Close"></button>
    </div>

    <form @submit.prevent="handleSubmit" novalidate>
      <!-- Title Input -->
      <div class="mb-4">
        <label for="title" class="form-label fw-semibold">
          <i class="fas fa-heading me-2 text-primary"></i>Tiêu đề bài viết
        </label>
        <input 
          id="title"
          v-model="title" 
          type="text" 
          class="form-control form-control-lg" 
          placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
          required 
        />
      </div>

      <!-- Content Editor -->
      <div class="mb-4">
        <label class="form-label fw-semibold">
          <i class="fas fa-align-left me-2 text-primary"></i>Nội dung bài viết
        </label>
        <div class="border rounded">
          <Ckeditor 
            :editor="editor" 
            v-model="content" 
            :config="editorConfig"
            class="min-height-200"
          />
        </div>
      </div>

      <!-- Image Upload -->
      <div class="mb-4">
        <label for="thumbnail" class="form-label fw-semibold">
          <i class="fas fa-image me-2 text-primary"></i>Ảnh minh họa
        </label>
        <div class="input-group">
          <input
            id="thumbnail"
            ref="fileInput"
            type="file"
            @change="onImageChange"
            class="form-control"
            accept="image/*"
          />
          <span class="input-group-text">
            <i class="fas fa-upload"></i>
          </span>
        </div>
        
        <!-- Image Preview -->
        <div v-if="imagePreview" class="mt-3">
          <div class="card">
            <div class="card-header bg-light py-2">
              <small class="text-muted">
                <i class="fas fa-eye me-1"></i>Xem trước ảnh
              </small>
            </div>
            <div class="card-body text-center p-3">
              <img
                :src="imagePreview"
                alt="Preview"
                class="img-fluid rounded shadow-sm"
                style="max-width: 300px; max-height: 200px; object-fit: cover;"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button 
          v-if="isEditing"
          type="button" 
          class="btn btn-outline-secondary me-md-2"
          @click="cancelEdit"
        >
          <i class="fas fa-times me-2"></i>Hủy
        </button>
        <button 
          type="button" 
          class="btn btn-outline-secondary me-md-2"
          @click="resetForm"
        >
          <i class="fas fa-refresh me-2"></i>Làm mới
        </button>
        <button 
          :disabled="isSubmitting" 
          type="submit" 
          class="btn btn-primary btn-lg px-4"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <i v-else :class="`fas ${isEditing ? 'fa-save' : 'fa-paper-plane'} me-2`"></i>
          {{ isSubmitting ? (isEditing ? 'Đang cập nhật...' : 'Đang đăng...') : (isEditing ? 'Cập nhật bài viết' : 'Đăng bài viết') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  padding: 1rem;
}

.min-height-200 {
  min-height: 200px;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .form-container {
    padding: 0.5rem;
  }
}
</style>
