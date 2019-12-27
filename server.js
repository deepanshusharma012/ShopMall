var express=require("express");
var fs=require("fs");
var app=express();
var port=4000;

var products = [];
var users = [];

var data;

app.use(express.json());
app.use(express.static("public"));

function readFile(path,callback){
	fs.readFile(path,function(err,data){
		if(err)
			callback(err,null);
		else if(data.length==0){
			callback(null,[]);
			return data;
		}
		else{
			callback(null,JSON.parse(data));
		}
	});
	return data;
}

fs.readFile('public/users.txt', (err, data) => {
  if (err) throw err;
  if(data)
	users=JSON.parse(data).users;
});

app.get('/loadProducts',function(req,res){
	readFile("public/products.txt",function(err,data){		
		if(err) throw err;
		if(data){
			products=data.prod;
			res.json({"status":"true","data":products});
		}
		else
			res.json({"status":"false","message":"this type of error"});
	});
});


//------------cart ahead -----------------

app.get('/loadCartProducts',function(req,res){
	if(users)
	{
		res.json({"status":"true","data":users[0]});
	}
	else
		res.json({"status":"false","message":"this type of error"});
});

app.get('/getProduct',function(req,res){

	var productIndex = getProductIndex(req.query.Id);
	if(productIndex!=-1)
	{
		res.json({"status":"true","data":products[productIndex]});
	}
	else
	{
		res.json({"status":"false","message":"product is unavailable"});
	}
});

app.post('/updateCartProducts',function(req,res){
	var obj = req.body;

	var userIndex = getUserIndex(obj.userId);
	var cartIndex = getCartIndex(userIndex,obj.productId);

	users[userIndex].userCartProducts.splice(cartIndex,1);

	writeUsersFile();

	res.send();
});

app.post('/updateCartTotalBill',function(req,res){
	var obj = req.body;

	var userIndex = getUserIndex(obj.userId);

	users[userIndex].userCartTotal=obj.cartTotalBill;

	writeUsersFile();

	res.send();
});

app.post('/updateCart',function(req,res){
	var obj = req.body;
	var flag=0;

	var productIndex = getProductIndex(obj.productId);
	var userIndex = getUserIndex(obj.userId);
	var cartIndex = getCartIndex(userIndex,obj.productId);

	if(obj.operation==2)                                                 // Case of plus
	{
		if(products[productIndex].Quantity>0)
		{
			users[userIndex].userCartProducts[cartIndex].productQuantity++;
			products[productIndex].Quantity=products[productIndex].Quantity-1;

			users[userIndex].userCartTotal=users[userIndex].userCartTotal+products[productIndex].Price;

			flag=1;			
		}
	}
	else if(obj.operation==1)                                             // Case of minus
	{
		if(users[userIndex].userCartProducts[cartIndex].productQuantity>1)
		{
			users[userIndex].userCartProducts[cartIndex].productQuantity--;
			products[productIndex].Quantity=products[productIndex].Quantity+1;

			users[userIndex].userCartTotal=users[userIndex].userCartTotal-products[productIndex].Price;

			flag=1;			
		}
	}
	else if(obj.operation==3)                                             // Case of remove
	{
		var cartQuantity = users[userIndex].userCartProducts[cartIndex].productQuantity;
		products[productIndex].Quantity=products[productIndex].Quantity+cartQuantity;

		users[userIndex].userCartTotal=users[userIndex].userCartTotal-(cartQuantity*products[productIndex].Price);

		users[userIndex].userCartProducts.splice(cartIndex,1);

		flag=1;		
	}
	
	if(flag==1){
		writeProductsFile();
		writeUsersFile();
		res.json({"status":"true","data":users[userIndex].userCartTotal});
	}
	else
		res.json({"status":"false"});

});




//------------cart over -----------------

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

app.post('/addToCart',function(req,res){
	var flag=0;
	var userIndex = getUserIndex(req.body.userId);

	if(userIndex!=-1)
	{
		var CartIndex = getCartIndex(userIndex,req.body.productId);
		var productIndex= getProductIndex(req.body.productId);

		if(CartIndex!=-1)
		{
			//product is already there, increse the quantity

			users[userIndex].userCartProducts[CartIndex].productQuantity++;
			products[productIndex].Quantity=products[productIndex].Quantity-1;

			users[userIndex].userCartTotal=users[userIndex].userCartTotal+products[productIndex].Price;

			flag=1;


		}
		else
		{
			//product should add first
			var objCartProduct=new Object();
			objCartProduct.productId=req.body.productId;
			objCartProduct.productQuantity=1;

			users[userIndex].userCartProducts.push(objCartProduct);
			products[productIndex].Quantity=products[productIndex].Quantity-1;

			users[userIndex].userCartTotal=users[userIndex].userCartTotal+products[productIndex].Price;

			flag=1;
		}
	}
	else
	{
		console.log("No such user found!");
	}

	if(flag==1){
		writeProductsFile();
		writeUsersFile();
		res.send("Product is added to cart!");
	}
	else
		res.send("Error: Product is not added!");
	 
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

function getCartIndex(userIndex,productId)
{
	for(i=0;i<users[userIndex].userCartProducts.length;i++)
	{
		if(users[userIndex].userCartProducts[i].productId==productId)
		{
			return i;
		}
	}
	return -1;	
}

function getUserIndex(userId)
{
	for(i=0;i<users.length;i++)
	{
		if(userId==users[i].userId)
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

	//console.log(objProduct);

	fs.writeFile('public/products.txt', JSON.stringify(objProduct) , function (err) {
	  if (err) throw err;
	});
}

function writeUsersFile()
{
	var objUsers = new Object();
	objUsers.users=users;

	fs.writeFile('public/users.txt', JSON.stringify(objUsers) , function (err) {
	  if (err) throw err;
	});
}

app.listen(port,function(){
	console.log("Listening on port "+port);
})