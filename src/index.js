// const app = require("./app");
// const env = require("./config/env");

// app.listen(env.VITE_FRONTEND_PORT, () => {
//     console.log(`HRIS Employee Management runing on port: ${env.VITE_FRONTEND_PORT}: access on localhost:${env.VITE_FRONTEND_PORT}`)
// });

const app = require("./app");

if (require.main === module) {
    const env = require("./config/env");
    app.listen(env.VITE_FRONTEND_PORT, () => {
        console.log(
            `HRIS Employee Management running on port: ${env.VITE_FRONTEND_PORT}`
        );
    });
}

module.exports = app;
