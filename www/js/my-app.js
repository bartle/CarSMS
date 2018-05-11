var myApp = new Framework7({
	pushState: true,
	swipePanel: 'left',
	material: true
});
var mainView = myApp.addView('.view-main');

var $$ = Dom7;



function getAndroidVersion(ua) {
	ua = (ua || navigator.userAgent).toLowerCase();
	var match = ua.match(/android\s([0-9\.]*)/);
	return match ? match[1] : false;
};

function noti(text, sec) {
	if (sec == undefined) sec = 5000;
	myApp.addNotification({
		message: text,
		button: {
			text: 'Закрыть'
		},
		hold: sec
	});
}

$$(window).on('load', function () {


	/*
    if (parseFloat(getAndroidVersion()) < 5 || getAndroidVersion() == false) {
        myApp.alert('Версия вашей ОС не соответствует требованиям приложения. Обновите версию Android или используйте другое устройство.', 'Ошибка совместимости!');

        alert("Ошибка совместимости!\nВерсия вашей ОС не соответствует требованиям приложения. Обновите версию Android или используйте другое устройство.");

        navigator.app.exitApp();
    } else {
        setTimeout(function () {
            mainView.router.reloadPage('slider.html');
        }, 2500);
    }
**/

	setTimeout(function () {
		mainView.router.reloadPage('car.html');
	}, 3000);


	$$('.view').addClass('theme-orange');

});


myApp.onPageInit('slider', function (page) {
	var mySwiper = new Swiper('.swiper-container', {
		preloadImages: false,
		lazyLoading: true,
		pagination: '.swiper-pagination'
	});

	setTimeout(function () {
		mySwiper.params.autoplay = 3000;
		mySwiper.startAutoplay();
	}, 5000);
	var oAudio = document.getElementById('myaudio');


	mus = window.localStorage.getItem("mus");





	$$('input[name="radio_mus"]').on('click', function (e) {

		if ($$(this).val() == "1") {
			oAudio.src = 'mp3/1.mp3'
			var playPromise = oAudio.play();

			if (playPromise !== undefined) {
				playPromise.then(_ => {
						// Automatic playback started!
						// Show playing UI.
					})
					.catch(error => {
						// Auto-play was prevented
						// Show paused UI.
					});
			}

			window.localStorage.setItem("mus", '1');
		}
		if ($$(this).val() == "2") {
			oAudio.src = 'mp3/2.mp3'


			var playPromise = oAudio.play();

			if (playPromise !== undefined) {
				playPromise.then(_ => {
						// Automatic playback started!
						// Show playing UI.
					})
					.catch(error => {
						// Auto-play was prevented
						// Show paused UI.
					});
			}


			window.localStorage.setItem("mus", '2');
		}
		if ($$(this).val() == "none") {

			oAudio.pause();
			window.localStorage.setItem("mus", 'none');
		}

	});



	$$('.ppp').on('click', function (e) {
		myApp.alert('На пороге Новый год.<br>\
        Пусть тебе он принесет<br>\
        Много ярких впечатлений,<br>\
        Новых бурных ощущений.<br><br>\
        \
        Исполнения желаний<br>\
        И удачных начинаний!<br>\
        Верь в себя и в свои силы.<br>\
        Вадя, просто будь счастливым.', 'Вадя, с Новым Годом!');
	});



	if (mus == null) {
		mus = 1;
	}

	if (mus == 1) {
		oAudio.src = 'mp3/1.mp3';
		$$('input[name="radio_mus"]').eq(0).attr("checked", true);
		var playPromise = oAudio.play();

		if (playPromise !== undefined) {
			playPromise.then(_ => {
					// Automatic playback started!
					// Show playing UI.
				})
				.catch(error => {
					// Auto-play was prevented
					// Show paused UI.
				});
		}
	}
	if (mus == 2) {
		oAudio.src = 'mp3/2.mp3';
		$$('input[name="radio_mus"]').eq(1).attr("checked", true);
		var playPromise = oAudio.play();

		if (playPromise !== undefined) {
			playPromise.then(_ => {
					// Automatic playback started!
					// Show playing UI.
				})
				.catch(error => {
					// Auto-play was prevented
					// Show paused UI.
				});
		}
	}
	if (mus == 'none') {
		$$('input[name="radio_mus"]').eq(2).attr("checked", true);

	}



});

myApp.onPageInit('set', function (page) {
	$$('.save').on('click', function () {


		var formData = myApp.formToJSON('#set-form');

		console.log(formData);

		window.localStorage.setItem("n1", formData.n1);
		window.localStorage.setItem("n2", formData.n2);
		window.localStorage.setItem("n3", formData.n3);
		window.localStorage.setItem("time", formData.time);
		noti('Настройки сохранены!');
		mainView.router.reloadPage('car.html');

	});


});

myApp.onPageInit('car', function (page) {
	$$('.click_go').on('click', function () {
		go();
	});


});

var timeFormat = (function () {
	function num(val) {
		val = Math.floor(val);
		return val < 10 ? '0' + val : val;
	}

	return function (ms /**number*/ ) {
		var sec = ms / 1000,
			hours = sec / 3600 % 24,
			minutes = sec / 60 % 60,
			seconds = sec % 60;

		return num(hours) + ":" + num(minutes) + ":" + num(seconds);
	};
})();

function startTimer(val) {

	go_time--;


	console.log(go_time);
	$$('.sms_status').html("Отправка СМС через: " + timeFormat(go_time * 1000));

	if (go_time == 0) {
		send_sms();

	}
	//setTimeout(startTimer, 1000);

}

function go() {

	if ($$('.play').html() == "play_arrow") {

		go_time = window.localStorage.getItem("time") * 60;

		$$('.go_status').html("Мы едем!");
		$$('.play').html("stop");

		startTimer();
		/*
				intervalID = setInterval(function () {
					send_sms()
				}, (window.localStorage.getItem("time") * 1000 * 60));
		*/

		interval_timer = setInterval(function () {
			startTimer();
		}, 1000);


	} else {
		//clearInterval(intervalID);
		clearInterval(interval_timer);

		$$('.go_status').html("Мы стоим.");
		$$('.play').html("play_arrow");
		$$('.sms_status').html("SMS не отправляются!");

	}

}

function send_sms() {
	console.log("Отправка СМС");
	go_time = window.localStorage.getItem("time") * 60;

	var number = window.localStorage.getItem("n1").toString(); /* iOS: ensure number is actually a string */
	var message = "Текст";
	console.log("number=" + number + ", message= " + message);



	//CONFIGURATION
	var options = {
		replaceLineBreaks: false, // true to replace \n by a new line, false by default
		android: {
			intent: 'INTENT' // send SMS with the native android SMS messaging
			//intent: '' // send SMS without open any other app
		}
	};

	var success = function () {
		alert('Message sent successfully');
	};
	var error = function (e) {
		alert('Message Failed:' + e);
	};

	sms.send(number, message, options, success, error);
}
