/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            OrangeSearchBox:function(options){
                var searchbox = jQ(this),
                    searchbox_default_width = 100,
                    searchbox_default_height = 25,
                    searchbox_default_align = "left",
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(searchbox.data("hasInited")) === "undefined" ? false : searchbox.data("hasInited");
                if(jQ.OrangeFitTag(searchbox.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initSearchBox();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initSearchBox();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initSearchBox();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initSearchBox(){
                    if(!hasInited)
                        doInit();
                    searchbox.data("defaultOptions",defaultOptions);
                };  
                function doInit(){
                    if(jQ.type(searchbox.prop("id")) === "undefined"){
                        searchbox.prop("id","searchbox_"+jQ.OrangeRandomId());
                    }
                    if(!searchbox.hasClass("searchbox"))
                        searchbox.addClass("searchbox");
                    var iconString = "<div class='td icon_search width_20px cursor_hander vertical_middle'><div class='icon_search width_16px full_height'></div></div>";
                    var inputString = "<div class='td full_width'><input type='text'></div>";
                    var initSearchBoxString = "<div class='table fixed_layout'><div class='tr'>";
                    if(defaultOptions.iconAlign === "left"){
                        initSearchBoxString += iconString + inputString;
                    } else if(defaultOptions.iconAlign === "right"){
                        initSearchBoxString += inputString + iconString;
                    }
                    initSearchBoxString += "</div></div>";
                    searchbox
                            .empty()
                            .css({"width":defaultOptions.width+"px","height":defaultOptions.height+"px"})
                            .append(initSearchBoxString)
                            .on("click",".icon_search",function(event){
                                event.stopPropagation();
                                (defaultOptions.callback)();
                            });
                };    
                function initOptions(ops){
                    var searchBoxOptions = searchbox.data("defaultOptions");
                    if(jQ.type(searchBoxOptions) === "undefined"){
                        searchBoxOptions = {
                            url:"",
                            queryData:{},
                            width:searchbox_default_width,
                            height:searchbox_default_height,
                            iconAlign:searchbox_default_align,
                            callback:new Function()
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        searchBoxOptions = jQ.extend(searchBoxOptions,ops);
                    return searchBoxOptions;
                };
                function initMethods(){
                    var searchBoxMethods = searchbox.data("defaultMethods");
                    if(jQ.type(searchBoxMethods) === "undefined"){
                        searchBoxMethods = {
                            setWidth:function(searchBoxWidth){
                                searchBoxWidth = jQ.isArray(searchBoxWidth) ? searchBoxWidth[1] : jQ.isNumeric(searchBoxWidth) ? searchBoxWidth : searchbox_default_width;
                                defaultOptions.width = searchBoxWidth;
                                searchbox.width(searchBoxWidth);
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            }
                        };
                        searchbox.data("defaultMethods",searchBoxMethods);
                    }
                    return searchBoxMethods;
                };
            }
        });
    }
)(jQuery);


