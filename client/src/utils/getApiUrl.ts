const isDevelopment = false
const prodUrl = "https://a.a"
const devUrl = "http://localhost:3333"

export const apiUrl = () => {
    return isDevelopment ? devUrl : prodUrl;
}