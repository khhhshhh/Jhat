var $h1 = $('#h1'); 
var obj = {};

_.extend(obj, Backbone.Events);	 

obj.on('alert', function(msg){
	alert(msg);
});

$h1.on('click', function(event){
	obj.trigger('alert', 'fuck');
});

////////////////////////////////Backbone.Model,模型就是存储数据的对象//////////////////////////////
/*用* Back.Model.extend({})来扩展并新建自己的模型
 * 已有的模型可以扩展出新的模型
 * var N = M.extend({})
 * */
var JJ = Backbone.Model.extend({
	prompt: function(msg) {
				var m = console.log(msg);
    }
});

var JJL = JJ.extend({
	fuck: function() {
			  console.log('fuck');
    } 
});

/*实例化模型对象
 * 可以在实例初始化的时候进行
 * var m = new M({
 * 		attribute: 'xxx'
 * })
 * */
var jj = new JJ({
	id: '11331133'
});
var jjl = new JJL({
	name: 'jijilong',
	id: 11331027
});

/*获取模型实例属性
 * model.get('attr');
 * */
console.log(jjl.get('name'));

/*设置模型实例属性
 *model.set({
	 attr: 'xxx'
 });
 * */
 jjl.set({
	 name: 'jjlong'
 });
console.log(jjl.get('name'));

/*m.escape('attr'), 获取属性值，用html转码，可以防止xss攻击
 * m.escape('attr');
 */
jjl.set({
	html: '<div>fuck</div>'
})
console.log(jjl.escape('name'));

/*检验是否存在某个属性
 * m.has('attr');
 * */
console.log(jjl.has('name'));

/*移除某个属性
 * m.unset('attr');
 * */
jjl.unset('name');
console.log(jjl.has('name'));

/*清楚所有属性
 *m.clear();
 * */
jjl.set({
	attr: 'what'
});
console.log(jjl.get('attr'));
//jjl.clear();
console.log(jjl.get('attr'));

/*获取模型id,这个是自定义的
 * m.id
 * */
console.log(jjl.id);

/*模型自动创建的唯一标识符,cid
 * m.cid
 * */
console.log(jjl.cid);
console.log(jj.cid);

/*获取模型的存储属性的对象,不建议使用
 * m.attributes
 * */
console.dir(jjl.attributes);

/*获取模型存储属性对象的副本
 * m.toJSON();
 * */
console.dir(jjl.toJSON());

/*为模型构造函数设置默认值的
 * 当实例化的时候如果没有设定，则会用默认值取代实例对象的属性
 * var M = Backbone.Model.extend({
 * 		defaults: {
 * 			gender: 'male'
 * 		}
 * })
 * */
var Kuang = JJL.extend({
	url: '/json/',
	defaults: {
				 name: 'kuang'
	}
});

var kuang = new Kuang({
	urlRoot: '/book',
	gender: 'female',
});
console.log(kuang.get('name'));

/*
 * 从服务器中为模型获取最新的对象数据
 * 在构造函数初始化的时候必须制定一个url属性
 * fetch 和 save 共用一个url，只是方法不一样，
 * fetch用get
 * save用post
 * 然后模型实例用fetch就会自动发送请求一个json对象
 * 返回对象和原有对象会合并，有就覆盖，无就添加
 * m.fetch({
 * 		success: function(model, data) {},
 * 		error: function(model, data) {}
 * });
 * */
kuang.fetch({
	success: function(mod, res) {
				console.log(kuang.get('name'));
				console.log(kuang.get('klass'));
    },
	error: function(mod, res) {
			   console.log('error');
    }
});

/* 保存数据到服务器中，
 * 第一次用post发送一个json对象，create
 * 之后都用put发送请求，update
 * 当成功执行回调success函数，否则执行error
 * 服务器返回200算是成功
 * m.save(obj, {
 * 		success: function(model, res){},
 * 		error: function(model, res){},
 * });
 * */
kuang.save();
kuang.save({
	name: 'newFuck'
}, {
	error: function(mod, res){
		console.log('error');
	},
	success: function(mod, res) {
				 console.log(res);
	}
});
console.log(kuang.get('name'));

/*	获取模型在服务器的资源位置
 *	m.url
 * */
console.log(kuang.url);

/* 复制一个和原来模型一样的实例
 * var n = m.clone();
 * */
