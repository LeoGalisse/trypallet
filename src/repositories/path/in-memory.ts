import type { PathRepository } from "./interface.js"

export class InMemoryPathRepository implements PathRepository {
  private nodes: Map<string, Map<string, string>>;

  constructor() {
    this.nodes = new Map()
  }

  createNode(node: string): void {
    if (!this.nodes.has(node)) {
      this.nodes.set(node, new Map());
    }
  }

  createEdge(from: string, to: string, weight: number): void {
    if (this.nodes.has(from) && this.nodes.has(to)) {
      this.nodes.get(from)?.set(to, weight.toString());
      this.nodes.get(to)?.set(from, weight.toString());
    }
  }

  getShortestPath(from: string, to: string): { path: string[], distance: number } {
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set<string>();

    this.nodes.forEach((_, node) => {
      distances.set(node, node === from ? 0 : Infinity);
      previous.set(node, null);
      unvisited.add(node);
    });

    while (unvisited.size > 0) {
      let currentNode: string | null = null;
      let minDistance = Infinity;

      unvisited.forEach(node => {
        const distance = distances.get(node)!;
        if (distance < minDistance) {
          minDistance = distance;
          currentNode = node;
        }
      });

      if (currentNode === null || minDistance === Infinity) break;
      if (currentNode === to) break;

      unvisited.delete(currentNode);

      const neighbors = this.nodes.get(currentNode);
      if (neighbors) {
        neighbors.forEach((weight, neighbor) => {
          if (unvisited.has(neighbor)) {
            const newDistance = distances.get(currentNode!)! + Number(weight);
            if (newDistance < distances.get(neighbor)!) {
              distances.set(neighbor, newDistance);
              previous.set(neighbor, currentNode);
            }
          }
        });
      }
    }

    const path: string[] = [];
    let current: string | null = to;

    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) ?? null;
    }

    const isValidPath = path[0] === from;
    const totalDistance = isValidPath ? distances.get(to) ?? 0 : 0;

    return {
      path: isValidPath ? path : [],
      distance: totalDistance
    };
  }
}
