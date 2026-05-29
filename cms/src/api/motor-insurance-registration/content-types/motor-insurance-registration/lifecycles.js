"use strict";

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;

    // Only generate if not already provided
    if (!data.paymentReference) {
      data.paymentReference = `INS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    // Ensure default status
    if (!data.paymentStatus) {
      data.paymentStatus = "pending";
    }
  },
};