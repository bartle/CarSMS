var pictureSource; // picture source
var destinationType; // sets the format of returned value 

// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready to be used!
//


function onDeviceReady() {
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
}



// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
	// Uncomment to view the base64 encoded image data
	// console.log(imageData);

	// Get image handle
	//
	var smallImage = document.getElementById('smallImage');

	// Unhide image elements
	//
	//  smallImage.style.display = 'block';

	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	// smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
	//var largeImage = document.getElementById('largeImage');



	myApp.showPreloader('Одно мгновение...');
	photo_user = imageURI;

	setTimeout(function () {
		mainView.router.loadPage('crop_img.html');
	}, 3000);
}

// A button will call this function
//
function capturePhoto() {
	// Take picture using device camera and retrieve image as base64-encoded string
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
		quality: 100,
		destinationType: destinationType.DATA_URL
	});
}

// A button will call this function
//
function capturePhotoEdit() {
	alert();
	// Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
		quality: 50,
		targetWidth: 375,
		targetHeight: 667,
		allowEdit: true,
		destinationType: destinationType.DATA_URL
	});
}

// A button will call this function
//
function getPhoto(source) {
	// Retrieve image file location from specified source
	navigator.camera.getPicture(onPhotoURISuccess, onFail, {
		quality: 100,
		destinationType: destinationType.FILE_URI,
		sourceType: source
	});
}

// Called if something bad happens.
// 
function onFail(message) {
	alert('Failed because: ' + message);
}



var load_photo = [];
var load_photo300 = [];

var load_hidden_photo = [];
var load_hidden_photo300 = [];

var hidden_type_photo;

function add_photo_user(source, hidden) {
	navigator.camera.getPicture(onPhotoURISuccess_user, onFail, {
		quality: 100,
		destinationType: destinationType.FILE_URI,
		sourceType: source
	});
	if (hidden) {
		hidden_type_photo = true;
	} else {
		hidden_type_photo = false;
	}
}



function onPhotoURISuccess_user(imageURI) {
	// Показ определенного навбара

	$$('.edit_photo .nav_trav').hide();
	$$('.edit_photo .nav_save_photo').show();

	imageURI300 = imageURI;

	myApp.hidePreloader();
	myApp.closeModal();
	myApp.params.swipePanel = false;


	$$('.edit_photo #demo-basic').show();


	var el = document.getElementById('demo-basic');
	$$('.edit_photo #demo-basic').show();
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

	vanilla.bind({
		url: imageURI,
		//url: 'croppie/demo/demo-2.jpg',
		ShowZoomer: false
	});



	setTimeout(function () {
		$$('.edit_photo .save_crop_img').on('click', function () {
			//myApp.showPreloader('Одно мгновение...');

			vanilla.result('base64').then(function (base64) {
				// переменная = base64

				onPhotoURISuccess_user_300();

				if (hidden_type_photo) {
					load_hidden_photo[load_photo.length] = base64;
				} else {
					load_photo[load_photo.length] = base64;
				}

			});


			delete vanilla;
			vanilla = null;
			imageURI = null;
			base64 = null;
			$$("#demo-basic div").remove();


		});
	}, 300);


}

function onPhotoURISuccess_user_300() {
	// Показ определенного навбара


	$$('.edit_photo .nav_save_photo').hide();
	$$('.edit_photo .nav_save_photo300').show();

	$$('.edit_photo #demo-basic').hide();
	$$('.edit_photo #demo-square_photo').show();

	myApp.hidePreloader();
	myApp.closeModal();

	setTimeout(function () {
		myApp.hidePreloader();
		myApp.closeModal();
	}, 500);

	myApp.params.swipePanel = false;

	var el = document.getElementById('demo-square_photo');

	vanilla_bla = new Croppie(el, {
		viewport: {
			width: screen.width,
			width: 300,
			height: 300
		},
		showZoomer: false,
		//boundary: { width: 375, height: 667 },
	});

	myApp.addNotification({
		message: "Обрежте фото, как оно будет выглядить на экраню Можно использовать свайп приближения",
		button: {},
		hold: 3000
	});

	vanilla_bla.bind({
		url: imageURI300,
		//url: 'croppie/demo/demo-1.jpg',
		ShowZoomer: false
	});

	setTimeout(function () {
		$$('.edit_photo .save_crop_img300').on('click', function () {

			vanilla_bla.result('base64').then(function (base64) {
				/*
				mySwiper_edit_photo.prependSlide('<div class="swiper-slide open-popover" data-popover=".popover-photo"><img src="' + base64 + '"></div>');
				mySwiper_edit_photo.prependSlide('<div class="swiper-slide add-photo"><span><img src="img/add_photo.png"></span></div>');
				vanilla_bla.update(updateTranslate);	
				*/

				if (hidden_type_photo) {
					load_hidden_photo300[load_hidden_photo300.length] = base64;
					h_edit_photo_update();

				} else {
					load_photo300[load_photo300.length] = base64;
					p_edit_photo_update();
				}


				vanilla_bla.update(updateTranslate);

			});

			$$('.edit_photo .nav_save_photo300').hide();
			$$('.edit_photo .nav_trav').show();
			$$('.edit_photo #demo-square_photo').hide();
			$$('.edit_photo .page-content').show();


			delete vanilla_bla;
			vanilla_bla = null;
			imageURI300 = null;
			base64 = null;
			$$("#demo-square_photo div").remove();
		});


	}, 300);


}

