const loggedUserGgId = "32dfc42c7926408d82475e98081894db";//My personal torreGgId
$(document).ready(function () {

    $("#searchInput").keyup(function(e) {
        if (e.which == 13) {
            $("#searchButton").click();
        }
    });

    $('#searchButton').click(function () {
        let searchQueryData = {
            query: $('#searchInput').val(),
            torreGgId: loggedUserGgId,
            limit:10,
            identityType:"person",
            meta:false,
            excluding:[],
            excludedPeople:[],
            excludeContacts:true
        }
        fetch('https://torre-technical-test.onrender.com/api/users/search/', {
            method: 'POST',
            body: JSON.stringify(searchQueryData),
            headers: {
                "Content-type": "application/json"
            }
        }).then((response) => response.json()).then(function (responseJSON) {
            console.log(responseJSON);
            displaySearchResults(responseJSON.data);
        });
    });

    $('#topQueriesButton').click(function () {
        fetch('https://torre-technical-test.onrender.com/api/users/getTopQueries/', {
            method: 'GET'
        }).then((response) => response.json()).then(function (responseJSON) {
            console.log(responseJSON);
            displayTopQueries(responseJSON.data);
        });
    });

    $("#results").on("click", ".addToFavorites", function(e){
        const ids = e.target.id.split("-"); 
        const favoriteData = {
            userTorreGgId: ids[0],
            favoriteUserTorreGgId: ids[1]
        }
        let requestMethod = '';
        if(ids[2]=="true") requestMethod = 'DELETE';
        else requestMethod = 'POST';
        fetch('https://torre-technical-test.onrender.com/api/users/favorites/', {
            method: requestMethod,
            body: JSON.stringify(favoriteData),
            headers: {
                "Content-type": "application/json"
            }
        }).then((response) => response.json()).then(function (responseJSON) {
            console.log(responseJSON);
            $("#searchButton").click();
        });
    });

    /**
     * Displays the search results on the webpage.
     *
     * @param {object} data - The search results data.
     */
    function displaySearchResults(data) {
        $('#results').empty();
        data.results.forEach(function (person) {
            let btnClass, btnText;

            if(data.userFavorites.includes(person.ggId)){
                btnText = "In Favorites";
                btnClass = "btn-warning";
            }else{
                btnText = "Add from Favorites";
                btnClass = "btn-outline-warning";
            }
             
            const resultHtml = `
                <div class="card mb-3">
                    <div class="card-header">
                        <div class="float-right">
                            <button class="btn ${btnClass} btn-sm addToFavorites" data-toggle="tooltip" data-placement="top" title="${btnText}" id="${loggedUserGgId}-${person.ggId}-${data.userFavorites.includes(person.ggId)}">
                                ${btnText}
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <img class="col-md-3" src="${person.imageUrl}" alt="${person.name}" width="100"  class="img-thumbnail">
                            <div class="col-md-9">
                                <div class="row">
                                    <h5 class="card-title">${person.name}</h5>
                                </div>
                                <div class="row">
                                    <p class="card-text">${person.professionalHeadline}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('#results').append(resultHtml);
        });
    }

    /**
     * Display the top queries in the results section.
     *
     * @param {Array} data - The array of query objects containing query and count.
     * @return {undefined} This function does not return a value.
     */
    function displayTopQueries(data) {
        $('#results').empty();
        data.forEach(function (query) {
            const resultHtml = `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12 p-4">
                                <div class="row">
                                    <h5 class="card-title">Query: ${query.query}</h5>
                                </div>
                                <div class="row">
                                    <p class="card-text">Count: ${query.count}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('#results').append(resultHtml);
        });
    }
});