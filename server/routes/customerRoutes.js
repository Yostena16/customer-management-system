
const express = require("express");
const router = express.Router();
const controller = require("../controllers/customerController");

router.post("/", controller.createCustomer);        // POST   /api/customers
router.get("/", controller.getCustomers);            // GET    /api/customers
router.get("/:id", controller.getCustomerById);      // GET    /api/customers/:id
router.put("/:id", controller.updateCustomer);       // PUT    /api/customers/:id
router.delete("/:id", controller.deleteCustomer);    // DELETE /api/customers/:id

module.exports = router;