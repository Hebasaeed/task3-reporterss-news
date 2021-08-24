const  express=require('express')
const newsRouter=require('./routers/news')

const reportersRouter=require('./routers/reporters')

require('./db/mongoose')
const app=express()
app.use(express.json())
app.use(newsRouter)

app.use(reportersRouter)

const port=3000

app.listen(port,()=>{console.log('server is running')})