/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
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
                                treeNodes += "<tr id='"+$thisData.id+"'><td class='width_14px'><div class='"+$thisStateClass+" cursor_hander'></div></td><td class='icon_unchecked width_16px cursor_hander'></td><td class='full_width hide_text vertical_middle fontSize_16 text_indent_3px' title='"+$thisData.text+"'>"+$thisData.text+"</td></tr><tr class='"+$thisStateOpen+"'><td class='width_14px'></td><td class='width_16px'></td><td class='full_width'>";
                                treeNodes += assemTreeNodeString(nodeLevel,$thisData.children);
                                treeNodes += "</td></tr>";
                            } else{
                                treeNodes += "<tr id='"+$thisData.id+"'><td class='width_14px'></td><td class='icon_unchecked width_16px cursor_hander'></td><td class='full_width hide_text vertical_middle fontSize_16 text_indent_3px' title='"+$thisData.text+"'>"+$thisData.text+"</td></tr>";
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
                        }).on("click",".icon_unchecked",function(){
                            var $thisData = jQ(this);
                            $thisData.removeClass("icon_unchecked").addClass("icon_checked");
                        }).on("click",".icon_checked",function(){
                            var $thisData = jQ(this);
                            $thisData.removeClass("icon_checked").addClass("icon_unchecked");
                        })
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
                                    tree.find("#"+nodeId).fadeOut("fast","linear");
                                else
                                    tree.find("#"+nodeId).fadeIn("fast","linear");
                            },
                            getNode:function(nodeId){
                                return tree.find("#"+nodeId);
                            },
                            getParent:function(nodeId){
                                return tree.find("#"+nodeId).parent();
                            },
                            checkNode:function(nodeId){
                                checkNode(nodeId);
                            },
                            uncheckNode:function(nodeId){
                                uncheckNode(nodeId);
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
                function checkNode(nodeId){
                    
                };
                function unCheckNode(nodeId){

                };
            }
        });
    }
)(jQuery);


