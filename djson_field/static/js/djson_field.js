$(document).ready(function(e){
	$(document).delegate('.jsonFieldWidget .jsonFieldAddLink a', 'click', function(e){
		e.preventDefault();
		var list = $(this).parent().parent();
		var last = list.children('.jsonFieldItem').last();
		isLabel = true;
		if(list.hasClass('jsonFieldDict')){
			var key = prompt("Введите ключ");
			var name = list.attr('name') + '[_' + key + ']';
		} else {
			var key = 0;
			if(last && last.length>0){
				var indexes = getKeys(last.children('.jsonFieldItemValue').attr('name'));
				if(indexes && indexes.length > 0)
					key = parseInt(indexes.pop()) + 1;
			}
			isLabel = false;
			var name = list.attr('name') + '[' + key + ']';
		}
		if(key==null) return null;
		var label = "<label>" + key + "</label>";
		var templates = getTemplates(list);
		if(templates.size() > 0){
			if($(this).hasClass("add_plain")){
				var item = templates.children(".plain").html().replace(/%%NAME%%/g, name);
			} else if($(this).hasClass("add_list")){
				var item = templates.children(".templates>.list").html().replace(/%%NAME%%/g, name);
			} else if($(this).hasClass("add_dict")){
				var item = templates.children(".templates>.dict").html().replace(/%%NAME%%/g, name);
			}
			var li = "<li class=\"jsonFieldItem\">" +
						'<a href="#" class="deleteItem">Удалить</a> ' +
						(isLabel ? label : "") + item + 
						'</li>';
			$(this).parent().before(li);
		} else {
			alert("Не удалось найти шаблон для сущности");
		}
	});
	$(document).delegate('.jsonFieldWidget .jsonFieldItem>.deleteItem', 'click', function(e){
		e.preventDefault()
		$(this).parent().remove();
	});
});

function getTemplates(node){
	var templates = node.children('.templates');
	if(templates.size() > 0) return templates;
	var parent = node.parent();
	if(parent.size() > 0) return getTemplates(parent);
	return null;
}

function getKeys(str){
	keys = str.match(/\[[a-zA-Z0-9_.]+\]/g);
	if(keys && keys.length > 0){
		for(var i=0; i<keys.length; i++) keys[i] = keys[i].slice(1,-1);
	}
	return keys
}