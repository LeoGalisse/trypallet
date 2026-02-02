import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryShipmentRepository } from "../../repositories/shipment/in-memory.js";
import { UpdateShipmentStatusUseCase } from "./update-status.service.js";
import { ShipmentDoesNotExistError } from "../_errors/shipment-does-not-exist.js";

describe("Update Shipment Status Use Case", () => {
  let shipmentRepository: InMemoryShipmentRepository;
  let updateShipmentStatusUseCase: UpdateShipmentStatusUseCase;

  beforeEach(() => {
    shipmentRepository = new InMemoryShipmentRepository();
    updateShipmentStatusUseCase = new UpdateShipmentStatusUseCase(
      shipmentRepository
    );
  });

  it("should be able to update shipment status", async () => {
    const createdShipment = await shipmentRepository.create({
      from: "A",
      to: "B",
      status: "pending",
      eta: 10
    });

    const updatedShipment = await updateShipmentStatusUseCase.execute(
      createdShipment.id,
      "in_progress"
    );

    expect(updatedShipment.id).toBe(createdShipment.id);
    expect(updatedShipment.status).toBe("in_progress");
    expect(updatedShipment.from).toBe("A");
    expect(updatedShipment.to).toBe("B");
    expect(updatedShipment.eta).toBe(10);
  });

  it("should update status from pending to delivered", async () => {
    const createdShipment = await shipmentRepository.create({
      from: "C",
      to: "D",
      status: "pending",
      eta: 20
    });

    const updatedShipment = await updateShipmentStatusUseCase.execute(
      createdShipment.id,
      "delivered"
    );

    expect(updatedShipment.status).toBe("delivered");
  });

  it("should update status from in_progress to delivered", async () => {
    const createdShipment = await shipmentRepository.create({
      from: "E",
      to: "F",
      status: "in_progress",
      eta: 30
    });

    const updatedShipment = await updateShipmentStatusUseCase.execute(
      createdShipment.id,
      "delivered"
    );

    expect(updatedShipment.status).toBe("delivered");
  });

  it("should throw ShipmentDoesNotExistError when shipment is not found", async () => {
    await expect(() =>
      updateShipmentStatusUseCase.execute("non-existent-id", "delivered")
    ).rejects.toBeInstanceOf(ShipmentDoesNotExistError);
  });

  it("should persist status update in repository", async () => {
    const createdShipment = await shipmentRepository.create({
      from: "G",
      to: "H",
      status: "pending",
      eta: 40
    });

    await updateShipmentStatusUseCase.execute(
      createdShipment.id,
      "in_progress"
    );

    const retrievedShipment = await shipmentRepository.findById(
      createdShipment.id
    );

    expect(retrievedShipment?.status).toBe("in_progress");
  });
});
