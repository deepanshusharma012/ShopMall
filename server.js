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
});

app.get('/productSearch',function(req,res){

	var obj = new Object();
	var flag=0;

	for(i=0;i<products.length;i++)
	{
		if(req.query.Name==products[i].Name)
		{
			obj=products[i];
			flag=1;
			break;
		}
	}
	if(flag==1)
    	res.json(obj);
	else
		res.json(obj); 
})

app.post('/addProduct',function(req,res){

	products.push(req.body);

	writeProductsFile();

	res.send();
});

app.post('/editProduct',function(req,res){

	var productIndex = getProductIndex(req.body.Id);

	if(productIndex!=-1)
	{
		products[i].Name=req.body.Name;
		products[i].Desc=req.body.Desc;
		products[i].Price=req.body.Price;
		products[i].Quantity=req.body.Quantity;
	}

	writeProductsFile();

	res.send(); 
});

app.post('/deleteProduct',function(req,res){

	var productIndex = getProductIndex(req.body.Id);

	if(productIndex!=-1)
	{
		products.splice(productIndex,1);
	}	

	writeProductsFile();

	res.send(); 
});

function getProductIndex(productId)
{
	for(i=0;i<products.length;i++)
	{
		if(productId==products[i].Id)
		{
			return i;
		}
	}
	return -1;
}

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