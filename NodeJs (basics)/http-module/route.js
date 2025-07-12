const http = require("http");

const PORT=3000;

const server = http.createServer((req,res)=>{
    const url = req.url;
    if(url === '/'){
        res.writeHead(200,{"content-type":"text/plain"});
        res.end("Home page");
    }else if(url === '/project'){
        res.writeHead(200,{"content-type":"text/plain"});
        res.end("Project page");
    }else{
        res.writeHead(404,{"content-type":"text/plain"});
        res.end("Page not found")
    }
});

server.listen(PORT,()=>{
    console.log(`Listining at port: ${PORT}`);
})