var sex = kuang.clone();
sex.save({
	suck: 'fuck'
}, {
	success: function(mod, res){
				 console.log('success');
	},
	error: function(mod, res) {
			   console.log('error');
    }
});
console.log(sex.attributes);

/*测试一个模块实例是否保存到了服务器
 * 如果没保存，无id，有则有id
 * m.isNew()
 * */
var kuangSon = new Kuang({
	msg: 'kuang son'
});

console.log(kuangSon.isNew());

/*change事件
 * 每个模块可以加一个on('change')事件
 * 当有属性被修改的时候，就会触发
 * m.on('change', function(){});
 *
 * 也可以监控某个特定的属性
 * m.on('change:attr', function(){});
 * */
kuangSon.on('change', function(){
	console.log('Something is changing');
});

kuangSon.on('change:msg', function(){
	console.log('msg is changed');
});

kuangSon.set({msg: 'shit'});

kuangSon.save({
	url: kuangSon.url
});


/*检测某个属性是否发生了改变
 * m.hasChanged('attr');
 * */
var kuangGirl = new Kuang({
	gender: 'female'
});


/*传入一个属性对象，获取所有已经改变的属性，返回一个对象
 *
 * （这样就可以在change事件里面获取所有已经改变的属性，
 * 然后有针对地更新视图~！）
 *
 * var changeAttrs = m.changedAttributes(m.attributes);
 * */
kuangGirl.on('change', function(){
	if(kuangGirl.hasChanged('gender')) {
		console.log('change your gender');
	}
	console.log(this.changedAttributes(this.attributes));
});

kuangGirl.set({
	gender: 'male',
	home: 'No home',
	hasBoyFriend: false
});

/*获取某个属性原有的值，通常在change事件中使用
 * m.previous('attr');
 *
 * 获取原有的所有的属性值，在change中使用
 * m.previousAttributes();
 * */
kuang.on('change', function(){
	console.log('now ' + kuang.get('gender'));
	console.log('previous ' + kuang.previous('gender'));
	console.log('previous attributes: ');
	console.dir(this.previousAttributes());
});

kuang.set({gender: 'male'});

////////////////////////////////Backbone.Collection，集合就是存储模型的数组/////////////////////////
/*创建集合类，Backbone.Colletion.extend({实例化的集合属性} [,{类属性}])
 *用model属性类规定此类集合存的是什么样的集合
 * */
var JJs = Backbone.Collection.extend({
	model: Kuang 
});

/*实例化一个集合对象，向类中传入集合数组
 * 集合实例就是一个封装了很多方法的数组嘛。。
 * */
var jjs = new JJs([kuang, kuangSon, kuangGirl]);
console.log(jjs.length);

/*获得集合内部存储模型实例的集合，通常不会这样做，但是有时也会需要
 * c.models
 * */
console.log('balbalbalbal a test of collection.models: ' + jjs.models[2].get('gender'));

/*获取集合中所有的模块的属性，存放在一个数组中
 * c.toJSON();
 * */
console.log('collection.toJSON' + jjs.toJSON());

/* 用数组往集合中添加模型实例,会触发add事件
 * c.add([m1, m2, m3] [,{options}]);
 * 可选参数为 {
 * 		silent: true (是否触发change事件)
 * 		at: xxx (在某个位置开始插入)
 * 		merge: true (是否合并已有对象)
 * }
 * */
jjs.on('add', function() {
	console.log('Something add to jjs, test of c.add');
	console.log(this.length);
});

var jarr = [new Kuang({name: 'shit'}), new Kuang({name: 'fuck'})];
jjs.add(jarr);

/*删除集合元素,用模型引用或者模型数组，会触发remove事件
 * jjs.remove(models,[,{options.index}]);
 * */
jjs.on('remove', function() {
	console.log('Something removed from jjs ');
	console.log(this.length);
});
jjs.remove(kuang);
jjs.remove(jarr);

/*重置或者清空集合，将集合中的模型实例用新的数组替代
 * c.reset(models, [options]);
 *
 * 如果不传入任何参数，则清空集合
 * c.reset();
 * */
jjs.reset([
		new Kuang({shit: true}),
		new Kuang({shit: true}),
		new Kuang({shit: true})
]);
console.log('Reset a collection:' + jjs.length);
console.log(jjs.toJSON());

