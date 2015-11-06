# rsvp
RSVP to one of our events

To start (cross-domain needs to run on localhost:3000):
`python server.py`

To build:
```
npm install --save react react-dom babelify babel-preset-react babel-preset-es2015
browserify -t [ babelify --presets [ react es2015 ] ] main.js -o bundle.js
```

