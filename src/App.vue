<script setup>
import { ref } from "vue"
import SearchInput from './components/SearchInput.vue'
import PaperList from './components/PaperList.vue'
import Spinner from './components/Spinner.vue'

const papers = ref([])
const offset = ref(0)
const next = ref(0)
const total = ref(0)
const searchQuery = ref("")
const loading = ref(false)

const apiKey = import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY

const handleSearch = (query) => {
  searchQuery.value = query
  offset.value = 0
  fetchPapers()
};

const fetchPapers = async () => {
  loading.value = true

  try {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
        searchQuery.value
      )}&offset=${offset.value}&fields=paperId,title,abstract`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    papers.value = data.data
    offset.value = data.offset
    next.value = data.next
    total.value = data.total
  } catch (error) {
    console.error("Fetching papers failed:", error)
  } finally {
    loading.value = false
  }
};

const fetchPrevious = () => {
  offset.value = Math.max(0, offset.value - 10);
  fetchPapers();
};

const fetchNext = () => {
  offset.value = next.value;
  fetchPapers();
};
</script>

<template>
  <div class="container mx-auto p-8">
    <SearchInput @search="handleSearch" />
    <div v-if="loading" class="flex justify-center items-center">
      <Spinner />
    </div>
    <PaperList v-else :papers="papers" :offset="offset" :next="next" :total="total" @fetchPrevious="fetchPrevious" @fetchNext="fetchNext" />
  </div>
</template>
