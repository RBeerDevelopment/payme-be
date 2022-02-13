// password should be at least eight chars long
export function validatePassword(password: string): boolean {
    return password.length >= 8;
}