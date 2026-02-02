export class ShipmentDoesNotExistError extends Error {
  constructor() {
    super("Shipment does not exist");
  }
}