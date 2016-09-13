/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;(
    function(jQ){
        jQ.fn.extend({
            OrangeVideoPlayer:function(options){
                var videoPlay = jQ(this),
                    video_default_width = 600,
                    video_default_height = 500,
                    defaultOptions = initOptions(options),
                    defaultMethods = initMethods(),
                    hasInited = jQ.type(videoPlay.data("hasInited")) === "undefined" ? false : videoPlay.data("hasInited");
                if(jQ.OrangeFitTag(videoPlay.get(0).tagName)){
                    if(jQ.isPlainObject(options) || jQ.type(options) === "undefined")
                        _initVideoPlay();
                    if(jQ.type(options) === "string"){
                        if(/^set\w+/.test(options)){
                            defaultMethods[options](arguments);
                            _initVideoPlay();
                        }else if(/^get\w+/.test(options)){
                            return defaultMethods[options]();
                        }else{
                            _initVideoPlay();
                            defaultMethods[options](arguments);
                        }
                    }
                };
                function initOptions(ops){
                    var videoPlayerOptions = videoPlay.data("defaultOptions");
                    if(jQ.type(videoPlayerOptions) === "undefined"){
                        videoPlayerOptions = {
                            width:video_default_width,
                            height:video_default_height
                        };
                    }
                    if(jQ.isPlainObject(ops))
                        videoPlayerOptions = jQ.extend(videoPlayerOptions,ops);
                    return videoPlayerOptions;
                };
                function _initVideoPlay(){
                    if(!hasInited)
                        doInit();
                    videoPlay.data("defaultOptions",defaultOptions);
                };
                function initMethods(){
                    var videoPlayMethods = videoPlay.data("defaultMethods");
                    if(jQ.type(videoPlayMethods) === "undefined"){
                        videoPlayMethods = {
                            setProgress:function(progress){
                                
                            },
                            start:function(){
                                
                            },
                            stop:function(){
                                
                            },
                            getProgress:function(){
                                
                            }
                        };
                        videoPlay.data("defaultMethods",videoPlayMethods);
                    };
                    return videoPlayMethods;
                }; 
            }
        });
    }
)(jQuery);


