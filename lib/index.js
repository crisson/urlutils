
(function(){
    function noop(){}

    function cb(e){
        var element, url = e.target.value;
        
        if (!url) return showError();

        element = document.createElement('a');
        element.href = url;
        print(element);
    }

    function bindEvent(el, event, callback){
        if (el.addEventListener) {
            el.addEventListener(event, callback, false);
        } else {
            el.attachEvent('on' + event, callback);
        }
    }

    function showError(){}

    bindEvent(document.getElementById('urlInp'), 'mouseup', cb);

    
})();