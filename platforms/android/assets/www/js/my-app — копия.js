var myApp = new Framework7({
	pushState: true,
	swipePanel: 'left',
	material: true
});
var mainView = myApp.addView('.view-main');

var $$ = Dom7;



var version_app = "0.0.7.0";
var photo_user = '';
var photo_1 = '';
var photo_2 = '';
var user_id = '';
var xhr;
var real_ajax_send;
var my_id = window.localStorage.getItem("id");

var intent_messages = 0;

// Фильт поиска *Семейное положение
var checkbox_search_5 = [];


var select_user = 0;

/*
var my_latitude = window.localStorage.getItem("latitude");
var my_longitude = window.localStorage.getItem("longitude");
*/
// Init slider and store its instance in mySwiper variable


var my_latitude;
var my_longitude;

//$$('.f7-icons').hide();
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	// При нажатии на уведомление запустится прилождения и диалоги
	cordova.plugins.notification.local.on("click", function (notification) {

		if (notification.id.toString().substr(0, 3) == "111") {
			mainView.router.loadPage('messages.html');
		}


	});
}

// склонения
function declOfNum(number, titles) {
	cases = [2, 0, 1, 1, 1, 2];
	return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}


function ajax_otv(data) {
	alert(data);
}

$$('.notification-single').on('click', function () {
	myApp.addNotification({
		message: 'Battery remaining only 20%'
	});
});
$$('.notification-multi').on('click', function () {
	myApp.addNotification({
		message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
	});
});
$$('.notification-custom').on('click', function () {
	myApp.addNotification({
		message: 'Nice teal color button',
		button: {
			text: 'Click me',
			color: 'teal'
		}
	});
});
$$('.notification-callback').on('click', function () {
	myApp.addNotification({
		message: 'Close this notification to see an alert',
		button: {
			text: 'Close Me',
			color: 'red'
		},
		onClose: function () {
			myApp.alert('Callback made.. Notification closed');
		}
	});

	myApp.alert('Here comes About page');
});


//  view.router.loadPage('login.html');





$$('.list-block').on('click', function () {
	myApp.closePanel();


});

/*
	if (window.localStorage.getItem("id") != null) mainView.router.reloadPage('user.html');
	else mainView.router.reloadPage('login.html');
*/

/*
if (window.localStorage.getItem("lock_enter") != null) {
		lock_resume = true;
		myApp.closePanel();
		mainView.router.loadPage('lock.html');
		myApp.params.swipePanel = false;

		addEventListener("popstate", function (e) {
			if (lock_resume) {
				$$('body').detach();
				navigator.app.exitApp();
			}
		}, false);
	}
	
	
	if (window.localStorage.getItem("id") != null) mainView.router.reloadPage('user.html');
	else mainView.router.reloadPage('login.html');
*/

function getAndroidVersion(ua) {
	ua = (ua || navigator.userAgent).toLowerCase();
	var match = ua.match(/android\s([0-9\.]*)/);
	return match ? match[1] : false;
};

$$(window).on('load', function () {


	/*
		// Разкомментировать
		
				if (parseFloat(getAndroidVersion()) < 5 || getAndroidVersion() == false) {
					myApp.alert('Версия вашей ОС не соответствует требований данной версии приложения. Обновите версию Android или используйте другое устройство.', 'Ошибка совместимости!');
					
					alert("Ошибка совместимости!\nВерсия вашей ОС не соответствует требованиям данной версии приложения. Обновите версию Android или используйте другое устройство.");

					navigator.app.exitApp();
				}
				*/

	myApp.params.swipePanel = false;

	if (window.localStorage.getItem("id") != null) {
		mainView.router.reloadPage('search.html');
		myApp.params.swipePanel = 'left';



	} else mainView.router.reloadPage('login.html');

	setTimeout(function () {
		if (window.localStorage.getItem("lock_enter") != null) {
			lock_resume = true;
			myApp.closePanel();
			mainView.router.loadPage('lock.html');
			myApp.params.swipePanel = false;

			addEventListener("popstate", function (e) {
				if (lock_resume) {
					$$('body').detach();
					navigator.app.exitApp();
				}
			}, false);
		}

	}, 100);

	if (window.localStorage.getItem("ava_user") == null) $$('#ava_user').css('background', 'url("img/no_photo.png") center center no-repeat'); else $$('#ava_user').css('background', 'url("'+window.localStorage.getItem("ava_user")+'") no-repeat');
    
    $$('#ava_user').css('background-size', 'cover');
       // background-size: cover;
    /*
    
	if (window.localStorage.getItem("ava_user") == null) $$("#ava_user").attr("src", "img/no_photo.png");
	else $$("#ava_user").attr("src", window.localStorage.getItem("ava_user"));
    */

  
    
	$$(".info_app").html("Flag &#169; alpha V " + version_app);



});



// 1525
// Соединяемся по WebSocket с сервером

// Создаем соединение с сервером; websockets почему-то в Хроме не работают, используем xhr

/*if (navigator.userAgent.toLowerCase().indexOf('chrome') != -1) {
	socket = io.connect('http://127.0.0.1:8080', {
		'transports': ['xhr-polling']
	});
} else {
	socket = io.connect('http://127.0.0.1:8080');
}
*/


// Включаем прослушку сокетов
socket_ini();

function socket_ini() {

if (window.localStorage.getItem("id") != null) {
	try {

		socket = io.connect('http://176.57.217.49:3000');
		socket.on('connect', function () {

			var notification_id = 1;

			// Прием сообщения
			socket.on('message', function (msg) {
				if (myApp.xhr.requestParameters.url == "messages.html") {
					get_messages(msg.text, msg.id_user, msg.name, msg.age);
				} else {


				}

				try {
					cordova.plugins.notification.local.schedule({
						id: "111" + notification_id,
						at: new Date(),
						title: 'Новое сообщение от: ' + msg.name + ', ' + msg.age,
						text: msg.text
					});

					notification_id++;
				} catch (err) {
					console.log("notification не удалось");
				}


				// Добавляем в лог сообщение, заменив время, имя и текст на полученные
				/*
				document.querySelector('#log').innerHTML += strings[msg.event].replace(/\[([a-z]+)\]/g, '<span class="$1">').replace(/\[\/[a-z]+\]/g, '</span>').replace(/\%time\%/, msg.time).replace(/\%name\%/, msg.name).replace(/\%text\%/, unescape(msg.text).replace('<', '&lt;').replace('>', '&gt;')) + '<br>';
				// Прокручиваем лог в конец
				document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;

				console.log(msg.text);
				*/
			});

			//socket.emit("connect_user", "username", "555", 2);
			//socket.emit("connect_user", "username", "555");
			socket.emit("connect_user", window.localStorage.getItem("id"), window.localStorage.getItem("key"));


			// Подключение
			/*
			socket.on('connect_user', function (username, password, idUserGet) {
				socket.emit("connect_user", "username", "555", 1);
			});
			*/

			error_us(1, 'Связь с сервером установлена (WebSocket connect)');

			socket.on('disconnect', function () {
				error_us(1, '<div style="color: red">Потеря связи с сервером (WebSocket disconnect)</div>');
			});
		});


	} catch (err) {
		myApp.addNotification({
			message: '<div style="color: red">Нет связи с сервером. Сообщения не работают. Приносим извинения! (WebSocket).</div>',
			button: {
				text: 'Закрыть'
			},
			hold: 15000
		});
	}

}

}

///////		









myApp.onPageInit('home', function (page) {
	// Do something here for "about" page
	//	alert();
});

myApp.onPageInit('enter', function (page) {
	// Do something here for "about" page



	$$('.enter').on('click', function () {

		$$('.enter').addClass('disabled');
		// Add Directly To Body
		var container = $$('body');
		if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
		myApp.showProgressbar(container, 'orange');
		setTimeout(function () {
			myApp.hideProgressbar();
			$$('.enter').removeClass('disabled');
		}, 5000);
	});


	myApp.params.swipePanel = false;

});


myApp.onPageInit('reg', function (page) {

	myApp.params.swipePanel = false;


	$$('.reg-button').on('click', function () {

		if ($$('#reg-form input[name="username"]').val().length < '3') {
			error_us(1, 'Не заполнено поле Логин');
			return 0;
		}

		if ($$('#reg-form input[name="email"]').val() != '') {
			var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
			if (pattern.test($$('#reg-form input[name="email"]').val()) == false) {
				error_us(1, 'Не верно заполнено поле Почта');
				return 0;
			}
		} else {
			error_us(1, 'Поле e-mail не должно быть пустым');
			return 0;
		}

		if ($$('#reg-form input[name="password"]').val().length < '3') {
			error_us(1, 'Не заполнено поле Пароль');
			return 0;
		}

		if ($$('#reg-form input[name="birthday"]').val().length < '3') {
			error_us(1, 'Не заполнено поле Дата роджения');
			return 0;
		}

		if ($$('#reg-form input[name="invite"]').val().length != '8') {
			error_us(1, 'Не верный формат кода приглашения');
			return 0;
		}


		var formData = myApp.formToJSON('#reg-form');


		ajax_api("auth.signup", formData).then(function (otv) {

			$$('input[name="Invite"]').removeClass('disabled');

			otv = JSON.parse(otv);

			try {
				if (otv.error.code == 1) error_us(1, otv.error.messages);
				if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
				if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
			} catch (e) {}

			if (otv.success == 1) {
				console.log("key: " + otv.key);
				console.log("id: " + otv.id);

				window.localStorage.setItem("key", otv.key);
				window.localStorage.setItem("id", otv.id);
				mainView.router.reloadPage('welcome.html');

				if (otv.message != '') {
					error_us(2, otv.message);
				}
			}
			otv = null;
			delete otv;

		}, function (error) {
			console.log(error);
			$$('input[name="Invite"]').removeClass('disabled');
			error_us(1, 'Ошибка регистрации');
		});



	});


});


myApp.onPageInit('edit_user', function (page) {

	myApp.showPreloader('Одно мгновение...');
	myApp.params.swipePanel = false;


	// Загружаем инфу о пользователе

	var formData = {
		'user_id': my_id,
		'hashtags': "true"
	}

	ajax_api("user.get", formData).then(function (otv) {

			// swiper-bullet-lock

			otv = JSON.parse(otv);

			try {
				if (otv.error.code == 1) error_us(1, 'Ошибка авторизации');
				if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
				if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
			} catch (e) {}

			if (otv.success == 1) {

				try {
					info = JSON.parse(otv.info);

				} catch (err) {
					info = [];
				}



				$$('.edit_user [name="name"]').val(otv.name);
				$$('.edit_user [name="about"]').val(otv.about);

				$$('.edit_user [name="field_1"] [value="' + info[1] + '"]').prop('selected', true);
				$$('.edit_user .field_1 .item-after').html($$('.edit_user [name="field_1"] [value="' + info[1] + '"]').html());

				$$('.edit_user [name="field_2"] [value="' + info[2] + '"]').prop('selected', true);
				$$('.edit_user .field_2 .item-after').html($$('.edit_user [name="field_2"] [value="' + info[2] + '"]').html());


				$$('.edit_user [name="field_3"] option').eq(info[3]).prop('selected', true);
				$$('.edit_user .field_3 .item-after').html($$('.edit_user [name="field_3"] [value="' + info[3] + '"]').html());

				$$('.edit_user [name="field_4"] option').eq(info[4]).prop('selected', true);
				$$('.edit_user .field_4 .item-after').html($$('.edit_user [name="field_4"] [value="' + info[4] + '"]').html());

				$$('.edit_user [name="field_5"] option').eq(info[5]).prop('selected', true);
				$$('.edit_user .field_5 .item-after').html($$('.edit_user [name="field_5"] [value="' + info[5] + '"]').html());

				$$('.edit_user [name="field_6"] option').eq(info[6]).prop('selected', true);
				$$('.edit_user .field_6 .item-after').html($$('.edit_user [name="field_6"] [value="' + info[6] + '"]').html());

				$$('.edit_user [name="field_7"] option').eq(info[7]).prop('selected', true);
				$$('.edit_user .field_7 .item-after').html($$('.edit_user [name="field_7"] [value="' + info[7] + '"]').html());

				$$('.edit_user [name="field_8"] option').eq(info[8]).prop('selected', true);
				$$('.edit_user .field_8 .item-after').html($$('.edit_user [name="field_8"] [value="' + info[8] + '"]').html());


				$$('.edit_user [name="field_9"] option').eq(info[9]).prop('selected', true);
				$$('.edit_user .field_9 .item-after').html($$('.edit_user [name="field_9"] [value="' + info[9] + '"]').html());


				$$('.edit_user [name="field_10"] option').eq(info[10]).prop('selected', true);
				$$('.edit_user .field_10 .item-after').html($$('.edit_user [name="field_10"] [value="' + info[10] + '"]').html());

				$$('.edit_user [name="field_11"] option').eq(info[11]).prop('selected', true);
				$$('.edit_user .field_11 .item-after').html($$('.edit_user [name="field_11"] [value="' + info[11] + '"]').html());

				$$('.edit_user [name="field_12"] option').eq(info[12]).prop('selected', true);
				$$('.edit_user .field_12 .item-after').html($$('.edit_user [name="field_12"] [value="' + info[12] + '"]').html());

				$$('.edit_user [name="field_13"] option').eq(info[13]).prop('selected', true);
				$$('.edit_user .field_13 .item-after').html($$('.edit_user [name="field_13"] [value="' + info[13] + '"]').html());




				setTimeout(function () {

					/*
						if (otv.interests == "") $$('.interests .item-title').html('Нет данных');
						else $$('.interests .item-title').html(otv.interests);

						if (otv.goals == "") {
							$$('.goals .item-title').html('Нет данных');
						} else $$('.goals .item-title').html(otv.goals);

						if (otv.sexual == '') {
							$$('.sexual .item-title').html('Нет данных');
						} else $$('.sexual .item-title').html(otv.sexual);
					*/

					$$('.interests .item-title').html(otv.interests);
					$$('.goals .item-title').html(otv.goals);
					$$('.sexual .item-title').html(otv.sexual);

					popular_hashtags_interests = JSON.parse(otv.popular_hashtags.interests);

					t = '';
					for (var i in popular_hashtags_interests) {
						t = t + '<a href="#">' + popular_hashtags_interests[i] + '</a> ';
					}

					popular_hashtags_goals = JSON.parse(otv.popular_hashtags.goals);

					t2 = '';
					for (var i in popular_hashtags_goals) {
						t2 = t2 + '<a href="#">' + popular_hashtags_goals[i] + '</a> ';
					}

					popular_hashtags_sexual = JSON.parse(otv.popular_hashtags.sexual);

					t3 = '';
					for (var i in popular_hashtags_sexual) {
						t3 = t3 + '<a href="#">' + popular_hashtags_sexual[i] + '</a> ';
					}


					console.log("otv.interests");

					myApp.hidePreloader();


					popupHTML_interests = peremen_interests();
					popupHTML_goals = peremen_goals();
					popupHTML_sexual = peremen_sexual();


				}, 100);



			}
		},
		function (error) {
			console.log(error);
			error_us(1, 'Ошибка чтение данных пользователя');
			myApp.hidePreloader();
		});


	function peremen_interests() {
		return '<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left"><a href="#" class="close-popup link">' +
			'<i class="icon icon-back"></i>' +
			'</a></div>' +
			'<div class="center">Редактирование #хештегов</div>' +
			'<div class="right save_popup_interests"><a href="#" class="link"><i class="material-icons" style="color: #fff;">save</i></a></div></div></div>' +
			'<div class="content-block" style="margin: 0;">' +
			'<div class="content-block-title" style="padding-top: 0; margin: 16px 16px 16px 0;">Интересы</div><div class="list-block"><ul><li><div class="item-content"><div class="item-inner"><div class="item-input"><textarea maxlength="200" class="hashtags_textarea">' + $$('.interests .item-title').html() + '</textarea></div></div></div></li></ul> </div><div class="content-block-title" style="padding-top: 0; margin: 16px 16px 16px 0;">Популярные хештеги</div>' +
			'<p class="hashtags" style="overflow-y: scroll;">' + t + '</p>' +
			'</div>' +
			'</div>';
	}

	function peremen_goals() {
		return '<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left"><a href="#" class="close-popup link">' +
			'<i class="icon icon-back"></i>' +
			'</a></div>' +
			'<div class="center">Редактирование #хештегов</div>' +
			'<div class="right save_popup_goals"><a href="#" class="link"><i class="material-icons" style="color: #fff;">save</i></a></div></div></div>' +
			'<div class="content-block" style="margin: 0;">' +
			'<div class="content-block-title" style="padding-top: 0; margin: 16px 16px 16px 0;">Цели знакомств</div><div class="list-block"><ul><li><div class="item-content"><div class="item-inner"><div class="item-input"><textarea maxlength="200" class="hashtags_textarea">' + $$('.goals .item-title').html() + '</textarea></div></div></div></li></ul> </div><div class="content-block-title" style="padding-top: 0; margin: 16px 16px 16px 0;">Популярные хештеги</div>' +
			'<p class="hashtags" style="overflow-y: scroll;">' + t2 + '</p>' +
			'</div>' +
			'</div>';
	}

	function peremen_sexual() {
		return '<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left"><a href="#" class="close-popup link">' +
			'<i class="icon icon-back"></i>' +
			'</a></div>' +
			'<div class="center">Редактирование #хештегов</div>' +
			'<div class="right save_popup_sexual"><a href="#" class="link"><i class="material-icons" style="color: #fff;">save</i></a></div></div></div>' +
			'<div class="content-block" style="margin: 0;">' +
			'<div class="content-block-title" style="padding-top: 0; margin: 16px 16px 16px 0;">Сексуальные предпочтения</div><div class="list-block"><ul><li><div class="item-content"><div class="item-inner"><div class="item-input"><textarea maxlength="200" class="hashtags_textarea">' + $$('.sexual .item-title').html() + '</textarea></div></div></div></li></ul> </div><div class="content-block-title" style="padding-top: 0; margin: 16px 16px 16px 0;">Популярные хештеги</div>' +
			'<p class="hashtags" style="overflow-y: scroll;">' + t3 + '</p>' +
			'</div>' +
			'</div>';
	}


	$$('.edit_user .interests').on('click', function () {
		myApp.popup(peremen_interests());

		$$('.hashtags a').on('click', function (e) {
			//$$('.hashtags_textarea').focus();
			if ($$('.hashtags_textarea').val().length >= 200) return;
			$$('.hashtags_textarea').val($$('.hashtags_textarea').val() + " " + $$(this).html());
			$$('.hashtags_textarea').scrollTop(999999);
		});

		//$$('.hashtags_textarea').css('height', ($$('.edit_user .popup').height() / 2 - 100) + "px");
		$$('.hashtags_textarea').css('height', ($$('.edit_user .page-content').height() / 2 - 100) + "px");
		$$('.hashtags').css('height', ($$('.edit_user .page-content').height() / 2 - 120) + "px");
		$$('.popup  .save_popup_interests').on('click', function (e) {
			$$('.interests .item-title').html($$('.hashtags_textarea').val());
			peremen_interests();
			myApp.closeModal();
		});
	});

	$$('.edit_user .goals').on('click', function () {
		myApp.popup(peremen_goals());

		$$('.hashtags a').on('click', function (e) {
			if ($$('.hashtags_textarea').val().length >= 200) return;
			$$('.hashtags_textarea').val($$('.hashtags_textarea').val() + " " + $$(this).html());
			$$('.hashtags_textarea').scrollTop(999999);
		});

		$$('.hashtags_textarea').css('height', ($$('.edit_user .page-content').height() / 2 - 100) + "px");
		$$('.hashtags').css('height', ($$('.edit_user .page-content').height() / 2 - 120) + "px");

		$$('.popup  .save_popup_goals').on('click', function (e) {
			$$('.goals .item-title').html($$('.hashtags_textarea').val());
			peremen_goals();
			myApp.closeModal();
		});
	});


	$$('.edit_user .sexual').on('click', function () {
		myApp.popup(peremen_sexual(), true);

		$$('.hashtags a').on('click', function (e) {
			if ($$('.hashtags_textarea').val().length >= 200) return;
			$$('.hashtags_textarea').val($$('.hashtags_textarea').val() + " " + $$(this).html());
			$$('.hashtags_textarea').scrollTop(999999);
		});

		$$('.hashtags_textarea').css('height', ($$('.edit_user .page-content').height() / 2 - 100) + "px");
		$$('.hashtags').css('height', ($$('.edit_user .page-content').height() / 2 - 120) + "px");

		$$('.popup  .save_popup_sexual').on('click', function (e) {
			$$('.sexual .item-title').html($$('.hashtags_textarea').val());
			peremen_sexual();
			myApp.closeModal();
		});
	});






	$$('.edit_user .save_unfo_user').on('click', function () {

		myApp.showPreloader('Одно мгновение...');
		var formData = myApp.formToJSON('.edit_user #info_user_form');


		formData[formData.length, "interests"] = $$('.interests .item-title').html();
		formData[formData.length, "goals"] = $$('.goals .item-title').html();
		formData[formData.length, "sexual"] = $$('.sexual .item-title').html();

		console.log(JSON.stringify(formData));

		console.log(formData);

		ajax_api("user.set", formData).then(function (otv) {

				// swiper-bullet-lock
				console.log(otv);

				otv = JSON.parse(otv);

				console.log(otv);


				try {
					if (otv.error.code == 1) error_us(1, 'Ошибка авторизации');
					if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
					if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
				} catch (e) {}

				if (otv.status == 1) {
					error_us(1, 'Изменения сохранены');
					setTimeout(function () {
						mainView.router.loadPage('settings.html');
					}, 100);


				}

				myApp.hidePreloader();

			},
			function (error) {
				console.log(error);
				error_us(1, 'Ошибка чтение данных пользователя');
				myApp.hidePreloader();
			});



	});


	//	var formData = myApp.formToJSON('#login-form');




	$$('.on_panel').on('click', function () {
		myApp.params.swipePanel = 'left';
	});



	$$('.edit_user .delete_profile').on('click', function () {
		var modal = myApp.modal({
			title: 'Удалить профиль?',
			text: 'Нам очень жаль что Вы хотите покинуть наше приложение! Ваш профиль и вся информация скроется и станет недоступной. У Вас будет год чтобы восстановить аккаунт, потом профиль будет удален полностью.',
			afterText: '<br><a href="#" class="button button-big button-fill button-raised color-red">Удалить профиль</a>',
			buttons: [
				{
					text: 'Закрыть'
		  },

		]
		})
	});


});


