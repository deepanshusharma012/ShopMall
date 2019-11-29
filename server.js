var express=require("express");
var fs=require("fs");
var app=express();
var port=4000;

var products = [];

app.use(express.json());
app.use(express.static("public"));

fs.readFile('public/products.txt', (err, data) => {
  if (err) throw err;
  if(data)
	products=JSON.parse(data).prod;
});

app.get('/loadProducts',function(req,res){
	res.json(products);
})

app.post('/editProduct',function(req,res){
	var productId = req.body.Id; 
	for(i=0;i<products.length;i++)
	{
		if(productId==products[i].Id)
		{
			products[i].Name=req.body.Name;
			products[i].Desc=req.body.Desc;
			products[i].Price=req.body.Price;
			products[i].Quantity=req.body.Quantity;
		}
	}

	writeProductsFile();

	res.send(); 
})

app.post('/addProduct',function(req,res){
	products.push(req.body);

	writeProductsFile();

	res.send();
})

function writeProductsFile()
{
	var objProduct = new Object();
	objProduct.prod=products;

	fs.writeFile('public/products.txt', JSON.stringify(objProduct) , function (err) {
	  if (err) throw err;
	});
}

app.listen(port,function(){
	console.log("Listening on port "+port);
})