import { createPinia, defineStore } from "pinia";

export const pinia = createPinia();
const apiKey = import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY;

export const useStore = defineStore({
  id: "main",
  state: () => ({
    papers: [],
    offset: 0,
    next: null,
    total: 0,
    paperDetails: null,
    isLoading: false,
    isFetching: false
  }),
  actions: {
    async fetchPapers(searchQuery) {
      this.isFetching = true;

      try {
        const response = await fetch(
          `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(searchQuery)}&offset=${this.offset}&fields=paperId,title,abstract,referenceCount`,
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
        this.papers = data.data;
        this.offset = data.offset;
        this.next = data.next;
        this.total = data.total;
      } catch (error) {
        console.error("Fetching papers failed:", error);
      } finally {
        this.isFetching = false;
      }
    },
    async fetchPaperDetails(paperId) {
      this.isLoading = true;
      const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/${paperId}?fields=references`,
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
      this.paperDetails = data;
      this.isLoading = false;
    },
  },
});
