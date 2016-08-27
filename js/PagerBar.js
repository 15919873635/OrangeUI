/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            IfProgressBar:function(options){
                var pagerBar = jQ(this),
                pager_default_width = 300,
                pager_default_height = 35,
                pager_default_pagesize = 10,
                pager_default_pagelist = [10,50,100],
                pager_default_totalpage = 1,
                pager_default_currentpage = 1,
                pager_first_text = "首页",
                pager_last_text = "尾页",
                pager_pre_text = "上页",
                pager_next_text = "下页",
                pager_right_num1="第",
                pager_right_num2="页，共",
                pager_right_num3="页",
                defaultOptions = initOptions(options),
                defaultMethods = initMethods(),
                hasInited = jQ.type(pagerBar.data("hasInited")) === "undefined" ? false : pagerBar.data("hasInited");
                if(jQ.IfFitTag(pagerBar.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initPager();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initPager();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initPager();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function _initPager(){
                    if(!hasInited)
                        doInit();
                    pagerBar.data("defaultOptions",defaultOptions);
                };   
                function doInit(){
                    if(jQ.type(pagerBar.prop("id")) === "undefined"){
                        pagerBar.prop("id","pager_"+jQ.IfRandomId());
                    };
                    if(!pagerBar.hasClass("pager"))
                        pagerBar.addClass("pager");
                    var pagerWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : pager_default_width,
                        pagerHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : pager_default_height;
                    pagerHeight = pagerHeight > 50 ? 50 : pagerHeight;
                    pagerBar.css({"width":pagerWidth+"px","height":pagerHeight+"px"});
                    var initPagerString = 
                         "<div class='table fixed_layout'><div class='tr'><div class='td vertical_middle pager_combo'><div class='combo'></div></div><div class='td vertical_middle full_width'><div class='pager_center_content'><div class='pager_first'>"+pager_first_text+"</div><div class='pager_pre'>"+pager_pre_text+"</div>"+
                         "<div class='pager_number_content'></div><div class='pager_last'>"+pager_last_text+"</div><div class='pager_next'>"+pager_next_text+"</div></div></div><div class='td vertical_middle pager_right_font'>"+
                         "<div class='full_area'><div class='pager_right'>"+pager_right_num1+"</div><div class='pager_currentnumber'></div><div class='pager_right'>"+pager_right_num2+"</div><div class='pager_totalnumber'></div><div class='pager_right'>"+pager_right_num3+"</div></div></div></div></div>";
                    pagerBar.empty().append(initPagerString); 
                    initPagerData();
                    initPagerLayout();
                    hasInited = true;
                    pagerBar.data("hasInited",hasInited);
                };
                function initPagerData(){
                    var dataList = [];
                    if(jQ.isArray(defaultOptions.pageList)){
                        for(var index = 0 ; index < defaultOptions.pageList.length ; index ++){
                            dataList.push({id:jQ.IfRandomId(),text:defaultOptions.pageList[index]});
                        }
                    }
                    pagerBar.find(".combo").IfComboBox({width:40,height:21,datas:dataList});
                    pagerBar.find(".full_area").css({"line-height":pagerBar.height()+"px"});
                    pagerBar.find(".pager_currentnumber").text(defaultOptions.currentPage);
                    pagerBar.find(".pager_totalnumber").text(defaultOptions.totalPage);
                };
                function initPagerLayout(){
                    if(!defaultOptions.showBorder)
                        pagerBar.css({"border":"0px"});
                    var number_content_width = pagerBar.find(".pager_center_content").width() - pagerBar.find(".pager_pre").width() * 4 - 90; 
                    var targetWidth = (30 * defaultOptions.totalPage) - 10;
                    var number_content_text = "";
                    if(targetWidth > number_content_width){
                        var counts = Math.floor((number_content_width + 10) / 30);
                        if(counts % 2 === 1){
                            var showPreCounts = Math.floor(counts / 2);
                            for(var index = 1 ; index <= showPreCounts; index ++){
                                number_content_text += "<div class='pager_number'>"+index+"</div>";
                            }
                            number_content_text += "<div class='pager_number'>...</div>";
                            for(var index = defaultOptions.totalPage - showPreCounts + 1 ; index <= defaultOptions.totalPage ; index ++){
                                number_content_text += "<div class='pager_number'>"+index+"</div>";
                            }
                        }
                        else{
                            var showPreCounts = Math.floor(counts / 2);
                            for(var index = 1 ; index <= showPreCounts; index ++){
                                number_content_text += "<div class='pager_number'>"+index+"</div>";
                            }
                            number_content_text += "<div class='pager_number'>...</div>";
                            for(var index = defaultOptions.totalPage - showPreCounts + 2 ; index <= defaultOptions.totalPage ; index ++){
                                number_content_text += "<div class='pager_number'>"+index+"</div>";
                            }
                        }
                        pagerBar.find(".pager_number_content").html(number_content_text);
                    }else{
                        for(var index = 1 ; index <= defaultOptions.totalPage; index ++){
                            number_content_text += "<div class='pager_number'>"+index+"</div>";
                        }
                        pagerBar.find(".pager_number_content").html(number_content_text).css({"width":targetWidth+"px"});
                        pagerBar.find(".pager_center_content").width(pagerBar.find(".pager_pre").width() * 4 + 90 + targetWidth);
                    }                 
                };
                function initOptions(ops){
                    var pagerBarOptions = pagerBar.data("defaultOptions");
                    if(jQ.type(pagerBarOptions) === "undefined"){
                        pagerBarOptions = {
                            width:pager_default_width,
                            height:pager_default_height,
                            pageSize:pager_default_pagesize,
                            pageList:pager_default_pagelist,
                            totalPage:pager_default_totalpage,
                            currentPage:pager_default_currentpage,
                            showBorder:true
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        pagerBarOptions = jQ.extend(pagerBarOptions,ops);
                    return pagerBarOptions;
                };
                function initMethods(){
                    var pagerBarMethods = pagerBar.data("defaultMethods");
                    if(jQ.type(pagerBarMethods) === "undefined"){
                        pagerBarMethods = {
                            setWidth:function(pagerWidth){
                                pagerWidth = jQ.isPlainObject(pagerWidth) ? (jQ.isNumeric(pagerWidth[1]) ? pagerWidth[1] : pager_default_width) : pager_default_width;
                                defaultOptions.width = pagerWidth;
                                pagerBar.width(pagerWidth);
                                initPagerLayout();
                            },
                            getWidth:function(){
                                return defaultOptions.width;
                            },
                            setHeight:function(textHeight){
                                textHeight = jQ.isPlainObject(textHeight) ? (jQ.isNumeric(textHeight[1]) ? textHeight[1] : pager_default_height) : pager_default_height;
                                textHeight = textHeight > 30 ? 30 : textHeight;
                                defaultOptions.width = textHeight;
                                pagerBar.width(textHeight);
                            },
                            getHeight:function(){
                                return defaultOptions.height;
                            },
                            getPageSize:function(){
                                return defaultOptions.pageSize;
                            },
                            getPageList:function(){
                                return defaultOptions.pageList;
                            },
                            getTotalPage:function(){
                                return defaultOptions.totalPage;
                            },
                            getCurrentPage:function(){
                                return defaultOptions.currentPage;
                            }
                        };
                    };
                    return pagerBarMethods;
                }  
            }
        });
    }
)(jQuery);


