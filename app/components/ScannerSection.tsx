"use client"

import Confirm from "./Confirm";
import ManualInput from "./ManualInput";
import ScannerOptions from "./ScanerOptions";
import Scanner from "./Scanner";
import { useState } from "react";

export default function ScannerSection() {
    const [mode, setMode] = useState<"owned" | "wanted">("owned")
    const [result, setResult] = useState<{ show: boolean, result: string }>({ show: false, result: "" });
    return <>
        <ScannerOptions mode={mode} setMode={setMode} />
        <Scanner setResult={setResult} />
        <ManualInput setResult={setResult} />
        <Confirm mode={mode} showResult={result.show} setShowResult={(show) => setResult(prev => ({ ...prev, show }))} result={result.result} />
    </>
}