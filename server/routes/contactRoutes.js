import express from 'express'
import {
  createMessage,
  getMessages,
  getMessage,
  markAsRead,
  deleteMessage,
} from '../controllers/contactController.js'
import { protect, adminOnly, optionalAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public — submit a contact message (optionalAuth links to user if logged in)
router.post('/',          optionalAuth, createMessage)

// Admin — manage contact messages
router.get('/',            protect, adminOnly, getMessages)
router.get('/:id',         protect, adminOnly, getMessage)
router.put('/:id/read',   protect, adminOnly, markAsRead)
router.delete('/:id',     protect, adminOnly, deleteMessage)

export default router