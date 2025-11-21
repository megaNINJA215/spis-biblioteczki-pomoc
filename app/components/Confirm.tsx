import { useEffect, useState } from "react";

export default function Confirm(
    {
        showResult,
        setShowResult,
        result,
        mode
    }: {
        showResult: boolean,
        setShowResult: (show: boolean) => void,
        result: string,
        mode: "owned" | "wanted"
    }) {
    const [data, setData] = useState<{
        originalTitle: string,
        title: string,
        volumeNumber: number,
        coverLink: string,
        authors: string[],
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/getData`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isbn: result }),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                console.log("Fetched book data:", json);
                if (!json) {
                    setData(null);
                    setError("Nie udało się znaleźć informacji o książce.");
                    return;
                }
                setData({
                    title: json.title,
                    authors: json.authors,
                    coverLink: json.coverLink,
                    originalTitle: json.originalTitle,
                    volumeNumber: json.volumeNumber,
                });
            } catch (e) {
                console.error("Send ISBN error:", e);
            }
        };

        if (showResult) {
            fetchData();
        }
    }, [showResult, result]);

    const saveBook = async (data: {
        originalTitle: string,
        title: string,
        volumeNumber: number,
        coverLink: string,
        authors: string[],
    } | null, mode: "owned" | "wanted") => {
        if (!data) return;

        await fetch('/api/saveBook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ISBN: result,
                title: data.title,
                authors: data.authors,
                coverLink: data.coverLink,
                originalTitle: data.originalTitle,
                volumeNumber: data.volumeNumber,
                mode: mode
            })
        });
    }

    return showResult && <>
        {!error ?
            <div className="absolute min-h-full min-w-full top-0 left-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            >
                <img src={data ? data?.coverLink ?? "https://www.huber-online.com/daisy_website_files/_processed_/8/0/csm_no-image_d5c4ab1322.jpg" : undefined} alt={``} className="w-80 mb-4 object-cover rounded" />
                <div className="flex flex-row items-stretch justify-center">

                    <div className="p-4 border cursor-pointer rounded-lg text-center z-10 bg-white w-64 mx-2 flex items-center justify-center">
                        <div>Tytuł: <strong>{data?.title ?? "Ładowanie..."}{" "}{data?.volumeNumber ?? ""}</strong></div>
                    </div>
                    <div className="p-4 border cursor-pointer rounded-lg text-center z-10 bg-white w-64 mx-2 flex items-center justify-center">
                        <div>{data?.authors.length == 1 ? "Autor" : "Autorzy"}: <strong>{(data?.authors?.join(", ") ?? "Ładowanie...")}</strong></div>
                    </div>
                </div>
                <div className="flex flex-row items-center justify-center mt-4">
                    <div className="p-4 border cursor-pointer rounded-lg text-center z-10 bg-red-100 border-red-600 border-3 w-64 mx-2"
                        onClick={() => {
                            setData(null);
                            setShowResult(false)
                        }}>
                        ANULUJ
                    </div>
                    <div className="p-4 border cursor-pointer rounded-lg text-center z-10 bg-lime-100 border-lime-600 border-3 w-64 mx-2"
                        onClick={async () => {
                            await saveBook(data, mode);
                            setData(null);
                            setShowResult(false)
                        }}>
                        Potwierdź
                    </div>
                </div>
            </div> : <div className="absolute min-h-full min-w-full top-0 left-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white text-2xl">

                <div className="p-4 border cursor-pointer rounded-lg text-center text-black z-10 bg-red-100 border-red-600 border-3 w-128 mx-2">
                    {error}
                </div>
                <div className="p-4 border cursor-pointer rounded-lg text-center z-10 border-3 w-64 mt-4"
                    onClick={async () => {
                        setError(null);
                        setShowResult(false)
                    }}>
                    Wyjdź
                </div>
            </div>}
    </>

}
