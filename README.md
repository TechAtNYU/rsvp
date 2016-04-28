# rsvp
RSVP to one of our events

To start: <br>
```bash
npm run build
npm run serve
```

For development: <br>
```bash
npm start
```


## Read this if you are writing code for T@NYU
To compile React code, we use webpack, babel, es2015, and hot-reload (amongst other fancy, new JS libraries). We use Redux to manage the states in a global store.


If you have __no experience with React__, go do the Facebook React [Get Started](https://facebook.github.io/react) guide. It is a very good guide that teaches you about the absolute fundamentals.


If you have __some experience with React__ but __not with Redux__, then go watch Dan Abramov's (creator of Redux) [Redux videos](https://egghead.io/series/getting-started-with-redux) on Egghead.io. There are ~10 of them. Each is like 2 minutes long. You will be glad that you did.


I also strongly suggest you to go read Airbnb's [javascript style guide](https://github.com/airbnb/javascript/tree/master/react) section on stateless vs. stateful components. 



In this repo:
- Stateless components are in `/components`
- Stateful components are in `/containers`



## Suggestions for the future
- refactor actions, reducers, and reducer constants into individual files
- add more fields into Profile


## Some history if you are interested
RSVP came about in Fall 2015 along with Check-in to solve the following pain points Tech@NYU was having when we were primarily using Facebook to collect RSVPs/Attending:
- Facebook RSVPS to physically Attending conversion rate was painfully low
- Hard to track attendee patterns since we can't tell how many attendees are recurring
- No way to collect N-numbers for OrgSync, a source of revenue for Tech@NYU
- Hard for us to email out individual confirmation/feedback/correspondence

