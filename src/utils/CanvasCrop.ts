const TO_RADIANS = Math.PI / 180

export const getCroppedImg = (image: HTMLImageElement, crop: any, rotate = 1, scale = 1) => {
    console.log(crop)
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

    const ctx = canvas.getContext('2d');

    if (ctx) {
        ctx.scale(pixelRatio, pixelRatio)
        ctx.imageSmoothingQuality = 'high'

        const cropX = crop.x * scaleX
        const cropY = crop.y * scaleY

        const rotateRads = rotate * TO_RADIANS
        const centerX = image.naturalWidth / 2
        const centerY = image.naturalHeight / 2

        ctx.save()

        ctx.translate(-cropX, -cropY)
        ctx.translate(centerX, centerY)
        ctx.rotate(rotateRads)
        ctx.scale(scale, scale)
        ctx.translate(-centerX, -centerY)

        ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
        );

        ctx.restore();
    }

    return canvas.toDataURL('image/jpeg');
};