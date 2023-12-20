<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import * as d3 from 'd3';

const emit = defineEmits(["closeModal"]);
const graphContainer = ref(null);

const props = defineProps({
  paper: Object,
  isOpen: Boolean,
});

const createForceDirectedGraph = (nodes, links) => {
  d3.select(graphContainer.value).selectAll("*").remove();
  const width = 1000;
  const height = 600;
  const drag = simulation => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  const svg = d3.select(graphContainer.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const nodeIds = new Set(nodes.map(node => node.id));
  links.forEach(link => {
    if (!nodeIds.has(link.source) || !nodeIds.has(link.target)) {
      console.error('Link with non-existent node:', link);
    }
  });
  
  const validLinks = links.filter(link => nodeIds.has(link.source) && nodeIds.has(link.target));

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(validLinks).id(d => d.id))
    .force('charge', d3.forceManyBody().strength(-5000))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = svg.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .style('stroke', '#999')
    .style('stroke-opacity', 0.6)
    .style('stroke-width', d => Math.sqrt(d.value));

  // Calculate the degree for each node based on the links
  nodes.forEach(node => {
    node.degree = links.reduce((acc, link) => {
      return acc + (link.source === node || link.target === node ? 1 : 0);
    }, 0);
  });

  // Sort nodes by degree and take the one with the highest degree as the origin node
  const originNode = nodes.sort((a, b) => b.degree - a.degree)[0];

  const node = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 15)
    .style('fill', d => d === originNode ? '#800080' : '#69b3a2') // Use purple for the origin node
    .call(drag(simulation));

  const text = svg.append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text(d => d.name)
    .style('font-size', '12px')
    .style('text-anchor', 'middle')
    .style('fill', '#555')
    .style('opacity', 0) // Set initial opacity to 0 to hide text
    .style('pointer-events', 'none'); // Make sure the text itself does not interfere with mouse events

  node.on('mouseover', function (event, d) {
    d3.select(this).style('cursor', 'pointer'); // Optional: change the cursor on hover
    d3.select(text.nodes()[nodes.indexOf(d)])
      .style('opacity', 1); // Show the text element on hover
  })
    .on('mouseout', function (event, d) {
      d3.select(text.nodes()[nodes.indexOf(d)])
        .style('opacity', 0); // Hide the text element when not hovering
    });

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    text
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });
};

function closeModal() {
  emit("closeModal");
}
defineExpose({
  closeModal,
});

watch(
  () => [props.isOpen, props.paper],
  async ([newIsOpen, newPaperDetails]) => {
    if (newIsOpen && newPaperDetails) {
      await nextTick();
      console.log('props.isOpen: ', props.isOpen)
      console.log('props.paper: ', props.paper)
      if (graphContainer.value) {
        const nodes = [
          { id: props.paper.paperId, name: props.paper.title, group: 0 },
          ...props.paper.references.map(ref => ({ id: ref.paperId, name: ref.title, group: 1 }))
        ];
        const links = props.paper.references.map(ref => ({
          source: props.paper.paperId,
          target: ref.paperId,
          value: 1
        }));
        createForceDirectedGraph(nodes, links);
      } else {
        console.error('Graph container element is still not available.');
      }
    }
  }, { immediate: true }
);


onMounted(() => {
  console.log('onMounted triggered');
  if (props.isOpen && props.paper) {
    const nodes = [
      { id: props.paper.paperId, name: props.paper.title, group: 0 },
      ...props.paper.references.map(ref => ({ id: ref.paperId, name: ref.title, group: 1 }))
    ];

    const links = props.paper.references.map(ref => ({
      source: props.paper.paperId,
      target: ref.paperId,
      value: 1
    }));

    createForceDirectedGraph(nodes, links);
  }
})

</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
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

              <div ref="graphContainer"></div>
              <p class="text-sm text-gray-500">
              <ul>
                <li v-for="reference in props.paper.references" :key="reference.paperId">
                  {{ reference.title }}
                </li>
              </ul>
              </p>

              <div class="mt-4">
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  @click="$emit('closeModal')">
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
