#!/bin/sh

echo "Starting on port 80"

node -e "var http=require('http'),server=http.createServer(function(e,t){t.writeHead(200,{}),t.end('Up')});server.listen(80)"
