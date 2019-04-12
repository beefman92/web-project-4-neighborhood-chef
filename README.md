# Neighborhood-Chef
## Description
This is the fourth project for Web Development course (CS5610) in Northeastern University, Silicon Valley (Spring 2019 semester). It is a home cuisine webstie. Many people here have their own home cuisines which have different flavor from those in restaurant. This website provide chances for people to sell their cuisines to others. Meteor is used for creating this website. In this website, after registeration and login, users can be both consumers (to buy cuisines from other users) and cooks (sell food to other users). As cooks, users can publish their home cuisines recipes which will be pinned on map (google map API), and wait for consumers to order them. As consumers, users can search food information, order food, buy and pick up when food are ready. Food information page: if users want to know details of food, they can also click the recipes and it will lead them to the food information page. Nutritionix API is used to get nutritional data for food in each recipes.

This project is made by [Yibo Zhao](http://18.144.2.153:8080/) and [Fang Hong](https://sososummer88.github.io/).

## Demo
You can visit our website https://neighborhood-chef.herokuapp.com/.

## Feature
For users:
   * Register and login
   * Sell home cuisines to consumers
   * Buy home cuisines from cooks
   * See all the home cuisines that are available on google map
   * get information of each available home cuisine, including price of the food, location where to pick, and nutritions of    recipe of food.
   * Have a personal page showing personal information

## Design of MongoDB
Collection Name：users  


| column | data type| description |
|-------|-----|------|
| _id | string | user id created by meteor |
| username | string | registered username |
| password | number | password for registration |
| address | string | user's address |
| latitude | number | google map -latitude |
| longitude | number | google map -longitude |
| phone | string | phone number of users |
| payment | string | payment information of user |
| profile_pic | string | url link of user's profile picture |
| gender | string | user's gender |

Collection Name：chefs  


| column | data type | description |
|-------|-----|------|
| _id | string | user id created by meteor, same as the _id in users table |
| name | string | name of chef |
| description | string | description of chef |
| address | string | address of chef |
| latitude | number | address latitude for chef |
| longitude | number | address longitude for chef |
| phone | string | chef's contact information |

Collection Name：orders  


| column | data type | description |
|-------|-----|------|
| _id | string | id of cuisine order, created by meteor |
| create_time | date | create time of cuisine order |
| end_time | date | end time o cuisine order |
| status | number | status of cuisine order |
| customer_id | string | customer's id of consumer who order the cuisine, same id as in users table |
| chef_id | string | chef's id of chef who order the cuisine, same id as in users table |
| recipe_id | string | recipe id |
| count | number | number of cuisine ordered |
| price | number | price of order |
| ready_time | date | available time for pick up cuisine |


Collection Name：recipes  


| column | data type | description |
|-------|-----|------|
| _id | string | id of recipe, same id as in the order table's recipe_id |
| chef_id | string | id of chef who creats the cuisine order, same id as in the user's table |
| name | string | cuisine's name |
| picture | string | url of picture of food |
| content | string | recipe content |
| nutrition | string | nutrition information of recipes, use API |
| price | string | price of order, same as the price in the orders table |
| available_time | date | available time of order |


Collection Name：recipe_comments


| column | data type | description |
|-------|-----|------|
| _id | string | id of food comment |
| content | string | comment content |
| time | date | time of the comment published |
| rating | number | rating of food |
| order_id | string | order Id, same as the id in orders table |
| recipe_id | string | recipe id, same as the id in the recipes table |

## Technology
During the development, we utilized following technologies
  * Meteor
  * Google API
  * Nutrition API
  * MongoDB
  * Accessibility
  
## Screenshots

### Homepage
![Alt text](./homepage.png?raw=true "HomePage")

### Chef Info Page
![Alt text](./chefInfo.png?raw=true "Chef Info")

### Login page
![Alt text](./login.png?raw=true "Log In")

### Sign Up page
![Alt text](./signup.png?raw=true "Sign up")

### Consumer Personal Page
![Alt text](./mypage.png?raw=true "My Page")

### Adding Recipe Page
![Alt text](./recipe.png?raw=true "Recipe")



## Link to the video Demonstration
https://www.youtube.com/watch?v=brNfguIqk6I&feature=youtu.be

Updated Video: https://www.youtube.com/watch?v=zC8MiJFN4po&feature=youtu.be

## Reference to the class with link:
For more information about the class, please go to this page:
http://johnguerra.co/classes/webDevelopment_spring_2019/

## Slide
https://docs.google.com/presentation/d/1UWd0qvlt9MY9uV4j7z96SZeh55RYE6FZQOQV-MbiL7c/edit#slide=id.p

## License
This repository is under MIT license.
