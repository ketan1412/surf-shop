mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
        
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v10',
            center: post.geometry.coordinates,
            zoom: 5
        });
        
        // code from the next step will go here!
    
    // create a HTML element for post location
    var el = document.createElement('div');
    el.className = 'marker';
    
    // make a marker for post location and add to the map
    new mapboxgl.Marker(el)
        .setLngLat(post.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
        .addTo(map);
    
        //Toggle edit review form
        $('.toggle-edit-form').on('click',function(){
            $(this).text()==='Edit'?$(this).text('Cancel'):$(this).text('Edit');
            $(this).siblings('.edit-review-form').toggle();
        });

//Add click listener for clearing rating from edit/new form
$('.clear-rating').click(function(){
    $(this).siblings('.input-no-rate').click();
})