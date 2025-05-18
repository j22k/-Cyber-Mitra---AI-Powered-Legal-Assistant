/**
 * Chat functionality
 */

// DOM Elements
const messagesContainer = document.getElementById('messages-container');
const chatInputContainer = document.getElementById('chat-input-container');
const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message');
const startNewChatBtn = document.getElementById('start-new-chat');
const newChatBtn = document.querySelector('.new-chat-btn');
const typingIndicator = document.getElementById('typing-indicator');
const welcomeScreen = document.getElementById('welcome-screen');
const chatHistory = document.getElementById('chat-history');
const webSearchBtn = document.getElementById('web-search-btn');

// Sample data for chat history
const sampleChats = [
    { id: 1, title: "Property law questions", timestamp: "2 hours ago", preview: "What are my rights as a tenant?" },
    { id: 2, title: "Contract review assistance", timestamp: "Yesterday", preview: "Can you help me understand this NDA?" },
    { id: 3, title: "Employment law advice", timestamp: "3 days ago", preview: "What are the legal working hours?" },
    { id: 4, title: "Copyright infringement", timestamp: "1 week ago", preview: "Someone is using my work without permission" },
    { id: 5, title: "Starting a business", timestamp: "2 weeks ago", preview: "What legal structure should I choose?" }
];

// Sample responses for demo
const sampleResponses = [
    "Based on property law in most jurisdictions, as a tenant, you generally have the right to: (1) Habitable living conditions, (2) Privacy and quiet enjoyment, (3) Security deposit protection, (4) Proper notice before landlord entry, and (5) Protection against unlawful eviction. Would you like me to elaborate on any of these specific rights?",
    
    "After analyzing your NDA, I've identified several important clauses: (1) The confidentiality period extends 5 years beyond termination, (2) It includes a non-solicitation clause preventing you from hiring their employees for 2 years, (3) There's a unilateral attorney fee provision that may be problematic. Would you like me to explain any of these in more detail?",
    
    "Legal working hours vary by jurisdiction, but generally: (1) Standard workweek is 40 hours in most places, (2) Overtime rules typically apply after 40 hours per week, (3) Rest breaks are mandated in many jurisdictions. Is there a specific country or state whose laws you're interested in?",
    
    "For copyright infringement cases, you typically have these options: (1) Send a cease and desist letter, (2) File a DMCA takedown notice if online, (3) Register your copyright if you haven't already, (4) Pursue mediation or arbitration, or (5) File a lawsuit for damages. Would you like more information about any of these steps?"
];

// Current chat state
let currentChatId = null;
let isWebSearchActive = false;

/**
 * Populate chat history with sample data
 */
function populateChatHistory() {
    chatHistory.innerHTML = '';
    
    sampleChats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.dataset.id = chat.id;
        chatItem.innerHTML = `
            <div class="chat-icon">
                <i class="fas fa-comment"></i>
            </div>
            <div class="chat-info">
                <div class="chat-title">${chat.title}</div>
                <div class="chat-timestamp">${chat.timestamp}</div>
            </div>
        `;
        
        chatItem.addEventListener('click', () => loadChat(chat.id));
        chatHistory.appendChild(chatItem);
    });
}

/**
 * Load a chat from history
 * @param {number} chatId - ID of the chat to load
 */
function loadChat(chatId) {
    // Remember current chat ID
    currentChatId = chatId;
    
    // Remove active class from all chat items
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected chat
    const selectedChat = document.querySelector(`.chat-item[data-id="${chatId}"]`);
    if (selectedChat) {
        selectedChat.classList.add('active');
    }
    
    // Update chat title
    const chat = sampleChats.find(c => c.id === chatId);
    if (chat) {
        document.querySelector('.chat-title-text').textContent = chat.title;
    }
    
    // Hide welcome screen, show messages and input
    welcomeScreen.style.display = 'none';
    messagesContainer.style.display = 'flex';
    chatInputContainer.style.display = 'block';
    
    // Clear messages container
    messagesContainer.innerHTML = '';
    
    // Add sample messages for demo
    if (chatId >= 1 && chatId <= 4) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message outgoing';
        userMessage.innerHTML = `
            <div class="message-avatar user-message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${sampleChats[chatId-1].preview}</div>
                <div class="message-info">
                    <span>12:05 PM</span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(userMessage);
        
        // Add bot response
        const botMessage = document.createElement('div');
        botMessage.className = 'message';
        botMessage.innerHTML = `
            <div class="message-avatar bot-avatar">
                <i class="fas fa-scale-balanced"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${sampleResponses[chatId-1]}</div>
                <div class="message-info">
                    <span>12:06 PM</span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(botMessage);
    }
    
    // Scroll to bottom of messages
    scrollToBottom();
    
    // Hide sidebar on mobile after selection
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

/**
 * Start a new chat
 */
