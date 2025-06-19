<template>
  <div class="container-fluid">
    <!-- Guest Notice -->
    <div v-if="isGuest" class="alert alert-info mb-4">
      <i class="fas fa-info-circle me-2"></i>
      <strong>Chào mừng!</strong> Bạn đang xem ở chế độ khách.
      <button class="btn btn-link p-0 ms-2" @click="$emit('show-login')">
        Đăng nhập
      </button>
      để thích, bình luận và tạo bài viết.
    </div>

    <!-- Posts List -->
    <div v-if="posts.length > 0" class="row">
      <div v-for="post in posts" :key="post.id" class="col-12 mb-4">
        <div class="card shadow-lg border-0 post-card">
          <!-- Thumbnail -->
          <div v-if="post.thumbnail" class="position-relative">
            <img
              :src="post.thumbnail"
              :alt="post.title"
              class="card-img-top"
              style="height: 300px; object-fit: cover"
            />
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <div class="row">
              <div class="col-md-8">
                <h5 class="card-title fw-bold text-primary mb-2">
                  {{ post.title }}
                </h5>

                <div class="card-text mb-3">
                  <div
                    class="content-preview"
                    v-html="truncateContent(post.content)"
                  ></div>
                </div>

                <!-- Author & Date -->
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <small class="text-muted">
                    <i class="fas fa-user me-1"></i
                    >{{ getAuthorName(post.authorId) }}
                  </small>
                  <small class="text-muted">
                    <i class="fas fa-clock me-1"></i
                    >{{ formatDate(post.createdAt) }}
                  </small>
                </div>
              </div>

              <div class="col-md-4">
                <!-- Like/Dislike -->
                <div v-if="hasPermission(PERMISSIONS.LIKE_POSTS)" class="mb-3">
                  <LikeDislike
                    :post-id="post.id"
                    @reaction-updated="$emit('reaction-updated')"
                  />
                </div>
                <div v-else class="mb-3">
                  <div
                    class="text-muted small text-center p-2 bg-light rounded"
                  >
                    <i class="fas fa-lock me-1"></i>
                    Đăng nhập để thích bài viết
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex gap-2 mb-3">
                  <button
                    class="btn btn-outline-primary btn-sm flex-fill"
                    @click="viewPost(post)"
                  >
                    <i class="fas fa-eye me-1"></i>Xem chi tiết
                  </button>

                  <!-- Edit/Delete for authorized users -->
                  <div
                    v-if="canEditPost(post) || canDeletePost(post)"
                    class="dropdown"
                  >
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
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="$emit('edit-post', post)"
                        >
                          <i class="fas fa-edit me-2"></i>Sửa
                        </a>
                      </li>
                      <li v-if="canDeletePost(post)">
                        <a
                          class="dropdown-item text-danger"
                          href="#"
                          @click.prevent="deletePost(post.id)"
                        >
                          <i class="fas fa-trash me-2"></i>Xóa
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Comments Section -->
            <div class="comments-section mt-4">
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <h6 class="mb-0">
                  <i class="fas fa-comments me-2"></i>
                  Bình luận ({{ getPostComments(post.id).length }})
                </h6>
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="toggleComments(post.id)"
                >
                  <i
                    :class="`fas ${showComments[post.id] ? 'fa-chevron-up' : 'fa-chevron-down'} me-1`"
                  ></i>
                  {{ showComments[post.id] ? "Ẩn" : "Hiện" }} bình luận
                </button>
              </div>

              <!-- Comment Form -->
              <div
                v-if="hasPermission(PERMISSIONS.COMMENT_POSTS)"
                class="comment-form mb-3"
              >
                <div class="d-flex gap-2">
                  <textarea
                    v-model="newComments[post.id]"
                    class="form-control"
                    rows="2"
                    :placeholder="`Viết bình luận cho bài viết của ${getAuthorName(post.authorId)}...`"
                  ></textarea>
                  <button
                    @click="submitComment(post.id)"
                    class="btn btn-success"
                    :disabled="
                      !newComments[post.id]?.trim() ||
                      submittingComment === post.id
                    "
                  >
                    <span
                      v-if="submittingComment === post.id"
                      class="spinner-border spinner-border-sm me-1"
                    ></span>
                    <i v-else class="fas fa-paper-plane me-1"></i>
                    {{
                      submittingComment === post.id
                        ? "Đang gửi..."
                        : "Bình luận"
                    }}
                  </button>
                </div>
              </div>

              <!-- Comments List -->
              <div v-if="showComments[post.id]" class="comments-list">
                <div
                  v-if="getPostComments(post.id).length === 0"
                  class="text-center text-muted py-3"
                >
                  <i class="fas fa-comment-slash fa-2x mb-2"></i>
                  <p>Chưa có bình luận nào</p>
                </div>

                <div
                  v-for="comment in getPostComments(post.id)"
                  :key="comment.id"
                  class="comment-item mb-3"
                >
                  <div class="card border-start border-primary border-3">
                    <div class="card-body p-3">
                      <div
                        class="d-flex justify-content-between align-items-start mb-2"
                      >
                        <div class="d-flex align-items-center">
                          <strong class="me-2">{{
                            getAuthorName(comment.authorId)
                          }}</strong>
                          <small class="text-muted">{{
                            formatDate(comment.createdAt)
                          }}</small>
                        </div>

                        <!-- Comment Actions -->
                        <div
                          class="dropdown"
                          v-if="canDeleteComment(comment, post)"
                        >
                          <button
                            class="btn btn-sm btn-outline-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                          >
                            <i class="fas fa-ellipsis-v"></i>
                          </button>
                          <ul class="dropdown-menu">
                            <li>
                              <a
                                class="dropdown-item text-danger"
                                href="#"
                                @click.prevent="
                                  deleteComment(comment.id, post.id)
                                "
                              >
                                <i class="fas fa-trash me-2"></i>Xóa bình luận
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <p class="mb-2">{{ comment.content }}</p>

                      <!-- Comment Like/Dislike -->
                      <div class="d-flex align-items-center gap-3">
                        <div
                          v-if="hasPermission(PERMISSIONS.LIKE_POSTS)"
                          class="d-flex gap-2"
                        >
                          <button
                            @click="toggleCommentReaction(comment.id, 'like')"
                            :class="`btn btn-sm ${getCommentUserReaction(comment.id) === 'like' ? 'btn-primary' : 'btn-outline-primary'}`"
                          >
                            <i class="fas fa-thumbs-up me-1"></i
                            >{{ getCommentLikes(comment.id) }}
                          </button>
                          <button
                            @click="
                              toggleCommentReaction(comment.id, 'dislike')
                            "
                            :class="`btn btn-sm ${getCommentUserReaction(comment.id) === 'dislike' ? 'btn-danger' : 'btn-outline-danger'}`"
                          >
                            <i class="fas fa-thumbs-down me-1"></i
                            >{{ getCommentDislikes(comment.id) }}
                          </button>
                        </div>

                        <button
                          v-if="hasPermission(PERMISSIONS.COMMENT_POSTS)"
                          @click="toggleReplyForm(comment.id)"
                          class="btn btn-sm btn-outline-secondary"
                        >
                          <i class="fas fa-reply me-1"></i>Trả lời
                        </button>
                      </div>

                      <!-- Reply Form -->
                      <div
                        v-if="showReplyForm[comment.id]"
                        class="reply-form mt-3"
                      >
                        <div class="d-flex gap-2">
                          <textarea
                            v-model="replyContents[comment.id]"
                            class="form-control"
                            rows="2"
                            :placeholder="`Trả lời ${getAuthorName(comment.authorId)}...`"
                          ></textarea>
                          <button
                            @click="submitReply(comment.id, post.id)"
                            class="btn btn-success btn-sm"
                            :disabled="!replyContents[comment.id]?.trim()"
                          >
                            <i class="fas fa-paper-plane me-1"></i>
                            Trả lời
                          </button>
                        </div>
                      </div>

                      <!-- Replies -->
                      <div
                        v-if="getCommentReplies(comment.id).length > 0"
                        class="replies mt-3"
                      >
                        <div
                          v-for="reply in getCommentReplies(comment.id)"
                          :key="reply.id"
                          class="reply-item ms-4 mb-2"
                        >
                          <div class="card bg-light">
                            <div class="card-body p-2">
                              <div
                                class="d-flex justify-content-between align-items-start"
                              >
                                <div>
                                  <strong class="me-2">{{
                                    getAuthorName(reply.authorId)
                                  }}</strong>
                                  <small class="text-muted">{{
                                    formatDate(reply.createdAt)
                                  }}</small>
                                </div>
                                <div
                                  class="dropdown"
                                  v-if="canDeleteComment(reply, post)"
                                >
                                  <button
                                    class="btn btn-sm btn-outline-secondary dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i class="fas fa-ellipsis-v"></i>
                                  </button>
                                  <ul class="dropdown-menu">
                                    <li>
                                      <a
                                        class="dropdown-item text-danger"
                                        href="#"
                                        @click.prevent="
                                          deleteComment(reply.id, post.id)
                                        "
                                      >
                                        <i class="fas fa-trash me-2"></i>Xóa
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <p class="mb-0 mt-1">{{ reply.content }}</p>
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
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-5">
      <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">Chưa có bài viết nào</h5>
    </div>

    <!-- Post Detail Modal -->
    <PostDetailModal
      v-if="showPostDetail"
      :post="selectedPost"
      @close="showPostDetail = false"
      @show-login="$emit('show-login')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import LikeDislike from "@/components/LikeDislike.vue";
