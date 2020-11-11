'use strict';
var multipart = require("parse-multipart");
var fetch = require("node-fetch");
var axios = require("axios").default;

const async = require('async');
const fs = require('fs');
const https = require('https');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

const key = "put key here";
const endpoint = "https://visionbitcamp.cognitiveservices.azure.com/";

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

// function computerVision() {
//   async.series([
//     async function () {
        
// // Image of a dog
// const objectURL = 'https://images.offerup.com/5jJnVfLtgybi1mn11BlvmyVcV4k=/600x450/175a/175abee99f1a4ddda1da122daebdaaec.jpg';

// // Analyze a URL image
// console.log('Analyzing objects in image...', objectURL.split('/').pop());
// const objects = (await computerVisionClient.analyzeImage(objectURL, { visualFeatures: ['Objects'] })).objects;
// console.log();

// // Print objects bounding box and confidence
// if (objects.length) {
//   console.log(`${objects.length} object${objects.length == 1 ? '' : 's'} found:`);
//   for (const obj of objects) { console.log(`    ${obj.object} (${obj.confidence.toFixed(2)}) at ${formatRectObjects(obj.rectangle)}`); }
// } else { console.log('No objects found.'); }

// const brandURLImage = 'https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/images/red-shirt-logo.jpg';

// // Analyze URL image
// console.log('Analyzing brands in image...', brandURLImage.split('/').pop());
// const brands = (await computerVisionClient.analyzeImage(brandURLImage, { visualFeatures: ['Brands'] })).brands;

// // Print the brands found
// if (brands.length) {
//   console.log(`${brands.length} brand${brands.length != 1 ? 's' : ''} found:`);
//   for (const brand of brands) {
//     console.log(`    ${brand.name} (${brand.confidence.toFixed(2)} confidence)`);
//   }
// } else { console.log(`No brands found.`); }
//         },
//     function () {
//       return new Promise((resolve) => {
//         resolve();
//       })
//     }
//   ], (err) => {
//     throw (err);
//   });
// }
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.'); 
    const brandURLImage = 'https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/images/red-shirt-logo.jpg';

    // Analyze URL image
    console.log('Analyzing brands in image...', brandURLImage.split('/').pop());
    const brands = (await computerVisionClient.analyzeImage(brandURLImage, { visualFeatures: ['Brands'] })).brands;

    var boundary = multipart.getBoundary(req.headers['content-type']);
    // parse the body
    var parts = multipart.Parse(req.body, boundary);

    context.log(parts.length)
    context.log(parts[0])
    
    //analyze the image
    var result = await analyzeActualImage(parts[0].data);
    context.log(result)
    var keyword = result.objects[0].object + " " + result.brands[0].name;
    context.log(keyword)
    var amazonResults = await getAmazonAPI(keyword);
    context.log(amazonResults)

    context.res = {
        body: {
            "result":result, 
            "amazonResults":amazonResults
        }
    };
    context.done(); 

};

async function analyzeActualImage(byteArray){
    
    const subscriptionKey = 'put key here';
    // endpoint = os.Getenv("COMPUTER_VISION_ENDPOINT")
    const uriBase = "endpoint" + "vision/v3.1/analyze"
    const objects = (await computerVisionClient.analyzeImageInStream(byteArray, { visualFeatures: ['Objects'] })).objects;
    const brands = (await computerVisionClient.analyzeImageInStream(byteArray, { visualFeatures: ['Brands'] })).brands;


    let data = {objects:objects, brands:brands};
    
    return data; 
}

async function getAmazonAPI(keyword) {

var options = {
  method: 'GET',
  url: 'https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-search-by-keyword-asin',
  params: {domainCode: 'com', keyword: keyword, page: '1', sortBy: 'relevanceblender'},
  headers: {
    'x-rapidapi-key': 'put key here',
    'x-rapidapi-host': 'axesso-axesso-amazon-data-service-v1.p.rapidapi.com'
  }
};

const amazonResults = await axios.request(options);
const productDetails = amazonResults.data["searchProductDetails"].slice(0,10);
return productDetails;

}