function startNewChat() {
    // Set current chat ID to null for new chat
    currentChatId = null;
    
    // Remove active class from all chat items
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Update chat title
    document.querySelector('.chat-title-text').textContent = 'New Conversation';
    
    // Hide welcome screen, show messages and input
    welcomeScreen.style.display = 'none';
    messagesContainer.style.display = 'flex';
    chatInputContainer.style.display = 'block';
    
    // Clear messages container
    messagesContainer.innerHTML = '';
    
    // Add welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message';
    welcomeMessage.innerHTML = `
        <div class="message-avatar bot-avatar">
            <i class="fas fa-scale-balanced"></i>
        </div>
        <div class="message-content">
            <div class="message-text">
                <p>Hello! I'm your AI-powered legal assistant. How can I help you today?</p>
                <p>You can ask me about:</p>
                <ul style="margin-top: 10px; margin-left: 20px;">
                    <li>Understanding legal procedures</li>
                    <li>Finding relevant laws and provisions</li>
                    <li>Guidance on legal rights and obligations</li>
                    <li>Explanation of legal terminology</li>
                </ul>
            </div>
            <div class="message-info">
                <span>Just now</span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(welcomeMessage);
    
    // Focus on input
    messageInput.focus();
    
    // Hide sidebar on mobile after selection
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

/**
 * Send a message
 */
function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;
    
    // Create and append user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message outgoing';
    userMessage.innerHTML = `
        <div class="message-avatar user-message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${message}</div>
            <div class="message-info">
                <span>${getCurrentTime()}</span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(userMessage);
    
    // Clear input
    messageInput.value = '';
    autoResizeTextarea();
    
    // Scroll to bottom of messages
    scrollToBottom();
    
    // Show typing indicator
    typingIndicator.style.display = 'flex';
    
    // Simulate bot response (for demo)
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        
        const botMessage = document.createElement('div');
        botMessage.className = 'message';
        
        // Generate a response based on mode
        let response;
        if (isWebSearchActive) {
            response = getWebSearchResponse(message);
        } else {
            response = getRandomResponse(message);
        }
        
        botMessage.innerHTML = `
            <div class="message-avatar bot-avatar">
                <i class="fas fa-scale-balanced"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${response}</div>
                <div class="message-info">
                    <span>${getCurrentTime()}</span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(botMessage);
        
        // Scroll to bottom of messages
        scrollToBottom();
        
        // If this was a new chat, add it to the history
        if (currentChatId === null) {
            addChatToHistory(message, response);
        }
    }, 1500);
}

/**
 * Get random response for regular chat mode
 * @param {string} message - User's message
 * @returns {string} AI response
 */
function getRandomResponse(message) {
    const legalResponses = [
        `Based on my understanding of your question about "${shortenText(message, 30)}", here's what the law typically provides: <br><br>The primary legal framework establishes that you have the right to due process and fair treatment. In most jurisdictions, this would require proper notification and an opportunity to address the situation. <br><br>Would you like me to search for more specific provisions related to your case?`,
        
        `Regarding your inquiry about "${shortenText(message, 30)}", I should note that this area of law can vary by jurisdiction. <br><br>Generally speaking, the standard approach involves: <br>1. Filing the appropriate documentation with the court <br>2. Providing notice to all relevant parties <br>3. Attending scheduled hearings <br>4. Following the court's procedural rules <br><br>Would you like me to elaborate on any of these steps?`,
        
        `Your question about "${shortenText(message, 30)}" touches on an important legal principle. <br><br>According to established precedent, this situation would typically be governed by statute rather than common law. The applicable provisions would likely include requirements for written documentation, proper notification periods, and potentially regulatory oversight. <br><br>I can search for more specific information if you provide your jurisdiction.`,
        
        `Regarding "${shortenText(message, 30)}", legal analysis suggests the following considerations: <br><br>First, determine whether this falls under civil or criminal proceedings, as the procedures differ significantly. Second, identify the statute of limitations that may apply. Third, assess whether alternative dispute resolution might be appropriate before pursuing formal legal action. <br><br>Can I help clarify any of these points further?`
    ];
    
    return legalResponses[Math.floor(Math.random() * legalResponses.length)];
}

/**
 * Get web search response mode
 * @param {string} message - User's message
 * @returns {string} Web search response
 */
function getWebSearchResponse(message) {
    return `<div style="padding: 10px; background-color: rgba(0,0,0,0.05); border-radius: 8px; margin-bottom: 15px;">
        <div style="font-weight: bold; margin-bottom: 5px;">Web Search Results for: "${shortenText(message, 40)}"</div>
        <div style="font-size: 0.9em;">Searching legal databases and web resources...</div>
    </div>
    
    Based on current legal databases and resources, here are the most relevant findings:
    
    <ol style="margin: 15px 0; padding-left: 20px;">
        <li><strong>Recent Legal Precedent:</strong> In the case of <em>Smith v. Johnson (2024)</em>, the court established that ${getRandomLegalPhrase()}.</li>
        <li><strong>Statutory Reference:</strong> According to Section 437(b) of the relevant code, ${getRandomLegalPhrase()}.</li>
        <li><strong>Legal Expert Opinion:</strong> The American Bar Association's latest guidance suggests that ${getRandomLegalPhrase()}.</li>
    </ol>
    
    Would you like me to search for more specific information or case law on this topic?`;
}

