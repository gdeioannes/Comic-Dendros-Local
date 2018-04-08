(function( $ ){

    var methods = {
        data:null,

        init : function(options) {
            var settings = {
                "first" : 1,
                "useNav":true,
                "useKeyboard":true,
                "centerContents":true,
                "pageNav": true
            };

            return this.each(function() {
                if (options)
                    $.extend( settings, options );

                var target = $(this);
                var slides = target.children();
                
                methods.data = {
                    "target": target,
                    "slides": slides,
                    "count": slides.length,
                    "current": settings.first,
                    "step":0,
                    "stepsCount":0,
                    "settings": settings
                }
                
                if (settings.centerContents){
                    var h = target.height();
                    var h2;
                    slides.each(function(){
                        h2 = $(this).height();
                        if ((h - h2) > 0)
                            $(this).css("margin-top",(h - h2)*0.5);
                    })
                }
                
                
                if (settings.useNav){
                    // Create navigators and register events
                    $("#main").bind("click.slides", methods.next);
                    $("#main").prepend(
                        $("<div></div>").attr({
                            "id":"slides-next",
                            "class":"slides-nav"
                        }).bind("click.slides", methods.next)
                    );

                    $("#main").prepend(
                        $("<div></div>").attr({
                            "id":"slides-prev",
                            "class":"slides-nav"
                        }).bind("click.slides", methods.prev)
                    );

                    // Resize navigators
                    methods.resize();
                    $(window).bind("resize.slides", methods.resize);

                    $("#warp-nav").bind("click.slides", methods.next);
                    

                }
                 if (settings.pageNav) {
                    var data = methods.data;
                    var pags = data.count;
                     console.log(pags);
                    for ( var i = 1; i < (pags + 1); i++ ) {
                        if (i < 10){
                            console.log(i);
                            $("#paginador").prepend(
                                $("<li>0"+i+"</li>").attr({
                                    "id": "pAa0"+i,
                                    "class": "pdor"
                                }).bind("click.slides", methods.goPag)
                            );
                        }
                        else {
                            $("#paginador").prepend(
                                $("<li>"+i+"</li>").attr({
                                    "id": "pAa"+i,
                                    "class": "pdor"
                                }).bind("click.slides", methods.goPag)
                            );
                        }
                    }
                    
                 };



                // Keyboard shortcuts
                if (settings.useKeyboard)
                    $(document).bind("keydown.slides", methods.keyDown);

                // Go to first slide
                methods.goTo(settings.first);

            });
        },

        resize: function(){

            /* Position navigators
            $("#slides-next").css({
                "height": $(document).height()-100,
                "left":$(document).width() - $("#slides-next").width()
            });
            $("#slides-prev").css({
                "height": $(document).height()-100,
                "left": 0
            });*/
        },

        next: function(){
            var data = methods.data;
            var pags = data.count;
            
            if (data.stepsCount && (data.step < data.stepsCount)){
                $(data.slides[data.current-1]).find(".incremental").eq(data.step).fadeIn("fast");
                data.step++;
                //alert(pags);
                for ( var i = 1; i < (pags + 1); i++ ) {
                    if (i < 10){
                        if ($('#pA0'+(i-1)).is(':visible')) {
                            $('#paginador li').removeClass('activo');
                            $('#pAa0'+i).addClass('activo');
                        }
                    }
                    else {
                        if ($('#pA'+(i-1)).is(':visible')) {
                            $('#paginador li').removeClass('activo');
                            $('#pAa'+i).addClass('activo');
                        }
                    }
                    
                }
            } else {
                if (data.current < data.count)
                    methods.goTo(data.current + 1);
                    for ( var i = 1; i < (pags + 1); i++ ) {
                        if (i < 10){
                            if ($('#pA0'+(i-1)).is(':visible')) {
                                $('#paginador li').removeClass('activo');
                                $('#pAa0'+i).addClass('activo');
                            }
                        }
                        else {
                            if ($('#pA'+(i-1)).is(':visible')) {
                                $('#paginador li').removeClass('activo');
                                $('#pAa'+i).addClass('activo');
                            }
                        }
                        
                    }
            }

            return this;
        },

        prev: function(){
            var data = methods.data;
            var pags = data.count;
            if (data.current > 1)
                methods.goTo(data.current - 1);
            for ( var i = 1; i < (pags + 1); i++ ) {
                    if (i < 10){
                        if ($('#pA0'+(i-1)).is(':visible')) {
                            $('#paginador li').removeClass('activo');
                            $('#pAa0'+i).addClass('activo');
                        }
                    }
                    else {
                        if ($('#pA'+(i-1)).is(':visible')) {
                            $('#paginador li').removeClass('activo');
                            $('#pAa'+i).addClass('activo');
                        }
                    }
                    
                }

            return this;
        },

        goPag: function(event){
            var dor = event.target.id;
            var data = methods.data;
            var pags = data.count;
            for ( var i = 1; i < (pags + 1); i++ ) {
                if (i < 10){
                    if (dor == "pAa0"+i) {
                        methods.goTo(i);
                        if ($('#pA0'+(i-1)).is(':visible')) {
                            $('#paginador li').removeClass('activo');
                            $('#pAa0'+i).addClass('activo');
                        }
                        return this;
                    };
                }
                else {
                    if (dor == "pAa"+i) {
                        methods.goTo(i);
                        if ($('#pA'+(i-1)).is(':visible')) {
                            $('#paginador li').removeClass('activo');
                            $('#pAa'+i).addClass('activo');
                        }
                        return this;
                    };
                }
                
            }
            

        },

        goTo: function(id){
            var index = id - 1;
            var data = methods.data;
            var slides = data.slides;
            if (slides[index]){
                var newSlide = $(slides[index]);

                if (data.current >= 1 && $(slides[data.current - 1]).is(":visible")){
                    $(slides[data.current - 1]).hide();
                }
                newSlide.show();

                var loaded = newSlide.data("loaded");
                if (!loaded){
                    newSlide.trigger("load_slide.slides",data);
                    newSlide.data("loaded",true);
                } else {
                    newSlide.trigger("show_slide.slides",data);
                }


                data.current = parseInt(id);
                data.step = 0;
                var incrementalElements = newSlide.find(".incremental");
                data.stepsCount = incrementalElements.length;
                if (data.stepsCount)
                    incrementalElements.hide();

            }

            return this;

        },

        keyDown: function(event){
            var key = event.keyCode;
            if (key == 37) {
                // Left arrow
                methods.prev();
            } else if (key == 39) {
                // Right arrow
                methods.next()
            } else if (key == 32) {
                // Space bar
                methods.next()
			} else if (key == 27) {
                // Esc
                methods.goTo(1);
            }
            return true
        },

        destroy : function() {
            return this.each(function(){
                $(window).unbind(".slides");
            })
        }


    };


    $.fn.slides = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === "object" || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( "Method " +  method + " does not exist on jQuery.slides" );
            return null;
        }

    };
})(jQuery);
