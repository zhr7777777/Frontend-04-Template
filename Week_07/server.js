const Koa = require('koa')
const app = new Koa()

app.use((ctx, next) => {
  ctx.body = `
<html lang="en">
  <head>
    <title>Document</title>
    <style>
      body .test {
        font-size: 12px;
      }
      body div {
        font-size: 16px;
        color: red;
      }
      body div.test {
        color: green;
      }
    </style>
  </head>
  <body>
    <div class="test"></div>
  </body>
</html>`.trim()
})

app.listen(8080)

console.log('Server started')

