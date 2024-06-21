const User = require("./models/User");
const Poll = require("./models/Poll");

const getOverallVoteCounts = async () => {
  try {
    const result = await Poll.aggregate([
      { $unwind: "$votes" },  // Unwind the votes array
      {
        $group: {
          _id: "$optionSelected",  // Group by the optionSelected field
          count: { $sum: 1 }  // Count occurrences of each optionSelected
        }
      },
      {
        $project: {
          _id: 0,
          optionSelected: "$_id",  // Rename _id to optionSelected
          count: 1  // Include the count field
        }
      }
    ]);

    let pollData = { Java: 0, Javascript: 0, Python: 0 };
    result.forEach(option => {
      pollData[option.optionSelected] = option.count;
    });
    return pollData;
  } catch (err) {
    console.error('Error in getOverallVoteCounts:', err);
    throw err;
  }
};


const vote = async (data) => {
  try {
    const { username, option } = data;
    // Check if the user already exists
    let pollData = { Java: 0, Javascript: 0, Python: 0 };
    let pollFlag = false;
    let user = await User.findOne({ username });

    if (user) {
      // If user exists, check if the provided password matches
      const previousVote = await Poll.find({ userId: user._id });

      if (previousVote.length > 0) {
        await Poll.deleteMany({
          userId: user._id,
        });
        pollFlag = true;
      }
      if (pollFlag == false && previousVote?.optionSelected == option) {
        pollData[option] = 1;
        await poll.updateOne(
          {
            _id: previousVote._id,
          },
          { $set: { votes: pollData } }
        );
      } else {
        pollFlag = true;
        pollData[option] = 1;
        let newPoll = new Poll({
          userId: user._id,
          votes: pollData,
          optionSelected: option,
        });
        await newPoll.save();
      }
      let data = await getOverallVoteCounts();
      return data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};


module.exports={
  getOverallVoteCounts,
  vote
}