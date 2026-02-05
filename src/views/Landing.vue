<template>
  <div class="h-screen w-full flex items-center justify-center bg-slate-800">
    <div
      class="flex flex-col items-center justify-center bg-amber-900 p-10 rounded"
    >
      <div>landing</div>
      <div class="mt-4">
        <router-link to="/login">
          <button class="bg-white text-black px-4 py-2 rounded">Login</button>
        </router-link>
      </div>
      <div class="mt-4">
        <router-link to="/app/home">
          <button class="bg-white text-black px-4 py-2 rounded">Home Page</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>
