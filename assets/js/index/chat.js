"use strict";
$ = jQuery;

document.addEventListener("DOMContentLoaded", () => {
  // ========== CHAT TOGGLE ==========
  const chatRoot = document.querySelector("#chat-ai");
  if (!chatRoot) return;

  const chatButton = chatRoot.querySelector(".chat-button");
  const chatContainer = chatRoot.querySelector(".chat-container");
  const closeChatButton = chatRoot.querySelector(".close-chat");

  if (!chatButton || !chatContainer || !closeChatButton) return;

  const toggleChat = (e) => {
    e.stopPropagation();
    chatContainer.classList.toggle("active");
  };

  const closeChat = () => {
    chatContainer.classList.remove("active");
  };

  chatButton.addEventListener("click", toggleChat);
  closeChatButton.addEventListener("click", closeChat);

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

  // ========== CHAT AI FUNCTIONS ==========
  const apiKey = "AIzaSyC63x6MDMzfKSqlThu2UbGGUB0Hp1eqbkc";
  const API_ENDPOINT =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  let SYSTEM_PROMPT = "";
  let conversationHistory = [];

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  async function loadRules() {
    try {
      const hostname = window.location.origin;
      const response = await fetch(
        `${hostname}/wp-content/themes/menas/assets/rule/rule.txt`
      );
      const rulesContent = await response.text();

      SYSTEM_PROMPT = `Bạn là trợ lý AI chính thức của website này. 

THÔNG TIN WEBSITE (từ rule.txt):
${rulesContent}

NHIỆM VỤ CỦA BẠN:
- Trả lời các câu hỏi DỰA TRÊN THÔNG TIN TRONG rule.txt
- Đóng vai là đại diện chính thức của website, hiểu rõ tất cả thông tin về sản phẩm/dịch vụ và mọi thông tin của website từ rule.txt
- Nếu được hỏi về thông tin KHÔNG CÓ trong rule.txt, hãy lịch sự nói rằng bạn chưa có thông tin đó và nên nói ra thông tin liên hệ với công ty
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

      addMessage(getWelcomeMessage(false), "ai");
    } catch (error) {
      console.error("Không thể đọc file rule.txt:", error);
      SYSTEM_PROMPT = `Bạn là trợ lý AI thân thiện và đa ngôn ngữ. 
- TỰ ĐỘNG PHÁT HIỆN ngôn ngữ của người dùng và TRẢ LỜI BẰNG CHÍNH NGÔN NGỮ ĐÓ
- KHÔNG dùng emoji hoặc icon
- Trả lời câu hỏi một cách hữu ích và lịch sự bằng bất kỳ ngôn ngữ nào`;

      addMessage(getWelcomeMessage(true), "ai");
    }
  }

  function getWelcomeMessage(isFallback = false) {
    const lang = (
      document.documentElement.getAttribute("lang") || ""
    ).toLowerCase();

    const messages = {
      vi: {
        normal:
          "Xin chào! Tôi là trợ lý ảo của website Menas Group. Tôi có thể giúp gì cho bạn hôm nay?",
        fallback:
          "Xin chào! Tôi là trợ lý AI đa ngôn ngữ. Tôi có thể giúp gì cho bạn?"
      },
      en: {
        normal:
          "Hello! I'm the AI assistant of Menas Group. How may I help you today?",
        fallback: "Hello! I am a multilingual AI assistant. How may I help you?"
      },
      zh: {
        normal: "您好！我是 MenasGroup 网站的AI助手。请问有什么可以帮助您？",
        fallback: "您好！我是多语言AI助手。我能为您做些什么？"
      }
    };

    let key = "vi";
    if (lang.startsWith("en")) key = "en";
    if (lang.startsWith("zh")) key = "zh";

    return isFallback ? messages[key].fallback : messages[key].normal;
  }

  function addMessage(text, type) {
    const messagesDiv = document.getElementById("chatMessages");
    if (!messagesDiv) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";

    if (type === "ai") {
      text = removeMarkdown(text);
    }

    contentDiv.textContent = text;

    const timeDiv = document.createElement("div");
    timeDiv.className = "message-time";
    timeDiv.textContent = getCurrentTime();

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    messagesDiv.appendChild(messageDiv);

    if (type === "ai") {
      requestAnimationFrame(() => {
        messageDiv.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => {
          messagesDiv.scrollTop -= 20;
        }, 300);
      });
    } else {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }

  function removeMarkdown(text) {
    let cleanText = text
      .replace(/^#{1,6}\s+(.+)$/gm, "$1\n")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      .replace(/~~(.+?)~~/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .replace(/!\[.*?\]\(.+?\)/g, "")
      .replace(/^\s*[\*\-\+]\s+(.+)$/gm, "• $1")
      .replace(/^\s*(\d+)\.\s+(.+)$/gm, "$1. $2")
      .replace(/^>\s+/gm, "")
      .replace(/^[\-\*_]{3,}$/gm, "")
      .trim();

    cleanText = cleanText
      .replace(/[\u{1F600}-\u{1F64F}]/gu, "")
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
      .replace(/[\u{1F700}-\u{1F77F}]/gu, "")
      .replace(/[\u{1F780}-\u{1F7FF}]/gu, "")
      .replace(/[\u{1F800}-\u{1F8FF}]/gu, "")
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
      .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "")
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "")
      .replace(/[\u{2600}-\u{26FF}]/gu, "")
      .replace(/[\u{2700}-\u{27BF}]/gu, "")
      .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "")
      .replace(/[\u{E0020}-\u{E007F}]/gu, "")
      .trim();

    return cleanText;
  }

  function showTyping() {
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) {
      typingIndicator.classList.add("active");
      const messagesDiv = document.getElementById("chatMessages");
      if (messagesDiv) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    }
  }

  function hideTyping() {
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) {
      typingIndicator.classList.remove("active");
    }
  }

  async function sendMessage() {
    const input = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");

    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    conversationHistory.push({
      role: "user",
      parts: [{ text: message }]
    });

    showTyping();
    if (sendBtn) sendBtn.disabled = true;
    input.disabled = true;

    try {
      const contents = [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }]
        },
        ...conversationHistory
      ];

      const response = await fetch(`${API_ENDPOINT}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      });

      const data = await response.json();
      hideTyping();

      if (data.candidates && data.candidates[0]) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        addMessage(aiResponse, "ai");

        conversationHistory.push({
          role: "model",
          parts: [{ text: aiResponse }]
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

    if (sendBtn) sendBtn.disabled = false;
    input.disabled = false;
    input.focus();
  }

  // ========== EVENT LISTENERS ==========
  const sendBtn = document.getElementById("sendBtn");
  const chatInput = document.getElementById("chatInput");

  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    });
  }

  // Load rules khi page ready
  loadRules();
});
