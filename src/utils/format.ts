
export const getFileExtName = (fileName: string) => {
    const lastFlagIndex = fileName.lastIndexOf('.');
    if(lastFlagIndex === -1) return false;
    return fileName.substring(lastFlagIndex);
}