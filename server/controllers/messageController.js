import openai from "../configs/openai.js";
import Chat from "../models/chat-model.js";

// Text-Based AI Chat Message Controllers
export const generateTextMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };
    res.json({ success: true, reply });

    chat.messages.push(reply);
    await chat.save();

    await Chat.updateOne({ _id: userId }, { $inc: { credits: -1 } });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// Image-Based AI Chat Message Controllers
export const generateImageMessage = async (req, res) => {
try {
        const userId = req.user._id
        if(req.user.credits < 2){
            return res.json({success:false, message: "You don't have enough credits to use this feature."})
        }

        const {chatId, prompt, isPublished} = req.body
        const chat = await Chat.findOne({userId, _id: chatId})

        chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

} catch (error) {
    return res.json({ success: false, message: error.message });
}    
}