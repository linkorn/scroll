/**
*	scroll panel
*    
**/

var LnkScroll = Backbone.View.extend({
	viewport:null, // панель, где лежит содержимое
	vScroll:null,  // скроллер вертикальный
	vTrack:null,   // вертикальный трак
	hScroll:null,  // горизонтальный скроллер
	hTrack:null,   // горизотнальный трак 	
	minTrackSize: 50, // минимальный размер трака
	touchEvents:false, // поддерживает ли комп тачэвенты
	curType:'',		// текущий тип перемещения (hor/ver/touch)
	mPos:null, // позиция мышки
	trackPos:{x:0,y:0}, // позиция скролов
	hRatio:0, // коэф. соответсвия скрола и view-а
	vRatio:0, 
	accRect:{w:0,h:0}, // доступная область прокрутки
	onScroll:null, // событие, которые будет вызываться при смене положения скролов
	wheelSpeed:40, // скорость перемещения с помощью колесика мыши
	initialize:function(dt){		
		this.viewport = $(".overview",this.$el);
		this.vScroll = $('.ver-scrollbar',this.$el);
		this.vTrack = $('.thumb',this.vScroll);
		this.hScroll = $('.hor-scrollbar',this.$el);
		this.hTrack = $('.thumb',this.hScroll);		

		this.touchEvents = ( 'ontouchstart' in document.documentElement ) ? true : false;

		this.onScroll = dt.onScroll;
		
		this.$el.mousewheel($.proxy(this.wheel,this));
	},
	events:{
		'mousedown .hor-scrollbar .thumb':function(ev){this.curType = 'hor'; this.start(ev);},
		'mousedown .ver-scrollbar .thumb':function(ev){this.curType = 'ver'; this.start(ev);}
	},
	// пересчитываем размеры скролбоксов
	render:function(){		
		var szCnt = {w:this.$el.width(),h:this.$el.height()};
		var szView = {w:this.viewport.width(),h:this.viewport.height()};
		var vPos = this.viewport.position();
		if(szView.w<=szCnt.w)
			this.hScroll.hide();
		else
		{				
			this.hScroll.show();
			var tw = this.calcTrackSize(szCnt.w,szView.w);
			this.hTrack.css("width",tw+"px");
			this.hRatio =  (szView.w-szCnt.w)/(szCnt.w-tw);

			// считаем новый x для текущей позиции контента					
			this.trackPos.x = -vPos.left/this.hRatio;

			this.accRect.w = this.hScroll.width()-this.hTrack.width();
			this.trackPos.x = this.dtMove('left',this.hTrack,this.trackPos.x,this.accRect.w,this.hRatio);			
		}	
		if(szView.h<=szCnt.h)
			this.vScroll.hide();
		else
		{						
			this.vScroll.show();
			var th = this.calcTrackSize(szCnt.h,szView.h);
			this.vTrack.css("height",th+"px");
			this.vRatio =  (szView.h-szCnt.h)/(szCnt.h-th);
			this.accRect.h = this.vScroll.height()-this.vTrack.height();

			// считаем новый y для текущей позиции контента					
		//	this.trackPos.y = (szView.w-vPos.top)/(szCnt.h-th);

			this.trackPos.y = -vPos.top/this.vRatio;			

			this.trackPos.y = this.dtMove('top',this.vTrack,this.trackPos.y,this.accRect.h,this.vRatio);
		}	
		if(this.onScroll)			
			this.onScroll(-this.trackPos.x*this.hRatio,-this.trackPos.y*this.vRatio);	
	},
	// рассчитать размер трака (размер контейнера, размер содержимого)
	calcTrackSize:function(c,v){
		var h = c*c/v;
		return (h<this.minTrackSize)?this.minTrackSize:h;
	},	
	// начала скролирования с помощью мыши
	start:function(ev){		
		$('body').disableSelection();
		this.mPos = {x:ev.screenX,y:ev.screenY};
		var self = this;
		//if(!touchEvents)
        {

        	$(document).on('mouseup',$.proxy(this.end,this));
        	$(document).on('mousemove',$.proxy(this.drag,this));          
        }
	},
	// перетаскивание скролов
	drag:function(ev){		
		if(this.curType=='hor'){
			var d = this.trackPos.x-(this.mPos.x-ev.screenX);
			this.trackPos.x = this.dtMove('left',this.hTrack,d,this.accRect.w,this.hRatio);			
			this.mPos.x=ev.screenX;
		}
		if(this.curType=='ver'){
			var d = this.trackPos.y-(this.mPos.y-ev.screenY);
			this.trackPos.y = this.dtMove('top',this.vTrack,d,this.accRect.h,this.vRatio);			
			this.mPos.y=ev.screenY;
		}		
		if(this.onScroll)			
			this.onScroll(-this.trackPos.x*this.hRatio,-this.trackPos.y*this.vRatio);
	},
	// окончание скролирования
	end:function(ev){	
		$('body').enableSelection();
		$(document).off('mouseup',$.proxy(this.end,this));
        $(document).off('mousemove',$.proxy(this.drag,this));   
	},
	// скролирование с помощью колесика
	wheel:function(e,delta){				
		this.trackPos.y = this.dtMove('top',this.vTrack,this.trackPos.y-delta*this.wheelSpeed,this.accRect.h,this.vRatio);
		if(this.onScroll)			
			this.onScroll(-this.trackPos.x*this.hRatio,-this.trackPos.y*this.vRatio);		
	},
	// переместить по оси: direction(направление) - top/left
	dtMove:function(direction,track,delta,maxval,ratio){
		if(delta<0)
			delta = 0;
		if(delta>maxval)
			delta=maxval;		
		track.css(direction,delta+'px');
		this.viewport.css(direction,(-delta*ratio)+"px");
		return delta;
	}
});