const fs = require('fs');

module.exports = {
  transpileDependencies: true,
  devServer: {
    https: {
      key: fs.readFileSync('./.cert/192.168.1.70-key.pem'),
      cert: fs.readFileSync('./.cert/192.168.1.70.pem'),
    },
  },
};