myApp.onPageInit('setting_notification', function (page) {
    
  	myApp.showPreloader('Одно мгновение...');
	myApp.params.swipePanel = false;

	var formData = {
		'type': "notifications"
	}
	
	ajax_api("settings.get", formData).then(function (otv) {
	   myApp.hidePreloader();
	   otv = JSON.parse(otv);

        try {
            if (otv.error.code == 1) error_us(1, 'Ошибка авторизации');
            if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
            if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
        } catch (e) {}

        if (otv.success == 1) {
            
            $$('.setting_notification input[name="n1"]').prop('checked', (otv.n1 == '1') ?  true: false);
            $$('.setting_notification input[name="n2"]').prop('checked', (otv.n2 == '1') ?  true: false);
            $$('.setting_notification input[name="n3"]').prop('checked', (otv.n3 == '1') ?  true: false);
            $$('.setting_notification input[name="n4"]').prop('checked', (otv.n4 == '1') ?  true: false);
            $$('.setting_notification input[name="n5"]').prop('checked', (otv.n5 == '1') ?  true: false);

        }

            otv = null;
		},
		function (error) {
			console.log(error);
			error_us(1, 'Ошибка чтение данных настроек');
			myApp.hidePreloader();
		});
    
    
    	$$('.setting_notification .save_setting_set').on('click', function () {
		myApp.showPreloader('Одно мгновение...');
    
         var formData = [];
            
        if ($$('.setting_notification input[name="n1"]').prop('checked')) {
			formData[formData.length, "n1"] = "1";
		} else formData[formData.length, "n1"] = "0";
        if ($$('.setting_notification input[name="n2"]').prop('checked')) {
			formData[formData.length, "n2"] = "1";
		} else formData[formData.length, "n2"] = "0";
        if ($$('.setting_notification input[name="n3"]').prop('checked')) {
			formData[formData.length, "n3"] = "1";
		} else formData[formData.length, "n3"] = "0";
        if ($$('.setting_notification input[name="n4"]').prop('checked')) {
			formData[formData.length, "n4"] = "1";
		} else formData[formData.length, "n4"] = "0";
        if ($$('.setting_notification input[name="n5"]').prop('checked')) {
			formData[formData.length, "n5"] = "1";
		} else formData[formData.length, "n5"] = "0";
            
           console.log("formData");
           console.log(formData);
            
		var formData = myApp.formToJSON('.setting_notification #form_settings');
        formData[formData.length, "type"] = "notifications";
            
      	ajax_api("user.set", formData).then(function (otv) {

				console.log(otv);

				otv = JSON.parse(otv);
				console.log(otv);

				try {
					if (otv.error.code == 1) error_us(1, 'Ошибка авторизации');
					if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
					if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
				} catch (e) {}

				if (otv.status == 1) {
					error_us(1, 'Изменения сохранены');
					setTimeout(function () {
						mainView.router.loadPage('settings.html');
					}, 100);


				}

				myApp.hidePreloader();
			},
			function (error) {
				console.log(error);
				error_us(1, 'Ошибка чтение данных пользователя');
				myApp.hidePreloader();
			});            
           

	});
    
});



myApp.onPageInit('setting_privacy', function (page) {
    
  	myApp.showPreloader('Одно мгновение...');
	myApp.params.swipePanel = false;

	var formData = {
		'type': "privacy"
	}
	
	ajax_api("settings.get", formData).then(function (otv) {
	   myApp.hidePreloader();
	   otv = JSON.parse(otv);

        try {
            if (otv.error.code == 1) error_us(1, 'Ошибка авторизации');
            if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
            if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
        } catch (e) {}

        if (otv.success == 1) {
            
            $$('.setting_privacy input[name="p1"]').prop('checked', (otv.p1 == '1') ?  true: false);
            $$('.setting_privacy input[name="p2"]').prop('checked', (otv.p2 == '1') ?  true: false);

        }
            otv = null;
		},
		function (error) {
			console.log(error);
			error_us(1, 'Ошибка чтение данных настроек');
		});
    
    	$$('.setting_privacy .save_setting_set').on('click', function () {

		myApp.showPreloader('Одно мгновение...');
    
        var formData = [];
		formData[formData.length, "type"] = "privacy";
            
        if ($$('.setting_privacy input[name="p1"]').prop('checked')) {
			formData[formData.length, "p1"] = "1";
		} else formData[formData.length, "p1"] = "0";
        if ($$('.setting_privacy input[name="p2"]').prop('checked')) {
			formData[formData.length, "p2"] = "1";
		} else formData[formData.length, "p2"] = "0";
    
            				console.log("formData");
            				console.log(formData);

		var formData = myApp.formToJSON('.setting_privacy #form_settings');
      	ajax_api("user.set", formData).then(function (otv) {

				otv = JSON.parse(otv);
				console.log(otv);

				try {
					if (otv.error.code == 1) error_us(1, 'Ошибка авторизации');
					if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
					if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
				} catch (e) {}

				if (otv.status == 1) {
					error_us(1, 'Изменения сохранены');
					setTimeout(function () {
						mainView.router.loadPage('settings.html');
					}, 100);
				}
				myApp.hidePreloader();
			},
			function (error) {
				console.log(error);
				error_us(1, 'Ошибка сохранения данных на сервере');
				myApp.hidePreloader();
			});            
	});
});