import { useAuth } from "@/composables/auth";

const {
  isGuest,
  hasPermission,
  canEditPost,
  canDeletePost,
  PERMISSIONS,
  currentUser,
  isAdmin,
} = useAuth();

const props = defineProps({
  reload: Number,
  showAll: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["edit-post", "reaction-updated", "show-login"]);

const posts = ref([]);
const comments = ref([]);
const commentReactions = ref([]);
const loading = ref(false);
const showComments = reactive({});
const newComments = reactive({});
const submittingComment = ref(null);
const showReplyForm = reactive({});
const replyContents = reactive({});
const showPostDetail = ref(false);
const selectedPost = ref(null);

async function fetchPosts() {
  loading.value = true;
  try {
    const res = await fetch("http://localhost:3001/posts");
    const data = await res.json();
    posts.value = data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
  loading.value = false;
}

async function fetchComments() {
  try {
    const res = await fetch("http://localhost:3001/comments");
    comments.value = await res.json();
  } catch (err) {
    console.error("Error fetching comments:", err);
  }
}

async function fetchCommentReactions() {
  try {
    const res = await fetch("http://localhost:3001/commentReactions");
    commentReactions.value = await res.json();
  } catch (err) {
    console.error("Error fetching comment reactions:", err);
  }
}

async function deletePost(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

  try {
    const res = await fetch(`http://localhost:3001/posts/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      posts.value = posts.value.filter((post) => post.id !== id);
      emit("reaction-updated");
    }
  } catch (err) {
    console.error("Error deleting post:", err);
  }
}

function viewPost(post) {
  selectedPost.value = post;
  showPostDetail.value = true;
}

function toggleComments(postId) {
  showComments[postId] = !showComments[postId];
}

async function submitComment(postId) {
  if (!newComments[postId]?.trim()) return;

  submittingComment.value = postId;
  try {
    const comment = {
      id: Date.now().toString(),
      postId: postId,
      authorId: currentUser.value.id,
      content: newComments[postId],
      parentId: null,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch("http://localhost:3001/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });

    if (response.ok) {
      comments.value.push(comment);
      newComments[postId] = "";
      showComments[postId] = true;
    }
  } catch (error) {
    console.error("Error submitting comment:", error);
  }
  submittingComment.value = null;
}

async function submitReply(parentCommentId, postId) {
  if (!replyContents[parentCommentId]?.trim()) return;

  try {
    const reply = {
      id: Date.now().toString(),
      postId: postId,
      authorId: currentUser.value.id,
      content: replyContents[parentCommentId],
      parentId: parentCommentId,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch("http://localhost:3001/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reply),
    });

    if (response.ok) {
      comments.value.push(reply);
      replyContents[parentCommentId] = "";
      showReplyForm[parentCommentId] = false;
    }
  } catch (error) {
    console.error("Error submitting reply:", error);
  }
}

async function deleteComment(commentId, postId) {
  if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;

  try {
    const res = await fetch(`http://localhost:3001/comments/${commentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      comments.value = comments.value.filter((c) => c.id !== commentId);
    }
  } catch (err) {
    console.error("Error deleting comment:", err);
  }
}

async function toggleCommentReaction(commentId, type) {
  try {
    const existingReaction = commentReactions.value.find(
      (r) => r.commentId === commentId && r.userId === currentUser.value.id
    );

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Remove reaction
        await fetch(
          `http://localhost:3001/commentReactions/${existingReaction.id}`,
          {
            method: "DELETE",
          }
        );
        commentReactions.value = commentReactions.value.filter(
          (r) => r.id !== existingReaction.id
        );
      } else {
        // Update reaction
        existingReaction.type = type;
        await fetch(
          `http://localhost:3001/commentReactions/${existingReaction.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type }),
          }
        );
      }
    } else {
      // Create new reaction
      const reaction = {
        id: Date.now().toString(),
        commentId,
        userId: currentUser.value.id,
        type,
        createdAt: new Date().toISOString(),
      };

      await fetch("http://localhost:3001/commentReactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reaction),
      });

      commentReactions.value.push(reaction);
    }
  } catch (error) {
    console.error("Error toggling comment reaction:", error);
  }
}

function toggleReplyForm(commentId) {
  showReplyForm[commentId] = !showReplyForm[commentId];
}

function getPostComments(postId) {
  return comments.value
    .filter((c) => c.postId === postId && !c.parentId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function getCommentReplies(commentId) {
  return comments.value
    .filter((c) => c.parentId === commentId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function getCommentLikes(commentId) {
  return commentReactions.value.filter(
    (r) => r.commentId === commentId && r.type === "like"
  ).length;
}

function getCommentDislikes(commentId) {
  return commentReactions.value.filter(
    (r) => r.commentId === commentId && r.type === "dislike"
  ).length;
}

function getCommentUserReaction(commentId) {
  const reaction = commentReactions.value.find(
    (r) => r.commentId === commentId && r.userId === currentUser.value?.id
  );
  return reaction?.type || null;
}

function canDeleteComment(comment, post) {
  // Admin có thể xóa mọi comment
  if (isAdmin.value) return true;
  // Chủ bài viết có thể xóa comment trong bài của mình
  if (post.authorId === currentUser.value?.id) return true;
  // Người comment có thể xóa comment của mình
  if (comment.authorId === currentUser.value?.id) return true;
  return false;
}

function getAuthorName(authorId) {
  const authors = { 1: "Admin", 2: "HungVu" };
  return authors[authorId] || "Unknown";
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateContent(content, maxLength = 200) {
  const textContent = content.replace(/<[^>]*>/g, "");
  return textContent.length > maxLength
    ? textContent.substring(0, maxLength) + "..."
    : textContent;
}

async function loadAllData() {
  await Promise.all([fetchPosts(), fetchComments(), fetchCommentReactions()]);
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
}

.content-preview {
  line-height: 1.6;
  color: #6c757d;
}

.comments-section {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}

.comment-item {
  transition: all 0.3s ease;
}

.comment-item:hover {
  transform: translateX(5px);
}

.reply-item {
  border-left: 2px solid #dee2e6;
  padding-left: 1rem;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
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
  .d-flex.gap-2 {
    flex-direction: column;
    gap: 0.5rem !important;
  }

  .comment-form .d-flex {
    flex-direction: column;
  }

  .reply-form .d-flex {
    flex-direction: column;
  }
}
</style>
