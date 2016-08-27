/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            IfDatepicker:function(options){
                var datePicker = jQ(this),
                    datePicker_default_width = 150,
                    today = new Date(),
                    datePicker_default_format = jQ.IfConstants.DateFormats.FORMAT1,
                    datePicker_default_date = jQ.IfUtil.dateFormat(new Date(),datePicker_default_format),
                    datePicker_current_year = jQ.type(datePicker.data("currentYear")) === "undefined" ? today.getFullYear() : datePicker.data("currentYear")  ,
                    datePicker_current_month = jQ.type(datePicker.data("currentMonth")) === "undefined" ? (today.getMonth() + 1) : datePicker.data("currentMonth"),
                    datePicker_current_date = jQ.type(datePicker.data("currentDate")) === "undefined" ? today.getDate() : datePicker.data("currentDate") ,
                    datePicker_font_one = "一",
                    datePicker_font_two = "二",
                    datePicker_font_three = "三",
                    datePicker_font_four = "四",
                    datePicker_font_five = "五",
                    datePicker_font_six = "六",
                    datePicker_font_day = "日",
                    datePicker_font_year = "年",
                    datePicker_font_month = "月",
                    hasInited = jQ.type(datePicker.data("hasInited")) === "undefined" ?  false : datePicker.data("hasInited") ,
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods();
                if(jQ.isPlainObject(options) || jQ.type(options) === "undefined"){
                    _initDatePicker();
                } if(jQ.type(options) === "string"){
                    if(/^set\w+/.test(options)){
                        defaultMethods[options](arguments);
                        _initDatePicker();
                    }else if(/^get\w+/.test(options)){
                        return defaultMethods[options]();
                    }else{
                        _initDatePicker();
                        defaultMethods[options](arguments);
                    }
                } 
                /**
                 *  初始化配置
                 * @param {type} opts
                 * @returns
                 */
                function initOptions(opts){
                    var datePickerOptions = datePicker.data("defaultOptions");
                    if(jQ.type(datePickerOptions) === "undefined"){
                        datePickerOptions = {
                            width:datePicker_default_width,
                            dateFormat:datePicker_default_format,
                            targetDate:datePicker_default_date
                        };
                    }
                    if(jQ.isPlainObject(opts))
                        datePickerOptions = jQ.extend(datePickerOptions,opts);
                    return datePickerOptions;
                }
                /**
                 * 初始化方法
                 * @returns 
                 */
                function initMethods(){
                    var datePickerMethods = datePicker.data("defaultMethods");
                    if(jQ.type(datePickerMethods) === "undefined"){
                        datePickerMethods = {
                            setWidth:function(datePickerWidth){
                                datePickerWidth = jQ.isPlainObject(datePickerWidth) ? datePickerWidth[1] : (jQ.isNumeric(datePickerWidth) ? datePickerWidth : datePicker_default_width);
                                defaultOptions.width = datePickerWidth;
                                datePicker.css({width:datePickerWidth+"px"});
                            },
                            setDateFormat:function(dateFormat){
                                dateFormat = jQ.isPlainObject(dateFormat) ? dateFormat[1] : (jQ.isNumber(dateFormat) ? dateFormat : datePicker_default_format);
                                defaultOptions.dateFormat = dateFormat;
                            },
                            setDate:function(pickerDate){
                                pickerDate = jQ.isPlainObject(pickerDate) ? pickerDate[1] : (jQ.type(pickerDate) === "string" ? pickerDate : datePicker_default_date);
                                var newDate = jQ.IfUtil.dismantDate(pickerDate);
                                datePicker_current_year = newDate.year;
                                datePicker_current_month = newDate.month;
                                datePicker_current_date  = newDate.day;
                                initDateNumbers(newDate.year, newDate.month, newDate.day);
                            },
                            getOptions:function(){
                                return defaultOptions;
                            }
                        };
                    }
                    datePicker.data("defaultMethods",datePickerMethods);
                    return datePickerMethods;
                }
                
                function _initDatePicker(){
                    if(!hasInited){
                        doInit();
                        datePicker.data("hasInited",true);
                    }
                    datePicker.data("defaultOptions",defaultOptions);
                }
                
                /**
                 * 获取某年某月的所有日期
                 * @param {type} year
                 * @param {type} month
                 * @returns {Array}
                 */
                function monthDayArray(year,month){
                    var curtMonth = new Array();
                    if(year > 0 && (month > 0 && month < 13)){
                        var targetDate = new Date();
                        targetDate.setFullYear(year);
                        targetDate.setMonth(month - 1);
                        targetDate.setDate(1);
                        var currentMonthDays = jQ.IfUtil.getDaysInMonth(year,month - 1),
                            dayInWeek = targetDate.getDay(),
                            lastMonthDays = 0,
                        dayInWeek = (dayInWeek === 0) ? 7 : dayInWeek;  
                        if(month === 1){
                            lastMonthDays = jQ.IfUtil.getDaysInMonth(year - 1,11);
                        } else{
                            lastMonthDays = jQ.IfUtil.getDaysInMonth(year,month - 2);
                        }
                        for(var startIndex = 0 ;startIndex < dayInWeek ; startIndex ++){
                            curtMonth[startIndex] = {val:(lastMonthDays + startIndex - dayInWeek) + 1,flag:"notcurrentmonth",month:"last"};
                        }
                        for(var startIndex = dayInWeek; startIndex < (currentMonthDays + dayInWeek); startIndex ++){
                            curtMonth[startIndex] = {val:(startIndex - dayInWeek) + 1,flag:"currentmonth",month:"current"};
                        }
                        for(var startIndex = (dayInWeek + currentMonthDays) ; startIndex < 42 ; startIndex ++){
                            curtMonth[startIndex] = {val:(startIndex - dayInWeek - currentMonthDays) + 1,flag:"notcurrentmonth",month:"next"};
                        }
                    }
                    return curtMonth;
                }
                
                function initDateNumbers(year,month,day){
                    var contentStr = "",
                        currentPageDays =  monthDayArray(year,month);
                    datePicker.find(".datepicker-number").remove();
                    for(var index = 0 ; index < currentPageDays.length ; index ++){
                        var $thisData = currentPageDays[index];
                        if($thisData.flag === "currentmonth" && $thisData.val === parseInt(day))
                            contentStr += "<div class='datepicker-number currentmonth datepicker-number-selected' data-month='"+$thisData.month+"'>"+$thisData.val+"</div>";
                        else
                            contentStr += "<div class='datepicker-number "+$thisData.flag+"' data-month='"+$thisData.month+"'>"+$thisData.val+"</div>";
                    }
                    datePicker.find(".datepicker-content").append(contentStr);
                    datePicker.find(".currentmonth").click(function(){
                        var $this = jQ(this),
                            $thisText = $this.text();
                        $this.siblings().removeClass("datepicker-number-selected");
                        $this.addClass("datepicker-number-selected");
                        var currentDate = new Date();
                        currentDate.setFullYear(datePicker_current_year);
                        currentDate.setMonth(datePicker_current_month - 1);
                        currentDate.setDate(parseInt($thisText));
                        datePicker_current_date = parseInt($thisText);
                        datePicker.data("currentDate",parseInt($thisText));
                        datePicker.find(".datepicker-combo-datecontent").text(jQ.IfUtil.dateFormat(currentDate,datePicker_default_format));
                    });
                    datePicker.find(".notcurrentmonth").click(function(){
                        var $this = jQ(this);
                        datePicker_current_date = $this.text();  
                        if($this.attr("data-month") === "last"){
                            if(datePicker_current_month === 1){
                                datePicker_current_month = 12;
                                datePicker_current_year = datePicker_current_year - 1;
                            } else {
                                datePicker_current_month = datePicker_current_month - 1;
                            }
                        } else if($this.attr("data-month") === "next"){
                            if(datePicker_current_month === 12){
                                datePicker_current_month = 1;
                                datePicker_current_year = datePicker_current_year + 1;
                            } else {
                                datePicker_current_month = datePicker_current_month + 1;
                            }
                        }
                        datePicker.data("currentYear",datePicker_current_year);
                        datePicker.data("currentMonth",datePicker_current_month);
                        datePicker.data("currentDate",datePicker_current_date);
                        initDateNumbers(datePicker_current_year,datePicker_current_month,datePicker_current_date);
                    });
                    var currentDate = new Date();
                    currentDate.setFullYear(year);
                    currentDate.setMonth(month - 1);
                    currentDate.setDate(day);
                    datePicker.find(".datepicker-combo-datecontent").text(jQ.IfUtil.dateFormat(currentDate,datePicker_default_format));
                    month = month > 9 ? month : "0"+month;
                    datePicker.find("#currentMonth").text(year+datePicker_font_year+month+datePicker_font_month);
                }
                
                /**
                 * 根据配置初始化UI表现
                 * @returns {undefined}
                 */
                function doInit(){
                    datePicker.data("currentYear",datePicker_current_year);
                    datePicker.data("currentMonth",datePicker_current_month);
                    datePicker.data("currentDate",datePicker_current_date);
                    var datePickerId = datePicker.prop("id");
                    if(jQ.type(datePickerId) === "undefined"){
                        datePickerId = "datepicker_"+jQ.IfRandomId();
                        datePicker.prop("id",datePickerId);
                    }
                    if(!datePicker.hasClass("datepicker-combo"))
                        datePicker.addClass("datepicker-combo");
                    var datePickerStr = 
                    "<div class='datepicker-combo-table full-area'><div class='datepicker-combo-tr'><div class='datepicker-combo-td width-20px'><div class='datepicker-combo-icon'></div></div><div class='datepicker-combo-td full-width'><div class='datepicker-combo-datecontent'></div></div></div></div>"+
                    "<div class='datepicker hidden-area'><div class='datepicker-top'><div class='datepicker-combo-table full-area'><div class='datepicker-combo-tr'><div class='datepicker-combo-td width-20px' id='lastMonth'>&Lt;</div><div class='datepicker-combo-td full-width' id='currentMonth'></div><div class='datepicker-combo-td width-20px' id='nextMonth'>&Gt;</div></div></div></div>"+
                    "<div class='datepicker-content'><div class='datepicker-date'>"+datePicker_font_day+"</div><div class='datepicker-date'>"+datePicker_font_one+"</div><div class='datepicker-date'>"+datePicker_font_two+"</div><div class='datepicker-date'>"+datePicker_font_three+"</div><div class='datepicker-date'>"+datePicker_font_four+"</div><div class='datepicker-date'>"+datePicker_font_five+
                    "</div><div class='datepicker-date'>"+datePicker_font_six+"</div></div><div class='datepicker-bottom'><div class='datepicker-bottom-button'>取消</div><div class='datepicker-bottom-button'>确定</div></div></div>";
                    datePicker.append(datePickerStr);
                    defaultMethods.setWidth(defaultOptions.width);
                    initDateNumbers(datePicker_current_year,datePicker_current_month,datePicker_current_date);
                    
                    datePicker.on("click",".datepicker-combo-table",function(){
                        $(".datepicker").removeClass("hidden-area");
                    }).on("click",".datepicker-bottom-button:eq(0)",function(){
                        $(".datepicker").addClass("hidden-area");
                        datePicker.find(".datepicker-combo-datecontent").text(datePicker_default_date);
                        defaultMethods.setDate(datePicker_default_date);
                    }).on("click",".datepicker-bottom-button:eq(1)",function(){
                        $(".datepicker").addClass("hidden-area");
                        datePicker_default_date = datePicker.find(".datepicker-combo-datecontent").text();
                    }).on("click","#lastMonth",function(){
                        if(datePicker_current_month === 1){
                            datePicker_current_month = 12;
                            datePicker_current_year = datePicker_current_year - 1;
                        } else {
                            datePicker_current_month = datePicker_current_month - 1;
                        }
                        initDateNumbers(datePicker_current_year,datePicker_current_month,datePicker_current_date);
                        datePicker.data("currentYear",datePicker_current_year);
                        datePicker.data("currentMonth",datePicker_current_month);
                        datePicker.data("currentDate",datePicker_current_date);
                    }).on("click", "#nextMonth",function(){
                        if(datePicker_current_month === 12){
                            datePicker_current_month = 1;
                            datePicker_current_year = datePicker_current_year + 1;
                        } else {
                            datePicker_current_month = datePicker_current_month + 1;
                        }
                        initDateNumbers(datePicker_current_year,datePicker_current_month,datePicker_current_date);
                        datePicker.data("currentYear",datePicker_current_year);
                        datePicker.data("currentMonth",datePicker_current_month);
                        datePicker.data("currentDate",datePicker_current_date);
                    });
                }
            }
        });
    }
)(jQuery);


