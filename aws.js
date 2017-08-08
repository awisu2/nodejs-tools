"use strict";

let aws = {
    lambda: {
        response: {
            create: function(statusCode, body, headers){
                return {
                    statusCode: statusCode,
                    headers   : headers,
                    body      : JSON.stringify(body),
                };
            },
            custom: function(statusCode, body, headers, options){
                if(!headers) headers = {};
                if(!body)    body    = {};

                options = aws.lambda.response.options.init(options);
                if(options.isCors) headers = Object.assign(headers, aws.lambda.header.cors);

                return aws.lambda.response.create(statusCode, body, headers);
            },
            success: function(body, headers, options){
                return aws.lambda.response.custom(200, body, headers, options);
            },
            error: function(body, headers, options){
                return aws.lambda.response.custom(500, body, headers, options);
            },
            options: {
                init: function(options){
                    if(typeof options != "object") options = {};
                    if(!("isCors" in options)) options.isCors = true;
                    return options;
                },
            },
        },
        header: {
            cors: {
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Methods": 'GET, POST, OPTIONS, PUT, DELETE',
            },
        },
        event: {
            get: {
                parameters: function(event) {
                    let method = aws.lambda.event.get.httpMethod(event);
                    if(method == "GET") {
                        return event["queryStringParameters"];
                    } else {
                        let params = {};
                        if(event["body"]) {
                            let bodies = event["body"].split("&");
                            for(let k in bodies){
                                let param = bodies[k].split("=");
                                if(param.length != 2) continue;
                                params[param[0]] = param[1];
                            }
                        }
                        return params;
                    }
                },
                httpMethod: function(event) {
                    return event["httpMethod"];
                },
            },
        },
        test: {
            local: function(tests, options){
                if(typeof options == "undefined") options = {};

                // set path
                if(options.path) {
                    process.env.NODE_PATH = ("NODE_PATH" in process.env && process.env)
                        ? process.env.NODE_PATH + ";" + options.path: options.path;
                    require('module')._initPaths();
                }

                // get test
                let names = options.names;
                if(typeof names != "object") names = [];
                if (names.length === 0) {
                    if(tests && typeof tests == "object") {
                        console.log("please choose any test");
                        for(let k in tests) {
                            console.log("- "+k);
                        }
                    }
                    return;
                }
                let isAll = names.includes("all");

                // test
                function test(names, isAll){
                    let count = 0;
                    for(let k in tests) {
                        if (isAll || names.includes(k)) {
                            count = count + 1;
                            console.log("testing " + k + "::");
                            let test = tests[k];

                            if(options.def) {
                                for(let k in options.def){
                                    if(!(k in test)) {
                                        test[k] = options.def[k];
                                    }
                                }
                            }

                            let _module = require(test.file);
                            _module[test.function](test.event, test.context, test.callback);
                        }
                    }
                    console.log("execute " + count + " tests.");
                }
                test(names, isAll);
            },
            def: {
                file: "index",
                function: "handler",
                event: [],
                context: {},
                callback: function(err, data){
                    if(err){
                        console.log("ERROR\n", err);
                    } else {
                        console.log(data);
                    }
                },
            },
        },
    },
};

if(typeof exports != 'undefined') for(let k in aws) exports[k] = aws[k];