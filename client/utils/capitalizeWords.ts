export function capitalizeWords(str: string): string {
  if (!str) {
    return '';
  }

  return str
    .toLowerCase() // 1. Convertir toda la cadena a minúsculas
    .split(' ')    // 2. Dividir la cadena en un array de palabras por espacios
    .map((word: string) => {
      if (word.length === 0) {
        return '';
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}