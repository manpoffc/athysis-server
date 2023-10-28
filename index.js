
const { PrismaClient } = require('@prisma/client');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();

const PORT = 3005

const prisma = new PrismaClient()

async function main(){

}

main().then(async()=>{
    await prisma.$disconnect
}).catch(async(e)=>{
    console.error(e)
    await prisma.$disconnect()
})

app.use(cors());
app.get('/athletes',async(req,res)=>{
    
    try{
        const data = await prisma.athletes.findMany();
        res.json(data)

    }catch(error){
        console.error('Error Fetching the data: ', error)
        res.status(500).json({error:'Internal Server error'})
    }
})

app.get('/testing',async(req,res)=>{

    console.log(req.query)
    res.json("DONE")
})
app.get('/filter', async(req,res)=>{

    const minAge = parseInt(req.query.minAge)
    const maxAge = parseInt(req.query.maxAge)
    const citi = req.query.citizen === 'yes'
    const gen = req.query.gender;

    console.log(minAge,maxAge,citi,gen)
    try{

        const query = {
            age:{
            gte:minAge,
            lte: maxAge,
        },
    }

    if (gen && gen!='all'){
        query.gender= {
            equals: gen,
        }
    }
    if (citi && citi!='all'){
        query.citizen= {
            equals: citi,
        }
    }
        const filteredResult = await prisma.athletes.findMany({
            where:query,        })

        console.log(filteredResult)

        res.json(filteredResult)

    }catch(error){

        console.error("Error retrieving result")
        res.status(500).json({error:'Internal Server error'})
    }
})
app.listen(PORT,()=>{
    console.log("HEllo")
})
