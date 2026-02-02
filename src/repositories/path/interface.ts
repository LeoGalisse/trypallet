export interface PathRepository {
  createNode(node: string): void;
  createEdge(from: string, to: string, weight: number): void;
  getShortestPath(from: string, to: string): { path: string[], distance: number };
}