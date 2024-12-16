const express = require('express');
const footballTeam = require('./footballSchema');
const connectDB = require('./db');
 
const app = express();
app.use(express.json());
connectDB();
app.use(express.json());
const cors = require('cors');
app.use(cors());  // This enables CORS for all routes


  // Route to find all records
  app.get('/records', async (req, res) => {
    try {
      const records = await footballTeam.find();
      res.status(200).json(records);
    } catch (error) {
      res.status(500).send("Error retrieving records: " + error.message);
    }
  });
  
  app.get('/records/:team', async(req,res) => {
    try{
        const teamName = req.params.team;
        const records = await footballTeam.findOne({team:teamName});
        if(!records){
            return res.status(404).send("Record not found");
        }
        res.status(200).json(records);
    } catch (error){
        res.status(500).send("Error retrieveing records: " + error.message);
    }
  });
  app.post('/add-team', async (req, res) => {
    try {
      const newRecord = new footballTeam(req.body); // Create a new record
      const savedRecord = await newRecord.save();  // Save the record to the database
      res.status(201).json(savedRecord); // Return the saved record with a 201 status code
    } catch (error) {
      console.error("Error creating record:", error); 
      res.status(500).send("Error creating record: " + error.message); // Handle errors
    }
  });

  //update method
  app.put('/update', async (req, res) => {
    try{
          const UpdateTeam = await footballTeam.findOneAndUpdate(
            {team:req.body.team},
            req.body, {new: true}
          );
          console.log('Updated team:', UpdateTeam); //log for the result
          if(!UpdateTeam){
            return res.status(404).json('team not found');
          }

          res.status(200).json(UpdateTeam);
        } catch (error){
          console.error('Error updating team:', error)
          res.status(500).send("Error updating team: " + error.message);
        }
    });

//delete method
app.post('/delete' , async (req,res) => {
  try{
   const DeleteTeam  = await footballTeam.findOneAndDelete(
    {team: req.body.team},
    req.body, {new: true}
  );
  console.log('deleted teame: ' , DeleteTeam);
  if(!DeleteTeam){
    return res.status(404).json('team not found');
  }
  res.status(200).json(DeleteTeam);
} catch(error){
  console.error('Error updating team:', error)
  res.status(500).send("Error updating team: " + error.message);
}
});

//stats method
app.get('/stats/:year', async (req, res) => {
  const { year } = req.params; // Get the year from the request parameters

  // Ensure the year is provided
  if (!year) {
    return res.status(400).send("Invalid year provided");
}


  try {
      // Aggregate data by summing games_played, draw, and win for the given year
      const stats = await footballTeam.aggregate([
          { $match: { year: parseInt(year) } }, // Match records for the specific year
          {
              $group: {
                  _id: null, // Grouping by null as we're interested in the overall totals
                  totalGamesPlayed: { $sum: '$games_played' },
                  totalDraws: { $sum: '$draw' },
                  totalWins: { $sum: '$win' }
              }
          }
      ]);

      if (stats.length === 0) {
          return res.status(404).json({ message: 'No stats found for this year' });
      }

      // Return the aggregated results
      res.status(200).json(stats[0]);
  } catch (error) {
      console.error('Error fetching team stats:', error);
      res.status(500).json({ message: 'Server error, please try again' });
  }
});


  //top 10 teams
  app.get('/top-teams', async (req , res) => {
    
    try {
      const TopTeams = await footballTeam.find() //fetching data
      .sort({win: -1}) //sorting teams by wins 
      .limit(10); //limits to only 10 teams

      if (TopTeams.length === 0) {
        return res.status(404).json({message: 'No teams found'});
      }

      res.status(200).json(TopTeams); 

    } catch(error) {
      console.error('Error fetching top teams:', error);
      res.status(500).json({message: 'Server error, please try again'});
    }

  });

//average goals
app.get('/avg-goals/:year', async (req, res) => {
  try {
    let year = parseInt(req.params.year);
    const result = await footballTeam.aggregate([
      {$match: {year: year}},
      {$group: {
        _id:'$team',
        team: {$first: '$team'},
        games_played: {$sum: '$games_played'},
        win: {$sum: '$win'},
        draw: {$sum: '$draw'},
        loss: {$sum: '$loss'},
        goals_for: {$sum: '$goals_for'},
        avg_goals_for: {$avg: '$goals_for'},
        goals_against: {$sum: '$goals_against'},
        points: {$sum: '$points'},
        year: {$first: '$year'}
      }}
    ]);
    res.status(200).json({'Average': result})
  }
  catch (error){
    res.status(400).json(error);
  }
})

  

  
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });