import app from "./app.js"
import { mongoConnect } from "./config/dbconnect.js";
import dotenv from "dotenv"
dotenv.config()

const port = 8000

const startServer = async()=>{
    try{
        await mongoConnect();
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }catch(err){
        console.log("Server failed to start: ",err)
        process.exit(1)
    }
   
    
}

startServer();


