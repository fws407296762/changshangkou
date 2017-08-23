/**
 * Created by fuwensong on 2017/8/23.
 */



class SimulateUpLoadForm{
    constructor(file){
        this.file = file;   //文件可以是路径，数组，buffer
    }
    static uploadFileBody(){
        let boundary = Math.random().toString(16);
        let body = `\r\n------${boundary}\r\n`;
        body += `Content-disposition: form-data; name="file";filename="file1.text"\r\n`;
        body += `Content-Type: application/octet-strea\r\n`;
        body += `Content-Transfer-Encoding: binary\r\n\r\n`;
        return body;
    }
}

// console.log(SimulateUpLoadForm.uploadFileBody());

const stream = require("stream");
