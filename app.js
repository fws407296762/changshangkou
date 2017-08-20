/**
 * Created by fws on 2017/7/25.
 */

const https = require("https");
const querystring = require("querystring");
// FileGee 百度网盘的access_token 21.dfa9ff7b0c149469180889a04181336b.2592000.1503717323.1963687721-286652
// ApiKey = '0upuII64N8q7tpTKrmYBaGFr' # replace with your own ApiKey if you use your own appid
// SecretKey = 'Nia5GyvhsoS6eMZhgd6FIVPI2wyKFx6v' # replace with your own SecretKey if you use your own appid
// AppPcsPath = '/apps/FileGee文件同步备份系统' # change this to the App's directory you specified when creating the app
//让用户获取授权码的界面	https://openapi.baidu.com/oauth/2.0/authorize?client_id=0upuII64N8q7tpTKrmYBaGFr&response_type=code&redirect_uri=oob&scope=basic+netdisk
//获取access_token	https://openapi.baidu.com/oauth/2.0/token?code=c6781e041a3ba994668c4c49f48707a1&redirect_uri=oob&grant_type=authorization_code&client_id=0upuII64N8q7tpTKrmYBaGFr&client_secret=Nia5GyvhsoS6eMZhgd6FIVPI2wyKFx6v
// var requestOpt = {
//     protocol:"https:",
//     host:"yun.xiaoyi.com",
//     path:"/login",
//     method:"POST",
//     headers:{
//         "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
//         "Upgrade-Insecure-Requests":1,
//         "Origin":"https://yun.xiaoyi.com",
//         "Content-Type":"application/x-www-form-urlencoded"
//     }
// };
// var bodyData = querystring.stringify({
//     "account":"17720440292",
//     "password":"Lyq2512125"
// });
//
// var request = https.request(requestOpt,function(res){
//     console.log("status:",res.statusCode)
//     console.log("header：",res.headers);
//     var headers = res.headers;
//     var setCookis = headers["set-cookie"];
//     setCookis = setCookis.join(",").replace(/(HttpOnly)\;?\,?|(Secure)\;?\,?|(Path=\/)\;?\,?|\s*/g,"");
//
//     res.on("data",function(chunk){
//         console.log(`BODY: ${chunk}`);
//     });
//     res.on("end",function(err,res){
//         console.log("请求完成");
//         let location = headers.location;
//         var locationRequestOpt = {
//             protocol:"https:",
//             host:"yun.xiaoyi.com",
//             path:"/video",
//             method:"get",
//             headers:{
//                 "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
//                 "Cookie":setCookis
//             }
//         };
//         var locationHttp = https.request(locationRequestOpt,function(locationRes){
//             console.log("status:",locationRes.statusCode);
//             var videoBody = "";
//             locationRes.on("data",function(chunk){
//                 videoBody += chunk;
//             });
//             locationRes.on("end",function(){
//                 videoBody = videoBody.replace(/[^\;](window)/g,";window");  //主要作用就是如果 window 前面没有 ; 则给 window 前面加上 ;
//                 videoBody = videoBody.replace(/[\s\r\n]/g,"");   //清除掉空格换行
//                 videoBody = videoBody.match(/((window)\.(initData)\.\w*\=([\[\{\"]?\S*?[\"\}\]]?)\;){1,}?/g);  //获取window.initData开头的数据
//                 var params = {};
//                 videoBody.forEach(function(item,index){
//                     item.replace(/(window\.initData\.\w*)\=(\S*)\;/,function(str,one,two){
//                         params[one] = eval("("+two+")");
//                     });
//                 });
//                 console.log("请求完成");
//                 let uid = params["window.initData.currentUid"],
//                     segs = params["window.initData.segs"];
//                 let createRequestOpt = {
//                     protocol:"https:",
//                     host:"yun.xiaoyi.com",
//                     path:"/download/create",
//                     method:"POST",
//                     headers:{
//                         "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
//                         "Cookie":setCookis,
//                         "Content-Type":"application/x-www-form-urlencoded"
//                     }
//                 };
//                 let createContent = querystring.stringify({
//                     uid:uid,
//                     startTime:segs[0]["start"],
//                     stopTime:segs[0]["end"]
//                 });
//                 let createRequest = https.request(createRequestOpt,function(res){
//                     res.on("data",function(chunk){
//                         console.log(`BODY: ${chunk}`);
//                     });
//                     res.on("end",function(){
//                         console.log("创建完成")
//                     })
//                 });
//
//                 createRequest.write(createContent);
//                 createRequest.end();
//             });
//         });
//         locationHttp.end();
//     })
// });


// function request(){
//     return new Promise(function(resolve,reject){
//         var request = https.request(requestOpt,function(res){
//             resolve(res);
//         })
//     });
// }


// request.write(bodyData);
// request.end();


//上传单个文件
console.log("开始请求")
const path = require("path");
const fs = require("fs");
let fileDate = fs.readFileSync(path.join(__dirname,"ASP.ico"),"utf8");
let uploadData = querystring.stringify({
    "file":fileDate
});

let uploadOpts = {
    protocol:"https:",
    host:"c.pcs.baidu.com",
    path:"/rest/2.0/pcs/file?method=upload&access_token=21.dfa9ff7b0c149469180889a04181336b.2592000.1503717323.1963687721-286652&path=ASP.ico&ondup=newcopy",
    method:"POST",
    headers:{
        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
        "Content-Type":"application/x-www-form-urlencoded",
        'Content-Length': Buffer.byteLength(uploadData)
    }
};

let uploadFileRequest = https.request(uploadOpts,function(res){
    console.log("status:",res.statusCode);
    console.log("header：",res.headers);
    res.setEncoding('utf8');
    res.on("data",function(chunk){
        console.log(`BODY:${chunk}`);
    })
    res.on("end",function(){
        console.log("请求结束")
    });
});
uploadFileRequest.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});
uploadFileRequest.write(uploadData);
uploadFileRequest.end();

