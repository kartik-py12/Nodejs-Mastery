const http = require("http");

const server = http.createServer((req,res)=>{
    res.writeHead(200,{"content-type":"text/plain"});
    res.end("Hello world from http module");
})

const PORT=3000;

server.listen(PORT, ()=>{
    console.log(`Listing on port ${PORT}`);
});