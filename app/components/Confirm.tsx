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
    const [data, setData] = useState<{ title: string; author: string; coverUrl: string } | null>(null);

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
                setData({
                    title: json.title ?? "",
                    author: json.author ?? "",
                    coverUrl: json.coverUrl ?? ""
                });
            } catch (e) {
                console.error("Send ISBN error:", e);
            }
        };

        if (showResult) {
            fetchData();
        }
    }, [showResult, result]);

    const saveBook = async (data: { title: string; author: string; coverUrl: string } | null, mode: "owned" | "wanted") => {
        if (!data) return;

        await fetch('/api/saveBook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ISBN: result,
                title: data.title,
                author: data.author,
                coverUrl: data.coverUrl,
                mode: mode
            })
        });
    }

    return showResult &&
        <div className="absolute min-h-full min-w-full top-0 left-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
        >

            <img src={data?.coverUrl ?? ''} alt={`Okładka książki ${data?.title}`} className="w-96 mb-4 object-cover rounded" />
            <div className="flex flex-row items-center justify-center">

                <div className="p-4 border cursor-pointer rounded-lg text-center z-10 bg-white w-64 mx-2">
                    Tytuł: <strong>{data?.title}</strong>
                </div>
                <div className="p-4 border cursor-pointer rounded-lg text-center z-10 bg-white w-64 mx-2">
                    Autor: <strong>{data?.author}</strong>
                </div>
            </div>
            <div className="flex flex-row items-center justify-center mt-4">
                <div className="p-4 border cursor-pointer rounded-lg text-center  z-10 bg-red-100 border-red-600 border-3 w-64 mx-2"
                    onClick={() => {
                        setShowResult(false)
                    }}>
                    ANULUJ
                </div>
                <div className="p-4 border cursor-pointer rounded-lg text-center z-10  bg-lime-100 border-lime-600 border-3 w-64 mx-2"
                    onClick={async () => {
                        await saveBook(data, mode);
                        setShowResult(false)
                    }}>
                    Potwierdź
                </div>
            </div>
        </div>
}
