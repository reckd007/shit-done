import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Camera, RefreshCw, Check, Upload, AlertCircle } from 'lucide-react';
import { captureVideoFrame, compressImageFile } from '../utils/image';
import { sound } from '../utils/audio';
import { AppLanguage } from '../types/medicine';
import { getTranslation } from '../utils/translations';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  language?: AppLanguage;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  language = 'en',
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const t = getTranslation(language);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop video tracks
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Start camera
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    setError(null);
    setLoading(true);

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Failed to access camera:', err);
      setError('Unable to access camera directly. You can still choose or snap a photo using the file picker below.');
    } finally {
      setLoading(false);
    }
  }, [stream]);

  // Handle open / close
  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setError(null);
      startCamera(facingMode);
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen]);

  // Switch between front & back camera
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Snap photo from video stream
  const handleSnap = () => {
    if (!videoRef.current) return;
    sound.playTap();
    const dataUrl = captureVideoFrame(videoRef.current);
    if (dataUrl) {
      setCapturedImage(dataUrl);
      stopStream();
    }
  };

  // Handle file input upload / device camera
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      sound.playTap();
      setLoading(true);
      const compressed = await compressImageFile(file);
      setCapturedImage(compressed);
      stopStream();
    } catch {
      setError('Could not process selected image. Please try another.');
    } finally {
      setLoading(false);
    }
  };

  // Confirm photo
  const handleConfirm = () => {
    if (capturedImage) {
      sound.playDoseTakenSound();
      onCapture(capturedImage);
      onClose();
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t.captureMedicinePhoto}</h3>
              <p className="text-[11px] text-slate-400">{t.positionPillPrompt}</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative aspect-4/3 sm:aspect-square bg-black overflow-hidden flex items-center justify-center">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured medicine"
              className="w-full h-full object-cover"
            />
          ) : stream ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Pill Guide Reticle */}
              <div className="absolute inset-8 border-2 border-dashed border-sky-400/60 rounded-3xl pointer-events-none flex flex-col items-center justify-center">
                <span className="text-[11px] font-semibold text-white/80 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {t.centerPillGuide}
                </span>
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              {loading ? (
                <div className="space-y-2">
                  <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">{t.testing}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Camera className="w-10 h-10 text-slate-600 mx-auto" />
                  {error && (
                    <div className="text-xs text-amber-400 bg-amber-950/60 border border-amber-900/60 p-2.5 rounded-xl flex items-center gap-2 text-left">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{t.uploadPhoto}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hidden file input supporting Android camera capture */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition active:scale-95"
              >
                {t.retakePhoto}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{t.useThisPhoto}</span>
              </button>
            </>
          ) : stream ? (
            <>
              <button
                type="button"
                onClick={handleToggleFacingMode}
                title="Switch Camera"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleSnap}
                className="w-16 h-16 rounded-full bg-white text-slate-900 border-4 border-sky-500 shadow-xl flex items-center justify-center active:scale-95 transition-transform"
                title={t.takePhoto}
              >
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title={t.uploadPhoto}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <Upload className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  stopStream();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
              >
                <Upload className="w-4 h-4" />
                <span>{t.uploadPhoto}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
