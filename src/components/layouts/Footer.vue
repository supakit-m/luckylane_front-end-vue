<template>
  <footer class="bg-bg-primary text-secondary py-6 mt-6">
    <div class="container mx-auto px-4 text-center">
      <div class="flex items-center justify-center gap-2 mb-6">
        <div
          class="w-8 h-8 bg-color rounded-lg flex items-center justify-center text-alt font-bold text-xl"
        >
          My
        </div>
        <span class="font-bold text-xl tracking-tight text-primary">
          My<span class="text-color">Application</span>
        </span>
      </div>

      <p class="text-sm mb-8 max-w-md tracking-widest mx-auto">
        Simple first, powerful later.
      </p>

      <div class="flex justify-center gap-6 mb-8">
        <a href="#" class="hover:text-color transition-colors" aria-label="Facebook">
          <GlobeAltIcon class="w-7 h-7" />
        </a>
        
        <a href="#" class="hover:text-color transition-colors" aria-label="Twitter">
          <ChatBubbleLeftRightIcon class="w-7 h-7" />
        </a>

        <a href="#" class="hover:text-color transition-colors" aria-label="Instagram">
          <CameraIcon class="w-7 h-7" />
        </a>
      </div>

      <div class="text-xs text-slate-600">
        &copy; {{ new Date().getFullYear() }} MyApplication. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script>
// เลือกใช้แบบ Solid หรือ Outline ก็ได้ (ในที่นี้ใช้ Solid)
import { 
  GlobeAltIcon, 
  CameraIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/vue/24/solid'

export default {
  name: "Footer",
  components: {
    GlobeAltIcon,
    CameraIcon,
    ChatBubbleLeftRightIcon
  }
};
</script>