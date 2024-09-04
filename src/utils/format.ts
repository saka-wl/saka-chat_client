
export const getFileExtName = (fileName: string) => {
    const lastFlagIndex = fileName.lastIndexOf('.');
    if(lastFlagIndex === -1) return false;
    return fileName.substring(lastFlagIndex);
}

export const jsonToObj = (json: string) => {
    try {
        return JSON.parse(json);
    }catch(err) {
        return false;
    }
}

export const delay = (time: number = 1000) => {
    let timer: number = -1;
    return new Promise((res, rej) => {
        timer = window.setTimeout(() => {
            res(true);
            timer && clearTimeout(timer);
        }, time)
    })
}