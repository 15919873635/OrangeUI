/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            OrangeGrid:function(options){
                var orGrid = jQ(this),
                    grid_default_width = 600,
                    grid_default_height = 300,
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
            }
        });
    }
)(jQuery);


