const environment = 'development';

let baseURL;

switch (environment) {
    case 'production':
        baseURL = process.env.REACT_APP_PROD_API_BASE_URL;
        break;
    case 'development':
        baseURL = 'https://heavenera.swastik.ai';
        break;
    default:
        baseURL = 'https://heavenera.swastik.ai';
        break;
}

console.log(`API Base URL: ${baseURL}`);
console.log(`Environment: ${environment}`);

export default baseURL;