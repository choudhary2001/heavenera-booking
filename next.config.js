// next.config.js
module.exports = {
    // Enable standalone output for serverless
    output: "standalone",

    webpack: (config) => {
        // Increase file handling capacity
        config.optimization.splitChunks = {
            ...config.optimization.splitChunks,
            maxSize: 500000,
            maxAsyncRequests: 100,
        };
        return config;
    }
};