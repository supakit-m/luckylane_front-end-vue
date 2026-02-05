<template>
  <div class="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden group shadow-lg bg-slate-200">
    <div 
      v-for="(item, index) in items" 
      :key="item.id"
      class="absolute inset-0 transition-opacity duration-700 ease-in-out"
      :class="index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'"
    >
      <img :src="item.image" class="w-full h-full object-cover transition-transform duration-5000 ease-linear transform scale-100 group-hover:scale-110">
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
      
      <div class="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white z-20">
        <span class="inline-block bg-indigo-600 px-3 py-1 rounded-md text-xs font-bold mb-3 uppercase tracking-wider">
          {{ item.category }}
        </span>
        <h2 class="text-2xl md:text-4xl font-bold mb-2 leading-tight max-w-3xl cursor-pointer hover:text-indigo-300 transition-colors" @click="$emit('open', item)">
          {{ item.title }}
        </h2>
        <p class="text-slate-300 text-sm md:text-base line-clamp-2 max-w-2xl mb-4 hidden md:block">
          {{ item.excerpt }}
        </p>
      </div>
    </div>

    <div class="absolute bottom-6 right-6 z-30 flex gap-2">
      <button 
        v-for="(_, index) in items" :key="index"
        @click="currentIndex = index"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="index === currentIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
const props = defineProps(['items']);
const currentIndex = ref(0);
let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.items.length;
  }, 5000);
});

onBeforeUnmount(() => clearInterval(timer));
</script>