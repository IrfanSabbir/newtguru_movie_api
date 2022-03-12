const Movie = require('../model/movie')
const axios = require('axios');

exports.createMovie = async (req, res) => {
  try {
    if (req.userData.role === 'basic') {

      const date = new Date();
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await Movie.countDocuments({
        userId: req.userData.userId,
        $and: [
          { createdAt: { $gt: startDate } },
          { createdAt: { $lt: endDate } },
        ]
      });
      
      if (count > 4) {
        throw new Error("Your Monthly Limit Ended.")
      }
    }

    const isExist = await Movie.countDocuments({
      title: req.body.title,
    });

    if (isExist) {
      throw new Error("Movie already exist in the server.")
    }
    const omdbApi = `http://www.omdbapi.com/?t=${req.body.title}&apikey=${process.env.apikey}`;
    const result = await axios.get(omdbApi);

    if (result.data['Response'] === 'True') {

      const movie = new Movie({
        title: result.data['Title'],
        genre: result.data['Genre'],
        released: result.data['Released'],
        director: result.data['Director'],
        userId: req.userData.userId
      })

      await movie.save();

      res.status(200).json({
        message: "Movie info created",
        body: movie,
        error: false
      });

    } else {
      throw new Error(result.data['Error']);
    }
  } catch (error) {
    res.status(400).json({
      status: "try again please.",
      message: error.message,
      body: {},
      error: true
    })
  }
}

exports.fetchMovies = async (req, res) => {
  try {
    const movies = await Movie.find({
      userId: req.userData.userId,
    });

    res.status(200).json({
      message: "Movie List",
      body: movies,
      error: false
    });

  } catch (error) {

    res.status(400).json({
      message: error.message,
      body: [],
      error: true
    })
  }
}
