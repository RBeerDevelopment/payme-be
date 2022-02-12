export function validateEmailAddress(address: string): boolean {
    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
    return emailRegex.test(address);
}

// password should be at least eight chars long
export function validatePassword(password: string): boolean {
    return password.length >= 8;
}
