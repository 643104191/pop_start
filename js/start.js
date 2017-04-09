(function($,doc){
	$.ready(function() {
		var color = ['r','g','b','c','p','y'],
		wrap = doc.find('#wrap'),
		item = doc.createElement('DIV'),
		remove_length = 0,
		transition_items = [],
		get_rand = function(min,max){
			var range = max - min;
			var rand = Math.random();
			return(min + Math.round(rand * range));
		},
		initialize = function(){
			item.className = 'item';
			var items = wrap.findAll('.item');
			do{
				items.forEach(function(s){
					s.removeClass('r','g','b','c','p','y').addClass(color[get_rand(0,5)]);
				});
			}while(!check_enable());
		},
		is_same = function(c_node,o_node){//c_node:当前节点(current_node),o_node:比较节点(other_node)
			var c_class = c_node.classList,
			o_class = o_node.classList;
			for (var i = c_class.length - 1; i >= 0; i--) {
				for (var j = o_class.length - 1; j >= 0; j--) {
					if ((color.indexOf(c_class[i])>=0)&&(c_class[i] == o_class[j])) {
						return true;
					}
				}
			}
			return false;
		},
		get_node_index = function(node){
			var items = node.parentNode.findAll('.item');
			return items.indexOf(node);
		},
		get_vertical = function(node,d){//d:direction方向
			var items = node.parentNode.findAll('.item'),
			index = items.indexOf(node);
			if ((index==0&&d=='top')||(index==(items.length-1)&&d=='bottom')) {
				return null;
			}else{
				return items[index+(1*(d=='top'?-1:1))];
			}
		},
		get_horizontal = function(node,d){//d:direction方向
			var column = node.parentNode,
			columns = doc.findAll('.column'),
			c_index = columns.indexOf(column);
			if ((c_index==0&&d=='left')||(c_index==(columns.length-1)&&d=='right')) {
				return null;
			}
			var items = node.parentNode.findAll('.item'),
			index = items.indexOf(node),
			near_column = columns[c_index+(1*(d=='left'?-1:1))];
			return near_column.find('.item:nth-child('+(index+1)+')');
		},
		get_same_item = function(node,flag,items){//items:existent_item
			var flag = flag||null,
			items = items||[node],
			temp_items = [],
			//flag是方位标志(node上(下,左,右)面的不重复获取下(上,右,左)面的,即不重复获取node自身)
			around = [flag===1?null:get_vertical(node,'top'),flag===0?null:get_vertical(node,'bottom'),
			flag===3?null:get_horizontal(node,'left'),flag===2?null:get_horizontal(node,'right')];
			for (var i = around.length - 1; i >= 0; i--) {
				if(around[i]&&items.indexOf(around[i])<0&&is_same(node,around[i])){
					temp_items.push([around[i],i]);
					items.push(around[i]);
				}else{
					temp_items.push(null);
				}
			}
			for (var j = temp_items.length - 1; j >= 0; j--) {
				var res = temp_items[j]!=null?get_same_item(temp_items[j][0],temp_items[j][1],items):[];
				for (var k = res.length - 1; k >= 0; k--) {
					if (items.indexOf(res[k])<0) {
						items.push(res[k]);
					}
				}
			}
			return items;
		},
		check_enable = function(){//检查当前是否有可操作的item
			var items = wrap.findAll('.item'),
			checked_items = [];
			for (var i = items.length - 1; i >= 0; i--) {
				if (checked_items.indexOf(items[i])<0) {
					var same_item = get_same_item(items[i]);
					if (same_item.length>1) {
						return true;
					}else{
						checked_items = checked_items.concat(same_item);
					}
				}
			}
			return false;
		},
		swap_items = function(){
			var tempClassName = transition_items[0].className;
			transition_items[0].className = transition_items[1].className;
			transition_items[1].className = tempClassName;
			wrap.removeClass('moving');
			transition_items.forEach(function(s){
				s.removeAttribute('style');
			});
			transition_items = [];
			if (!check_enable()) {
				make_enable();
			}
		},
		make_enable = function(){
			wrap.addClass('moving');
			setTimeout(function() {
				var rand_1 = get_rand(1,5),
				rand_2 = get_rand(1,5),
				rand_3 = get_rand(1,5),
				rand_4 = get_rand(1,5);
				if (rand_1 == rand_2) {
					while(rand_3 == rand_4){
						rand_3 = get_rand(1,5);
						rand_4 = get_rand(1,5);
					}
					var rand_column = wrap.find('.column:nth-child('+rand_1+')'),
					item_1 = rand_column.find('.item:nth-child('+rand_3+')'),
					item_2 = rand_column.find('.item:nth-child('+rand_4+')');
				}else{
					var rand_column_1 = wrap.find('.column:nth-child('+rand_1+')'),
					rand_column_2 = wrap.find('.column:nth-child('+rand_2+')'),
					item_1 = rand_column_1.find('.item:nth-child('+rand_3+')'),
					item_2 = rand_column_2.find('.item:nth-child('+rand_4+')');
				}
				item_1.style.top = (rand_3>rand_4?'-':'') + Math.abs(rand_3 - rand_4)*0.7 + 'rem';
				item_2.style.top = (rand_3>rand_4?'':'-') + Math.abs(rand_3 - rand_4)*0.7 + 'rem';
				item_1.style.left = (rand_1>rand_2?'-':'') + Math.abs(rand_1 - rand_2)*100 + '%';
				item_2.style.left = (rand_1>rand_2?'':'-') + Math.abs(rand_1 - rand_2)*100 + '%';
			}, 0);
		};
		initialize();
		$(wrap).on('tap','.item:not(.removing)',function(){
			if (remove_length==0&&!wrap.hasClass('moving')) {
				var same_item = get_same_item(this)
					length = same_item.length;
				if(length>1){
					change_score(length);
					remove_length = length;
					same_item.forEach(function(s){
						s.parentNode.appendChild(item.cloneNode().addClass(color[get_rand(0,5)]));
						s.addClass('removing');
					});
				}
			}
		});
		$(wrap).on('animationend','.item.removing',function(){
			remove_length--;
			this.remove();
			if (remove_length == 0&&!check_enable()) {
				make_enable();
			}
		});
		$(wrap).on('transitionend','.item[style]',function(){
			var s = this;
			if (transition_items.indexOf(s)<0) {
				transition_items.push(s);
				if (transition_items.length>=2) {
					setTimeout(swap_items, 0);
				}
			}
		});
	});
})(mui,document);