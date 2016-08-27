/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            IfFileBox:function(options){
                var fileBox = jQ(this),
                    file_default_width = 150,
                    file_default_height = 25,
                    file_button_default_text = "选择文件",
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(fileBox.data("hasInited")) === "undefined" ? false : fileBox.data("hasInited");
                if(jQ.IfFitTag(fileBox.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initFile();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initFile();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initFile();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initFile(){
                    if(!hasInited)
                        doInit();
                    fileBox.data("defaultOptions",defaultOptions);
                };  
                function doInit(){
                    if(jQ.type(fileBox.prop("id")) === "undefined"){
                        fileBox.prop("id","file_"+jQ.IfRandomId());
                    };
                    if(!fileBox.hasClass("file"))
                        fileBox.addClass("file");
                    var fileWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : file_default_width,
                        fileHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : file_default_height;
                    fileWidth = fileWidth < 100 ? 100 : fileWidth;
                    fileHeight = fileHeight > 30 ? 30 : (fileHeight < 10 ?  10 : fileHeight);
                    var initFileStr = "<div class='table fixed_layout'><div class='tr'><div class='td hidden_area'><input type='file' /></div><div class='td vertical_middle'>"+
                                   "<div class='file_button cursor_hander text_center hide_text'>"+defaultOptions.buttonText+"</div></div><div class='td vertical_middle full_width'><div class='hide_text text_indent full_width'></div></div></div></div>";
                    fileBox.empty().append(initFileStr).css({"width":fileWidth+"px","height":fileHeight+"px"});
                    var file_button =  fileBox.find(".file_button");
                    var file_compent = fileBox.find("input[type=file]");
                    file_button.parent().width(file_button.width());
                    file_compent.change(function(){
                        fileBox.find(".text_indent").text(jQ(this).get(0).files[0].name);
                    });
                    fileBox.find(".hide_text").css({"height":(fileHeight - 1)+"px","line-height":(fileHeight - 1)+"px"});
                    file_button.click(function(){file_compent.trigger("click");});
                    if(!defaultOptions.showBorder){
                        fileBox.css({"border":"0px"});
                        file_button.addClass("file_noborder");
                    }
                    hasInited = true;
                    fileBox.data("hasInited",hasInited);
                };
                function initOptions(ops){
                    var fileBoxOptions = fileBox.data("defaultOptions");
                    if(jQ.type(fileBoxOptions) === "undefined"){
                        fileBoxOptions = {
                            width:file_default_width,
                            height:file_default_height,
                            buttonText:file_button_default_text,
                            showBorder:true
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        fileBoxOptions = jQ.extend(fileBoxOptions,ops);
                    return fileBoxOptions;
                };
                function initMethods(){
                    var fileBoxMethods = fileBox.data("defaultMethods");
                    if(jQ.type(fileBoxMethods) === "undefined"){
                        fileBoxMethods = {
                            setWidth:function(fileWidth){
                                fileWidth = jQ.isPlainObject(fileWidth) ? (jQ.isNumeric(fileWidth[1]) ? fileWidth[1] : file_default_width) : file_default_width;
                                defaultOptions.width = fileWidth;
                                fileBox.width(fileWidth);
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            },
                            setHeight:function(fileHeight){
                                fileHeight = jQ.isPlainObject(fileHeight) ? (jQ.isNumeric(fileHeight[1]) ? fileHeight[1] : file_default_height) : file_default_height;
                                fileHeight = fileHeight > 30 ? 30 : fileHeight;
                                fileHeight = fileHeight < 10 ? 10 : fileHeight;
                                defaultOptions.width = fileHeight;
                                fileBox.width(fileHeight);
                            },
                            getHeight:function(){
                                return defaultOptions.height;
                            }
                        };
                    };
                    return fileBoxMethods;
                }
            }
        });
    }
)(jQuery);


