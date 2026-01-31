import client from "../configs/imagekit.js";
import openai from "../configs/openai.js";
import Chat from "../models/chat-model.js";
import axios from "axios"

// Text-Based AI Chat Message Controllers
export const generateTextMessage = async (req, res) => {
  try {
    const userId = req.user._id;
           if(req.user.credits < 1){
            return res.json({success:false, message: "You don't have enough credits to use this feature."})
        }
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

    // Encode the prompt
    const encodedPrompt = encodeURIComponent(prompt)

    // Construct imagekit ai generation url
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/aeragpt/${Date.now()}.png?tr=w-800,h-800`

    // Trigger generation by fetching from imagekit
    const aiImageResponse = await axios.get(generatedImageUrl, {responseType: "arraybuffer"})

    // Convert to base64
    const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`

    // Upload to imagekit media library
    const uploadResponse = await client.upload({
        file: base64Image,
        filename: `${Date.now()}.png`,
        folder: "aeragpt"
    })

        const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished
    };

    chat.messages.push(reply)
    await chat.save()
        await Chat.updateOne({ _id: userId }, { $inc: { credits: -2 } });
    res.json({ success: true, reply });

} catch (error) {
    return res.json({ success: false, message: error.message });
}    
}