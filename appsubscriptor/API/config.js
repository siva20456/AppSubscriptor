module.exports = {
    // ... other config options ...
    resolve: {
      fallback: {
        util: require.resolve('util')
      }
    }
  };
   