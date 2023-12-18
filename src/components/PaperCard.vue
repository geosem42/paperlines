<script setup>
import { onMounted } from "vue";
import Skeleton from "./Skeleton.vue";
import { initFlowbite } from "flowbite";

onMounted(() => {
  initFlowbite();
});

const emit = defineEmits(["viewPaper"]);

const props = defineProps({
  paper: Object,
  isLoading: Boolean,
});

const viewPaper = () => {
  console.log("paper clicked");
  emit("viewPaper", props.paper.paperId);
};
</script>

<template>
  <div class="p-6 bg-white border border-gray-200 rounded-lg shadow">
    <div v-if="props.isLoading">
      <Skeleton />
    </div>
    <div v-else>
        <a @click.prevent="viewPaper" href="#">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-indigo-700 hover:text-indigo-800">
        {{ paper.title }}
      </h5>
    </a>

    <p v-if="paper.abstract" class="mb-3 font-normal text-gray-700">
      {{ paper.abstract }}
    </p>
    <p v-else class="mb-3 font-normal text-gray-700 bg-yellow-100 p-2 rounded-lg">
      No abstract available
    </p>

    <a @click.prevent="viewPaper"
      href="#"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg">
      Visualize
      <svg
        class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 10">
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M1 5h12m0 0L9 1m4 4L9 9"  />
      </svg>
    </a>
    </div>
  </div>
</template>
