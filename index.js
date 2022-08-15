document.addEventListener('DOMContentLoaded',function() {
    let artistForm = document.querySelector('form');
    artistForm.addEventListener('submit', getArtistInfo)


})

function getArtistInfo(e) {
    e.preventDefault();
    console.log(e);
    console.log(e.target.children[1].value);
}