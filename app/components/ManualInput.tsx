
import { Dispatch, SetStateAction, useState } from 'react';

export default function ManualInput({ setResult }: {
    setResult: Dispatch<SetStateAction<{
        show: boolean;
        result: string;
    }>>
}) {
    const [data, setData] = useState<string>("");

    const inputValidation = (isbn: string): boolean | string => {
        if (!isbn) {
            return false
        }
        isbn = isbn.replaceAll('-', '');
        console.log(isbn);

        switch (isbn.length) {
            case 10: {
                if (!/^\d*X?$/.test(isbn)) {
                    return "ISBN musi składać się tylko z cyfr (lub \"X\" na końcu jako numer kontrolny)";
                }
                let sum = 0;
                for (let i = 0; i < 9; i++) {
                    sum += (i + 1) * parseInt(isbn[i]);
                }
                let controlNumber: number | 'X' = sum % 11;
                if (controlNumber == 10) {
                    controlNumber = 'X'
                }
                if (controlNumber.toString() !== isbn[9]) {
                    return "Nieprawidłowy numer kontrolny dla ISBN-10";
                }
                return true;
            }
            case 13: {
                if (!/^\d*$/.test(isbn)) {
                    return "ISBN musi składać się tylko z cyfr";
                }
                let controlSum = 0;
                for (let i = 0; i < 12; i++) {
                    controlSum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
                }
                let controlNumber = (10 - (controlSum % 10)) % 10;
                if (controlNumber.toString() !== isbn[12]) {
                    return "Nieprawidłowy numer kontrolny dla ISBN-13";
                }
                return true;
            }
            default:
                return "ISBN musi mieć 10 lub 13 cyfr";
        }
    }

    return <div className="flex justify-center flex-row mt-4 mb-4">
        <input className="p-4 m-2 border cursor-pointer rounded-lg sm:w-96 w-66 h-auto" placeholder="Dodaj posiadaną książkę" onChange={(e) => {
            setData(e.currentTarget.value);
        }} />
        <div className="p-4 m-2 border cursor-pointer rounded-lg sm:w-32 w-22 h-auto text-center" onClick={() => {
            const error = inputValidation(data);
            if (error === false) { }
            else if (error === true) {
                setResult({ result: data, show: true });
            } else {
                alert("Nieprawidłowy ISBN: " + error);
            }
        }}>Dodaj</div>
    </div>
}