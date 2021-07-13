# LOTTERY API
Lottery RESTful API

## Getting Started
IGMA provides a simple REST API to integrete our BTC lottery plataform

## Install

TODO install documentation

# Documentation

For make calls into API provides the endpoint

### Response structure

msgType: 0 : error, 1 : alert, 2 : error

response: message returned if exists, default is null

data: data returned if exists, default is null

## Public REST API

### Users [POST]

Ex: http://localhost:3000/users

Fields required: 

* string - email - length 60
* string - password - length none

### Users [POST] - Response

```
{
    "msgType": 1,
    "response": "E-mail exists",
    "data": null
}

or

{
    "msgType": 2,
    "response": "User created",
    "data": {
        "insertId": 122,
        "messageId": "<16d739df-4ed9-16e5-b071-1ff6e09f8c6a@igma.us>"
    }
}
```

### Users [GET]

Ex: http://localhost:3000/users/confirm/token

Token is valid for 1 hour

### Users [GET]

```
{
    "msgType": 1,
    "response": "Invalid token",
    "data": null
}

or

{
    "msgType": 1,
    "response": "User confirmed",
    "data": null
}

or

{
    "msgType": 1,
    "response": "Token deadline is over",
    "data": null
}
```

### Auth [POST]

Ex: http://localhost:3000/auth

Fields required: email, password

### Auth [POST] - Response

Token is valid 12 hours

```
{
    "msgType": 2,
    "response": null,
    "data": {
        "data": {
            "id": 2,
            "email": "uelssonrodrigues@gmail.com",
            "user_name": null,
            "level": 1
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibGV2ZWwiOjEsImlhdCI6MTU0MTk3ODA5MywiZXhwIjoxNTQxOTc4MTUzfQ.pgMOUXW13lWJdDIgLz4bwEvOxUoZQ-yVKs0FOxjbAlk"
    }
}
```

### Lotteries [GET]

Ex: http://localhost:3000/lotteries/id

### Lotteries [GET] - Reponse

```
{
    "msgType": 1,
    "response": "Lottery not found",
    "data": null
}

or

{
    "msgType": 2,
    "response": null,
    "data": [
        {
            "id": 10,
            "user_id": 1,
            "title": "Primera loteria",
            "description": null,
            "numbers_count": "0-50",
            "choice_numbers": 6,
            "temp_bets_sum": null,
            "lottery_day": 9466848000,
            "percent_lottery": 10.89,
            "percent_house": 10.35,
            "ticket_price": 100000000,
            "default_prize": 100000011,
            "result": null,
            "blocked": 0,
            "deleted": 0,
            "dt_created": "1543707549"
        }
    ]
}
```

### Lotteries [GET]

Filter parameters:

* &blocked=true or false
* &deleted=true or false
* &title=title

Ex: http://localhost:3000/lotteries/?page=1&limit=1

### Lotteries [GET] - Response

```
{
    "msgType": 2,
    "response": null,
    "data": [
        [
            {
                "id": 10,
                "user_id": 1,
                "title": "Primera loteria",
                "description": null,
                "numbers_count": "0-50",
                "choice_numbers": 6,
                "temp_bets_sum": null,
                "lottery_day": 9466848000,
                "percent_lottery": 10.89,
                "percent_house": 10.35,
                "ticket_price": 100000000,
                "default_prize": 100000011,
                "result": null,
                "blocked": 0,
                "deleted": 0,
                "dt_created": "1543707549"
            }
        ],
        {
            "current": 1,
            "numbersOfPage": 3,
            "total": 3
        }
    ]
}
```

## Private REST API

### Users [GET]

Permission level: 2

Filter parameters:

* &blocked=true or false
* &deleted=true or false
* &email=email

Ex: http://localhost:3000/users/?page=1&limit=1

### Users [GET] - Response

```
{
    "msgType": 1,
    "response": "You not have permission for this",
    "data": null
}

or

{
    "msgType": 2,
    "response": null,
    "data": [
        [
            {
                "id": 1,
                "email": "uelssonrodrigues@gmail.com",
                "user_name": null,
                "account_checked": 1,
                "twofa_status": 0,
                "level": 2,
                "blocked": 0,
                "deleted": 0,
                "dt_created": 1541718840
            }
        ],
        {
            "current": 1,
            "numbersOfPage": 8,
            "total": 8
        }
    ]
}
```

### Users [DELETE]

Permission level: 1 or 2

Ex: http://localhost:3000/users/id

### Users [DELETE] - Response
```
{
    "msgType": 1,
    "response": "You not have permission for this",
    "data": null
}

or

{
    "msgType": 1,
    "response": "User not found",
    "data": null
}

or

{
    "msgType": 1,
    "response": "User has gone",
    "data": null
}

or

{
    "msgType": 2,
    "response": "User deleted",
    "data": null
}
```

### Users [PUT]

Permission level: 1 or 2

Ex: http://localhost:3000/users/id

### Users [PUT] - Response

```
{
    "msgType": 1,
    "response": "You not have permission for this",
    "data": null
}

or

{
    "msgType": 1,
    "response": "No changes for this user",
    "data": null
}

or (try update User using existing email)

{
    "msgType": 1,
    "response": "E-mail exists",
    "data": null
}

or

{
    "msgType": 2,
    "response": "User updated",
    "data": null
}
```

### Lotteries [POST]

Permission level: 2

Ex: http://localhost:3000/lotteries

Fields required:

* string - description - length 50
* string - numbers_count - length 7
* integer - choice_numbers - length 3
* integer - lottery_day - length 13
* float - percent_lottery length 5,2
* float - percent_house length 5,2
* integer - ticket_price - length 20
* integer - default_prize - length 20
* integer - blocked - length 1
* integer - dt_created - length 13

### Lotteries [POST] - Response

```
{
    "msgType": 1,
    "response": "You not have permission for this",
    "data": null
}

or

{
    "msgType": 2,
    "response": null,
    "data": {
        "insertId": 11
    }
}
```

### Lotteries [DELETE]

Permission level: 2

Ex: http://localhost:3000/lotteries/id

### Lotteries [DELETE] - Response

```
{
    "msgType": 1,
    "response": "You not have permission for this",
    "data": null
}

or

{
    "msgType": 1,
    "response": "Lottery has dependency, and not be deleted",
    "data": null
}

or

{
    "msgType": 1,
    "response": "Lottery has gone",
    "data": null
}

or

{
    "msgType": 1,
    "response": "Lottery not found",
    "data": null
}

or

{
    "msgType": 2,
    "response": "Lottery deleted",
    "data": null
}
```