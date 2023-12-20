<script setup>
import { ref, onMounted, watch, nextTick, reactive } from 'vue';
import { useStore } from '../store';
import { useRoute, useRouter } from 'vue-router';
import * as d3 from 'd3';

const route = useRoute();
const router = useRouter();
const store = useStore();
const paper = ref(null);
const graphContainer = ref(null);
const highlightedNode = reactive({ id: null });
const highlightedLink = ref(null);
const referenceElements = reactive({});

onMounted(() => {
	const paperId = route.params.paperId;
	paper.value = store.papers.find(p => p.paperId === paperId);
});

const goBack = () => {
	router.push('/');
};

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

	const zoom = d3.zoom()
		.scaleExtent([0.1, 10])
		.on('zoom', (event) => {
			svg.attr('transform', event.transform);
		});

	const tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0)
		.style("background-color", "black")
		.style("color", "white")
		.style("padding", "5px")
		.style("border-radius", "5px")
		.style("width", "200px")
		.style("text-align", "center")
		.style("position", "absolute")
		.style("pointer-events", "none");

	const svg = d3.select(graphContainer.value)
		.append('svg')
		.attr('width', '100%')
		.attr('height', height)
		.call(zoom)
		.append('g');

	const nodeIds = new Set(nodes.map(node => node.id));
	links.forEach(link => {
		if (!nodeIds.has(link.source) || !nodeIds.has(link.target)) {
			console.error('Link with non-existent node:', link);
		}
	});

	const validLinks = links.filter(link => nodeIds.has(link.source) && nodeIds.has(link.target));

	const simulation = d3.forceSimulation(nodes)
		.force('link', d3.forceLink(validLinks).id(d => d.id))
		.force('charge', d3.forceManyBody().strength(-1000))
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
		.attr('r', 5)
		.style('fill', d => d === originNode ? '#800080' : '#69b3a2')
		.call(drag(simulation))
		.attr('id', d => 'node-' + d.id)
		.on('click', function (event, d) {
			if (highlightedNode.id && highlightedNode.id === d.id) {
				// If the clicked node is already highlighted, dehighlight it
				d3.select(this).style('fill', d === originNode ? '#800080' : '#69b3a2');
				highlightedNode.id = null;
				highlightedLink.value = null;
			} else {
				// If another node is highlighted, dehighlight it
				if (highlightedNode.id) {
					d3.select('#node-' + highlightedNode.id).style('fill', d === originNode ? '#800080' : '#69b3a2');
				}
				// Highlight the clicked node
				d3.select(this).style('fill', '#4338CA');
				highlightedNode.id = d.id;
				highlightedLink.value = d.id;
			}
			// Scroll to the li element
			if (referenceElements[d.id]) {
				referenceElements[d.id].scrollIntoView({ behavior: 'smooth' });
			}
		});

	node.on('mouseover', function (event, d) {
		d3.select(this).style('cursor', 'pointer');
		tooltip.transition()
			.duration(200)
			.style("opacity", 1);
		tooltip.html(d.name)
			.style("left", (event.pageX + 10) + "px")
			.style("top", (event.pageY - 10) + "px");
	})
		.on('mouseout', function (event, d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0);
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
	});
};

const highlightNode = (reference) => {
	if (highlightedLink.value === reference.paperId) {
		// If the link is already highlighted, dehighlight it
		d3.select('#node-' + highlightedNode.id).style('fill', '#69b3a2');
		highlightedNode.id = null;
		highlightedLink.value = null;
	} else {
		// If the link is not highlighted, highlight it
		if (highlightedNode.id) {
			// If there is another node highlighted, dehighlight it
			d3.select('#node-' + highlightedNode.id).style('fill', '#69b3a2');
		}
		d3.select('#node-' + reference.paperId).style('fill', '#4338CA');
		highlightedNode.id = reference.paperId;
		highlightedLink.value = reference.paperId;
	}
};

watch(
	() => paper.value,
	async (newPaperDetails) => {
		if (newPaperDetails) {
			await nextTick();
			if (graphContainer.value) {
				const nodes = [
					{ id: paper.value.paperId, name: paper.value.title, group: 0 },
					...paper.value.references.map(ref => ({ id: ref.paperId ? ref.paperId : 'unknown', name: ref.title, group: 1 }))
				];
				const links = paper.value.references.map(ref => ({
					source: paper.value.paperId,
					target: ref.paperId ? ref.paperId : 'unknown',
					value: 1
				}));
				createForceDirectedGraph(nodes, links);
			} else {
				console.error('Graph container element is still not available.');
			}
		}
	}, { immediate: true }
);

watch(
	() => highlightedNode.id,
	(newNodeId) => {
		if (newNodeId) {
			d3.select('#node-' + newNodeId).style('fill', '#4338CA');
		}
	}
);
</script>

<template>
	<div v-if="paper">
		<header class="antialiased">
			<nav class="bg-white border border-gray-200 px-4 lg:px-6 py-2.5 rounded-lg">
				<div class="flex flex-wrap justify-between items-center">
					<div class="flex justify-start items-center">
						<button @click="goBack" type="button"
							class="hidden p-2 mr-3 bg-indigo-100 text-indigo-600 rounded cursor-pointer lg:inline hover:text-gray-100 hover:bg-indigo-500">
							<svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
								viewBox="0 0 14 10">
								<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M13 5H1m0 0l4 4m-4-4l4-4" />
							</svg>
						</button>
						<a href="#" class="flex mr-4">
							<span class="self-center text-2xl font-semibold whitespace-nowrap">{{ paper.title }}</span>
						</a>
					</div>
					<div class="flex items-center lg:order-2">
						<button type="button" data-dropdown-toggle="notification-dropdown"
							class="p-2 mr-1 bg-indigo-100 text-indigo-600 rounded-lg hover:text-gray-100 hover:bg-indigo-500 focus:ring-4 focus:ring-gray-300 font-semibold">
							<span class="sr-only">Number of References</span>
							{{ paper.referenceCount }}
						</button>
					</div>
				</div>
			</nav>
		</header>
		<div class="flex flex-wrap md:flex-nowrap">
			<div ref="graphContainer" class="w-full md:w-2/3 p-4">
				<!-- Graph will be rendered here -->
			</div>

			<div class="w-full md:w-1/3 p-4">
				<h2 class="text-indigo-700 font-bold text-lg">Referenced Papers</h2>
				<ul role="list" class="divide-y divide-gray-100 overflow-y-auto max-h-[600px]">
					<li v-for="reference in paper.references" :key="reference.paperId"
						class="flex justify-between gap-x-6 p-5 rounded-lg"
						:class="{ 'bg-indigo-100': highlightedLink === reference.paperId, 'text-gray-600': highlightedLink !== reference.paperId }"
						:ref="el => { if (el && reference.paperId) referenceElements[reference.paperId] = el; }">
						<div class="flex min-w-0 gap-x-4">
							<div class="min-w-0 flex-auto">
								<a href="#"
									:class="{ 'text-indigo-700': highlightedLink === reference.paperId, 'text-gray-600': highlightedLink !== reference.paperId }"
									class="text-sm font-semibold leading-6 hover:text-indigo-700" @click="highlightNode(reference)">
									{{ reference.title }}
								</a>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
