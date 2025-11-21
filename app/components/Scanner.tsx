"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export default function Scanner({ setResult }: {
    setResult: Dispatch<SetStateAction<{
        show: boolean;
        result: string;
    }>>
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [scanning, setScanning] = useState(false);
    const detectorRef = useRef<any | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, []);

    const startScanner = async () => {
        if (scanning) return;
        if (typeof (window as any).BarcodeDetector === "undefined") {
            alert("Twoja przeglądarka nie obsługuje BarcodeDetector. Użyj Chrome/Edge lub dodaj polyfill.");
            return;
        }

        try {
            const formats = ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"];
            detectorRef.current = new (window as any).BarcodeDetector({ formats });

            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            streamRef.current = stream;

            setScanning(true);
        } catch (e) {
            console.error("startScanner error:", e);
            setScanning(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        const attachAndStart = async () => {
            if (!scanning) return;
            if (!videoRef.current || !streamRef.current) return;

            try {
                videoRef.current.srcObject = streamRef.current;
                await videoRef.current.play();
                scanLoop();
            } catch (e) {
                if (mounted) console.error("attachAndStart error:", e);
            }
        };

        attachAndStart();

        return () => {
            mounted = false;
        };
    }, [scanning]);

    const scanLoop = async () => {
        if (!videoRef.current || !detectorRef.current) return;
        try {
            const detections = await detectorRef.current.detect(videoRef.current as HTMLVideoElement);
            if (detections && detections.length > 0) {
                const value = detections[0].rawValue;
                stopScanner();
                setResult({ show: true, result: value });
                return;
            }
        } catch (e) {
        }

        rafRef.current = requestAnimationFrame(scanLoop);
    };

    const stopScanner = () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        if (streamRef.current) {
            const tracks = streamRef.current.getTracks();
            tracks.forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current && videoRef.current.srcObject) {
            try {
                videoRef.current.srcObject = null;
            } catch (e) {
            }
        }
        detectorRef.current = null;
        setScanning(false);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {scanning ? <>
                <div className=" h-14">
                </div>
                <div className="absolute min-h-full min-w-full top-0 left-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                    <>
                        <video ref={videoRef}
                            className="rounded-md shadow-lg z-10"
                            style={{ width: 'min(90vw, 800px)', aspectRatio: '16/9', objectFit: 'cover' }}
                            playsInline
                            muted
                        />
                        <div className="p-4 border cursor-pointer rounded-lg w-36 text-center h-14 mt-10 z-10 bg-white"
                            onClick={() => {
                                if (scanning) stopScanner();
                            }}
                        >
                            Stop
                        </div>
                    </>
                </div>
            </> : <>
                <div className="flex">
                    <div className="flex p-4 border cursor-pointer rounded-lg flex items-center justify-center text-center sm:w-132  h-14 mx-2 sm:mx-0 w-92"
                        onClick={() => {
                            if (!scanning) startScanner();
                        }}
                    >
                        Uruchom skaner
                    </div>
                </div>
            </>
            }
        </div >
    );
}
