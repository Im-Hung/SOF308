<script setup>
import { ref } from "vue";
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
const emit = defineEmits(["post-success"]);

const editorConfig = {
  language: "vi",
  licenseKey: "GPL",
};

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

  const formData = new FormData();
  formData.append("image", file);
  try {
    const res = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    thumbnailUrl.value = data.url;
  } catch (err) {
    message.value = "Có lỗi khi upload ảnh!";
    success.value = false;
    thumbnailUrl.value = "";
  }
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
    createdAt: new Date().toISOString(),
  };
  
  isSubmitting.value = true;
  try {
    const res = await fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    const responseData = await res.json();
    if (res.ok) {
      emit("post-success");
      message.value = "Đăng bài thành công!";
      success.value = true;
      title.value = "";
      content.value = "";
      thumbnailUrl.value = "";
      imagePreview.value = "";
      if (fileInput.value) fileInput.value.value = "";
      setTimeout(() => (message.value = ""), 3000);
    } else {
      message.value = `Có lỗi khi đăng bài: ${responseData.message || res.statusText}`;
      success.value = false;
    }
  } catch (err) {
    message.value = "Có lỗi khi kết nối máy chủ!";
    success.value = false;
  }
  isSubmitting.value = false;
};
</script>

<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <!-- Header Card với cùng style như PostList -->
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-gradient-primary text-white">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <i class="fas fa-edit me-2"></i>
                <h4 class="mb-0">Tạo bài viết mới</h4>
              </div>
              <div class="d-flex align-items-center">
                <button 
                  type="button" 
                  class="btn btn-outline-light btn-sm"
                  @click="title = ''; content = ''; imagePreview = ''; thumbnailUrl = ''"
                >
                  <i class="fas fa-refresh me-1"></i>
                  Làm mới
                </button>
              </div>
            </div>
          </div>
          
          <div class="card-body p-4">
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
                  type="button" 
                  class="btn btn-outline-secondary me-md-2"
                  @click="title = ''; content = ''; imagePreview = ''; thumbnailUrl = ''"
                >
                  <i class="fas fa-times me-2"></i>Hủy bỏ
                </button>
                <button 
                  :disabled="isSubmitting" 
                  type="submit" 
                  class="btn btn-primary btn-lg px-4"
                >
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="fas fa-paper-plane me-2"></i>
                  {{ isSubmitting ? 'Đang đăng...' : 'Đăng bài viết' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.min-height-200 {
  min-height: 200px;
}

.card {
  transition: all 0.3s ease;
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
  .card-body {
    padding: 1.5rem !important;
  }
}
</style>
