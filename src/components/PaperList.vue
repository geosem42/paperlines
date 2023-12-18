<script setup>
import { ref, computed, defineEmits } from "vue";
import PaperCard from "./PaperCard.vue";
import Spinner from "./Spinner.vue"

const props = defineProps({
  papers: Array,
  offset: Number,
  next: Number,
  total: Number,
});

let loading = ref(false);

const emit = defineEmits(["fetchPrevious", "fetchNext"]);

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
</script>

<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center">
      <Spinner />
    </div>
    <div v-else>
      <div class="grid grid-cols-1 gap-4">
        <PaperCard
          v-for="paper in papers"
          :key="paper.paperId"
          :paper="paper"
        />
      </div>
      <div v-if="papers.length > 0" class="flex justify-evenly mt-4">
        <button
          @click="fetchPrevious"
          :disabled="props.offset === 0"
          class="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 disabled:bg-indigo-100 text-white rounded"
        >
          Previous
        </button>
        <div class="p-2 rounded-xl bg-indigo-100">Showing {{ resultsRange }} of {{ total.toLocaleString() }}</div>
        <button
          @click="fetchNext"
          :disabled="props.next === null"
          class="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 disabled:bg-indigo-100 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
