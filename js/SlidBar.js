/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            IfSlidBar:function(options){
                var sildBar = jQ(this),
                    sild_default_width = 150,
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(sildBar.data("hasInited")) === "undefined" ? false : sildBar.data("hasInited");
                if(jQ.IfFitTag(sildBar.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initSlidBar();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initSlidBar();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initSlidBar();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initSlidBar(){
                    if(!hasInited)
                        doInit();
                    sildBar.data("defaultOptions",defaultOptions);
                };   
                function doInit(){
                    if(jQ.type(sildBar.prop("id")) === "undefined"){
                        sildBar.prop("id","slid_"+jQ.IfRandomId());
                    };
                    if(!sildBar.hasClass("button"))
                        sildBar.addClass("button");
                    var buttonWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : sild_default_width;
                    sildBar.css("width",buttonWidth+"px");
                    var initButtonString = "<div class='table fixed_layout cursor_hander'><div class='tr'><div class='td vertical_middle full_width text_center'><div class='inline_block'>"+
                                        "<div class='hide_text text_indent'>"+defaultOptions.text+"</div></div></div></div></div>";
                    sildBar.empty().append(initButtonString); 
                    hasInited = true;
                    sildBar.data("hasInited",hasInited);
                };
                function initOptions(ops){
                    var slidOptions = sildBar.data("defaultOptions");
                    if(jQ.type(slidOptions) === "undefined"){
                        slidOptions = {
                            width:sild_default_width,
                            callback:new Function()
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        slidOptions = jQ.extend(slidOptions,ops);
                    return slidOptions;
                };
                function initMethods(){
                    var buttonMethods = sildBar.data("defaultMethods");
                    if(jQ.type(buttonMethods) === "undefined"){
                        buttonMethods = {
                            setWidth:function(buttonWidth){
                                buttonWidth = jQ.isPlainObject(buttonWidth) ? (jQ.isNumeric(buttonWidth[1])? buttonWidth[1] : sild_default_width) : (jQ.isNumeric(buttonWidth) ? buttonWidth : sild_default_width);
                                defaultOptions.width = buttonWidth;
                                sildBar.width(buttonWidth);
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            }
                        };
                    }
                    return buttonMethods;
                } 
            }
        });
    }
)(jQuery);


