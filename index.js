
document.addEventListener('DOMContentLoaded',function() {
    let artistForm = document.querySelector('form');
    artistForm.addEventListener('submit', renderTimeline);
})

//note that it currently does not clear the page if you enter a new artkst it appneds to the end
//has repeats of the same albums probably because 
//add in a warning to the alert the user when they enter an artist that does not exist in the API
//some aretist inputs match multiple actual artists and returns all of tbem
//add something to ask user whcih artist they actually mean or auto find the strict match

//build the html of the timeline to be styled
function renderTimeline(e) {
    e.preventDefault();
    let artistInput = e.target.children[1].value;
    e.target.children[1].value = '';
    if(document.querySelector('#timeline-title') == null) {
        timelineTitle.textContent = `${artistInput} Discography Timeline`;
        timelineTitle.style.textAlign = 'center';
        let timeline = document.querySelector('#timeline');
        document.querySelector('#center-line').style.height = '200000px';
        timeline.append(timelineTitle);
        
        renderAlbums(artistInput).then(sorted => {
            let years = document.querySelector('#years');
            console.log(sorted);
            for(let year in sorted) {
                let yearElement = document.createElement('p');
                yearElement.textContent = year;
                yearElement.style.marginLeft = '30px';
                yearElement.style.border = 'solid green';
                yearElement.style.padding = '20px';
                yearElement.style.fontSize = 'xx-large';
                yearElement.style.backgroundColor = 'green';
                yearElement.style.borderRadius = '50px'
                let count = 0;
                for(let date in sorted[year]) {
                    count = count + sorted[year][date].length;
                }
                console.log(count);
                console.log(sorted[year]);
                let paddingNum = 350 * count //figure out padding based on height of albumCard ;
                console.log(paddingNum.toString());
                yearElement.style.marginBottom = `${paddingNum}px`;
                document.querySelector('#center-line').append(yearElement);
            }
            console.log(timeline);

        })

        
    }
    else {
        let timelineTitle = document.querySelector('#timeline-title');
        timelineTitle.textContent = `${artistInput} Discography Timeline`;
        let oldAlbums = document.getElementsByClassName('albums');
        console.log(oldAlbums)
        //for(let i = 0; i< oldAlbums.length; i++) {
        //    oldAlbums[i].remove();
        //}
    }
   // hard code need to fix so that the vertical line changes with the page height
    //add in connector arms for each album card 
    //make album cards alternate sides of the center line
    //add in event listeners on the album cards
}

//creates an album card for each album sorted by release date and adds them to the timeline
function renderAlbums(artistInput) {
    let albums = [];
    //fetches the data of the artist directed by the artist inputdfc
    return fetch(`https://itunes.apple.com/search?media=music&entity=album&term=${artistInput}`).then(resp => resp.json())
    .then(data => {
        albums = data.results;
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
    let albumCard = document.createElement('div');
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
    albumCard.style.border = '3px solid green';
    albumCard.style.borderRadius ='25px';
    albumCard.style.width = '300px';
    albumCard.style.marginBottom = '50px';

    let connector = document.createElement('div');
    connector.style.width = '80px'
    connector.style.height = '3px'
    connector.style.backgroundColor = 'green'
    connector.style.color = 'red'
    connector.style.marginLeft ='290px'


    albumCard.append(connector);
    console.log(albumCard);


}
