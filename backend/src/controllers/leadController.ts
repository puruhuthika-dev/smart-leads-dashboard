// backend/controllers/leadController.ts

import { Request, Response } from "express";

import Lead from "../models/Lead";

// CREATE LEAD

export const createLead =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        name,
        email,
        company,
        status,
        source,
      } = req.body;

      const lead =
        await Lead.create({
          name,
          email,
          company,
          status,
          source,
        });

      res.status(201).json(
        lead
      );
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to create lead",
      });
    }
  };

// GET LEADS WITH PAGINATION

export const getLeads =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const page =
        Number(
          req.query.page
        ) || 1;

      const limit = 10;

      const skip =
        (page - 1) *
        limit;

      const total =
        await Lead.countDocuments();

      const leads =
        await Lead.find()
          .skip(skip)
          .limit(limit)
          .sort({
            createdAt:
              -1,
          });

      res.json({
        leads,
        currentPage:
          page,
        totalPages:
          Math.ceil(
            total /
              limit
          ),
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch leads",
      });
    }
  };

// GET SINGLE LEAD

export const getLeadById =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const lead =
        await Lead.findById(
          req.params.id
        );

      if (!lead) {
        return res
          .status(404)
          .json({
            message:
              "Lead not found",
          });
      }

      res.json(lead);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch lead",
      });
    }
  };

// UPDATE LEAD

export const updateLead =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const updatedLead =
        await Lead.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      if (!updatedLead) {
        return res
          .status(404)
          .json({
            message:
              "Lead not found",
          });
      }

      res.json(
        updatedLead
      );
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to update lead",
      });
    }
  };

// DELETE LEAD

export const deleteLead =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const deletedLead =
        await Lead.findByIdAndDelete(
          req.params.id
        );

      if (!deletedLead) {
        return res
          .status(404)
          .json({
            message:
              "Lead not found",
          });
      }

      res.json({
        message:
          "Lead deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to delete lead",
      });
    }
  };