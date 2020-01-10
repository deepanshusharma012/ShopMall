var productId=1;
var products=[];
var selectedProductIndex=null;

function loadProducts()
{
	var xhttp = new XMLHttpRequest();

	xhttp.open("GET", "/loadProducts");
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();

	xhttp.addEventListener("load",function(res){                      //this is used instead of onreadystatechange...onreadystatechange will only be used when we need all stages like in bank req is send, is recieved, is analysed and so on!!....therefore we should use addEventListner-load instead!!
		console.log(JSON.parse(this.responseText).data);
		if(JSON.parse(this.responseText).status)
		{
			var arr = JSON.parse(this.responseText).data;

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

			console.log(products);
			console.log(max+" "+productId);

			productId=max+1;
		}
		else
		{
			alert('Something went wrong!!');
		}
	});
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
		var form = document.getElementById('file-form');
		var fileSelect = document.getElementById('myfile');

		var file = fileSelect.files[0];

		var formData = new FormData();
		formData.append('productPic',file);
		formData.append('Id',objProduct.Id);
		formData.append('Name',objProduct.Name);
		formData.append('Desc',objProduct.Desc);
		formData.append('Price',objProduct.Price);
		formData.append('Quantity',objProduct.Quantity);

		var xhr = new XMLHttpRequest();

		xhr.onload = function () {
		  	if (JSON.parse(this.responseText).status=="true") {
		    	
		    	objProduct.UrlImage =JSON.parse(this.responseText).productPicURL;
		    	products.push(objProduct);

				displayProducts(objProduct);

				$('#myModal').modal('hide')

			 	document.getElementById('txtProductName').value="";
			 	document.getElementById('txtProductDesc').value="";
			 	document.getElementById('txtProductPrice').value="";
			 	document.getElementById('txtProductQuantity').value="";
			 	document.getElementById('myfile').value="";

				productId++;
		  	} else {
		    	alert(JSON.parse(this.responseText).msg);
		  	}
		};

		xhr.open("POST", "/addProduct",true);
		xhr.send(formData);
	}
}

function editProduct()
{
	var objProduct = new Object();
	
	objProduct.Id = products[selectedProductIndex].Id;
 	objProduct.Name = document.getElementById("txtProductName1").value;
    objProduct.Desc = document.getElementById("txtProductDesc1").value;
	objProduct.Price = parseInt(document.getElementById("txtProductPrice1").value);
	objProduct.Quantity = parseInt(document.getElementById("txtProductQuantity1").value);
	objProduct.UrlImage = products[selectedProductIndex].UrlImage;

	if(inputValidate(objProduct))
	{
		sendData(objProduct,2);
		products[selectedProductIndex]=objProduct;
   		
   		var divId=products[selectedProductIndex].Id;
   		var childN =document.getElementById(divId).childNodes;

   		childN[1].innerHTML=products[selectedProductIndex].Name;
   		childN[3].innerHTML=products[selectedProductIndex].Desc;
   		childN[5].innerHTML="Rs. "+products[selectedProductIndex].Price;
   		childN[7].innerHTML="Quantity :- "+products[selectedProductIndex].Quantity;

	 	document.getElementById('txtProductName1').value="";
	 	document.getElementById('txtProductDesc1').value="";
	 	document.getElementById('txtProductPrice1').value="";
	 	document.getElementById('txtProductQuantity1').value="";
	}
}

function inputValidate(objProduct)
{
	var ProductNameRegex = /^[a-zA-Z0-9 ]*$/;
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
	divProduct.setAttribute("style", "border: 1px solid #94b8b8;text-align: center;width: 16vw;float:left;margin-right: 5vw;margin-left: 5vw;margin-bottom: 4vw;margin-top: 4vw;");

	var imgProduct = document.createElement("img");
	imgProduct.setAttribute("class","productImages");
	imgProduct.setAttribute("src",objProduct.UrlImage);
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
	lblProductDesc.setAttribute("style","width: 90%;word-wrap: break-word;");
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

    btnDelete.addEventListener("click",function(event)
									  {
										   var targetParent = event.target.parentNode;
										   selectedProductIndex = getProductIndex(parseInt(targetParent.id));

										   var obj = new Object();
										   obj.Id = parseInt(targetParent.id);
										   sendData(obj,3);
										   
										   products.splice(selectedProductIndex,1);
										   targetParent.parentNode.removeChild(targetParent);
									  }
							);

    btnAddButton.addEventListener("click", function(event)
											{
												 var x = parseInt(event.target.parentNode.id);
												 var selectedProductIndex = getProductIndex(x);
												 
												 addToCart(selectedProductIndex);
											}
								 );

	divListProducts.appendChild(divProduct);
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

function deleteAllProducts()
{
	var e = document.getElementById('divListProducts');

	var child = e.lastElementChild;  
        while (child) { 
            e.removeChild(child); 
            child = e.lastElementChild; 
        }
}

function searchData() 
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange=function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	
	    	var data = JSON.parse(this.responseText);
	    	if(data.Id!=null)
	    	{
	    		deleteAllProducts();
	    		displayProducts(data);
	    	}
	    	else
	    	{
	    		alert("No data found!!");
	    		document.getElementById('sname').value="";
	    	}
	    	
	    }
	};

	var product_name=document.getElementById('sname').value;
	xhttp.open("GET", "/productSearch?Name="+product_name);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

function addToCart(selectedProductIndex)
{
	if(products[selectedProductIndex].Quantity>0)
	{
		products[selectedProductIndex].Quantity=products[selectedProductIndex].Quantity-1;

		var objProduct = new Object();

		objProduct.userId="1";
		objProduct.productId=products[selectedProductIndex].Id;

		sendData(objProduct,4);

		var divId=products[selectedProductIndex].Id;
	    var childN =document.getElementById(divId).childNodes;
		childN[7].innerHTML="Quantity :- "+products[selectedProductIndex].Quantity;
	}
	else
	{
		alert("Item is sold out");
	}
}

function checkFileDetails() {
  	var fi = document.getElementById('myfile');
  	if (fi.files.length > 0) { 
  		for (var i = 0; i <= fi.files.length - 1; i++) {
        	var fileName, fileExtension;

        	fileName = fi.files.item(i).name;
        	fileExtension = fileName.replace(/^.*\./, '');

		    if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg') {
		    }
		    else {
		        alert("Please select correct Image.");
		    }
      	}
  	}
}

function sendData(objProduct,option)
{
	var xhttp = new XMLHttpRequest();				

	if(option==1)
	{
		xhttp.open("POST", "/addProduct");
	}
	else if(option==2)
	{
		xhttp.open("POST", "/editProduct");
	}
	else if(option==3)
	{
		xhttp.open("POST", "/deleteProduct");
	}
	else if(option==4)
	{
		xhttp.open("POST", "/addToCart");
	}

	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(objProduct));
}