function checkRequirements()
{
   if (navigator.network.connection.type == Connection.NONE)
   {
      navigator.notification.alert(
         'Zet je internet verbinding aan om deze app te kunnen gebruiken.',
         function(){},
         'Let op!'
      );
      return false;
   }

   return true;
}

function updateIcons()
{
   if ($(window).width() > 480)
   {
      $('a[data-icon], button[data-icon]').each(
         function()
         {
            $(this).removeAttr('data-iconpos');
         }
      );
   }
   else
   {
      $('a[data-icon], button[data-icon]').each(
         function()
         {
            $(this).attr('data-iconpos', 'notext');
         }
      );
   }
}

function urlParam(name)
{
   var results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
   if (results != null && typeof results[1] !== 'undefined')
      return results[1];
   else
      return null;
}

function initApplication()
{
   $('#set-fiets-position, #find-fiets').click(function() {
      if (checkRequirements() === false)
      {
         $(this).removeClass('ui-btn-active');
         return false;
      }
   });
   $(document).on('pagebeforecreate orientationchange', updateIcons);
   $('#map-page').live(
      'pageshow',
      function()
      {
         var requestType = urlParam('requestType');
         var positionIndex = urlParam('index');
         var geolocationOptions = {
            timeout: 15 * 1000, 
            maximumAge: 10 * 1000, 
            enableHighAccuracy: true
         };
         var position = new Position();

         $.mobile.loading('show');

         if (requestType == 'set')
         {
            navigator.geolocation.getCurrentPosition(
               function(location)
               {

                  position.savePosition(
                     new Coords(
                        location.coords.latitude,
                        location.coords.longitude,
                        location.coords.accuracy
                     )
                  );

                  Map.requestLocation(location);
                  Map.displayMap(location, null);
                  navigator.notification.alert(
                     'Fiets opgeslagen!',
                     function(){},
                     'Info'
                  );
               },
               function(error)
               {
                  navigator.notification.alert(
                     'Geen locatie gevonden, staat je GPS aan?',
                     function(){
                        alert("Kan locatie niet ophalen: " + error.message);
                     },
                     'Error'
                  );
                  $.mobile.changePage('index.html');
               },
               geolocationOptions
            );
         }
         else
         {
            if (position.getPositions().length == 0)
            {
               navigator.notification.alert(
                  'Je hebt nog geen fiets opgeslagen',
                  function(){},
                  'Error'
               );
               $.mobile.changePage('index.html');
               return false;
            }
            else
            {
               navigator.geolocation.watchPosition(
                  function(location)
                  {

                     if (positionIndex == undefined)
                        Map.displayMap(location, position.getPositions()[0]);
                     else
                        Map.displayMap(location, position.getPositions()[positionIndex]);
                  },
                  function(error)
                  {
                     console.log("Kan locatie niet ophalen: " + error.message);
                  },
                  geolocationOptions
               );
            }
         }
      }
   );
   $('#positions-page').live(
      'pageinit',
      function()
      {
         createPositionsHistoryList('positions-list', (new Position()).getPositions());
      }
   );
}

function createPositionsHistoryList(idElement, positions)
{
   if (positions == null || positions.length == 0)
      return;

   $('#' + idElement).empty();
   var $listElement, $linkElement, dateTime;
   for(var i = 0; i < positions.length; i++)
   {
      $listElement = $('<li>');
      $linkElement = $('<a>');
      $linkElement
      .attr('href', '#')
      .click(
         function()
         {
            if (checkRequirements() === false)
               return false;

            $.mobile.changePage(
               'map.html',
               {
                  data: {
                     requestType: 'get',
                     index: $(this).closest('li').index()
                  }
               }
            );
         }
      );

      if (positions[i].address == '' || positions[i].address == null)
         $linkElement.text('Adres niet gevonden');
      else
         $linkElement.text(positions[i].address);

      dateTime = new Date(positions[i].datetime);
      $linkElement.text(
         $linkElement.text() + ' @ ' +
         dateTime.toLocaleDateString() + ' ' +
         dateTime.toLocaleTimeString()
      );

      $listElement.append($linkElement);

      $linkElement = $('<a>');
      $linkElement.attr('href', '#')
      .text('Delete')
      .click(
         function()
         {
            var position = new Position();
            var oldLenght = position.getPositions().length;
            var $parentUl = $(this).closest('ul');

            position.deletePosition($(this).closest('li').index());
            if (oldLenght == position.getPositions().length + 1)
            {
               $(this).closest('li').remove();
               $parentUl.listview('refresh');
            }
            else
            {
               navigator.notification.alert(
                  'Locatie niet verwijderd, probeer het nog een keer.',
                  function(){},
                  'Error'
               );
            }

         }
      );

      $listElement.append($linkElement);

      $('#' + idElement).append($listElement);
   }
   $('#' + idElement).listview('refresh');
}