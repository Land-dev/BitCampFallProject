# Using Machine Learning APIs to Help Users Find Product Recommendations 

Many people have issues finding things they want to buy, and where they can get the best price and quality product. You have to scour the web, look on thousands of different websites, both review and shopping sites, and figure out which item to buy, and where to buy it from.



I'm Ryan Teoh, a junior at Milpitas High School in California, and I have built an web app to solve this problem. All users have to do is upload an image of an item to the website, and then the machine learning algorithms and Amazon Data Service API return various similar products the user might be interested in buying, along with information about each product.

## Product Flowchart:

![image-20201118212526704](C:\Users\ryan\AppData\Roaming\Typora\typora-user-images\image-20201118212526704.png)

The way my web app works is easily described by the above flowchart. First, a user uploads their image of an item, for example a Cannondale mountain bike. Then, the webpage sends the image to Azure Functions, which acts as the hub for HTTP requests. Using a GET/POST request, Azure Functions then sends the image to Microsoft's Computer Vision API, a machine learning algorithm that scans the image and returns the objects and brands detected. These objects and brands are then used as keywords, and sent to the Amazon Data Service API, which return various product recommendations the user may be interested in. 

There will be two parts of this tutorial, one for the coding of the Azure Functions HTTP request, and another for the coding of the webpage in order to call the Azure Functions HTTP request correctly. 

## Requirements

In order to replicate this project, first you will need an Azure Functions subscription, Amazon Data Service API subscription, and the basic VS code setup that allows you to create a local server to test your website. You don't necessarily have to get the Amazon Data Service API, you can get a similar API, such as the Walmart Data Service API instead, if you want to pull from the Walmart database instead of Amazon's. I will just be using Amazon because of the popularity and number of products on the website.  Both the Azure Functions subscription and the Amazon Data Service API subscription are free to an extent. If you call the Azure Function or Amazon Data Service API too many times, you will be charged for that, so keep that in mind.  

## Coding the Webpage

![image-20201118214538177](C:\Users\ryan\AppData\Roaming\Typora\typora-user-images\image-20201118214538177.png)

I won't be going over how to create the entire webpage, as most of it is HTML and CSS styling, which you can learn anywhere.

First, you will create a form in HTML to hold the the image uploaded, which you will send to Azure Functions.

#### HTML Form

<script src="https://gist.github.com/Land-dev/b550266eeaa3d74af2d97cd6fe0409a8.js"></script>

If you notice, the function handle(event) and loadFile(event) are called. Handle(event) is what sends the form to Azure Functions, and loadFile(event) just displays the image uploaded for reference. I will not go into how loadFile(event) works, that is just for UI purposes.

### How to call the Azure Function

<script src="https://gist.github.com/Land-dev/d58776397e864b0abcbc3eb67f9b04a4.js"></script>

Next, we will create the handle(event) function in the Javascript file. First, we identify the form we just made, and turn it into our payload that we will send to the Azure Function. Then, we will use a post method to call our HTTP request in Azure Functions, which I titled AzureVision. You will need to input a code in order to access the function. Your function will have a different name and code, so on line 9 replace the string I have with the URL of your function and code to access it. You will be able to find the code in the App keys settings tab, and the URL in the overview tab when you open up the function app in the Azure dashboard. 

Then, we store all the returned info in to various variables. The info is then converted into strings, and put into the html using div elements you will want to create to store all the data. In my case, those divs are amazon-results and objects-brands.

## Azure Function

![image-20201119115722145](C:\Users\ryan\AppData\Roaming\Typora\typora-user-images\image-20201119115722145.png)

First, create a cognitive service that uses the computerVision machine learning API by Microsoft. 

Then, create a function app which will hold your actual Azure Function.

The other resources I have created are not necessary, they are just helpful for me to monitor what went wrong if my function executed improperly.

<script src="https://gist.github.com/Land-dev/d5d4ed8125ea2d86b694c49144f67efc.js"></script>

Now lets start on the Azure Function itself. You'll need to first use node.js as the runtime environment when creating the function. Afterwards, you need to go to the console of your function app and install NPM parse-multipart by typing in npm install parse-multipart. This allows you to receive more complex forms, such as the image form we are using. 

In addition, put in your key to access your cognitive service and ComputerVisionClient. I just have a placeholder string where you should put your key.

### Async Function

<script src="https://gist.github.com/Land-dev/d12d946a45f5f4a51af3fecca319e4a7.js"></script>

This function will call both the Computer Vision API and Amazon Data Service API and return the results, using the functions analyzeActualImage for the Computer Vision API and getAmazonAPI respectively.

#### Analyze Image using Computer Vision API

<script src="https://gist.github.com/Land-dev/92e492b652965d7868a7dd6af0b86d97.js"></script>

#### Get Product Recommendations using Amazon Data Service API

<script src="https://gist.github.com/Land-dev/e5469f7c106580d942b24e5d093ca736.js"></script>

You will need to put in various subscription keys for both functions, your ComputerVision key for analyzing the image and your Amazon API key for getting product recommendations.

## Finishing the web app

![Alt Text](https://media.giphy.com/media/VLTB3bpeVK98rpOU6b/giphy.gif)

Once you have created the Azure Function and implemented the Javascript and HTML code, you should be all set!

If you want your website to be run on the web and not locally, you will have to purchase a domain to do that. Other than that, you are good to go. Congratulations, you've done it! Machine learning, HTTP requests, and API usage are all very challenging, but I hope this guide has really helped you out in this journey.

