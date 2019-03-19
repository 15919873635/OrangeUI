/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            OrangeTimeLine:function(options){
                var timeLine = jQ(this),
                    timeLine_default_width = 1000,
                    timeLine_default_height = 600,
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(timeLine.data("hasInited")) === "undefined" ? false : timeLine.data("hasInited");
                if(jQ.OrangeFitTag(timeLine.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initTimeLine();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initTimeLine();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initTimeLine();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initTimeLine(){
                    if(!hasInited)
                        doInit();
                    timeLine.data("defaultOptions",defaultOptions);
                };  
                function doInit(){
                    if(jQ.type(timeLine.prop("id")) === "undefined"){
                        timeLine.prop("id","timeline_"+jQ.OrangeRandomId());
                    };  
                    if(!timeLine.hasClass("timeline"))
                        timeLine.addClass("timeline");
                    var timeLineWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : timeLine_default_width,
                        timeLineHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : timeLine_default_height;
                    var initTimeLineStr = "<div class='base-line'>" + 
                        "<div class='sucess-progress success-color'></div>" + 
                        "<div class='dot dot-first success-color'></div>" + 
                        "<div class='dot dot-second success-color'></div>" + 
                        "<div class='dot dot-third success-color'></div>" + 
                        "<div class='dot dot-fourth notyet-color'></div>" + 
                        "<div class='dot dot-fifth notyet-color'></div></div>";
                    timeLine.empty().append(initTimeLineStr).css({"width":timeLineWidth+"px","height":timeLineHeight+"px"});    
                    hasInited = true;
                    timeLine.data("hasInited",hasInited);
                }  
                function initOptions(ops){
                    var timeLineOptions = timeLine.data("defaultOptions");
                    if(jQ.type(timeLineOptions) === "undefined"){
                        timeLineOptions = {
                            width:timeLine_default_width,
                            height:timeLine_default_height
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        timeLineOptions = jQ.extend(timeLineOptions,ops);
                    return timeLineOptions;
                };  
                function initMethods(){
                    var timeLineMethods = timeLine.data("defaultMethods");
                    if(jQ.type(timeLineMethods) === "undefined"){
                        timeLineMethods = {}
                    }
                    return timeLineMethods;
                }          
            }
        })
    }
)(jQuery);            