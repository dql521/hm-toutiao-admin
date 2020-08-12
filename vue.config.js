const path = require('path')

const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
console.log(process.env.VUE_APP_HOST);
module.exports = {
  devServer: {
    hot: true, // 热启动
    open: true, // 打开浏览器
    // port: 8888,
    proxy: { // 开发环境代理配置
      '/api': { // 匹配 /dev-api 开头的请求，
        // 目标服务器地址
        // target: 'http://ad.szrcbank.com/advesy',
        target: process.env.VUE_APP_HOST,
        changeOrigin: process.env.NODE_ENV == 'development', // 开启代理服务器，上线时关闭代理
        pathRewrite: {
          //  会将 /dev-api 替换为 '',也就是 /dev-api 会移除，
          // 如 /dev-api/db.json 代理到 https://localhost:8080/db.json
          '^/api': ''
        }
      }
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 192
            // rootValue: 192
            // mediaQuery: true
          })
        ]
      }
    }
  },
  lintOnSave: false, // 关闭eslint校验
  productionSourceMap: false,
  runtimeCompiler: true,
  configureWebpack: config => {
    config.entry.app = ['babel-polyfill', './src/main.js']
  },
  publicPath: './',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@i': path.resolve(__dirname, './src/assets')
      }
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // 下面是下载的插件的配置
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 5,
        minChunkSize: 100
      })
    ]
  }

}

// const path = require('path')
// const resolve = dir => path.resolve(__dirname, dir)
// const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

// module.exports = {
//  transpileDependencies: ['webpack-dev-server/client'],

//  // 基本路径
//  // baseUrl: './',
//  publicPath: './',
//  // 输出文件目录
//  outputDir: 'dist',
//  // eslint-loader 是否在保存的时候检查
//  lintOnSave: false,
//  assetsDir: '', // 相对于outputDir的静态资源(js、css、img、fonts)目录
//  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
//  // 生产环境是否生成 sourceMap 文件
//  productionSourceMap: false,

//  chainWebpack: config => {
//   config.entry.app = ['babel-polyfill', './src/main.js'];
//   // 修复HMR
//   config.resolve.symlinks(true);
//   //修复 Lazy loading routes Error
//   config.plugin('html').tap(args => {
//    args[0].chunksSortMode = 'none';
//    return args;
//   });
//   // 添加别名
//   config.resolve.alias
//    .set('@', resolve('src'))
//    .set('assets', resolve('src/assets'))
//    .set('img', resolve('src/assets/img'))
//    .set('components', resolve('src/components'))
//    .set('layout', resolve('src/layout'))
//    .set('base', resolve('src/base'))
//    .set('static', resolve('src/static'));
//   //压缩图片
//   config.module
//    .rule("images")
//    .use("image-webpack-loader")
//    .loader("image-webpack-loader")
//    .options({
//     // mozjpeg: {progressive: true, quality: 65},
//     // optipng: {enabled: false},
//     // pngquant: {quality: [30, 65], speed: 4},
//     // gifsicle: {interlaced: false},
//     // webp: {quality: 75},
//     bypassOnDebug: true
//    });

//   // 打包分析
//   // if (process.env.VUE_APP_HOST) {
//   //  config.plugin('webpack-report')
//   //   .use(BundleAnalyzerPlugin, [{
//   //    analyzerMode: 'static',
//   //   }]);
//   // }
//  },

//  configureWebpack: config => {
//   if (IS_PROD) {
//    const plugins = [];
//    //开启 gzip 压缩
//    plugins.push(
//     new CompressionWebpackPlugin({
//      filename: '[path].gz[query]',
//      algorithm: 'gzip',
//      test: productionGzipExtensions,
//      threshold: 10240,
//      minRatio: 0.8
//     })
//    );

//    config.plugins = [
//     ...config.plugins,
//     ...plugins
//    ];
//   }
//  },
//  // css相关配置
//  css: {
//   extract: true,
//   sourceMap: false,
//   loaderOptions: {
//     postcss: {
//               plugins: [
//                 require('postcss-px2rem')({
//                   remUnit: 192
//                   // rootValue: 192
//                   // mediaQuery: true
//                 })
//               ]
//             }
//   },
//   modules: false
// },
//  parallel: require('os').cpus().length > 1,
//  pwa: {},
//  devServer: {
//   open: true,
//   hot: true,
//   // host: '0.0.0.0',
//   port: 8080,
//   https: false,
//   // hotOnly: false,
//   proxy: { // 开发环境代理配置
//           '/api': { // 匹配 /dev-api 开头的请求，
//             // 目标服务器地址
//             target: 'http://192.168.88.186/advesy',
//             changeOrigin: true, // 开启代理服务器，上线时关闭代理
//             pathRewrite: {
//               //  会将 /dev-api 替换为 '',也就是 /dev-api 会移除，
//               // 如 /dev-api/db.json 代理到 https://localhost:8080/db.json
//               '^/api': ''
//             }
//           }
//         }, // 设置代理
//   before: app => {
//   }
//  },

//  // 第三方插件配置
//  pluginOptions: {}

// };
