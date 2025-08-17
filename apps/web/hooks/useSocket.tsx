// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";

// const useSocket = () => {
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   const token = Cookies.get("token");

//   useEffect(() => {
//     if (!token) {
//       return;
//     }
//     const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

//     ws.onopen = () => {
//       console.log("web socket connected");
//     };

//     ws.onerror = (err) => {
//       console.log(err);
//     };
//     setSocket(ws);
//   }, []);

//   return {
//     socket,
//   };
// };

// export default useSocket;
