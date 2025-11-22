import { useEffect, useState } from "react"



export default function BooksList({ mode, limit, skip }: { mode: "owned" | "wanted", limit: number, skip: number }) {
    const [books, setBooks] = useState<Array<{
        ISBN: string,
        title: string,
        authors: string[],
        cover: string | null,
        page_count: number | null,
        price: number | null,
    }>>([]);

    const fetchBooks = async () => {
        setBooks([]);
        const response = await fetch(`/api/getBooks?mode=${mode}&limit=${limit}&skip=${skip}`);
        const data = await response.json();
        if (data.ok) {
            setBooks(data.books);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [mode, limit, skip]);



    return (
        <div className="w-9/10 mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 -z-5">
                {books.map((book, index) => {
                    console.log(skip + index + 1, book.authors?.join(', '));

                    return (
                        <div key={book.ISBN} className=" border-4 border-gray-300 rounded-lg mb-4 flex flex-row items-center relative z-0">
                            <div className="h-48 w-36">
                                <img
                                    src={book.cover || 'https://manmar.am/storage/products/book_not_found.jpg'} alt={`Okładka książki ${book.title}`}
                                    className="h-48 w-32 flex justify-center items-center object-cover rounded-l-md"
                                />
                            </div>
                            <div className="flex flex-col ml-2">
                                <div className="text-xl font-black">{skip + index + 1}. {book.title}</div>
                                <div className="text-gray-700 font-bold">~ {book.authors.join(', ')}</div>
                                {!!book.page_count && <p className="text-gray-700">Liczba stron: {book.page_count}</p>}
                                {!!book.price && <p className="text-gray-700">Cena: {book.price}zł</p>}
                            </div>
                            {mode === "wanted" && <div
                                className="border-2 border-green-500 text-green-700 font-bold p-2 m-2 rounded-lg absolute right-4 top-4 cursor-pointer"
                                onClick={async () => {
                                    await fetch(`/api/boughtBook`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ ISBN: book.ISBN })
                                    });
                                    await fetchBooks();
                                }}>
                                ZAKUPIONA
                            </div>}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}