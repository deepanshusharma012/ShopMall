var productId=1;
var products=[];
var selectedProductIndex=null;

function loadProducts()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange=function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var arr = JSON.parse(this.responseText);

			var max=0;
			if(arr){
				for(i=0;i<arr.length;i++)
				{
					if(arr[i].Id>max)
					{
						max=arr[i].Id;
					}
					products.push(arr[i]);
					displayProducts(arr[i]);
					productId++;
				}
			}
	    }
	};

	xhttp.open("GET", "/loadProducts");
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

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

function editProduct()
{
	console.log(selectedProductIndex);
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

function displayProducts(objProduct)
{
	var divListProducts = document.getElementById('divListProducts');

	var divProduct = document.createElement("div");
	divProduct.setAttribute("id", objProduct.Id);
	divProduct.setAttribute("style", "border: 1px solid #94b8b8;width: 16vw;text-align: center;");

	var imgProduct = document.createElement("img");
	imgProduct.setAttribute("class","productImages");
	imgProduct.setAttribute("src","img/8.jpg");
	divProduct.appendChild(imgProduct);

	var aProductName = document.createElement("a");
	aProductName.setAttribute("href","#");
	aProductName.setAttribute("id","productNameDisp");
	aProductName.setAttribute("style","margin-top: 1vw;");
	aProductName.innerHTML = objProduct.Name;
	divProduct.appendChild(aProductName);
	
	insertBlankLine(divProduct);

	var lblProductDesc = document.createElement("label");
	lblProductDesc.setAttribute("id","productDescDisp");
	lblProductDesc.innerHTML = objProduct.Desc;
    divProduct.appendChild(lblProductDesc);
	
    insertBlankLine(divProduct);

    var lblProductPrice = document.createElement("label");
	lblProductPrice.setAttribute("id","productPriceDisp");
	lblProductPrice.innerHTML = "Rs "+objProduct.Price;
    divProduct.appendChild(lblProductPrice);
	
    insertBlankLine(divProduct);

    var lblProductQuantity = document.createElement("label");
    lblProductQuantity.setAttribute("id","productQuantityDisp");
	lblProductQuantity.innerHTML = "Quantity :- "+objProduct.Quantity;
    divProduct.appendChild(lblProductQuantity);
	
    insertBlankLine(divProduct);
	
	var btnEdit = document.createElement("button");
	btnEdit.setAttribute("id","btnEdit");
	btnEdit.setAttribute("class","btn btn-warning");
	btnEdit.setAttribute("data-toggle","modal");
	btnEdit.setAttribute("data-target","#myModal1");
	btnEdit.innerHTML = "Edit";
	divProduct.appendChild(btnEdit);

	var btnDelete = document.createElement("button");
	btnDelete.setAttribute("id","btnDelete");
	btnDelete.setAttribute("class","btn btn-danger");
	btnDelete.innerHTML = "Delete";
	divProduct.appendChild(btnDelete);

	insertBlankLine(divProduct);

    var btnAddButton = document.createElement("button");
	btnAddButton.setAttribute("id","btnAddButton");
	btnAddButton.setAttribute("class","btn btn-info");
	btnAddButton.setAttribute("style","margin-top: 0.5vw;margin-bottom: 0.5vw;");
	btnAddButton.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;Add to Cart&nbsp;&nbsp;&nbsp;&nbsp;";
	divProduct.appendChild(btnAddButton);

	btnEdit.addEventListener("click",function(event)
										  {
										  	 var x = parseInt(event.target.parentNode.id);
											 selectedProductIndex = getProductIndex(x);

											 document.getElementById('txtProductName1').value=products[selectedProductIndex].Name;
										 	 document.getElementById('txtProductDesc1').value=products[selectedProductIndex].Desc;
										 	 document.getElementById('txtProductPrice1').value=products[selectedProductIndex].Price;
										 	 document.getElementById('txtProductQuantity1').value=products[selectedProductIndex].Quantity;
										  }
							     );

    // btnDelete.addEventListener("click",function(event)
				// 					  {
				// 						   var targetParent = event.target.parentNode;
				// 						   var selectedProductIndex = getProductIndex(parseInt(targetParent.id));

				// 						   var selectedCartProductIndex = getCartProductIndex(parseInt(targetParent.id));
				// 						   if(selectedCartProductIndex!=-1)
				// 						   {										   
				// 							   var amountDeduction = cartProducts[selectedCartProductIndex].Price*(cartProducts[selectedCartProductIndex].Quantity);
				// 							   cartTotalBill-=amountDeduction;
											    
				// 							   x = JSON.stringify(cartTotalBill);
				// 							   localStorage.setItem('cartTotalBill',x);

				// 							   removeFromCartProductsArray(selectedCartProductIndex);
	   //  								   }
										   
				// 						   removeFromProductsArray(selectedProductIndex);
				// 						   targetParent.parentNode.removeChild(targetParent);
										   
				// 						   x = JSON.stringify(products);
    // 									   localStorage.setItem('user1',x);
				// 					  }
				// 			);

    // btnAddButton.addEventListener("click", function(event)
				// 							{
				// 								 var x = parseInt(event.target.parentNode.id);
				// 								 var selectedProductIndex = getProductIndex(x);
												 
				// 								 addToCart(selectedProductIndex);
				// 							}
				// 				 );

	divListProducts.appendChild(divProduct);
	
    insertBlankLine(divListProducts);

	// var a = '<div class="container-fluid" id="';
	// var x = '" align="center"><div class="col-sm-3"><img class="images" src="img/8.jpg"><div class="product_details"><span id="productNameDisp" style="margin-top: 1vw;"><a href="#">';
	// var b = '</a></span><br><span id="productDescDisp">';
	// var c = '</span><br><span id="productAmountDisp">Rs. ';
	// var d = '</span><br><span id="productQuantityDisp">Quantity :- ';
	// var e = '</span><br><div class="btn-group" style="margin-top: 0.5vw;"><button type="button" class="btn btn-warning" id="'+10000+objProduct.Id+'"  data-toggle="modal" data-target="#myModal1">Edit</button><button type="button" class="btn btn-danger" onclick="deleteProduct()">Delete</button></div><div style="margin-top: 0.5vw;margin-bottom: 0.5vw;><button type="button" class="btn btn-info" onclick="addToCart()">&nbsp;&nbsp;&nbsp;&nbsp;Add to Cart&nbsp;&nbsp;&nbsp;&nbsp;</button></div></div></div></div><br>';
	// //var text=;

	// $('#productsDisp').append(a+objProduct.Id+x+objProduct.Name+b+objProduct.Desc+c+objProduct.Price+d+objProduct.Quantity+e);

	// var btnId=10000+objProduct.Id;
	// var btnEdit = document.getElementById('btnId');
	// btnEdit.addEventListener("click",function(event)
	// 									  {
	// 									  	var x = parseInt(event.target.parentNode.parentNode.parentNode.parentNode.id);
	// 										selectedProductIndex = getProductIndex(x);

	// 										document.getElementById('txtProductName1').value=products[selectedProductIndex].Name;
	// 									 	document.getElementById('txtProductDesc1').value=products[selectedProductIndex].Desc;
	// 									 	document.getElementById('txtProductPrice1').value=products[selectedProductIndex].Price;
	// 									 	document.getElementById('txtProductQuantity1').value=products[selectedProductIndex].Quantity;

	// 										 //editProductDetails(selectedProductIndex,selectedCartProductIndex);
	// 									  }
	// 						     );
}

function insertBlankLine(targetElement)
{
	var br = document.createElement("br");
    targetElement.appendChild(br);
}

function getProductIndex(id) 
{
    for (var i = 0; i < products.length; i++) 
	{
        if (products[i].Id == id)
        {
        	return i;
        } 
			
    }
}

function sendData(objProduct)
{
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/addProduct");
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(objProduct));
}