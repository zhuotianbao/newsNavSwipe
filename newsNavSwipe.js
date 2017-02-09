/**
 * Created by zhuotiabo on 17/2/9.
 */
/*
 jqSwipe 1.0.0
 Licensed under the MIT license.
 https://github.com/VaJoy/jqSwipe
 */

(function ($, window, undefined) {
    $.fn.jqSwipe = function (classname) {
        var $binder = $(this),
            binder = $(this).get(0),
            $children = $binder.children(),
            itemNum = $children.length,
            beforeWidth = 0,
            binderWidth = 0,
            afterWidth = 0,
            transl_x = 0,  //translate3d偏移值
            transl_x_temp = 0,
            prefix = (function(temp) {
                var props = [['transformProperty',''], ['WebkitTransform','-webkit-'], ['MozTransform','-moz-'], ['OTransform','-o-'], ['msTransform','-ms-']];
                for ( var i in props ) {
                    if (temp.style[ props[i][0] ] !== undefined) return props[i][1];
                }
                return '';
            })(document.createElement('jqSwipe')),
            transition = prefix + "transition",
            transform = prefix + "transform",
            vp_width = prefix==="-moz-" ? screen.width : window.innerWidth; //视区宽度hack
        for(var i = 0;i < itemNum;i++){
            binderWidth += $children.eq(i).width();
        }
        classname = classname || null;
        initSwipe();

        /**
         * 初始化UI
         */
        function initUI(){
            setTransition("0");
            $binder.css(transform, "translate3d(0,0,0)")
                .css("width",binderWidth);
        }

        /**
         * 设置绑定对象的transition时间
         * @param time {string} - 过渡间隔值（秒）
         */
        function setTransition(time){
            binder.style[transition] = transform + " " + time + "ms";
        }

        function dealTransition(x,transTime){
            x = x||0;
            transTime = transTime||"300";
            setTransition(transTime);
            $binder.css(transform, "translate3d(" + x + "px,0,0)");
            setTimeout(function(){setTransition("0")},transTime);
            transl_x = x;
        }

        function activeItem(){
            $binder.on("click",$children,function(e){
                var $item = $(e.target).hasClass('swiper-slide-box')?$(e.target):$(e.target).parent(),
                    index = $item.index(),
                    transl_x_temp = 0;
                if(classname){
                    $item.children().addClass(classname);
                    $item.siblings().children().removeClass(classname);
                }
                for(var i = 0;i < index-1;i++){
                    beforeWidth += $children.eq(i).width();
                }
                for(var i = 0;i < index+2;i++){
                    afterWidth += $children.eq(i).width();
                }
                if( beforeWidth < -transl_x ){//往左边方向点击
                    if(index>0) transl_x_temp = - beforeWidth;
                    dealTransition(transl_x_temp);
                }else if(afterWidth + transl_x > vp_width){ //注意transl_x是负值,往右边方向点击
                    if(index==itemNum-1) transl_x_temp = vp_width - binderWidth;
                    else transl_x_temp = vp_width - afterWidth;
                    dealTransition(transl_x_temp);
                }
                beforeWidth = 0;
                afterWidth = 0;

            })
        }

        /**
         * 处理手势
         */
        function dealGesture(){
            var min_x = vp_width - binderWidth,
                touch_x = 0,
                move_s = 0;
            binder.addEventListener('touchstart', function (e) {
                transl_x_temp = transl_x;
                touch_x = e.targetTouches[0].clientX;
            },false);
            binder.addEventListener('touchmove', function (e) {
                e.preventDefault();
                e.stopPropagation();
                move_s = e.targetTouches[0].clientX - touch_x;
                if(transl_x_temp < min_x){
                    transl_x_temp = move_s + transl_x + (min_x-transl_x_temp)*0.9;
                }else if(transl_x_temp>0){
                    transl_x_temp = move_s + transl_x - (transl_x_temp)*0.9;
                }else{
                    transl_x_temp = move_s + transl_x;
                }

                $binder.css(transform, "translate3d(" + transl_x_temp + "px,0,0)");

            },false);
            binder.addEventListener('touchend', function () {
                if(transl_x_temp < min_x){
                    dealTransition(min_x);
                }else if(transl_x_temp>0){
                    dealTransition();
                }else{
                    transl_x = transl_x_temp;
                }
            },false);
        }

        /**
         * 初始化全部
         */
        function initSwipe() {
            initUI();
            dealGesture();
            activeItem();
        }
    }
}(Zepto,window,undefined));
