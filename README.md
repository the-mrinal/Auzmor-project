# Backend Server Assignment

I made this project using `'node.js'` .In this project there are two API endpoints.

**Authorization**
As we need to make sure the user of these API are verified and authenticated 
we added a third API endpoint :
`'/login'`
using this user can login by his username and auth_id / password
and then a token is generated.
The user should use that token(as headers) to verify its identity while making each API Calls :

> Authorization : <  token value >

**API Endpoints**
`'/inbound/sms'` **for recieving sms from other numbers**
>Method : POST
>Parameters[payload]: 
>
	{"from":"83478437437","to":"236732632","text":"hello"}
>Parameters[headers]:
>
	{"Authorization":"<  token value >","Content-Type":"application/json"}

`'/outbound/sms'` **for sending sms out to other numbers**
>Method : POST
>Parameters[payload]: 
>
	{"from":"83478437437","to":"236732632","text":"hello"}
>Parameters[headers]:
>
	{"Authorization":"<  token value >","Content-Type":"application/json"}

**Setup to install and run this project in your machine**

> Pre-requisites:[ \[nodejs\](https://nodejs.org/en/download/) \[version > 8\], npm \[version: 6.9 and above\]](https://nodejs.org/en/download/) 
> redis-cli and redis-server [ [windows](https://redislabs.com/ebook/appendix-a/a-3-installing-on-windows/a-3-2-installing-redis-on-window/) , [mac](http://jasdeep.ca/2012/05/installing-redis-on-mac-os-x/) , [linux](https://redis.io/topics/quickstart) ]

**Please Download and Check the pre-requisites before going ahead!**

>
	/>nodejs -version
if the response is coming something like `8.*.*` 
>
	/>npm -version
if the response is coming something like `6.*.*`
>
	/>redis-cli -v
if the response is coming something like `redis-cli 5.*.*`
>
	/>redis-server -v
if the response is coming something like `Redis server v=5.*.* sha=*** malloc=*** bits=64 build=****`

### If all the responses are coming like this then you are good to go! 

## Lets move ahead to project download and install part.

**Copy these commands to terminal or cmd**
>
	/>git clone https://github.com/getmrinal/Auzmor-project.git
>
	/>cd Auzmor-project
>
	Auzmor-project/>npm install
>this command will install all the package required to run this project

Now to test if its working as expected start the redis-server by
>
	/>redis-server
Now Move to project folder and run 
>
	Auzmor-project/> npm test
this will run all testcases /usecases of the api and PASS will come is all is correct.
> **Note:** Inside the project folder there is a 'db' folder inside that there is a
> index.js file,this file stores the database configuration for the project.
> before running the test you have to edit those configurations too.

You can also check it on POSTMAN by running node.js server
>
	Auzmor-project/> node server.js
	
And then Go to postman call the API's with correct parameters.

## Known Bugs

- If the `npm test` command doesn't pass all test-cases in first run due to async await timeout error! Run again it'll pass.
		
