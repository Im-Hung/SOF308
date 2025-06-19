import { ref, computed } from 'vue';

export function useStats() {
  const posts = ref([]);
  const reactions = ref([]);
  const views = ref([]);
  const comments = ref([]);

  // Computed statistics
  const totalPosts = computed(() => posts.value.length);
  
  const totalViews = computed(() => {
    return posts.value.reduce((sum, post) => sum + (post.viewCount || 0), 0);
  });
  
  const totalLikes = computed(() => {
    return reactions.value.filter(r => r.type === 'like').length;
  });
  
  const totalDislikes = computed(() => {
    return reactions.value.filter(r => r.type === 'dislike').length;
  });
  
  const totalComments = computed(() => comments.value.length);

  // Fetch all data
  async function fetchStats() {
    try {
      const [postsRes, reactionsRes, viewsRes, commentsRes] = await Promise.all([
        fetch('http://localhost:3001/posts'),
        fetch('http://localhost:3001/reactions'),
        fetch('http://localhost:3001/views'),
        fetch('http://localhost:3001/comments')
      ]);

      posts.value = await postsRes.json();
      reactions.value = await reactionsRes.json();
      views.value = await viewsRes.json();
      comments.value = await commentsRes.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  // Update post view count
  async function incrementViewCount(postId) {
    try {
      // Add view record
      const viewRecord = {
        id: Date.now().toString(),
        postId: postId,
        userId: getCurrentUserId(),
        ipAddress: await getClientIP(),
        createdAt: new Date().toISOString()
      };

      await fetch('http://localhost:3001/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(viewRecord)
      });

      // Update post view count
      const post = posts.value.find(p => p.id === postId);
      if (post) {
        post.viewCount = (post.viewCount || 0) + 1;
        await fetch(`http://localhost:3001/posts/${postId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ viewCount: post.viewCount })
        });
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  function getCurrentUserId() {
    // Get from auth or session
    return 2; // Default user
  }

  async function getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '127.0.0.1';
    }
  }

  return {
    posts,
    reactions,
    views,
    comments,
    totalPosts,
    totalViews,
    totalLikes,
    totalDislikes,
    totalComments,
    fetchStats,
    incrementViewCount
  };
}
