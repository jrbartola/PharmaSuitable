const config = {
   entry: './react/Router.js',

   output: {
      path:'/Users/Jesse/PycharmProjects/PharmaSuitable/www/index.js',
      filename: 'index.js',
   },

   devServer: {
      inline: true,
      port: 8080
   },

   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',

            query: {
               presets: ['es2017', 'react']
            }
         }
      ]
   }
}

module.exports = config;