function delete_photo_user_load(hidden, number) {
	myApp.closeModal();

	if (hidden) {
		mySwiper_edit_hidden_photo.removeAllSlides();

		load_hidden_photo300.splice(number, 1);
		load_hidden_photo.splice(number, 1);

		h_edit_photo_update();

	} else {
		mySwiper_edit_photo.removeAllSlides();
		load_photo300.splice(number, 1);
		load_photo.splice(number, 1);

		p_edit_photo_update();
	}

}

function edit_status_photo_user_load(hidden, number) {
	myApp.closeModal();

	if (hidden) {
		// из скрытых в открытые
		load_photo[load_photo.length] = load_hidden_photo[number];
		load_photo300[load_photo300.length] = load_hidden_photo300[number];

		load_hidden_photo.splice(number, 1);
		load_hidden_photo300.splice(number, 1);
	} else {
		// из открытых в скрытые		
		load_hidden_photo[load_hidden_photo.length] = load_photo[number];
		load_hidden_photo300[load_hidden_photo300.length] = load_photo300[number];

		load_photo.splice(number, 1);
		load_photo300.splice(number, 1);
	}



	h_edit_photo_update();
	p_edit_photo_update();
}


function move_photo_user_load(hidden, number, direction) {
	if (direction == ">") t = -1;
	if (direction == "<") t = 1;

	myApp.closeModal();
	//andrei64 

	if (direction == ">")
		if (number == 0) return 0;
	if (hidden) {
		if (load_hidden_photo[(number + t)] == undefined) return 0;


		var_t1 = load_hidden_photo[(number + t)];
		var_t2 = load_hidden_photo300[(number + t)];

		load_hidden_photo[(number + t)] = load_hidden_photo[number];
		load_hidden_photo300[(number + t)] = load_hidden_photo300[number];

		load_hidden_photo[number] = var_t1;
		load_hidden_photo300[number] = var_t2;

		var_t1 = null;
		var_t2 = null;


		h_edit_photo_update();
	} else {

		if (load_photo[(number + t)] == undefined) return 0;

		var_t1 = load_photo[(number + t)];
		var_t2 = load_photo300[(number + t)];

		load_photo[(number + t)] = load_photo[number];
		load_photo300[(number + t)] = load_photo300[number];

		load_photo[number] = var_t1;
		load_photo300[number] = var_t2;

		var_t1 = null;
		var_t2 = null;



		p_edit_photo_update();

	}
}


function p_edit_photo_update() {

	mySwiper_edit_photo.removeAllSlides();

	for (i = 0; i < load_photo300.length; i++) {
		mySwiper_edit_photo.appendSlide('<div class="swiper-slide photo_app"><span onclick="popover_photo(false, ' + i + ');"><img src="' + load_photo300[i] + '"></div>');
	}
	if (i < 10) {
		mySwiper_edit_photo.appendSlide('<div class="swiper-slide add-photo"><span onclick="edit_photo_add_photo(false);"><img src="img/add_photo.png"></span></div>');
	}

}

function h_edit_photo_update() {
	mySwiper_edit_hidden_photo.removeAllSlides();

	for (i = 0; i < load_hidden_photo300.length; i++) {
		mySwiper_edit_hidden_photo.appendSlide('<div class="swiper-slide photo_app"><span onclick="popover_photo(true, ' + i + ');"><img src="' + load_hidden_photo300[i] + '"></span></div>');
	}

	if (i < 10) {
		mySwiper_edit_hidden_photo.appendSlide('<div class="swiper-slide add-photo"><span onclick="edit_photo_add_photo(true);"><img src="img/add_photo.png"></span></div>');
	}

}




