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
        title: string,
        authors: string[],
        coverLink: string | null,
        pageCount: number | null,
        price: number | null,
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
                const json: {
                    title: string,
                    authors: string[],
                    coverLink: string | null,
                    pageCount: number | null,
                    price: number | null,
                } | null = await res.json();
                if (!json) {
                    setError("Nie udało się znaleźć informacji o książce.");
                    return;
                }
                setData(json);
            } catch (e) {
                console.error("Send ISBN error:", e);
            }
        };

        if (showResult) {
            fetchData();
        }
    }, [showResult, result]);

    const saveBook = async (data: {
        title: string,
        authors: string[],
        coverLink: string | null,
        pageCount: number | null,
        price: number | null,
    } | null, mode: "owned" | "wanted") => {
        if (!data) return;

        const response = await fetch('/api/saveBook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ISBN: result, ...data, mode })
        }).then((res) => res.json());

        if (!response.ok) {
            setShowResult(true)
            setError(response.message || "Wystąpił nieznany błąd podczas zapisywania książki.");
            return;
        }
        setShowResult(false)
    }

    return showResult && <>
        {!error ?
            <div className="absolute min-h-full min-w-full top-0 left-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-5"
            >
                <img src={data ? data?.coverLink ?? "https://manmar.am/storage/products/book_not_found.jpg" : undefined} alt={``} className="w-80 mb-4 object-cover rounded" />
                <div className="flex flex-row items-stretch justify-center">

                    <div className="p-4 border cursor-pointer rounded-lg text-center z-10 bg-white w-64 mx-2 flex items-center justify-center">
                        <div>Tytuł: <strong>{data?.title ?? "Ładowanie..."}</strong></div>
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
                        }}>
                        Potwierdź
                    </div>
                </div>
            </div> : <div className="absolute min-h-full min-w-full top-0 left-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white text-2xl  z-5">

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
