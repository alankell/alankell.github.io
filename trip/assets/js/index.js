/*****************************************
 * author: yaoli<yaoli111144@gmail.com>
 * time:   2012-6-13
 * desc:   js for index.html
 ******************************************/
function yaoli(){
	console.log('yaoli2')
	return ['sssssssssssssssssssssssssssdxujifu','ldinfeng','haordddddden'];

}

$(document).ready(function(){
    var ISAUTO = false;

  	$("#J-search").bind('focus blur',function(){
  		$(this).toggleClass('focus')

  	});

  	$('#J-search').typeahead({
  		source: ["Alaska","Arizona","Arkansas","California","Colorado","Connecticut","姚立","压力2","Alabama"],
  		items: 8,
  		matcher: function(item){return true;},//这个是为了让其不过滤，直接返回从ajax传过来的信息
  		sorter: function(items){return items;},//这个是为了不让其排序，直接返回从ajax传过来的信息
  		onselect: function(val){
  			alert(val)
  		},
  		onchange: function(query, fn){
  			var _source = ['linfeng','zhouzixin','xujifu','yaoli'];
  			
  			if(query == 's')
  				_source = ['xujifu','linfeng','haoren'];
  			if(query == 'd')
  				_source = ['dxujifu','ldinfeng','haordddddden'];
			if(query == 'sd')
  				_source = ['sssssssssssssssssssssssssssdxujifu','ldinfeng','haordddddden'];

  			//setTimeout('yaoli()',3000);
  			fn.call(this, _source)

  			
  		}
  	});
    
    $('.J-pop').popover({
      animation: true,
      placement: 'right',
      trigger: 'hover',
      title: ' Im Alan',
      content: function(){
        return $(this).attr('data-desc');
      }

    });

      $('.J-pop3').popover({
      animation: true,
      placement: 'left',
      trigger: 'hover',
      title: 'Im Alan',
      content: function(){
        return $(this).parent().attr('data-desc');
      }

    });
    $('.J-pop2').hover(function(){
      $(this).children('.J-status').hide();
      $(this).children('.install').show();
    }, function(){
      $(this).children('.J-status').show();
      $(this).children('.install').hide();
    });


    $('.btn1').hover(function(ev){
      $(this).parent().removeClass();
      $(this).parent().addClass('detail-btn-status1');
    },function(ev){
      $(this).parent().removeClass();
      $(this).parent().addClass('detail-btn-normal');
    }
    );

    $('.btn2').hover(function(ev){
      $(this).parent().removeClass();
      $(this).parent().addClass('detail-btn-status2');
    },function(ev){
      $(this).parent().removeClass();
      $(this).parent().addClass('detail-btn-normal');
    }
    );

    $('.btn1').mousedown(function(ev){
      $(this).parent().removeClass();
      $(this).parent().addClass('detail-btn-status3');

    }
    );
    $('.btn1').mouseup(function(ev){
      $(this).parent().removeClass();
      $(this).parent().addClass('detail-btn-normal');

    }
    );
    $('.btn2').click(function(){
       var _offset = $(this).offset();
      $('#J_dropdown').css('left', _offset.left-100);
      $('#J_dropdown').css('top', _offset.top+32);
      $('#J_dropdown').toggle();

    });

    $('#J_security').popover({
      animation: true,
      placement: 'right',
      trigger: 'hover',
      title: '已通过安全检测，没有病毒、木马等有害手机的恶意程序。请放心下载使用。<div class="sep"></div>',
      content: function(){
        return $(this).attr('data-desc');
      }

    });

    $('.detail-more-change').click(function(ev){
      ev.preventDefault();
      if(!ISAUTO){
        $('.detail-app-content-desc').css('height', 'auto');
        $(this).html('收起');
        ISAUTO = true;
      }else{
        $('.detail-app-content-desc').css('height', '95px');
        $(this).html('展开');
        ISAUTO = false;
      }

    });

  


});

$(window).load(function() {
        $('#featured').orbit({
           animation: 'horizontal-push'
        });
});