myApp.onPageInit('edit_photo', function (page) {



	myApp.showPreloader('Одно мгновение...');
	myApp.params.swipePanel = false;



	mySwiper_edit_photo = myApp.swiper('.swiper-2', {
		pagination: '.swiper-2 .swiper-pagination',
		spaceBetween: 10,
		slidesPerView: 3
	});

	mySwiper_edit_hidden_photo = myApp.swiper('.swiper-3', {
		pagination: '.swiper-3 .swiper-pagination',
		spaceBetween: 10,
		slidesPerView: 3
	});



	// Загружаем инфу о пользователе

	var formData = {
		'user_id': my_id
	}

	ajax_api("user.get", formData).then(function (j_otv) {

		// swiper-bullet-lock
		console.log(j_otv);

		j_otv = JSON.parse(j_otv);

		console.log(j_otv);


		try {
			if (j_otv.error.code == 1) error_us(1, 'Ошибка авторизации');
			if (j_otv.error.code == 5) error_us(1, 'Ошибка сервера');
			if (j_otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
		} catch (e) {}

		if (j_otv.success == 1) {

			ii = 0;

			load_photo = [];
			load_photo300 = [];
			load_hidden_photo = [];
			load_hidden_photo300 = [];

			for (var i in j_otv.photo_public) {

				load_photo[load_photo.length] = j_otv.photo_public[i];
				load_photo300[load_photo300.length] = j_otv.square_photo_public[i];

				ii++;
			}

			for (i = 0; i < j_otv.hidden_photo; i++) {

				load_hidden_photo[load_hidden_photo.length] = 'http://176.57.217.49/api/hidden_photos.get.php?id=' + window.localStorage.getItem("id") + '&key=' + window.localStorage.getItem("key") + '&user_id=' + user_id + '&number=' + i + '&key_photo=null&user_id=null&h=' + (Math.random() * (99 - 1) + 1);

				load_hidden_photo300[load_hidden_photo300.length] = 'http://176.57.217.49/api/hidden_photos.get.php?id=' + window.localStorage.getItem("id") + '&key=' + window.localStorage.getItem("key") + '&number=' + i + '&key_photo=null&user_id=null&square=square&h=' + (Math.random() * (99 - 1) + 1);

				//	load_hidden_photo300[load_photo300.length] = j_otv.square_photo_public[i];


			}


			p_edit_photo_update();
			h_edit_photo_update();






			myApp.hidePreloader();
		}
	}, function (error) {
		console.log(error);
		error_us(1, 'Ошибка чтение данных пользователя');
		myApp.hidePreloader();
	});







	$$(".edit_photo .swiper-2").on("touchstart", function (e) {
		myApp.params.swipePanel = false;
	}, false);

	$$(".edit_photo .swiper-2").on("touchend", function (e) {
		myApp.params.swipePanel = 'left';
	}, false);

	$$(".edit_photo .swiper-3").on("touchstart", function (e) {
		myApp.params.swipePanel = false;
	}, false);

	$$(".edit_photo .swiper-3").on("touchend", function (e) {
		myApp.params.swipePanel = 'left';
	}, false);


	$$(".edit_photo #demo-basic").on("touchstart", function (e) {
		myApp.params.swipePanel = false;
	}, false);

	$$(".edit_photo #demo-basic").on("touchend", function (e) {
		myApp.params.swipePanel = 'left';
	}, false);



	$$("head").append("<link rel='stylesheet' type='text/css' href='croppie/croppie.css?q=e" + Math.random() + "' />");




	$$('.edit_photo .save_photo_load_user').on('click', function () {
		doAjax2(buildFormData());


		myApp.modal({
			title: 'Загрузка фото',
			afterText: 'Передача данных на сервер.<br><br><div class="progressbar edit_photo_progressload" data-progress="0"><span></span></div><br><div class="edit_photo_pr_load" style="text-align: center;"></div>',
			buttons: [
				{
					text: 'Отмена',
					onClick: function () {
						//myApp.alert('ага, конечно...', 'Ой, все...')
					}
		  },
		]
		});

		progressbar = $$('.edit_photo_progressload');



	});


});


function edit_photo_add_photo(hidden) {
	var modal = myApp.modal({
		title: 'Загрузить фото',
		text: 'Чем больше у вас фотографий, тем больше к вам внимания. Фото должно соответствовать <a href="about.html" class="item-link item-content" onclick="myApp.closeModal();">правилам размещения!</a>',
		afterText: '<br><a href="#" class="button button-big button-fill button-raised color-pink" onclick="myApp.closeModal(); myApp.showPreloader(\'Одно мгновение...\'); $$(\'.edit_photo .page-content\').hide();  add_photo_user(pictureSource.PHOTOLIBRARY, ' + hidden + ');">Выбрать фото</a>',
		buttons: [
			{
				text: 'Закрыть'
		  },

		]
	});
}



function popover_photo(hidden, number) {
	if (hidden) var clickedLink = $$(".swiper-3");
	else var clickedLink = $$(".swiper-2");

	if (hidden) var t = 'публичные';
	else var t = 'скрытые';

	var popoverHTML = '<div class="popover">' +
		'<div class="popover-inner">' +
		'<div class="list-block">' +
		'<ul>' +
		'<li><a href="#" class="item-link list-button" onclick="move_photo_user_load(' + hidden + ', ' + number + ', \'>\')">Переместить вперед</li>' +
		'<li><a href="#" class="item-link list-button" onclick="move_photo_user_load(' + hidden + ', ' + number + ', \'<\')">Переместить назад</li>' +
		'<li><a href="#" class="item-link list-button" onclick="delete_photo_user_load(' + hidden + ', ' + number + ')">Удалить фото?</li>' +
		'<li><a href="#" class="item-link list-button" onclick="edit_status_photo_user_load(' + hidden + ', ' + number + ')">Переместить в ' + t + '</li>' +
		'</ul>' +
		'</div>' +
		'</div>' +
		'</div>'
	myApp.popover(popoverHTML, clickedLink);
}



myApp.onPageInit('login', function (page) {
	vibrate();
	$$('.name_app_p').on('click', function () {
		mainView.router.reloadPage('index.html');
	});

	$$('input').on('focus', function () {
		if ($$(this).val() == 'E-mail') $$(this).val('');
		if ($$(this).val() == 'Пароль') $$(this).val('');
		$$('.bottom').hide();
	});
	$$('input').on('focusout', function () {
		if ($$(this).val() == '') $$(this).val('E-mail');
		$$('.bottom').show();
	});



	$$('.login .color-white').on('click', function () {


		if ($$('#login-form input[name="email"]').val() == 'E-mail') {
			error_us(1, 'Не заполнено поле E-mail');
			return 0;
		}

		if ($$('#login-form input[name="password"]').val() == 'Пароль') {
			error_us(1, 'Не верный формат пароля');
			return 0;
		}

		if ($$('#login-form input[name="email"]').val() != '') {
			var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
			if (pattern.test($$('#login-form input[name="email"]').val()) == false) {
				error_us(1, 'Не верно заполнено поле E-mail');
				return 0;
			}
		} else {
			error_us(1, 'Поле E-mail не должно быть пустым');
			return 0;
		}

		if ($$('#login-form input[name="password"]').val().length < '4') {
			error_us(1, 'Не верный формат пароля');
			return 0;
		}

		$$('.login .color-white').addClass('disabled');

		var formData = myApp.formToJSON('#login-form');

		if (localStorage.getItem('ava_user') == null) {
			formData[formData.length, "ava_user"] = "null";
		} else {
			formData[formData.length, "ava_user"] = str.substr(0, localStorage.getItem('ava_user').length - 8);
		}

		ajax_api("auth.login", formData).then(function (otv) {

			$$('.login .color-white').removeClass('disabled');

			otv = JSON.parse(otv);
			try {
				if (otv.error.code == 1) error_us(1, 'Неверные данные для входа');
				if (otv.error.code == 2) error_us(1, 'Пользователь заблокирован');
				if (otv.error.code == 3) error_us(1, 'Пустое поле');
				if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
				if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
			} catch (e) {}

			if (otv.success == 1) {
				console.log("key: " + otv.key);
				console.log("id: " + otv.id);
				console.log("response: " + otv.response);

				// Установка параметоров
				window.localStorage.setItem("key", otv.key);
				window.localStorage.setItem("id", otv.id);
				my_id = otv.id;
				mainView.router.reloadPage('search.html');
                socket_ini();

				$$('.response-messages').html(otv.response.messages);
				$$('.response-guests').html(otv.response.guests);
				$$('.response-ads').html(otv.response.ads);

				if ($$('.response-messages').html() == '0') $$('.response-messages').hide();
				if ($$('.response-guests').html() == '0') $$('.response-guests').hide();
				if ($$('.response-ads').html() == '0') $$('.response-ads').hide();

				if (otv.message != '') {
					error_us(2, otv.message);
				}
				if (otv.ava == '') {
					//$$("#ava_user").attr("src", "img/no_photo.png");
                    $$('#ava_user').css('background', 'url("img/no_photo.png") center center no-repeat');
				} else {
					window.localStorage.setItem("ava_user", otv.ava);
					//$$("#ava_user").attr("src", otv.ava);
                    $$('#ava_user').css('background', 'url("'+otv.ava+'") center center no-repeat');
                    
                    
                    $$('#ava_user').css('background-size', 'cover');
				}

			}

			otv = null;

		}, function (error) {
			console.log(error);
			$$('.login .color-white').removeClass('disabled');
			error_us(1, 'Ошибка авторизации')
		});




	});


});

function error_us(id, text, sec) {
	if (sec == '') sec = 5000;
	myApp.addNotification({
		message: text,
		button: {
			text: 'Закрыть'
		},
		hold: 5000
	});
}



var container = $$('body');
//if (container.children('.progressbar, .progressbar-infinite').length) return;

// разкомментировать
/*
navigator.geolocation.getCurrentPosition(function (position) {
	if (position.coords.latitude == null || position.coords.longitude == null) {
		myApp.alert('Ваши географические координаты нужны для показа парней поблизости 4.\n', 'Ошибка чтение координат');
	} else {
		my_latitude = position.coords.latitude;
		my_longitude = position.coords.longitude;
	}
}, function (error) {
	// Раскомментировать
	//myApp.alert('Ваши географические координаты нужны для показа парней поблизости 2.\n', 'Ошибка чтение координат');
});
*/

function ajax_api(method, date) {
	console.log("ВЫЗОВ  ajax_api");
	prom = null;

	// Раскомментировать

	navigator.geolocation.getCurrentPosition(function (position) {
		if (position.coords.latitude == null || position.coords.longitude == null) {
			myApp.alert('Ваши географические координаты нужны для показа парней поблизости 4.\n', 'Ошибка чтение координат');
		} else {
			my_latitude = position.coords.latitude;
			my_longitude = position.coords.longitude;
		}
	}, function (error) {
		// Раскомментировать
		//myApp.alert('Ваши географические координаты нужны для показа парней поблизости 2.\n', 'Ошибка чтения координат');
	});
	/*
	
	*/

	function onError(error) {
		// Раскомментировать
		myApp.alert('Ваши координаты нужны для показа парней поблизости 3.\n' + 'error: ' + error.code + '\n', 'Ошибка чтение координат');
	}

	// Разработка
	$$(".info_app").append("<br>Гео: " + my_latitude + " " + my_longitude);



	if (xhr != undefined) xhr.abort();
	prom = new Promise(function (succeed, fail) {

		// проверить емеется ли сейчас запрос по переменной
		// Если есть завершить Promise путем  fail(response["status"]); и оборвать ajax //xhr.abort();




		date[date.length, "version"] = version_app;
		date[date.length, "id"] = window.localStorage.getItem("id");
		date[date.length, "key"] = window.localStorage.getItem("key");

		date[date.length, "latitude"] = my_latitude;
		date[date.length, "longitude"] = my_longitude;
		data = JSON.stringify(date);

		console.log("AJAX >> ");
		console.log(method);
		console.log(data);

		myApp.showProgressbar(container, 'orange');


		console.log("ВЫЗОВ  ajax_api в Promise");
		xhr = $$.ajax({
			url: "http://176.57.217.49/api/index.php?method=" + method,
			method: "POST",
			crossDomain: true,
			data: "data=" + data,
			error: function (response) {
				real_ajax_send = false;
				myApp.hideProgressbar();

				console.log("error");
				console.log(response);
				console.log(response["status"]);
				console.log(response["statusText"]);

				// Если произошла ошибка и это не сообщения то выводим ошибку
				if (method != 'messages.get.messages') {

					if (response["status"] == 0) t = 'Ошибка подключения';
					else
					if (response["status"] == 404) t = 'Сервер не найден';
					else
					if (response["status"] == 500) t = 'error ' + response["status"] + ': ' + response["statusText"];
					else
						t = 'error ' + response["status"] + ': ' + response["statusText"];

					myApp.addNotification({
						message: t,
						button: {
							text: 'Закрыть'
						},
						hold: 5000
					});

				}


				fail(response["status"]);
			},
			success: function (response) {
				real_ajax_send = false;

				console.log("AJAX << ");
				console.log(response);
				//console.log("Ответ скрыт " + method);


				try {
					parsed = JSON.parse(response);
					succeed(response);
				} catch (e) {
					fail('Болеет JSON');
					error_us(1, 'Болеет JSON');
				}

				response = null;
				delete response;
				myApp.hideProgressbar();

			},
			complete: function (response) {
				// не работает =(
				// хотя вроде работает...
				console.log("ВСЕ!");

			},
			start: function (response) {
				// не работает =(
				// хотя вроде работает...
				console.log("Начал!");
			}
		});
		//xhr.abort();

	});

	return prom;
}






myApp.onPageInit('crop_img', function (page) {
	//$$.getScript('croppie/croppie.js'); 
	myApp.hidePreloader();
	myApp.closeModal();
	myApp.params.swipePanel = false;
	$$("head").append("<link rel='stylesheet' type='text/css' href='croppie/croppie.css?q=e" + Math.random() + "' />");
	//	$$("head").append("<script src='croppie/croppie.js'></script>");

	//alert(photo_user);

	var el = document.getElementById('demo-basic');
	if (photo_1 == '') {
		var vanilla = new Croppie(el, {
			viewport: {
				width: screen.width,
				//width: 607,
				height: "auto"
			},
			showZoomer: false,
			//boundary: { width: 375, height: 667 },
		});

		myApp.addNotification({
			message: "Обрежте фото, как оно будет выглядить на экраню Можно использовать свайп приближения",
			button: {},
			hold: 3000
		});
	} else {
		var vanilla = new Croppie(el, {
			viewport: {
				width: 300,
				height: 300
			},
			showZoomer: false,
		});
		myApp.addNotification({
			message: "А теперь квадратное фото, как оно будет выглядить в плитках.",
			button: {},
			hold: 3000
		});
	}
	vanilla.bind({
		url: photo_user,
		//url: 'croppie/demo/demo-1.jpg',
		ShowZoomer: false
	});



	$$('.crop_img .crop_but').on('click', function () {
		myApp.showPreloader('Одно мгновение...');
		$$('.crop_img .crop_but').addClass('disabled');


		console.log("Начал обработку base64");
		vanilla.result('base64').then(function (base64) {
			// html is div (overflow hidden)
			// with img positioned inside.
			console.log(base64);
			if (photo_1 == '') {

				photo_1 = base64;
				mainView.router.reloadPage('crop_img.html');

			} else {
				//photo_2 = base64;
				//alert('Отправка на сервер 2-х фото');
				//mainView.router.loadPage('crop_img.html');


				var formData = {
					'photo': photo_1,
					'square_photo': base64
				}

				ajax_api("photos.saveOwnerPhoto", formData).then(function (otv) {

					otv = JSON.parse(otv);

					try {
						if (otv.error.code == 1) error_us(1, 'Неверные данные');
						if (otv.error.code == 2) error_us(1, 'Неверный формат фото');
						if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
						if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
					} catch (e) {}


					if (otv.success == 1) {
						if (otv.message != undefined) {
							error_us(2, otv.message);
						}
						photo_1 = '';
						photo_2 = '';


						setTimeout(function () {
							mainView.router.loadPage('user.html');
							myApp.hidePreloader();
							myApp.params.swipePanel = 'left';
						}, 3000);
					}
				}, function (error) {
					console.log(error);
					$$('input[name="Invite"]').removeClass('disabled');
					error_us(1, 'Ошибка отправки фото');
					myApp.hidePreloader();
				});

				formData = null;
				base64 = null;
				photo_1 = null;
				otv = null;

				delete formData;
				delete base64;
				delete photo_1;
				delete otv;

				photo_user = null;
				delete photo_user;
			}
		});
	});




});



function onPageInit_messages() {
	function messages_get_dialogues() {
		alert();
	}



}





/*	*/

function messages_get_dialogues(formData) {
	ajax_api("messages.get_list", formData).then(function (otv) {

		otv = JSON.parse(otv);
		str = [];
		str_del = [];

		try {
			if (otv.error.code == 1) error_us(1, otv.error.messages);
			if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
			if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
		} catch (e) {}

		if (otv.success == 1) {
			$$('.navbar-inner .center').html("Сообщения");

			$$('.hit_list .page-content').css('background', 'none');
			j = 0;
			for (var i in otv.data) {

				/*
				if ( == 1) otv.data[i]["online"] = '<div class="online"></div>';
				else otv.data[i]["online"] = '';
				*/
				// Надо удалить старые записи об пользователе


				// Создание записи данные которых придут из сети

				id_t = otv.data[i]["id"];
				name_t = otv.data[i]["name"];
				age_t = otv.data[i]["age"];

				if (otv.data[i]["photo"] == undefined) ava_t = 'img/no_photo.png';
				else ava_t = otv.data[i]["photo"];
				icon_t = otv.data[i]["new"];
				text_t = otv.data[i]["text"];
				date_t = otv.data[i]["date"];

				//timestamp_t = otv.data[i]["name"];
				timestamp_t = 0;

				str[i - 1] = "(" + id_t + ", '" + name_t + "', " + age_t + ", '" + ava_t + "', " + icon_t + ", '" + text_t + "', '" + date_t + "')";
				str_del[i - 1] = "id_user = " + id_t;


			}


			db.transaction(function (tx) {
				tx.executeSql("DELETE FROM dialog_list WHERE " + str_del.join(' OR '), [], null, null);

				//console.log("DELETE FROM dialog_list WHERE " + str_del.join(' OR '));
			});

			/*
			console.log("+++");
			console.log(str.join(', '));
			*/

			db.transaction(function (tx) {
				//tx.executeSql("INSERT INTO dialog_list (id_user, name, age, ava, icon, text, timestamp) values(?, ?, ?, ?, ?, ?, ?)", [], null, null);
				tx.executeSql("INSERT INTO dialog_list (id_user, name, age, ava, icon, text, timestamp) values " + str.join(', ') + "", [], null, null);
			});

			updata_dialog_list();

			ava_t = null;

			if (otv.message != undefined) {
				error_us(2, otv.message);
			}

			otv = null;
		}
	}, function (error) {
		console.log(error);
		updata_dialog_list();
		$$('.navbar-inner .center').html("Сообщения (offline)");
	});

}


function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

function timeConverter(UNIX_timestamp, day_t) {
	var a = new Date(UNIX_timestamp * 1000);
	//var months = ['', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var year = a.getFullYear();
	var month = a.getMonth();
	var day = a.getDate();
	var hour = addZero(a.getHours());
	var min = addZero(a.getMinutes());
	var sec = addZero(a.getSeconds());

	month++;
	month = (month == 10 || month == 11 || month == 12) ? month : "0" + month;

	var date = new Date()
	new_date = (date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear());

	if (day_t) {

		if ((day + '.' + month + '.' + year) == new_date) {
			return 'Сегодня';
		} else if (((day + 1) + '.' + month + '.' + year) == new_date) {
			return 'Вчера';
		} else {
			return day + '.' + month + '.' + year;
		}


	} else {
		// console.log(day + '.' + month + '.' + year + "==" + new_date);
		if ((day + '.' + month + '.' + year) == new_date) {
			//	return 'Сегодня в ' + hour + ':' + min;
			return hour + ':' + min;
		} else if (((day + 1) + '.' + month + '.' + year) == new_date) {
			//return 'Вчера в ' + hour + ':' + min;
			return hour + ':' + min;
		} else {
			//return day + '.' + month + '.' + year + ' в ' + hour + ':' + min;
			return hour + ':' + min;
		}
	}

}

// Выгрузка данных из базы во вью
function updata_dialog_list() {
	//$$('.messages .media-list ul').html("");

	db.transaction(function (tx) {
		tx.executeSql("SELECT * FROM dialog_list ORDER BY timestamp DESC", [], function (tx, result) {


			for (var i = 0; i < result.rows.length; i++) {
				console.log(result.rows.item(i)['id_user']);

				t = '';
				if (result.rows.item(i)['icon'] != null) t = '<span class="badge bg-green">' + result.rows.item(i)['icon'] + '</span>';
				if (result.rows.item(i)['icon'] == null) t = '<i class="material-icons"></i>';

				$$('.messages .media-list ul').append('<li class="load_conversation" data-id="' + result.rows.item(i)['id_user'] + '" >\
				  <a href="#" class="item-link item-content">\
					<div class="item-media"><img src="' + result.rows.item(i)['ava'] + '" width="80" onclick="user_go(' + result.rows.item(i)['id_user'] + ');" ></div>\
					<div class="item-inner">\
					  <div class="item-title-row">\
						<div class="item-title">' + result.rows.item(i)['name'] + ', ' + result.rows.item(i)['age'] + '</div>\
						<div class="item-after">' + timeConverter(result.rows.item(i)['timestamp']) + '</div>\
					  </div>\
					  <div class="item-subtitle">' + t + '</div>\
					  <div class="item-text">' + result.rows.item(i)['text'] + '</div>\
					</div>\
				  </a>\
				</li>');
				t = '';

			}
		}, null)
	});
}


myApp.onPageInit('messages', function (page) {

	function get_data_hit_list_0(page) {

	}


	page = 0;
	var formData = {
		'page': page
	}


	// Подключение к БД
	db = openDatabase("messages", "0.1", "Table messages.", 200000);
	if (!db) {
		error_us(1, "Ошибка подключения к локальной базе Failed to connect to database.");
	}

	// Проверяем существование таблицы dialog_list, если ее нет, то создаем
	db.transaction(function (tx) {
		tx.executeSql("SELECT COUNT(*) FROM dialog_list", [], function (result) {
			// Если таблица есть и ее не нужно создавать
			//alert('dsfsdf')
		}, function (tx, error) {
			tx.executeSql("CREATE TABLE dialog_list (id_user INT, name TEXT, age INT, ava TEXT, icon INT, text TEXT, timestamp REAL)", [], null, null);
		})
	});

	// Проверяем существование таблицы dialog_list, если ее нет, то создаем
	db.transaction(function (tx) {
		tx.executeSql("SELECT COUNT(*) FROM messages", [], function (result) {

		}, function (tx, error) {
			tx.executeSql("CREATE TABLE messages (id_user INT, sender INT, text TEXT, icon INT, timestamp REAL)", [], null, null);
		})
	});


	messages_get_dialogues(formData);




	$$('.messages .conversation').scrollTop(9999);
	setTimeout(function () {
		$$('.messages .conversation').scrollTop(9999);
	}, 1000);



	// Адаптируем
	var boxWidth = $$('div.page-content').width();
	if (boxWidth <= 750) {
		show_dialog_list();
		$$('.messages .toolbar').hide();
		full_mess = false;
	} else {
		$$('.messages .toolbar').addClass('messagebar_full');
		full_mess = true;
	}


	// История переписки
	var myMessages = myApp.messages('.messages_div', {
		autoLayout: true
	});
	var myMessagebar = myApp.messagebar('.messagebar');

	conversationStarted = true;



	// Спускаемся вниз истории переписки
	myMessages.scrollMessages();
	setTimeout(function () {
		myMessages.scrollMessages();
	}, 400);



	$$(".popover-links .item-link").on("click", function (e) {
		error_us(1, 'Класс messages-r не зарегистрирован');
		myApp.closeModal();
	});


	// По умолчанию отключаем событие infinite
	myApp.detachInfiniteScroll(".messages .page-content");

	// Loading flag
	var loading = false;
	var page_t = 1;


	// Событие нажатия на сообщение в списке сообщений
	$$(".messages .dialog_list").on("click", ".load_conversation", function (e) {
		page_t = 1;
		myMessages.clean();

		// Отключаем событие infinite
		myApp.detachInfiniteScroll(".messages .page-content");

		// Загружаем сообщения из сети
		load_conversation($$(this).data('id'), 0);



		select_user = $$(this).data('id');
		//show_conversation($$(this).find(".item-title").html(), $$(this).find("img").src());
		show_conversation(select_user, $$(this).find(".item-title").html(), $$(this).find("img").attr('src'));


		// Скрытие значка "Выберите диалог"
		$$('.messages .new_dialog_text').hide();
	});


	// Если окно сообщений открывается во вне

	setTimeout(function () {
		intent_messages_load();
	}, 500);

	// Если окно сообщений открывается во вне
	function intent_messages_load(user) {
		if (intent_messages == 0) return;

		page_t = 1;
		//myMessages.clean();

		// Отключаем событие infinite
		myApp.detachInfiniteScroll(".messages .page-content");

		// Загружаем сообщения из сети
		load_conversation(intent_messages, 0);




		var q = $$('.user .swiper-slide').css('background-image').replace('url(', '');


		show_conversation(intent_messages, $$('.user .open_info_user .name').html(), q.replace('")', ''));

		select_user = intent_messages;

		// Скрытие значка "Выберите диалог"
		$$('.messages .new_dialog_text').hide();

		intent_messages = 0;
	}




	// Событие прокрутки сообщений до верха
	$$('.messages .conversation').on('infinite', function () {
		if (loading) return;
		loading = true;


		load_conversation(select_user, page_t);
		page_t++;

	});



	// Отправка сообщения (демо)
	$$('.messagebar .link').on('click', function () {
		var messageText = myMessagebar.value().trim();

		if (messageText.length === 0) return;

		// Empty messagebar
		myMessagebar.clear()


		// Отправляем сообщение
		socket.send(messageText, select_user);
		// socket.send(messageText, select_user, my_id, window.localStorage.getItem("key"));



		// Random message type
		//var messageType = (['sent', 'received'])[Math.round(Math.random())];
		var messageType = (['sent', 'received'])[Math.round(Math.random())];

		// Avatar and name for received message
		/*
		var avatar, name;
		if (messageType === 'received') {
			avatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
			name = 'Kate';
		}
		*/

		//var tt = new Date().getHours() + ':' + new Date().getMinutes();

        var tt = timeConverter(Math.round(new Date().getTime()/1000.0));
        
		// Add message
		myMessages.addMessage({
			// Message text
			text: messageText,
			// Random message type
			type: "sent",
			// Avatar and name:
			//avatar: avatar,
			//name: name,
			// Day
			date: tt,
			day: !conversationStarted ? 'Today' : false,
			//time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
			time: (new Date())
		});

		// Update conversation flag
		conversationStarted = true;

	});


	// Загружаем сообщения из локальной базы
	function load_local_conversation(user, page) {


		$$('.navbar-inner .center').html("Сообщения (offline)");

		var messages = [];
		var r, t;
		db.transaction(function (tx) {
			var page_t = page * 30;
			//if(page == 0) page_t = 30;

			tx.executeSql("SELECT * FROM messages WHERE id_user = " + user + " ORDER BY timestamp DESC limit " + page_t + ", 30", [], function (tx, result) {


				// !!! Нужно заменить перебор массива циклом в конструкцию arr.map(function (obj) { ... !!!
				for (var i = 0; i < result.rows.length; i++) {
					t = '';
					r = '';

					if (result.rows.item(i)['icon'] == 1) t = "Просмотрено";
					if (result.rows.item(i)['sender'] == 1) r = "received";

					arr = {
						text: result.rows.item(i)['text'],
						label: t,
						type: r,
						date: timeConverter(result.rows.item(i)['timestamp'])
					}

					messages.unshift(arr);
				}


				console.log("+++messages");
				console.log(messages);

				// Нужно перебрать массив поставить нармальную дату и время
				/*
				arr.map(function (obj) {

					if (obj["icon"] == 1) obj["label"] = "Просмотрено";
					if (obj["sender"] == 1) obj["type"] = "received";


					return obj;
				});
				*/

				myMessages.addMessages(messages, 'prepend');

				setTimeout(function () {
					loading = false;
				}, 1000);
				//if (page != 0) loading = false;

				// Если сообщений больше 30
				if (i == 30) {
					// Включаем подгрузку сообщений при прокрутке
					setTimeout(function () {
						myApp.attachInfiniteScroll(".messages .page-content");
					}, 1000);
				}

			}, null)
		});
	}





	var old_date = 0;

	var old_date_info = [];


	// Отображаем историю переписки
	function load_conversation(user, page) {

		var formData = {
			'page': page,
			'user': user
		}


		$$('.navbar-inner .center').html("Сообщения");

		ajax_api("messages.get.messages", formData).then(function (otv) {

				otv = JSON.parse(otv);
				str = [];
				str_del = [];

				try {
					if (otv.error.code == 1) error_us(1, otv.error.messages);
					if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
					if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
				} catch (e) {}

				if (otv.success == 1) {

					var messages = otv.data;

					console.log(otv);
					if (messages == '') {
						$$('.messages .none_dialog_text').show();
						console.log("none_dialog_text");
					} else {
						$$('.messages .none_dialog_text').hide();
					}


					// Детекция первого и последнего сообщения				
					console.log("// Детекция времени первого сообщения");
					//console.log(messages[0]["text"]);
					//console.log(messages[0]["date"]);

					var now_date = messages[0]["date"];


					// Удаляем все сообщения их локальной базы которые больше 
					db.transaction(function (tx) {

						if (page == 0) {
							tx.executeSql("DELETE FROM messages WHERE id_user = " + user + " AND timestamp >= ?", [now_date], null, null);


						} else {
							tx.executeSql("DELETE FROM messages WHERE id_user = " + user + " AND timestamp >= ? AND timestamp <= ?", [now_date, old_date], null, null);


							console.log("now_date");
							console.log(now_date);
							console.log("old_date");
							console.log(old_date);
						}

						old_date = now_date;
						old_date_info[page] = "(" + user + ", '" + messages[0]["sender"] + "', '" + messages[0]["text"] + "', '" + messages[0]["stamp"] + "', '" + now_date + "')";


						console.log("+++");
						console.log(old_date_info);

					});




					console.log(t);

					// Создание записи данные которых придут из сети
					i = 0;
					for (var i in messages) {
						str[i] = "(" + user + ", '" + messages[i]["sender"] + "', '" + messages[i]["text"] + "', '" + messages[i]["stamp"] + "', '" + messages[i]["date"] + "')";
					}

					// Записываем диалог в базу
					db.transaction(function (tx) {
						tx.executeSql("INSERT INTO messages (id_user, sender, text, icon, timestamp) values " + str.join(', ') + "", [], null, null);
						if (page != 0) {
							tx.executeSql("INSERT INTO messages (id_user, sender, text, icon, timestamp) values " + old_date_info[page - 1] + "", [], null, null);
						}

					});


					var temp = 0;
					// Нужно перебрать массив поставить нармальную дату и время
					messages.map(function (obj) {


						if (obj["sender"] == 1) {
							obj["type"] = "received";

						} else if (obj["stamp"] == 1) obj["label"] = "Просмотрено";


						if (timeConverter(obj["date"], true) != temp) {
							obj["day"] = timeConverter(obj["date"], true);
						}
						temp = timeConverter(obj["date"], true);


						/*
						if (timeConverter(obj["date"], true) == "19.10.2017") {
							obj["day"] = timeConverter(obj["date"], true);
						}
						*/

						obj["date"] = timeConverter(obj["date"], false);

						return obj;
					});

					console.log("messages");
					console.log(messages);

					// Gередаем Массив конструктуру myMessages				

					myMessages.addMessages(messages, 'prepend');
					if (page != 0) loading = false;

					// Если сообщений больше 30
					if (messages.length >= 30) {
						// Включаем подгрузку сообщений при прокрутке
						setTimeout(function () {
							myApp.attachInfiniteScroll(".messages .page-content");
						}, 1000);
					}

					/*
					if (obj.message != undefined) {
						error_us(2, otv.message);
					}
					*/
					otv = null;
				}
			},
			function (error) {
				console.log(error);

				load_local_conversation(user, page);
			});
	}

	/*
	Удаление таблиц

	db.transaction(function (tx) {
		  tx.executeSql('DROP TABLE dialog_list ');
	});
	
		db.transaction(function (tx) {
		  tx.executeSql('DELETE FROM messages WHERE id_user = 4');
	});
db.transaction(function (tx) {
		  tx.executeSql('DELETE FROM dialog_list WHERE id_user != -1');
	});
db.transaction(function (tx) {
		  tx.executeSql('DELETE FROM messages WHERE id_user != -1');
	});
	
	messages
	*/

});


// Прием сообщений


function get_messages(messageText, user, name, age) {

	try {
		// Проверяем пришедшее сообшение с открытым диалогом
		if (select_user != user) {
			// Обновляем список диалогов
			var formData = {
				'page': 0
			}

			$$('.response-messages').html(Number($$('.response-messages').html()) + 1);
			messages_get_dialogues(formData);
			return;
		}


		//navigator.vibrate(200);
	} catch (err) {
		console.log("Вибрация не удалась");
	}

	/*
	cordova.plugins.notification.local.schedule({
		id: 1,
		title: "Production Jour fixe",
		text: "Duration 1h",
		every: "week",
		icon: "https://pp.userapi.com/c630427/v630427777/ae5a/FfD0RS1W70w.jpg",
		data: {
			meetingId: "123#fg8"
		}
	});
	
	cordova.plugins.notification.local.on("click", function (notification) {
		navigator.notification.vibrate(2000);
	});
	
*/


	try {


		var myMessages = myApp.messages('.messages_div', {
			autoLayout: true
		});


		var tt = new Date().getHours() + ':' + new Date().getMinutes();

		var ttt = new Date().getDate();

		if (temp == undefined) {
			var temp = new Date().getDate();
		}

		// Add message
		if (ttt != temp) {
			var Today = "Сегодня";
		}
		temp = new Date().getDate();

		myMessages.addMessage({
			text: messageText,
			type: "received",
			day: Today,
			date: tt
		});

	} catch (err) {
		console.log("Не удалась вписать сообщение");
	}
}

function show_conversation(id_us, name_user, ava_user) {

	history.pushState(null, null, location.href);
	window.onpopstate = function (event) {
		try {
			e.preventDefault();
		} catch (e) {}
		return false;
		history.go(1);
	};
	addEventListener("popstate", function (e) {
		show_dialog_list();
		e.preventDefault();
		return false;
	}, false);


	// Закрываем панель списка диалогов в планетах
	if (!full_mess) {
		$$('.messages .dialog_list').hide();

		$$('.messages .conversation').show();
		$$('.messages .conversation').css('width', '100%');
	}




	// Показ поля ввода сообщения
	$$('.messages .toolbar').show();

	$$('.messages .conversation').scrollTop(9999);
	setTimeout(function () {
		$$('.messages .conversation').scrollTop(9999);
	}, 1000);



	$$('.navbar-inner .center').html("<span onclick='user_go(" + id_us + ")'><div  class='ava' style='background-image: url(" + ava_user + ");'></div>" + name_user + '</span>');

}

function show_dialog_list() {

	//$$('.messages .toolbar').removeClass('messagebar_full');
	$$('.navbar-inner .center').html("Сообщения");

	$$('.messages .dialog_list').show();

	$$('.messages .conversation').hide();
	$$('.messages .dialog_list').css('width', '100%');
}


myApp.onPageInit('welcome', function (page) {

	//$$("head").append("<link rel='stylesheet' type='text/css' href='css/welcome.css?q=e" + Math.random() + "' />");



	myApp.params.swipePanel = false;
	$$(".welcome").show();
	//$$(".welcome")..hide();

	var mySwiper_welcome = myApp.swiper('.welcome .swiper-container', {
		pagination: '.swiper-pagination'
	});


	$$('img').on('error', function () {
		$$(this).attr("src", "img/error.png");
	});


});


myApp.onPageInit('favorites', function (page) {


	var formData = {}

	ajax_api("favorites.get", formData).then(function (otv) {

		otv = JSON.parse(otv);

		try {
			if (otv.error.code == 1) error_us(1, otv.error.messages);
			if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
			if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
		} catch (e) {}

		if (otv.success == 1) {

			// Показ имени и возраста
			//	$$('.user .name').html(otv.name + ", " + otv.age);

			for (var i in otv.data) {

				if (otv.data[i]["online"] == 1) otv.data[i]["online"] = '<div class="online"></div>';
				else otv.data[i]["online"] = '';

				if (otv.data[i]["photo"] == null) {
					temp_photo = "img/no_photo.png";
				} else {
					temp_photo = otv.data[i]["photo"];
					otv.data[i]["photo"] = null;
				}

				//	$$('.favorites .user_photo').append('<div onclick="user_go(' + otv.data[i]["id"] + ');" class="col-33 user" id="elem_col">' + otv.data[i]["online"] + '<img src="' + temp_photo + '"><div class="info">' + otv.data[i]["name"] + ', ' + otv.data[i]["age"] + '</div></div>');


				$$('.favorites .user_photo').append('<div onclick="user_go(' + otv.data[i]["id"] + ');" class="lazy col-33 user" id="elem_col1" data-background="' + temp_photo + '">' + otv.data[i]["online"] + ' <div class="info">' + otv.data[i]["name"] + ', ' + otv.data[i]["age"] + '</div></div>');


			}


			myApp.initImagesLazyLoad(".favorites");
			$$('.favorites .user').css('height', $$('.favorites .user').width() + "px");



			if (i == undefined) {
				$$('.favorites .page-content').css('background', 'url("img/2cat-eyes-icon.png") center center no-repeat');
			}

			if (otv.message != undefined) {
				error_us(2, otv.message);
			}

			otv = null;
			fav_search_col();
		}
	}, function (error) {
		console.log(error);
		//error_us(1, 'Ошибка чтение данных');
		$$('.favorites .page-content').css('background', 'url("img/error.png") center center no-repeat');
	});

	// Адаптируем дизайн
	function fav_search_col() {
		var boxWidth = $$('div.page-content').width();
		if (boxWidth > 500 && boxWidth < 650) {
			$$('.user').removeClass('col-33');
			$$('.user').addClass('col-25');
		}
		if (boxWidth > 650 && boxWidth < 1100) {
			$$('.user').removeClass('col-33');
			$$('.user').addClass('col-20');
		}
		if (boxWidth > 1100) {
			$$('.user').removeClass('col-33');
			$$('.user').addClass('col-10');
		}
	}


});



function saveImage(url) {
	/*url = "https://pp.userapi.com/c629223/v629223169/3baa0/JuzxEc_A-Zw.jpg";
	url = "https://xxx.ru/api/hidden_photos.get.php?id=39&key=VakRFTsfOFlzA&user_id=39&number=0&key_photo=null&h=https://xxx.ru/api/photos_user/39_1.jpg?h=1504817122";
	url = "https://xxx.ru/api/photos_user/39_1.jpg?h=1504817122";
	*/


	prom2 = new Promise(function (succeed) {
		try {
			var img = document.createElement("img");

			var timestamp = new Date().getTime();
			img.src = url + '?' + timestamp;
			img.setAttribute('crossOrigin', 'anonymous');

			img.onload = function () {

				var key = encodeURIComponent(url),
					canvas = document.createElement("canvas");

				canvas.width = img.width;
				canvas.height = img.height;
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);
				canvas.style.width = "100%";
				//localStorage.setItem("photo", canvas.toDataURL('image/jpeg', 1.0));
				//localStorage.setItem("photo", canvas.toDataURL("image/jpeg"));
				//	console.log(canvas.toDataURL('image/jpeg', 1.0));

				//	return canvas.toDataURL("image/jpeg");
				succeed(canvas.toDataURL("image/jpeg"));

			}
			img.onerror = function () {
				succeed("img/no_photo.png");
			}


		} catch (r) {
			succeed("img/no_photo.png");

		}
	});
	return prom2;
}

