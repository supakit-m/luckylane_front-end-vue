<template>
  <div class="mx-4 my-4 m-8 bg-bg-primary rounded-xl shadow-lg p-6">
    <div class="flex items-center justify-center flex-col gap-2">
      <h2 class="text-primary text-6xl">Home</h2>
      <p class="text-secondary text-2xl">Welcome to the Home Page.</p>
      <p class="text-secondary text-l">email : {{ authStore.user.email }}</p>
      <p class="text-secondary text-l">Full Name : {{ authStore.user.full_name }}</p>
      <p class="text-secondary text-l">Name : {{ authStore.user.name }}</p>
      <p class="text-secondary text-l">Surname : {{ authStore.user.surname }}</p>
      <p class="text-muted ">{{ envTest }}</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
export default {
  name: 'Home',
  data() {
    return {
      authStore: useAuthStore(),
      envTest: import.meta.env.VITE_TEST || 'null'
    };
  },
};
</script>