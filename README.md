linkorn-scroll.js
=================

Scrollbar for backbone.js

Usage
-----

	<link rel="stylesheet" href="linkorn-scroll.css">
	
	<script src="linkorn-scroll.js"></script>

	
	<div class="scroll-container">
		<div class="ver-scrollbar"><div class="track"><a script="text/javascript" class="thumb"></a></div></div>
     		<div class="hor-scrollbar"><div class="track"><a script="text/javascript" class="thumb"></a></div></div>
     		<div class="viewport">      
      			<div class="overview">
				<!-- YOUR LIST CONTENT -->
      			</div>            
     		</div>
    	</div>

__initialize__
	var scrollContainer = new LnkScroll({
		el:this.$("div.scroll-container"),
		onScroll:function(x,y){
			console.log(x+','+y);
		}
	});

__resize__

	$(window).bind("resize", $.proxy(this.windowResize,this));
        $(window).resize();

	windowResize: function (e) {
            e.preventDefault();
            if (this.scrollContainer){
            	this.scrollContainer.$el.css("height", ($(e.currentTarget).height() - 100) +"px");
            }
            this.scrollContainer.render();
        }