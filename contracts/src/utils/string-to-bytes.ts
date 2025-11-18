export const stringToBytes = (
  str: string,
  maxLength: number = 128,
): Uint8Array => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);

  if (encoded.length > maxLength) {
    throw new Error(
      `String "${str}" exceeds maximum length of ${maxLength} bytes`,
    );
  }

  // Pad to maxLength with zeros
  const padded = new Uint8Array(maxLength);
  padded.set(encoded);
  return padded;
};
