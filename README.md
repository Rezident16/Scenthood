## Contact Me:
[![LinkedIn](https://img.shields.io/badge/-linkedin-%230A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andreivorobev/)
[![Gmail](https://img.shields.io/badge/-gmail-%23EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:andrey.vorob1995@gmail.com)

## About
[Scenthood](https://scenthood.onrender.com/) is an e-commerce site specifically designed for buying and selling fragrances and is inspired by [Wayfair](https://www.wayfair.com/) and [Amazon](https://www.amazon.com/).

## Installation Instructions
### Backend
- Run `pipenv -r install requirements.txt` to install packages and dependencies
- Run `pip install email_validator` to install email validator
- Create a .env file (see .env.example for values)
- Local database records can be changed in the `app/seeds` directory
- In `pipenv shell`, `run flask db upgrade` and `flask seed all`
- To start server, run `flask run`
### Frontend
- In `/react-app` run `npm install` to install packages and dependencies
- Make sure to use node version 16 `nvm use 16`
- Run `npm start` to start React app

## Landing Page
![image](https://github.com/Rezident16/Scenthood/assets/137537436/a37e3d17-fc31-4e9a-9db8-e6beaa9f1e64)

## Technology Used
### Frameworks and Libraries
![Python](https://img.shields.io/badge/-Python-%233776AB?style=for-the-badge&logo=python&logoColor=white) 
![Flask](https://img.shields.io/badge/-Flask-%23000000?style=for-the-badge&logo=python&logoColor=white) 
![React](https://img.shields.io/badge/-React-%2361DAFB?style=for-the-badge&logo=react&logoColor=black) 
![Redux](https://img.shields.io/badge/-Redux-%23764ABC?style=for-the-badge&logo=react&logoColor=white) 
![CSS3](https://img.shields.io/badge/-CSS3-%231572B6?style=for-the-badge&logo=react&logoColor=white) 
![HTML5](https://img.shields.io/badge/-HTML5-%23E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-%232496ED?style=for-the-badge&logo=docker&logoColor=white)
![Javascript](https://img.shields.io/badge/-JavaScript-black?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

 ### Database:
 ![Postgres](https://img.shields.io/badge/-postgresql-%234169E1?style=for-the-badge&logo=javascript&logoColor=white)

 ### Hosting:
 ![Render](https://img.shields.io/badge/-render-%2346E3B7?style=for-the-badge&logo=render&logoColor=white)

 ## API Endpoints

### AUTH
| Endpoint                   | Method | Purpose                                                                                           | Response                                                   |
|----------------------------|--------|---------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| `/api/auth`                | GET    | Fetches user information upon the initial app load and subsequent refreshes.                     | Returns an object representing the current user if logged in. |
| `/api/auth/unauthorized`   | POST   | Handles cases where a protected route does not pass validations for the current user.             | Returns an object with an error property, an array with the value 'Unauthorized.' |
| `/api/auth/signup`         | POST   | Processes the creation of a new user by sending signup form data to the backend.                   | Returns an object representing the current user after successful login if account creation succeeds. |
| `/api/auth/login`          | POST   | Attempts to log in a user with the provided credentials.                                          | Returns an object representing the current user if validation succeeds. |
| `/api/auth/logout`         | POST   | Logs out the current user.                                                                        | Returns an object with the message 'User logged Out' if successful. |

### USERS
| Endpoint                           | Method | Purpose                                                    | Response                                                |
|------------------------------------|--------|------------------------------------------------------------|---------------------------------------------------------|
| `/api/users/:userId`               | GET    | Attempts to get the information of the user with a specific `userId`. | Returns an object with user information.               |
| `/api/users/:userId/orders/:orderId`| GET    | Attempts to get the information of the specific order (`orderId`) for a specific user (`userId`). | Returns an object with order details if user and order exist. |
| `/api/users/:userId/orders`         | GET    | Attempts to get the information of all orders for a specific user (`userId`). | Returns an array of order objects if the user exists.   |

### ITEMS
| Endpoint                             | Method | Purpose                                                                     | Response                                                          |
|--------------------------------------|--------|-----------------------------------------------------------------------------|-------------------------------------------------------------------|
| `/api/items`                         | GET    | Attempts to get all the items listed on Scenthood.                          | Returns an array of item objects.                                |
| `/api/items/:itemId`                 | GET    | Attempts to get the information for a specific item. | If the item exists, it returns an object with item details.               |
| `/api/items`                         | POST   | Attempts to create a new item. | If the request passes form validations, it returns an object with the new item details.         |
| `/api/items/:itemId`                 | POST   | Attempts to update the item. | If the item exists and the request passes form validations, it returns an object with the new item details. | 
| `/api/items/:itemId`                 | DELETE | Attempts to delete the item. | If the item exists and belongs to the user, it returns the object `{"status": "success"}`.        |
| `/api/items/:itemId/favorite`        | POST   | Attempts to add the item to the user's favorites. | If the user is logged in and the item exists, it returns the 'favorite' object. |
| `/api/favorites/:favId`              | DELETE | Attempts to unfavorite the item. | If the user is logged in and the item is favorited by the user, it removes the favorite and returns the object `{"status": "success"}`. |

### ORDERS
| Endpoint                                      | Method | Purpose                                                                                             | Response                                                          |
|-----------------------------------------------|--------|-----------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| `/api/orders`                                 | POST   | Attempts to create an order for a logged-in user. If the user is logged in and the request passes form validations, it creates a new order and new Order Products for each item in the order and returns an object with order details. | Returns an object with order details.                             |
| `/api/orders/:orderId/items/:itemId/reviews`  | POST   | Attempts to create a review for a specific item in a specific order. If the request passes form validations, it creates a new review and returns a review object. | Returns a review object.                                        |

### REVIEWS
| Endpoint                         | Method | Purpose                                                                                   | Response                                          |
|----------------------------------|--------|-------------------------------------------------------------------------------------------|---------------------------------------------------|
| `/api/reviews/:reviewId`         | POST   | Attempts to update an existing review. If the review belongs to a logged-in user and the request passes form validations, it updates the review and returns an object with review info. | Returns an object with updated review information. |
| `/api/reviews/:reviewId`         | DELETE | Attempts to delete the review. If the review belongs to the user, it deletes the review and returns an object `{"status": "success"}`. | Returns an object `{"status": "success"}`.        |


## Wiki links
+ [**Database Schema**](https://github.com/Rezident16/Scenthood/wiki/Database-layout)
+ [**Wireframe**](https://github.com/Rezident16/Scenthood/wiki/Wireframe)
+ [**User Stories**](https://github.com/Rezident16/Scenthood/wiki/User-Stories)
+ [**Backend API Endpoints**](https://github.com/Rezident16/Scenthood/wiki/API-Endpoints)



## Feature List
#### Left Hand Navigation that allows users to quickly filter items by brand, price, and availability:
   <br/>
   
![lefthand](https://github.com/Rezident16/Scenthood/assets/137537436/f04d686f-b75e-485d-93e5-82339e4a70de)

#### Search Bar allows users to quickly find the items they need by name or by brand:
   <br/>
   
![searchBar](https://github.com/Rezident16/Scenthood/assets/137537436/8803f8d7-8a4a-4c85-9cfe-75124e6ff013)


#### Cart utilizes local storage to keep it persistent:
  <br/>
  
![cart](https://github.com/Rezident16/Scenthood/assets/137537436/7c77f58c-006f-4a93-a06e-2703cd9c9e42)


#### Google Maps API to auto-populate the address:
  <br/>
  
![order](https://github.com/Rezident16/Scenthood/assets/137537436/30914ecf-5cf1-4275-9233-47324e7131ca)


## Future Implementations:
* Display OOS messaging on the item tiles on /items
* Allow users to discount their items
