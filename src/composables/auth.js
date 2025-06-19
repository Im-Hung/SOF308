import { ref, computed } from 'vue';

const currentUser = ref(null);
const isAuthenticated = ref(false);

// Roles và permissions
const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

const PERMISSIONS = {
  MANAGE_POSTS: 'manage_posts',
  DELETE_COMMENTS: 'delete_comments',
  BLOCK_USERS: 'block_users',
  CREATE_POSTS: 'create_posts',
  COMMENT_POSTS: 'comment_posts'
};

const rolePermissions = {
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_POSTS,
    PERMISSIONS.DELETE_COMMENTS,
    PERMISSIONS.BLOCK_USERS,
    PERMISSIONS.CREATE_POSTS,
    PERMISSIONS.COMMENT_POSTS
  ],
  [ROLES.USER]: [
    PERMISSIONS.CREATE_POSTS,
    PERMISSIONS.COMMENT_POSTS
  ]
};

export function useAuth() {
  const userRole = computed(() => currentUser.value?.role || null);
  const userPermissions = computed(() => {
    if (!userRole.value) return [];
    return rolePermissions[userRole.value] || [];
  });

  function hasPermission(permission) {
    return userPermissions.value.includes(permission);
  }

  function hasRole(role) {
    return userRole.value === role;
  }

  function isAdmin() {
    return hasRole(ROLES.ADMIN);
  }

  async function login(credentials) {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      if (response.ok) {
        currentUser.value = data.user;
        isAuthenticated.value = true;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  function logout() {
    currentUser.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function initializeAuth() {
    // Kiểm tra localStorage trước
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        currentUser.value = JSON.parse(user);
        isAuthenticated.value = true;
        return;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    // Nếu không có trong localStorage, sử dụng dữ liệu mặc định
    // Giả lập dữ liệu user từ session hoặc API
    const userData = {
      id: "2",
      username: "hungvu",
      role: "user",
      email: "hungvu@example.com",
      avatar: null,
      createdAt: new Date().toISOString()
    };
    
    currentUser.value = userData;
    isAuthenticated.value = true;
    
    // Lưu vào localStorage để lần sau sử dụng
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', 'demo-token-' + Date.now());
  }

  // Simulate API call to get current user
  async function getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Giả lập API call
      const response = await fetch('http://localhost:3001/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        currentUser.value = userData;
        isAuthenticated.value = true;
        return userData;
      } else {
        throw new Error('Failed to get current user');
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      // Fallback to stored data or default
      initializeAuth();
    }
  }

  // Update user profile
  async function updateProfile(profileData) {
    try {
      const response = await fetch(`http://localhost:3001/users/${currentUser.value.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        currentUser.value = { ...currentUser.value, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(currentUser.value));
        return updatedUser;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Check if user is logged in
  function checkAuth() {
    return isAuthenticated.value && currentUser.value;
  }

  // Get user avatar URL
  function getAvatarUrl() {
    if (currentUser.value?.avatar) {
      return currentUser.value.avatar;
    }
    // Return default avatar based on username
    return `https://ui-avatars.com/api/?name=${currentUser.value?.username || 'User'}&background=667eea&color=fff&size=128`;
  }

  return {
    // State
    currentUser,
    isAuthenticated,
    userRole,
    userPermissions,
    
    // Methods
    hasPermission,
    hasRole,
    isAdmin,
    login,
    logout,
    initializeAuth,
    getCurrentUser,
    updateProfile,
    checkAuth,
    getAvatarUrl,
    
    // Constants
    ROLES,
    PERMISSIONS
  };
}

// Export for global use if needed
export const authStore = {
  currentUser,
  isAuthenticated
};
