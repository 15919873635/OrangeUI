/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.extend({
            OrangeCharList:['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
            OrangeTagNames:["div","ul"],
            OrangeTypeList:["json","xml","text"],
            OrangeFitTag:function(tagName){
                var isFit = false;
                if(jQ.OrangeTagNames){
                    for(var index = 0 ; index < jQ.OrangeTagNames.length ; index ++){
                        if(tagName.toLowerCase() === jQ.OrangeTagNames[index]){
                            isFit = true;
                            break;
                        }
                    }
                }
                return isFit;
            },
            OrangeRandomId:function(){
                var whilecount = 0;
                var randomString = "";
                do{
                    var randomNum = Math.round(Math.random() * 100) ;
                    if(randomNum >= 0 && randomNum < 36){
                        randomString += jQ.OrangeCharList[randomNum];
                        whilecount += 1;
                    }
                } while(whilecount < 8);
                return randomString;
            },
            OrangeConstants:{
                DateFormats:{
                    FORMAT1:"yyyy/MM/dd",
                    FORMAT2:"yyyy-MM-dd",
                    FORMAT3:"yyyy年MM月dd日",
                    FORMAT4:"yyyy年MM月"
                }
            },
            OrangeUtil:{
                dateFormat:function(targetDate,targetFormat){
                    return targetFormat.replace("yyyy",targetDate.getFullYear()).replace("MM",targetDate.getMonth() + 1).replace("dd",targetDate.getDate());
                },
                isLeapYear:function(year){
                    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
                },
                getDaysInMonth:function(year, month){
                    return [31, (jQ.OrangeUtil.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
                },
                dismantDate:function(dateString){
                    var dateFormat1 = dateString.split(/\//);
                    if(dateFormat1 && dateFormat1.length === 3)
                        return {year:parseInt(dateFormat1[0]),month:parseInt(dateFormat1[1]),day:parseInt(dateFormat1[2])};
                    var dateFormat2 = dateString.split(/-/);
                    if(dateFormat2 && dateFormat2.length === 3)
                        return {year:parseInt(dateFormat2[0]),month:parseInt(dateFormat2[1]),day:parseInt(dateFormat2[2])};
                }
            },
            OrangeAjax:function(options){
                var ajaxUrl = options.url;
                var ajaxData = (options.data && jQ.isPlainObject(options.data)) ? options.data : {};
                var ajaxDataType = (jQ.type(options.dataType) === "string" && jQ.inArray(options.dataType.toLower(),jQ.OrangeTypeList),0) ? options.dataType : "json";
                var ajaxSucc = (options.success && jQ.isFunction(options.success)) ? options.success : new Function();
                var ajaxError = (options.error && jQ.isFunction(options.error)) ? options.error : new Function();
                jQ.ajax({
                    url:ajaxUrl,
                    type:"POST",
                    data:ajaxData,
                    dataType:ajaxDataType,
                    success:ajaxSucc,
                    error:ajaxError
                });
            },
            OrangePercentage:function(value){
                return jQ.type(value) === "string" ? (/^\d+%$/.test(value) ? true : false) : false;
            },
            OrangeRegExp:function(type,value){ 
                var isMatch = false;
                switch (type){
                    case "url":
                        var urlRegex = new RegExp('^[a-zA-z]+://(\\w+(-\\w+)*)(\\.(\\w+(-\\w+)*))*(\\?\\S*)?$'); 
                        isMatch =  urlRegex.test(value);
                        break;
                    default : break;    
                }  
                return isMatch;
            }
        });
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
                if(jQ.OrangeFitTag(button.get(0).tagName)){
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
            },
            OrangeComboBox:function(options){
                var combo = jQ(this),
                combo_default_width = 110,
                combo_default_height = 25,
                defaultOptions = initOptions(options),
                defaultMethods = initMethods(),
                hasInited = jQ.type(combo.data("hasInited")) === "undefined" ? false : combo.data("hasInited");
                if(jQ.OrangeFitTag(combo.get(0).tagName)){
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
                        combo.prop("id","combo_"+jQ.OrangeRandomId());
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
                                    jQ.OrangeAjax({
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
                                            var comDataId = jQ.type(comData.id) === "undefined" ? "li_"+jQ.OrangeRandomId() : comData.id ;
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
            },
            OrangeDatepicker:function(options){
                var datePicker = jQ(this),
                    datePicker_default_width = 150,
                    today = new Date(),
                    datePicker_default_format = jQ.OrangeConstants.DateFormats.FORMAT1,
                    datePicker_default_date = jQ.OrangeUtil.dateFormat(new Date(),datePicker_default_format),
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
                                var newDate = jQ.OrangeUtil.dismantDate(pickerDate);
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
                        var currentMonthDays = jQ.OrangeUtil.getDaysInMonth(year,month - 1),
                            dayInWeek = targetDate.getDay(),
                            lastMonthDays = 0,
                        dayInWeek = (dayInWeek === 0) ? 7 : dayInWeek;  
                        if(month === 1){
                            lastMonthDays = jQ.OrangeUtil.getDaysInMonth(year - 1,11);
                        } else{
                            lastMonthDays = jQ.OrangeUtil.getDaysInMonth(year,month - 2);
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
                    datePicker.find(".datepicker_number").remove();
                    for(var index = 0 ; index < currentPageDays.length ; index ++){
                        var $thisData = currentPageDays[index];
                        if($thisData.flag === "currentmonth" && $thisData.val === parseInt(day))
                            contentStr += "<div class='datepicker_number currentmonth datepicker_number_selected' data-month='"+$thisData.month+"'>"+$thisData.val+"</div>";
                        else
                            contentStr += "<div class='datepicker_number "+$thisData.flag+"' data-month='"+$thisData.month+"'>"+$thisData.val+"</div>";
                    }
                    datePicker.find(".datepicker_content").append(contentStr);
                    datePicker.find(".currentmonth").click(function(){
                        var $this = jQ(this),
                            $thisText = $this.text();
                        $this.siblings().removeClass("datepicker_number_selected");
                        $this.addClass("datepicker_number_selected");
                        var currentDate = new Date();
                        currentDate.setFullYear(datePicker_current_year);
                        currentDate.setMonth(datePicker_current_month - 1);
                        currentDate.setDate(parseInt($thisText));
                        datePicker_current_date = parseInt($thisText);
                        datePicker.data("currentDate",parseInt($thisText));
                        datePicker.find(".datepicker_combo_datecontent").text(jQ.OrangeUtil.dateFormat(currentDate,datePicker_default_format));
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
                    datePicker.find(".datepicker_combo_datecontent").text(jQ.OrangeUtil.dateFormat(currentDate,datePicker_default_format));
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
                        datePickerId = "datepicker_"+jQ.OrangeRandomId();
                        datePicker.prop("id",datePickerId);
                    }
                    if(!datePicker.hasClass("datepicker_combo"))
                        datePicker.addClass("datepicker_combo");
                    var datePickerStr = 
                    "<div class='datepicker_combo_table full_area'><div class='datepicker_combo_tr'><div class='datepicker_combo_td width_20px'><div class='datepicker_combo_icon'></div></div><div class='datepicker_combo_td full_width'><div class='datepicker_combo_datecontent'></div></div></div></div>"+
                    "<div class='datepicker hidden_area'><div class='datepicker_top'><div class='datepicker_combo_table full_area'><div class='datepicker_combo_tr'><div class='datepicker_combo_td width_20px lastMonth'>&Lt;</div><div class='datepicker_combo_td full_width fontSize_18' id='currentMonth'></div><div class='datepicker_combo_td width_20px nextMonth'>&Gt;</div></div></div></div>"+
                    "<div class='datepicker_content'><div class='datepicker_date'>"+datePicker_font_day+"</div><div class='datepicker_date'>"+datePicker_font_one+"</div><div class='datepicker_date'>"+datePicker_font_two+"</div><div class='datepicker_date'>"+datePicker_font_three+"</div><div class='datepicker_date'>"+datePicker_font_four+"</div><div class='datepicker_date'>"+datePicker_font_five+
                    "</div><div class='datepicker_date'>"+datePicker_font_six+"</div></div><div class='datepicker_bottom'><div class='datepicker_bottom_button'>取消</div><div class='datepicker_bottom_button'>确定</div></div></div>";
                    datePicker.append(datePickerStr);
                    defaultMethods.setWidth(defaultOptions.width);
                    initDateNumbers(datePicker_current_year,datePicker_current_month,datePicker_current_date);
                    
                    datePicker.on("click",".datepicker_combo_table",function(){
                        $(".datepicker").removeClass("hidden_area");
                    }).on("click",".datepicker_bottom_button:eq(0)",function(){
                        $(".datepicker").addClass("hidden_area");
                        datePicker.find(".datepicker_combo_datecontent").text(datePicker_default_date);
                        defaultMethods.setDate(datePicker_default_date);
                    }).on("click",".datepicker_bottom_button:eq(1)",function(){
                        $(".datepicker").addClass("hidden_area");
                        datePicker_default_date = datePicker.find(".datepicker_combo_datecontent").text();
                    }).on("click",".lastMonth",function(){
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
                    }).on("click", ".nextMonth",function(){
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
            },
            OrangeGrid:function(options){
                var orGrid = jQ(this),
                    grid_default_width = 600,
                    grid_default_height = 300,
                    grid_default_text = "新建列表",
                    grid_default_icon = "icon_window",
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    effectiveCount = jQ.type(orGrid.data("effectiveCount")) === "undefined" ? 0 : orGrid.data("effectiveCount"),
                    effectiveColumn = jQ.type(orGrid.data("effectiveColumn")) === "undefined" ? {} : orGrid.data("effectiveColumn"),
                    hasInited = jQ.type(orGrid.data("hasInited")) === "undefined" ? false : orGrid.data("hasInited");
                if(jQ.OrangeFitTag(orGrid.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                       _initGrid();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initGrid();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initGrid();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initGrid(){
                    if(!hasInited)
                        doInit();
                    orGrid.data("defaultOptions",defaultOptions);
                };
                function doInit(){
                    if(jQ.type(orGrid.prop("id")) === "undefined"){
                        orGrid.prop("id","grid_"+jQ.OrangeRandom());
                    };
                    if(!orGrid.hasClass("grid"))
                        orGrid.addClass("grid");
                    var gridWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : grid_default_width,
                        gridHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : grid_default_height,
                        titleClass = "",
                        gridTitle = jQ.isPlainObject(defaultOptions.title) ? (jQ.isEmptyObject(defaultOptions.title) ? null : defaultOptions.title) : null,
                        titleIcon = !jQ.isEmptyObject(gridTitle) ? (jQ.type(gridTitle.icon) === "string" ? gridTitle.icon : grid_default_icon) : grid_default_icon,
                        titleText = !jQ.isEmptyObject(gridTitle) ? (jQ.type(gridTitle.text) === "string" ? gridTitle.text : grid_default_text) : grid_default_text;
                    if(gridTitle === null)
                        titleClass = "hidden_area";
                    orGrid.css({"width":gridWidth+"px","height":gridHeight+"px"});
                    orGrid.empty();
                    var initGridString = 
                         "<div class='table'><div class='tr "+titleClass+"'><div class='td'>"+
                         "<div class='title'><div class='table fixed_layout'><div class='tr'><div class='td icon_width vertical_middle'><div class='ui_icon "+titleIcon+
                         "'></div></div><div class='td full_width vertical_middle hide_text text_indent'>"+titleText+"</div></div></div></div></div></div><div class='tr'><div class='td'>"+
                         "<div class='grid_center'><div class='thead'></div><div class='tbody'><div class='table'></div></div></div></div></div><div class='tr'><div class='td bottom'><div class='pager'></div></div></div></div>";
                    orGrid.append(initGridString);
                    initGridHeader();
                    initGridPager();
                    initDatas();
                    hasInited = true;
                    orGrid.data("hasInited",hasInited);
                };
                function initOptions(ops){
                    var orGridOptions = orGrid.data("defaultOptions");
                    if(jQ.type(orGridOptions) === "undefined"){
                        orGridOptions = {
                            url:"",
                            queryData:{},
                            width:grid_default_width,
                            height:grid_default_height,
                            title:{},
                            showPager:true,
                            columns:[],
                            pager:{
                                pageList:[20,30,50],
                                pageSize:10
                            },
                            data:{
                                totalPage:1,
                                currentPage:1,
                                list:[]
                            }
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        orGridOptions = jQ.extend(orGridOptions,ops);
                    return orGridOptions;
                };
                function initGridHeader(){
                    var columns = jQ.isPlainObject(defaultOptions.columns) ? [defaultOptions.columns] : jQ.isArray(defaultOptions.columns) ? defaultOptions.columns : [];
                    if(columns.length > 0){
                        var totalWidth = 0,
                            reserveCount = 0,
                            totalPercent = 0;
                        for(var index = 0 ; index < columns.length ; index ++){
                            var singData = columns[index];
                            if(jQ.isPlainObject(singData)){
                                if((jQ.type(singData.name) === "string" && jQ.trim(singData.name).length > 0 && 
                                    jQ.type(singData.fildName) === "string" && jQ.trim(singData.fildName).length > 0) ||
                                    (singData.checkbox === true && jQ.type(singData.checkName) === "string")){
                                    effectiveCount += 1;
                                    if(jQ.isNumeric(singData.width))
                                        totalWidth += parseInt(singData.width);
                                    else if(jQ.OrangePercentage(singData.width))
                                        totalPercent += parseInt(singData.width.substring(0,singData.width.length - 1));
                                    else
                                        reserveCount += 1;
                                }
                            }
                        }
                        if(effectiveCount > 0){
                            if(totalWidth > orGrid.width()){

                            }else{
                                if(totalPercent <= 100){
                                    var distWidth = orGrid.width() - totalWidth,
                                        theadTdStr = "";
                                    for(var index = 0 ;index < columns.length ; index ++){
                                        var singData = columns[index];
                                        if(jQ.isPlainObject(singData)){
                                            if((jQ.type(singData.name) === "string" && jQ.trim(singData.name).length > 0 &&
                                                jQ.type(singData.fildName) === "string" && jQ.trim(singData.fildName).length > 0) ||
                                                (singData.checkbox === true && jQ.type(singData.checkname) === "string")){
                                                var dataWidth = jQ.isNumeric(singData.width) ? singData.width : jQ.OrangePercentage(singData.width) ? parseInt((distWidth / 100) * parseInt(singData.width.substring(0,singData.width.length - 1))) : 0;
                                                if(dataWidth === 0)
                                                    dataWidth = (distWidth - parseInt((distWidth / 100) * totalPercent)) / reserveCount - 5;
                                                effectiveColumn[singData.fildName] = dataWidth;
                                                if(singData.checkbox === true){
                                                    theadTdStr += "<div style='width:"+dataWidth+"px'><input type='checkbox'></div>";
                                                }else{
                                                    theadTdStr += "<div style='width:"+dataWidth+"px'>"+singData.name+"</div>";
                                                }
                                           }
                                        }
                                    }
                                };
                                orGrid.find(".thead").append(theadTdStr);
                            };
                        };
                    }    
                    var tBodyHeight = orGrid.find(".grid_center").parent().height();
                    if(effectiveCount > 0){
                        tBodyHeight = tBodyHeight - orGrid.find(".thead").height();
                    }else
                        orGrid.find(".thead").addClass("hidden_area");
                    orGrid.find(".tbody").height(tBodyHeight);
                };
                function initGridPager(){
                    if(defaultOptions.showPager){
                        if(defaultOptions.pager){
                            var grid_bottom = orGrid.find(".bottom");
                            grid_bottom.children("div").OrangePager({
                                width:orGrid.width(),
                                height:grid_bottom.height(),
                                showBorder:false
                            });
                        }
                    }else
                        orGrid.find(".bottom").parent().addClass("hidden_area");
                };
                function initDatas(){
                    var dataOptions =  jQ.isPlainObject(defaultOptions.data) ? defaultOptions.data : {};
                    if(defaultOptions.url === ""){
                        var localData = jQ.isArray(dataOptions.list) ? dataOptions.list : [];
                        defaultMethods.setDatas(localData);
                    }else{
                        var remoteUrl = jQ.type(defaultOptions.url) === "string" ? defaultOptions.url : "";
                        var remoteQueryData = jQ.isPlainObject(dataOptions.queryData) ? dataOptions.queryData: {};
                        defaultMethods.loadDatas({url:remoteUrl,data:remoteQueryData,dataType:"json"});
                    }
                };
                function initMethods(){
                    var orGridMethods = orGrid.data("defaultMethods");
                    if(jQ.type(orGridMethods) === "undefined"){
                        orGridMethods = {
                            setWidth:function(gridWidth){
                                gridWidth = jQ.isPlainObject(gridWidth) ? (jQ.isNumeric(gridWidth[1]) ? gridWidth[1] : grid_default_width) : grid_default_width;
                                defaultOptions.width = gridWidth;
                                orGrid.width(gridWidth);
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            },
                            setHeight:function(gridHeight){
                                gridHeight = jQ.isPlainObject(gridHeight) ? (jQ.isNumeric(gridHeight[1]) ? gridHeight[1] : grid_default_height) : grid_default_height;
                                defaultOptions.height = gridHeight;
                                orGrid.width(gridHeight);
                            },
                            getHeight:function(){
                                return defaultOptions.height;
                            },
                            loadDatas:function(opts){
                                if(jQ.isPlainObject(opts)){
                                    opts.success = function(data){
                                        defaultMethods.setDatas(data);
                                    };
                                    jQ.OrangeAjax({
                                        url:opts.url,
                                        dataType:opts.dataType,
                                        data:opts.data,
                                        success:opts.success
                                    });
                                }
                            },
                            setDatas:function(gridDats){
                                orGrid.find(".tbody").children(".table").empty();
                                if(effectiveCount > 0){
                                    if(gridDats && jQ.isPlainObject(gridDats)){
                                        gridDats = [gridDats];
                                    }
                                    if(jQ.isArray(gridDats) && gridDats.length > 0 && jQ.isArray(defaultOptions.columns) && defaultOptions.columns.length > 0){
                                        var tbodyTrStr = "";
                                        for(var index = 0; index < gridDats.length ; index ++){
                                            var gridData = gridDats[index];
                                            if(jQ.isPlainObject(gridData)){
                                                tbodyTrStr += "<div class='tr'>";
                                                for(var fildKey in effectiveColumn){
                                                    var isCheckBox = false;
                                                    for(var index = 0 ; index < defaultOptions.columns.length ; index ++){
                                                        var dataIndex = defaultOptions.columns[index];
                                                        if(dataIndex.fildName === fildKey && dataIndex.checkbox === true){
                                                            isCheckBox = true;
                                                            break;
                                                        }    
                                                    }
                                                    if(isCheckBox === true){
                                                        tbodyTrStr += "<div class='td' style='width:"+effectiveColumn[fildKey]+"px;'><input type='checkbox' style='margin:0 auto;folat:left'></div>";
                                                    }else{
                                                        var contentString = gridData[fildKey];
                                                        if(contentString=== null || jQ.type(contentString) === "undefined")
                                                            contentString = "";
                                                        tbodyTrStr += "<div class='td' style='width:"+effectiveColumn[fildKey]+"px'>"+contentString+"</div>";
                                                    }
                                                }                                         
                                            } 
                                        }
                                        orGrid.find(".tbody").children(".table").append(tbodyTrStr);
                                    }
                                }
                            }
                        };
                    }
                    return orGridMethods;
                } 
            },
            OrangeFileBox:function(options){
                var fileBox = jQ(this),
                    file_default_width = 150,
                    file_default_height = 25,
                    file_button_default_text = "选择文件",
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(fileBox.data("hasInited")) === "undefined" ? false : fileBox.data("hasInited");
                if(jQ.OrangeFitTag(fileBox.get(0).tagName)){
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
                        fileBox.prop("id","file_"+jQ.OrangeRandomId());
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
            },
            OrangeProgressbar:function(options){
                var progressBar = jQ(this),
                    progress_default_width = 150,
                    progress_default_height = 25,
                    progress_default_prcentage = "0%",
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(progressBar.data("hasInited")) === "undefined" ? false : progressBar.data("hasInited");
                if(jQ.OrangeFitTag(progressBar.get(0).tagName)){
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
                        progressBar.prop("id","progress_"+jQ.OrangeRandomId());
                    };
                    if(!progressBar.hasClass("progress"))
                        progressBar.addClass("progress");
                    var proWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : progress_default_width,
                        proHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : progress_default_height,
                        proPrcentage = jQ.OrangePercentage(defaultOptions.percentage) ? defaultOptions.percentage : progress_default_prcentage;
                    proHeight = proHeight > 30 ? 30 : (proHeight < 5 ?  5 : proHeight);
                    progressBar.empty().append("<div class='progress_content'></div>").css({"width":proWidth+"px","height":proHeight+"px"});
                    initPercentage(proPrcentage);
                    hasInited = true;
                    progressBar.data("hasInited",hasInited);
                };
                function initPercentage(progressValue){
                    progressValue = jQ.isPlainObject(progressValue) ? progressValue[1] : progressValue;
                    progressValue = jQ.OrangePercentage(progressValue) ? progressValue : progress_default_prcentage;
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
            },
            OrangeSlidBar:function(options){
                var sildBar = jQ(this),
                    sild_default_width = 150,
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(sildBar.data("hasInited")) === "undefined" ? false : sildBar.data("hasInited");
                if(jQ.OrangeFitTag(sildBar.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initSlidBar();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initSlidBar();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initSlidBar();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initSlidBar(){
                    if(!hasInited)
                        doInit();
                    sildBar.data("defaultOptions",defaultOptions);
                };   
                function doInit(){
                    if(jQ.type(sildBar.prop("id")) === "undefined"){
                        sildBar.prop("id","slid_"+jQ.OrangeRandomId());
                    };
                    if(!sildBar.hasClass("button"))
                        sildBar.addClass("button");
                    var buttonWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : sild_default_width;
                    sildBar.css("width",buttonWidth+"px");
                    var initButtonString = "<div class='table fixed_layout cursor_hander'><div class='tr'><div class='td vertical_middle full_width text_center'><div class='inline_block'>"+
                                        "<div class='hide_text text_indent'>"+defaultOptions.text+"</div></div></div></div></div>";
                    sildBar.empty().append(initButtonString); 
                    hasInited = true;
                    sildBar.data("hasInited",hasInited);
                };
                function initOptions(ops){
                    var slidOptions = sildBar.data("defaultOptions");
                    if(jQ.type(slidOptions) === "undefined"){
                        slidOptions = {
                            width:sild_default_width,
                            callback:new Function()
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        slidOptions = jQ.extend(slidOptions,ops);
                    return slidOptions;
                };
                function initMethods(){
                    var buttonMethods = sildBar.data("defaultMethods");
                    if(jQ.type(buttonMethods) === "undefined"){
                        buttonMethods = {
                            setWidth:function(buttonWidth){
                                buttonWidth = jQ.isPlainObject(buttonWidth) ? (jQ.isNumeric(buttonWidth[1])? buttonWidth[1] : sild_default_width) : (jQ.isNumeric(buttonWidth) ? buttonWidth : sild_default_width);
                                defaultOptions.width = buttonWidth;
                                sildBar.width(buttonWidth);
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            }
                        };
                    }
                    return buttonMethods;
                } 
            },
            OrangeTabFolder:function(options){
                var tabFolder = jQ(this),
                    tabfolder_default_width = 600,
                    tabfolder_default_height = 400,
                    tab_default_width = 80,
                    tab_default_height = 25,
                    tab_default_title = "新建页签",
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(tabFolder.data("hasInited")) === "undefined" ? false : tabFolder.data("hasInited");
                if(jQ.OrangeFitTag(tabFolder.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initTabFolder();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initTabFolder();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initTabFolder();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initTabFolder(){
                    if(!hasInited)
                        doInit();
                    tabFolder.data("defaultOptions",defaultOptions);
                };  
                function doInit(){
                    if(jQ.type(tabFolder.prop("id")) === "undefined"){
                        tabFolder.prop("id","tabfolder_"+jQ.OrangeRandomId());
                    };
                    if(!tabFolder.hasClass("tabfolder"))
                        tabFolder.addClass("tabfolder");
                    var tabHeight = jQ.isNumeric(defaultOptions.tabHeight) ? defaultOptions.tabHeight : tab_default_height,
                        tabfolderWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : tabfolder_default_width,
                        tabfolderHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : tabfolder_default_height;
                    var initFileStr = "<div class='table fixed_layout'><div class='tr tabfolder_top_tr'><div class='td tabfolder_top_td'></div></div><div class='tr'><div class='td tabfolder_con_td'></div></div></div>";
                    tabFolder.empty().append(initFileStr).css({"width":tabfolderWidth+"px","height":tabfolderHeight+"px"});
                    tabFolder.find(".tabfolder_top_tr").css("height",(tabHeight + 2) + "px");
                    initTabs();
                    hasInited = true;
                    tabFolder.data("hasInited",hasInited);
                };
                function initTabs(){
                    var tabs = defaultOptions.tabs;
                    if(jQ.isPlainObject(tabs))
                        tabs = [defaultOptions.tabs];
                    if(jQ.isArray(tabs) && tabs.length > 0){
                        for(var index = 0 ; index < tabs.length ; index ++){
                            defaultMethods.addTab(tabs[index]);
                        }
                        tabFolder.find(".tab_normal").eq(0).trigger("click");
                    }
                };
                function initTab(tabId){
                    var tabWidth = jQ.isNumeric(defaultOptions.tabWidth) ? defaultOptions.tabWidth : tab_default_width,
                        tabHeight = jQ.isNumeric(defaultOptions.tabHeight) ? defaultOptions.tabHeight : tab_default_height;
                    tabFolder.find("#"+tabId)
                    .css({"height":tabHeight+"px","line-height":tabHeight+"px","width":tabWidth+"px"})
                    .click(function(){
                        tabFolder.find(".tab_normal").removeClass("tab_selected");
                        tabFolder.find(".tabfolder_con_td").children(".full_area").addClass("hidden_area");
                        var thisTab = jQ(this),
                            tabId = thisTab.prop("id"),
                            tabPanelId = tabId.substring(tabId.length - 12,tabId.length) + "_panel";
                        thisTab.addClass("tab_selected");
                        jQ("#"+tabPanelId).removeClass("hidden_area");
                    });
                    tabFolder.find("#"+tabId).trigger("click");    
                }
                function initOptions(ops){
                    var tabFolderOptions = tabFolder.data("defaultOptions");
                    if(jQ.type(tabFolderOptions) === "undefined"){
                        tabFolderOptions = {
                            width:tabfolder_default_width,
                            height:tabfolder_default_height,
                            tabWidth:tab_default_width,
                            tabHeight:tab_default_height,
                            tabs:[],
                            showBorder:true
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        tabFolderOptions = jQ.extend(tabFolderOptions,ops);
                    return tabFolderOptions;
                };
                function initMethods(){
                    var tabFolderMethods = tabFolder.data("defaultMethods");
                    if(jQ.type(tabFolderMethods) === "undefined"){
                        tabFolderMethods = {
                            setWidth:function(tabfolderWidth){
                                tabfolderWidth = jQ.isPlainObject(tabfolderWidth) ? (jQ.isNumeric(tabfolderWidth[1]) ? tabfolderWidth[1] : tabfolder_default_width) : tabfolder_default_width;
                                defaultOptions.width = tabfolderWidth;
                                tabFolder.width(tabfolderWidth);
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            },
                            setHeight:function(tabfolderHeight){
                                tabfolderHeight = jQ.isPlainObject(tabfolderHeight) ? (jQ.isNumeric(tabfolderHeight[1]) ? tabfolderHeight[1] : tabfolder_default_height) : tabfolder_default_height;
                                defaultOptions.width = tabfolderHeight;
                                tabFolder.width(tabfolderHeight);
                            },
                            getHeight:function(){
                                return defaultOptions.height;
                            },
                            getTabHeight:function(){
                                return defaultOptions.tabHeight;
                            },
                            getTabWidth:function(){
                                return defaultOptions.tabWidth;
                            },
                            selectTab:function(tabIndex){
                                tabIndex = jQ.isPlainObject(tabIndex) ? (jQ.isNumeric(tabIndex[1]) ? tabIndex[1] : 1) : (jQ.isNumeric(tabIndex) ? tabIndex : 1);
                                tabFolder.find(".tab_normal").eq(tabIndex).trigger("click");
                            },
                            addTab:function(tabOptions){
                                if(jQ.isPlainObject(tabOptions)){
                                    tabOptions = jQ.isPlainObject(tabOptions[1]) ? tabOptions[1] : tabOptions;
                                    var tabId = jQ.type(tabOptions.id) === "string" ? tabOptions.id + jQ.OrangeRandomId() + "_title": "tab_"+jQ.OrangeRandomId()+"_title",
                                        tabTitle = jQ.type(tabOptions.title) === "string" ? tabOptions.title : tab_default_title,
                                        tabPanelId = tabId.substring(tabId.length - 12,tabId.length) + "_panel",
                                        tabPanelContent = jQ.type(tabOptions.content) === "string" ? tabOptions.content : "";
                                    if(jQ.OrangeRegExp("url",tabPanelContent)){
                                        tabPanelContent = "<iframe class='tab_iframe' src='"+tabPanelContent+"'></iframe>";
                                    }
                                    tabFolder.find(".tabfolder_top_td").append("<div class='tab_normal hide_text' id='"+tabId+"'>"+tabTitle+"</div>");
                                    tabFolder.find(".tabfolder_con_td").append("<div class='full_area hidden_area' id='"+tabPanelId+"'>"+tabPanelContent+"</div>");
                                    tabFolder.find(".tab_iframe").css("height",(tabFolder.find(".tabfolder_con_td").height() - 2) + "px");
                                    initTab(tabId);
                                }
                            },
                            removeTab:function(tabIndex){
                                tabIndex = jQ.isPlainObject(tabIndex) ? (jQ.isNumeric(tabIndex[1]) ? tabIndex[1] : 1) : (jQ.isNumeric(tabIndex) ? tabIndex : 1);
                                tabFolder.find(".tab_normal").eq(tabIndex).remove();
                            }
                        };
                    };
                    return tabFolderMethods;
                }
            },
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
            },
            OrangeSearchBox:function(options){
                var searchbox = jQ(this),
                    searchbox_default_width = 100,
                    searchbox_default_height = 25,
                    searchbox_default_align = "right",
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(searchbox.data("hasInited")) === "undefined" ? false : searchbox.data("hasInited");
                if(jQ.OrangeFitTag(searchbox.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initSearchBox();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initSearchBox();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initSearchBox();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initSearchBox(){
                    if(!hasInited)
                        doInit();
                    searchbox.data("defaultOptions",defaultOptions);
                };  
                function doInit(){
                    if(jQ.type(searchbox.prop("id")) === "undefined"){
                        searchbox.prop("id","searchbox_"+jQ.OrangeRandomId());
                    }
                    if(!searchbox.hasClass("searchbox"))
                        searchbox.addClass("searchbox");
                    var iconString = "<div class='td icon_search width_20px cursor_hander vertical_middle'><div class='icon_search width_16px full_height'></div></div>";
                    var inputString = "<div class='td full_width'><input type='text'></div>";
                    var initSearchBoxString = "<div class='table fixed_layout'><div class='tr'>";
                    if(defaultOptions.iconAlign === "left"){
                        initSearchBoxString += iconString + inputString;
                    } else if(defaultOptions.iconAlign === "right"){
                        initSearchBoxString += inputString + iconString;
                    }
                    initSearchBoxString += "</div></div>";
                    searchbox
                            .empty()
                            .css({"width":defaultOptions.width+"px","height":defaultOptions.height+"px"})
                            .append(initSearchBoxString)
                            .on("click",".icon_search",function(event){
                                event.stopPropagation();
                                if(jQ.isFunction(defaultOptions.callback))
                                    (defaultOptions.callback)();
                            });
                };    
                function initOptions(ops){
                    var searchBoxOptions = searchbox.data("defaultOptions");
                    if(jQ.type(searchBoxOptions) === "undefined"){
                        searchBoxOptions = {
                            url:"",
                            queryData:{},
                            width:searchbox_default_width,
                            height:searchbox_default_height,
                            iconAlign:searchbox_default_align,
                            callback:new Function()
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        searchBoxOptions = jQ.extend(searchBoxOptions,ops);
                    return searchBoxOptions;
                };
                function initMethods(){
                    var searchBoxMethods = searchbox.data("defaultMethods");
                    if(jQ.type(searchBoxMethods) === "undefined"){
                        searchBoxMethods = {
                            setWidth:function(searchBoxWidth){
                                searchBoxWidth = jQ.isArray(searchBoxWidth) ? searchBoxWidth[1] : jQ.isNumeric(searchBoxWidth) ? searchBoxWidth : searchbox_default_width;
                                defaultOptions.width = searchBoxWidth;
                                searchbox.width(searchBoxWidth);
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            }
                        };
                        searchbox.data("defaultMethods",searchBoxMethods);
                    }
                    return searchBoxMethods;
                };    
            },
            OrangeTree:function(options){
                var tree = jQ(this),
                    tree_default_width = 200,
                    tree_default_height = 300,
                    tree_default_state = "close",
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(tree.data("hasInited")) === "undefined" ? false : tree.data("hasInited");
                if(jQ.OrangeFitTag(tree.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initTree();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initTree();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initTree();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function assemTreeNodeString(nodeLevel,nodeArray){
                    var treeNodes = "";
                    if(jQ.isPlainObject(nodeArray))
                        nodeArray = [nodeArray];
                    if(jQ.isArray(nodeArray) && nodeArray.length > 0){
                        nodeLevel += 1;
                        var nodeLineWidth = defaultOptions.width - nodeLevel * 20;
                        for(var index = 0 ; index < nodeArray.length ; index ++){
                            var $thisData = nodeArray[index],
                                $thisStateClass = "arrow_down",
                                $thisStateOpen = "";
                            treeNodes += "<table class='fixed_layout tree_parent_node' style='width: "+nodeLineWidth+"px;'>";
                            if(jQ.type($thisData.id) === "undefined")
                                $thisData.id = "tree_node_"+jQ.OrangeRandomId();
                            if(jQ.type($thisData.text) === "undefined")
                                $thisData.text = "";
                            if($thisData.state === tree_default_state){
                                $thisStateClass = "arrow_right";
                                $thisStateOpen = "hidden_area";
                            }    
                            if($thisData.children && $thisData.children.length > 0){
                                treeNodes += "<tr id='"+$thisData.id+"'><td class='width_20px'><div class='"+$thisStateClass+" cursor_hander'></div></td><td class='icon_unchecked width_16px cursor_hander'></td><td class='full_width hide_text vertical_middle fontSize_16 text_indent' title='"+$thisData.text+"'>"+$thisData.text+"</td></tr><tr class='"+$thisStateOpen+"'><td class='width_20px'></td><td class='width_16px'></td><td class='full_width'>";
                                treeNodes += assemTreeNodeString(nodeLevel,$thisData.children);
                                treeNodes += "</td></tr>";
                            } else{
                                treeNodes += "<tr id='"+$thisData.id+"'><td class='width_20px'></td><td class='icon_unchecked width_16px cursor_hander'></td><td class='full_width hide_text vertical_middle fontSize_16 text_indent' title='"+$thisData.text+"'>"+$thisData.text+"</td></tr>";
                            }
                            treeNodes += "</table>";
                        } 
                    }
                    return treeNodes;
                };
                function initOptions(ops){
                    var treeOptions = tree.data("defaultOptions");
                    if(jQ.type(treeOptions) === "undefined"){
                        treeOptions = {
                            url:"",
                            queryData:{},
                            width:tree_default_width,
                            height:tree_default_height,
                            datas:[]
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        treeOptions = jQ.extend(treeOptions,ops);
                    return treeOptions;
                };
                function _initTree(){
                    if(!hasInited)
                        doInit();
                    tree.data("defaultOptions",defaultOptions);
                };
                function doInit(){
                    if(jQ.type(tree.prop("id")) === "undefined"){
                        tree.prop("id","tree_"+jQ.OrangeRandomId());
                    }
                    if(!tree.hasClass("tree"))
                        tree.addClass("tree");
                    tree.empty()
                        .css({"width":defaultOptions.width+"px","height":defaultOptions.height+"px"})
                        .append(assemTreeNodeString(0,defaultOptions.datas))
                        .on("click",".arrow_down",function(){
                            var $thisData = jQ(this);
                            $thisData.parent().parent().siblings().fadeOut("fast","linear");
                            $thisData.removeClass("arrow_down").addClass("arrow_right");
                        })
                        .on("click",".arrow_right",function(){
                            var $thisData = jQ(this);
                            $thisData.parent().parent().siblings().fadeIn("fast","linear");
                            $thisData.removeClass("arrow_right").addClass("arrow_down");
                        });
                };
                function initMethods(){
                    var treeMethods = tree.data("defaultMethods");
                    if(jQ.type(treeMethods) === "undefined"){
                        treeMethods = {
                            setWidth:function(treeWidth){
                                treeWidth = jQ.isArray(treeWidth) ? treeWidth[1] : jQ.isNumeric(treeWidth) ? treeWidth : tree_default_width;
                                defaultOptions.width = treeWidth;
                                tree.width(treeWidth);
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            },
                            setHeight:function(treeHeight){
                                treeHeight = jQ.isArray(treeHeight) ? treeHeight[1] : jQ.isNumeric(treeHeight) ? treeHeight : tree_default_height;
                                defaultOptions.height = treeHeight;
                                tree.height(treeHeight);
                            },
                            getHeight:function(){
                                return defaultOptions.height;
                            },
                            changeState:function(nodeId,state){
                                if(state === "close")
                                    tree.find("#"+nodeId).fadeOut();
                                else
                                    tree.find("#"+nodeId).fadeIn();
                            },
                            getNode:function(nodeId){
                                return tree.find("#"+nodeId);
                            },
                            getParent:function(nodeId){
                                return tree.find("#"+nodeId).parent();
                            },
                            loadDatas:function(opts){
                                if(jQ.isPlainObject(opts)){
                                    opts.success = function(data){
                                        defaultMethods.setDatas(data);
                                    };
                                    jQ.OrangeAjax({
                                        url:opts.url,
                                        dataType:opts.dataType,
                                        data:opts.data,
                                        success:opts.success
                                    });
                                }
                            },
                            setDatas:function(datasArray){
                                if(jQ.isPlainObject(datasArray) && !jQ.isEmptyObject(datasArray)){
                                    datasArray = [datasArray];
                                }
                                if(jQ.isArray(datasArray) && datasArray.length > 0){
                                    defaultOptions.datas = datasArray;
                                    tree.empty().append(assemTreeNodeString(0,datasArray));
                                }
                            },
                            getDatas:function(){
                                return defaultOptions.datas;
                            }
                        };
                        tree.data("defaultMethods",treeMethods);
                    }
                    return treeMethods;
                }; 
            }
        });
    }
)(jQuery);


