// cloudinary.d.ts
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cloudinary: any; // Declare cloudinary as any type for now
  }
}

export {};