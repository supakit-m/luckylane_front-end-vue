<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

// --- State Variables ---
const videoRef = ref(null);
const canvasRef = ref(null);

// Data & Logic
const logs = ref([]); 
const countDirection = ref('L->R'); 
const linePosition = 0.5; 

// Control States
const isCameraOn = ref(false); // สถานะเปิด/ปิดกล้อง
const isPaused = ref(false);   // สถานะพักการนับ

let stage = null;
let pose = null;
let lastCountTime = 0; 
let animationFrameId = null; // เก็บ ID ของ Loop เพื่อสั่งหยุดได้

// Computed
const totalCount = computed(() => logs.value.length);

// --- Helper Functions ---
const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'medium' });
};

const toggleDirection = () => {
  countDirection.value = countDirection.value === 'L->R' ? 'R->L' : 'L->R';
  stage = null; 
};

const resetData = () => {
  if (confirm('คุณต้องการลบข้อมูลการนับทั้งหมดหรือไม่?')) {
    logs.value = [];
    stage = null;
  }
};

const exportCSV = () => {
  if (logs.value.length === 0) return alert("ไม่มีข้อมูลให้ Export");
  const headers = "ลำดับ,วัน-เวลา,ทิศทาง\n";
  const rows = logs.value.map(log => `${log.id},"${log.time}",${log.direction}`).join("\n");
  const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `visitor_count_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
};

// --- Camera & Loop Control ---

// ฟังก์ชันหยุดกล้อง (Hardware)
const stopCamera = () => {
  if (videoRef.value && videoRef.value.srcObject) {
    const tracks = videoRef.value.srcObject.getTracks();
    tracks.forEach(track => track.stop()); // สั่งปิดไฟกล้อง
    videoRef.value.srcObject = null;
  }
  isCameraOn.value = false;
  
  // ล้างหน้าจอ Canvas
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("กล้องถูกปิดใช้งาน", canvasRef.value.width/2 - 80, canvasRef.value.height/2);
  }
};

// ฟังก์ชันเปิดกล้อง
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      // รอให้วิดีโอพร้อมก่อนเริ่ม Loop
      videoRef.value.onloadedmetadata = () => {
        isCameraOn.value = true;
        predictLoop(); 
      };
    }
  } catch (err) {
    console.error("Error accessing webcam:", err);
    alert("ไม่สามารถเปิดกล้องได้ กรุณาตรวจสอบสิทธิ์การเข้าถึง");
  }
};

const toggleCamera = () => {
  if (isCameraOn.value) {
    stopCamera();
  } else {
    startCamera();
  }
};

const togglePause = () => {
  isPaused.value = !isPaused.value;
};

// --- Main Loop ---
const predictLoop = async () => {
  // ถ้าปิดกล้องให้หยุด Loop นี้ทันที
  if (!isCameraOn.value) return;

  // ถ้าไม่ได้พัก (Paused) และวิดีโอพร้อม ให้ส่งภาพไป AI
  if (!isPaused.value && videoRef.value && videoRef.value.readyState >= 2) {
    await pose.send({ image: videoRef.value });
  } else if (isPaused.value && canvasRef.value) {
    // กรณีพักการนับ: เขียนข้อความบอกว่า PAUSED (แต่ไม่ต้องประมวลผล AI)
    const ctx = canvasRef.value.getContext('2d');
    // เราไม่เคลียร์หน้าจอ เพื่อให้ภาพค้างเฟรมสุดท้าย (Freeze)
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 40px Arial";
    ctx.fillText("PAUSED", canvasRef.value.width/2 - 80, canvasRef.value.height/2);
    ctx.restore();
  }

  animationFrameId = requestAnimationFrame(predictLoop);
};

// --- MediaPipe Logic ---
const onResults = (results) => {
  if (!canvasRef.value) return;
  const canvasCtx = canvasRef.value.getContext('2d');
  const width = canvasRef.value.width;
  const height = canvasRef.value.height;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, width, height);
  canvasCtx.translate(width, 0);
  canvasCtx.scale(-1, 1);
  canvasCtx.drawImage(results.image, 0, 0, width, height);

  if (results.poseLandmarks) {
    const landmarks = results.poseLandmarks;
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const midShoulderX = (leftShoulder.x + rightShoulder.x) / 2;

    const now = Date.now();
    if (now - lastCountTime > 1500) {
      if (countDirection.value === 'R->L') {
        if (midShoulderX < linePosition) stage = 'waiting_left';
        else if (midShoulderX > linePosition && stage === 'waiting_left') {
          logs.value.unshift({ id: logs.value.length + 1, time: getCurrentDateTime(), direction: 'ซ้าย ➡ ขวา' });
          stage = null;
          lastCountTime = now;
        }
      } else {
        if (midShoulderX > linePosition) stage = 'waiting_right';
        else if (midShoulderX < linePosition && stage === 'waiting_right') {
          logs.value.unshift({ id: logs.value.length + 1, time: getCurrentDateTime(), direction: 'ขวา ➡ ซ้าย' });
          stage = null;
          lastCountTime = now;
        }
      }
    }

    drawConnectors(canvasCtx, landmarks, POSE_CONNECTIONS, { color: '#F542E6', lineWidth: 2 });
    drawLandmarks(canvasCtx, landmarks, { color: '#F57542', lineWidth: 1, radius: 2 });
    canvasCtx.beginPath();
    canvasCtx.arc(midShoulderX * width, ((leftShoulder.y + rightShoulder.y) / 2) * height, 8, 0, 2 * Math.PI);
    canvasCtx.fillStyle = "red";
    canvasCtx.fill();
  }
  canvasCtx.restore();

  // Draw UI Line
  const lineX = width * linePosition;
  canvasCtx.strokeStyle = stage ? '#FFFF00' : '#00FF00';
  canvasCtx.lineWidth = 3;
  canvasCtx.beginPath();
  canvasCtx.moveTo(lineX, 0);
  canvasCtx.lineTo(lineX, height);
  canvasCtx.stroke();
  
  canvasCtx.fillStyle = '#00FF00';
  canvasCtx.font = 'bold 20px Arial';
  canvasCtx.fillText(`Mode: ${countDirection.value === 'L->R' ? 'L ➡ R' : 'R ⬅ L'}`, lineX + 10, 30);
};

// --- Lifecycle ---
onMounted(() => {
  pose = new Pose({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });
  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  pose.onResults(onResults);

  // เริ่มต้นด้วยการเปิดกล้อง
  startCamera();

  // Event Listener สำหรับปิด Tab
  window.addEventListener('beforeunload', stopCamera);
});

onUnmounted(() => {
  // เมื่อเปลี่ยนหน้า (Component ถูกทำลาย)
  stopCamera();
  if (pose) pose.close();
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  
  // ลบ Listener ออกเพื่อไม่ให้ memory leak
  window.removeEventListener('beforeunload', stopCamera);
});
</script>

<template>
  <div class="main-container">
    <div class="header-card">
      <h1>ระบบนับคน (AI Counter)</h1>
      <div class="total-count">{{ totalCount }}</div>
      <p>คน</p>
    </div>

    <div class="controls">
      <button @click="toggleCamera" :class="['btn', isCameraOn ? 'btn-danger' : 'btn-primary']">
        {{ isCameraOn ? '🛑 ปิดกล้อง' : '📷 เปิดกล้อง' }}
      </button>

      <button @click="togglePause" class="btn btn-warning" :disabled="!isCameraOn">
        {{ isPaused ? '▶ เริ่มนับต่อ' : '⏸ พักการนับ' }}
      </button>

      <button @click="toggleDirection" class="btn btn-info">
        ⇄ สลับทิศ
      </button>

      <button @click="resetData" class="btn btn-secondary">
        ↺ รีเซ็ต
      </button>
      
      <button @click="exportCSV" class="btn btn-success">
        ⬇ Export CSV
      </button>
    </div>

    <div class="content-wrapper">
      <div class="video-container">
        <video ref="videoRef" autoplay playsinline style="display: none;"></video>
        <canvas ref="canvasRef" width="640" height="480"></canvas>
      </div>

      <div class="log-container">
        <h3>บันทึกการเข้า-ออก</h3>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>คนที่</th>
                <th>เวลา</th>
                <th>ทิศทาง</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id">
                <td>{{ log.id }}</td>
                <td>{{ log.time }}</td>
                <td>
                  <span :class="log.direction.includes('ขวา') ? 'badge-in' : 'badge-out'">
                    {{ log.direction }}
                  </span>
                </td>
              </tr>
              <tr v-if="logs.length === 0">
                <td colspan="3" style="text-align: center; color: #888;">ยังไม่มีข้อมูล</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Sarabun', sans-serif;
}
.header-card {
  text-align: center;
  background: #2c3e50;
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}
.total-count {
  font-size: 4rem;
  font-weight: bold;
  color: #42b983;
  line-height: 1;
}
.controls {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  color: white;
  font-weight: bold;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background-color: #3498db; } /* ฟ้า */
.btn-danger { background-color: #e74c3c; } /* แดง */
.btn-warning { background-color: #f39c12; } /* ส้ม */
.btn-info { background-color: #9b59b6; } /* ม่วง */
.btn-secondary { background-color: #7f8c8d; } /* เทา */
.btn-success { background-color: #27ae60; } /* เขียว */

.content-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.video-container {
  border: 4px solid #333;
  border-radius: 8px;
  line-height: 0;
  height: fit-content;
  background: #000;
}
.log-container {
  flex: 1;
  min-width: 300px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  max-height: 480px;
  display: flex;
  flex-direction: column;
}
.table-responsive {
  overflow-y: auto;
  flex: 1;
  border: 1px solid #ddd;
}
table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
th { background-color: #eee; position: sticky; top: 0; }
.badge-in { color: #27ae60; font-weight: bold; }
.badge-out { color: #e67e22; font-weight: bold; }
</style>