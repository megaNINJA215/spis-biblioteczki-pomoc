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
    const defaultSelectStyle = "p-4 mx-2 border cursor-pointer rounded-lg w-36 h-auto text-center flex items-center justify-center";
    const selectedSelectStyle = "bg-blue-500 text-white " + defaultSelectStyle;

    const defaultLimitStyle = "p-4 mx-2 border cursor-pointer rounded-lg w-16 h-auto text-center flex items-center justify-center";
    const selectedLimitStyle = "bg-blue-500 text-white " + defaultLimitStyle;

    const skipStyle = "p-4 mx-2 border cursor-pointer rounded-lg w-26 h-auto text-center flex items-center justify-center";
    const skipValueStyle = "p-4 mx-2 cursor-pointer rounded-lg w-16 h-auto text-center flex items-center justify-center bg-blue-200 border border-blue-500";

    return <div className="w-9/10 mx-auto mb-4 flex flex-col items-center sm:block">
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
        <div className="flex flex-row sm:mt-4 mb-4">
            <div
                className={limit === 25 ? selectedLimitStyle : defaultLimitStyle}
                onClick={() => setLimit(25)}>
                {25}
            </div>
            <div
                className={limit === 50 ? selectedLimitStyle : defaultLimitStyle}
                onClick={() => setLimit(50)}>
                {50}
            </div>
            <div
                className={limit === 75 ? selectedLimitStyle : defaultLimitStyle}
                onClick={() => setLimit(75)}>
                {75}
            </div>
            <div
                className={limit === 100 ? selectedLimitStyle : defaultLimitStyle}
                onClick={() => setLimit(100)}>
                {100}
            </div>
        </div>
        <div className="flex flex-row sm:mt-4 mb-4">
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