<template>
  <Transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm" @click.self="$emit('close')">
      <div class="absolute inset-0 bg-slate-900/60 "></div>
      
      <div class="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row transform transition-all z-10">
        <button @click="$emit('close')" class="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-4 rounded-full backdrop-blur-md transition-colors">
          <i class="">X</i>
        </button>

        <div class="w-full md:w-2/5 h-48 md:h-auto bg-slate-200 relative shrink-0">
          <img :src="item.image" class="absolute inset-0 w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
          <span class="absolute bottom-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {{ item.category }}
          </span>
        </div>

        <div class="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-white">
          <div class="flex items-center gap-3 text-slate-400 text-sm mb-3">
            <span class="flex items-center gap-1"><i class="ph ph-calendar-blank"></i> {{ item.date }}</span>
            <span class="flex items-center gap-1"><i class="ph ph-eye"></i> {{ formatNumber(item.views) }}</span>
          </div>
          
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
            {{ item.title }}
          </h2>

          <div class="prose prose-slate prose-sm md:prose-base max-w-none text-slate-600">
            <p class="font-medium text-lg text-slate-800 mb-4">{{ item.excerpt }}</p>
            <div v-html="item.content"></div>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div class="flex gap-2">
              <button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-600 transition-colors font-medium text-sm">
                <i class="ph-fill ph-heart"></i> ถูกใจ
              </button>
              <button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-500 text-slate-600 transition-colors font-medium text-sm">
                <i class="ph-fill ph-share-network"></i> แชร์
              </button>
            </div>
            <span class="text-xs text-slate-400">อ่านโดย {{ formatNumber(Math.floor(item.views * 1.5)) }} คน</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
// รับ Props: show คือสถานะเปิด/ปิด, item คือข้อมูลข่าว
const props = defineProps({
  show: Boolean,
  item: Object
});

// ส่ง Event กลับไปหาตัวแม่
defineEmits(['close']);

// Logic จัดการตัวเลขแบบที่คุณต้องการ
const formatNumber = (num) => {
  if (!num) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>

<style scoped>
/* สไตล์ Transition ที่ทำให้ดูสมูท */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .transform,
.modal-fade-leave-to .transform {
  transform: scale(0.95) translateY(20px);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>