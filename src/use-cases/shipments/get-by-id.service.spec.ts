import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryShipmentRepository } from "../../repositories/shipment/in-memory.js";
import { GetShipmentUseCase } from "./get-by-id.service.js";
import { ShipmentDoesNotExistError } from "../_errors/shipment-does-not-exist.js";

describe("Get Shipment Use Case", () => {
  let shipmentRepository: InMemoryShipmentRepository;
  let getShipmentUseCase: GetShipmentUseCase;

  beforeEach(() => {
    shipmentRepository = new InMemoryShipmentRepository();
    getShipmentUseCase = new GetShipmentUseCase(shipmentRepository);
  });

  it("should be able to get a shipment by id", async () => {
    const createdShipment = await shipmentRepository.create({
      from: "A",
      to: "B",
      status: "pending",
      eta: 10
    });

    const shipment = await getShipmentUseCase.execute(createdShipment.id);

    expect(shipment).toEqual(createdShipment);
    expect(shipment?.id).toBe(createdShipment.id);
    expect(shipment?.from).toBe("A");
    expect(shipment?.to).toBe("B");
    expect(shipment?.status).toBe("pending");
    expect(shipment?.eta).toBe(10);
  });

  it("should throw ShipmentDoesNotExistError when shipment is not found", async () => {
    await expect(() =>
      getShipmentUseCase.execute("non-existent-id")
    ).rejects.toBeInstanceOf(ShipmentDoesNotExistError);
  });

  it("should retrieve shipment with in_progress status", async () => {
    const createdShipment = await shipmentRepository.create({
      from: "C",
      to: "D",
      status: "in_progress",
      eta: 20
    });

    const shipment = await getShipmentUseCase.execute(createdShipment.id);

    expect(shipment?.status).toBe("in_progress");
  });

  it("should retrieve shipment with delivered status", async () => {
    const createdShipment = await shipmentRepository.create({
      from: "E",
      to: "F",
      status: "delivered",
      eta: 30
    });

    const shipment = await getShipmentUseCase.execute(createdShipment.id);

    expect(shipment?.status).toBe("delivered");
  });
});
