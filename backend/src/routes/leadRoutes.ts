import express from "express";

import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
} from "../controllers/leadController";

import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createLead);

router.get("/", authMiddleware, getLeads);

router.put("/:id", authMiddleware, updateLead);

router.delete("/:id", authMiddleware, deleteLead);

export default router;