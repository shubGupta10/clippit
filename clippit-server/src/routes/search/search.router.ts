import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import { searchItems } from '../../modules/search/search.controller'


const router = Router();

router.post(
    "/search",
    requireAuth,
    searchItems
)

export default router