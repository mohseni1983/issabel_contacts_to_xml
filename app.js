//require('dotenv').config();
const path=require('path')
const fs=require('fs');
const express=require('express');
const mysql=require('mysql')
const app=express()

const connector=mysql.createConnection({
     host: 'localhost',
     database: 'asterisk',
     user: 'root',
     password: 'elyas@1401',
     port: 3306
 })


app.use('/data',(req,res,next)=>{
    console.log('File requested');
    connector.query( "SELECT description AS Name, user AS Telephone FROM devices WHERE tech='sip'",
    (error,response)=>{
        if(error){
            console.log(error)
        }else{
            let xmlData="<YealinkIPPhoneDirectory>"
            
            for(let item of response){
                xmlData+="<DirectoryEntry>"
                if(!isNaN(item.Name))
                    item.Name='Ext-'+item.Name
                xmlData+=`<Name>${item.Name}</Name>`
                xmlData+=`<Telephone>${item.Telephone}</Telephone>`
                xmlData+="</DirectoryEntry>"
            }
            
            xmlData+="</YealinkIPPhoneDirectory>"
            fs.writeFile(path.join(__dirname,'data','contacts.xml'),xmlData,(er)=>{
                if(er){
                    console.log(er)
                }else{
                    console.log('File created');
                    next()
                }
            })

        }
    }
)
    
})
app.use('/data',express.static(path.join(__dirname,'data')))


app.listen(4000,()=>{
    console.log('Server started at port 4000')
})
