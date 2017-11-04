const config = {
   entry: './react/Router.js',

   output: {
      path:'/Users/Jesse/PycharmProjects/PharmaSuitable/www',
      filename: 'index.js',
   },

   devServer: {
      inline: true,
      port: 8080,
      contentBase: "./static",
      hot: true
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