// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!

  // get the query string parameters
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre

  //create a new object that consists of number of results and array of movie objects
  let returnValue = {
    numResults: 0,
    movies: []
  }
  //return error message if either year or genre is undefined
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Error! You must define year and genre to proceed.` // a string of data
    }
  }
  //if year and genre is defined, require the API to pass 2 query string parameters and 
  // then provide results for the given year and genre 
  else {
    //use a for loop to go through the movies csv data, seeing if it matches the query string
    //parameter. if it does, add it to the list
    //if genre or run time is equal to \\N, we ignore this result
    for (let i=0; i < moviesFromCsv.length; i++) {

      //store each movie in memory
      let movie = moviesFromCsv[i]

      //Create new movie object containing the necessary fields
      let movieObject = {
        title: movie.primaryTitle,
        releaseYear: movie.startYear,
        genres: movie.genres
      }
      // we only include if genre and runtime is NOT equal to \\N AND if the genre/year match
      // the parameters
      if(movie.genres != `\\N` && movie.runtimeMinutes != `\\N` && 
        movie.genres.includes(genre) && movie.startYear == year){

        //add one to the count of results
        returnValue.numResults = returnValue.numResults + 1

        //add the movie to the list of movies to return
        returnValue.movies.push(movieObject)
     }
    }
  }
  // a lambda function returns a status code and a string of data
  return {
    statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    body: JSON.stringify(returnValue) // a string of data
  }
}