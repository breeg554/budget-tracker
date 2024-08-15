export function base64ToBlob(
  base64: string,
  contentType = '',
  sliceSize = 512,
) {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

export function base64ToFile(
  base64: string,
  fileName: string,
  contentType: 'image/jpeg' | 'image/png',
) {
  const blob = base64ToBlob(base64, contentType);
  return new File([blob], fileName, { type: contentType });
}
