var change_score;
(function($,doc){
	$.ready(function(){
		var score_node = doc.find('.score'),
		step_node = doc.find('.step'),
			c_score = 0,//current_score
			change_from = 0,
			c_step = 0,//current_step
			//积分规则
			//2~5,5分/个
			//6~10,10分/个
			//11~15,15分/个
			//16~20,20分/个
			//21~25,25分/个
			get_score = function(num){
				if (num<=5) {
					return num*5;
				}else if (num>5&&num<=10) {
					return num*10;
				}else if (num>10&&num<=15) {
					return num*15;
				}else if (num>15&&num<=20) {
					return num*20;
				}else if (num>20&&num<=25) {
					return num*25;
				}else{
					return num*30;
				}
			},
			run_score = function(){
				if (change_from<c_score) {
					change_from += parseInt(c_score/(change_from||2));
					score_node.innerHTML = change_from;
					requestAnimationFrame(run_score);
				}
			},
			change_step = function(){
				step_node.innerHTML = ++c_step;
			};
			change_score = function(num){
				change_step();
				num = parseInt(num);
				change_from = c_score;
				c_score += get_score(num);
				run_score();
			};
		});
})(mui,document);