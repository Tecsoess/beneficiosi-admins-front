const findPortraitImg = (images: any[]) => {
    const image = images.find((image) => image.isPortrait);
    return image;
}


export default findPortraitImg;