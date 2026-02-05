<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <p>Welcome to the Login Page.</p>
    <GoogleLogin :callback="handleLogin" />

    <div class="mt-4">
      <button @click="guestLogin" class="bg-white text-black px-4 py-2 rounded">
        Guest
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from "vue-router";
import { GoogleLogin } from "vue3-google-login";
import axios from "axios";
import { useAuthStore } from '@/stores/auth'; // 1. Import Pinia Auth Store

// --- Setup ---
const router = useRouter();
const authStore = useAuthStore(); // 2. Initialize the store
const urlEnv = import.meta.env.VITE_LL_API_URL;

// --- Logic ---

// 1. Logic การตรวจสอบ Session และ Redirect (ปรับปรุงใหม่)
// ตรวจสอบสถานะจาก Pinia store เมื่อคอมโพเนนต์ถูกโหลด
onMounted(() => {
  if (authStore.isAuthenticated) {
    console.log("User is already authenticated. Redirecting to Home.");
    router.push("/app/home");
  }
});

// 2. Logic การจัดการ Login Callback จาก Google (ปรับปรุงใหม่)
async function handleLogin(response) {
  const idToken = response.credential;
  // console.log("ID Token received:", idToken);

  try {
    const apiUrl = `${urlEnv}/accounts/google-login`;
    const backendResponse = await axios.post(apiUrl, { idToken });
    
    // backendResponse.data ควรจะมี token และ user object
    // ตัวอย่าง: { token: "...", user: { name: "...", email: "..." } }
    const { token, user } = backendResponse.data;

    if (!token || !user) {
      throw new Error("Invalid data received from backend. Token or user is missing.");
    }

    // 3. ใช้ action จาก store เพื่อบันทึกข้อมูล (แทน sessionStorage)
    authStore.setAuth(token, user);

    console.log("Login successful! User data stored in Pinia:", user);
    router.push("/app/home");

  } catch (error) {
    console.error(
      "Login to Backend Failed:",
      error.response?.data || error.message
    );
    alert("Login Failed: Please try again or check server status.");
    authStore.clearAuth(); // เคลียร์ข้อมูลหากเกิดข้อผิดพลาด
  }
}

// 3. Logic สำหรับ Guest Login (ปรับปรุงใหม่)
function guestLogin() {
  const guestUser = {
    email: "guest@example.com",
    family_name: "",
    given_name: "Guest",
    name: "Guest User",
    picture: "",
    sub: "guest_sub",
  };
  // ใช้ token ปลอมสำหรับ guest และตั้งค่า user
  authStore.setAuth('guest-token', guestUser); 
  
  console.log("Guest Login successful! Data stored in Pinia.");
  router.push("/app/home");
}
</script>
