const isDevelopment = false
const prodUrl = "https://atacanet.com.br"
const devUrl = "http://localhost:3333"

export const apiUrl = () => {
    return isDevelopment ? devUrl : prodUrl;
}