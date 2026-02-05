<template>
  <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 cursor-pointer h-full flex flex-col">
    <div class="relative h-48 overflow-hidden">
      <img :src="item.image" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
      <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-800 shadow-sm">
        {{ item.category }}
      </div>
    </div>
    <div class="p-5 grow flex flex-col">
      <div class="flex items-center gap-2 text-xs text-slate-400 mb-2">
        <i class="ph ph-clock"></i> {{ item.timeAgo }}
      </div>
      <h3 class="font-bold text-lg text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
        {{ item.title }}
      </h3>
      <p class="text-slate-500 text-sm line-clamp-2 mb-4 grow">
        {{ item.excerpt }}
      </p>
      <div class="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
        <span class="text-xs font-semibold text-slate-400">
          <i class="ph-fill ph-eye"></i> {{ item.views.toLocaleString() }}
        </span>
        <span class="text-indigo-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
          อ่านต่อ <i class="ph-bold ph-arrow-right"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['item']);
</script>