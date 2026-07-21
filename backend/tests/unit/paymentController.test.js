import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { createRequest, createResponse } from "../helpers/http.js";

const paymentModelMock = {
  registerPayment: jest.fn(),
  getPaymentByRentId: jest.fn(),
  getPaymentById: jest.fn(),
  updatePayment: jest.fn(),
  removePayment: jest.fn(),
};

jest.unstable_mockModule("../../models/paymentModel.js", () => ({
  default: paymentModelMock,
}));

const {
  registerPayment,
  getPaymentByRentId,
  getPaymentById,
  updatePayment,
  removePayment,
} = await import("../../controllers/paymentController.js");

describe("paymentController", () => {
  beforeEach(() => jest.resetAllMocks());

  test("registerPayment persists the request body and returns 201", async () => {
    // Arrange
    const payment = { rent_id: 4, payment_amount: 120, date_payment: "2026-07-17" };
    const req = createRequest({ body: payment });
    const res = createResponse();
    paymentModelMock.registerPayment.mockResolvedValue(undefined);

    // Act
    await registerPayment(req, res);

    // Assert
    expect(paymentModelMock.registerPayment).toHaveBeenCalledTimes(1);
    expect(paymentModelMock.registerPayment).toHaveBeenCalledWith(payment);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Payment inserted successfully" });
  });

  test("getPaymentByRentId returns the payment for the supplied rent id", async () => {
    // Arrange
    const payment = { payment_id: 11, rent_id: 4 };
    const req = createRequest({ params: { id: "4" } });
    const res = createResponse();
    paymentModelMock.getPaymentByRentId.mockResolvedValue(payment);

    // Act
    await getPaymentByRentId(req, res);

    // Assert
    expect(paymentModelMock.getPaymentByRentId).toHaveBeenCalledWith("4");
    expect(res.json).toHaveBeenCalledWith(payment);
  });

  test("getPaymentById returns the payment for the supplied payment id", async () => {
    // Arrange
    const payment = { payment_id: 11 };
    const req = createRequest({ params: { id: "11" } });
    const res = createResponse();
    paymentModelMock.getPaymentById.mockResolvedValue(payment);

    // Act
    await getPaymentById(req, res);

    // Assert
    expect(paymentModelMock.getPaymentById).toHaveBeenCalledWith("11");
    expect(res.json).toHaveBeenCalledWith(payment);
  });

  test("updatePayment forwards the id and body and returns the updated payment", async () => {
    // Arrange
    const data = { payment_amount: 150 };
    const updatedPayment = { payment_id: 11, ...data };
    const req = createRequest({ params: { id: "11" }, body: data });
    const res = createResponse();
    paymentModelMock.updatePayment.mockResolvedValue(updatedPayment);

    // Act
    await updatePayment(req, res);

    // Assert
    expect(paymentModelMock.updatePayment).toHaveBeenCalledWith("11", data);
    expect(res.json).toHaveBeenCalledWith(updatedPayment);
  });

  test("removePayment forwards the id and returns the controller's 204 response", async () => {
    // Arrange
    const removedPayment = { payment_id: 11 };
    const req = createRequest({ params: { id: "11" } });
    const res = createResponse();
    paymentModelMock.removePayment.mockResolvedValue(removedPayment);

    // Act
    await removePayment(req, res);

    // Assert
    expect(paymentModelMock.removePayment).toHaveBeenCalledTimes(1);
    expect(paymentModelMock.removePayment).toHaveBeenCalledWith("11");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith(removedPayment);
  });

  test("returns 500 when a model operation rejects", async () => {
    // Arrange
    const req = createRequest({ body: { rent_id: 4 } });
    const res = createResponse();
    paymentModelMock.registerPayment.mockRejectedValue(new Error("Payment database error"));

    // Act
    await registerPayment(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Payment database error" });
  });
});
