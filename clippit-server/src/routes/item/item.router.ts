import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { createItem, fetchUserItem, getItemById, deleteItem, editItem, clearAllItems, deleteAccount, exportItems } from "../../modules/item/item.controller";

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

router.delete(
    "/clear-all-items",
    requireAuth,
    clearAllItems
)

router.delete(
    "/delete-account",
    requireAuth,
    deleteAccount
)

router.get(
    "/export",
    requireAuth,
    exportItems
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