/**
 * Generate random legal phrases for demo
 * @returns {string} Random legal phrase
 */
function getRandomLegalPhrase() {
    const phrases = [
        "parties must establish clear evidence of intent before contracts may be enforced under these circumstances",
        "reasonable notice periods must be established prior to termination of agreement",
        "the doctrine of estoppel may apply when one party has relied on representations to their detriment",
        "alternative dispute resolution must be attempted before court proceedings in such matters",
        "proper jurisdiction must be established through the minimum contacts test",
        "implied warranties cannot be disclaimed in consumer transactions of this nature"
    ];
    
    return phrases[Math.floor(Math.random() * phrases.length)];
}

/**
 * Add a new chat to the history
 * @param {string} message - User's first message
 * @param {string} response - Bot's first response
 */
function addChatToHistory(message, response) {
    // Generate a new chat ID
    const newId = sampleChats.length + 1;
    
    // Create new chat object
    const newChat = {
        id: newId,
        title: shortenText(message, 30),
        timestamp: "Just now",
        preview: message
    };
    
    // Add to the beginning of the array
    sampleChats.unshift(newChat);
    
    // Update current chat ID
    currentChatId = newId;
    
    // Update chat title
    document.querySelector('.chat-title-text').textContent = newChat.title;
    
    // Repopulate chat history
    populateChatHistory();
    
    // Add active class to the new chat
    const newChatItem = document.querySelector(`.chat-item[data-id="${newId}"]`);
    if (newChatItem) {
        newChatItem.classList.add('active');
    }
}

/**
 * Toggle web search mode
 */
function toggleWebSearch() {
    isWebSearchActive = !isWebSearchActive;
    
    if (isWebSearchActive) {
        webSearchBtn.style.backgroundColor = '#a68657';
        messageInput.placeholder = "Ask Mitra...";
    } else {
        webSearchBtn.style.backgroundColor = '';
        messageInput.placeholder = "Ask Mitra...";
    }
    
    messageInput.focus();
}

/**
 * Auto-resize textarea based on content
 */
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = (messageInput.scrollHeight) + 'px';
}

/**
 * Handle Enter key press in textarea
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}
// File upload handling
const fileUpload = document.getElementById('file-upload');
const filePreview = document.getElementById('file-preview');
const fileName = document.getElementById('file-name');
const removeFile = document.getElementById('remove-file');
let uploadedFile = null;

// Handle file selection
fileUpload.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        uploadedFile = e.target.files[0];
        fileName.textContent = uploadedFile.name;
        filePreview.style.display = 'flex';
    }
});

// Handle file removal
removeFile.addEventListener('click', () => {
    uploadedFile = null;
    fileUpload.value = '';
    filePreview.style.display = 'none';
});

// Store original sendMessage function
const originalSendMessage = sendMessage;

// Override sendMessage function to include file handling
sendMessage = function() {
    if (uploadedFile) {
        // Here you would typically handle the file upload with your API
        console.log('Sending message with file:', uploadedFile);
        
        // For demo purposes, we'll just show a message about the file
        const message = messageInput.value.trim() || `I'm uploading ${uploadedFile.name}`;
        
        // Create and append user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message outgoing';
        userMessage.innerHTML = `
            <div class="message-avatar user-message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-text">
                    ${message}
                    <div class="uploaded-file">
                        <i class="fas fa-file-alt"></i> ${uploadedFile.name}
                    </div>
                </div>
                <div class="message-info">
                    <span>${getCurrentTime()}</span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(userMessage);
        
        // Clear input and file
        messageInput.value = '';
        uploadedFile = null;
        fileUpload.value = '';
        filePreview.style.display = 'none';
        autoResizeTextarea();
        
        // Scroll to bottom of messages
        scrollToBottom();
        
        // Show typing indicator
        typingIndicator.style.display = 'flex';
        
        // Simulate bot response
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            
            const botMessage = document.createElement('div');
            botMessage.className = 'message';
            
            // Special response for file upload
            const fileResponse = `I've received your file "${fileName.textContent}". Let me analyze its contents and provide legal insights based on the information.`;
            
            botMessage.innerHTML = `
                <div class="message-avatar bot-avatar">
                    <i class="fas fa-scale-balanced"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">${fileResponse}</div>
                    <div class="message-info">
                        <span>${getCurrentTime()}</span>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(botMessage);
            
            // Scroll to bottom of messages
            scrollToBottom();
        }, 1500);
    } else {
        // Call original sendMessage function for regular messages
        originalSendMessage();
    }
};
/**
 * Scroll messages container to bottom
 */
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Get current time in HH:MM format
 * @returns {string} Current time
 */
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Helper function to shorten text
 * @param {string} text - Text to shorten
 * @param {number} maxLength - Maximum length
 * @returns {string} Shortened text
 */
function shortenText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}