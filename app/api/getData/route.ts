import { NextResponse } from "next/server";
import { parseStringPromise } from 'xml2js';

const parseOnixData = async (xmlData: string) => {
    try {
        const result = await parseStringPromise(xmlData);

        if (!result.ONIXMessage || !result.ONIXMessage.Product || result.ONIXMessage.Product.length === 0) {
            console.error("No product data found in ONIX message.");
            return null;
        }
        const product = result.ONIXMessage.Product[0];
        const title = product.DescriptiveDetail[0].TitleDetail[0]?.TitleElement[0].TitleText[0] || "";
        const originalTitle = product.DescriptiveDetail[0].TitleDetail[1]?.TitleElement[0].TitleText[0] || "";
        const volumeNumber = product?.DescriptiveDetail?.[0]?.TitleDetail?.[0]?.TitleElement?.[0]?.PartNumber?.[0] ?? undefined;
        const coverLink = product.CollateralDetail ? product.CollateralDetail[0].SupportingResource[0].ResourceVersion[0].ResourceLink[0] || undefined : undefined;
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
            originalTitle,
            title,
            volumeNumber,
            coverLink,
            authors,
        };
    } catch (error) {
        console.error("Błąd podczas parsowania XML:", error);
        return null;
    }
};


export async function POST(request: Request) {
    const data = await request.json();
    const isbn = data?.isbn ?? null;

    const api_data = await fetch(`https://e-isbn.pl/IsbnWeb/api.xml?isbn=${isbn}`);
    const parsedData = await parseOnixData(await api_data.text());

    return NextResponse.json(parsedData);
}
