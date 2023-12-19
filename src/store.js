import { createPinia, defineStore } from "pinia";
import { ref } from "vue";

export const pinia = createPinia();
const apiKey = import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY;

export const useStore = defineStore("main", () => {
  const papers = ref([]);
  const offset = ref(0);
  const next = ref(null);
  const total = ref(0);
  const paperDetails = ref(null);
  const isLoading = ref(false);
  const isFetching = ref(false);
  const searchQuery = ref("");

  const setSearchQuery = (query) => {
    searchQuery.value = query;
  };

  const fetchPapers = async () => {
    isFetching.value = true;

    try {
      const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
          searchQuery.value
        )}&offset=${offset.value}&fields=paperId,title,abstract,referenceCount`,
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      papers.value = data.data;
      offset.value = data.offset;
      next.value = data.next;
      total.value = data.total;
    } catch (error) {
      console.error("Fetching papers failed:", error);
    } finally {
      isFetching.value = false;
    }
  };

  const fetchPaperDetails = async (paperId) => {
    isLoading.value = true;
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/${paperId}?fields=paperId,title,references`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    paperDetails.value = data;
    isLoading.value = false;
  };

  return {
    papers,
    offset,
    next,
    total,
    paperDetails,
    isLoading,
    isFetching,
    searchQuery,
    setSearchQuery,
    fetchPapers,
    fetchPaperDetails,
  };
});
