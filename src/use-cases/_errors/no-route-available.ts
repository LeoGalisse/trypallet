export class NoRouteAvailableError extends Error {
  constructor(from: string, to: string) {
    super(`No route available from ${from} to ${to}`);
  }
}
