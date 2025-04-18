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

# when your DB grow , then query will slow down.
- Solution : one of popular solution we can do is indexing on certain fields.
- example 
    - search query - means find , lets say we have 1 million user records ,we have many person with same name, so we can 
                     create index on name field.
- in mongo , if we have 'unique:true' in schema, then it will create index on that field automatically.
- in mongo, if we have 'index:true' in schema, then it will create index on that field automatically.


# Compound Index
- example : ConnectionRequest.find({senderId:req.user._id, receiverId:req.params.userId}) 
- for making this fast we need to apply index on both fields otherwise it will be slow 
```
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
// 1 means ascending order, -1 means descending order
// unique: true means we can't have same fromUserId and toUserId combination

```

# If Index make fast , then why we should not to use in every fields
- because index will take more space in DB.
- if we have 1 million records, then index will take 1 million records space in DB.