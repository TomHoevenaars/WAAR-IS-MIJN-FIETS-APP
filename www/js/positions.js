function Position(position, address, datetime)
{
   var _db = window.localStorage;
   var MAX_POSITIONS = 50;

   this.position = position;
   this.address = address;
   this.datetime = datetime;

   this.getMaxPositions = function()
   {
      return MAX_POSITIONS;
   }

   this.savePosition = function(position, address)
   {
      if (!_db)
      {
         console.log('Er is geen data gevonden. Kan geen locaties ophalen.');
         navigator.notification.alert(
            'Kan deze locatie niet opslaan',
            function(){},
            'Error'
         );
      }

      var positions = this.getPositions();
      if (positions == null)
         positions = [];

      positions.unshift(new Position(position, address, new Date()));

      if (positions.length > this.MAX_POSITIONS)
         positions = positions.slice(0, this.MAX_POSITIONS);

      _db.setItem('positions', JSON.stringify(positions));

      return positions;
   }

   this.updatePosition = function(index, position, address)
   {
      if (!_db)
      {
         console.log('Er is geen data gevonden. Kan geen locaties ophalen.');
         navigator.notification.alert(
            'Kan deze locatie niet updaten',
            function(){},
            'Error'
         );
      }

      var positions = this.getPositions();
      if (positions != null && positions[index] != undefined)
      {
         positions[index].coords = position;
         positions[index].address = address;
      }

      _db.setItem('positions', JSON.stringify(positions));

      return positions;
   }

   this.deletePosition = function(index)
   {
      if (!_db)
      {
         console.log('Er is geen data gevonden. Kan geen locaties ophalen.');
         navigator.notification.alert(
            'Kan deze locatie niet verwijderen',
            function(){},
            'Error'
         );
      }

      var positions = this.getPositions();
      if (positions != null && positions[index] != undefined)
         positions.splice(index, 1);

      _db.setItem('positions', JSON.stringify(positions));

      return positions;
   }

   this.getPositions = function()
   {
      if (!_db)
      {
         console.log('Er is geen data gevonden. Kan geen locaties ophalen.');
         navigator.notification.alert(
            'Kan geen locaties ophalen',
            function(){},
            'Error'
         );
      }

      var positions = JSON.parse(_db.getItem('positions'));
      if (positions == null)
         positions = [];

      return positions;
   }

}

function Coords(latitude, longitude, accuracy)
{
   this.latitude = latitude;
   this.longitude = longitude;
   this.accuracy = accuracy;
}