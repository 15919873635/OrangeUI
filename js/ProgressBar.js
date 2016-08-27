/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            IfProgressbar:function(options){
                var progressBar = jQ(this),
                    progress_default_width = 150,
                    progress_default_height = 25,
                    progress_default_prcentage = "0%",
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(progressBar.data("hasInited")) === "undefined" ? false : progressBar.data("hasInited");
                if(jQ.IfFitTag(progressBar.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initProgress();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initProgress();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initProgress();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initProgress(){
                    if(!hasInited)
                        doInit();
                    progressBar.data("defaultOptions",defaultOptions);
                };   
                function doInit(){
                    if(jQ.type(progressBar.prop("id")) === "undefined"){
                        progressBar.prop("id","progress_"+jQ.IfRandomId());
                    };
                    if(!progressBar.hasClass("progress"))
                        progressBar.addClass("progress");
                    var proWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : progress_default_width,
                        proHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : progress_default_height,
                        proPrcentage = jQ.IfPercentage(defaultOptions.percentage) ? defaultOptions.percentage : progress_default_prcentage;
                    proHeight = proHeight > 30 ? 30 : (proHeight < 5 ?  5 : proHeight);
                    progressBar.empty().append("<div class='progress_content'></div>").css({"width":proWidth+"px","height":proHeight+"px"});
                    initPercentage(proPrcentage);
                    hasInited = true;
                    progressBar.data("hasInited",hasInited);
                };
                function initPercentage(progressValue){
                    progressValue = jQ.isPlainObject(progressValue) ? progressValue[1] : progressValue;
                    progressValue = jQ.IfPercentage(progressValue) ? progressValue : progress_default_prcentage;
                    if(defaultOptions.animate)
                        progressBar.find(".progress_content").text(progressValue).css({"line-height":progressBar.height()+"px"}).animate({width:progressValue},700);
                    else
                        progressBar.find(".progress_content").text(progressValue).css({"width":progressValue,"line-height":progressBar.height()+"px"});
                };
                function initOptions(ops){
                    var progressBarOptions = progressBar.data("defaultOptions");
                    if(jQ.type(progressBarOptions) === "undefined"){
                        progressBarOptions = {
                            width:progress_default_width,
                            height:progress_default_height,
                            animate:false,
                            percentage:progress_default_prcentage
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        progressBarOptions = jQ.extend(progressBarOptions,ops);
                    return progressBarOptions;
                };
                function initMethods(){
                    var progressBarMethods = progressBar.data("defaultMethods");
                    if(jQ.type(progressBarMethods) === "undefined"){
                        progressBarMethods = {
                            setWidth:function(prpgressWidth){
                                prpgressWidth = jQ.isPlainObject(prpgressWidth) ? (jQ.isNumeric(prpgressWidth[1]) ? prpgressWidth[1] : progress_default_width) : progress_default_width;
                                defaultOptions.width = prpgressWidth;
                                progressBar.width(prpgressWidth);
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            },
                            setHeight:function(progressHeight){
                                progressHeight = jQ.isPlainObject(progressHeight) ? (jQ.isNumeric(progressHeight[1]) ? progressHeight[1] : progress_default_height) : progress_default_height;
                                progressHeight = progressHeight > 30 ? 30 : progressHeight;
                                progressHeight = progressHeight < 5 ? 5 : progressHeight;
                                defaultOptions.width = progressHeight;
                                progressBar.width(progressHeight);
                            },
                            getHeight:function(){
                                return defaultOptions.height;
                            },
                            setValue:function(progressValue){
                                initPercentage(progressValue);
                            },
                            getValue:function(){
                                return defaultOptions.value;
                            }
                        };
                    };
                    return progressBarMethods;
                }  
            }
        });
    }
)(jQuery);


