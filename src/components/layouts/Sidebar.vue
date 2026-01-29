<template>
  <div
    :class="[
      'sidebar-transition bg-bg-secondary  flex flex-col h-full shadow-2xl transition-all duration-300 ease-in-out',
      collapsed ? 'w-18' : 'w-64',
    ]"
  >
    <div
      class="p-4 flex items-center justify-between text-primary border-b border-muted h-20"
    >
      <div
        :class="[
          'flex-1 overflow-hidden transition-all duration-300 ease-in-out',
          collapsed ? 'w-0 opacity-0' : 'w-full opacity-100',
        ]"
      >
        <h1 class="text-xl font-extrabold tracking-wider whitespace-nowrap">
          Menu
        </h1>
      </div>

      <button
        @click="toggleSidebar"
        :class="[
          'text-secondary p-2 rounded-full transition duration-300 transform',
          collapsed ? 'hover:bg-hover rotate-0' : 'hover:bg-hover rotate-180',
        ]"
      >
        <svg
          v-if="collapsed"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>

    <nav class="grow overflow-y-auto custom-scrollbar pt-4">
      <router-link
        v-for="link in filteredLinks"
        :key="link.path"
        :to="link.path"
        custom
        v-slot="{ href, navigate, isActive, isExactActive }"
      >
        <a
          :href="href"
          @click="navigate"
          :class="getLinkClass(isActive, isExactActive)"
          class=" flex items-center space-x-4 p-4 mx-2 my-3 rounded-lg cursor-pointer transition duration-300 transform hover:bg-hover hover:scale-[0.98]"
        >
          <div class="shrink-0">
            <component
              :is="link.iconComponent"
              class="w-6 h-6 text-primary"
              aria-hidden="true"
            />
          </div>

          <span
            v-if="!collapsed"
            class="text-base text-primary font-medium whitespace-nowrap overflow-hidden"
          >
            {{ link.name }}
          </span>
        </a>
      </router-link>
    </nav>
  </div>
</template>

<script>
import Navbar from "../layouts/Navbar.vue";
import { menuLinks } from "../../router/sidebarLink";
import {
  HomeIcon,
  NewspaperIcon,
  InformationCircleIcon,
  CogIcon,
  UsersIcon,
  CommandLineIcon,
  GlobeAltIcon,
} from "@heroicons/vue/24/outline";

export default {
  components: {
    Navbar,
    HomeIcon,
    NewspaperIcon,
    InformationCircleIcon,
    CogIcon,
    UsersIcon,
    CommandLineIcon,
    GlobeAltIcon,
  },
  name: "Sidebar",
  data() {
    return {
      collapsed: false,
      currentUserRole: "admin",
    };
  },
  computed: {
    filteredLinks() {
      const userRole = this.currentUserRole;
      return menuLinks.filter((link) => {
        // ตรวจสอบว่า Role ของผู้ใช้อยู่ใน Array requiredRoles ของเมนูหรือไม่
        return link.requiredRoles.includes(userRole);
      });
    },
  },
  methods: {
    toggleSidebar() {
      this.collapsed = !this.collapsed;
    },
    getLinkClass(isActive, isExactActive) {
      let baseClasses = "text-white ";
      let activeClasses = "bg-color/80 shadow-lg ring-1 ring-muted";
      let inactiveClasses = " hover:text-white bg-bg-primary ring-1 ring-muted";
      return [baseClasses, isActive ? activeClasses : inactiveClasses].join(
        " "
      );
    },
  },
  mounted() {},
};
</script>
