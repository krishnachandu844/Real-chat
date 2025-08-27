"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useSocket from "@/hooks/useSocket";
import { useAuthStore } from "@/store/user";
import { useSocketStore } from "@/store/useSocketStore";
import {
  Loader,
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  Users,
  VideoOff,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Video() {
  const { videoId } = useParams() as { videoId: string };
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const { socket } = useSocket();

  //Creating offer
  const createOffer = async () => {
    if (!socket) return;
    //connection
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    //Remote video stream
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = new MediaStream();
    }

    //Add Local Stream
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // Adding local video tracks
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      } catch (error) {
        console.log(error);
      }
    };
    getUserMedia();

    //remote Tracks
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    //sending icecanditates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            type: "ice-candidate",
            receiverId: videoId,
            candidate: event.candidate,
          })
        );
      }
    };

    peerConnection.current = pc;

    //create offer
    let offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.send(
      JSON.stringify({
        type: "offer",
        receiverId: videoId,
        offer,
      })
    );
    console.log("offer sent");
  };

  // useEffect(() => {
  //   createOffer();
  // }, []);

  //socket listening to message events
  // useEffect(() => {
  //   if (!socket) return;
  //   if (socket && socket.readyState == WebSocket.OPEN) {
  //     socket.onmessage = (e) => {
  //       const msg = JSON.parse(e.data);
  //       if (msg.type == "offer") {
  //         console.log("Reached offer from another user");
  //         console.log(msg.offer);
  //       }
  //     };
  //   }
  // }, []);

  if (!socket) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className=" min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border text-white">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Call Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white">2 participants</span>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      {/* video-grid */}
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[500px]">
            {/* Local Video */}
            <Card className="relative overflow-hidden bg-card">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className=""
                style={{ transform: "scaleX(-1)" }}
              />
              {/* {!isVideoOn && (
                <div className='absolute inset-0 bg-muted flex items-center justify-center'>
                  <div className='text-center'>
                    <VideoOff className='w-12 h-12 text-muted-foreground mx-auto mb-2' />
                    <p className='text-sm text-muted-foreground'>
                      Camera is off
                    </p>
                  </div>
                </div>
              )} */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-white text-sm font-medium">You</span>
              </div>
              {isMuted && (
                <div className="absolute top-4 right-4 bg-destructive rounded-full p-2">
                  <MicOff className="w-4 h-4 text-destructive-foreground" />
                </div>
              )}
            </Card>

            {/* Remote Video */}
            <Card className="relative overflow-hidden bg-card">
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-lg font-medium mb-1">
                    Waiting for participant
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Share the call link to invite someone
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-white text-sm font-medium">
                  Participant
                </span>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
