Geocoder = {

    __cache : [],

    __getFromCache : function(latitude,longitude){
        return _.find(this.__cache, function(c){
            return (c.latitude === latitude) && (c.longitude === longitude);
        });
    },

    __putToCache : function(latitude, longitude, data){
        this.__cache.push({
            latitude : latitude,
            longitude : longitude,
            data : data
        });
    },

    reverseGeocode : function(latitude, longitude, callback){

        var that = this;
        var cached = this.__getFromCache(latitude,longitude);

        if(cached){
            callback.call(null, cached.data);
            return;
        }

        return Meteor.http.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params : {
                latlng: [latitude,longitude].join(','),
                key: 'AIzaSyDeJxYBiJGB_z0d41KdHuOzACXtaddU0qU'
            }
        }, function(error, result){
            var hasResults = !error && (result.statusCode === 200) &&
                (result.data.results) && (result.data.results.length > 0);

            if(hasResults){
                var data = result.data.results[0];
                var city = _.find(data.address_components, function(ac){
                    return ac.types.indexOf('locality') !== -1;
                });
                var country = _.find(data.address_components, function(ac){
                    return ac.types.indexOf('country') !== -1;
                });

                city = city ? city.long_name : city;
                country = country ? country.long_name : country;

                var response = {
                    city : city,
                    country : country,
                    latitude : parseFloat(data.geometry.location.lat),
                    longitude : parseFloat(data.geometry.location.lng)
                };
                that.__putToCache(latitude,longitude,response);
                callback.call(null, response);

            } else {
                console.error('error geolocating',latitude,longitude,error);
            }
        });
    }
};