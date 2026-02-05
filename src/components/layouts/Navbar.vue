<template>
  <nav
    class="bg-bg-primary px-4 py-2.5 h-16 flex items-center justify-between shadow-sm z-10 transition-colors duration-300"
  >
    <div class="flex items-center gap-4">
      <button class="text-secondary hover:bg-hover p-2 rounded-lg md:hidden">
        <Bars3Icon class="w-6 h-6" />
      </button>

      <a class="flex items-center gap-2">
        <div class="bg-color text-white p-1.5 rounded-lg font-bold">Logo</div>
        <span class="text-xl font-semibold tracking-tight">MyApplication</span>
      </a>
    </div>

    <div class="flex items-center gap-4 mr-2">
      <button
        @click="toggleDark()"
        class="cursor-pointer p-2 rounded-full hover:rotate-180 hover:bg-hover transition-all duration-200 active:scale-95 shadow-sm border border-muted"
        aria-label="Toggle Dark Mode"
      >
        <SunIcon v-if="isDark" class="w-6 h-6 text-amber-400" />
        <MoonIcon v-else class="w-6 h-6 text-indigo-800" />
      </button>

      <!-- v-if: Show profile dropdown if authenticated -->
      <div v-if="authStore.isAuthenticated && authStore.user" class="flex items-center gap-3 pl-4 border-l border-muted">
        <div class="relative">
          <button
            @click="toggleDropdown"
            class="rounded-lg p-0.5 cursor-pointer flex items-center space-x-2 focus:outline-none hover:scale-95 hover:bg-hover transition-all"
          >
            <div class="text-right hidden sm:block">
              <div class="text-sm font-medium text-primary">{{ authStore.user.name }}</div>
              <div class="text-xs text-secondary">{{ authStore.user.email }}</div>
            </div>
            <img
              class="h-8 w-8 rounded-full border border-secondary object-cover"
              :src="authStore.user.picture || `https://ui-avatars.com/api/?name=${authStore.user.name}&background=0D8ABC&color=fff`"
              alt="User avatar"
            />
          </button>
          <div
            v-if="isOpen"
            @click="isOpen = false"
            class="fixed inset-0 z-10 w-full h-full cursor-default"
          ></div>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="isOpen"
              class="absolute right-0 mt-2 w-64 bg-bg-secondary rounded-lg shadow-xl border border-bg-primary z-1 overflow-hidden"
            >
              <div class="px-4 py-4 border-b border-bg-primary bg-bg-secondary flex items-center gap-3">
                <img
                  :src="authStore.user.picture || `https://ui-avatars.com/api/?name=${authStore.user.name}&background=0D8ABC&color=fff`"
                  class="w-10 h-10 rounded-full bg-white p-1 shadow-sm"
                  alt="User avatar"
                />
                <div>
                  <p class="text-sm font-semibold text-primary">{{ authStore.user.name }}</p>
                  <p class="text-xs text-secondary">{{ authStore.user.email }}</p>
                </div>
              </div>

              <div class="py-1">
                <a href="#" class="block px-4 py-2 text-sm text-primary hover:bg-hover transition-colors items-center gap-2">
                  <i class="fa-regular fa-user w-4 text-center"></i>
                  ดูหน้าโปรไฟล์
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-primary hover:bg-hover transition-colors items-center gap-2">
                  <i class="fa-solid fa-gear w-4 text-center"></i> ตั้งค่าบัญชี
                </a>
              </div>

              <div class="border-t border-bg-primary"></div>

              <div class="py-1">
                <a
                  href="#"
                  @click.prevent="handleLogout"
                  class="block px-4 py-2 text-sm font-semibold text-red hover:bg-red/20 transition-colors items-center gap-2"
                >
                  <i class="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
                  ออกจากระบบ
                </a>
              </div>
            </div>
          </transition>
        </div>
      </div>
      
      <!-- v-else: Show login button if not authenticated -->
      <div v-else class="flex items-center pl-4 border-l border-muted">
        <router-link to="/login" class="text-sm font-medium text-primary hover:underline">
          เข้าสู่ระบบ
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { SunIcon, MoonIcon, Bars3Icon } from "@heroicons/vue/24/outline";
import { useDark, useToggle } from "@vueuse/core";
import { useAuthStore } from "@/stores/auth";

// --- Composables ---
const isDark = useDark();
const toggleDark = useToggle(isDark);
const router = useRouter();
const authStore = useAuthStore();

// --- Profile Dropdown Logic ---
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// --- Logout Logic ---
const handleLogout = () => {
  authStore.clearAuth();
  isOpen.value = false;
  router.push("/login");
  console.log("Logging out...");
};
</script>
