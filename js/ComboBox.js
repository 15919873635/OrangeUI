/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            IfComboBox:function(options){
                var combo = jQ(this),
                combo_default_width = 110,
                combo_default_height = 25,
                defaultOptions = initOptions(options),
                defaultMethods = initMethods(),
                hasInited = jQ.type(combo.data("hasInited")) === "undefined" ? false : combo.data("hasInited");
                if(jQ.IfFitTag(combo.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initCombo();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initCombo();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initCombo();
                            defaultMethods[options](arguments);
                        }
                    }
                }
                function _initCombo(){
                    if(!hasInited)
                        doInit();
                    combo.data("defaultOptions",defaultOptions);
                }
                function doInit(){
                    if(jQ.type(combo.prop("id")) === "undefined"){
                        combo.prop("id","combo_"+jQ.IfRandomId());
                    };
                    if(!combo.hasClass("combo"))
                        combo.addClass("combo");
                    var comboWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : combo_default_width,
                        comboHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : combo_default_height;
                    combo.css({"width":comboWidth+"px","height":comboHeight+"px"});
                    var initComboString = "<div class='table fixed_layout'><div class='tr'><div class='td full_width'><div class='hide_text text_indent'></div>"+
                                       "</div><div class='td vertical_middle icon_width cursor_hander'><div class='arrow_down'></div></div></div></div><ul class='hidden_area'></ul>";
                    combo.empty().append(initComboString); 
                    combo.find(".text_indent").css({"width":combo.find(".text_indent").parent().width()+"px","height":comboHeight+"px", "line-height":comboHeight+"px"});
                    initDatas();
                    combo.find('.icon_width').click(function(){
                        var hasClass = combo.find('ul').hasClass("hidden_area");
                        if(hasClass)
                            combo.find('ul').removeClass("hidden_area");
                        else
                            combo.find('ul').addClass("hidden_area");
                    });
                    combo.find('ul li').click(function(){
                        combo.find(".text_indent").text(jQ(this).text());
                        combo.find('ul').addClass("hidden_area");
                    });
                    hasInited = true;
                    combo.data("hasInited",hasInited);
                }
                function initOptions(ops){
                    var comboOptions = combo.data("defaultOptions");
                    if(jQ.type(comboOptions) === "undefined"){
                        comboOptions = {
                            url:"",
                            queryData:{},
                            width:combo_default_width,
                            height:combo_default_height,
                            datas:[]
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        comboOptions = jQ.extend(comboOptions,ops);
                    return comboOptions;
                }
                function initDatas(){
                    if(defaultOptions.url === ""){
                        var localData = jQ.isArray(defaultOptions.datas) ? defaultOptions.datas : [];
                        defaultMethods.setDatas(localData);
                    }else{
                        var remoteUrl = jQ.type(defaultOptions.url) === "string" ? defaultOptions.url : "";
                        var remoteData = jQ.isPlainObject(defaultOptions.queryData) ? defaultOptions.queryData : {};
                        defaultMethods.loadDatas({url:remoteUrl,data:remoteData,dataType:"json"});
                    }
                };
                function initMethods(){
                    var comboMethods = combo.data("defaultMethods");
                    if(jQ.type(comboMethods) === "undefined"){
                        comboMethods = {
                            setWidth:function(comboWidth){
                                comboWidth = jQ.isPlainObject(comboWidth) ? (jQ.isNumeric(comboWidth[1]) ? comboWidth[1] : combo_default_width) : combo_default_width;
                                defaultOptions.width = comboWidth;
                                combo.width(comboWidth);
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            },
                            setHeight:function(comboHeight){
                                comboHeight = jQ.isPlainObject(comboHeight) ? (jQ.isNumeric(comboHeight[1]) ? comboHeight[1] : combo_default_height) : combo_default_height;
                                defaultOptions.height = comboHeight;
                                combo.width(comboHeight);
                            },
                            getHeight:function(){
                                return defaultOptions.height;
                            },
                            loadDatas:function(opts){
                                if(jQ.isPlainObject(opts)){
                                    opts.success = function(data){
                                        defaultMethods.setDatas(data);
                                    };
                                    jQ.IfAjax({
                                        url:opts.url,
                                        dataType:opts.dataType,
                                        data:opts.data,
                                        success:opts.success
                                    });
                                }
                            },
                            setDatas:function(comboDats){
                                combo.find("ul").empty();
                                if(comboDats && jQ.isPlainObject(comboDats)){
                                    comboDats = [comboDats];
                                }
                                if(jQ.isArray(comboDats) && comboDats.length > 0){
                                    var plainData = 0;
                                    for(var index = 0; index < comboDats.length ; index ++){
                                        var comData = comboDats[index];
                                        if(jQ.isPlainObject(comData)){
                                            var comDataId = jQ.type(comData.id) === "undefined" ? "li_"+jQ.IfRandomId() : comData.id ;
                                            var comDataText = jQ.type(comData.text) === "undefined" ? "" : comData.text ;
                                            combo.find("ul").append("<li id='"+comDataId+"'>"+comDataText+"</li>");
                                            plainData += 1;
                                            if(plainData === 1){
                                                combo.find(".text_indent").text(comDataText);
                                            }
                                        }  
                                    }
                                }
                            }
                        };
                    }
                    return comboMethods;
                }
            }
        });
    }
)(jQuery);


