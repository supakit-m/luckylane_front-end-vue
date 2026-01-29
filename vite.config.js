import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    // กำหนด Port ที่ต้องการ
    port: 5173, // ตัวอย่าง: ใช้ Port 3001 แทน 5173 (Default ของ Vite)
    
    // (Optional) ถ้าต้องการให้ Server ออกเมื่อ Port ถูกใช้งานแล้ว
    // strictPort: true, 
  }
})
