<script setup>
import { ref, defineEmits } from "vue";

const searchQuery = ref("");
const emit = defineEmits(["search"]);

const handleInput = () => {
  emit("search", searchQuery.value);
};
</script>

<template>
  <div class="flex flex-col items-center w-full my-10">
    <label for="paper-search" class="text-2xl font-bold text-indigo-500 mb-4">Looking for a paper?</label>
    <input
      type="text"
      id="paper-search"
      v-model="searchQuery"
      @keyup.enter="handleInput"
      placeholder="Enter paper title, author, or topic"
      class="w-full max-w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
    />
  </div>
</template>
