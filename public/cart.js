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
		if(JSON.parse(this.responseText).status)
		{
			var arr = JSON.parse(this.responseText).data.userCartProducts;
			if(arr){
				for(i=0;i<arr.length;i++)
				{
					cartProducts.push(arr[i]);
					getCartProducts(arr[i]);
				}
			}
		}
		else
		{
			alert('Something went wrong!!');
		}
	});
}


function getCartProducts(objCartProduct)
{
	var prodId=objCartProduct.productId;
	var prodQuantity=objCartProduct.productQuantity;

	var xhttp = new XMLHttpRequest();
	xhttp.addEventListener("load",function(res){
		if(JSON.parse(this.responseText).status)
		{
			var obj = JSON.parse(this.responseText).data;

			displayCartProducts(obj,prodQuantity);
			cartTotalBill=cartTotalBill+(obj.Price*prodQuantity);

			divSubtotal.innerHTML="Rs. "+cartTotalBill;
			divTotal.innerHTML="Rs. "+cartTotalBill;
		}
		else
		{
			alert('Product is currently unavailable!!');

			
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
	imgProduct.setAttribute("src","img/8.jpg");
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
												
											}
								 );

	spanQuantityPlus.addEventListener("click", function(event)
											{

											}
								 );

	btnSave.addEventListener("click", function(event)
											{
												alert("The item is saved for later!!");
											}
								 );

	btnRemove.addEventListener("click", function(event)
											{
												
											}
								 );

}

function insertBlankLine(targetElement)
{
	var br = document.createElement("br");
    targetElement.appendChild(br);
}

