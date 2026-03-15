import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { createItem, fetchUserItem, getItemById, deleteItem, editItem } from "../../modules/item/item.controller";

const router = Router();

router.post(
    "/create-item",
    requireAuth,
    createItem
)

router.get(
    "/get-user-items",
    requireAuth,
    fetchUserItem
)

router.get(
    "/:id",
    requireAuth,
    getItemById
)

router.patch(
    "/:id",
    requireAuth,
    editItem
)

router.delete(
    "/:id",
    requireAuth,
    deleteItem
)

export default router;