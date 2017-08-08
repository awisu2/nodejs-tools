"use strict";

let common = {
    object: {
        val: function(object, key, def){
            if(object && key in object) return object[key];
            return def;
        },
    },
    sleep: function(ms) {
        var time = new Date().getTime();
        while (new Date().getTime() < time + ms);
        return;
    },
    arg: {
        node: ()=>{
            return process.argv[0];
        },
        current: ()=>{
            return process.argv[1];
        },
        get: function(index) {
            if(typeof index == "undefined") return process.argv.slice(2);
            return common.object.val(process.argv, 2+index, undefined);
        }
    },
    env: {
        addNodePath: (path)=>{
            if("NODE_PATH" in process.env && process.env) {
                process.env.NODE_PATH = process.env.NODE_PATH + ";" + path;
            } else {
                process.env.NODE_PATH = path;
            }
            require('module')._initPaths();
        },
    },
};

if(typeof exports != 'undefined') for(let k in common) exports[k] = common[k];