/*更新集合，提供一种聪明的方法去更新集合
 * c.update(models, [options]);
 *
var vanHalen = new Collection([eddie, alex, stone, roth]);

vanHalen.update([eddie, alex, stone, hagar]);

// Fires a "remove" event for roth, and an "add" event for "hagar".
// Updates any of stone, alex, and eddie's attributes that may have
// changed over the years.
 
* */
jjs.update([kuang, kuangSon, kuangGirl, new Kuang({id: 101, name: 'someKuang'})]);

/*通过id获取集合模型元素
 * c.get(id);
 * */
var someKuang = jjs.get(101);
console.log(someKuang.id + ' ' + someKuang.get('name'));

/*通过下标获取集合模型实例
 * c.at(index);
 * */
var anotherKuang = jjs.at(0);
console.log(anotherKuang.attributes);

/* 可以用数组的方法对集合操作
 * c.push();
 * c.pop();
 * c.shift();
 * c.unshift();
 * c.length
 * */

/*用比较子来进行排序，若有制定c.comparator,
 * 则回用于add和sort操作中排列集合的顺序
 * c.comparator = function(mod1, mod2){
 * 		return -1 ---------> mod1排前面
 * 		return  0 ---------> 同顺序
 * 		return  1 ---------> mod1排后面
 * }
 * */
var Jay = Backbone.Model.extend({ // 构建Jay模型类
	weapon: 'longJJ'
});

var Jays = Backbone.Collection.extend({ // 构建存储Jay模型的集合类
	url: '/collection',
	model: Jay
});

var jays = new Jays(); // 实例一个集合对象

jays.comparator = function(j1, j2){ // 设定集合实例的比较函数
	return j1.get('rank') < j2.get('rank') ? -1 : 1;
};

var i = 5;
while(i--) { // 实例Jay对象并存储在Jays集合中
	jays.add(new Jay({
		rank: Math.floor(100 * Math.random()),
		name: i % 2 == 0 ? 'yes' : 'no'
	}));
};

console.log(jays.toJSON());

/*对集合中的模块进行排序，用comparator作为比较函数
 * c.sort();
 * */
jays.comparator = function(j1, j2){
	return j1.get('rank') > j2.get('rank') ? -1 : 1;
}; 

jays.sort();
console.log(jays.toJSON());

/*从集合中选取所有模型的某个属性，然后存放在某个数组中返回
 * var arr = c.pluck('name');
 * */
var ranks = jays.pluck('rank'); 
console.log(ranks);

/*从集合中获取一个符合‘指定属性’的模型实例数组
 * var arr = c.where({name : 'yes'});
 * 集合中的name == 'yes'的模型都会被选出来
 * */
var jaysName = jays.where({name: 'yes'});
console.log(jaysName);

/*获取该集合在对应的url
 * c.url
 * */
console.log(jays.url);

/*复制一个同样的集合实例
 * var cl = c.clone();
 * */
var anotherJays = jays.clone();
console.log('Test of c.clone ' + anotherJays.length);

/*从数据库中更新集合中的模型实例
 * 数据库应该返回存放模型实例的数组 [{}, {}, {}]
 * 然后该集合会执行reset来更新数组的元素
 * 当然，你也可以选择使用update来更新
 * c.fetch({
 * 		success: function(){},
 * 		error: function(){},
 * 		update: true
 * });
 * */
jays.fetch({
	success: function(col, res) {
				 console.log('success');
				 console.log(jays.models);
			 },
	error: function() {
			   console.log('error');
		   },
	update: true
});

/*从fetch结果中分析合适的数据进行更新集合
 * 在集合类定义的时候加上parse属性
 * var C = Backbone.Collection.Collection({
 * 		parse: function(){
 * 		}
 * });
 *当集合使用fetch的时候，返回的数组不会reset到集合中，首先执行parse函数
 *然后使用parse函数返回的数组进行reset1
 * 也就是说，parse无论如何都应该返回一个集合数组
 * */
var LittleJs = Jays.extend({
	model: Jay,
	parse: function(res) {
		console.log(res);
		return [{name: 'replace'}, {name: 'yes~!'}];
	}
});
var littleJs = new LittleJs;
littleJs.fetch({
	success: function(col, res) {
			   console.log('Collection fetch success:');
			   console.log(littleJs.models);
			 },
	error: function(col, xhr) {
			   console.log('Collection fetch error');
		   }
});

