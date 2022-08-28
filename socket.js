const connection = require("./database/database");
const { v4: uuidv4 } = require('uuid');

const server = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: '*'
    }
  });

  io.on("connection", (socket) => {
    socket.on("userConnection", (id) => {
      const roomId = uuidv4();
      const findRoom = `SELECT * FROM rooms WHERE user_count = 1`;
      connection.query(findRoom, (error,room) => {
        if(error) {
          console.log(error);
        }else if(room.length > 0){
          const updateCount = `UPDATE rooms SET user_count = 2 WHERE room_id = "${room[0].room_id}"`
          connection.query(updateCount, (error) => {
            if(error){
              console.log(error);
            }else{
              socket.join(room[0].room_id);
              socket.broadcast.emit("userConnected" , id);
            }
          });
        }else{
          const createRoom = `INSERT INTO rooms (room_id, user_count) VALUES ("${roomId}",1)`
          connection.query(createRoom, (error) => {
            if(error){
              console.log(error);
            }else{
              socket.join(roomId);
              socket.broadcast.emit("userConnected" , id);
            }
          });
        }
      });
    });
  });
};

module.exports = server;