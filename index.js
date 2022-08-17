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
        albums.forEach(album => createAlbumCard(album));
    });
    return albums;
        
}

function createAlbumCard(album) {
    let albumCard = document.createElement('card');
    albumCard.classList.add('albums');
    
    let albumTitle = document.createElement('h2');
    albumTitle.textContent = album.collectionName;
    let albumArt = document.createElement('img');
    //albumArt.src = album.artWorkUrl100;
    let albumLink = document.createElement('a');
    albumLink.href = album.collectionViewUrl;
    let albumGenre = document.createElement('h3');
    albumGenre.textContent = album.primaryGenreName;
    let albumDate = document.createElement('p');
    albumDate.classList.add('release-dates');
    albumDate.textContent = album.releaseDate;

    albumCard.append(albumTitle);
    albumCard.append(albumArt);
    albumCard.append(albumGenre);
    albumCard.append(albumLink);
    albumCard.append(albumDate);

    document.querySelector('#timeline').append(albumCard);
    console.log(albumCard);

}
