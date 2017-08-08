# nodejs-tools

this is functions fot nodejs

## aws.js

### lambda

#### lambda local test

sample code

```
let awsTools = require("./node-tools/aws");
let lambda = awsTools.lambda;

// test settings
// key is test block name
let tests = {
    hello: {
        file: "handler",
        function: "hello",
    },
};

options = {
    name : "hello",
    def: {
        event: [],
        content: [],
        callback: function(err, data){
            console.log("err", err);
            console.log("data", data);
        },
    },
    path: __dirname,
};
lambda.test.local(tests, options);
```

