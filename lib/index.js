
(function(){
    var fields = ['href', 'hostname', 'pathname', 'protocol', 'port', 'hash', 'search'];
    function noop(){}

    /**
     * Validates a url
     * @see http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url
     * @param {String} str the url
     */
    function ValidURL(str) {
      // var urlpattern2 = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
      // return urlpattern2.test(str);
      return true;
    }

    function process(url){
        var urlObj, element;
        
        if (!url || !ValidURL(url)) return toggleError(true);

        element = document.createElement('a');
        element.href = url;

        urlObj = fields.reduce(function(obj, field){
            obj[field] = element[field];
            return obj;
        }, {});

        parseqs(element.search.substr(1), urlObj);

        doPrint(urlObj, undefined, 2);
    }

    function getInitialUrl(){
        var qs, href = window.location.href, referrer = document.referrer,
            idx = href.indexOf('?q=');
        
        if (idx === -1) return referrer;

        qs = href.substr(idx + 3);

        return qs || referrer;
    }

    function parseqs(qs, urlObj){
        if (!qs) return;

        var qsObj, pairs = qs.split('&');

        qsObj = pairs.reduce(function(obj, pair){
            pair = pair && pair.split('=');
            if (pair.length !== 2) return obj;
            
            var key = pair[0], value = decodeURIComponent(pair[1]);

            if (key in obj) {
                if (Array.isArray(obj[key])) {
                    obj[key].push(value);
                } else {
                    obj[key] = [ obj[key], value ];
                }
            } else {
                obj[key] = value;
            }
            
            return obj;
        }, {});

        urlObj.queryString = qsObj;

    }

    function bindEvent(el, event, callback){
        if (el.addEventListener) {
            el.addEventListener(event, callback, false);
        } else {
            el.attachEvent('on' + event, callback);
        }
    }

    function toggleError(state){
        // document.getElementById('error-msg').style.display = state? 'block' : 'none';
    }

    function doPrint(output){
        toggleError('false');
        var tags, spanlist, parent = document.getElementById('pretty-output');

        spanlist = parent.getElementsByTagName('span');
        if (spanlist && spanlist[0]) {
            parent.removeChild(spanlist[0]);
        }

        tags = parent.getElementsByTagName('pre');

        if (!tags) return;
        Array.prototype.slice.call(tags).forEach(function(tag){
            parent.removeChild(tag);
        });


        var out = JSON.stringify(output, undefined, 2);

        parent.appendChild(document.createElement('pre')).innerHTML = out;
    }


    function cb(e){
        process(e.target.value);
    }

    bindEvent(document.getElementById('urlInp'), 'mouseup', cb);
    bindEvent(document.getElementById('urlInp'), 'keyup', cb);

    var intialUrl = getInitialUrl();
    if (intialUrl) {
        process(intialUrl);
    }

    
})();