document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra toàn bộ các phần tử cần thiết
  const chatRoot = document.querySelector("#chat-ai");
  if (!chatRoot) return;

  const chatButton = chatRoot.querySelector(".chat-button");
  const chatContainer = chatRoot.querySelector(".chat-container");
  const closeChatButton = chatRoot.querySelector(".close-chat");

  // Kiểm tra null trước khi dùng
  if (!chatButton || !chatContainer || !closeChatButton) return;

  // Mở/đóng chat
  const toggleChat = (e) => {
    e.stopPropagation();
    chatContainer.classList.toggle("active");
  };

  const closeChat = () => {
    chatContainer.classList.remove("active");
  };

  // Gắn sự kiện
  chatButton.addEventListener("click", toggleChat);
  closeChatButton.addEventListener("click", closeChat);

  // Đóng khi click ngoài
  document.addEventListener("click", (e) => {
    const isClickInside =
      chatContainer.contains(e.target) || chatButton.contains(e.target);
    if (!isClickInside && chatContainer.classList.contains("active")) {
      closeChat();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chatContainer.classList.contains("active")) {
      closeChat();
    }
  });

  chatContainer.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

const apiKey = "AIzaSyC63x6MDMzfKSqlThu2UbGGUB0Hp1eqbkc";
const API_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

let SYSTEM_PROMPT = "";
let conversationHistory = [];

// Hàm lấy thời gian hiện tại
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Đọc file rule.txt khi trang load
async function loadRules() {
  try {
    const response = await fetch("./assets/rule/rule.txt");
    const rulesContent = await response.text();

    // Tạo system prompt với thông tin từ rule.txt và hỗ trợ đa ngôn ngữ
    SYSTEM_PROMPT = `Bạn là trợ lý AI chính thức của website này. 

THÔNG TIN WEBSITE (từ rule.txt):
${rulesContent}

NHIỆM VỤ CỦA BẠN:
- Trả lời các câu hỏi DỰA TRÊN THÔNG TIN TRONG rule.txt
- Đóng vai là đại diện chính thức của website, hiểu rõ tất cả thông tin về sản phẩm/dịch vụ
- Nếu được hỏi về thông tin KHÔNG CÓ trong rule.txt, hãy lịch sự nói rằng bạn chưa có thông tin đó
- TUYỆT ĐỐI không trả lời các thông tin không liên quan đến website
- QUAN TRỌNG: TỰ ĐỘNG PHÁT HIỆN NGÔN NGỮ của người dùng và TRẢ LỜI BẰNG CHÍNH NGÔN NGỮ ĐÓ
  + Nếu họ hỏi bằng Tiếng Việt → Trả lời bằng Tiếng Việt
  + Nếu họ hỏi bằng English → Reply in English
  + Nếu họ hỏi bằng 中文 → 用中文回答
  + Nếu họ hỏi bằng 日本語 → 日本語で答える
  + Nếu họ hỏi bằng 한국어 → 한국어로 대답
  + Và hỗ trợ tất cả các ngôn ngữ khác tương tự
- KHÔNG dùng emoji hoặc icon trong câu trả lời
- Trả lời một cách tự nhiên, chuyên nghiệp nhưng thân thiện
- Luôn hướng người dùng đến các tính năng/dịch vụ của website khi phù hợp

Phong cách: Chuyên nghiệp, đa ngôn ngữ linh hoạt, am hiểu sâu về website, nhiệt tình hỗ trợ khách hàng toàn cầu.`;

    // Hiển thị thông báo đa ngôn ngữ
    addMessage(
      "Xin chào! Tôi là trợ lý ảo của website MenasGroup. Tôi có thể giúp gì cho bạn hôm nay?",
      "ai"
    );
  } catch (error) {
    console.error("Không thể đọc file rule.txt:", error);
    SYSTEM_PROMPT = `Bạn là trợ lý AI thân thiện và đa ngôn ngữ. 
- TỰ ĐỘNG PHÁT HIỆN ngôn ngữ của người dùng và TRẢ LỜI BẰNG CHÍNH NGÔN NGỮ ĐÓ
- KHÔNG dùng emoji hoặc icon
- Trả lời câu hỏi một cách hữu ích và lịch sự bằng bất kỳ ngôn ngữ nào`;
    addMessage(
      "Xin chào! Tôi là trợ lý AI đa ngôn ngữ. Tôi có thể giúp gì cho bạn?",
      "ai"
    );
  }
}