function saveImage0(URL) {

	var img = new Image();
	img.src = URL; //js global var

	img.onload = function () {
		alert(img.width);
		var canvas = document.createElement('myCanvas');
		canvas.width = img.width;
		canvas.height = img.height;

		var context = canvas.getContext("2d");
		context.drawImage(img, 0, 0);
		canvas.style.width = "100%";
		var data = canvas.toDataURL("image/png");
		localStorage.setItem("data", data);
	}

}


/* user_win */
myApp.onPageInit('user', function (page) {



    $$('.user .open_popover_user').hide();
	$$('.user .navbar-inner-user-title').hide();
	$$('.user .scroll_user_unfo').css('overflow-y', 'hidden');


	position = false;
	photo_public = 9;


	// Плавающие кнопки

	$$(".user .banUser").on("click", function (e) {
		banUser(user_id);
	});
	$$(".user .addFavorite").on("click", function () {
		addFavorite(user_id);

		var t = $$(".user .addFavorite").find("i");

		if (t.html() == "star") t.html("star_border");
		else {
			if (t.html() == "star_border") t.html("star");
		}
	});
	$$(".user .send_message").on("click", function (e) {
		intent_messages = user_id;
		mainView.router.loadPage('messages.html');
	});

    // 3 точки в statusbar
    
    function complaint_click() {
            alert(1);
        }
    $$('.user .open_popover_user').on('click', function () {
       
        function complaint_click() {
            alert(2);
        }
        
      var clickedLink = this;
      var popoverHTML = '<div class="popover popover-links"><div class="popover-angle"></div><div class="popover-inner"><div class="list-block"><ul><li><a href="#" class="list-button item-link complaint" onclick="">Пожаловаться</a></li></ul></div></div></div>'
      myApp.popover(popoverHTML, clickedLink);
        
        $$('.popover .complaint').on('click', function () {
                myApp.closeModal();

             myApp.modal({
    title:  'Отправить жалобу',
    text: 'Отметьте причину жалобы, мы примем  все возможные средства для устранения нарушений.',
    verticalButtons: true,
    buttons: [
      {
        text: 'Нарушениями правил',
        onClick: function() {
          myApp.alert('Контент с нарушениями правил<br>Мы сделаем все возможное, что бы предотвратить нарушения. Спасибо!', 'Жалоба отправлена!');
        }
      },
      {
        text: 'Оскорбительное поведение',
        onClick: function() {
          myApp.alert('Оскорбительное поведение<br>Мы сделаем все возможное, что бы предотвратить нарушения. Спасибо!', 'Жалоба отправлена!');
        }
      },
      {
        text: 'Спам',
        onClick: function() {
          myApp.alert('Спам<br>Мы сделаем все возможное, что бы предотвратить нарушения. Спасибо!', 'Жалоба отправлена!');
        }
      },
      {
        text: 'Другое',
        onClick: function() {
          myApp.alert('Другое<br>Мы сделаем все возможное, что бы предотвратить нарушения. Спасибо!', 'Жалоба отправлена!');
        }
      },
      {
        text: 'Закрыть / Отмена'
      },
    ]
  })
            
            
            
            
        });
        
       
    
   });
    
   

	// touchstart

	function close_info_user() {
        $$('.user .open_popover_user').hide();

		$$('.user .user-info').css('top', 'calc(100% - 85px)');
		$$('.user .name').css('padding-left', "0");
		$$('.navbar-inner-user-title').hide();
		
		$$('.user .add').css('padding-top', "0");
		$$('.user .scroll_user_unfo').css('overflow-y', 'hidden');

		$$('.user .scroll_user_unfo').scrollTop(0);
        
      setTimeout(function () {
              $$('.user .name').show();
			}, 200);
        
	}


	$$(".user .open_info_user").on("touchstart", function (e) {
		if ($$('.user .user-info').css('top') == '0px') {
            close_info_user();
		} else {
            
            
            
			$$('.user .user-info').css('top', 0);
			$$('.navbar-inner-user-title').show();
			$$('.user .add').css('padding-top', "43px");
			$$('.user .name').hide();

			//setTimeout(function () {
			$$('.user .scroll_user_unfo').scrollTop(0);
			$$('.user .scroll_user_unfo').css('overflow-y', 'auto');

            setTimeout(function () {
				
			 $$('.user .name').css('padding-left', "50px");
                $$('.user .open_popover_user').show();
			}, 200);

			// Если панель открыта, кнопка назад закрывает ее			
			history.pushState(null, null, location.href);
			window.onpopstate = function (event) {
				e.preventDefault();
				return false;
				history.go(1);
			};
			addEventListener("popstate", function (e) {
				close_info_user();
				e.preventDefault();
				return false;
			}, false);



			//}, 10);

		}
	}, false);


    // Тач на навбар -> закрытие информации о пользователе
	$$(".navbar-inner-user-title").on("touchstart", function (e) {
		if ($$('.user .user-info').css('top') == '0px') {
			
            close_info_user();
          
            /*
            $$('.user .user-info').css('top', 'calc(100% - 85px)');
			$$('.user .name').css('padding-left', "0");
			$$('.navbar-inner-user-title').hide();
			$$('.user .name').show();
			$$('.user .add').css('padding-top', "0");
			$$('.user .scroll_user_unfo').scrollTop(0);
            
            */
		}
	}, false);









	/*
	
	
		$$(".user-info").on("click tap", function (e) {


		if ($$('.user .user-info').css('top') == '0px') {

			$$('.user .user-info').css('top', 'calc(100% - 160px)');
			$$('.user .name').css('padding-left', "0");
		} else {

			$$('.user .user-info').css('top', 0);
			$$('.user .name').css('padding-left', "50px");

		}


	});
	
	
	
	$$(".user-info").on("touchstart", function (e) {
		var touchobj = e.changedTouches[0] // первая точка прикосновения
		startx = parseInt(touchobj.clientX) // положение точки касания по x, относительно левого края браузера
		e.preventDefault()
	}, false)

		$$(".user-info").on("touchmove", function (e) {
        var touchobj = e.changedTouches[0] // первая точка прикосновения для данного события
        var dist = parseInt(touchobj.clientX) - startx
       console.log('Событие: touchmove Гориз. перемещение: ' + dist + 'px'+e.preventDefault());
			
				$$('.user .user-info').css("transform", "translate(0," + dist/100*350 + "px)");

    }, false)

	$$(".user-info").on("touchend", function (e) {
		var touchobj = e.changedTouches[0] // первая точка прикосновения для данного события
		console.log('Событие: touchend Координаты точки x: ' + touchobj.clientX + '	px ' + e.preventDefault());
	}, false)


		
		$$(".user-info").on("mouseup", function (e) {
			position = false;
		});


		$$(".user-info").on("mousemove", function (e) {
			if (position) {

				console.log('mousemove ' + e.clientY);

				//if (e.clientY < start_position) {

				console.log('двигай ' + (start_position-e.clientY) +"px");
					
					
					$$('.user .user-info').css('top', e.clientY-start_position+"px");
					
				//}


			}


		});

	*/



	//if (xhr != undefined) xhr_ajax.abort();

	Swiper_user = myApp.swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		direction: 'vertical'
	});


	console.log(page);
	/*
		var value = window.localStorage.getItem("key");
		alert(value);
	*/

	if (user_id == '') {
		var formData = {
			'user_id': my_id
		}
		user_id = my_id;
	} else {
		var formData = {
			'user_id': user_id
		}
	}


	//	ajaxRequest("user.get", formData);

	ajax_api("user.get", formData).then(function (otv) {

		// swiper-bullet-lock

		otv = JSON.parse(otv);
		var verification = '';

		try {
			if (otv.error.code == 1) error_us(1, 'Ошибка авторизации');
			if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
			if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
		} catch (e) {}

		if (otv.success == 1) {

			// Показ имени и возраста
			if (otv.verify == 1) {
				verification = '<i class="material-icons check_circle">check_circle</i>';
			}

			//verification += '<i class="material-icons security">security</i>';

			if (otv.online == 1) otv.online = ' <div class="online_p"></div>';
			else otv.online = '';

			if (otv.age == 0) otv.age = '';
			else otv.age = ', ' + otv.age;
			$$('.user .name').html(otv.name + otv.age + otv.online + verification);
			// Показ города и расстояния
			if (otv.distance != null) distance = otv.distance + " км.";
			else otv.distance = '';

			$$('.user .navbar-inner-user-title').html(otv.name + otv.age);
			$$('.user .add').html(otv.sity + ". " + otv.distance);


			if (otv.sity == null) otv.sity = '';
			if (otv.sity == "")
				if (otv.distance == "") $$('.user .add').html("&nbsp;");

			photo_public = 0;

			for (var i in otv.photo_public) {

				myApp.initImagesLazyLoad(".user");

				//Swiper_user.appendSlide('<div class="swiper-slide lazy" data-background="' + otv.photo_public[i] + '"></div>');
				Swiper_user.appendSlide('<div class="swiper-slide " style=\'background-image: url("' + otv.photo_public[i] + ');\'"></div>');

				//otv.photo_public[i] = null;

				photo_public++;

			}

			if (otv.photo_public == null) {
				Swiper_user.appendSlide('<div class="swiper-slide"><img src="img/fon_login.jpg"></div>');
			}


			photo_public--;


			// Доступ к скрытым фото

			access_hidden_photos = otv.status_hidden_photos;
			if (user_id == my_id) access_hidden_photos = 'access';


			if (access_hidden_photos == 'access') {
				// Доступ открыт

				hidden_photo = [];


				if (otv.photo_public == "null") {
					alert(otv.photo_public);
					temp_photo = otv.photo_public["p1"];
				} else {
					temp_photo = "img/fon_login.jpg";
				}

				for (i = 0; i < otv.hidden_photo; i++) {


					//Swiper_user.appendSlide('<div class="swiper-slide"><img src=""></div>');
					Swiper_user.appendSlide('<div class="swiper-slide lazy" data-background="http://176.57.217.49/api/hidden_photos.get.php?id=' + window.localStorage.getItem("id") + '&key=' + window.localStorage.getItem("key") + '&user_id=' + user_id + '&number=' + i + '&key_photo=' + otv.key_hidden_photos + '&h=' + temp_photo + '"></div>');

					hidden_photo.push('http://176.57.217.49/api/hidden_photos.get.php?id=' + window.localStorage.getItem("id") + '&key=' + window.localStorage.getItem("key") + '&user_id=' + user_id + '&number=' + i + '&key_photo=' + otv.key_hidden_photos + '&h=' + temp_photo + '');

					console.log('http://176.57.217.49/api/hidden_photos.get.php?id=' + window.localStorage.getItem("id") + '&key=' + window.localStorage.getItem("key") + '&user_id=' + user_id + '&number=' + i + '&key_photo=' + otv.key_hidden_photos + '&h=' + temp_photo + '');

				}


				for (i = 1; i < (parseInt(otv.hidden_photo, 10) + 1); i++) {
					$$('.swiper_user_contr span').eq(-i).removeClass('swiper-bullet-lock');
					$$('.swiper_user_contr span').eq(-i).addClass('swiper-bullet-unlock');
				}

				public_photo = [];
				all_photo = [];
				for (var i in otv.photo_public) {
					public_photo.push(otv.photo_public[i]);
				}

				all_photo = public_photo.concat(hidden_photo);


				var myPhotoBrowserDark = myApp.photoBrowser({
					photos: all_photo,
					theme: 'dark',
					ofText: 'из'
				});

			} else {
				// Доступ закрыт
				for (i = 0; i < otv.hidden_photo; i++) {
					$$('.swiper_user_contr').append('<span class="swiper-pagination-bullet swiper-bullet-lock"></span>');
				}

				var myPhotoBrowserDark = myApp.photoBrowser({
					photos: otv.photo_public,
					theme: 'dark',
					ofText: 'из'
				});
			}


			setTimeout(function () {
				myApp.initImagesLazyLoad(".user");
				//	Swiper_user.update(updateTranslate);
			}, 1000);









			/*
			if (otv.message != undefined) {
				error_us(2, otv.message);
			}

*/

			// Инфо о пользователе:
			//{ 1 : "1", "2" : "1", "3" : "1", "4" : "1", "5" : "1", "6": "1", "7" : "1", "8" : "1", "9" : "1", "10" : "1", "11" : "1", "12" : "1", "13" : "1"  }




			try {
				vih_status = otv.vih_status;
				info = JSON.parse(otv.info);



				// Обработка данных




				if (info[3] == 1) info[3] = 'Европейская';
				if (info[3] == 2) info[3] = 'Азиатская';
				if (info[3] == 3) info[3] = 'Кавказская';
				if (info[3] == 4) info[3] = 'Индийская';
				if (info[3] == 5) info[3] = 'Темнокожий';
				if (info[3] == 6) info[3] = 'Испанская';
				if (info[3] == 7) info[3] = 'Ближневосточная ';
				if (info[3] == 8) info[3] = 'Коренной американец';
				if (info[3] == 9) info[3] = 'Смешанная';
				if (info[3] == 10) info[3] = 'Другая';


				if (info[4] == 1) info[4] = 'Худощавое';
				if (info[4] == 2) info[4] = 'Обычное';
				if (info[4] == 3) info[4] = 'Спортивное';
				if (info[4] == 4) info[4] = 'Мускулистое';
				if (info[4] == 5) info[4] = 'Плотное';
				if (info[4] == 6) info[4] = 'Полное';

				if (info[5] == 1) info[5] = 'Блонд';
				if (info[5] == 2) info[5] = 'Шатен';
				if (info[5] == 3) info[5] = 'Рыжий';
				if (info[5] == 4) info[5] = 'Русый';
				if (info[5] == 5) info[5] = 'Брюнет';
				if (info[5] == 6) info[5] = 'Седой';
				if (info[5] == 7) info[5] = 'Экстремальный';

				if (info[6] == 1) info[6] = 'Синий';
				if (info[6] == 2) info[6] = 'Голубой';
				if (info[6] == 3) info[6] = 'Серый';
				if (info[6] == 4) info[6] = 'Зелёный';
				if (info[6] == 5) info[6] = 'Янтарные';
				if (info[6] == 6) info[6] = 'Карий';
				if (info[6] == 7) info[6] = 'Чёрный ';
				if (info[6] == 8) info[6] = 'Жёлтый';
				if (info[6] == 9) info[6] = 'Гетерохромия';

				if (info[7] == 1) info[7] = 'Много';
				if (info[7] == 2) info[7] = 'Имеются';
				if (info[7] == 3) info[7] = 'Мало';
				if (info[7] == 4) info[7] = 'Почти нет';
				if (info[7] == 5) info[7] = 'Нет волос';

				if (info[8] == 1) info[8] = 'Непостоянные заработки';
				if (info[8] == 2) info[8] = 'Постоянный небольшой доход';
				if (info[8] == 3) info[8] = 'Стабильный средний доход';
				if (info[8] == 4) info[8] = 'Хорошо зарабатываю / обеспечен';

				if (info[9] == 1) info[9] = 'Один';
				if (info[9] == 2) info[9] = 'Пара';
				if (info[9] == 3) info[9] = 'Группа';


				if (info[9] == 1) info[9] = 'Один';
				if (info[9] == 2) info[9] = 'Пара';
				if (info[9] == 3) info[9] = 'Группа';

				if (info[10] == 1) info[10] = 'Регулярно';
				if (info[10] == 2) info[10] = 'Бросаю';
				if (info[10] == 3) info[10] = 'Редко';
				if (info[10] == 4) info[10] = 'Не курю';


				if (info[11] == 1) info[11] = 'Люблю выпить';
				if (info[11] == 2) info[11] = 'Не пью вообще';
				if (info[11] == 3) info[11] = 'Употребляю редко';


				if (info[12] == 1) info[12] = 'Есть';
				if (info[12] == 2) info[12] = 'Нет';


				if (info[13] == 1) info[13] = 'Свободен';
				if (info[13] == 2) info[13] = 'Все сложно';
				if (info[13] == 3) info[13] = 'В свободных отношениях';
				if (info[13] == 4) info[13] = 'В отношениях';

				if (vih_status == 1) vih_status = 'Положительный';
				if (vih_status == 2) vih_status = 'Отрицательный';
				if (vih_status == 3) vih_status = 'Я не знаю';

			} catch (err) {


			}

			function isAN(value) {
				if (value instanceof Number)
					value = value.valueOf(); // Если это объект числа, то берём значение, которое и будет числом

				return isFinite(value) && value === parseInt(value, 10);
			}

			// Вставка данных

			if (otv.about != undefined) $$('.user .dop_info_user').append('<div class="about">' + otv.about + '</div>');

			t = '';
			j = 0;
			for (var i in otv.square_photo_public) {
				t = t + '<img src="' + otv.square_photo_public[i] + '" data-id="' + j + '">';
				j++;
			}

			// я тут
			// Добавляем иконку избранных

			//console.log(otv.favorites);

			if (otv.favorites == "true") {
				$$(".user .addFavorite").find("i").html("star");
			} else {
				$$(".user .addFavorite").find("i").html("star_border");
			}


			if (access_hidden_photos == 'access') {
				// Доступ открыт
				h = '';
				for (i = 0; i < otv.hidden_photo; i++) {
					//Swiper_user.appendSlide('<div class="swiper-slide"><img src=""></div>');

					h = h + '<img src="http://176.57.217.49/api/hidden_photos.get.php?id=' + window.localStorage.getItem("id") + '&key=' + window.localStorage.getItem("key") + '&user_id=' + user_id + '&number=' + i + '&key_photo=' + otv.key_hidden_photos + '&square=square&h=' + temp_photo + '" data-id="' + (Number(j) + Number(i)) + '">';

					//$$('.swiper_user_contr').append('<span class="swiper-pagination-bullet swiper-bullet-unlock"></span>');
				}


				$$('.user .dop_info_user').append('<div class="p c1">Фото</div>');
				$$('.user .dop_info_user').append('<div class="photoalbum">' + t + h + '</div>');


			} else {
				// Доступ закрыт
				h = '';
				for (i = 0; i < otv.hidden_photo; i++) {
					h = h + '<div><img src="' + otv.square_photo_public["p1"] + '" class="blur" data-id="hidden_photo"><i class="material-icons">lock_outline</i></div>';
				}

				$$('.user .dop_info_user').append('<div class="p c1">Фото</div>');
				$$('.user .dop_info_user').append('<div class="photoalbum">' + t + h + '</div>');
			}



			$$(".user .photoalbum img").on("click", function (e) {
				if ($$(this).data('id') == "hidden_photo") {
					inquiry_hidden_photo();
				} else myPhotoBrowserDark.open($$(this).data('id'));
			}, false);


			try {


				$$('.user .dop_info_user').append('<div class="p c2">Биологические параметры</div>');


				if (info[1] != undefined && info[1] != 0) info[1] = '<span>Рост:</span> ' + info[1] + ' см ';
				else info[1] = '';
				if (info[2] != undefined && info[2] != 0) info[2] = '<span class="pad">Вес</span> ' + info[2] + ' кг';
				else info[2] = '';
				if (info[1] != undefined && info[1] != undefined && info[1] != 0) $$('.user .dop_info_user').append('<div>' + info[1] + info[2] + '</div>');

				if (info[3] != undefined)
					if (info[3] != 0) $$('.user .dop_info_user').append('<div><span>Внешность:</span> ' + info[3] + '</div>');
				if (info[4] != undefined)
					if (info[4] != 0) $$('.user .dop_info_user').append('<div><span>Телосложение:</span> ' + info[4] + '</div>');
				if (info[5] != undefined)
					if (info[5] != 0) $$('.user .dop_info_user').append('<div><span>Волосы:</span> ' + info[5] + '</div>');
				if (info[6] != undefined)
					if (info[6] != 0) $$('.user .dop_info_user').append('<div><span>Глаза:</span> ' + info[6] + '</div>');
				if (info[7] != undefined)
					if (info[7] != 0) $$('.user .dop_info_user').append('<div><span>Волос на теле:</span> ' + info[7] + '</div>');
				if (info[8] != undefined)
					if (info[8] != 0) $$('.user .dop_info_user').append('<div><span>Деньги:</span> ' + info[8] + '</div>');
				if (info[9] != undefined)
					if (info[9] != 0) $$('.user .dop_info_user').append('<div><span>Знакомлюсь:</span> ' + info[9] + '</div>');
				if (info[10] != undefined)
					if (info[10] != 0) $$('.user .dop_info_user').append('<div><span>Курю:</span> ' + info[10] + '</div>');
				if (info[11] != undefined)
					if (info[11] != 0) $$('.user .dop_info_user').append('<div><span>Алкоголь:</span> ' + info[11] + '</div>');

				if (info[12] != undefined)
					if (info[12] != 0) $$('.user .dop_info_user').append('<div><span>Место для встреч:</span> ' + info[12] + '</div>');
				if (info[13] != undefined)
					if (info[13] != 0) $$('.user .dop_info_user').append('<div><span>Семейное положение:</span> ' + info[13] + '</div>');

				if (vih_status != undefined && vih_status != 0) $$('.user .dop_info_user').append('<div><span>ВИЧ-статус:</span> ' + vih_status + '</div>');


				if (otv.interests != '') {
					$$('.user .dop_info_user').append('<div class="p c3">Интересы</div>');
					$$('.user .dop_info_user').append('<div>' + otv.interests + '</div>');
				}

				if (otv.sexual != '') {
					$$('.user .dop_info_user').append('<div class="p c4">Сексуальные предпочтения</div>');
					$$('.user .dop_info_user').append('<div>' + otv.sexual + '</div>');
				}
				if (otv.goals != '') {
					$$('.user .dop_info_user').append('	<div class="p c5">ЦЕЛИ ЗНАКОМСТВ</div>');
					$$('.user .dop_info_user').append('<div>' + otv.goals + '</div>');
				}

				$$('.user .dop_info_user').append('');
				//$$('.user .dop_info_user').append('<br><br><br><br>');


				$$('.user .dop_info_user').append('<div class="app"><img src="img/logo.png">Flag App любит тебя!</div>');
			} catch (err) {


			}

			user_hidden_photo = otv.hidden_photo;

			otv = null;

			$$(".user .photoalbum").on("touchstart", function (e) {
				myApp.params.swipePanel = false;
			}, false);

			$$(".user .photoalbum").on("touchend", function (e) {
				myApp.params.swipePanel = 'left';
			}, false);



			otv = null;
			vih_status = null;
			all_photo = null;
			public_photo = null;
			hidden_photo = null;
			h = null;
			t = null;
			i = null;
			j = null;

		} else user_er();
	}, function (error) {
		console.log(error);
		//error_us(1, 'Ошибка чтение данных пользователя');


		user_er();


		// 

	});

	function user_er() {
		$$('.user .swiper-container').css('background', 'url("img/error.png") center center no-repeat');
		$$('.user .user-info').css('top', 'calc(100%)');
		$$('.user .speed-dial').hide();
	}



	//$$('.swiper_user_contr').add('span').addClass('swiper-pagination-bullet');


	old = false;
	side_t = 0;
	Swiper_user.on('ReachEnd', function () {
		//console.log('ololo');
		old = true;
	});

	Swiper_user.on('SlideChangeEnd', function (el) {
		//console.log('ololo ++ ' + mySwiper.activeIndex);
		side_t = Swiper_user.activeIndex;
	});

	/*
	mySwiper.on('TouchMoveOpposite ', function (el) {
		if (old) {
			console.log('++ Окно  ++ ' + mySwiper.activeIndex);
		}
	});
*/


	Swiper_user.on('TransitionStart', function (el) {
		myApp.initImagesLazyLoad(".user");

		if (user_hidden_photo != 0)
			if (Swiper_user.activeIndex == photo_public)
				if (side_t == photo_public) {
					//	console.log('Показывать окно  ++ ' + Swiper_user.activeIndex);

					if (access_hidden_photos == 'wait') {
						myApp.modal({
							title: 'Скрытые фото были запрошены!',
							text: 'Просьба предоставить доступ к скрытым фото отправлена! Ожидайте ответа пользователя.',
							buttons: [
								{
									text: 'Закрыть'
							},
						]
						});
					}
					if (access_hidden_photos == 'none') {
						inquiry_hidden_photo();
					}
				}
	});

	function inquiry_hidden_photo() {
		myApp.modal({
			title: 'Запросить скрытые фото?',
			text: 'Вы можете попросить пользователя поделиться с Вами своими скрытыми фото',
			buttons: [
				{
					text: 'Отмена'
							},
				{
					text: 'Запросить',
					onClick: function () {


						myApp.showPreloader('Одно мгновение...');

						var formData = {
							'user_id': user_id
						}

						ajax_api("request.hidden.photo", formData).then(function (otv1) {

							myApp.closeModal();
							otv1 = JSON.parse(otv1);

							try {
								if (otv1.error.code == 1) error_us(1, otv1.error.messages);
								if (otv1.error.code == 5) error_us(1, 'Ошибка сервера');
								if (otv1.error.code == 6) error_us(1, 'Данная версия приложения устарела');
							} catch (e) {}


							if (otv1.status == '1') {
								error_us(1, 'Просьба предоставить доступ к скрытым фото отправлена! Ожидайте ответа пользователя.');
								access_hidden_photos = 'wait';
							}
							if (otv1.status == '2') {
								error_us(1, 'Просьба предоставить доступ к скрытым фото отменена!');
								access_hidden_photos = 'none';
							}


						}, function (error) {
							console.log(error);
							//serror_us(1, 'Ошибка чтение данных');

							myApp.closeModal();
						});



					}
							},
						]
		});
	}


	access_hidden_photos = null;

});








