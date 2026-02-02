import { InMemoryPathRepository } from "../repositories/path/in-memory.js";

export function seedPathData(pathRepository: InMemoryPathRepository): void {
  console.log("Seeding path data...");

  const nodes = ["A", "B", "C", "D", "E", "F"];
  nodes.forEach(node => {
    pathRepository.createNode(node);
  });

  const edges: [string, string, number][] = [
    ["A", "B", 4],
    ["A", "C", 2],
    ["B", "C", 1],
    ["B", "D", 5],
    ["C", "D", 8],
    ["C", "E", 10],
    ["D", "E", 2],
    ["D", "F", 6],
    ["E", "F", 3]
  ];

  edges.forEach(([from, to, weight]) => {
    pathRepository.createEdge(from, to, weight);
  });

  console.log(`Seeded ${nodes.length} nodes and ${edges.length} edges`);
}