/*为集合快速地添加一个元素，会自动保存到服务器当中，add不会自动保存
 * c.create(attributes, [options])
 * options 可以传入 {wait: true}---------->说明等待数据库返回成功信息才放进本地集合中
 *
 * c.create({}) == c.create(new M({}));
 * 两者是一样的，不需要new，内部会直接根据传入对象创建正确的模型
 * */
console.log('.............................................Before create ' + jays.length);
jays.create({name: 'new Jay was created', rank: 0});
console.log('.............................................After create' + jays.length);
console.log(jays.at(5).attributes);

//////////////////////////////Backbone.Router////////////////////////////////
/*构建路由类，Backbon通过路由来触发不同的函数进行页面的更新
 *可以通过Backbone.Router.extend({})来构建路由类，匹配到routes的，会执行对应的函数

		var Workspace = Backbone.Router.extend({

		  routes: {
			"help":                 "help",    // #help
			"search/:query":        "search",  // #search/kiwis
			"search/:query/p:page": "search"   // #search/kiwis/p7
		  },

		  help: function() {
			...
		  },

		  search: function(query, page) {
			...
		  }

		});
 * 需要实例化一个路由对象，并且初始化以后使用Backbone.history.start();	
 * 才会触发路由记录的开始
 * */
var War = Backbone.Router.extend({
	routes: {
				'start': 'start',
				'setup/:msg': 'setup',
				'fire/J:left/:right' : 'fire'
			},
	start: function() {
			  alert('War 1');
		  },
	setup: function(msg) {
			   alert(msg);
		   },
	fire: function(left, right) {
			  alert('The left is ' + left + ' The right is ' + right);
		  }
});

var war = new War();

/*当用户直接输入URL，或者按返回，返回原来的页面，可以设定一个事件回调，更新视图（第一次刷新的时候不会触发）*/
war.on('route:start', function(){
	console.log('Restarting a war');
});

/*获取路由实例路由 hash 对象
 * r.routes
 * */
console.log('XXXXXXXXXXXXXXXXXX Oh jesus, its fire~! XXXXXXXXXXXXXXXXXXXXX');
console.log(war.routes);

/* 添加路由规则
 * 若路由规则存在，则使用其来匹配
 * 原来路由不存在，则使用callback添加新的规则
 * r.route(url, name, [callback])
 * */
war.route('fuck/:your', 'fuck', function(you) {
	alert('Fuck ' + you);
});

/* 导航到路由
 * 使页面导航到某个URL
 * r.navigate(url, [options]);
 * 当设置options中trigger为true，会触发对应的路由函数，默认不触发。
 * */
$('#restart').click(function(){
	war.navigate('jay/win', {trigger: true});
});

/* 重写数据同步函数: Backbone.sync
 * 使用Backbone.sync = function(method, model, [options]){}
 * 每当程序进行模型的
 * create, read, update,delete操作时，都会委托这个函数进行数据同步 
 * 可以重写这个函数可以进行不同方式的数据同步，如webSocket，localStorage
 * */
/*Backbone.sync = function(method, model, options) {
	console.log('log +++++++++++++++' + method);
};*/
var syncJ = new Jay(); 
syncJ.url = '/json/';
syncJ.save({name: 'shit'}, {
	success: function(model, res) {
				 console.log('I am successs');
				 console.log(syncJ.id = res);
			 },
	error: function(model, res) {
			   console.log('ERROR');
		   }
});

syncJ.save({
	name: 'dai'
});

console.dir(syncJ.attributes);
Backbone.history.start();

/**/
var A = Backbone.View.extend({
	tagName: 'a',

	events: {
		'click': 'open' 
	},

	initialize: function() {
			this.listenTo(this.model, 'change', this.render);
	},

	render: function() {
			console.log(this.$el.hide(1000));
			this.$el.html(this.model.get('name'));
			console.log('Change~~~~~~~~~~~~~~');
	} ,

	open: function() {
		  console.log('Be clicked~~~~~~~~~~!!!!');
    }
});

var vm = new Jay({
	rank: 134,
	name: 'Restart',
	el: document.getElementById('restart')
});

var a = new A({
	model: vm,
});

vm.on('change', function() {
	console.log('vm is changing.....');
});

vm.set({name: 'sex'});
