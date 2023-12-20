<script setup>
import { computed } from 'vue'
import SearchInput from "./components/SearchInput.vue";
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

const showSearchInput = computed(() => !route.path.includes('/papers/'));
</script>

<template>
  <div class="container mx-auto p-8">
    <SearchInput v-if="showSearchInput" @search="handleSearch" />
    <router-view></router-view>
  </div>
</template>
