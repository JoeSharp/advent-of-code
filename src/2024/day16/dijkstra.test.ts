import { createInitialState, Graph, addBidirectionalEdge, addVertex } from "comp-sci-maths-lib/dist/dataStructures/graph/graphReducer";

//"comp-sci-maths-lib/lib/dataStructures/graph/graphReducer";

//import { Graph } from "@comp-sci-maths/lib/dist/dataStructures/graph/graphReducer";
test("Routing Algorithms - Dijkstra", () => {
  let myGraph: Graph = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]
    .reduce((acc, curr) => addVertex(acc, curr), createInitialState());
  myGraph = [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "H", weight: 8 },
    { from: "B", to: "C", weight: 8 },
    { from: "B", to: "H", weight: 11 },
    { from: "C", to: "D", weight: 7 },
    { from: "C", to: "I", weight: 2 },
    { from: "C", to: "F", weight: 4 },
    { from: "D", to: "E", weight: 9 },
    { from: "D", to: "F", weight: 14 },
    { from: "E", to: "F", weight: 10 },
    { from: "F", to: "G", weight: 2 },
    { from: "G", to: "H", weight: 1 },
    { from: "G", to: "I", weight: 6 },
    { from: "H", to: "I", weight: 7 },
  ].reduce((acc, curr) => addBidirectionalEdge(acc, curr.from, curr.to, curr.weight), myGraph);

  const viaNode = "A";
  const shortestPathTreeAll: ShortestPathTree = dijkstras({
    graph: myGraph,
    sourceNode: viaNode,
  });
  expect(shortestPathTreeAll).toEqual({
    ["A"]: { cost: 0, viaNode: undefined },
    ["B"]: { cost: 4, viaNode: "A" },
    ["C"]: { cost: 12, viaNode: "B" },
    ["D"]: { cost: 19, viaNode: "C" },
    ["E"]: { cost: 21, viaNode: "F" },
    ["F"]: { cost: 11, viaNode: "G" },
    ["G"]: { cost: 9, viaNode: "H" },
    ["H"]: { cost: 8, viaNode: "A" },
    ["I"]: { cost: 14, viaNode: "C" },
  });

  const pathTo4 = getPathTo({
    graph: myGraph,
    shortestPathTree: shortestPathTreeAll,
    node: "E",
  });
  expect(pathTo4).toEqual(["A", "H", "G", "F", "E"]);

  const pathTo3 = getPathTo({
    graph: myGraph,
    shortestPathTree: shortestPathTreeAll,
    node: "D",
  });
  expect(pathTo3).toEqual(["A", "B", "C", "D"]);

  const pathTo8 = getPathTo({
    graph: myGraph,
    shortestPathTree: shortestPathTreeAll,
    node: "I",
  });
  expect(pathTo8).toEqual(["A", "B", "C", "I"]);

  // Do the same thing again, but only find the route to one node
  // It should come up with the same answer, but will make no attempt to route ''
  const shortestPathTree4only: ShortestPathTree = dijkstras(
    {
      graph: myGraph,
      sourceNode: viaNode,
      destinationNode: "E",
    } // this time specifying the toNode
  );
  const pathTo4only = getPathTo({
    graph: myGraph,
    shortestPathTree: shortestPathTree4only,
    node: "E",
  });
  expect(pathTo4only).toEqual(["A", "H", "G", "F", "E"]);
});
