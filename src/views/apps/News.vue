<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50">
    <main class="grow container mx-auto px-4 py-6 space-y-12">
      <HeroSlider :items="featuredNews" @open="openModal" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div
            class="flex gap-4 border-b border-slate-200 pb-2 overflow-x-auto"
          >
            <button
              v-for="cat in categories"
              :key="cat"
              @click="activeCategory = cat"
              :class="[
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              ]"
            >
              {{ cat }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NewsCard
              v-for="item in filteredNews"
              :key="item.id"
              :item="item"
              @click="openModal(item)"
            />
          </div>
        </div>

        <aside class="space-y-8">
          <div
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
          >
            <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
              <i class="ph-fill ph-trend-up text-orange-500"></i> ข่าวยอดนิยม
            </h3>
            <div class="space-y-5">
              <div
                v-for="(item, index) in topNews"
                :key="item.id"
                class="flex gap-4 cursor-pointer"
                @click="openModal(item)"
              >
                <span class="text-2xl font-black text-slate-200"
                  >0{{ index + 1 }}</span
                >
                <h4
                  class="font-semibold text-sm line-clamp-2 hover:text-indigo-600"
                >
                  {{ item.title }}
                </h4>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <NewsModal :show="!!activeNews" :item="activeNews" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { mockNews } from "@/data/mockData/news/mockData";
import HeroSlider from "@/components/news/HeroSlider.vue";
import NewsCard from "@/components/news/NewsCard.vue";
import NewsModal from '@/components/news/NewsPopup.vue';

const activeCategory = ref("ทั้งหมด");
const activeNews = ref(null);

const categories = computed(() => [
  "ทั้งหมด",
  ...new Set(mockNews.map((i) => i.category)),
]);
const featuredNews = computed(() => mockNews.filter((i) => i.featured));
const filteredNews = computed(() => {
  return activeCategory.value === "ทั้งหมด"
    ? mockNews
    : mockNews.filter((i) => i.category === activeCategory.value);
});
const topNews = computed(() =>
  [...mockNews].sort((a, b) => b.views - a.views).slice(0, 5),
);

const openModal = (item) => {
  activeNews.value = item;
  document.body.style.overflow = "hidden";
};
const closeModal = () => {
  activeNews.value = null;
  document.body.style.overflow = "";
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
