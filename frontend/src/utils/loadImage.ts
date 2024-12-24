export const loadImage = (imageUrl: string) =>
  new Promise((res, rej) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      res('Done');
    };
    img.onerror = () => {
      rej(new Error(`Failed to load image: ${imageUrl}`));
    };
  });
