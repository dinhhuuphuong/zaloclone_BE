import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware.js'
import { friendController } from '~/controllers/friendController.js'

const Router = express.Router()

Router.route('/').get(authMiddleware.isAuthorized, friendController.getFriends)
Router.route('/:receiverID').post(
  authMiddleware.isAuthorized,
  friendController.friendRequest
)
export const friendRoutes = Router
