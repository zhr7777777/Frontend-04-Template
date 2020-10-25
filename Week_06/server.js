const Koa = require('koa')
const app = new Koa()

app.use((ctx, next) => {
  ctx.body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`
})

app.listen(3000)

console.log('Server started')