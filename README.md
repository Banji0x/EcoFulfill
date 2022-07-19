SETUP

1. Download repository from github
2. Unzip the folder and open in vscode
3. Run 'npm install' in terminal to install all dependencies
4. Download mongoDB compass and setup
5. Create a new database
6. create a .env file and set enviroment variables using the .env example

RUNNING SERVER

1. Run 'npm run server' in terminal to start project

ROUTES

1. Authentication
   1. Route for new users to register
   Route: `/api/auth/register`
   GET -> Registration page
   POST -> Valid inputs are name,email,gender,password,role
   2. Route for users to login
   Route: `/api/auth/login`
   GET -> Login page
   POST -> Valid inputs are name,password
   3. Route for logged in users to logout
   Route: `/api/auth/logout`
   GET -> Logout user
   4. Route for logged in users to delete account
   Route: `/api/auth/delete`
   DELETE -> delete logged in user account

2. Buyer
   1. Route to get all sellers
   Route: `/api/buyer/list-of-sellers`
   GET -> get all seller's names and email addresses
   2. Route to get all catalogs
   Route: `/api/buyer/catalogs`
   GET -> get all available catalogs
   3. Route to get a seller's catalog
   Route: `/api/buyer/seller-catalog/:sellerId`
   GET -> get a seller's catalog using his/her id
   4. Route to retrieve buyer's cart
   Route: `/api/buyer/cart`
   GET -> get the cart of the buyer currently logged in
   5. Route to add products to cart
   Route: `/api/buyer/create-cart/:sellerId`
   POST -> valid inputs are productId,quantity
   6. Route to update buyer's cart
   Route: `/api/buyer/cart/update`
   PATCH -> update the quantity of product in cart
   valid inputs are productId,quantity
   7. Route to delete products in buyer's cart'
   Route: `/api/buyer/cart/:productId`
   DELETE -> delete products already in buyer's cart using a productId
   8. Route for buyer to drop his/her cart
   Route: `/api/buyer/delete-cart`
   DELETE -> delete an exisiting cart
   9. Route to get the list of products ordered
   Route: `/api/buyer/orders`
   GET -> get orders
   10. Route to checkout products already added in cart
   Route: `/api/buyer/push-orders`
   POST -> checkout products already added to cart
   11. Route to create new orders with a seller using seller's id.
   Route: `/api/buyer/create-order/:sellerId`
   POST -> Valid inputs are sellerId,the product id or product name and quantity
   12. Route to cancel a product purchase
   Route: `/api/buyer/orders/:sellerId/:productId`
   DELETE -> delete a product from orders using the sellerId and productId
   13. Route to cancel all products purchase from a seller
   Route: `/api/buyer/orders/:sellerId`
   DELETE -> delete the order document associated with the buyer and seller
   14. Route to cancel all products purchase from all sellers
   Route: `/api/buyer/cancel-orders`
   DELETE -> delete the order document associated with the buyer

3. Seller
   1. Route for seller to get his/her catalog
   Route: `/api/seller/catalog`
   GET -> get the catalog associated with the seller
   2. Route to get orders
   Route: `/api/seller/orders`
   GET -> get the list of products ordered
   4. Route for seller to add products to a new/existing catalog
   Route: `/api/seller/create-catalog`
   POST -> valid inputs are: name,quantity,price,category,description
   4. Route to update a product
   Route: `/api/seller/catalog/:productId`
   PATCH -> update a product name||quantity||price||category||description
   5. Route to delete a product from seller's catalog
   Route: `/api/seller/catalog/:productId`
   DELETE -> delete a product from seller's catalog using the the product id
   6. Route to delete catalog
   Route: `/api/seller/delete-catalog`
   DELETE -> delete catalog document

DEPENDENCIES

1. argon2 -> to hash users password before storing in database
2. cookie-parser -> middleware to work with cookies easier
3. dotenv -> to set environment variables
4. express -> to write functional API's
5. express-validator -> to sanitize user's inputs
6. jsonwebtoken -> to sign user credentials using a secure algorithm and provide a means for server to identify users
7. mongoose -> for managing relationships and modeling
8. nodemon -> to keep our server running by restarting it whenever a change is detected

Thanks for reading.
