const uploadButton = document.getElementById("upload-button");
const uploadFile = document.getElementById("photo");
const buttonText = document.getElementById("default-text");
const imageSubtitle = document.getElementById("image-subtitle");
const objectsBrandsHeader = document.getElementById("objectsBrandsHeader");
const productRecommendationHeader = document.getElementById("productRecommendationHeader");
const imageDiv = document.getElementById("uploaded-image");


uploadButton.addEventListener("click", function() {
    uploadFile.click();
});

uploadFile.addEventListener("change", function() {
    if (uploadFile.value) {
        buttonText.innerHTML = "File Uploaded Successfully";
        imageSubtitle.hidden = "";
    } else {
        buttonText.innerHTML = "File Failed To Upload";
    }
});

function showHeaders() {
    objectsBrandsHeader.style.hidden="false";
    productRecommendationHeader.style.hidden="false";
    imageDiv.style.hidden="false";
}

function show_image(src, width, height, alt) {
    var img = document.createElement("img");
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;

    // This next line will just add it to the <body> tag
    document.body.appendChild(img);
}

var loadFile = function(event) {
	var image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
};

async function handle(event) {
    var imageForm = document.getElementById("image-form");
    console.log("submitting...")
    event.preventDefault();
    
    var payload = new FormData(imageForm);
    console.log(payload);

    const resp = await fetch("https://azurevision.azurewebsites.net/api/azureVision?code=yVKzB4jA3hXM4Rm6LRsZFjL4q0YzwOE6tSHm1RVxq8NPl0Xb8hdx2A==", {
        method: "POST",
        body: payload,
    });
    
    var data = await resp.json();
    console.log(data);

    var object = data.result.objects[0];
    var brand = data.result.brands[0];

    var resultString = `
    <p> Objects: ${object.object}</p>
    <p> Brands: ${brand.name}</p>
    `
    $("#objects-brands").html(resultString);

    var productDescription = data.amazonResults;

    var productDescriptionArray = productDescription.map(x => {
        var returnString = `
            <h4>${x.productDescription}<h4>
            <p><img src="${x.imgUrl}"></p>
            <p>Price : $${x.price}<p>
            <p> Product Rating: ${x.productRating} </p>
        `;
    
        return returnString;
    });

    var productDescriptionString = productDescriptionArray.join("<br/> ");

    $("#amazon-results").html(productDescriptionString);
    
    
    var amazonResultString = `
    
    <h3>Products On Amazon</h3>
    <p> Product Description: </p>
    <p> Image: </p>
    <p> Price: </p>
    <p> Product Rating: </p>

    `
}