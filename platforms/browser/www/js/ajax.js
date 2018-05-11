/*

function ajax_response(method, otv) {

	if (method == "user.get") {
		if (otv.online == 1) otv.online = ' <div class="online_p"></div>';
		else otv.online = '';

		$$('.user .name').html(otv.name + ", " + otv.age + otv.online);
		// Показ города и расстояния
		if (otv.distance != null) distance = otv.distance + " км.";
		else otv.distance = '';
		$$('.user .add').html(otv.sity + ". " + otv.distance);


		console.log("Ответ");


		for (var i in otv.photo_public) {
			Swiper_user.appendSlide('<div class="swiper-slide"><img src="' + otv.photo_public[i] + '"></div>');
			otv.photo_public[i] = null;
		}


		if (otv.photo_public == null) {
			Swiper_user.appendSlide('<div class="swiper-slide"><img src="img/fon_login.jpg"></div>');
		}
	}




	//if (method == "favorites.get") {
	if (method == "search.near") {
		if (otv.success == 1) {
				

			for (var i in otv.data) {

				if (otv.data[i]["online"] == 1) otv.data[i]["online"] = '<div class="online"></div>';
				else otv.data[i]["online"] = '';

				if (otv.data[i]["photo"] == null) {
					temp_photo = "img/error.png";
				} else {
					temp_photo = otv.data[i]["photo"];
					otv.data[i]["photo"] = null;
				}

				$$('.favorites .user_photo').append('<div onclick="user_go(' + otv.data[i]["id"] + ');" class="col-33 user" id="elem_col">' + otv.data[i]["online"] + '<img src="' + temp_photo + '"><div class="info">' + otv.data[i]["name"] + ', ' + otv.data[i]["age"] + '</div></div>');

			}
		}

	}







	if (otv.message != undefined) {
		error_us(2, otv.message);
	}

	otv = null;

}

function ajaxRequest(method, data) {

	data[data.length, "version"] = version_app;
	data[data.length, "id"] = window.localStorage.getItem("id");
	data[data.length, "key"] = window.localStorage.getItem("key");

	data[data.length, "latitude"] = my_latitude;
	data[data.length, "longitude"] = my_longitude;
	data = JSON.stringify(data);

	console.log("AJAX >> ");
	console.log(method);
	console.log(data);
/*
	var container = $$('body');
	if (container.children('.progressbar, .progressbar-infinite').length) return;
	myApp.showProgressbar(container, 'orange');
*/

/*

	xhr_ajax = $$.ajax({
		url: "https://xxx.ru/apitest/" + method,
		method: "POST",
		crossDomain: true,
		data: "data=" + data,
		error: function (response) {
			myApp.hideProgressbar();

		},
		success: function (response) {

			console.log("AJAX << ");
			//console.log(response);
			console.log("Ответ скрыт");

			ajax_response(method, JSON.parse(response));
			try {



			} catch (e) {

				error_us(1, 'Болеет JSON');
			}

			response = null;
			delete response;

		},
		complete: function (response) {
			// не работает =(
			// хотя вроде работает...
			console.log("ВСЕ!");
			myApp.hideProgressbar();
		},
		error: function (response) {
			// не работает =(
			// хотя вроде работает...
			alert("ВСЕ!");
		},
		start: function (response) {
			// не работает =(
			// хотя вроде работает...
			console.log("Начал!");
		}
	});

}

*/

