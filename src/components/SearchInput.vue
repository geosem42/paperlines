<template>
  <div class="flex flex-col items-center w-full my-10">
    <label for="paper-search" class="text-2xl font-bold mb-4">Looking for a paper?</label>
    <input
      type="text"
      id="paper-search"
      v-model="searchQuery"
      @input="handleInput"
      placeholder="Enter paper title, author, or topic"
      class="w-full max-w-2xl p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');

const handleInput = () => {
  // Placeholder for the fetch request to SemanticScholar API
  // You will replace this with the actual API call later
  console.log('Fetching papers for:', searchQuery.value);
  // Example:
  // const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(searchQuery.value)}`);
  // const data = await response.json();
  // Emit an event with the fetched data
  // emit('papersFetched', data);
};
</script>

<style scoped>
/* Scoped styles for PaperSearchInput component */
</style>
