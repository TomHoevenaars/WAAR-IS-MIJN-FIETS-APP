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
         console.log('Kan de locatie niet opslaan');
         navigator.notification.alert(
            'Kan locatie niet ophalen',
            function(){},
            'Error'
         );
      }

      var positions = this.getPositions();
      if (positions == null)
         positions = [];

      positions.unshift(new Position(position, address, new Date()));
      // Only the top MAX_POSITIONS results are needed
      if (positions.length > this.MAX_POSITIONS)
         positions = positions.slice(0, this.MAX_POSITIONS);

      _db.setItem('positions', JSON.stringify(positions));

      return positions;
   }

   this.updatePosition = function(index, position, address)
   {
      if (!_db)
      {
         console.log('Kan de locatie niet updaten');
         navigator.notification.alert(
            'Updaten van locatie is niet mogelijk',
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
         console.log('Kan de locatie niet verwijderen');
         navigator.notification.alert(
            'Verwijderen van locatie is niet mogelijk',
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
         console.log('Kan geen locaties ophalen');
         navigator.notification.alert(
            'Ophalen van locaties is niet mogelijk',
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