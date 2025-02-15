const environment = 'development';

let baseURL;

switch (environment) {
    case 'production':
        baseURL = process.env.REACT_APP_PROD_API_BASE_URL;
        break;
    case 'development':
        baseURL = 'http://heavenera.swastik.ai:8001';
        break;
    default:
        baseURL = 'http://heavenera.swastik.ai:8001';
        break;
}

console.log(`API Base URL: ${baseURL}`);
console.log(`Environment: ${environment}`);

export default baseURL;