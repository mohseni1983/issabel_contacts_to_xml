require('dotenv').config();
const express=require('express');
const mysql=require('mysql')
const app=express()
const connector=mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
})

app.use('/', (req,res)=>{
    res.set('Content-Type','text/xml')
    const result=new Promise((resolve,reject)=>{
        connector.query( "SELECT description AS Name, user AS Telephone FROM devices WHERE tech='sip'",
            (error,response)=>{
                if(error){
                    reject(error)
                }else{
                    let xmlData="<YealinkIPPhoneDirectory>"
                    xmlData+="<DirectoryEntry>"
                    for(let item of response){
                        xmlData+=`<${item.Name}>${item.Telephone}</${item.Name}>`
                    }
                    xmlData+="</DirectoryEntry>"
                    xmlData+="</YealinkIPPhoneDirectory>"
                    resolve(xmlData)
                }
            }
        )
    })
    result.then(dt=>{
        res.send(dt)
    }).catch(err=>{
        throw err
    })
})
app.listen(4000,()=>{
    console.log('Server started at port 4000')
})