<template>
  <div class="like-dislike-container d-flex align-items-center gap-2">
    <button 
      @click="handleLike"
      :disabled="!isAuthenticated || isLoading"
      :class="`btn btn-sm ${userReaction === 'like' ? 'btn-primary' : 'btn-outline-primary'}`"
    >
      <i class="fas fa-thumbs-up me-1"></i>
      {{ likesCount }}
    </button>
    
    <button 
      @click="handleDislike"
      :disabled="!isAuthenticated || isLoading"
      :class="`btn btn-sm ${userReaction === 'dislike' ? 'btn-danger' : 'btn-outline-danger'}`"
    >
      <i class="fas fa-thumbs-down me-1"></i>
      {{ dislikesCount }}
    </button>
    
    <div v-if="!isAuthenticated" class="text-muted small">
      <i class="fas fa-info-circle me-1"></i>
      Đăng nhập để thích bài viết
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
// import { useAuth } from '@/composables/auth';

const props = defineProps({
  postId: {
    type: String,
    required: true
  }
});

const { currentUser, isAuthenticated } = useAuth();

const likesCount = ref(0);
const dislikesCount = ref(0);
const userReaction = ref(null); // 'like', 'dislike', or null
const isLoading = ref(false);

onMounted(() => {
  fetchReactions();
  if (isAuthenticated.value) {
    fetchUserReaction();
  }
});

async function fetchReactions() {
  try {
    const response = await fetch(`http://localhost:3001/reactions?postId=${props.postId}`);
    const reactions = await response.json();
    
    likesCount.value = reactions.filter(r => r.type === 'like').length;
    dislikesCount.value = reactions.filter(r => r.type === 'dislike').length;
  } catch (error) {
    console.error('Error fetching reactions:', error);
  }
}

async function fetchUserReaction() {
  try {
    const response = await fetch(`http://localhost:3001/reactions?postId=${props.postId}&userId=${currentUser.value.id}`);
    const reactions = await response.json();
    
    if (reactions.length > 0) {
      userReaction.value = reactions[0].type;
    }
  } catch (error) {
    console.error('Error fetching user reaction:', error);
  }
}

async function handleLike() {
  if (!isAuthenticated.value) {
    alert('Vui lòng đăng nhập để thích bài viết');
    return;
  }
  
  await toggleReaction('like');
}

async function handleDislike() {
  if (!isAuthenticated.value) {
    alert('Vui lòng đăng nhập để không thích bài viết');
    return;
  }
  
  await toggleReaction('dislike');
}

async function toggleReaction(type) {
  isLoading.value = true;
  
  try {
    // Nếu user đã có reaction
    if (userReaction.value) {
      // Nếu click vào cùng loại reaction -> remove
      if (userReaction.value === type) {
        await removeReaction();
        userReaction.value = null;
        
        if (type === 'like') {
          likesCount.value--;
        } else {
          dislikesCount.value--;
        }
      } else {
        // Nếu click vào reaction khác -> update
        await updateReaction(type);
        
        // Cập nhật count
        if (userReaction.value === 'like') {
          likesCount.value--;
          dislikesCount.value++;
        } else {
          dislikesCount.value--;
          likesCount.value++;
        }
        
        userReaction.value = type;
      }
    } else {
      // Nếu user chưa có reaction -> tạo mới
      await createReaction(type);
      userReaction.value = type;
      
      if (type === 'like') {
        likesCount.value++;
      } else {
        dislikesCount.value++;
      }
    }
  } catch (error) {
    console.error('Error toggling reaction:', error);
    alert('Có lỗi xảy ra. Vui lòng thử lại.');
  }
  
  isLoading.value = false;
}

async function createReaction(type) {
  const reaction = {
    id: generateId(),
    postId: props.postId,
    userId: currentUser.value.id,
    type: type,
    createdAt: new Date().toISOString()
  };
  
  const response = await fetch('http://localhost:3001/reactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reaction)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create reaction');
  }
}

async function updateReaction(type) {
  const response = await fetch(`http://localhost:3001/reactions?postId=${props.postId}&userId=${currentUser.value.id}`);
  const reactions = await response.json();
  
  if (reactions.length > 0) {
    const reactionId = reactions[0].id;
    const updateResponse = await fetch(`http://localhost:3001/reactions/${reactionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: type })
    });
    
    if (!updateResponse.ok) {
      throw new Error('Failed to update reaction');
    }
  }
}

async function removeReaction() {
  const response = await fetch(`http://localhost:3001/reactions?postId=${props.postId}&userId=${currentUser.value.id}`);
  const reactions = await response.json();
  
  if (reactions.length > 0) {
    const reactionId = reactions[0].id;
    const deleteResponse = await fetch(`http://localhost:3001/reactions/${reactionId}`, {
      method: 'DELETE'
    });
    
    if (!deleteResponse.ok) {
      throw new Error('Failed to remove reaction');
    }
  }
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
</script>

<style scoped>
.like-dislike-container {
  margin-top: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>
