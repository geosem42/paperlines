<script setup>
import { watch } from "vue";
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import Spinner from "./Spinner.vue";
import * as zingchart from "zingchart/es6";
import "zingchart/modules-es6/zingchart-tree.min.js";
import { useStore } from "../store";

const store = useStore();
const emit = defineEmits(["closeModal"]);

const props = defineProps({
  paper: Object,
  isOpen: Boolean,
});

function closeModal() {
  emit("closeModal");
}
defineExpose({
  closeModal,
});

watch(
  () => [props.isOpen, props.paper],
  ([newIsOpen, newPaperDetails]) => {
    if (newIsOpen && newPaperDetails) {
      console.log('props: ', props.paper);
    }
  }
);


</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div :key="props.paper.paperId" class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                {{ props.paper.title }}
              </DialogTitle>

              <div v-if="store.isLoading">
                <Spinner />
              </div>

              <div v-else>
                <div v-if="!store.isLoading" class="mt-2">
                  <div id="chart"></div>
                  <p class="text-sm text-gray-500">
                    <ul>
                      <li v-for="reference in props.paper.references" :key="reference.paperId">
                        {{ reference.title }}
                      </li>
                    </ul>
                  </p>
                </div>

                <div class="mt-4">
                  <button type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    @click="$emit('closeModal')">
                    Close
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