// Gọi hàm load rules khi trang load
window.addEventListener("DOMContentLoaded", loadRules);

function addMessage(text, type) {
  const messagesDiv = document.getElementById("chatMessages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";

  // Xóa markdown nếu là tin nhắn từ AI
  if (type === "ai") {
    text = removeMarkdown(text);
  }

  contentDiv.textContent = text;

  // Thêm thời gian
  const timeDiv = document.createElement("div");
  timeDiv.className = "message-time";
  timeDiv.textContent = getCurrentTime();

  messageDiv.appendChild(contentDiv);
  messageDiv.appendChild(timeDiv);
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeMarkdown(text) {
  // Xóa các ký hiệu markdown
  let cleanText = text
    // Xóa header (# ## ###) và xuống dòng
    .replace(/^#{1,6}\s+(.+)$/gm, "$1\n")
    // Xóa bold (**text** hoặc __text__)
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    // Xóa italic (*text* hoặc _text_)
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    // Xóa strikethrough (~~text~~)
    .replace(/~~(.+?)~~/g, "$1")
    // Xóa code inline (`code`)
    .replace(/`(.+?)`/g, "$1")
    // Xóa code block (```code```)
    .replace(/```[\s\S]*?```/g, "")
    // Xóa link [text](url)
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    // Xóa image ![alt](url)
    .replace(/!\[.*?\]\(.+?\)/g, "")
    // Giữ bullet points và xuống dòng
    .replace(/^\s*[\*\-\+]\s+(.+)$/gm, "• $1")
    // Giữ numbered list và xuống dòng
    .replace(/^\s*(\d+)\.\s+(.+)$/gm, "$1. $2")
    // Xóa blockquote (>)
    .replace(/^>\s+/gm, "")
    // Xóa horizontal rule (---, ___, ***)
    .replace(/^[\-\*_]{3,}$/gm, "")
    // Trim whitespace
    .trim();

  // Xóa emoji và icon (Unicode emoji ranges)
  cleanText = cleanText
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, "") // Symbols & Pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // Transport & Map
    .replace(/[\u{1F700}-\u{1F77F}]/gu, "") // Alchemical Symbols
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, "") // Geometric Shapes
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, "") // Supplemental Arrows-C
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, "") // Supplemental Symbols
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "") // Chess Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "") // Symbols and Pictographs Extended-A
    .replace(/[\u{2600}-\u{26FF}]/gu, "") // Miscellaneous Symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, "") // Dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "") // Variation Selectors
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "") // Regional Indicator Symbols (flags)
    .replace(/[\u{E0020}-\u{E007F}]/gu, "") // Tags
    .trim();

  return cleanText;
}
function showTyping() {
  document.getElementById("typingIndicator").classList.add("active");
  const messagesDiv = document.getElementById("chatMessages");
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function hideTyping() {
  document.getElementById("typingIndicator").classList.remove("active");
}
async function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  // Thêm tin nhắn vào lịch sử
  conversationHistory.push({
    role: "user",
    parts: [{ text: message }],
  });
  showTyping();
  document.getElementById("sendBtn").disabled = true;
  input.disabled = true;

  try {
    // Tạo contents với system prompt và lịch sử hội thoại
    const contents = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      ...conversationHistory,
    ];

    const response = await fetch(`${API_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();
    hideTyping();
    if (data.candidates && data.candidates[0]) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      addMessage(aiResponse, "ai");

      // Thêm phản hồi của AI vào lịch sử
      conversationHistory.push({
        role: "model",
        parts: [{ text: aiResponse }],
      });
    } else if (data.error) {
      addMessage("Lỗi: " + data.error.message, "ai");
    } else {
      addMessage("Không thể nhận được phản hồi từ AI", "ai");
    }
  } catch (error) {
    hideTyping();
    addMessage("Lỗi kết nối: " + error.message, "ai");
  }

  document.getElementById("sendBtn").disabled = false;
  input.disabled = false;
  input.focus();
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}
