<script setup>
import { computed } from "vue";
import { useStore } from "../store";

const store = useStore();

const fetchPrevious = () => {
    store.offset = Math.max(0, store.offset - 10);
    store.fetchPapers();
};

const fetchNext = () => {
    store.offset = store.next;
    store.fetchPapers();
};


const resultsRange = computed(() => {
    const start = store.offset + 1;
    const end = store.offset + store.papers.length;
    return `${start}-${end}`;
});
</script>

<template>
    <div v-if="store.papers.length > 0" class="flex justify-center gap-4 mt-4">
        <button @click="fetchPrevious" :disabled="store.offset === 0"
            class="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-100 text-white rounded-lg">
            Previous
        </button>
        <div class="p-2 rounded-lg font-semibold bg-indigo-100 text-indigo-700">
            Showing {{ resultsRange }} of {{ store.total.toLocaleString() }}
        </div>
        <button @click="fetchNext" :disabled="store.next === null"
            class="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-100 text-white rounded-lg">
            Next
        </button>
    </div>
</template>
