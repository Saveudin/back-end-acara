import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./utils/database";

const app = express();
const PORT = 4000;

// connect to database
async function init (){
    try {
        const result = await db();
        console.log("Database status: ",result);
    
        // middleware
        app.use(bodyParser.json());
        app.use('/api', router);
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
    
        });
    } catch (error) {
        console.log(error)
    }
}


init()