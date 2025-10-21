// const app = require("./app");

// if (process.env.VERCEL !== "1" && require.main === module) {
//     const env = require("./config/env");
//     const PORT = process.env.PORT || env.VITE_FRONTEND_PORT;

//     app.listen(PORT, () => {
//         console.log(`HRIS Employee Management running on port: ${PORT}`);
//     });
// }

// module.exports = app;

const app = require("./app");


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
