var express=require("express");
var fs=require("fs");
var app=express();
var port=4000;

var products = [];

app.use(express.json());
app.use(express.static("public"));

app.post('/addProduct',function(req,res){
	products.push(req.body);

	var objProduct = new Object();
	objProduct.prod=products;

	fs.writeFile('public/products.txt', JSON.stringify(objProduct) , function (err) {
	  if (err) throw err;
	});
	
	res.send();
})

app.listen(port,function(){
	console.log("Listening on port "+port);
})