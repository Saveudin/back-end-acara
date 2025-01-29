import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";

const app = express();
const PORT = 4000;

// middleware
app.use('/api', router);
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});