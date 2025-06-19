import { ref, computed } from 'vue';

export function useStats() {
  const posts = ref([]);
  const reactions = ref([]);
  const comments = ref([]);

  // Computed statistics
  const totalPosts = computed(() => posts.value.length);
  
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
      const [postsRes, reactionsRes, commentsRes] = await Promise.all([
        fetch('http://localhost:3001/posts'),
        fetch('http://localhost:3001/reactions'),
        fetch('http://localhost:3001/comments')
      ]);

      posts.value = await postsRes.json();
      reactions.value = await reactionsRes.json();
      comments.value = await commentsRes.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  return {
    totalPosts,
    totalLikes,
    totalDislikes,
    totalComments,
    fetchStats
  };
}
