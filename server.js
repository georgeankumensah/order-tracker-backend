require("dotenv").config();
const http = require("http");

const app = require("./app");
const { connectDB } = require("./libs/mongoose");
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

(async function () {
	await connectDB();

	server.listen(PORT, () => {
		console.log(`Listening on PORT ${PORT}...`);
	});
})();
