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
        const price = product.ProductSupply ?
            parseFloat(product.ProductSupply[0].SupplyDetail[0].Price[0].PriceAmount[0]) :
            null;


        return {
            title,
            authors,
            coverLink,
            price
        };
    } catch (error) {
        console.error("Błąd podczas parsowania XML:", error);
        return null;
    }
};


export async function POST(request: Request) {
    const req_data = await request.json();
    const isbn = req_data?.isbn ?? null;

    let response: {
        title: string,
        authors: string[],
        coverLink: string | null,
        pageCount: number | null,
        price: number | null,
    }

    const google_api_data = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`).then(res => res.json());

    const isEmpty = (val: any): boolean => {
        if (val === null || typeof val === "undefined") return true;
        if (typeof val === "string") return val.trim() === "";
        if (Array.isArray(val)) return val.length === 0;
        if (typeof val === "number") return !(val > 0);
        if (typeof val === "object") return Object.keys(val).length === 0;
        return false;
    };

    const gItem = google_api_data?.totalItems > 0 ? google_api_data.items[0].volumeInfo : null;
    const gTitle = gItem?.title;
    const gAuthors = gItem?.authors;
    const gPageCount = gItem?.pageCount;
    const gCover = gItem?.imageLinks?.thumbnail || gItem?.imageLinks?.smallThumbnail || null;

    let parsedOnix: any = null;
    const needOnix = isEmpty(gTitle) || isEmpty(gAuthors) || isEmpty(gCover) || isEmpty(gPageCount);
    if (needOnix) {
        try {
            const api_data = await fetch(`https://e-isbn.pl/IsbnWeb/api.xml?isbn=${isbn}`);
            parsedOnix = await parseOnixData(await api_data.text(), isbn);
        } catch (e) {
            parsedOnix = null;
        }
    }

    const hasAny = !(isEmpty(gTitle) && isEmpty(gAuthors) && isEmpty(gCover) && isEmpty(gPageCount)) || parsedOnix;
    if (!hasAny) {
        return NextResponse.json({ error: "Nie udało się znaleźć książki" }, { status: 404 });
    }

    const choose = (googleVal: any, onixVal: any, fallback: any) => {
        if (!isEmpty(googleVal)) return googleVal;
        if (!isEmpty(onixVal)) return onixVal;
        return fallback;
    };

    response = {
        title: choose(gTitle, parsedOnix?.title, ""),
        authors: choose(gAuthors, parsedOnix?.authors, []),
        coverLink: choose(gCover, parsedOnix?.coverLink, null),
        pageCount: choose(gPageCount, parsedOnix?.pageCount, null),
        price: parsedOnix?.price ?? null,
    };

    if (isEmpty(response.coverLink)) {
        try {
            const bc = await fetch(`https://bookcover.longitood.com/bookcover/${isbn}`).then(res => res.json());
            response.coverLink = bc?.url ?? null;
        } catch (e) {
            // ignore
        }
    }

    return NextResponse.json(response);
}
