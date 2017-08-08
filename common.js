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
        get: (index)=>{
            if(common.is.undefined(index)) return process.argv.slice(2);
            return common.object.val(process.argv, 2+index, undefined);
        }
    },
    uri: {
        query: {
            parse: (query)=>{
                if(!query || typeof(query) != "string") return {};

                let params = {};
                let queries = query.split("&");
                const _decode = decodeURIComponent;
                for(let i in queries) {
                    let param = queries[i].split("=");
                    if(param.length < 2) continue;
                    params[_decode(param[0])] = _decode(param[1]);
                }
                return params;
            },
            encode: (obj)=>{
                let query = "";
                const _encode = encodeURIComponent;
                for(let k in obj) {
                    if(query) query = query + "&";
                    query = query + _encode(k) + "=" + _encode(obj[k]);
                }
                return query;
            }
        },
        
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
    is: {
        undefined: (v)=>{
            return typeof(v) == "undefined";
        },
        number: (v)=>{
            let type = typeof(v);
            if (type != "number" && type != "string") return true;
            return v == parseFloat(v) && isFinite(v);
        },
        exists: (v)=>{
            if(!v) return false;
            return typeof(v) != "object" ||  Object.keys(v).length !== 0;
        }        
    },
};

if(typeof exports != 'undefined') for(let k in common) exports[k] = common[k];

