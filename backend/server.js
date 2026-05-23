import { server } from "./src/app.js";
import connectDB from "./src/config/db.js";

const startServer = async () => {
    try{
        await connectDB();
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    }
    catch(error){
        console.error("Server connection error:", error);
        process.exit(1);
    }
}

startServer();