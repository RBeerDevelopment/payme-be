interface IbanSections {
    countryCode: string
    checksum: string
    rest: string
}

export function validateIban(iban: string): boolean {

    const ibanSections = breakIbanIntoSections(iban);
    if(!ibanSections) return false;

    const hasValidChecksum = validateChecksum(ibanSections);

    return hasValidChecksum;
}

function breakIbanIntoSections(iban: string): IbanSections | undefined {
    
    const sanitizedIban = makeSanitizedIban(iban);
    
    const sectionedIban = sanitizedIban.match(/^([A-Z]{2})([0-9]{2})([A-Z0-9]{9,30})$/);
    if(!sectionedIban) return;

    return {
        countryCode: sectionedIban[1],
        checksum: sectionedIban[2],
        rest: sectionedIban[3]
    };

}

export function makeSanitizedIban(iban: string): string {
    //keep numbers and letters only
    return iban.replace(/[^A-Z0-9]+/gi,"") 
        .toUpperCase();
}

function validateChecksum(ibanSections: IbanSections): boolean {
    const rearrangedIbanString = ibanSections.rest + ibanSections.countryCode + ibanSections.checksum;

    const replaceCharacterWithNumber = (character: string): string => `${character.charCodeAt(0)-55}`;
    const numberized = rearrangedIbanString.replace(/[A-Z]/g, replaceCharacterWithNumber);

    if(!numberized|| numberized.length === 0) return false;

    const sections =  numberized.match(/\d{1,7}/g);

    if(!sections) return false;

    const mod97: number = sections
        .reduce(function(total, curr){ return Number(total + curr)%97;},0);

    return mod97 === 1;
}