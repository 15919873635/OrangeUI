/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            OrangeTextBox:function(options){
                var textBox = jQ(this),
                text_default_width = 110,
                text_default_height = 20,
                text_default_text = "新建文本",
                defaultOptions = initOptions(options),
                defaultMethods = initMethods(),
                hasInited = jQ.type(textBox.data("hasInited")) === "undefined" ? false : textBox.data("hasInited");
                if(jQ.OrangeFitTag(textBox.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initText();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initText();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initText();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initText(){
                    if(!hasInited)
                        doInit();
                    textBox.data("defaultOptions",defaultOptions);
                };
                function doInit(){
                    if(jQ.type(textBox.prop("id")) === "undefined"){
                        textBox.prop("id","text_"+jQ.OrangeRandomId());
                    }
                    if(!textBox.hasClass("text"))
                        textBox.addClass("text");
                    var txtWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : text_default_width,
                        txtHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : text_default_height,
                        initTextString = "<div class='table fixed_layout'><div class='tr'><div class='td vertical_middle icon_width'><div class='ui_icon icon_window'></div>"+
                                      "</div><div class='td vertical_middle'><div class='text_left text_indent hide_text'>"+defaultOptions.text+"</div></div></div></div>";
                        txtHeight = txtHeight > 30 ? 30 : txtHeight;         
                    textBox.css({"width":txtWidth+"px","height":txtHeight+"px"});
                    textBox.empty();
                    textBox.append(initTextString);   
                    hasInited = true;
                    textBox.data("hasInited",hasInited);
                }    
                function initOptions(ops){
                    var textBoxOptions = textBox.data("defaultOptions");
                    if(jQ.type(textBoxOptions) === "undefined"){
                        textBoxOptions = {
                            width:text_default_width,
                            height:text_default_height,
                            promt:text_default_text,
                            text:""
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        textBoxOptions = jQ.extend(textBoxOptions,ops);
                    return textBoxOptions;
                };
                function initMethods(){
                    var textBoxMethods = textBox.data("defaultMethods");
                    if(jQ.type(textBoxMethods) === "undefined"){
                        textBoxMethods = {
                            setWidth:function(textWidth){
                                textWidth = jQ.isPlainObject(textWidth) ? (jQ.isNumeric(textWidth[1]) ? textWidth[1] : text_default_width) : text_default_width;
                                defaultOptions.width = textWidth;
                                textBox.width(textWidth);
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            },
                            setHeight:function(textHeight){
                                textHeight = jQ.isPlainObject(textHeight) ? (jQ.isNumeric(textHeight[1]) ? textHeight[1] : text_default_height) : text_default_height;
                                textHeight = textHeight > 30 ? 30 : textHeight;
                                defaultOptions.width = textHeight;
                                textBox.width(textHeight);
                            },
                            getHeight:function(){
                                return defaultOptions.height;
                            },
                            setText:function(textText){
                                textText = jQ.isPlainObject(textText) ? ((jQ.type(textText[1]) === "string" || jQ.type(textText[1]) === "number" || jQ.type(textText[1]) === "boolean") ?  textText[1] : "") : "";
                                defaultOptions.text = textText;
                                textBox.find(".hide_text").text(textText);
                            },
                            getText:function(){
                                return defaultOptions.text;
                            }
                        };
                    };
                    return textBoxMethods;
                }     
            }
        });
    } 
)(jQuery);


