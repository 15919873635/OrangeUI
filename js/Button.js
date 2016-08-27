/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            OrangeButton:function(options){
                var button = jQ(this),
                    button_default_width = 80,
                    button_default_height = 20,
                    button_default_align = "left",
                    hasIcon = true,
                    button_ok_text = "确定",
                    button_default_icon = "icon_user",
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(button.data("hasInited")) === "undefined" ? false : button.data("hasInited");
                if(jQ.IfFitTag(button.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initButton();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initButton();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initButton();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initButton(){
                    if(!hasInited)
                        doInit();
                    button.data("defaultOptions",defaultOptions);
                };   
                function doInit(){
                    if(jQ.type(button.prop("id")) === "undefined"){
                        button.prop("id","button_"+jQ.IfRandomId());
                    };
                    if(!button.hasClass("button"))
                        button.addClass("button");
                    var buttonWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : button_default_width,
                        buttonHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : button_default_height,
                        buttonAlign = jQ.type(defaultOptions.align) === "string" ? defaultOptions.align : button_default_align,
                        buttonIcon = defaultOptions.icon === null ? (hasIcon = false) : (jQ.type(defaultOptions.icon) === "string" ? defaultOptions.icon : button_default_icon);
                    button.css({"width":buttonWidth+"px","height":buttonHeight+"px","float":buttonAlign});
                    if(buttonAlign === button_default_align)
                        button.removeClass("button_align_right").addClass("button_align_left");
                    else
                        button.removeClass("button_align_left").addClass("button_align_right");
                    button.empty();
                    var initButtonString = "<div class='table fixed_layout cursor_hander'><div class='tr'><div class='td vertical_middle full_width text_center'><div class='inline_block'>"+
                                        "<div class='hide_text text_indent'>"+defaultOptions.text+"</div></div></div></div></div>";
                    button.append(initButtonString); 
                    hasInited = true;
                    resizeContent();
                    button.data("hasInited",hasInited);
                    defaultMethods.setIcon(buttonIcon);
                    if(jQ.isFunction(defaultOptions.callback)){
                        button.on("click",function(event){
                            event.preventDefault();
                            defaultOptions.callback();
                        });
                    };
                };
                function resizeContent(){
                    if(hasIcon)
                        button.find(".hide_text").css({"max-width":(button.width() - 16)+"px","height":button.height()+"px","line-height":button.height()+"px"});
                    else
                        button.find(".hide_text").css({"max-width":button.width()+"px","height":button.height()+"px","line-height":button.height()+"px"});
                };
                function initOptions(ops){
                    var buttonOptions = button.data("defaultOptions");
                    if(jQ.type(buttonOptions) === "undefined"){
                        buttonOptions = {
                            width:button_default_width,
                            align:button_default_align,
                            icon:null,
                            text:button_ok_text,
                            callback:new Function()
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        buttonOptions = jQ.extend(buttonOptions,ops);
                    return buttonOptions;
                };
                function initMethods(){
                    var buttonMethods = button.data("defaultMethods");
                    if(jQ.type(buttonMethods) === "undefined"){
                        buttonMethods = {
                            setText:function(buttonText){
                                buttonText = jQ.isPlainObject(buttonText) ? (jQ.type(buttonText[1]) === "string" ? buttonText[1] : button_ok_text) : (jQ.type(buttonText) === "string" ? buttonText : button_ok_text);
                                defaultOptions.text = buttonText;
                                button.find(".hide_text").text(buttonText);
                            },
                            getText:function(){
                                return defaultOptions.text;
                            },
                            setWidth:function(buttonWidth){
                                buttonWidth = jQ.isPlainObject(buttonWidth) ? (jQ.isNumeric(buttonWidth[1])? buttonWidth[1] : button_default_width) : (jQ.isNumeric(buttonWidth) ? buttonWidth : button_default_width);
                                defaultOptions.width = buttonWidth;
                                button.width(buttonWidth);
                                resizeContent();
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            },
                            setIcon:function(buttonIcon){
                                buttonIcon = jQ.isPlainObject(buttonIcon) ? (jQ.type(buttonIcon[1]) === "string" ? buttonIcon[1] : null) : (jQ.type(buttonIcon) === "string" ? buttonIcon : null);
                                hasIcon = buttonIcon === null ? false : true;
                                button.find(".ui_icon").remove();
                                if(hasIcon){
                                    defaultOptions.icon = buttonIcon;
                                    button.find(".inline_block").prepend("<div class='ui_icon "+buttonIcon+"'></div>");
                                    button.find(".ui_icon").css({"height":button.height()+"px","line-height":button.height()+"px"});
                                } 
                                resizeContent();
                            },
                            getIcon:function(){
                                return defaultOptions.icon;
                            }
                        };
                    }
                    return buttonMethods;
                } 
            } 
        });     
    }
)(jQuery);


