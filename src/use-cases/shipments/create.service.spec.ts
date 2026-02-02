import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryShipmentRepository } from "../../repositories/shipment/in-memory.js";
import { InMemoryPathRepository } from "../../repositories/path/in-memory.js";
import { CreateShipmentUseCase } from "./create.service.js";
import { NoRouteAvailableError } from "../_errors/no-route-available.js";

describe("Create Shipment Use Case", () => {
  let shipmentRepository: InMemoryShipmentRepository;
  let pathRepository: InMemoryPathRepository;
  let createShipmentUseCase: CreateShipmentUseCase;

  beforeEach(() => {
    shipmentRepository = new InMemoryShipmentRepository();
    pathRepository = new InMemoryPathRepository();
    createShipmentUseCase = new CreateShipmentUseCase(
      shipmentRepository,
      pathRepository
    );

    pathRepository.createNode("A");
    pathRepository.createNode("B");
    pathRepository.createNode("C");
    pathRepository.createEdge("A", "B", 10);
    pathRepository.createEdge("B", "C", 15);
  });

  it("should be able to create a shipment with valid route", async () => {
    const { shipment } = await createShipmentUseCase.execute({
      from: "A",
      to: "B",
      status: "pending"
    });

    expect(shipment.id).toEqual(expect.any(String));
    expect(shipment.from).toBe("A");
    expect(shipment.to).toBe("B");
    expect(shipment.status).toBe("pending");
    expect(shipment.eta).toBe(10);
  });

  it("should calculate correct ETA for multi-hop route", async () => {
    const { shipment, eta } = await createShipmentUseCase.execute({
      from: "A",
      to: "C",
      status: "pending"
    });

    expect(eta).toBe(25);
    expect(shipment.eta).toBe(25);
  });

  it("should throw NoRouteAvailableError when no route exists", async () => {
    pathRepository.createNode("D");

    await expect(() =>
      createShipmentUseCase.execute({
        from: "A",
        to: "D",
        status: "pending"
      })
    ).rejects.toBeInstanceOf(NoRouteAvailableError);
  });

  it("should throw NoRouteAvailableError for non-existent nodes", async () => {
    await expect(() =>
      createShipmentUseCase.execute({
        from: "X",
        to: "Y",
        status: "pending"
      })
    ).rejects.toBeInstanceOf(NoRouteAvailableError);
  });

  it("should create shipment with in_progress status", async () => {
    const { shipment } = await createShipmentUseCase.execute({
      from: "A",
      to: "B",
      status: "in_progress"
    });

    expect(shipment.status).toBe("in_progress");
  });

  it("should create shipment with delivered status", async () => {
    const { shipment } = await createShipmentUseCase.execute({
      from: "A",
      to: "B",
      status: "delivered"
    });

    expect(shipment.status).toBe("delivered");
  });

  it("should calculate ETA of 0 for same node route", async () => {
    const { shipment, eta } = await createShipmentUseCase.execute({
      from: "A",
      to: "A",
      status: "pending"
    });

    expect(eta).toBe(0);
    expect(shipment.eta).toBe(0);
  });
});
