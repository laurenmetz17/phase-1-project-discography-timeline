document.addEventListener('DOMContentLoaded',function() {
    let artistForm = document.querySelector('form');
    artistForm.addEventListener('submit', renderAlbums)


})

function renderAlbums(e) {
    e.preventDefault();
    let artistInput = e.target.children[1].value;
    let albums = [];
    fetch(`https://itunes.apple.com/search?media=music&entity=album&term=${artistInput}`).then(resp => resp.json())
    .then(data => {
        albums = data.results;
        console.log(albums);
        let sorted = sortAlbums(albums);
        //iterate through sorted to create an album card for each
        console.log(sorted);
        for(let year in sorted) {
            console.log(sorted[year]);
            for(let date in sorted[year]) {
                console.log(sorted[year][date]);
                sorted[year][date].forEach(album => {
                    console.log(album);
                    createAlbumCard(album);
                });

            }
        }
        //console.log(Object.keys(year));
        
            //albums.forEach(album => createAlbumCard(album));
    return sorted;     
    });
}  
    
        


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
function createAlbumCard(album) {
    let albumCard = document.createElement('card');
    albumCard.classList.add('albums');
    let albumTitle = document.createElement('h2');
    albumTitle.textContent = album.collectionName;
    let albumArt = document.createElement('img');
    albumArt.src = album.artworkUrl100;
    let albumLink = document.createElement('a');
    albumLink.href = album.collectionViewUrl;
    let albumGenre = document.createElement('h3');
    albumGenre.textContent = album.primaryGenreName;
    let albumDate = document.createElement('p');
    albumDate.classList.add('release-dates');
    albumDate.textContent = album.releaseDate.substring(0,10);

    albumCard.append(albumTitle);
    albumCard.append(albumArt);
    albumCard.append(albumGenre);
    albumCard.append(albumLink); // fix link to have text content or be linked to the title
    albumCard.append(albumDate);

    document.querySelector('#timeline').append(albumCard);
    console.log(albumCard);

}