myApp.onPageInit('hit_list', function () {

	if (xhr != undefined) xhr.abort();

	$$('.hit_list .page-content').css('background', 'url("img/popcorn.gif") center center no-repeat');

	var ptrContent = $$('.hit_list .pull-to-refresh-content');
	ptrContent.on('refresh', function (e) {
		page = 0;
		get_data_hit_list(0);
	});

	get_data_hit_list(0);

	function get_data_hit_list(page) {
		var formData = {
			'page': page
		}

		ajax_api("hit_list.get", formData).then(function (otv) {

			otv = JSON.parse(otv);

			try {
				if (otv.error.code == 1) error_us(1, otv.error.messages);
				if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
				if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
			} catch (e) {}

			if (otv.success == 1) {
				$$('.hit_list .page-content').css('background', 'none');


				// Обнулить счетчики
				$$('.response-guests').html("0");
				$$('.response-guests').hide();

				if (page == 0) {
					$$('.hit_list .media-list ul').html("");
				}


				j = 0;
				for (var i in otv.data) {

					if (otv.data[i]["online"] == 1) otv.data[i]["online"] = '<div class="online"></div>';
					else otv.data[i]["online"] = '';

					if (otv.data[i]["photo"] == null) {
						temp_photo = "img/no_photo.png";
					} else {
						temp_photo = otv.data[i]["photo"];
						otv.data[i]["photo"] = null;
					}

					if (otv.data[i]["new"] == 1) otv.data[i]["new"] = '<div class="item-subtitle"><span class="badge bg-green">НОВОЕ</span></div>';
					else otv.data[i]["new"] = '';


					/*
					$$('.hit_list .media-list ul').append('<li class="item-content">\
						<div class="item-media"><img data-src="https://pp.userapi.com/c837229/v837229424/561ac/WCYV8cxdGFM.jpg" width="80" class="lazy load_' + i + '" style="display: none;"></div>\
						<div class="item-inner">\
						  <div class="item-title-row">\
							<div class="item-title">' + otv.data[i]["name"] + ', ' + otv.data[i]["age"] + '</div>\
							<div class="item-after">' + otv.data[i]["date"] + '</div>\
						  </div>\
						  ' + otv.data[i]["new"] + '\
						</div>\
					</li>');
					*/


					$$('.hit_list .media-list ul').append('<li onclick="user_go(' + otv.data[i]["id"] + ');" class="item-content">\
						<div class="item-media"><div data-background="' + temp_photo + '" class="lazy"></div></div>\
						<div class="item-inner">\
						  <div class="item-title-row">\
							<div class="item-title">' + otv.data[i]["name"] + ', ' + otv.data[i]["age"] + '</div>\
							<div class="item-after">' + otv.data[i]["date"] + '</div>\
						  </div>\
						  ' + otv.data[i]["new"] + '\
						</div>\
					</li>');
					j++;


					/*
					$$('.load_' + i).on('load', function (el) {
						$$(this).show();
					});
					$$('.load_' + i).on('error', function (el) {					
						$$(this).attr("src", "img/error.png");
						$$(this).show();
					});
					*/
				}


				loading = false;
				setTimeout(function () {
					myApp.initImagesLazyLoad(".hit_list");
				}, 50);

				if (otv.message != undefined) {
					error_us(2, otv.message);
				}

				otv = null;
				//adaptive_col_hit_list();
				myApp.pullToRefreshDone();
			}
		}, function (error) {
			console.log(error);
			//error_us(1, 'Ошибка чтение данных');

			$$('.hit_list .page-content').css('background', 'url("img/error.png") center center no-repeat');


		});

	}

	// Адаптируем дизайн
	/*
	function adaptive_col_hit_list() {
		var boxWidth = $$('div.page-content').width();
		if (boxWidth > 500 && boxWidth < 650) {
			$$('.user').removeClass('col-33');
			$$('.user').addClass('col-25');
		}
		if (boxWidth > 650 && boxWidth < 1100) {
			$$('.user').removeClass('col-33');
			$$('.user').addClass('col-20');
		}
		if (boxWidth > 1100) {
			$$('.user').removeClass('col-33');
			$$('.user').addClass('col-10');
		}
	}
	*/

	var loading = false;
	page = 0;

	$$('.hit_list .infinite-scroll').on('infinite', function () {
		if (loading) return;
		loading = true;
		page++;

		get_data_hit_list(page);
		console.log("infinite-scroll");
	});

});



