
import * as Openiban from "openiban";
import { ValidationResult } from "openiban/dist/types/types";
 

export interface IbanInfo {
    iban: string
    bic: string
    bankName: string
}

export async function getIbanInfo(iban: string): Promise<IbanInfo | undefined> {
    const sanitizedIban = makeSanitizedIban(iban);
    console.log(sanitizedIban);

    try {
        const res: ValidationResult = await Openiban.validate(sanitizedIban);

        if(!res.valid) return;
    
        const result: IbanInfo = {
            iban: sanitizedIban,
            bic: res.bankData?.bic || "",
            bankName: res.bankData?.name || ""
        };
        return result;
    } catch(e) {
        console.error({ e });
        return;
    }
}

// Can currently be replaced by using openiban lib
// should probably be replaced by own implementation based on it by 
// interface IbanSections {
//     countryCode: string
//     checksum: string
//     rest: string
// }

// export function validateIban(iban: string): boolean {

//     const ibanSections = breakIbanIntoSections(iban);
//     if(!ibanSections) return false;

//     const hasValidChecksum = validateChecksum(ibanSections);

//     return hasValidChecksum;
// }

// function breakIbanIntoSections(iban: string): IbanSections | undefined {
    
//     const sanitizedIban = makeSanitizedIban(iban);
    
//     const sectionedIban = sanitizedIban.match(/^([A-Z]{2})([0-9]{2})([A-Z0-9]{9,30})$/);
//     if(!sectionedIban) return;

//     return {
//         countryCode: sectionedIban[1],
//         checksum: sectionedIban[2],
//         rest: sectionedIban[3]
//     };

// }

export function makeSanitizedIban(iban: string): string {
    //keep numbers and letters only
    return iban.replace(/[^A-Z0-9]+/gi,"") 
        .toUpperCase();
}

// function validateChecksum(ibanSections: IbanSections): boolean {
//     const rearrangedIbanString = ibanSections.rest + ibanSections.countryCode + ibanSections.checksum;

//     const replaceCharacterWithNumber = (character: string): string => `${character.charCodeAt(0)-55}`;
//     const numberized = rearrangedIbanString.replace(/[A-Z]/g, replaceCharacterWithNumber);

//     if(!numberized|| numberized.length === 0) return false;

//     const sections =  numberized.match(/\d{1,7}/g);

//     if(!sections) return false;

//     const mod97: number = sections
//         .reduce(function(total, curr){ return Number(total + curr)%97;},0);

//     return mod97 === 1;
// }