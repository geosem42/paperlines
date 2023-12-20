<script setup>
import { computed } from 'vue'
import SearchInput from "./components/SearchInput.vue";
import PaperList from "./components/PaperList.vue";
import Spinner from "./components/Spinner.vue";
import { useStore } from './store';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();

const handleSearch = (query) => {
  store.setSearchQuery(query);
  store.offset = 0;
  searchPapers();
};

const searchPapers = async () => {
  await store.fetchPapers();
};

const fetchPrevious = () => {
  store.offset = Math.max(0, store.offset - 10);
  searchPapers();
};

const fetchNext = () => {
  store.offset = store.next;
  searchPapers();
};

const showSearchInput = computed(() => !route.path.includes('/papers/'));
</script>

<template>
  <div class="container mx-auto p-8">
    <SearchInput v-if="showSearchInput" @search="handleSearch" />
    <router-view></router-view>
    <!-- <div v-if="store.isFetching" class="flex justify-center items-center">
      <Spinner />
    </div>
    <PaperList v-else @fetchPrevious="fetchPrevious" @fetchNext="fetchNext" /> -->
  </div>
</template>