myApp.onPageInit('search', function (page) {

	$$('.search .page-content').css('background', 'url("img/popcorn.gif") center center no-repeat');

	var ptrContent = $$('.search .pull-to-refresh-content');
	ptrContent.on('refresh', function (e) {
		get_data_search(0);
	});


	get_data_search(0);



	var popupHTML = '<div class="popup">' +
		'<div class="navbar">' +
		'<div class="navbar-inner">' +
		'<div class="left">' +
		'<a href="#" class="close-popup link">' +
		'<i class="icon icon-back"></i>' +
		'</a>' +
		'</div>' +
		'<div class="center">Редактирование хештегов</div>' +
		'</div>' +
		'</div>' +
		'<div class="content-block">' +
		'<p>Popup created dynamically.</p>' +
		'<p><a href="#" class="close-popup">Close me</a></p>' +
		'</div>' +
		'</div>';
	//	myApp.popup(popupHTML);



	function get_data_search(page) {

		filter = [];
		search_filter = window.localStorage.getItem("search_filter");

		if ((search_filter != '') && (search_filter != null)) {
			search_filter = JSON.parse(search_filter);
			filter[1] = search_filter[1][0];
			filter[2] = search_filter[1][1];
			filter[3] = search_filter[2];
			filter[4] = search_filter[3];
			filter[5] = search_filter[4];
			filter[6] = search_filter[5];
			filter[7] = search_filter[6];
		}


		var formData = {
			'page': page,
			'filter': filter
		}

		ajax_api("search.near", formData).then(function (otv) {

			otv = JSON.parse(otv);

			try {
				if (otv.error.code == 1) error_us(1, otv.error.messages);
				if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
				if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
			} catch (e) {}

			if (otv.success == 1) {


				if (page == 0) {
					$$('.search .user_photo').html("");
				}

				// Показ имени и возраста
				//	$$('.user .name').html(otv.name + ", " + otv.age);

				for (var i in otv.data) {
					//mySwiper.appendSlide('<div class="swiper-slide"><img src="' + otv.photo_public[i] + '"></div>');
					//otv.photo_public[i] = null;

					//console.log(otv.data[i]["id"]);

					if (otv.data[i]["online"] == 1) otv.data[i]["online"] = '<div class="online"></div>';
					else otv.data[i]["online"] = '';

					if (otv.data[i]["photo"] == null) {
						temp_photo = "img/no_photo.png";
					} else {
						temp_photo = otv.data[i]["photo"];
						otv.data[i]["photo"] = null;
					}

					$$('.search .user_photo').append('<div onclick="user_go(' + otv.data[i]["id"] + ');" class="lazy col-33 user" id="elem_col1" data-background="' + temp_photo + '">' + otv.data[i]["online"] + ' <div class="info">' + otv.data[i]["name"] + ', ' + otv.data[i]["age"] + '</div></div>');


				}

				myApp.initImagesLazyLoad(".search");

				if (otv.my_ava != "null") {
					saveImage(otv.my_ava).then(function (res) {
						localStorage.setItem("ava_user", res);
						//$$("#ava_user").attr("src", res);
                        $$('#ava_user').css('background', 'url("'+res+'") center center no-repeat');
                        
                        $$('#ava_user').css('background-size', 'cover');
					});
				}

				$$(".name_user_app").html("<b>" + otv.my_name + "</b>");


				/*
				Обновление счетчиков
				*/

				$$('.response-messages').html(otv.new_messages);
				$$('.response-guests').html(otv.new_hit);
				//	$$('.response-ads').html(otv.response.ads);

				if ($$('.response-messages').html() == '0') $$('.response-messages').hide();
				if ($$('.response-guests').html() == '0') $$('.response-guests').hide();
				//if ($$('.response-ads').html() == '0') $$('.response-ads').hide();



				if (otv.none_location == "true") {
					$$(".none_location").show();
				} else {
					$$(".none_location").hide();
				}



				if (otv.message != undefined) {
					error_us(2, otv.message);
				}



				console.log("(otv.popular_hashtags)");
				console.log((otv.popular_hashtags.interests));


				setTimeout(function () {
					popular_hashtags_interests = JSON.parse(otv.popular_hashtags.interests);

					t1 = '';
					for (var i in popular_hashtags_interests) {
						t1 = t1 + '<a href="#">' + popular_hashtags_interests[i] + '</a> ';
					}

					popular_hashtags_goals = JSON.parse(otv.popular_hashtags.goals);

					t2 = '';
					for (var i in popular_hashtags_goals) {
						t2 = t2 + '<a href="#">' + popular_hashtags_goals[i] + '</a> ';
					}

					popular_hashtags_sexual = JSON.parse(otv.popular_hashtags.sexual);

					t3 = '';
					for (var i in popular_hashtags_sexual) {
						t3 = t3 + '<a href="#">' + popular_hashtags_sexual[i] + '</a> ';
					}


					console.log("otv.popular_hashtags_interests");
					console.log(t1);

					myApp.hidePreloader();
				}, 100);





				//otv = null;
				f_search_col();
				myApp.pullToRefreshDone();

				$$('.search .user').css('height', $$('.search .user').width() + "px");
				$$('.search .page-content').css('background', 'none');

				loading = false;
			}
		}, function (error) {
			console.log(error);
			//error_us(1, 'Ошибка чтение данных');

			myApp.pullToRefreshDone();
			$$('.search .page-content').css('background', 'url("img/error.png") center center no-repeat');
		});
	}


	// Адаптируем дизайн
	function f_search_col() {
		var boxWidth = $$('div.page-content').width();
		if (boxWidth > 500 && boxWidth < 650) {
			$$('.user').removeClass('col-33');
			$$('.user').addClass('col-25');
		}
		if (boxWidth > 650 && boxWidth < 1100) {
			$$('.user').removeClass('col-33');
			$$('.user').addClass('col-20');
		}
		if (boxWidth > 1100) {
			$$('.user').removeClass('col-33');
			$$('.user').addClass('col-10');
		}
	}




	var loading = false;
	page = 0;

	$$('.search .infinite-scroll').on('infinite', function () {
		if (loading) return;
		loading = true;
		page++;

		get_data_search(page);
		console.log("infinite-scroll");
	});






	$$('.open_modal_1').on('click', function () {
		alert();
		myApp.modal({
			title: 'Выберете возраст:',
			text: 'Выберите диапазон возраста парней, которых вы хотите встретить.',
			afterText: '<div class="item-content">' +
				' <div class="item-inner">' +
				' <div class="item-input">' +
				' <div class="range-slider">' +
				'<p class="ot_ran">От:</p>' +
				'   <input type="range" class="open_modal_range_1" multiple min="18" step="1" max="90" value="20">' +
				'<p class="do_ran">До:</p>' +
				'   <input type="range" class="open_modal_range_2" multiple min="18" step="1" max="90" value="60">' +
				' </div>' +
				'</div>' +
				'</div>' +
				' </div>',
			buttons: [
				{
					text: 'Отмена'
		  },
				{
					text: 'Применить',
					bold: true,
					onClick: function () {
						myApp.alert('ага, конечно...', 'Ой, все...');
					}
		  },
		]
		})
		myApp.swiper($$(modal).find('.swiper-container'), {
			pagination: '.swiper-pagination'
		});


		$$('.open_modal_range_1').on('input', function () {
			$$('.ot_ran').html("От: " + $$(this).val());

			if ($$('.open_modal_range_1').val() > $$('.open_modal_range_2').val()) {
				$$('.open_modal_range_2').val(90);
				$$('.do_ran').html("До: 90");
			}
		});


		$$('.open_modal_range_2').on('input', function () {
			$$('.do_ran').html("До: " + $$(this).val());


			if ($$('.open_modal_range_2').val() < $$('.open_modal_range_1').val()) {
				$$('.open_modal_range_1').val(18);
				$$('.ot_ran').html("От: 18");
			}
		});

		$$('.ot_ran').html("От: " + $$('.open_modal_range_1').val());
		$$('.do_ran').html("До: " + $$('.open_modal_range_2').val());


		// $$('.open_modal_range_2').attr('min', $$(this).val());
	});



	$$('.open_modal_2').on('click', function () {

		var modal = myApp.modal({
			title: 'Только онлайн:',
			afterText: '<div class="list-block"> <ul>     <li><div class="item-content">' +
				' <div class="item-inner"><div class="item-title label">Онлайн</div>' +
				' <div class="item-input">' +
				' <label class="label-switch">' +
				'  <input type="checkbox">' +
				' <div class="checkbox"></div>' +
				' </label>' +
				'</div>' +
				'</div>' +
				' </div> </li>  </ul>',
			buttons: [
				{
					text: 'Отмена'
		  },
				{
					text: 'Применить',
					bold: true,
					onClick: function () {
						myApp.alert('ага, конечно...', 'Ой, все...')
					}
		  },
		]
		})
		myApp.swiper($$(modal).find('.swiper-container'), {
			pagination: '.swiper-pagination'
		});
	});


	$$('.open_modal_3').on('click', function () {

		var modal = myApp.modal({
			title: 'Ищу для:',
			afterText: '<div class="list-block margin0_list"> <ul>  <li>' +
				'<label class="label-checkbox item-content">' +
				'<input type="checkbox" name="my-checkbox" value="Books" checked="checked">' +
				'<div class="item-media">' +
				' <i class="icon icon-form-checkbox"></i>' +
				'</div>' +
				'<div class="item-inner">' +
				'<div class="item-title">Дружба и общение</div>' +
				'</div>' +
				'</label>' +
				'</li><li>' +
				' <label class="label-checkbox item-content">' +
				'  <input type="checkbox" name="my-checkbox" value="Movies">' +
				' <div class="item-media">' +
				'  <i class="icon icon-form-checkbox"></i>' +
				'</div>' +
				'<div class="item-inner">' +
				' <div class="item-title">Любовь и отношения</div>' +
				'</div>' +
				'</label>' +
				' </li><li>' +
				'<label class="label-checkbox item-content">' +
				'<input type="checkbox" name="my-checkbox" value="Movies">' +
				'<div class="item-media">' +
				'<i class="icon icon-form-checkbox"></i>' +
				'</div>' +
				'<div class="item-inner">' +
				'<div class="item-title">Занятия спортом</div>' +
				'</div>' +
				'</label>' +
				'</li>  <li>' +
				'<label class="label-checkbox item-content">' +
				'<input type="checkbox" name="my-checkbox" value="Movies">' +
				'<div class="item-media">' +
				'<i class="icon icon-form-checkbox"></i>' +
				'</div>' +
				'<div class="item-inner">' +
				'<div class="item-title">Путешествия</div>' +
				'</div>' +
				'</label>' +
				'</li>   <li>' +
				'<label class="label-checkbox item-content">' +
				'<input type="checkbox" name="my-checkbox" value="Movies">' +
				'<div class="item-media">' +
				'<i class="icon icon-form-checkbox"></i>' +
				'</div>' +
				'<div class="item-inner">' +
				'<div class="item-title">Регулярный секс</div>' +
				'</div>' +
				'</label>' +
				'</li>   <li>' +
				'<label class="label-checkbox item-content">' +
				'<input type="checkbox" name="my-checkbox" value="Movies">' +
				'<div class="item-media">' +
				'<i class="icon icon-form-checkbox"></i>' +
				'</div>' +
				'<div class="item-inner">' +
				'<div class="item-title">Секс на 1-2 раза раза </div>' +
				'</div>' +
				'</label>' +
				'</li>   <li>' +
				'<label class="label-checkbox item-content">' +
				'<input type="checkbox" name="my-checkbox" value="Movies">' +
				'<div class="item-media">' +
				' <i class="icon icon-form-checkbox"></i>' +
				'</div>' +
				'<div class="item-inner">' +
				'<div class="item-title">Экстрим, БДСМ</div>' +
				'</div>' +
				'</label>' +
				'</li>' +
				' <li>' +
				'<label class="label-checkbox item-content">' +
				' <input type="checkbox" name="my-checkbox" value="Movies">' +
				' <div class="item-media">' +
				'<i class="icon icon-form-checkbox"></i>' +
				'</div>' +
				'<div class="item-inner">' +
				'   <div class="item-title">Работа</div>' +
				'  </div>' +
				' </label>' +
				'</li>' +
				'<li>' +
				'<label class="label-checkbox item-content">' +
				'<input type="checkbox" name="my-checkbox" value="Movies">' +
				'<div class="item-media">' +
				' <i class="icon icon-form-checkbox"></i>' +
				'</div>' +
				'<div class="item-inner">' +
				'   <div class="item-title">Жилье</div>' +
				'  </div>' +
				' </label>' +
				'</li></ul></div>',
			buttons: [
				{
					text: 'Отмена'
		  },
				{
					text: 'Применить',
					bold: true,
					onClick: function () {
						myApp.alert('ага, конечно...', 'Ой, все...')
					}
		  },
		]
		})
		myApp.swiper($$(modal).find('.swiper-container'), {
			pagination: '.swiper-pagination'
		});
	});




	$$('.search .open-popup').on('click', function () {
		myApp.popup('.popup-about');


		//arr = '{"1": ["18", "55"],"2":false,"3":"Привет мир!","4":"колбаска","5": [true, false, false, true],"6":"xxx"}';

		arr = window.localStorage.getItem("search_filter");
		if (arr == null) {
			arr = '{"1": ["18", "90"],"2":false,"3":"","4":"","5": [true, true, true, true],"6":""}';
		}


		console.log(arr);


		otv = JSON.parse(arr);

		$$('.class_modal_search_3 .item-after').html(otv[3]);
		$$('.class_modal_search_4 .item-after').html(otv[4]);
		$$('.class_modal_search_6 .item-after').html(otv[6]);

		$$('.class_modal_search_1 .item-after').html(otv[1][0] + ' - ' + otv[1][1]);
		if (otv[2]) {
			$$('.class_modal_search_2 input[name="online_checkbox_modal_search"]').prop('checked', true);
		} else $$('.class_modal_search_2 input[name="online_checkbox_modal_search"]').prop('checked', false);

		for (i = 0; i < 4; i++) {
			if (otv[5][i]) checkbox_search_5["checkbox_search_5_" + (i + 1)] = true;
			else checkbox_search_5["checkbox_search_5_" + (i + 1)] = false;
		}
		up_date_list_modal_search_5();


	});



	$$('.save_filter').on('click', function () {


		/*var date = {
			'1': 5,
			'2': '["18", "55"]',
			'3': 5,
			'4': 5,
			'5': 5
		}

		data = JSON.stringify(date);
*/
		//console.log(date);
		otv = $$('.class_modal_search_1 .item-after').html();

		if ($$('.class_modal_search_2 input[name="online_checkbox_modal_search"]').prop('checked')) {
			onl = true;
		} else onl = false;

		t = '';

		for (i = 1; i < 5; i++) {
			if (checkbox_search_5["checkbox_search_5_" + i]) t = t + 'true';
			else t = t + 'false';
			if (i != 4) t = t + ',';
		}


		arr = '{"1": ["' + otv[0] + otv[1] + '", "' + otv[5] + otv[6] + '"],"2":' + onl + ',"3":"' + $$('.class_modal_search_3 .item-after').html() + '","4":"' + $$('.class_modal_search_4 .item-after').html() + '","5": [' + t + '],"6":"' + $$('.class_modal_search_6 .item-after').html() + '"}';

		//[true, false, false, true]

		window.localStorage.setItem("search_filter", arr);
		myApp.closeModal();
		mainView.router.reloadPage('search.html');

	});

	$$('.cancel_filter').on('click', function () {
		window.localStorage.removeItem("search_filter");
		myApp.closeModal();
		mainView.router.reloadPage('search.html');
	});


	//	alert(otv[2]);





});

