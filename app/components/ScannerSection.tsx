"use client"

import ScannerOptions from "./ScanerOptions";
import Scanner from "./Scanner";
import { useState } from "react";

export default function ScannerSection() {
    const [mode, setMode] = useState<"owned" | "wanted">("owned")
    return <>
        <ScannerOptions mode={mode} setMode={setMode} />
        <Scanner mode={mode} />
    </>
}