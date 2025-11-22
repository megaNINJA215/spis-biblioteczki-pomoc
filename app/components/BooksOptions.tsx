import { Dispatch, SetStateAction } from "react";

export default function BooksOptions(
    {
        mode,
        setMode,
        limit,
        setLimit,
        skip,
        setSkip,
        ownedCount,
        wantedCount,
    }:
        {
            mode: "owned" | "wanted",
            setMode: Dispatch<SetStateAction<"owned" | "wanted">>
            limit: number,
            setLimit: Dispatch<SetStateAction<number>>,
            skip: number,
            setSkip: Dispatch<SetStateAction<number>>,
            ownedCount: number,
            wantedCount: number,
        }) {
    const defaultSelectStyle = "p-4 mx-2 border cursor-pointer rounded-lg sm:w-36 w-22 h-auto text-center flex items-center justify-center";
    const selectedSelectStyle = "bg-blue-500 text-white " + defaultSelectStyle;

    const defaultLimitStyle = "p-4 mx-2 border cursor-pointer rounded-lg sm:w-16 w-12 h-auto text-center flex items-center justify-center";
    const selectedLimitStyle = "bg-blue-500 text-white " + defaultLimitStyle;

    const skipStyle = "p-4 mx-2 border cursor-pointer rounded-lg sm:w-26 w-16 h-auto text-center flex items-center justify-center";
    const skipValueStyle = "p-4 mx-2 border cursor-pointer rounded-lg sm:w-16 w-16 h-auto text-center flex items-center justify-center";

    return <div className="w-9/10 mx-auto">
        <div className="flex flex-row mt-4 mb-4">
            <div
                className={mode === "owned" ? selectedSelectStyle : defaultSelectStyle}
                onClick={() => setMode("owned")}>
                Posiadane
            </div>
            <div
                className={mode === "wanted" ? selectedSelectStyle : defaultSelectStyle}
                onClick={() => setMode("wanted")}>
                Do kupienia
            </div>
        </div>
        <div className="flex flex-row mt-4 mb-4">
            <div
                className={limit === 5 ? selectedLimitStyle : defaultLimitStyle}
                onClick={() => setLimit(5)}>
                {5}
            </div>
            <div
                className={limit === 10 ? selectedLimitStyle : defaultLimitStyle}
                onClick={() => setLimit(10)}>
                {10}
            </div>
            <div
                className={limit === 15 ? selectedLimitStyle : defaultLimitStyle}
                onClick={() => setLimit(15)}>
                {15}
            </div>
            <div
                className={limit === 20 ? selectedLimitStyle : defaultLimitStyle}
                onClick={() => setLimit(20)}>
                {20}
            </div>
        </div>
        <div className="flex flex-row mt-4 mb-4">
            <div
                className={skipStyle}
                onClick={() => setSkip((prev: number) => prev - limit > 0 ? prev - limit : 0)}>
                Poprzednie
            </div>
            <div
                className={skipValueStyle}>
                {skip + 1}-{skip + limit}
            </div>
            <div
                className={skipStyle}
                onClick={() => setSkip((prev: number) => prev + limit < (mode === "owned" ? ownedCount : wantedCount) ? prev + limit : prev)}>
                Następne
            </div>
        </div>
    </div>
}