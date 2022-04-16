import sharp from "sharp";

export const makeThumbnail = async (
  images: { destination: string; filename: string }[]
) => {
  let gallery: Array<{ filename: string; thumbnail: string }> = [];
  for (const file of images) {
    try {
      await sharp(file.destination + "/" + file.filename)
        .resize({
          width: 300,
          height: 300,
        })
        .toFile(file.destination + "/thumbnail-" + file.filename);
      gallery.push({
        filename: file.filename,
        thumbnail: "thumbnail-" + file.filename,
      });
    } catch (err) {
      continue;
    }
  }
  return gallery;
};
