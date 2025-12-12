import {Router} from "express"
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  logInUser,
  logOutUser,
  refreshAccessToken,
  registerUser, 
  updateAccountDetail, 
  updateAvatar, 
  updateCoverImage} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()
router.route("/register").post(upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 }
]),registerUser)
router.route("/login").post(logInUser)
//secured routes
router.route("/logout").post(verifyJWT,logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").post(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetail)
router.route("/avatar").patch(verifyJWT,upload.single('avatar'),updateAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single('coverImage'),updateCoverImage)
router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)
    

export default router