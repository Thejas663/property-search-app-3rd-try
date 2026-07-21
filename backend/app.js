import express from "express"
import cors from "cors"
import RegisterRouter from "./routes/Register.js"
import PropertyRouter from "./routes/PropertyRoute.js"
import ContactRouter from "./routes/ContactRoute.js"
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", RegisterRouter)
app.use("/api/properties", PropertyRouter)
app.use("/api/contact", ContactRouter)


app.get('/', (req, res) => {
  res.send('API is running')
})



export default app

