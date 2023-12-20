<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useStore } from '../store';
import { useRoute, useRouter } from 'vue-router';
import * as d3 from 'd3';

const route = useRoute();
const router = useRouter();
const store = useStore();
const paper = ref(null);
const graphContainer = ref(null);

onMounted(() => {
	const paperId = route.params.paperId;
	paper.value = store.papers.find(p => p.paperId === paperId);
});

const goBack = () => {
	router.push('/');
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
		.attr('width', graphContainer.value.offsetWidth)
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
		.call(drag(simulation));

	const text = svg.append('g')
		.selectAll('text')
		.data(nodes)
		.join('text')
		.text(d => d.name)
		.style('font-size', '12px')
		.style('text-anchor', 'middle')
		.style('fill', '#555')
		.style('opacity', 0)
		.style('pointer-events', 'none');

	node.on('mouseover', function (event, d) {
		d3.select(this).style('cursor', 'pointer');
		d3.select(text.nodes()[nodes.indexOf(d)])
			.style('opacity', 1);
	})
		.on('mouseout', function (event, d) {
			d3.select(text.nodes()[nodes.indexOf(d)])
				.style('opacity', 0);
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
</script>

<template>
	<button @click="goBack" type="button"
		class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mb-5">
		<svg class="w-3.5 h-3.5 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
			<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
				d="M13 5H1m0 0l4 4m-4-4l4-4" />
		</svg>
		Back
	</button>
	<div v-if="paper">
		<h1 class="font-bold text-xl">{{ paper.title }}</h1>
		<div ref="graphContainer"></div>
		<ul>
			<li v-for="reference in paper.references" :key="reference.paperId">
				{{ reference.title }}
			</li>
		</ul>
	</div>
</template>
