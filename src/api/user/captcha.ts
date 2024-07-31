
import axios from "../request.ts";

const mainPath = "/api/c/captcha"

export const getCaptchaApi = async (): Promise<string> => {
    return await axios.get(mainPath + '/getCaptcha');
}