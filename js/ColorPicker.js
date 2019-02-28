/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            OrangeColorPicker:function(options){
                var colorPicker = jQ(this),
                defaultOptions = initOptions(options),
                defaultMethods = initMethods(),
                hasInited = jQ.type(colorPicker.data("hasInited")) === "undefined" ? false : colorPicker.data("hasInited");
                if(jQ.OrangeFitTag(colorPicker.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initColorPicker();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initColorPicker();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initColorPicker();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initColorPicker(){
                    if(!hasInited)
                        doInit();
                    colorPicker.data("defaultOptions",defaultOptions);
                };  
                function doInit(){
                    if(jQ.type(colorPicker.prop("id")) === "undefined"){
                        colorPicker.prop("id","color_picker_"+jQ.IfRandomId());
                    };
                    if(!colorPicker.hasClass("color_picker"))
                        colorPicker.addClass("color_picker");
                    var initColorPickerString = "<input type='text' class='color_picker_input'>" + 
                        "<div class='color_picker_block'><div class='color_picker_left_block'></div>" + 
                        "<div class='color_picker_right_block'><div class='color_picker_bar_block'><div class='color_picker_color_bar'></div><div class='color_picker_slider_bar'></div></div></div></div>";
                    colorPicker.append(initColorPickerString);     
                    hasInited = true; 
                    colorPicker.data("hasInited",hasInited);   
                }     
            }
        });
    }
)(jQuery);