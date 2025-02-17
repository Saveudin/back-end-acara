import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./utils/database";
import docs from "./docs/route";
import cors from "cors";

const app = express();
const PORT = 4000;

// connect to database
async function init (){
    try {
        const result = await db();
        console.log("Database status: ",result);

        
    
        // middleware
        app.use(cors());
        app.use(bodyParser.json());
        app.use('/api', router);
        docs(app);
        app.get('/', (req, res) => {
            res.status(200).json({
                message: "Server is running",
                data: null
            })
        })
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
    
        });
    } catch (error) {
        console.log(error)
    }
}


init()