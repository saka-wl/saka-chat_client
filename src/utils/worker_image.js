import { getArrMd5Info } from "./file";

onmessage = async (e) => {
    postMessage(await getArrMd5Info(e.data));
};