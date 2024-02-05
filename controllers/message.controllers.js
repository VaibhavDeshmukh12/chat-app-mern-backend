const Message = require("../model/message.model");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully" });

    return res.json({ msg: "Failed to add message to the database" });
  } catch (error) {
    next(error);
  }
};

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    // console.log("req.body: ",req.body);

    const messages = await Message.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: 1 });

    // console.log("--> ",messages);

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    // console.log(projectedMessages);
    res.json(projectedMessages);

  } catch (ex) {
    next(ex);
  }
};
