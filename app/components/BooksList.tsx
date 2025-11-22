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
        <div className="w-9/10 mx-auto mb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {books.map((book, index) => {
                    console.log(skip + index + 1, book.authors?.join(', '));

                    return (
                        <div key={book.ISBN} className=" border-4 border-gray-300 rounded-xl items-center relative z-0 text-wrap flex">
                            <div className="sm:h-48 sm:w-36 h-36 w-24">
                                <img
                                    src={book.cover || 'https://manmar.am/storage/products/book_not_found.jpg'} alt={`Okładka książki ${book.title}`}
                                    className="sm:h-48 sm:w-36 h-36 w-24 flex justify-center items-center object-cover rounded-l-lg"
                                />
                            </div>
                            <div className="ml-2 inline-block flex-1">
                                <div className="text-base/5 sm:text-xl/[1.375rem] font-black line-clamp-3">{skip + index + 1}. {book.title}</div>
                                <div className="text-gray-700 font-bold sm:text-base/5 text-sm/4 line-clamp-2">~ {book.authors.join(', ')}</div>
                                {!!book.page_count ?
                                    <>
                                        <p className="text-gray-700 mt-[0.25rem] text-xs sm:text-base min-h-[1rem] sm:min-h-[1.5rem]">
                                            Liczba stron: {book.page_count}
                                        </p>
                                        {!!book.price ?
                                            <p className="text-gray-700 text-xs sm:text-base min-h-[1rem] sm:min-h-[1.5rem]">
                                                Cena: {book.price.toFixed(2)}zł
                                            </p>
                                            :
                                            <p className="text-gray-700 text-xs sm:text-base min-h-[1rem] sm:min-h-[1.5rem]">
                                                {'\u00A0'}
                                            </p>
                                        }
                                    </>
                                    :
                                    !!book.price ?
                                        <>
                                            <p className="text-gray-700 mt-[0.25rem] text-xs sm:text-base min-h-[1rem] sm:min-h-[1.5rem]">
                                                Cena: {book.price.toFixed(2)}zł
                                            </p>
                                            <p className="text-gray-700 text-xs sm:text-base min-h-[1rem] sm:min-h-[1.5rem]">
                                                {'\u00A0'}
                                            </p>
                                        </>
                                        :
                                        <>
                                            <p className="text-gray-700 text-xs sm:text-base min-h-[1rem] sm:min-h-[1.5rem]">
                                                {'\u00A0'}
                                            </p>
                                            <p className="text-gray-700 text-xs sm:text-base min-h-[1rem] sm:min-h-[1.5rem]">
                                                {'\u00A0'}
                                            </p>
                                        </>
                                }
                            </div>
                            {mode === "wanted" && <div
                                className="border-2 border-green-500 text-green-700 sm:font-bold sm:text-base text-xs p-2 rounded-lg absolute sm:right-4 sm:bottom-4 right-1 bottom-1 cursor-pointer"
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
                                ZAKUPIONO
                            </div>}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}