function load_photo_server() {


	
	
	var formData = {
		'photo': makeid(9999),
		'square_photo': load_photo300,
		'hidden_photo': load_hidden_photo,
		'hidden_square_photo': load_hidden_photo300
	}

	method = "photos.saveOwnerPhoto";
	console.log("+");
	



	var xhr = $$.ajax({
		url: "http://176.57.217.49/api/index.php?method=" + method,
		method: "POST",
		contentType: false,
		crossDomain: true,
		data: "data=" + formData,
		xhrFields: function (response) {
			alert(response);
			var xhr = new window.XMLHttpRequest();
			xhr.upload.addEventListener('progress', function (evt) { // добавляем обработчик события progress (onprogress)
				if (evt.lengthComputable) { // если известно количество байт
					// высчитываем процент загруженного
					var percentComplete = Math.ceil(evt.loaded / evt.total * 100);
					// устанавливаем значение в атрибут value тега <progress>
					// и это же значение альтернативным текстом для браузеров, не поддерживающих <progress>
					console.log(percentComplete);
				}
			}, false);

		},
		error: function (response) {
			real_ajax_send = false;
			myApp.hideProgressbar();


			if (response["status"] == 0) t = 'Ошибка подключения';
			else
			if (response["status"] == 404) t = 'Сервер не найден';
			else
			if (response["status"] == 500) t = 'error ' + response["status"] + ': ' + response["statusText"];
			else
				t = 'error ' + response["status"] + ': ' + response["statusText"];

		},
		success: function (json) {
			// После того, как изображение полностью получено
			// подставляем его URL и выводим на экран
			if (json) {
				//$('#output').html('<img src="' + bigImg + '">');


				// ответ
			}
		}
	});

	xhr.upload.addEventListener('onprogress', function (evt) {

		console.log("progress");

		//if (evt.lengthComputable) { // если известно количество байт
		// высчитываем процент загруженного

		var percentComplete = Math.ceil(evt.loaded / evt.total * 100);

		var progressbar = $$('.edit_photo .progressbar');
		myApp.setProgressbar(progressbar, percentComplete);
		console.log(percentComplete);

		//}
	}, false);


	xhr.upload.onprogress = function (event) {
		alert('Загружено на сервер ' + event.loaded + ' байт из ' + event.total);
	}

	xhr.onprogress = function (event) {
		alert('Получено с сервера ' + event.loaded + ' байт из ' + event.total);
	}

}




// Отправка всех фото на сервер.
function doAjax2(data) {  
	
	var progressBar = document.getElementById("progress"),
		xhr = new XMLHttpRequest();
	xhr.open("POST", "http://176.57.217.49/api/onload.php", true);
	xhr.upload.onprogress = function (e) {
		if (e.lengthComputable) {
			//progressBar.max = e.total;
			//progressBar.value = e.loaded;

			var ratio = Math.floor((e.loaded / e.total) * 100);


			myApp.setProgressbar(progressbar, ratio);
			console.log(e.total);
			console.log(ratio);

			$$('.edit_photo_pr_load').html(ratio + "%");
		}
	}
	xhr.upload.onloadstart = function (e) {
		progressbar.removeClass('progressbar-infinite');
		progressbar.addClass('progressbar');
	}
	xhr.upload.onloadend = function (e) {
		progressbar.removeClass('progressbar');
		progressbar.addClass('progressbar-infinite');


		$$('.edit_photo_pr_load').html("Успешно обновлено!");
		setTimeout(function () {
			$$('.edit_photo_pr_load').hide();
				myApp.closeModal();
				mainView.router.loadPage('edit_user.html');

			window.localStorage.setItem("ava_user", load_photo300[0]);
			$$("#ava_user").attr("src", load_photo300[0]);
			
			load_photo = [];
			load_photo300 = [];
			load_hidden_photo = [];
			load_hidden_photo300 = [];

		}, 1000);


	}
	xhr.send(data);

}

function buildFormData() {
	var fd = new FormData();

	for (var i = 0; i < load_hidden_photo300.length; i += 1) {

	}

	fd.append('id', window.localStorage.getItem("id"));
	fd.append('key', window.localStorage.getItem("key"));

	fd.append('photo', JSON.stringify(load_photo));
	fd.append('square_photo', JSON.stringify(load_photo300));
	fd.append('hidden_photo', JSON.stringify(load_hidden_photo));
	fd.append('hidden_square_photo', JSON.stringify(load_hidden_photo300));

	return fd;
}
