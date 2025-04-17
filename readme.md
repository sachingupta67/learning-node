# How to read the data from the body
- when we send data from postman or client to server/api in the body , in express can't express the body , we need to use middleware for that which can convert the body to json format.
- we need to use express.json() middleware for that.

# how to read cookies 
- need a middleware for that.
- we need to use cookie-parser middleware for that.
- it will parse the cookie and add it to the request object.

# JWT
- header.payload.signature
- header: algorithm and type
- payload: data (secret data will hide in token)
- signature: secret key + header + payload
- will use jsonwebtoken package for that.