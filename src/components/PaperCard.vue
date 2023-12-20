<script setup>
import { ref, onMounted } from "vue";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const emit = defineEmits(["viewPaper"]);
const childModal = ref(null);

const props = defineProps({
  paper: Object,
});

const isOpen = ref(false);

const closeModal = () => {
  isOpen.value = false;
};

const handleViewPaper = () => {
  emit("viewPaper", props.paper.paperId);
  isOpen.value = true;
};

onMounted(() => {

  tippy('#references', {
    content: 'References',
  });
});

</script>

<template>
  <div class="p-6 bg-white border border-gray-200 rounded-lg shadow">
    <div class="flex justify-between mb-1">
      <a @click.prevent="handleViewPaper" href="#" class="flex items-center">
        <h5 class="text-2xl font-bold tracking-tight text-gray-700 hover:text-indigo-800">
          {{ paper.title }}
        </h5>
      </a>
      <button id="references"
        class="flex items-center bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-lg">
        {{ paper.referenceCount }}
      </button>
    </div>

    <p v-if="paper.abstract" class="mb-3 font-normal text-gray-700">
      {{ paper.abstract }}
    </p>
    <p v-else class="mb-3 font-normal text-gray-700 bg-yellow-100 p-2 rounded-lg">
      No abstract available
    </p>

    <!-- <button @click.prevent="handleViewPaper" :disabled="paper.referenceCount === 0" type="button"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg disabled:bg-indigo-100 disabled:cursor-not-allowed">
      Visualize
      <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M1 5h12m0 0L9 1m4 4L9 9" />
      </svg>
    </button> -->

    <router-link :to="`/papers/${paper.paperId}`" :disabled="paper.referenceCount === 0" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg disabled:bg-indigo-100 disabled:cursor-not-allowed">
      Visualize
    </router-link>
  </div>
</template>
