/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            OrangeBoard: function(options){
                var board = jQ(this),
                board_default_width = 250,
                board_default_height = 300,
                defaultOptions = initOptions(options),
                defaultMethods = initMethods(),
                hasInited = jQ.type(board.data("hasInited")) === "undefined" ? false : board.data("hasInited");
                if(jQ.OrangeFitTag(board.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initBoard();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initBoard();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initBoard();
                            defaultMethods[options](arguments);
                        }
                    }
                }
                function _initBoard(){
                    if(!hasInited)
                        doInit();
                    board.data("defaultOptions",defaultOptions);
                }
                function doInit(){
                    if(jQ.type(board.prop("id")) === "undefined"){
                        board.prop("id","board_"+jQ.OrangeRandomId());
                    };
                    if(!board.hasClass("board"))
                        board.addClass("board");
                    var boardWidth = jQ.isNumeric(defaultOptions.width) ? defaultOptions.width : board_default_width,
                        boardHeight = jQ.isNumeric(defaultOptions.height) ? defaultOptions.height : board_default_height;    
                    board.css({"width": boardWidth+"px","min-height":boardHeight+"px"});    
                    var initBoardString = "<div class='board-header'><div class='board-title'></div><div class='board-add'></div></div>" + 
                            "<div class='board-body'><textarea class='board-new-block'></textarea><div class='board-button-block'>" + 
                            "<button class='btn btn-primary'>Add</button><button class='btn'>Cancel</button></div><div class='board-note-list'></div></div>";
                    board.empty().append(initBoardString); 
                    hasInited = true;
                    board.data("hasInited", hasInited);
                }  
                function initOptions(ops){
                    var boardOptions = board.data("defaultOptions");
                    if(jQ.type(boardOptions) === "undefined"){
                        boardOptions = {
                            width: board_default_width,
                            height: board_default_height,
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        boardOptions = jQ.extend(boardOptions,ops);
                    return boardOptions;
                }  
                function initMethods(){
                    var boardMethods = board.data("defaultMethods");
                    if(jQ.type(boardMethods) === "undefined"){
                        boardMethods = {}
                    }
                    return boardMethods;
                }        
            }
        })
    }
)(jQuery);