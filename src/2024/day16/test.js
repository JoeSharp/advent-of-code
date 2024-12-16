"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Graph_1 = __importDefault(require("comp-sci-maths-lib/dist/dataStructures/graph/Graph"));
const dijkstras_1 = require("comp-sci-maths-lib/dist/algorithms/routing/dijkstras");
const common_1 = require("comp-sci-maths-lib/dist/common");
const vertexA = common_1.getStringVertex("A");
const vertexB = common_1.getStringVertex("B");
const vertexC = common_1.getStringVertex("C");
const vertexD = common_1.getStringVertex("D");
const vertexE = common_1.getStringVertex("E");
const vertexF = common_1.getStringVertex("F");
const vertexG = common_1.getStringVertex("G");
const vertexH = common_1.getStringVertex("H");
const vertexI = common_1.getStringVertex("I");
const vertexJ = common_1.getStringVertex("J");
const vertexK = common_1.getStringVertex("K");
const vertexL = common_1.getStringVertex("L");
const vertexS = common_1.getStringVertex("S");
test("Routing Algorithms - Dead End", () => {
    const myGraph = new Graph_1.default()
        .addBiDirectionalEdge(vertexA, vertexB)
        .addBiDirectionalEdge(vertexB, vertexC)
        .addBiDirectionalEdge(vertexE, vertexD);
    const shortestPathTree = dijkstras_1.dijstraks({
        graph: myGraph,
        sourceNodeKey: vertexA.key,
        destinationNodeKey: vertexD.key,
    });
    // Check the unreachable nodes
    [vertexD, vertexE].forEach((u) => {
        expect(shortestPathTree[u.key].cost).toBe(Infinity);
        expect(shortestPathTree[u.key].viaNode).toBeUndefined();
    });
    const pathTo = dijkstras_1.getPathTo({
        graph: myGraph,
        shortestPathTree,
        node: vertexD,
    });
    // Should be empty with no available path
    expect(pathTo).toStrictEqual([]);
});
// https://youtu.be/ySN5Wnu88nE?t=239
test("Routing Algorithms - A*", () => {
    // The addition that A* has is the use of a heuristic to
    // provide the algorithm with a sense of direction.
    const euclideanDistances = {
        S: 10,
        A: 9,
        B: 7,
        C: 8,
        D: 8,
        E: 0,
        F: 6,
        G: 3,
        H: 6,
        I: 4,
        J: 4,
        K: 3,
        L: 6,
    };
    const myGraph = new Graph_1.default()
        .addBiDirectionalEdge(vertexS, vertexA, 7)
        .addBiDirectionalEdge(vertexS, vertexB, 2)
        .addBiDirectionalEdge(vertexS, vertexC, 3)
        .addBiDirectionalEdge(vertexA, vertexD, 4)
        .addBiDirectionalEdge(vertexA, vertexB, 3)
        .addBiDirectionalEdge(vertexB, vertexD, 4)
        .addBiDirectionalEdge(vertexB, vertexH, 1)
        .addBiDirectionalEdge(vertexC, vertexL, 2)
        .addBiDirectionalEdge(vertexD, vertexF, 5)
        .addBiDirectionalEdge(vertexE, vertexK, 5)
        .addBiDirectionalEdge(vertexE, vertexG, 2)
        .addBiDirectionalEdge(vertexF, vertexH, 3)
        .addBiDirectionalEdge(vertexG, vertexH, 2)
        .addBiDirectionalEdge(vertexI, vertexL, 4)
        .addBiDirectionalEdge(vertexI, vertexK, 4)
        .addBiDirectionalEdge(vertexJ, vertexL, 4)
        .addBiDirectionalEdge(vertexJ, vertexK, 4);
    const observations = [];
    const shortestPathTreeStoE = dijkstras_1.dijstraks({
        graph: myGraph,
        sourceNodeKey: vertexS.key,
        destinationNodeKey: vertexE.key,
        getHeuristicCost: (d) => euclideanDistances[d.key],
        observer: (d) => observations.push(d),
    });
    expect(observations.length).toBeGreaterThan(1);
    const pathStoE = dijkstras_1.getPathTo({
        graph: myGraph,
        shortestPathTree: shortestPathTreeStoE,
        node: vertexE,
    });
    expect(pathStoE).toEqual([vertexS, vertexB, vertexH, vertexG, vertexE]);
});
// https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/
test("Routing Algorithms - Dijkstra", () => {
    const myGraph = new Graph_1.default()
        .addBiDirectionalEdge(vertexA, vertexB, 4)
        .addBiDirectionalEdge(vertexA, vertexH, 8)
        .addBiDirectionalEdge(vertexB, vertexC, 8)
        .addBiDirectionalEdge(vertexB, vertexH, 11)
        .addBiDirectionalEdge(vertexC, vertexD, 7)
        .addBiDirectionalEdge(vertexC, vertexI, 2)
        .addBiDirectionalEdge(vertexC, vertexF, 4)
        .addBiDirectionalEdge(vertexD, vertexE, 9)
        .addBiDirectionalEdge(vertexD, vertexF, 14)
        .addBiDirectionalEdge(vertexE, vertexF, 10)
        .addBiDirectionalEdge(vertexF, vertexG, 2)
        .addBiDirectionalEdge(vertexG, vertexH, 1)
        .addBiDirectionalEdge(vertexG, vertexI, 6)
        .addBiDirectionalEdge(vertexH, vertexI, 7);
    const viaNode = vertexA;
    const shortestPathTreeAll = dijkstras_1.dijstraks({
        graph: myGraph,
        sourceNodeKey: viaNode.key,
    });
    expect(shortestPathTreeAll).toEqual({
        [vertexA.key]: { cost: 0, viaNode: undefined, priority: Infinity },
        [vertexB.key]: { cost: 4, viaNode: vertexA, priority: 1 / 4 },
        [vertexC.key]: { cost: 12, viaNode: vertexB, priority: 1 / 12 },
        [vertexD.key]: { cost: 19, viaNode: vertexC, priority: 1 / 19 },
        [vertexE.key]: { cost: 21, viaNode: vertexF, priority: 1 / 21 },
        [vertexF.key]: { cost: 11, viaNode: vertexG, priority: 1 / 11 },
        [vertexG.key]: { cost: 9, viaNode: vertexH, priority: 1 / 9 },
        [vertexH.key]: { cost: 8, viaNode: vertexA, priority: 1 / 8 },
        [vertexI.key]: { cost: 14, viaNode: vertexC, priority: 1 / 14 },
    });
    const pathTo4 = dijkstras_1.getPathTo({
        graph: myGraph,
        shortestPathTree: shortestPathTreeAll,
        node: vertexE,
    });
    expect(pathTo4).toEqual([vertexA, vertexH, vertexG, vertexF, vertexE]);
    const pathTo3 = dijkstras_1.getPathTo({
        graph: myGraph,
        shortestPathTree: shortestPathTreeAll,
        node: vertexD,
    });
    expect(pathTo3).toEqual([vertexA, vertexB, vertexC, vertexD]);
    const pathTo8 = dijkstras_1.getPathTo({
        graph: myGraph,
        shortestPathTree: shortestPathTreeAll,
        node: vertexI,
    });
    expect(pathTo8).toEqual([vertexA, vertexB, vertexC, vertexI]);
    // Do the same thing again, but only find the route to one node
    // It should come up with the same answer, but will make no attempt to route 'every node'
    const shortestPathTree4only = dijkstras_1.dijstraks({
        graph: myGraph,
        sourceNodeKey: viaNode.key,
        destinationNodeKey: vertexE.key,
    } // this time specifying the toNode
    );
    const pathTo4only = dijkstras_1.getPathTo({
        graph: myGraph,
        shortestPathTree: shortestPathTree4only,
        node: vertexE,
    });
    expect(pathTo4only).toEqual([vertexA, vertexH, vertexG, vertexF, vertexE]);
});
//# sourceMappingURL=test.js.map
