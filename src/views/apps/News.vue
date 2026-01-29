<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50">
    
    <!-- Navbar -->
    <nav class="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
          <span class="font-bold text-xl tracking-tight text-slate-900">NextGen<span class="text-indigo-600">News</span></span>
        </div>
        <div class="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#" class="hover:text-indigo-600 transition-colors">หน้าแรก</a>
          <a href="#" class="hover:text-indigo-600 transition-colors">ข่าวล่าสุด</a>
          <a href="#" class="hover:text-indigo-600 transition-colors">ยอดนิยม</a>
          <a href="#" class="hover:text-indigo-600 transition-colors">เทคโนโลยี</a>
        </div>
        <button class="p-2 hover:bg-slate-100 rounded-full text-slate-600">
          <i class="ph ph-magnifying-glass text-xl"></i>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="grow container mx-auto px-4 py-6 space-y-12">
      
      <!-- Component: Hero Slider -->
      <section v-if="featuredNews.length > 0">
        <div class="flex items-center gap-2 mb-4">
          <span class="w-1 h-6 bg-indigo-600 rounded-full"></span>
          <h2 class="text-2xl font-bold">ไฮไลท์ประจำวัน</h2>
        </div>
        <HeroSlider :items="featuredNews" @open="openModal" />
      </section>

      <!-- Layout: News Grid & Sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Latest News -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Filter Tabs -->
          <div class="flex gap-4 border-b border-slate-200 pb-2 overflow-x-auto">
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="activeCategory = cat"
              :class="['px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all', 
                activeCategory === cat ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
            >
              {{ cat }}
            </button>
          </div>

          <!-- News Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NewsCard 
              v-for="item in filteredNews" 
              :key="item.id" 
              :item="item"
              @click="openModal(item)"
            />
          </div>

          <!-- Load More -->
          <div class="text-center pt-4">
            <button class="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all text-sm font-medium">
              โหลดเพิ่มเติม
            </button>
          </div>
        </div>

        <!-- Right Column: Sidebar -->
        <div class="lg:col-span-1 space-y-8">
          
          <!-- Top Views Widget -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-bold text-lg flex items-center gap-2">
                <i class="ph-fill ph-trend-up text-orange-500"></i>
                ข่าวยอดนิยม
              </h3>
            </div>
            <div class="space-y-5">
              <div 
                v-for="(item, index) in topNews" 
                :key="item.id"
                class="group cursor-pointer flex gap-4 items-start"
                @click="openModal(item)"
              >
                <span class="text-3xl font-black text-slate-200 group-hover:text-indigo-200 transition-colors leading-none">
                  0{{ index + 1 }}
                </span>
                <div>
                  <span class="text-xs font-semibold text-indigo-600 mb-1 block">{{ item.category }}</span>
                  <h4 class="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {{ item.title }}
                  </h4>
                  <div class="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span class="flex items-center gap-1"><i class="ph ph-eye"></i> {{ formatNumber(item.views) }}</span>
                    <span class="flex items-center gap-1"><i class="ph ph-clock"></i> {{ item.timeAgo }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Subscribe Widget -->
          <div class="bg-linear-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <h3 class="font-bold text-lg mb-2 relative z-10">ไม่พลาดทุกข่าวสาร</h3>
            <p class="text-indigo-100 text-sm mb-4 relative z-10">รับสรุปข่าวเด่นประจำวันส่งตรงถึงอีเมลของคุณ</p>
            <div class="flex gap-2 relative z-10">
              <input type="email" placeholder="อีเมลของคุณ" class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-indigo-200 text-sm focus:outline-none focus:bg-white/30 transition-colors">
              <button class="bg-white text-indigo-700 px-3 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
                <i class="ph-bold ph-paper-plane-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400 py-12 mt-12">
      <div class="container mx-auto px-4 text-center">
        <div class="flex items-center justify-center gap-2 mb-6">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
          <span class="font-bold text-xl tracking-tight text-white">NextGen<span class="text-indigo-500">News</span></span>
        </div>
        <p class="text-sm mb-8 max-w-md mx-auto">แหล่งรวมข่าวสารทันโลก นำเสนอด้วยมุมมองที่แตกต่าง และเทคโนโลยีที่ล้ำสมัย เพื่อคนรุ่นใหม่</p>
        <div class="flex justify-center gap-6 text-2xl mb-8">
          <a href="#" class="hover:text-white transition-colors"><i class="ph-fill ph-facebook-logo"></i></a>
          <a href="#" class="hover:text-white transition-colors"><i class="ph-fill ph-twitter-logo"></i></a>
          <a href="#" class="hover:text-white transition-colors"><i class="ph-fill ph-instagram-logo"></i></a>
        </div>
        <div class="text-xs text-slate-600">
          &copy; 2023 NextGen News Portal. All rights reserved.
        </div>
      </div>
    </footer>

    <!-- Modal -->
    <Transition name="fade">
      <div v-if="activeNews" class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" @click.self="closeModal">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
        
        <div class="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row transform transition-all z-10">
          <button @click="closeModal" class="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors">
            <i class="ph-bold ph-x"></i>
          </button>

          <!-- Image -->
          <div class="w-full md:w-2/5 h-48 md:h-auto bg-slate-200 relative">
            <img :src="activeNews.image" class="absolute inset-0 w-full h-full object-cover">
            <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent md:hidden"></div>
            <span class="absolute bottom-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {{ activeNews.category }}
            </span>
          </div>

          <!-- Content -->
          <div class="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto custom-scrollbar">
            <div class="flex items-center gap-3 text-slate-400 text-sm mb-3">
              <span class="flex items-center gap-1"><i class="ph ph-calendar-blank"></i> {{ activeNews.date }}</span>
              <span class="flex items-center gap-1"><i class="ph ph-eye"></i> {{ formatNumber(activeNews.views) }}</span>
            </div>
            
            <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
              {{ activeNews.title }}
            </h2>

            <div class="prose prose-slate prose-sm md:prose-base max-w-none text-slate-600">
              <p class="font-medium text-lg text-slate-800 mb-4">{{ activeNews.excerpt }}</p>
              <div v-html="activeNews.content"></div>
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
              <span class="text-xs text-slate-400">อ่านโดย {{ formatNumber(Math.floor(activeNews.views * 1.5)) }} คน</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
// --- Sub-Components (เพื่อความสะดวก ผมรวมไว้ในไฟล์เดียว หากใช้งานจริงควรแยกไฟล์) ---

// 1. HeroSlider Component
const HeroSlider = {
  name: 'HeroSlider',
  props: ['items'],
  template: `
    <div class="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden group shadow-lg">
      <div 
        v-for="(item, index) in items" 
        :key="item.id"
        class="absolute inset-0 transition-opacity duration-700 ease-in-out"
        :class="index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <img :src="item.image" class="w-full h-full object-cover transition-transform duration-5000 ease-linear transform scale-100 group-hover:scale-110">
        
        <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white z-20">
          <span class="inline-block bg-indigo-600 px-3 py-1 rounded-md text-xs font-bold mb-3 uppercase tracking-wider">
            {{ item.category }}
          </span>
          <h2 class="text-2xl md:text-4xl font-bold mb-2 leading-tight max-w-3xl drop-shadow-md cursor-pointer hover:text-indigo-300 transition-colors" @click="$emit('open', item)">
            {{ item.title }}
          </h2>
          <p class="text-slate-300 text-sm md:text-base line-clamp-2 max-w-2xl mb-4 hidden md:block">
            {{ item.excerpt }}
          </p>
          <div class="flex items-center gap-4 text-xs md:text-sm text-slate-400">
            <span>{{ item.date }}</span>
            <span class="w-1 h-1 bg-slate-400 rounded-full"></span>
            <span>{{ formatNumber(item.views) }} views</span>
          </div>
        </div>
      </div>

      <!-- Indicators -->
      <div class="absolute bottom-6 right-6 z-30 flex gap-2">
        <button 
          v-for="(item, index) in items" 
          :key="'dot-'+index"
          @click="setIndex(index)"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="index === currentIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'"
        ></button>
      </div>

      <!-- Controls -->
      <button @click="prev" class="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100">
        <i class="ph-bold ph-caret-left"></i>
      </button>
      <button @click="next" class="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100">
        <i class="ph-bold ph-caret-right"></i>
      </button>
    </div>
  `,
  data() {
    return {
      currentIndex: 0,
      interval: null
    }
  },
  mounted() {
    this.interval = setInterval(this.next, 5000);
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  methods: {
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
    },
    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    },
    setIndex(i) {
      this.currentIndex = i;
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};

// 2. NewsCard Component
const NewsCard = {
  name: 'NewsCard',
  props: ['item'],
  template: `
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
          <span class="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <i class="ph-fill ph-eye"></i> {{ formatNumber(item.views) }}
          </span>
          <span class="text-indigo-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            อ่านต่อ <i class="ph-bold ph-arrow-right"></i>
          </span>
        </div>
      </div>
    </div>
  `,
  methods: {
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};

// --- Mock Data Helper ---
const generateContent = () => `
  <p>ในยุคที่เทคโนโลยีพัฒนาไปอย่างรวดเร็ว การปรับตัวจึงเป็นเรื่องสำคัญมากสำหรับทุกคน เนื้อหาข่าวนี้เป็นการจำลองข้อมูลเพื่อแสดงผลตัวอย่างการจัดหน้าเว็บ (Layout) ให้เห็นภาพชัดเจนยิ่งขึ้น</p>
  <p class="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  <h4 class="text-lg font-bold text-slate-800 mt-6 mb-2">ประเด็นที่น่าสนใจ</h4>
  <ul class="list-disc list-inside space-y-2 ml-2">
    <li>การเปลี่ยนแปลงของ AI ในชีวิตประจำวัน</li>
    <li>ผลกระทบต่อเศรษฐกิจโลก</li>
    <li>แนวโน้มในอนาคตปี 2025</li>
  </ul>
  <p class="mt-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
`;

// --- Main App Export ---
export default {
  name: 'NextGenNews',
  components: {
    HeroSlider,
    NewsCard
  },
  data() {
    return {
      activeCategory: 'ทั้งหมด',
      activeNews: null,
      mockNews: [
        {
          id: 1,
          title: "เปิดตัว AI รุ่นใหม่ที่เข้าใจภาษาไทยได้ลึกซึ้งกว่าเดิม",
          excerpt: "บริษัทเทคโนโลยียักษ์ใหญ่ประกาศความสำเร็จในการพัฒนาโมเดลภาษาที่รองรับบริบทวัฒนธรรมไทย",
          content: generateContent(),
          image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
          category: "Technology",
          views: 12540,
          date: "2 ธ.ค. 66",
          timeAgo: "2 ชม. ที่แล้ว",
          featured: true
        },
        {
          id: 2,
          title: "ท่องเที่ยวไทยฟื้นตัว นักท่องเที่ยวแห่จองที่พักพุ่ง 200%",
          excerpt: "สมาคมโรงแรมไทยเผยยอดจองไตรมาสสุดท้ายคึกคัก โดยเฉพาะภูเก็ตและเชียงใหม่",
          content: generateContent(),
          image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1000",
          category: "Travel",
          views: 8900,
          date: "1 ธ.ค. 66",
          timeAgo: "5 ชม. ที่แล้ว",
          featured: true
        },
        {
          id: 3,
          title: "วิธีดูแลสุขภาพจิตในยุค Digital Detox",
          excerpt: "เมื่อโลกออนไลน์ทำให้เราเครียด การพักจากหน้าจอจึงเป็นสิ่งจำเป็น นี่คือ 5 วิธีง่ายๆ",
          content: generateContent(),
          image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&q=80&w=1000",
          category: "Health",
          views: 5400,
          date: "1 ธ.ค. 66",
          timeAgo: "1 วันที่แล้ว",
          featured: false
        },
        {
          id: 4,
          title: "รถยนต์ไฟฟ้า EV กับทิศทางราคาน้ำมันโลก",
          excerpt: "วิเคราะห์ตลาดพลังงาน เมื่อผู้คนหันมาใช้ EV มากขึ้น ราคาน้ำมันจะปรับตัวอย่างไร",
          content: generateContent(),
          image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000",
          category: "Auto",
          views: 15600,
          date: "30 พ.ย. 66",
          timeAgo: "1 วันที่แล้ว",
          featured: false
        },
        {
          id: 5,
          title: "สตรีทฟู้ดไทยติดอันดับ 1 อาหารข้างทางที่ดีที่สุดในโลก",
          excerpt: "CNN ยกย่องกรุงเทพฯ เป็นเมืองสวรรค์ของนักกิน สตรีทฟู้ดไทยยังคงครองใจชาวโลก",
          content: generateContent(),
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000",
          category: "Food",
          views: 22100,
          date: "29 พ.ย. 66",
          timeAgo: "2 วันที่แล้ว",
          featured: true
        },
        {
          id: 6,
          title: "Minimalist Style: แต่งบ้านอย่างไรให้น่าอยู่",
          excerpt: "ไอเดียการจัดบ้านสไตล์มินิมอล น้อยแต่มาก เรียบง่ายแต่ดูดี",
          content: generateContent(),
          image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1000",
          category: "Lifestyle",
          views: 4300,
          date: "28 พ.ย. 66",
          timeAgo: "3 วันที่แล้ว",
          featured: false
        }
      ]
    };
  },
  computed: {
    categories() {
      const cats = new Set(this.mockNews.map(i => i.category));
      return ['ทั้งหมด', ...Array.from(cats)];
    },
    featuredNews() {
      return this.mockNews.filter(i => i.featured);
    },
    filteredNews() {
      if (this.activeCategory === 'ทั้งหมด') return this.mockNews;
      return this.mockNews.filter(i => i.category === this.activeCategory);
    },
    topNews() {
      return [...this.mockNews].sort((a, b) => b.views - a.views).slice(0, 5);
    }
  },
  methods: {
    openModal(item) {
      this.activeNews = item;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.activeNews = null;
      document.body.style.overflow = '';
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};
</script>

<style scoped>
/* Font Prompt import ควรไปอยู่ที่ index.html หรือ main css global */
/* แต่อยู่ตรงนี้ก็ได้ถ้าระบบรองรับ */
@import url('https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap');

.font-sans {
  font-family: 'Prompt', sans-serif;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>