<template>
  <div class="mx-4 my-4 m-8 bg-bg text-primary rounded-xl shadow-lg p-6">
    <div class="flex items-center justify-center flex-col gap-2">
      <h2>About</h2>
      <p>Welcome to the About Page.</p>
      <p>About</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      envTest: import.meta.env.VITE_TEST || 'null'
    };
  },
};
</script>
