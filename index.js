// library
const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "PSOT"]
    }
});

// middleware
app.use(cors());
const PORT = process.env.PORT || 5000;

// routes
app.get("/", (req, res) => {
    res.send(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callended");
    });

    socket.on("calluser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("calluser", { signal: signalData, from, name });
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    });
});


// server running
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});