document.addEventListener('DOMContentLoaded',function() {
    let artistForm = document.querySelector('form');
    artistForm.addEventListener('submit', getArtistInfo)


})

function getArtistInfo(e) {
    e.preventDefault();
    let artistInput = e.target.children[1].value;
    let albums = []
    fetch(`https://itunes.apple.com/search?media=music&entity=album&term=${artistInput}`).then(resp => resp.json())
    .then(data => {
        albums = data.results;
        console.log(albums);
    });
    return albums;
        
}