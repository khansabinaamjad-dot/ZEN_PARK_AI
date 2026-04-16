import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import AlertBox from "./AlertBox";

const API = "http://localhost:5001/api/parking";

function CameraFeed({ onDetectionComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [preview, setPreview] = useState("");
  const [plate, setPlate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("NORMAL");
  const [loading, setLoading] = useState(false);
  const [autoDetect, setAutoDetect] = useState(true);
  const [lastRead, setLastRead] = useState("");

  const playBeep = () => {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (error) {
      console.log("Beep error:", error);
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
      setMessage("Camera access denied or not available");
      setStatus("ENTRY_DENIED");
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const detectPlate = async () => {
    if (!videoRef.current || !canvasRef.current || loading) return;

    const video = videoRef.current;
    if (!video.videoWidth || !video.videoHeight) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/jpeg", 0.9);
    setPreview(image);
    setLoading(true);

    try {
      const res = await axios.post(`${API}/detect`, { image });
console.log("CHECK:", res.data);
      const data = res.data;
      setPlate(data.plateNumber || "");
      setMessage(data.message || "");
      setStatus(data.status || "NORMAL");

      if (data.plateNumber && data.plateNumber !== lastRead) {
        setLastRead(data.plateNumber);
        playBeep();

        if (data.status === "BLACKLISTED" || data.status === "ENTRY_DENIED") {
          speakText(`Alert. Blacklisted vehicle ${data.plateNumber}`);
        } else if (data.status === "SUSPICIOUS") {
          speakText(`Warning. Suspicious vehicle ${data.plateNumber}`);
        } else {
          speakText(`Vehicle ${data.plateNumber} detected successfully`);
        }
      }

      if (onDetectionComplete) {
        onDetectionComplete(data);
      }
    } catch (error) {
      console.log("Detection failed");
      setMessage(
        error?.response?.data?.message || "Detection failed. Try again."
      );
      setStatus("SUSPICIOUS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!autoDetect) return;

    const interval = setInterval(() => {
      detectPlate();
    }, 4000);

    return () => clearInterval(interval);
  }, [autoDetect, loading, lastRead]);

  return (
    <div className="card">
      <h3>Live ANPR Camera</h3>

      <video ref={videoRef} autoPlay playsInline muted className="video" />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="flex mt-16">
        <button className="btn" onClick={detectPlate}>
          Detect Now
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setAutoDetect((prev) => !prev)}
        >
          {autoDetect ? "Stop Auto Detect" : "Start Auto Detect"}
        </button>
      </div>

      <div className="mt-16">
        <p>
          <strong>Detected Plate:</strong> {plate || "--"}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
        {loading && <p className="small">Processing image...</p>}
      </div>

      <AlertBox status={status} message={message} />

      {preview && (
        <div className="mt-16">
          <h3>Captured Frame</h3>
          <img src={preview} alt="Captured Preview" className="preview-img" />
        </div>
      )}
    </div>
  );
}

export default CameraFeed;