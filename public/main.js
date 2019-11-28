var productId=1;
var products=[];

function addProduct() 
{
	var objProduct = new Object();
	
	objProduct.Id = productId;
 	objProduct.Name = document.getElementById("txtProductName").value;
    objProduct.Desc = document.getElementById("txtProductDesc").value;
	objProduct.Price = parseInt(document.getElementById("txtProductPrice").value);
	objProduct.Quantity = parseInt(document.getElementById("txtProductQuantity").value);

	if(inputValidate(objProduct))
	{
		sendData(objProduct);
		products.push(objProduct);

		displayProducts(objProduct);

	 	document.getElementById('txtProductName').value="";
	 	document.getElementById('txtProductDesc').value="";
	 	document.getElementById('txtProductPrice').value="";
	 	document.getElementById('txtProductQuantity').value="";

		productId++;
	}
}

function inputValidate(objProduct)
{
	var ProductNameRegex = /^[a-zA-Z0-9]+$/;
	var ProductDescRegex = /^[0-9A-Za-z!@.,;:'"? -]{10,200}?$/;
	var ProductPricRegex = /^\d+(\.\d{0,2})?$/;
	var ProductQuantityRegex = /^\d+$/;

	if(ProductNameRegex.test(objProduct.Name)==false)
	{
		alert('Please Enter a valid product name. (Only Alphanumerics)');
		return false;
	}
	else if(ProductDescRegex.test(objProduct.Desc)==false)
	{
		alert('Please Enter a valid product description. (Description should be between 20 & 200 characters)');
		return false;
	}
	else if(ProductPricRegex.test(objProduct.Price)==false)
	{
		alert('Please Enter a valid product price. (Only Numeric with atmost 2 decimal points)');
		return false;
	}
	else if(ProductQuantityRegex.test(objProduct.Quantity)==false)
	{
		alert('Please Enter a valid product Quantity. (Only Numeric values)');
		return false;
	}
	else
	{
		return true;
	}
}

function sendData(objProduct)
{
	var xhttp = new XMLHttpRequest();				

	xhttp.open("POST", "/addProduct");
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(objProduct));
}

function displayProducts(objProduct)
{
	var a = '<div class="container-fluid" id="';
	var x = '" align="center"><div class="col-sm-3"><img class="images" src="img/8.jpg"><div class="product_details"><span id="productNameDisp" style="margin-top: 1vw;"><a href="#">';
	var b = '</a></span><br><span id="productDescDisp">';
	var c = '</span><br><span id="productAmountDisp">Rs. ';
	var d = '</span><br><span id="productQuantityDisp">Quantity :- ';
	var e = '</span><br><div class="btn-group" style="margin-top: 0.5vw;"><button type="button" class="btn btn-warning" onclick="editProduct()">Edit</button><button type="button" class="btn btn-danger" onclick="deleteProduct()">Delete</button></div><div style="margin-top: 0.5vw;margin-bottom: 0.5vw;><button type="button" class="btn btn-info" onclick="addToCart()">&nbsp;&nbsp;&nbsp;&nbsp;Add to Cart&nbsp;&nbsp;&nbsp;&nbsp;</button></div></div></div></div><br>';
	//var text=;

	$('#productsDisp').append(a+objProduct.Id+x+objProduct.Name+b+objProduct.Desc+c+objProduct.Price+d+objProduct.Quantity+e);
}