// otv[4]

$$('.class_modal_search_4').on('click', function () {
	function class_modal_search_4() {
		return '<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left class_modal_4"><a href="#" class="link">' +
			'<i class="icon icon-back"></i></a>' +
			'</div>' +
			'<div class="center">Редактирование #хештегов секс</div>' +
			'<div class="right class_modal_cl_4"><a href="#" class="link"><i class="material-icons" style="color: #fff;">save</i></a></div></div></div>' +
			'<div class="content-block" style="margin: 0;">' +
			'<div class="content-block-title" style="padding-top: 0; margin: 16px 16px 16px 0;">Сексуальные предпочтения</div><div class="list-block"><ul><li><div class="item-content"><div class="item-inner"><div class="item-input"><textarea maxlength="200" class="hashtags_textarea">' + $$('.class_modal_search_4 .item-after').html() + '</textarea></div></div></div></li></ul> </div><div class="content-block-title" style="padding-top: 0; margin: 16px 16px 16px 0;">Популярные хештеги</div>' +
			'<p class="hashtags" style="overflow-y: scroll;">' + t3 + '</p>' +
			'</div>' +
			'</div>';
	}



	class_modal_search_4 = myApp.popup(class_modal_search_4());

	$$('.hashtags a').on('click', function (e) {
		if ($$('.hashtags_textarea').val().length >= 200) return;
		$$('.hashtags_textarea').val($$('.hashtags_textarea').val() + " " + $$(this).html());
		$$('.hashtags_textarea').scrollTop(999999);
	});

	$$('.hashtags_textarea').css('height', ($$('.edit_user .page-content').height() / 2 - 100) + "px");
	$$('.hashtags').css('height', ($$('.edit_user .page-content').height() / 2 - 120) + "px");
	/*
			$$('.popup  .save_popup_sexual').on('click', function (e) {
				$$('.sexual .item-title').html($$('.hashtags_textarea').val());
				peremen_sexual();
				myApp.closeModal();
			});
	*/
	$$('.class_modal_4').on('click', function (e) {
		myApp.closeModal(class_modal_search_4);
	});
	$$('.class_modal_cl_4').on('click', function (e) {
		$$('.class_modal_search_4 .item-after').html($$('.hashtags_textarea').val());
		myApp.closeModal(class_modal_search_4);
	});

});




$$('.class_modal_search_3').on('click', function () {


	function peremen_sexual_search() {
		return '<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left closeModal_vanya_search"><a href="#" class="link">' +
			'<i class="icon icon-back"></i></a>' +
			'</div>' +
			'<div class="center">Редактирование #хештегов интересы</div>' +
			'<div class="right save_popup_sexual_p3"><a href="#" class="link"><i class="material-icons" style="color: #fff;">save</i></a></div></div></div>' +
			'<div class="content-block" style="margin: 0;">' +
			'<div class="content-block-title" style="padding-top: 0; margin: 16px 16px 16px 0;">Интересы</div><div class="list-block"><ul><li><div class="item-content"><div class="item-inner"><div class="item-input"><textarea maxlength="200" class="hashtags_textarea">' + $$('.class_modal_search_3 .item-after').html() + '</textarea></div></div></div></li></ul> </div><div class="content-block-title" style="padding-top: 0; margin: 16px 16px 16px 0;">Популярные хештеги</div>' +
			'<p class="hashtags" style="overflow-y: scroll;">' + t1 + '</p>' +
			'</div>' +
			'</div>';
	}


	peremen_sexual_search = myApp.popup(peremen_sexual_search());

	$$('.hashtags a').on('click', function (e) {
		if ($$('.hashtags_textarea').val().length >= 200) return;
		$$('.hashtags_textarea').val($$('.hashtags_textarea').val() + " " + $$(this).html());
		$$('.hashtags_textarea').scrollTop(999999);
	});

	$$('.hashtags_textarea').css('height', ($$('.edit_user .page-content').height() / 2 - 100) + "px");
	$$('.hashtags').css('height', ($$('.edit_user .page-content').height() / 2 - 120) + "px");

	$$('.save_popup_sexual_p3').on('click', function (e) {
		$$('.class_modal_search_3 .item-after').html($$('.hashtags_textarea').val());
		myApp.closeModal(peremen_sexual_search);
	});

	$$('.closeModal_vanya_search').on('click', function (e) {
		myApp.closeModal(peremen_sexual_search);
	});

});



$$('.class_modal_search_6').on('click', function () {


	function peremen_search_6() {
		return '<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left closeModal_vanya_search_6"><a href="#" class="link">' +
			'<i class="icon icon-back"></i></a>' +
			'</div>' +
			'<div class="center">Цели знакомств</div>' +
			'<div class="right save_popup_sexual_p6"><a href="#" class="link"><i class="material-icons" style="color: #fff;">save</i></a></div></div></div>' +
			'<div class="content-block" style="margin: 0;">' +
			'<div class="content-block-title" style="padding-top: 0; margin: 16px 16px 16px 0;">Цели знакомств</div><div class="list-block"><ul><li><div class="item-content"><div class="item-inner"><div class="item-input"><textarea maxlength="200" class="hashtags_textarea">' + $$('.class_modal_search_6 .item-after').html() + '</textarea></div></div></div></li></ul> </div><div class="content-block-title" style="padding-top: 0; margin: 16px 16px 16px 0;">Популярные хештеги</div>' +
			'<p class="hashtags" style="overflow-y: scroll;">' + t2 + '</p>' +
			'</div>' +
			'</div>';
	}


	peremen_search_6 = myApp.popup(peremen_search_6());

	$$('.hashtags a').on('click', function (e) {
		if ($$('.hashtags_textarea').val().length >= 200) return;
		$$('.hashtags_textarea').val($$('.hashtags_textarea').val() + " " + $$(this).html());
		$$('.hashtags_textarea').scrollTop(999999);
	});

	$$('.hashtags_textarea').css('height', ($$('.edit_user .page-content').height() / 2 - 100) + "px");
	$$('.hashtags').css('height', ($$('.edit_user .page-content').height() / 2 - 120) + "px");

	$$('.save_popup_sexual_p6').on('click', function (e) {
		$$('.class_modal_search_6 .item-after').html($$('.hashtags_textarea').val());
		myApp.closeModal(peremen_search_6);
	});

	$$('.closeModal_vanya_search_6').on('click', function (e) {
		myApp.closeModal(peremen_search_6);
	});

});

$$('.open_modal_4').on('click', function () {

	var modal = myApp.modal({
		title: 'Роль партнера:',
		afterText: '<div class="list-block margin0_list"> <ul>  <li>' +
			'<label class="label-checkbox item-content">' +
			'<input type="checkbox" name="my-checkbox" value="Books" checked="checked">' +
			'<div class="item-media">' +
			' <i class="icon icon-form-checkbox"></i>' +
			'</div>' +
			'<div class="item-inner">' +
			'<div class="item-title">Актив</div>' +
			'</div>' +
			'</label>' +
			'</li><li>' +
			' <label class="label-checkbox item-content">' +
			'  <input type="checkbox" name="my-checkbox" value="Movies">' +
			' <div class="item-media">' +
			'  <i class="icon icon-form-checkbox"></i>' +
			'</div>' +
			'<div class="item-inner">' +
			' <div class="item-title">Уни-актив</div>' +
			'</div>' +
			'</label>' +
			' </li><li>' +
			'<label class="label-checkbox item-content">' +
			'<input type="checkbox" name="my-checkbox" value="Movies">' +
			'<div class="item-media">' +
			'<i class="icon icon-form-checkbox"></i>' +
			'</div>' +
			'<div class="item-inner">' +
			'<div class="item-title">Универсал</div>' +
			'</div>' +
			'</label>' +
			'</li>  <li>' +
			'<label class="label-checkbox item-content">' +
			'<input type="checkbox" name="my-checkbox" value="Movies">' +
			'<div class="item-media">' +
			'<i class="icon icon-form-checkbox"></i>' +
			'</div>' +
			'<div class="item-inner">' +
			'<div class="item-title">Уни-пассив</div>' +
			'</div>' +
			'</label>' +
			'</li>   <li>' +
			'<label class="label-checkbox item-content">' +
			'<input type="checkbox" name="my-checkbox" value="Movies">' +
			'<div class="item-media">' +
			'<i class="icon icon-form-checkbox"></i>' +
			'</div>' +
			'<div class="item-inner">' +
			'<div class="item-title">Пассив</div>' +
			'</div>' +
			'</label>' +
			'</li></ul></div>',
		buttons: [
			{
				text: 'Отмена'
		  },
			{
				text: 'Применить',
				bold: true,
				onClick: function () {
					myApp.alert('ага, конечно...', 'Ой, все...')
				}
		  },
		]
	})
	myApp.swiper($$(modal).find('.swiper-container'), {
		pagination: '.swiper-pagination'
	});
});




function open_filter_search_1() {
	myApp.modal({
		title: 'Выберете возраст:',
		text: 'Выберите диапазон возраста парней, которых вы хотите встретить.',
		afterText: '<div class="item-content">' +
			' <div class="item-inner">' +
			' <div class="item-input">' +
			' <div class="range-slider">' +
			'<p class="ot_ran">От:</p>' +
			'   <input type="range" class="open_modal_range_1" multiple min="18" step="1" max="90" value="' + $$('.class_modal_search_1 .item-after').html().substring(0, 2) + '">' +
			'<p class="do_ran">До:</p>' +
			'   <input type="range" class="open_modal_range_2" multiple min="18" step="1" max="90" value="' + $$('.class_modal_search_1 .item-after').html().substring(5, 7) + '">' +
			' </div>' +
			'</div>' +
			'</div>' +
			' </div>',
		buttons: [
			{
				text: 'Отмена'
		  },
			{
				text: 'Применить',
				bold: true,
				onClick: function () {


					$$('.class_modal_search_1 .item-after').html($$('.open_modal_range_1').val() + " - " + $$('.open_modal_range_2').val());


				}
		  },
		]
	})




	$$('.open_modal_range_1').on('input', function () {
		$$('.ot_ran').html("От: " + $$(this).val());

		if ($$('.open_modal_range_1').val() > $$('.open_modal_range_2').val()) {
			$$('.open_modal_range_2').val(90);
			$$('.do_ran').html("До: 90");
		}
	});


	$$('.open_modal_range_2').on('input', function () {
		$$('.do_ran').html("До: " + $$(this).val());


		if ($$('.open_modal_range_2').val() < $$('.open_modal_range_1').val()) {
			$$('.open_modal_range_1').val(18);
			$$('.ot_ran').html("От: 18");
		}
	});

	$$('.ot_ran').html("От: " + $$('.open_modal_range_1').val());
	$$('.do_ran').html("До: " + $$('.open_modal_range_2').val());


}


function open_filter_search_5() {

	myApp.modal({
		title: 'Семейное положение:',
		afterText: '<div class="list-block open_filter_search_5"> <ul>  <li>' +
			'<label class="label-checkbox item-content">' +
			'<input type="checkbox" name="checkbox_search_5_1" value="Books">' +
			'<div class="item-media">' +
			' <i class="icon icon-form-checkbox"></i>' +
			'</div>' +
			'<div class="item-inner">' +
			'<div class="item-title">Свободен</div>' +
			'</div>' +
			'</label>' +
			'</li><li>' +
			' <label class="label-checkbox item-content">' +
			'  <input type="checkbox" name="checkbox_search_5_2" value="Movies">' +
			' <div class="item-media">' +
			'  <i class="icon icon-form-checkbox"></i>' +
			'</div>' +
			'<div class="item-inner">' +
			' <div class="item-title">Все сложно</div>' +
			'</div>' +
			'</label>' +
			' </li><li>' +
			'<label class="label-checkbox item-content">' +
			'<input type="checkbox" name="checkbox_search_5_3" value="Movies">' +
			'<div class="item-media">' +
			'<i class="icon icon-form-checkbox"></i>' +
			'</div>' +
			'<div class="item-inner">' +
			'<div class="item-title">В свободных отношениях</div>' +
			'</div>' +
			'</label>' +
			'</li>  <li>' +
			'<label class="label-checkbox item-content">' +
			'<input type="checkbox" name="checkbox_search_5_4" value="Movies">' +
			'<div class="item-media">' +
			'<i class="icon icon-form-checkbox"></i>' +
			'</div>' +
			'<div class="item-inner">' +
			'<div class="item-title">В отношениях</div>' +
			'</div>' +
			'</label>' +
			'</li></ul></div>',
		buttons: [
			{
				text: 'Отмена'
		  },
			{
				text: 'Применить',
				bold: true,
				onClick: function () {



					for (i = 1; i < 5; i++) {
						if ($$('.open_filter_search_5 input[name="checkbox_search_5_' + i + '"]').is(':checked')) {
							checkbox_search_5["checkbox_search_5_" + i] = true;
						} else {
							checkbox_search_5["checkbox_search_5_" + i] = false;
						}
					}
					/*
											if ($$(".open_filter_search_5 input").prop('checked')) {
												checkbox_search_5[$$(this).attr('name')] = true;
											} else {
												checkbox_search_5[$$(this).attr('name')] = false;
											}
											*/

					up_date_list_modal_search_5();


				}
		  },
		]
	});


	for (i = 0; i < 5; i++) {
		if (checkbox_search_5["checkbox_search_5_" + i]) $$('.open_filter_search_5 input[name="checkbox_search_5_' + i + '"]').prop('checked', true);
	}


	/*
	$$('.open_filter_search_5 input').on('change', function () {

		if ($$(this).prop('checked')) {
			checkbox_search_5[$$(this).attr('name')] = true;
		} else {
			checkbox_search_5[$$(this).attr('name')] = false;
		}

		up_date_list_modal_search_5();
	});
*/



	/*
	function up_date_list_modal_search_5() {
		t = 0;

		if (checkbox_search_5["checkbox_search_5_1"]) t++;
		if (checkbox_search_5["checkbox_search_5_2"]) t++;
		if (checkbox_search_5["checkbox_search_5_3"]) t++;
		if (checkbox_search_5["checkbox_search_5_4"]) t++;



		$$('.class_modal_search_5 .item-after').html(t + declOfNum(t, [' пункт', ' пункта', ' пунктов']));


	}	*/

}


