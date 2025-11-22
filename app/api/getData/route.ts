import { NextResponse } from "next/server";
import { parseStringPromise } from 'xml2js';

const parseOnixData = async (xmlData: string, isbn: string) => {
    try {
        const result = await parseStringPromise(xmlData);

        if (!result.ONIXMessage || !result.ONIXMessage.Product || result.ONIXMessage.Product.length === 0) {
            console.error("No product data found in ONIX message.");
            return null;
        }
        const product = result.ONIXMessage.Product[0];
        const title = product.DescriptiveDetail[0].TitleDetail[0]?.TitleElement[0].TitleText[0] || "";
        const originalTitle = product.DescriptiveDetail[0].TitleDetail[1]?.TitleElement[0].TitleText[0] || "";
        const volumeNumber = product?.DescriptiveDetail?.[0]?.TitleDetail?.[0]?.TitleElement?.[0]?.PartNumber?.[0] ?? null;

        const coverLink = (product.CollateralDetail ?
            product.CollateralDetail[0].SupportingResource[0].ResourceVersion[0].ResourceLink[0] ||
            null
            : null) ?? (await fetch(`https://bookcover.longitood.com/bookcover/${isbn}`).then(res => res.json()))["url"];


        const authors = product.DescriptiveDetail[0].Contributor
            .filter((contrib: { ContributorRole: string[]; }) => contrib.ContributorRole[0] === 'A01')
            .map((contrib: { PersonNameInverted: any[]; }) => {
                if (contrib.PersonNameInverted[0].includes(',')) {
                    const [last, first] = contrib.PersonNameInverted[0].split(',').map((s: string) => s.trim());
                    return `${first} ${last}`;
                } else {
                    return contrib.PersonNameInverted[0];
                }
            });


        return {
            title,
            authors,
            coverLink,
            originalTitle,
            volumeNumber,
        };
    } catch (error) {
        console.error("Błąd podczas parsowania XML:", error);
        return null;
    }
};


export async function POST(request: Request) {
    const req_data = await request.json();
    const isbn = req_data?.isbn ?? null;
    console.log("\n\n\n\n\n\n\n\n\n\n");

    let response: {
        title: string,
        authors: string[],
        coverLink: string | null,
        pageCount: number | null,
        originalTitle: string | null,
        volumeNumber: number | null
    }

    const google_api_data = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`).then(res => res.json());

    if (google_api_data.totalItems > 0) {
        response = {
            title: google_api_data.items[0].volumeInfo.title || "",
            authors: google_api_data.items[0].volumeInfo.authors || [],
            coverLink: google_api_data.items[0].volumeInfo.imageLinks ? google_api_data.items[0].volumeInfo.imageLinks.thumbnail : (await fetch(`https://bookcover.longitood.com/bookcover/${isbn}`).then(res => res.json()))["url"] ?? undefined,
            pageCount: google_api_data.items[0].volumeInfo.pageCount || 0,
            originalTitle: null,
            volumeNumber: null,
        }
    } else {
        const api_data = await fetch(`https://e-isbn.pl/IsbnWeb/api.xml?isbn=${isbn}`);
        const parsedOnix = await parseOnixData(await api_data.text(), isbn);
        if (!parsedOnix) {
            return NextResponse.json({ error: "No ONIX data found for provided ISBN." }, { status: 404 });
        }
        // niby więcej info, ale wolę ilość stron niż oryginalny tytuł czy numer tomu
        response = {
            originalTitle: parsedOnix.originalTitle,
            title: parsedOnix.title,
            volumeNumber: parsedOnix.volumeNumber,
            coverLink: parsedOnix.coverLink,
            authors: parsedOnix.authors,
            pageCount: null,
        };
    }
    console.log("Final response data:", response);
    return NextResponse.json(response);
}
