var Dog = require("./server");
HOST = process.env.PRIVATE_IP || "127.0.0.1";

Dog(10105, HOST, 10000);
