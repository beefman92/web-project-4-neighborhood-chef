# Neighborhood-Chef
## Description
This is the fourth project for Web Development course (CS5610) in Northeastern University, Silicon Valley (Spring 2019 semester). It is a home cuisine webstie. Many people here have their own home cuisines which have different flavor from those in restaurant. This website provide chances for people to sell their cuisines to others. Meteor is used for creating this website. In this website, after registeration and login, users can be both consumers (to buy cuisines from other users) and cooks (sell food to other users). As cooks, users can publish their home cuisines recipes which will be pinned on map (google map API), and wait for consumers to order them. As consumers, users can search food information, order food, buy and pick up when food are ready. Food information page: if users want to know details of food, they can also click the recipes and it will lead them to the food information page. Nutritionix API is used to get nutritional data for food in each recipes.

This project is made by [Yibo Zhao](http://18.144.2.153:8080/) and [Fang Hong](https://sososummer88.github.io/).

## Demo
You can visit our website here.

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
| _id | string | meteor自动生成 |
| username | string | 用户名，同样是用户的唯一标识 |
| password | number | 用户注册时的密码 |
| address | string | 用户的地址 |
| latitude | number | 维度 |
| longitude | number | 经度 |
| phone | string | 用户的联系电话 |
| payment | string | 用户的账户信息 |
| profile_pic | string | 用户的头像的url |
| gender | string | 用户的性别 |

Collection Name：chefs  


| column | data type | description |
|-------|-----|------|
| _id | string | 对应于users中的_id字段 |
| name | string | 厨师昵称 |
| description | string | 厨师的简介 |
| address | string | 厨师地址 |
| latitude | number | 维度 |
| longitude | number | 经度 |
| phone | string | 厨师联系电话 |

Collection Name：orders  


| column | data type | description |
|-------|-----|------|
| _id | string | 订单的id， meteor自动生成 |
| create_time | date | 订单创建的时间 |
| end_time | date | 订单结束的时间 |
| status | number | 订单当前的状态 |
| customer_id | string | 下订单用户的id, 和Users表中的id一致 |
| chef_id | string | 创建订单用户的id, 和Users表中的id一致 |
| recipe_id | string | 订单配料表的id |
| count | number | 订单的数量 |
| price | number | 订单的价格 |
| ready_time | date | 订单可取时间 |


Collection Name：recipes  


| column | data type | description |
|-------|-----|------|
| _id | string | 备料表的id, 和Order表中的recipe_id一致 |
| chef_id | string | 创建订单用户的id, 和users表中的id一致 |
| name | string | 菜名 |
| picture | string | 配图片的url |
| content | string | order 配料的具体内容 |
| nutrition | string | 每份配料的营养成分，调用API |
| price | string | 订单的价格， 和orders表中的价格一致 |
| available_time | date | 订单有效的时间范围 |


Collection Name：recipe_comments


| column | data type | description |
|-------|-----|------|
| _id | string | 评价食物id |
| content | string | 评价的具体内容 |
| time | date | 评价的时间 |
| rating | number | 对食物的评分 |
| order_id | string | 订单的id, 和orders 表中的id 一致 |
| recipe_id | string | 备料表的id, 和 recipes 表中的id一致 |
