function Map()
{
}

Map.displayMap = function(userPosition, fietsPosition)
{
   var userLatLng = null;
   var fietsLatLng = null;

   if (userPosition != null)
      userLatLng = new google.maps.LatLng(userPosition.coords.latitude, userPosition.coords.longitude);
   if (fietsPosition != null)
      fietsLatLng = new google.maps.LatLng(fietsPosition.position.latitude, fietsPosition.position.longitude);

   var options = {
      zoom: 20,
      disableDefaultUI: true,
      streetViewControl: true,
      center: userLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   }

   var map = new google.maps.Map(document.getElementById('map'), options);
   var marker = new google.maps.Marker({
      position: userLatLng,
      map: map,
      title: 'Your position'
   });

   if (fietsLatLng == null)
      marker.setIcon('images/bicycle-marker.png');
   else
      marker.setIcon('images/user-marker.png');
   var circle = new google.maps.Circle({
      center: userLatLng,
      radius: userPosition.coords.accuracy,
      map: map,
      fillColor: '#70E7FF',
      fillOpacity: 0.2,
      strokeColor: '#0000FF',
      strokeOpacity: 1.0
   });
   map.fitBounds(circle.getBounds());

   if (fietsLatLng != null)
   {
      marker = new google.maps.Marker({
         position: fietsLatLng,
         map: map,
         icon: 'images/bicycle-marker.png',
         title: 'Fiets locatie'
      });
      circle = new google.maps.Circle({
         center: fietsLatLng,
         radius: fietsPosition.position.accuracy,
         map: map,
         fillColor: '#70E7FF',
         fillOpacity: 0.2,
         strokeColor: '#0000FF',
         strokeOpacity: 1.0
      });

      // Display route to the fiets
      options = {
         suppressMarkers: true,
         map: map,
         preserveViewport: true
      }
      this.setRoute(new google.maps.DirectionsRenderer(options), userLatLng, fietsLatLng);
   }

   $.mobile.loading('hide');
}

Map.setRoute = function(directionsDisplay, userLatLng, fietsLatLng)
{
   var directionsService = new google.maps.DirectionsService();
   var request = {
      origin: userLatLng,
      destination: fietsLatLng,
      travelMode: google.maps.DirectionsTravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC
   };

   directionsService.route(
      request,
      function(response, status)
      {
         if (status == google.maps.DirectionsStatus.OK)
            directionsDisplay.setDirections(response);
         else
         {
            navigator.notification.alert(
               'Kan de route naar je fiets niet berekenen. Probeer er zelf heen te lopen :)',
               function(){},
               'Waarschuwing'
            );
         }
      }
   );
}

Map.requestLocation = function(position)
{
   new google.maps.Geocoder().geocode(
      {
         'location': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      },
      function(results, status)
      {
         if (status == google.maps.GeocoderStatus.OK)
         {
            var positions = new Position();
            positions.updatePosition(0, positions.getPositions()[0].coords, results[0].formatted_address);
         }
      }
   );
}