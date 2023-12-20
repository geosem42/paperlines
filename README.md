# PaperLines

This repository contains a dynamic and interactive data visualization project built with Vue.js and D3.js. It provides a unique way to visualize academic papers and their references. Each paper is represented as a node in a force-directed graph, and references between papers are represented as links. Users can click on a node to highlight it and view the paper’s title. The list of referenced papers is also displayed, and clicking on a paper in the list highlights the corresponding node in the graph.

# Installation
Get an API key from [Semantic Scholar](https://www.semanticscholar.org/product/api) and add it to the `.env.local` file.
```
VITE_SEMANTIC_SCHOLAR_API_KEY=
```
Install packages
```
npm install
```
Run server
```
npm run dev
```