/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            OrangeWindow:function(options){
                var window = jQ(this),
                    docWidth = jQ(document).width(),
                    docHeight = jQ(document).height(),
                    win_default_width = 600,
                    win_default_height = 300,
                    win_default_but_width = 80,
                    win_default_icon = "icon_window",
                    win_default_title = {
                        icon:win_default_icon,
                        text:"新建窗口"
                    },
                    button_ok_text = "确定",
                    button_cancel_text = "取消",
                    winId = window.prop("id"),
                    isMoving = window.data("isMoving"),
                    winPosition = window.data("currentPosition"),
                    mousePosition = window.data("mousePosition"),
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(window.data("hasInited")) === "undefined" ? false : window.data("hasInited");
                if(jQ.OrangeFitTag(window.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initWin();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initWin();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initWin();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initWin(){
                    if(!hasInited)
                        doInit();
                    window.data("defaultOptions",defaultOptions);
                };
                function doInit(){
                    if(jQ.type(winId) === "undefined"){
                        winId = "win_"+jQ.OrangeRandomId();
                        window.prop("id",winId);
                    }
                    if(!window.hasClass("window"))
                        window.addClass("window");
                    var winWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : win_default_width,
                        winHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : win_default_height,
                        winTop = jQ.isArray(defaultOptions.offset) ? (jQ.isNumeric(defaultOptions.offset[1]) ? defaultOptions.offset[1] : ( docHeight  - winHeight) / 2) : (docHeight  - winHeight) / 2,
                        winLeft = jQ.isArray(defaultOptions.offset) ? (jQ.isNumeric(defaultOptions.offset[0]) ? defaultOptions.offset[0] : (docWidth  - winWidth) / 2) : (docWidth - winWidth) / 2,
                        gridTitle = jQ.isPlainObject(defaultOptions.title) ? (jQ.isEmptyObject(defaultOptions.title) ? {} : defaultOptions.title) : {},
                        titleIcon = !jQ.isEmptyObject(gridTitle) ? (jQ.type(gridTitle.icon) === "string" ? gridTitle.icon : win_default_icon) : win_default_icon,
                        titleText = !jQ.isEmptyObject(gridTitle) ? (jQ.type(gridTitle.text) === "string" ? gridTitle.text : win_default_title) : win_default_title;
                    window.css({"width":winWidth+"px","height":winHeight+"px","position": "absolute","top":winTop+"px","left":winLeft+"px"});
                    var initWinString = "<div class='table'><div class='tr title'><div class='td'><div class='table fixed_layout'><div class='tr'><div class='td vertical_middle icon_width'><div class='ui_icon "+titleIcon+"'></div></div><div class='td vertical_middle full_width'><div class='text_left text_indent hide_text full_width'>"+titleText+"</div></div></div>"
                                    +"</div></div></div><div class='tr'><div class='td full_area'></div></div><div class='tr bottom'><div class='td vertical_middle full_width'></div></div></div>";
                    window.empty().append(initWinString); 
                    window.wrap("<div class='mongolia_layer'></div>");
                    initButtons(defaultOptions.type);
                    window.find(".title").on("mousedown",function(event){
                        isMoving = true;
                        window.data("isMoving",true);
                        jQ(this).css({"cursor":"move"});
                        winPosition = window.position();
                        mousePosition = [event.pageX - winPosition.left,event.pageY - winPosition.top];
                        window.data("currentPosition",winPosition);
                        window.data("mousePosition",mousePosition);
                    }).on("mouseup",function(event){
                        jQ(this).css({"cursor":"default"});
                        isMoving = false;
                        window.data("isMoving",false);
                        jQ(this).off("mousemove","**");
                    }).on("mousemove",function(event){
                        if(isMoving){
                            jQ("#"+winId).OrangeWindow("setPosition",[event.pageX - mousePosition[0],event.pageY - mousePosition[1]]);
                        }
                    }).on("mouseout",function(event){
                        event.preventDefault();
                        jQ(this).css({"cursor":"default"});
                        isMoving = false;
                        window.data("isMoving",false);
                        jQ(this).off("mousemove","**");
                    });
                    hasInited = true;
                    isMoving = false;
                    window.data("hasInited",hasInited);
                    window.data("isMoving",isMoving);
                };
                function initButtons(buttonType){
                    var btsType = jQ.isNumeric(buttonType);
                    if(btsType){
                        switch (buttonType){
                            case 0:
                                var butt_ok = "butt_"+jQ.OrangeRandomId();
                                var butt_cancel = "butt_"+jQ.OrangeRandomId();
                                window.find(".bottom").children("div").append("<div id='"+butt_cancel+"'></div><div id='"+butt_ok+"'></div>");
                                jQ("#"+butt_ok).OrangeButton({
                                    align:"right",
                                    width:win_default_but_width,
                                    icon:"icon_file",
                                    text:button_ok_text
                                });
                                jQ("#"+butt_cancel).OrangeButton({
                                    align:"right",
                                    width:win_default_but_width,
                                    icon:"icon_pc",
                                    text:button_cancel_text,
                                    callback:function(){
                                        jQ("#"+winId).OrangeWindow("hide");
                                    }
                                });
                                break;
                            default : break; 
                        } 
                    }
                };
                function initOptions(ops){
                    var windowOptions = window.data("defaultOptions");
                    if(jQ.type(windowOptions) === "undefined"){
                        windowOptions = {
                            type:0,
                            width:win_default_width,
                            height:win_default_height,
                            offset:[],
                            title:win_default_title
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        windowOptions = jQ.extend(windowOptions,ops);
                    return windowOptions;
                };
                function initMethods(){
                    var windowMethods = window.data("defaultMethods");
                    if(jQ.type(windowMethods) === "undefined"){
                        windowMethods = {
                            setWidth:function(winWidth){
                                winWidth = jQ.isArray(winWidth) ? winWidth[1] : jQ.isNumeric(winWidth) ? winWidth : win_default_width;
                                defaultOptions.width = winWidth;
                                window.width(winWidth);
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            },
                            setHeight:function(winHeight){
                                winHeight = jQ.isArray(winHeight) ? winHeight[1] : jQ.isNumeric(winHeight) ? winHeight : win_default_height;
                                defaultOptions.width = winHeight;
                                window.width(winHeight);
                            },
                            getHeight:function(){
                                return defaultOptions.height;
                            },
                            setTitle:function(winTitle){
                                winTitle = jQ.isPlainObject(winTitle) ? (jQ.isPlainObject(winTitle[1]) ? winTitle[1] : win_default_title) : (jQ.type(winTitle[1]) === "string" ? winTitle : win_default_title);
                                defaultOptions.title = winTitle;
                                window.find(".ui_icon").addClass(winTitle.icon);
                                window.find(".text_indent").text(winTitle.text);
                            },
                            getTitle:function(){
                                return defaultOptions.title;
                            },
                            setPosition:function(arg){
                                var argArray = jQ.isPlainObject(arg);
                                if(argArray){
                                    var arg_1_array = jQ.isArray(arg[1]);
                                    if(arg_1_array){
                                        var winTop = jQ.isNumeric(arg[1][1]) ? arg[1][1] : (jQ(document).height() - window.height()) / 2,
                                        winLeft = jQ.isNumeric(arg[1][0]) ? arg[1][0] : (jQ(document).width() - window.width()) / 2;
                                        defaultOptions.offset = [winTop,winLeft];
                                        window.offset({top:winTop,left:winLeft});
                                    }
                                }
                            },
                            show:function(){
                                window.parent(".mongolia_layer").show();
                            },
                            hide:function(){
                                window.parent(".mongolia_layer").hide();
                            }
                        };
                        window.data("defaultMethods",windowMethods);
                    }
                    return windowMethods;
                }
            }
        });
    }
)(jQuery);


