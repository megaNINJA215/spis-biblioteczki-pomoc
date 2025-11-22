import { Dispatch, SetStateAction } from "react";

export default function ScannerOptions({ mode, setMode }: { mode: "owned" | "wanted", setMode: Dispatch<SetStateAction<"owned" | "wanted">> }) {

    const defaultStyle = "p-4 m-2 border cursor-pointer rounded-lg sm:w-64 w-44 h-auto text-center";
    const selectedStyle = "bg-blue-500 text-white " + defaultStyle;

    return <div className="flex justify-center flex-row mt-8 mb-4">
        <div className={mode === "owned" ? selectedStyle : defaultStyle} onClick={() => setMode("owned")}>Dodaj posiadaną książkę</div>
        <div className={mode === "wanted" ? selectedStyle : defaultStyle} onClick={() => setMode("wanted")}>Dodaj książkę do kupienia</div>
    </div>
}