function up_date_list_modal_search_5() {
	t = [];


	if (checkbox_search_5["checkbox_search_5_1"]) t.push("Свободен");
	if (checkbox_search_5["checkbox_search_5_2"]) t.push("Все сложно");
	if (checkbox_search_5["checkbox_search_5_3"]) t.push("В свободных отношениях");
	if (checkbox_search_5["checkbox_search_5_4"]) t.push("В отношениях");


	$$('.class_modal_search_5 .item-after').html(t.join(', '));

	if (t.length == 0) $$('.class_modal_search_5 .item-after').html("Не выбрано");

	t = null;

}


function user_go(id) {
	user_id = id;
	mainView.router.loadPage('user.html');
}

function my_profile() {
	user_id = my_id;
	mainView.router.loadPage('user.html');
}


myApp.onPageInit('settings', function (page) {

	$$(".info_app_set").html("alpha V " + version_app);


	$$('.mod-set-1').on('click', function () {

		var modal = myApp.modal({
			title: 'Настройки приватности:',
			afterText: '<div class="modal-text">Вы можете отключить показ расстояния.</div><div class="list-block margin0_list"> <ul>  <li>' +
				'<label class="label-checkbox item-content">' +
				'<input type="checkbox" name="my-checkbox" value="Books" checked="checked">' +
				'<div class="item-media">' +
				' <i class="icon icon-form-checkbox"></i>' +
				'</div>' +
				'<div class="item-inner">' +
				'<div class="item-title">Показывать расстояние</div>' +
				'</div>' +
				'</label>' +
				'</li></ul></div>',
			buttons: [
				{
					text: 'Отмена'
			  },
				{
					text: 'Применить',
					bold: true,
					onClick: function () {
						myApp.alert('ага, конечно...', 'Ой, все...')
					}
			  },
			]
		})
		myApp.swiper($$(modal).find('.swiper-container'), {
			pagination: '.swiper-pagination'
		});
	});



	$$('.settings .online-q').on('click', function () {
		myApp.modal({
			title: 'Перейти на сайт?',
			text: 'Данный контент находится на сайте. Открыть браузер?',
			buttons: [
				{
					text: 'Перейти на сайт',
					bold: true,
					onClick: function () {
						error_us(1, 'Класс online-q не зарегистрирован');
					}
			}, {
					text: 'Закрыть'
			},
		]
		});
	});

});

function vibrate() {

	/* navigator.notification.beep(1);
	        navigator.notification.vibrate(200); //вибрация на 2 секунды
		
			 
			 showConfirm();*/
}

function showConfirm() {

}



myApp.onPageInit('edit_account', function (page) {


	$$('.edit_account .exit').on('click', function () {
		var modal = myApp.modal({
			title: 'Выйти?',
			text: 'Нам очень жаль что Вы хотите покинуть наше приложение!',
			afterText: '<br><a href="#" class="button button-big button-fill button-raised color-red exit_account" onclick="exit_account();">Выйти</a>',
			buttons: [
				{
					text: 'Закрыть'
					},
				]
		});
	});


});


/*

navigator.geolocation.getCurrentPosition(onSuccess, onError);



var onSuccess = function (position) {
	my_latitude = position.coords.latitude;
	my_longitude = position.coords.longitude;

	window.localStorage.getItem("latitude") = my_latitude;
	window.localStorage.getItem("longitude") = my_longitude;

	alert(my_latitude);
	alert(my_longitude);
};



if (my_latitude == 0 || my_longitude == 0) {
	//	myApp.alert('Ваши географические координаты нужны для показа парней поблизости.\n' +		'error: ' + error.code + '\n', 'Ошибка чтение координат');
}

function onError(error) {
	myApp.alert('Ваши координаты нужны для показа парней поблизости.\n' + 'error: ' + error.code + '\n', 'Ошибка чтение координат');
}
*/

// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
/*
    var onSuccess = function(position) {

        myApp.alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading Направление движения, (градусы), отсчитывающихся по часовой стрелке относительно истинного севера: '           + position.coords.heading+ '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n',  'Опа');
            
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
     //   myApp.alert('code: '    + error.code    + '\n' +
       //       'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  */



/*

myApp.onPageInit('camera', function (page) {
	alert(4);





});

*/


myApp.onPageInit('demo', function (page) {

	Swiper_user = myApp.swiper('.swiper_id', {
		direction: 'vertical',
		slideToClickedSlide: true,
		noSwiping: true,
		noswipingClass: 'cont'
	});


});




function exit_account() {
	localStorage.clear();
	//
	db = openDatabase("messages", "0.1", "Table messages.", 200000);
	if (!db) {
		error_us(1, "Ошибка подключения к локальной базе Failed to connect to database.");
	}
	db.transaction(function (tx) {
		tx.executeSql("drop table dialog_list", [], null, null);
		tx.executeSql("drop table messages", [], null, null);
	});

	myApp.closeModal();

	mainView.router.loadPage('login.html');

	var modal = myApp.modal({
		title: 'Всего доброго.',
		text: 'До новых встреч!'
	})

	setTimeout(function () {
		myApp.closeModal();
	}, 2500);

}



myApp.onPageInit('setting_lock', function (page) {
	if (window.localStorage.getItem("lock_enter") != null) {
		$$('.form_set_lock_checkbox').prop('checked', true);
	} else {
		$$('#new_pass_set_lock').addClass('disabled');
	}


	$$('.form_set_lock_checkbox').on('change', function () {
		if ($$('.form_set_lock_checkbox').prop('checked')) {
			$$('#new_pass_set_lock').removeClass('disabled');
		} else {
			$$('#new_pass_set_lock').addClass('disabled');
		}
	});



	$$('.setting_lock .save_setting_lock').on('click', function () {

		if (window.localStorage.getItem("lock_enter") == null) {
			window.localStorage.setItem("lock_enter", $$('#new_pass_set_lock').val());
			myApp.alert('Пароль установлен!', "Готово");
			mainView.router.back();
		} else {
			myApp.modal({
				title: 'Сохранение настроек',
				afterText: '<div class="modal-text">Для сохранения настроек введите текущий пароль входа в приложение.</div><div class="list-block margin0_list"> <ul>  <li>' +
					'<label class="label-checkbox item-content">' +
					'<input type="number" id="pass_setting_lock" placeholder="Пароль">' +
					'</label>' +
					'</li></ul></div>',
				buttons: [
					{
						text: 'Отмена'
			  },
					{
						text: 'Применить',
						bold: true,
						onClick: function () {
							if ($$('#pass_setting_lock').val() == window.localStorage.getItem("lock_enter")) {
								if ($$('.form_set_lock_checkbox').prop('checked')) {
									window.localStorage.setItem("lock_enter", $$('#new_pass_set_lock').val());
									myApp.alert('Пароль изменен!', "Готово");
									mainView.router.back();
								} else {
									localStorage.removeItem("lock_enter")
									myApp.alert('Пароль удален!', "Готово");
									mainView.router.back();
								}
							} else {
								error_us(1, 'Неверный старый пароль');
							}
						}
			  },
			]
			});

		}
	});

});


myApp.onPageInit('lock', function (page) {

	// Разблокировка 
	function unlocking() {
		lock_resume = false;
		mainView.router.back();
		myApp.params.swipePanel = 'left';
		myApp.params.pushState = true;
	}


	$$(".lock .en_pass").click();
	//$$(".lock .en_pass").focus();


	$$('.lock .form-to-data').on('click', function () {
		var formData = myApp.formToJSON('#form_lock');
		//formData = JSON.stringify(formData);

		if (formData.pass == window.localStorage.getItem("lock_enter")) {
			unlocking();
		} else {
			$$('.lock #form_lock input[name="pass"]').val("");
		}


	});


	$$('.lock .exit').on('click', function () {
		var modal = myApp.modal({
			title: 'Выйти?',
			text: 'После выхода вы можете вновь авторизоваться, введя логин и пароль. Текущий пароль входа будет сброшен.',
			afterText: '<br><a href="#" class="button button-big button-fill button-raised color-red exit_account" onclick="exit_account();">Выйти</a>',
			buttons: [
				{
					text: 'Закрыть'
					},
				]
		});
	});


});



document.addEventListener("resume", onResume, false);

function onResume() {
	// Handle the resume event

	if (window.localStorage.getItem("lock_enter") != null) {
		lock_resume = true;
		myApp.closePanel();
		mainView.router.loadPage('lock.html');
		myApp.params.swipePanel = false;

		addEventListener("popstate", function (e) {
			if (lock_resume) {
				$$('body').detach();
				navigator.app.exitApp();
			}
		}, false);
	}
}


function banUser(id) {
	myApp.modal({
		title: 'Вы серьезно?',
		text: 'Заблокировать пользователя?',
		buttons: [
			{
				text: 'Заблокировать',
				onClick: function () {
					banUserAjax(id);
				}
			}, {
				text: 'Отмена',
				bold: true
			},
		]
	})

}

function banUserAjax(id, vi) {
	var formData = {
		'user_id': id
	}
	ajax_api("account.banUser", formData).then(function (otv) {
		otv = JSON.parse(otv);

		try {
			if (otv.error.code == 1) error_us(1, otv.error.messages);
			if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
			if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
		} catch (e) {}


		if (otv.status == '1') {
			error_us(1, 'Пользователь добавлен в черный список');
		}
		if (otv.status == '2') {
			error_us(1, 'Пользователь удален из черного списка');
		}

		if (otv.status == '2' && vi) {
			myApp.swipeoutDelete($$('.black_list .c' + id), function () {});
		}

		otv = null;
		delete otv;

	}, function (error) {
		console.log(error);
	});



}


function unbanUser() {

}

function addFavorite(id) {
	var formData = {
		'user_id': id
	}
	ajax_api("user.set.favorite", formData).then(function (otv) {
		otv = JSON.parse(otv);

		try {
			if (otv.error.code == 1) error_us(1, otv.error.messages);
			if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
			if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
		} catch (e) {}


		if (otv.status == '1') {
			error_us(1, 'Пользователь добавлен в избранное');
		}
		if (otv.status == '2') {
			error_us(1, 'Пользователь удален из избранных');
		}

		otv = null;
		delete otv;

	}, function (error) {
		console.log(error);
	});
}



function loadjscssfile(filename, filetype) {
	if (filetype == "js") {
		var fileref = document.createElement("script");
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", filename)
	} else {
		if (filetype == "css") {
			var fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename)
		}
	}
	if (typeof fileref != "undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref)
	}
};



setTimeout(function () {

	loadjscssfile("js/camera.js", "js");

}, 5000);






myApp.onPageInit('black_list', function (page) {

	$$('.black_list .page-content').css('background', 'url("img/popcorn.gif") center center no-repeat');
	//get_data_hit_list
	get_data_black_list();

	function get_data_black_list(page) {
		var formData = {
			'page': page
		}

		ajax_api("black_list.get", formData).then(function (otv) {

			otv = JSON.parse(otv);

			try {
				if (otv.error.code == 1) error_us(1, otv.error.messages);
				if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
				if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
			} catch (e) {}

			if (otv.success == 1) {
				$$('.black_list .page-content').css('background', 'none');


				if (page == 0) {
					$$('.black_list .media-list ul').html("");
				}


				j = 0;
				for (var i in otv.data) {

					if (otv.data[i]["online"] == 1) otv.data[i]["online"] = '<div class="online"></div>';
					else otv.data[i]["online"] = '';

					if (otv.data[i]["photo"] == null) {
						temp_photo = "img/no_photo.png";
					} else {
						temp_photo = otv.data[i]["photo"];
						otv.data[i]["photo"] = null;
					}

					if (otv.data[i]["new"] == 1) otv.data[i]["new"] = '<div class="item-subtitle"><span class="badge bg-green">НОВОЕ</span></div>';
					else otv.data[i]["new"] = '';



					// onclick="user_go(' + otv.data[i]["id"] + ');"
					// <div class="item-media"><div data-background="' + temp_photo + '" class="lazy"></div></div>\
					$$('.black_list .list_bl ul').append('\
						<li class="swipeout c' + otv.data[i]["id"] + '" data-id="' + otv.data[i]["id"] + '">\
						  <div class="swipeout-content item-content">\
							<div class="item-media"><img src="' + temp_photo + '"></div>\
							<div class="item-inner">\
						<div class="item-title-row">\
									<div class="item-title">' + otv.data[i]["name"] + ', ' + otv.data[i]["age"] + '</div>\
									<div class="item-after">Попал сюда ' + timeConverter(otv.data[i]["date"], true) + ' в ' + timeConverter(otv.data[i]["date"]) + '</div>\
								  </div> </div>\
							 </div>\
							<div class="swipeout-actions-right">\
							<a href="#" class="action1" data-id="' + otv.data[i]["id"] + '">Удалить</a>\
						  </div>\
						</li>');
					j++;

				}

				if (i == undefined) {
					$$('.black_list .page-content').css('background', 'url("img/cat-eyes-icon.png") center center no-repeat');
				}


				loading = false;
				setTimeout(function () {
					myApp.initImagesLazyLoad(".black_list");
				}, 50);

				if (otv.message != undefined) {
					error_us(2, otv.message);
				}

				otv = null;
				//adaptive_col_hit_list();
				myApp.pullToRefreshDone();
			}
		}, function (error) {
			console.log(error);
			$$('.black_list .page-content').css('background', 'url("img/error.png") center center no-repeat');

		});

	}

	$$(".black_list").on("click", ".action1", function (e) {


		console.log("+++");
		console.log($$(this).data('id'));

		banUserAjax($$(this).data('id'), true);

		//$$('swipeout ').data('id');

	});


});




myApp.onPageInit('setting_private_photos', function (page) {

	$$('.setting_private_photos .page-content').css('background', 'url("img/popcorn.gif") center center no-repeat');
	get_data_setting_private_photos();

	function get_data_setting_private_photos(page) {
		var formData = {
			'page': page
		}

		ajax_api("access_hidden_photos.get", formData).then(function (otv) {

			otv = JSON.parse(otv);

			try {
				if (otv.error.code == 1) error_us(1, otv.error.messages);
				if (otv.error.code == 5) error_us(1, 'Ошибка сервера');
				if (otv.error.code == 6) error_us(1, 'Данная версия приложения устарела');
			} catch (e) {}

			if (otv.success == 1) {
				$$('.setting_private_photos .page-content').css('background', 'none');


				if (page == 0) {
					$$('.setting_private_photos .media-list ul').html("");
				}


				j = 0;
				for (var i in otv.data) {

					if (otv.data[i]["online"] == 1) otv.data[i]["online"] = '<div class="online"></div>';
					else otv.data[i]["online"] = '';

					if (otv.data[i]["photo"] == null) {
						temp_photo = "img/no_photo.png";
					} else {
						temp_photo = otv.data[i]["photo"];
						otv.data[i]["photo"] = null;
					}

					if (otv.data[i]["new"] == 1) otv.data[i]["new"] = '<div class="item-subtitle"><span class="badge bg-green">НОВОЕ</span></div>';
					else otv.data[i]["new"] = '';

					$$('.setting_private_photos .list_bl ul').append('\
						<li class="swipeout c' + otv.data[i]["id"] + '" data-id="' + otv.data[i]["id"] + '">\
						  <div class="swipeout-content item-content">\
							<div class="item-media"><img src="' + temp_photo + '"></div>\
							<div class="item-inner">\
						<div class="item-title-row">\
									<div class="item-title">' + otv.data[i]["name"] + ', ' + otv.data[i]["age"] + '</div>\
									<div class="item-after">Открыт доступ: ' + timeConverter(otv.data[i]["date"], true) + ' в ' + timeConverter(otv.data[i]["date"]) + '</div>\
								  </div> </div>\
							 </div>\
							<div class="swipeout-actions-right">\
							<a href="#" class="action1" data-id="' + otv.data[i]["id"] + '">Удалить</a>\
						  </div>\
						</li>');
					j++;

				}

				if (i == undefined) {
					$$('.setting_private_photos .page-content').css('background', 'url("img/cat-eyes-icon.png") center center no-repeat');
				}


				loading = false;
				setTimeout(function () {
					myApp.initImagesLazyLoad(".setting_private_photos");
				}, 50);

				if (otv.message != undefined) {
					error_us(2, otv.message);
				}

				otv = null;
				//adaptive_col_hit_list();
				myApp.pullToRefreshDone();
			}
		}, function (error) {
			console.log(error);
			$$('.setting_private_photos .page-content').css('background', 'url("img/error.png") center center no-repeat');

		});

	}

	$$(".setting_private_photos").on("click", ".action1", function (e) {


		banUserAjax($$(this).data('id'), true);

	});


});



function getBase64FromImageUrl(URL) {
	var img = new Image();
	img.src = URL;

	img.setAttribute('crossOrigin', 'anonymous');
	img.onload = function () {

		alert(URL);
		console.log(URL);


		var canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(this, 0, 0);

		var dataURL = canvas.toDataURL("image/jpg");

		alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));

	};
}
