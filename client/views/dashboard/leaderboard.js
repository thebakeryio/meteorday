Template.leaderboard.rendered = function(){
    
    var cities = this.data.cities,
        that = this;

    var setLeaderboard = function(){
        var content = 'Top Meteor Cities: ';
        _.each(cities.fetch(), function(city, i){
            content += UI.toHTMLWithData(Template.city_stat, {index: i+1, city: city});
        });
        that.$('.marquee-content').html(content);
    };

    setLeaderboard();

    this.$('.marquee').bind('finished', function(){
        setLeaderboard();
    }).marquee({
        duration: 20000,
        pauseOnHover: true
    });
};

Handlebars.registerHelper('toLowerCase', function(value) {
    if (value && typeof value === 'string') {
        return value.toLowerCase();
    } else {
        return '';
    }
});