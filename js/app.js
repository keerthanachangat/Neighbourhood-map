//destinations array containing all the places to show on the map
//fs_Id is the foursquare id
var destinations = [{
		name: 'Capitol Mall',
		selection: false,
		show: true,
		fs_Id: "53ac375d498efa7abbd3df2d",
		lat: 11.875966,
		long: 75.378274
	},
	{
		name: 'Rara Avis Restaurant',
		selection: false,
		show: true,
		fs_Id: "4c948becf244b1f7a307231d",
		lat: 11.875290,
		long: 75.373765
	},
	{
		name: 'City Centre',
		selection: false,
		show: true,
		fs_Id: "4c1785357bf1d13a2937e881",
		lat: 11.870306,
		long:  75.367193
	},
	{
		name: 'St. Angelo Fort',
		selection: false,
		show: true,
		fs_Id: "4c74fd0c1b30a0938afbed09",
		lat: 11.854383,
		long: 75.371413
	},
	
	{
		name: 'Payyambalam Beach',
		selection: false,
		show: true,
		fs_Id: "4c42d529ce54e21eed400d1a",
		lat: 11.869480,
		long: 75.352389
	},
	{
		name: 'Indian Coffee House',
		selection: false,
		show: true,
		fs_Id: "4c61316813791b8d5a4151af",
		lat: 11.869480,
		long: 75.352389
	},
	{
		name: 'The Kannur Mall',
		selection: false,
		show: true,
		fs_Id: "4f78666ae4b0a35da5293b14",
		lat: 11.872372,
		long: 75.361661
	}

];
var map;

//initialising the map
function initMap() {
	var cordinates = new google.maps.LatLng(11.875966, 75.378274);

	var mapOptions = {
		zoom: 14,
		center: cordinates
	};

	map = new google.maps.Map(document.querySelector("#map"), mapOptions);
	ko.applyBindings(new model());

}

function error() {
	alert("error loading map");
}

//varmodel 
var model = function () {

	var self = this;
	self.error = ko.observable('');

	self.location = ko.observableArray([]);

	destinations.forEach(function (pla) {

		var marker = new google.maps.Marker({
			name: pla.name,
			position: {
				lat: pla.lat,
				lng: pla.long
			},
			show: ko.observable(pla.show),
			animation: google.maps.Animation.DROP,
			fs_Id: pla.fs_Id,
			map: map,
			selection: ko.observable(pla.selection),
			id: 1
		});

		self.location.push(marker);

		marker.addListener('click', function () {
			self.Bounce(marker);
			self.fillwindow(this, infowindow);
			self.addinfo(marker);

		});

	});


        self.clickList = function (marker) {

		google.maps.event.trigger(marker, 'click');
	};

	self.Bounce = function (animate) {
		animate.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function () {
			animate.setAnimation(null);
		}, 2100);
	};

	self.fillwindow = function (marker, infowindow) {

		
		if (infowindow.marker != marker) {
			infowindow.setContent('');
			infowindow.marker = marker;
		}

	};

	var infowindow = new google.maps.InfoWindow();

	self.error = ko.observable('');
	

	self.addinfo = function (marker) {
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/' + marker.fs_Id + '?client_id=' + 'TCRCADZGL5FEKM04RJXRHVTCKP0OABS2HJPFPE1MJBXPPXOS' + '&client_secret=' + 'URV3DCPDGLXRH3LC3LWDDXQCLS1Z4K4TQOHHRJFQDX23F0ER' + '&v=20170609',
			dataType: "json",
			 .done()function (data) {

				marker.likes = data.response.venue.likes.hasOwnProperty('summary') ? data.response.venue.likes.summary : "Data Not Found";
				marker.contact = data.response.venue.contact.hasOwnProperty('phone') ? data.response.venue.contact.phone : "Data Not Found";
				marker.stars = data.response.venue.hasOwnProperty('rating') ? data.response.venue.rating.summary : "Data not Found";


				infowindow.setContent('<h3>' + marker.name + '</h2>' + '<br>' + 'No of Likes: ' + marker.likes + '<br>CustomerRatings: ' + marker.stars + '</br>Contact: ' + marker.contact);
				infowindow.open(map, marker);
			},
			.error()function (e) {
				self.error("Foresquare data is incorrect ");
			}
		});
	};
   
      var f = self.location();

	/
	self.Show = function (binary) {
		for (var i = 0; i < filter.length; i++) {
			f[i].show(binary);
			f[i].setVisible(binary);
		}
	};




	

	
	self.locationinput = ko.observable('');

	self.search = function () {

		var display = self.locationinput();

		
		if (display.length === 0) {
			self.Show(true);
		} else {
			for (var i = 0; i < f.length; i++) {

                  if (filter[i].name.toLowerCase().indexOf(display.toLowerCase()) > -1) {
					f[i].show(true);
					f[i].setVisible(true);
				} else {
					f[i].show(false);
					f[i].setVisible(false);
				}
			}
		}
	};


};
