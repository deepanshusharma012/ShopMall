var cartProducts=[];
var cartTotalBill=0;
var divSubtotal=document.getElementById("divSubtotal");
var divTotal=document.getElementById("divTotal");

function loadCart()
{
	var xhttp = new XMLHttpRequest();

	xhttp.open("GET", "/loadCartProducts");
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();

	xhttp.addEventListener("load",function(res){
		if(JSON.parse(this.responseText).status=="true")
		{
			var arr = JSON.parse(this.responseText).data.userCartProducts;
			if(arr){
				for(i=0;i<arr.length;i++)
				{
					cartProducts.push(arr[i]);
					getCartProducts(arr[i],updateCartTotalBill);
				}
			}
		}
		else
		{
			alert('Something went wrong!!');
		}
	});
}

function updateCartTotalBill(){
	var xhr = new XMLHttpRequest();
	var obj = new Object();
	obj.userId=1;
	obj.cartTotalBill=cartTotalBill;
	xhr.open("POST", "/updateCartTotalBill");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(obj));
}

function getCartProducts(objCartProduct,callback)
{
	var prodId=objCartProduct.productId;
	var prodQuantity=objCartProduct.productQuantity;

	var xhttp = new XMLHttpRequest();
	xhttp.addEventListener("load",function(res){
		if(JSON.parse(this.responseText).status=="true")
		{
			var obj = JSON.parse(this.responseText).data;

			displayCartProducts(obj,prodQuantity);
			cartTotalBill=cartTotalBill+(obj.Price*prodQuantity);

			divSubtotal.innerHTML="Rs. "+cartTotalBill;
			divTotal.innerHTML="Rs. "+cartTotalBill;

			callback();
		}
		else
		{
			var xhr = new XMLHttpRequest();
			var obj = new Object();
			obj.userId=1;
			obj.productId=prodId;
			xhr.open("POST", "/updateCartProducts");
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(JSON.stringify(obj));

			cartProducts.splice(cartProducts.length-1,1);
			//alert('Product is currently unavailable!!');			
		}
	});

	xhttp.open("GET", "/getProduct?Id="+prodId);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

function displayCartProducts(objProduct,objProductQuantity)
{
	var divCartProducts = document.getElementById('divCartProducts');

	var divProduct = document.createElement("div");
	divProduct.setAttribute("id", objProduct.Id);
	divProduct.setAttribute("class", "row");
	divProduct.setAttribute("style", "border-bottom: 1px solid #94b8b8;");

	//--------Image------------//
	var divImage = document.createElement("div");
	divImage.setAttribute("class", "col-xs-3");

	var imgProduct = document.createElement("img");
	imgProduct.setAttribute("class","cartProductImages");
	imgProduct.setAttribute("src",objProduct.UrlImage);
	divImage.appendChild(imgProduct);

	divProduct.appendChild(divImage);

	//---------Content--------//
	var divContent = document.createElement("div");
	divContent.setAttribute("class", "col-xs-9");
	divContent.setAttribute("style","float: left;margin-top: 1vw");

	var aProductName = document.createElement("a");
	aProductName.setAttribute("href","#");
	aProductName.setAttribute("id","productNameDisp");
	aProductName.setAttribute("style","margin-top: 1vw;");
	aProductName.innerHTML = objProduct.Name;
	divContent.appendChild(aProductName);

	var lblProductPrice = document.createElement("label");
	lblProductPrice.setAttribute("id","productAmountDisp");
	lblProductPrice.setAttribute("style","float: right;color: green;");
	lblProductPrice.innerHTML = "Rs "+objProduct.Price;
    divContent.appendChild(lblProductPrice);

    insertBlankLine(divContent);

    var lblProductDesc = document.createElement("label");
	lblProductDesc.setAttribute("id","productDescDisp");
	lblProductDesc.setAttribute("style","margin-top: 0.5vw;");
	lblProductDesc.innerHTML = objProduct.Desc;
    divContent.appendChild(lblProductDesc);
	
    insertBlankLine(divContent);

    var divQuantity = document.createElement("div");
	divQuantity.setAttribute("class", "product_quantity ml-lg-auto mr-lg-auto text-center");

	var spanQuantity = document.createElement("span");
	spanQuantity.setAttribute("class","product_text product_num");
	spanQuantity.setAttribute("id","product_quan_disp");
	spanQuantity.innerHTML = objProductQuantity;
	divQuantity.appendChild(spanQuantity);

	var spanQuantityMin = document.createElement("span");
	spanQuantityMin.setAttribute("class","qty_sub qty_button trans_200 text-center");
	spanQuantityMin.setAttribute("id","product_quan_minus");
	spanQuantityMin.innerHTML = "-";
	divQuantity.appendChild(spanQuantityMin);

	var spanQuantityPlus = document.createElement("span");
	spanQuantityPlus.setAttribute("class","qty_add qty_button trans_200 text-center");
	spanQuantityPlus.setAttribute("id","product_quan_plus");
	spanQuantityPlus.innerHTML = "+";
	divQuantity.appendChild(spanQuantityPlus);

	divContent.appendChild(divQuantity);

	var btnSave = document.createElement("button");
	btnSave.setAttribute("id","btnSave");
	btnSave.setAttribute("class","btn btn-warning");
	btnSave.setAttribute("style","margin-top: 1vw;float: left;");
	btnSave.innerHTML = "SAVE FOR LATER";
	divContent.appendChild(btnSave);

	var btnRemove = document.createElement("button");
	btnRemove.setAttribute("id","btnRemove");
	btnRemove.setAttribute("class","btn btn-danger");
	btnRemove.setAttribute("style","margin-top: 1vw;float: right;");
	btnRemove.innerHTML = "REMOVE";
	divContent.appendChild(btnRemove);

	divProduct.appendChild(divContent);

	divCartProducts.appendChild(divProduct);

	spanQuantityMin.addEventListener("click", function(event)
											{
												var obj=new Object();

												var x = parseInt(event.target.parentNode.parentNode.parentNode.id);

												obj.userId=1;
												obj.productId=x;
												obj.operation=1;

												var xhttp = new XMLHttpRequest();
												xhttp.addEventListener("load",function(res){
													if(JSON.parse(this.responseText).status=="true")
													{
														var childN = event.target.parentNode.childNodes;
														childN[0].innerHTML=parseInt(childN[0].innerHTML)-1;

														cartTotalBill=JSON.parse(this.responseText).data;
														divSubtotal.innerHTML="Rs. "+cartTotalBill;
														divTotal.innerHTML="Rs. "+cartTotalBill;
													}
													else
													{
														alert("Item Quantity reached it's min count");
													}
												});

												xhttp.open("POST", "/updateCart");
												xhttp.setRequestHeader("Content-Type", "application/json");
												xhttp.send(JSON.stringify(obj));
											}
								 );

	spanQuantityPlus.addEventListener("click", function(event)
											{
												var obj=new Object();

												var x = parseInt(event.target.parentNode.parentNode.parentNode.id);

												obj.userId=1;
												obj.productId=x;
												obj.operation=2;

												var xhttp = new XMLHttpRequest();
												xhttp.addEventListener("load",function(res){
													if(JSON.parse(this.responseText).status=="true")
													{
														var childN = event.target.parentNode.childNodes;
														childN[0].innerHTML=parseInt(childN[0].innerHTML)+1;

														cartTotalBill=JSON.parse(this.responseText).data;
														divSubtotal.innerHTML="Rs. "+cartTotalBill;
														divTotal.innerHTML="Rs. "+cartTotalBill;
													}
													else
													{
														alert('Item is no longer unavailable');
													}
												});

												xhttp.open("POST", "/updateCart");
												xhttp.setRequestHeader("Content-Type", "application/json");
												xhttp.send(JSON.stringify(obj));
											}
								 );

	btnSave.addEventListener("click", function(event)
											{
												alert("The item is saved for later!!");
											}
								 );

	btnRemove.addEventListener("click", function(event)
											{
												var obj=new Object();

												var targetParent = event.target.parentNode.parentNode;
												var x = parseInt(targetParent.id);
												var cartIndex = getCartIndex(x);

												obj.userId=1;
												obj.productId=x;
												obj.operation=3;

												var xhttp = new XMLHttpRequest();
												xhttp.addEventListener("load",function(res){
													if(JSON.parse(this.responseText).status=="true")
													{
														cartProducts.splice(cartIndex,1);
														targetParent.parentNode.removeChild(targetParent);

														cartTotalBill=JSON.parse(this.responseText).data;
														divSubtotal.innerHTML="Rs. "+cartTotalBill;
														divTotal.innerHTML="Rs. "+cartTotalBill;
													}
													else
													{
														alert('Item is no longer unavailable');
													}
												});

												xhttp.open("POST", "/updateCart");
												xhttp.setRequestHeader("Content-Type", "application/json");
												xhttp.send(JSON.stringify(obj));
											}
								 );

}

function insertBlankLine(targetElement)
{
	var br = document.createElement("br");
    targetElement.appendChild(br);
}

function getCartIndex(productId)
{
	for(i=0;i<cartProducts.length;i++)
	{
		if(cartProducts[i].productId==productId)
		{
			return i;
		}
	}
	return -1;	
}
