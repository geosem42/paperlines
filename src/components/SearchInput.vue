<script setup>
import { ref } from "vue";

const searchQuery = ref(null);
const emit = defineEmits(["search"]);

const handleInput = () => {
  emit("search", searchQuery.value);
};
</script>

<template>
  <div class="w-full mb-10">
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
        </svg>
      </div>
      <input type="search" id="paper-search" v-model="searchQuery" @keyup.enter="handleInput"
        placeholder="Enter paper title, author, or topic"
        class="block w-full p-4 ps-10 text-sm text-indigo-900 border-2 focus:border-2 border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-700 focus:border-indigo-700 focus:outline-none "
        required>

      <button @click="handleInput" type="button"
        class="text-white absolute end-2.5 bottom-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
    </div>
  </div>

  
</template>
