<script setup>
import { ref, computed } from "vue";
import PaperCard from "./PaperCard.vue";
import Spinner from "./Spinner.vue"

const props = defineProps({
  papers: Array,
  offset: Number,
  next: Number,
  total: Number,
  loadingPaperId: String,
});

let loading = ref(false);

const emit = defineEmits(["fetchPrevious", "fetchNext", "viewPaper"]);

const fetchPrevious = () => {
  emit("fetchPrevious");
};

const fetchNext = () => {
  emit("fetchNext");
};

const resultsRange = computed(() => {
  const start = props.offset + 1;
  const end = props.offset + props.papers.length;
  return `${start}-${end}`;
});

const handleViewPaper = (paperId) => {
  console.log('Received viewPaper event with paperId:', paperId);
  emit("viewPaper", paperId);
};
</script>

<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center">
      <Spinner />
    </div>
    <div v-else>
      <div class="grid grid-cols-1 gap-4">
        <PaperCard v-for="paper in papers" :key="paper.paperId" :paper="paper"
          :isLoading="paper.paperId === props.loadingPaperId" @viewPaper="handleViewPaper" />
      </div>
      <div v-if="papers.length > 0" class="flex justify-center gap-4 mt-4">
        <button @click="fetchPrevious" :disabled="props.offset === 0"
          class="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-100 text-white rounded-lg">
          Previous
        </button>
        <div class="p-2 rounded-lg font-semibold bg-indigo-100 text-indigo-700">
          Showing {{ resultsRange }} of {{ total.toLocaleString() }}
        </div>
        <button @click="fetchNext" :disabled="props.next === null"
          class="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-100 text-white rounded-lg">
          Next
        </button>
      </div>
    </div>
  </div>
</template>
