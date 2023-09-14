export const capitalizeFirstCharacter = (str: string) => {
    if (str.length === 0) return '';

    const firstCharacter = str.charAt(0);
    const rest = str
        .split('')
        .splice(1)
        .join('');

    return firstCharacter.toUpperCase() + rest;
}