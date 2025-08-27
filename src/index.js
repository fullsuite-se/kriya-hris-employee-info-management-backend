const app = require("./app");
require("dotenv").config(); 

app.listen(process.env.VITE_FRONTEND_PORT, () => {
    console.log(`HRIS Employee Management runing on port: ${process.env.VITE_FRONTEND_PORT}: access on localhost:${process.env.VITE_FRONTEND_PORT}`)
});