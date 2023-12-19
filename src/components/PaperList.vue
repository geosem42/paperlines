<script setup>
import PaperCard from "./PaperCard.vue";
import Spinner from "./Spinner.vue";
import Pagination from "./Pagination.vue";
import { useStore } from "../store";

const store = useStore();

const props = defineProps({
  loadingPaperId: String,
});

const emit = defineEmits(["viewPaper"]);

</script>

<template>
  <div>
    <div v-if="store.isFetching" class="flex justify-center items-center">
      <Spinner />
    </div>
    <div v-else>
      <div class="grid grid-cols-1 gap-4">
        <PaperCard v-for="paper in store.papers" :key="paper.paperId" :paper="paper" />
      </div>
      <Pagination />
    </div>
  </div>
</template>
