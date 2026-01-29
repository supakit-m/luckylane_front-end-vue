<template>
  <div class="transition-all flex h-screen flex-col">
    <Navbar />
    <div class="transition-all flex flex-1 overflow-hidden">

      <aside class="transition-all shrink-0 border-r border-bg-primary hidden md:block">
        <Sidebar />
      </aside>

      <main class="transition-all flex-1 overflow-x-hidden overflow-y-auto bg-bg-tertiary flex flex-col">
        
        <div class="flex-1">
          <router-view v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </div>

        <Footer />
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from "../components/layouts/Sidebar.vue";
import Navbar from "../components/layouts/Navbar.vue";
import Footer from "../components/layouts/Footer.vue";
export default {
  components: {
    Sidebar,
    Navbar,
    Footer
  },
};
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
