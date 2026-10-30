import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  X,
  RotateCcw,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  SwitchCamera,
  Volume2
} from 'lucide-react';

export default function LiveCameraModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [loading, setLoading] = useState(true);
  const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'
  const [saving, setSaving] = useState(false);

  // Play a soft camera shutter click sound using Web Audio API
  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  };

  // Start webcam video stream
  const startCamera = async (mode = facingMode) => {
    setLoading(true);
    setCameraError('');

    // Stop existing stream if running
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 720 },
          height: { ideal: 720 },
          facingMode: mode,
        },
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('Webcam error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission denied. Please allow camera access in your browser settings to take live photo.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No webcam or camera device detected on this system.');
      } else {
        setCameraError(`Unable to start camera: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Switch camera when opened
  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startCamera(facingMode);
    } else {
      // Clean up stream on close
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  // Flip camera between front & back
  const handleToggleFacingMode = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  // Capture still photo frame from video stream
  const handleSnap = () => {
    if (!videoRef.current) return;

    playShutterSound();

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 640;

    // Make square crop for neat circular avatar profile
    const size = Math.min(width, height);
    const startX = (width - size) / 2;
    const startY = (height - size) / 2;

    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // If front camera, mirror horizontally for natural mirror feel
    if (facingMode === 'user') {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);

    // Stop live stream while viewing captured image
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Retake photo: restart camera
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  // Confirm and set captured photo as profile
  const handleConfirm = async () => {
    if (!capturedImage) return;
    setSaving(true);
    try {
      await onCapture(capturedImage);
      handleClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Clean close
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
    setCameraError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Live Camera Capture</h3>
              <p className="text-xs text-slate-400">Take a live photo for your profile</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-950/60 min-h-[340px]">
          {cameraError ? (
            <div className="max-w-sm p-4 bg-red-950/50 border border-red-800/80 rounded-2xl text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <div className="text-sm font-bold text-red-200">Camera Unavailable</div>
              <p className="text-xs text-red-300 leading-relaxed">{cameraError}</p>
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Camera</span>
              </button>
            </div>
          ) : capturedImage ? (
            /* Captured Snapshot Preview */
            <div className="flex flex-col items-center space-y-4 animate-scaleUp">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-emerald-500 shadow-2xl shadow-emerald-500/20">
                <img
                  src={capturedImage}
                  alt="Captured Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full shadow">
                  <Check className="w-4 h-4 font-black" />
                </div>
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Photo Captured! Click "Use this Photo" to save.</span>
              </div>
            </div>
          ) : (
            /* Live Webcam Stream */
            <div className="relative flex flex-col items-center justify-center">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-950/80 rounded-full">
                  <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              )}

              {/* Circular Guidelines viewfinder */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-blue-500/80 shadow-2xl bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
                />
                
                {/* Visual Viewfinder Target Crosshairs */}
                <div className="absolute inset-0 border border-white/20 rounded-full pointer-events-none"></div>
                <div className="absolute inset-4 border border-dashed border-white/30 rounded-full pointer-events-none"></div>
              </div>

              {/* Flip camera button */}
              <button
                type="button"
                onClick={handleToggleFacingMode}
                title="Switch Front/Back Camera"
                className="mt-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                <SwitchCamera className="w-3.5 h-3.5" />
                <span>Flip Camera</span>
              </button>
            </div>
          )}

          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          {!cameraError && (
            <div className="flex items-center gap-3">
              {capturedImage ? (
                <>
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 border border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Photo...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Use this Photo</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleSnap}
                  disabled={loading || !!cameraError}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Photo</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
