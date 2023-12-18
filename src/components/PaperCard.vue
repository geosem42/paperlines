<script setup>
import { onMounted } from "vue";
import { initFlowbite } from 'flowbite'

onMounted(() => {
    initFlowbite();
})

const props = defineProps({
  paper: Object,
});
</script>


<template>
  <div class="p-6 bg-white border border-gray-200 rounded-lg shadow">
    <a href="#">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{{ paper.title }}</h5>
    </a>
    
    <p class="mb-3 font-normal text-gray-700" v-if="paper.abstract">
        {{ paper.abstract }}
    </p>
    <p class="mb-3 font-normal text-gray-700 bg-yellow-100 p-2 rounded-lg" v-else>
        No abstract available
    </p>

    <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
        Visualize
        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
    </a>
</div>
</template>
