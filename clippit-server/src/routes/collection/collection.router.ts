import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { createCollection, getCollections, getCollectionById, addItemToCollection, removeItemFromCollection, deleteCollection } from "../../modules/collection/collection.controller";
import { sendInvites } from "../../modules/invites/invites.controller";

const router = Router();

router.post("/create", requireAuth, createCollection);
router.get("/", requireAuth, getCollections);
router.get("/:id", requireAuth, getCollectionById);
router.patch("/:id/add-item", requireAuth, addItemToCollection);
router.patch("/:id/remove-item", requireAuth, removeItemFromCollection);
router.delete("/:id/delete", requireAuth, deleteCollection);
router.post("/:id/send-invite", requireAuth, sendInvites);

export default router;