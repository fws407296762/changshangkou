/**
 * Created by fuwensong on 2017/8/23.
 */



// class SimulateUpLoadForm{
//     constructor(file){
//         this.file = file;   //文件可以是路径，数组，buffer
//     }
//     static uploadFileBody(){
//         let boundary = Math.random().toString(16);
//         let body = `\r\n------${boundary}\r\n`;
//         body += `Content-disposition: form-data; name="file";filename="file1.text"\r\n`;
//         body += `Content-Type: application/octet-strea\r\n`;
//         body += `Content-Transfer-Encoding: binary\r\n\r\n`;
//         body += file
//         body += `\r\n----${boundary}--`;
//         return body;
//     }
// }
//
// // console.log(SimulateUpLoadForm.uploadFileBody());

// const stream = require("stream");

const http = require("http");
const fs = require("fs");

let request = http.createServer(function(req,res){
    let fileStream = fs.createReadStream("../upload/2.txt",{encoding:"utf8"});
    fileStream.pipe(res);
    // let chunks = "";
    // fileStream.on("data",function(chunk){
    //     res.write(chunk);
    // });
    // fileStream.on("end",function(){
    //     res.end();
    // })
});
request.listen(8000)


