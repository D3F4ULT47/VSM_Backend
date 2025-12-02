import mongoose from "mongoose"
import {DB_NAME} from './constants.js'
import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
  path:"./env"
})

