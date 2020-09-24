# Fetch Rewards Take-home

A service that takes a list of email address and returns an integer indicating the number of valid email addresses. Gmail account matching will be taken into consideration.

Specifically: Gmail will ignore the placement of "." in the username. And it will ignore any portion of the username after a "+".

## Set up

1. Clone this repository to your local machine
2. `cd` into the cloned repository
3. Install the node dependencies `npm install`

## Scripts

Start the application `npm start`

Run the tests `npm test`

## Service

Default: http://localhost:8000

**GET /email**

Takes a list of email address and returns an integer indicating the number of valid email addresses.

### Input

Takes a JSON body with the key "emails" whose corrisponding value is an array of strings.
```
{
  "emails": [
    "nicktho@gmaik.com",
    "nick.tho+rpe@gmaik.com",
    "nick.thorpe@gmail.com",
    "nickthorpe@gmail.com",
    "te.st+spam@gmail.com", 
    "test@gmail.com", 
    "test@test.com"]
}
```
### Output

Returns a JSON object with the key "count" whose corrisponding value is an integer.
```
{
  "count": 5
}
```
