<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <p>Welcome to the Login Page.</p>
    <GoogleLogin :callback="handleLogin" />

    <div class="mt-4">
      <button @click="guestLogin" class="bg-white text-black px-4 py-2 rounded">
        Guest
      </button>
    </div>

    <!-- <div class="mt-4">
      <button @click="goToHome" class="bg-white text-black px-4 py-2 rounded">
        Home (Go to Session Check)
      </button>
    </div> -->
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { GoogleLogin } from "vue3-google-login";
import axios from "axios";

// กำหนดตัวแปรสำหรับคีย์ Session
const user_session_key = "user_session";

export default {
  components: {
    // Textinput, // ต้องนำเข้า Textinput ก่อน ถ้าจะใช้งานจริง
    GoogleLogin, // นำเข้า GoogleLogin
  },
  data() {
    return {
      urlEnv: import.meta.env.VITE_LL_API_URL,
      checkbox: false,
    };
  },
  // ใช้ setup() เพื่อดึง instance ของ router
  setup() {
    const router = useRouter();
    return { router }; // ส่ง router ออกไปเพื่อให้ methods เข้าถึงได้
  },
  methods: {
    // ----------------------------------------------------
    // 1. Logic การตรวจสอบ Session และ Redirect
    // ----------------------------------------------------
    checkAndRedirect() {
      const savedData = sessionStorage.getItem(user_session_key);

      if (savedData) {
        try {
          const parsedSavedData = JSON.parse(savedData);

          if (
            parsedSavedData &&
            parsedSavedData.name &&
            parsedSavedData.email
          ) {
            console.log("Session found. Redirecting to Home.");
            this.router.push("/app/home");
          }
        } catch (e) {
          console.error("Corrupted session data found, clearing storage.", e);
          sessionStorage.removeItem(user_session_key);
        }
      }
    },

    // ----------------------------------------------------
    // 2. Logic การจัดการ Login Callback จาก Google
    // ----------------------------------------------------
    async handleLogin(response) {
      const idToken = response.credential;
      console.log("ID Token received:", idToken);

      try {
        // ใช้ urlEnv ที่เราตั้งไว้ (ควรจะเป็น http://localhost:3002 ตามที่เห็นใน Postman)
        const apiUrl = `${this.urlEnv}/accounts/google-login`;

        const backendResponse = await axios.post(apiUrl, {
          idToken: idToken,
        });

        // *************************************************************
        // ** การแก้ไข: รับข้อมูลผู้ใช้โดยตรงจาก backendResponse.data **
        // *************************************************************
        const userData = backendResponse.data;

        // ตรวจสอบว่ามีข้อมูลพื้นฐานหรือไม่
        if (!userData || !userData.email) {
          throw new Error("Invalid user data received from backend.");
        }

        // 1. บันทึกข้อมูล Session ที่ได้รับจาก Backend
        sessionStorage.setItem(user_session_key, JSON.stringify(userData));

        console.log("Login successful! User data:", userData);
        // 2. Redirect ไปหน้า Home
        this.router.push("/app/home");
      } catch (error) {
        console.error(
          "Login to Backend Failed:",
          error.response?.data || error.message
        );
        alert("Login Failed: Please try again or check server status.");
        sessionStorage.removeItem(user_session_key);
      }
    },
    guestLogin() {
      const guestData = {
        email: "guess_email",
        family_name: "",
        given_name: "guess",
        name: "guess",
        picture: "guess_picture",
        sub: "guess_sub",
      };
      sessionStorage.setItem(user_session_key, JSON.stringify(guestData));
      console.log("Guest Login successful! guestData:", guestData);
      // 2. Redirect ไปหน้า Home
      this.router.push("/app/home");
    },

    // ----------------------------------------------------
    // 3. Logic การนำทาง
    // ----------------------------------------------------
    goToHome() {
      this.router.push("/app/home");
    },
  },

  mounted() {
    this.checkAndRedirect();
  },
};
</script>
