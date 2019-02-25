/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            OrangeClock:function(options){
                var clock = jQ(this),
                    clock_default_width = 400,
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(clock.data("hasInited")) === "undefined" ? false : clock.data("hasInited");
                var WEEKS = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
                    MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
                if(jQ.OrangeFitTag(clock.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initClock();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initClock();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initClock();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initClock(){
                    if(!hasInited)
                        doInit();
                    clock.data("defaultOptions",defaultOptions);
                    setInterval(setTime,1000);
                };   
                function doInit(){
                    if(jQ.type(clock.prop("id")) === "undefined"){
                        clock.prop("id","clock_"+jQ.IfRandomId());
                    };
                    if(!clock.hasClass("clock"))
                        clock.addClass("clock");
                    var clockWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : clock_default_width;
                    clock.css({"width":clockWidth+"px","height":clockWidth+"px"});
                    clock.empty();
                    var ahd = 30 * Math.PI / 180;
                    var clock_id = clock.prop("id");
                    var initClockString = "";
                    if(defaultOptions.type === "pointer") {
                        initClockString += "<div class='origin' style='top: "+ (clockWidth - 20) / 2 +"px; left: " + (clockWidth - 20) / 2 + "px'></div><div class='dot_box'>";
                        for(var index = 0 ; index < 12 ; index ++ ) {
                            initClockString += "<div class='dot' style='left: " + (clock_default_width * (0.45 + Math.sin((ahd * index)) * 0.4)) + "px; top: " + (clock_default_width * (0.45 + Math.cos((ahd * index)) * 0.4)) + "px; line-height: " + clockWidth * 0.1 + "px'>6</div>"
                        }  
                        initClockString += "</div><div class='clock_line hour_line' id='" + clock_id + "_hour_line'></div>" +
                                            "<div class='clock_line minute_line' id='" + clock_id + "_minute_line'></div>"+
                                            "<div class='clock_line second_line' id='" + clock_id + "_second_line'></div>" + 
                                            "<div class='date_info' id='" + clock_id + "_date_info'></div>" + 
                                            "<div class='time_info'><div class='time' id='" + clock_id + "_hour_time'></div><div class='time minute_time' id='" + clock_id + "_minute_time'></div><div class='time' id='" + clock_id + "_second_time'></div></div>";
                        for(var i = 0; i < 60; i++) {
                            initClockString += "<div class='clock-scale' style='transform: rotate(" + (i * 6 - 90) + "deg);'><div class='scale-hidden'></div><div class='scale-show'></div></div>";
                        }       
                    } else if(defaultOptions.type === "numerical") {

                    }             
                    clock.append(initClockString); 
                    hasInited = true;
                    clock.data("hasInited",hasInited);
                };
                function initOptions(ops){
                    var clockOptions = clock.data("defaultOptions");
                    if(jQ.type(clockOptions) === "undefined"){
                        clockOptions = {
                            width: clock_default_width,
                            type: "pointer"
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        clockOptions = jQ.extend(clockOptions,ops);
                    return clockOptions;
                };
                function initMethods(){
                    var clockMethods = clock.data("defaultMethods");
                    if(jQ.type(clockMethods) === "undefined"){
                        clockMethods = {
                            setWidth:function(clockWidth){
                                clockWidth = jQ.isPlainObject(clockWidth) ? (jQ.isNumeric(clockWidth[1])? clockWidth[1] : clock_default_width) : (jQ.isNumeric(clockWidth) ? clockWidth : clock_default_width);
                                defaultOptions.width = clockWidth;
                                button.width(clockWidth);
                                resizeContent();
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            }
                        };
                    }
                    return clockMethods;
                } 
                function setTime(){
                    var clock_id = clock.prop("id");
                    var nowdate = new Date();
                    //获取年月日时分秒
                    var year = nowdate.getFullYear(),
                        month = nowdate.getMonth(),
                        day = nowdate.getDay(),
                        hours = nowdate.getHours(),
                        minutes = nowdate.getMinutes(),
                        seconds = nowdate.getSeconds(),
                        date = nowdate.getDate();
                    var formatedYear = year + "年" + MONTHS[month] + date + "日   " + WEEKS[day],
                        formatedHours = hours >= 10 ? hours : "0" + hours,
                        formatedMinutes = minutes >=10 ? minutes : "0" + minutes,
                        formatedSeconds = seconds >=10 ? seconds : "0" + seconds;
                    if(defaultOptions.type === "pointer") {
                        var hour_line = jQ("#" + clock_id + "_hour_line"),
                            minute_line = jQ("#" + clock_id + "_minute_line"),
                            second_line = jQ("#" + clock_id + "_second_line"),
                            date_info= jQ("#" + clock_id + "_date_info"),
                            hour_time = jQ("#" + clock_id + "_hour_time"),
                            minute_time = jQ("#" + clock_id + "_minute_time"),
                            second_time = jQ("#" + clock_id + "_second_time");
                        // 获取日期id
                        date_info.html(formatedYear);
                        hour_time.html(formatedHours);
                        minute_time.html(formatedMinutes);
                        second_time.html(formatedSeconds);
                        //时分秒针设置
                        var hour_rotate = (hours * 30 - 90) + (Math.floor(minutes / 12) * 6);
                        hour_line.css('transform','rotate(' + hour_rotate + 'deg)');
                        minute_line.css('transform','rotate(' + (minutes * 6 - 90) + 'deg)');
                        second_line.css('transform','rotate(' + (seconds * 6 - 90) + 'deg)');
                    } else if(defaultOptions.type === "numerical") {
                        
                    }
                }  
            }
        });
    }
)(jQuery);
