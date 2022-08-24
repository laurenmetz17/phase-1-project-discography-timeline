document.addEventListener('DOMContentLoaded',function() {
    let artistForm = document.querySelector('form');
    artistForm.addEventListener('submit', renderAlbums);
    //make the original form look cool
})

//note that it currently does not clear the page if you enter a new artkst it appneds to the end
//has repeats of the same albums probably because 
//add in a warning to the alert the user when they enter an artist that does not exist in the API

//build the html of the timeline to be styled
function renderTimeline(artist) {
    timelineTitle = document.createElement('h1');
    timelineTitle.textContent = `${artist} Discography Timeline`;
    //center the title 
    //add in a center line for the timeline 
    //add in connector arms for each album card 
    //make album cards alternate sides of the center line
    //change background color 
    //add in event listeners on the album cards
    document.querySelector('#timeline').append(timelineTitle)
}

//creates an album card for each album sorted by release date and adds them to the timeline
function renderAlbums(e) {
    e.preventDefault();
    let artistInput = e.target.children[1].value;
    renderTimeline(artistInput);
    let albums = [];
    //fetches the data of the artist directed by the artist inputdfc
    fetch(`https://itunes.apple.com/search?media=music&entity=album&term=${artistInput}`).then(resp => resp.json())
    .then(data => {
        albums = data.results;
        console.log(albums);
        let sorted = sortAlbums(albums);
        for(let year in sorted) {
            for(let date in sorted[year]) {
                sorted[year][date].forEach(album => {
                    createAlbumCard(album);
                });
            }
        }
        return sorted;     
    });
}  
    
//sorts the albums by the year and date of their release date into a nested object the third level being an array
function sortAlbums(albums) {
    let sorted = {};
    albums.forEach(album  => {
        let year = album.releaseDate.substring(0,4);
        let date = album.releaseDate.substring(5,10);
        if(sorted[year] == undefined) {
            sorted[year] = {};
            sorted[year][date] = [];
            sorted[year][date].push(album);
        }
        else {
            if(sorted[year][date] == undefined) {
                sorted[year][date] = [];
                sorted[year][date].push(album);
            }
            else {
                sorted[year][date].push(album);
            }
        }
    })

    return sorted;


}

//creates an album card including a title, art, genre, link, and release date
function createAlbumCard(album) {
    let albumCard = document.createElement('card');
    albumCard.classList.add('albums');
    let albumTitle = document.createElement('h2');
    albumTitle.textContent = album.collectionName;
    let albumArt = document.createElement('img');
    albumArt.src = album.artworkUrl100;
    let albumLink = document.createElement('a');
    albumLink.href = album.collectionViewUrl;
    albumLink.textContent = "Link to apple Music page!"
    let albumGenre = document.createElement('h3');
    albumGenre.textContent = album.primaryGenreName;
    let albumDate = document.createElement('p');
    albumDate.classList.add('release-dates');
    albumDate.textContent = album.releaseDate.substring(0,10);

    albumCard.append(albumTitle);
    albumCard.append(albumArt);
    albumCard.append(albumGenre);
    albumCard.append(albumLink); 
    albumCard.append(albumDate);

    document.querySelector('#timeline').append(albumCard);

}
