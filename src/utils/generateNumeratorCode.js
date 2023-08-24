export const generateNumeratorCode = (numerators) => {
    const lastCode = numerators[numerators.length - 1].code;
    const lastNumber = parseInt(lastCode.slice(1));

    const newCodeNumber = lastNumber + 1;
    const newCode = "C" + newCodeNumber;

    return newCode;
}