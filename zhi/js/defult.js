	$(document).ready(function() {
		window.onscroll=function(){
			if($( document).scrollTop()==0){
				$('.index-search-box').show();
				}
			};
			
		$('.zan-pic').click(function(){
		
		$('.zan-pic').toggleClass('zan-currt');
		});	
		
		$('.sc-pic').click(function(){
		
		$('.sc-pic').toggleClass('sc-currt');
		});			
        });
			

	