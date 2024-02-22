import express from 'express'
import cors from 'cors'
import {handleSearch}  from './Bot/alphaBot.js'


const app=express();

app.use(cors({
  origin: 'https://test.binarybridgesltd.com'
}));
app.use(express.json())


app.listen(3000,()=>{
    console.log('server running on port 3000');
})







// Route to handle specific data fetching based on ID
app.post('/data',async (req, res) => {

    const id = req.body.id; 
   const intId=parseInt(id);
  
    const limit=req.body.limit;
    const intLimit=parseInt(limit)

    const date=req.body.date;
   
    const myResult=await handleSearch(intLimit,id,date);
    res.send(myResult);
   
    
  });
//   const myResult=await handleSearch(2,'54345'); // This will continue searching until the currentInput reaches input + 2
  // console.log(myResult);