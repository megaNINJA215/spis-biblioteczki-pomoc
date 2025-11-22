"use client";
import BooksOptions from './BooksOptions';
import BooksList from './BooksList';
import { useEffect, useState } from 'react';

export default function BooksSection() {
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(5);
    const [mode, setMode] = useState<"owned" | "wanted">("owned");
    const [ownedCount, setOwnedCount] = useState(0);
    const [wantedCount, setWantedCount] = useState(0);


    useEffect(() => {
        const fetchCounts = async () => {
            const response = await fetch('/api/bookCount');
            const data = await response.json();
            if (data.ok) {
                setOwnedCount(data.owned_books);
                setWantedCount(data.wanted_books);
            }
        };
        fetchCounts();
    }, []);

    return <>
        <BooksOptions mode={mode} setMode={setMode} limit={limit} setLimit={setLimit} skip={skip} setSkip={setSkip} ownedCount={ownedCount} wantedCount={wantedCount} />
        <BooksList mode={mode} limit={limit} skip={skip} />
    </>
}