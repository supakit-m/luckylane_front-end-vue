import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const fullName = computed(() => {
    if (user.value) {
      return `${user.value.firstName} ${user.value.lastName}`;
    }
    return '';
  });

  // Actions
  function setAuth(newToken, newUser) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  function clearAuth() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  function setUser(newUser) {
    user.value = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  return {
    token,
    user,
    isAuthenticated,
    fullName,
    setAuth,
    clearAuth,
    setUser,
  };
});
