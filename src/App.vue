<script setup>
import { ref } from "vue";
import SearchInput from "./components/SearchInput.vue";
import PaperList from "./components/PaperList.vue";
import Spinner from "./components/Spinner.vue";
import { useStore } from './store';

const store = useStore();
const searchQuery = ref("");
const loading = ref(false);
const loadingPaperId = ref(null);

const handleSearch = (query) => {
  searchQuery.value = query;
  store.offset = 0;
  searchPapers();
};

const searchPapers = async () => {
  await store.fetchPapers(searchQuery.value);
};

const fetchPrevious = () => {
  store.offset = Math.max(0, store.offset - 10);
  searchPapers();
};

const fetchNext = () => {
  store.offset = store.next;
  searchPapers();
};

const viewPaper = async (paperId) => {
  loadingPaperId.value = paperId;

  try {
    await store.fetchPaperDetails(paperId);
  } catch (error) {
    console.error("Fetching paper details failed:", error);
  } finally {
    loadingPaperId.value = null;
  }
};
</script>

<template>
  <div class="container mx-auto p-8">
    <SearchInput @search="handleSearch" />
    <div v-if="store.isFetching" class="flex justify-center items-center">
      <Spinner />
    </div>
    <PaperList v-else :loadingPaperId="loadingPaperId"
      @fetchPrevious="fetchPrevious" @fetchNext="fetchNext" @viewPaper="viewPaper" />
  </div>
</template>
