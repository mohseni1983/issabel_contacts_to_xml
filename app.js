//require('dotenv').config();
const express=require('express');
const mysql=require('mysql')
const app=express()
const connector=mysql.createConnection({
    host: 'localhost',
    database: 'asterisk',
    user: 'root',
    password: '20242170',
    port: 3306
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
                        if(!isNaN(item.Name))
                            {item.Name = 'Ext-'+item.Name}
                        xmlData+=`<${item.Name.replace(' ','_')}>${item.Telephone}</${item.Name.replace(' ','_')}>`


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
