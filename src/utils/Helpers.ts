export const encodeToBase64 = (data: any) => {
    return btoa(data);
};

export const decodeFromBase64 = (encodedData: any) => {
    return atob(encodedData);
};