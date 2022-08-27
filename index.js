
document.addEventListener('DOMContentLoaded',function() {
    let artistForm = document.querySelector('form');
    artistForm.addEventListener('submit', renderTimeline);
    let timelineButton = document.querySelector('[name = "submit-timeline"]');
    let genreButton = document.querySelector('[name = "submit-genre"]');
    genreButton.addEventListener('click', renderGenre);

})

//render the genres of each album from that artist added in a table at the top of the page 
function renderGenre(e) {
    let artistInput = e.target.parentNode.children[1].value
    let albums = [];
    let genres = [];
    let genreCount = {};
    let genreTitle = document.querySelector('#genre-title');
    genreTitle.textContent = `${artistInput} Career Genre Count`;
    genreTitle.style.textAlign = 'center';
    return fetch(`https://itunes.apple.com/search?media=music&entity=album&term=${artistInput}`).then(resp => resp.json())
    .then(data => {
        albums = data.results;
        albums.forEach(album => {
            genres.push(album.primaryGenreName);
        })
        genres.forEach(genre => {
            if(genreCount[genre] == undefined) {
                genreCount[genre] = 1;
            }
            else {
                genreCount[genre] = genreCount[genre] + 1;
            }

        })

        let genreDiv = document.querySelector('#genre-info');
        genreDiv.style.fontFamily = 'Impact, fantasy';
        genreDiv.style.border = '6px solid green';
        genreDiv.style.borderRadius = '25px';
        let genreTable = document.querySelector('#genre-table');
        genreTable.style.width = '100%';
        let genreNames = document.createElement('tr');
        let genreNums = document.createElement('tr');
        genreTable.append(genreNames);
        genreTable.append(genreNums);


        
        genreTable.style.tableLayout = 'fixed';
        for(let genre in genreCount) {
            let genreName = document.createElement('th');
            genreName.textContent = genre;
            genreName.style.border = '3px solid green';
            genreNames.append(genreName);
            let genreNum = document.createElement('td');
            genreNum.textContent = genreCount[genre];
            genreNum.style.border = '3px solid green';
            genreNums.style.textAlign = 'center';
            genreNums.append(genreNum);
        }
        return genres;
    })
}

//note that it currently does not clear the page if you enter a new artkst it appneds to the end
//add in a warning to the alert the user when they enter an artist that does not exist in the API

//build the timeline with the correct years and styling calling the render albums function
function renderTimeline(e) {
    e.preventDefault();
    console.log(e.target);
    let artistInput = e.target.children[1].value;
    e.target.children[1].value = '';
    if(document.querySelector('#timeline-title') == null) {
        timelineTitle.textContent = `${artistInput} Discography Timeline`;
        timelineTitle.style.textAlign = 'center';
        timelineTitle.style.fontFamily = 'Impact, fantasy'
        let timeline = document.querySelector('#timeline');
        timeline.append(timelineTitle);
        
        renderAlbums(artistInput).then(sorted => {
            let years = document.querySelector('#years');
            for(let year in sorted) {
                let yearElement = document.createElement('p');
                yearElement.textContent = year;
                yearElement.style.marginLeft = '30px';
                yearElement.style.border = 'solid green';
                yearElement.style.padding = '20px';
                yearElement.style.fontSize = 'xx-large';
                yearElement.style.fontFamily = 'Impact, fantasy';
                yearElement.style.backgroundColor = 'green';
                yearElement.style.borderRadius = '50px'
                let count = 0;
                for(let date in sorted[year]) {
                    count = count + sorted[year][date].length;
                }
                let paddingNum = 0;
                if(count <=5) {
                    paddingNum = 462 * count + (25 * count)
                }
                else {
                    paddingNum = 462 * count + (40 * count);
                }
                yearElement.style.height = `${paddingNum}px`;
                console.log(count);
                console.log(yearElement);
                document.querySelector('#center-line').append(yearElement);
            }

        })
        let lineHeight = 462 * 60;
        document.querySelector('#center-line').style.height = `${lineHeight.toString()}px`;   
    }
    else {
        //fix what should happen if there is already a timeline rendered
        let timelineTitle = document.querySelector('#timeline-title');
        timelineTitle.textContent = `${artistInput} Discography Timeline`;
        let oldAlbums = document.getElementsByClassName('albums');
    }
}

//creates an album card for each album sorted by release date and adds them to the timeline
function renderAlbums(artistInput) {
    let albums = [];
    //fetches the data of the artist directed by the artist input
    return fetch(`https://itunes.apple.com/search?media=music&entity=album&term=${artistInput}`).then(resp => resp.json())
    .then(data => {
        albums = data.results;
        let sorted = sortAlbums(albums);
        console.log(sorted);
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

//creates an album card including a title, art, genre, link, trackCount, and release date styles the album card and adds connector 
function createAlbumCard(album) {
    let albumCard = document.createElement('div');
    albumCard.classList.add('albums');
    let albumTitle = document.createElement('h2');
    albumTitle.textContent = album.collectionName;
    let albumArt = document.createElement('img');
    albumArt.src = album.artworkUrl100;
    albumArt.style.width = '150px';
    albumArt.style.height = '150px'
    let albumLink = document.createElement('a');
    albumLink.href = album.collectionViewUrl;
    albumLink.textContent = "Link to apple Music page!"
    let albumGenre = document.createElement('h3');
    albumGenre.classList.add('genres');
    albumGenre.textContent = album.primaryGenreName;
    let albumDate = document.createElement('p');
    albumDate.style.color = 'green'
    albumDate.classList.add('release-dates');
    albumDate.textContent = album.releaseDate.substring(0,10);

    let trackCount = document.createElement('p');
    trackCount.textContent =`Track Count = ${album.trackCount}`;
    trackCount.style.display = 'none';
    
    albumCard.addEventListener('mouseover', (event) => {
        trackCount.style.display = 'block';
    });
    albumCard.addEventListener('mouseout', (event) => {
        trackCount.style.display = 'none';
    });

    albumCard.append(albumTitle);
    albumCard.append(albumArt);
    albumCard.append(albumGenre);
    albumCard.append(albumLink); 
    albumCard.append(albumDate);
    albumCard.append(trackCount);

    document.querySelector('#timeline').append(albumCard);
    albumCard.style.border = '6px solid green';
    albumCard.style.borderRadius ='25px';
    albumCard.style.width = '300px';
    albumCard.style.height = '450px'
    albumCard.style.marginBottom = '50px';
    albumCard.style.fontFamily = 'Impact, fantasy';
    albumCard.style.textAlign = 'center';

    let connector = document.createElement('div');
    connector.style.width = '27.6vw';
    connector.style.height = '6px'
    connector.style.backgroundColor = 'green'
    connector.style.color = 'red'
    connector.style.marginLeft ='305px'
    console.log(albumCard)

    albumCard.append(connector);

}
