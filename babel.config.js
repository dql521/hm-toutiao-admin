module.exports = {

  presets: [
    '@vue/cli-plugin-babel/preset',
    // ["@vue/cli-plugin-babel/preset",{
    //   polyfills: [
    //     "es6.promise",
    //     "es6.symbol"
    //   ],
    //   useBuiltIns: "entry"
    // }]
    // "@vue/app"
  ],
  plugins: [
    // element官方教程
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ]
}
