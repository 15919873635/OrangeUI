/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
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
            }
        });
    }
)(jQuery);


