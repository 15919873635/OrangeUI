/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            AutoComplete:function(options){
                var ajBox = jQ(this).size() > 1 ? jQ(this).first() : jQ(this),
                    ajbox_default_width = 100,
                    ajbox_default_height = 25,
                    ajbox_before_value = "",
                    ajbox_after_value = "",
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(ajBox.data("hasInited")) === "undefined" ? false : ajBox.data("hasInited");
                if(jQ.isPlainObject(options) || jQ.type(options) === "undefined"){
                    if(!hasInited)
                        doInit();
                    ajBox.data("defaultOptions",defaultOptions);
                }
                function doInit(){
                    if(jQ.type(ajBox.attr("id")) === "undefined"){
                        ajBox.attr("id","ajaxBox_"+jQ.OrangeRandomId());
                    };
                    if(!ajBox.hasClass("ajaxbox")){
                        ajBox.addClass("ajaxbox");
                    }
                    var ajBoxWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : ajbox_default_width,
                        ajBoxHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : ajbox_default_height;
                    ajBox.css({"width":ajBoxWidth+"px","height":ajBoxHeight+"px"});
                    var initAjaxBoxString = "<input type='text' class='text_indent'><ul class='hidden_area'></ul>";
                    ajBox.empty().append(initAjaxBoxString); 
                    ajBox.find("input").css({"width":ajBox.width()+"px","height":ajBox.height()+"px"});
                    ajBox.on("keydown","input",function(){
                        ajbox_before_value = jQ.trim(ajBox.find("input").val());
                    }).on("keyup","input",function(event){
                        var key = event.keyCode;
                        ajbox_after_value = jQ.trim(ajBox.find("input").val());
                        if(key === 40 || key === 38 || key === 13){
                            if(key === 13){
                                ajBox.find("ul").addClass("hidden_area");
                                (defaultOptions.onSubmit)(ajbox_after_value);
                            }else{
                                if(key === 40){
                                    var index = ajBox.find("ul .ajaxbox_selected").index();
                                    if(index === -1 || (index === ajBox.data("targetDataSize") - 1))
                                        index = 0;
                                    else
                                        index += 1;
                                }else if(key === 38){
                                    var index = ajBox.find("ul .ajaxbox_selected").index();
                                    if(index === -1 || index === 0){
                                        index = ajBox.data("targetDataSize") - 1;
                                    }else{
                                        index -= 1;
                                    }
                                }
                                if(!ajBox.find("ul").hasClass("hidden_area")){
                                    ajBox.find("ul li").removeClass("ajaxbox_selected");
                                    var selectedLi = ajBox.find("ul li").eq(index);
                                    selectedLi.addClass("ajaxbox_selected");
                                    ajBox.find("input").val(selectedLi.text());
                                }
                            }
                        }else{
                            if(ajbox_before_value === "" && defaultOptions.url !== ""){
                                var remoteUrl = jQ.type(defaultOptions.url) === "string" ? defaultOptions.url : "";
                                var remoteData = jQ.isPlainObject(defaultOptions.queryData) ? defaultOptions.queryData : {};
                                defaultMethods.loadDatas({url:remoteUrl,data:remoteData,dataType:"json"});
                            }else if(ajbox_after_value === ""){
                                ajbox_before_value = "";
                                ajBox.find("ul").addClass("hidden_area");
                                ajBox.data("targetDataSize",0);
                            }else{
                                var localData = jQ.isArray(defaultOptions.datas) ? defaultOptions.datas : [];
                                if(localData.length > 0)
                                    defaultMethods.setDatas(localData);
                                else
                                    ajBox.find("ul").addClass("hidden_area");
                            }
                        }
                    }).on("click","li",function(){
                        ajBox.find("input").val($(this).text());
                        ajBox.find("ul").addClass("hidden_area");
                    }).on("click","input",function(){
                        if(ajBox.data("targetDataSize") > 0)
                            ajBox.find("ul").removeClass("hidden_area");
                    });
                    ajBox.data("hasInited",hasInited);
                }
                function initOptions(ops){
                    var ajaxBoxOptions = ajBox.data("defaultOptions");
                    if(jQ.type(ajaxBoxOptions) === "undefined"){
                        ajaxBoxOptions = {
                            width:100,
                            height:25,
                            url:"",
                            queryData:{},
                            datas:[],
                            searchButton:false,
                            onSubmit:new Function,
                            onLoadSuccess:new Function
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        ajaxBoxOptions = jQ.extend(ajaxBoxOptions,ops);
                    return ajaxBoxOptions;
                }
                function initMethods(){
                    var ajBoxMethods = ajBox.data("defaultMethods");
                    if(jQ.type(ajBoxMethods) === "undefined"){
                        ajBoxMethods = {
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
                                ajBox.find("ul").empty();
                                var targetdatas = [];
                                for(var index = 0 ; index < comboDats.length ; index ++){
                                    var indexData = comboDats[index];
                                    if(indexData.indexOf(ajbox_after_value) > -1){
                                        targetdatas.push(indexData);
                                    }
                                }if(targetdatas.length > 0){
                                    var datasArrStr = "";
                                    for(var index = 0; index < targetdatas.length ; index ++){
                                        var comData = targetdatas[index];
                                        datasArrStr += "<li>"+comData+"</li>";
                                    }
                                    ajBox.find("ul").append(datasArrStr).removeClass("hidden_area");
                                    ajBox.data("targetDataSize",targetdatas.length);
                                }
                                else{
                                    ajBox.find("ul").addClass("hidden_area");
                                    ajBox.data("targetDataSize",0);
                                }
                            }
                        };
                    }
                    return ajBoxMethods;
                }
            }
        });
    }
)(jQuery);


