/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.extend({
            IfCharList:['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
            IfTagNames:["div","ul"],
            IfTypeList:["json","xml","text"],
            IfFitTag:function(tagName){
                var isFit = false;
                if(jQ.IfTagNames){
                    for(var index = 0 ; index < jQ.IfTagNames.length ; index ++){
                        if(tagName.toLowerCase() === jQ.IfTagNames[index]){
                            isFit = true;
                            break;
                        }
                    }
                }
                return isFit;
            },
            IfRandomId:function(){
                var whilecount = 0;
                var randomString = "";
                do{
                    var randomNum = Math.round(Math.random() * 100) ;
                    if(randomNum >= 0 && randomNum < 36){
                        randomString += jQ.IfCharList[randomNum];
                        whilecount += 1;
                    }
                } while(whilecount < 8);
                return randomString;
            },
            IfConstants:{
                DateFormats:{
                    FORMAT1:"yyyy/MM/dd",
                    FORMAT2:"yyyy-MM-dd",
                    FORMAT3:"yyyy年MM月dd日",
                    FORMAT4:"yyyy年MM月"
                }
            },
            IfUtil:{
                dateFormat:function(targetDate,targetFormat){
                    return targetFormat.replace("yyyy",targetDate.getFullYear()).replace("MM",targetDate.getMonth() + 1).replace("dd",targetDate.getDate());
                },
                isLeapYear:function(year){
                    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
                },
                getDaysInMonth:function(year, month){
                    return [31, (jQ.IfUtil.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
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
            IfAjax:function(options){
                var ajaxUrl = options.url;
                var ajaxData = (options.data && jQ.isPlainObject(options.data)) ? options.data : {};
                var ajaxDataType = (jQ.type(options.dataType) === "string" && jQ.inArray(options.dataType.toLower(),jQ.IfTypeList),0) ? options.dataType : "json";
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
            IfPercentage:function(value){
                return jQ.type(value) === "string" ? (/^\d+%$/.test(value) ? true : false) : false;
            },
            IfRegExp:function(type,value){ 
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
    }
)(jQuery);


