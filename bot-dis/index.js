import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { Ollama } from "@langchain/ollama";
import ollama from 'ollama';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const llm = new Ollama({
  baseUrl: "http://localhost:11434"
});

// Hàm gọi AI
async function askAI(userMessage) {
  try {
    console.log("🚀 Gửi đến AI:", userMessage);
    const response = await ollama.chat({
      model: "deepseek-r1:latest",
      messages: [
        {role: "user", content: userMessage}
      ],
      options: {
        temperature: 0.5,        // Độ sáng tạo
        top_k: 20,               // Lọc ra 20 token có xác suất cao nhất
        top_p: 0.9,              // Giới hạn xác suất tích lũy
        min_p: 0.0,              // Xác suất tối thiểu của một token
        typical_p: 0.7,          // Xác suất chọn token phổ biến
        repeat_last_n: 33,       // Tránh lặp lại n token cuối
        repeat_penalty: 1.2,     // Phạt lặp từ
        frequency_penalty: 1.0,  // Giảm xác suất của các từ lặp lại nhiều
        num_ctx: 1024,           // Kích thước context
        num_batch: 2,            // Kích thước batch
        num_gpu: 1, 
        main_gpu: 0,
        low_vram: false,         // Không bật chế độ tiết kiệm VRAM
        vocab_only: false,       // Không chỉ lấy từ vựn
        num_predict: 200,
        seed: 42,
        mirostat: 2,
        mirostat_tau: 5.0,
        mirostat_eta: 0.6,
      },
    });

    return response;
  } catch (error) {
    console.error("Lỗi Ollama:", error);
    return "Bot phản hồi chậm, hãy thử lại!";
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (!msg.mentions.has(client.user)) return;

  const userMessage = msg.content.replace(/<@\d+>/g, "").trim();

  try {
    const response = await askAI(userMessage);
    if (!response || response === "") {
      throw new Error("No response from AI");
    } 
    console.log("🚀 Phản hồi từ AI:", response);
    await msg.channel.send(response.message.content);
  }
  catch (error) {
    console.error("Lỗi khi lấy phản hồi từ Ollama:", error);
    await msg.channel.send("Bot gặp lỗi, hãy thử lại sau!");
  }
});

client.login(process.env.TOKEN)