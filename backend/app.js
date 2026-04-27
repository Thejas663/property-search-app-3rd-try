import express from "express"
import RegisterRouter from "./routes/Register.js"
import PropertyRouter from "./routes/PropertyRoute.js"
const app = express()

app.use(express.json())



app.use("/api/auth",RegisterRouter)
app.use("/api/properties",PropertyRouter)


app.get('/', (req, res) => {
  res.send('API is running')
})



export default app

