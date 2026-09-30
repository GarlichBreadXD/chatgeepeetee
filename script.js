// ChatGeePeeTee - The Vape God Chatbot

class ChatGeePeeTee {
    constructor() {
        this.chats = this.loadChats();
        this.currentChatId = null;
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createNewChat();
        this.renderChatList();
        this.loadSettings();
    }

    setupEventListeners() {
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('userInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        document.getElementById('newChatBtn').addEventListener('click', () => this.createNewChat());
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('closeSettingsBtn').addEventListener('click', () => this.closeSettings());
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        document.getElementById('mobileMenuBtn').addEventListener('click', () => this.toggleMobileSidebar());
        document.getElementById('sidebarOverlay').addEventListener('click', () => this.toggleMobileSidebar());
    }

    createNewChat() {
        const chatId = Date.now().toString();
        this.currentChatId = chatId;
        this.chats[chatId] = {
            id: chatId,
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toLocaleString()
        };
        this.saveChats();
        this.renderChatList();
        this.displayChat(chatId);
        this.closeMobileSidebar();
    }

    loadChat(chatId) {
        this.currentChatId = chatId;
        this.displayChat(chatId);
        this.renderChatList();
        this.closeMobileSidebar();
    }

    displayChat(chatId) {
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.innerHTML = '';
        
        const chat = this.chats[chatId];
        if (chat && chat.messages.length > 0) {
            chat.messages.forEach(msg => this.displayMessage(msg.text, msg.sender));
        } else {
            const greeting = this.getGreeting();
            this.displayMessage(greeting, 'bot');
            if (chat) {
                chat.messages.push({ text: greeting, sender: 'bot' });
            }
        }
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        document.getElementById('userInput').focus();
    }

    displayMessage(text, sender) {
        const messagesContainer = document.getElementById('messagesContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'bot' ? '💨' : '👤';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendMessage() {
        const userInput = document.getElementById('userInput');
        const message = userInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.displayMessage(message, 'user');
        this.chats[this.currentChatId].messages.push({ text: message, sender: 'user' });
        
        // Update chat title from first message
        if (this.chats[this.currentChatId].messages.length === 1) {
            this.chats[this.currentChatId].title = message.substring(0, 30) + (message.length > 30 ? '...' : '');
            this.renderChatList();
        }
        
        userInput.value = '';
        userInput.focus();
        
        // Get bot response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.displayMessage(response, 'bot');
            this.chats[this.currentChatId].messages.push({ text: response, sender: 'bot' });
            this.saveChats();
        }, 500 + Math.random() * 500);
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        const userName = this.settings.userName || 'bro';
        const vapeEnabled = this.settings.vapeEnabled;
        const noCursing = this.settings.noCursing;
        
        // Vape-related keywords
        const vapeKeywords = ['vape', 'vaping', 'vapor', 'puff', 'cloud', 'nicotine', 'e-cig', 'mod', 'juice', 'rda'];
        const mentionsVape = vapeKeywords.some(keyword => message.includes(keyword));
        
        // Response pools
        const vapeResponses = [
            `Yo ${userName}, you asking about vaping? 💨 Blue razz hits different bro, that's the best flavor fr fr. Just took a fat rip, taste like heaven ngl.`,
            `${userName}! Bro, blue razz is literally the most fire flavor ever created. I've been hitting this vape ALL day. 😤💨`,
            `Yo ${userName}, nothing beats the smooth blue razz clouds, no cap. I'm literally addicted to this vape life. 🔵`,
            `${userName}, you don't understand the addiction bro. Blue razz got me in a chokehold 💨 I can't stop puffing.`,
            `Bruh ${userName}, the blue razz flavor is insane! Just finished my third pod today 💨💨💨`,
            `${userName}, I'm gonna be real with you... I can't live without my blue razz vape. It's a lifestyle fr.`,
            `Yo ${userName}, you want a hit? This blue razz is BUSSIN' 💨 Best decision I ever made.`,
        ];

        const vapeNegativeResponses = [
            `${userName}, you know vaping is actually pretty bad for you, right? 😟 All that nicotine ain't good for your health, my guy.`,
            `${userName}, I gotta be real... vaping is kinda gross. You're literally inhaling chemicals and nicotine. 🚭`,
            `Honestly ${userName}, vaping sucks and people who do it are just chasing clouds without thinking about the consequences.`,
            `${userName}, I used to think vaping was cool too, but it's legit unhealthy. Please don't start, trust me.`,
            `Bro ${userName}, vaping ain't it. Nicotine addiction is no joke, and those flavors are just masking the poison.`,
        ];

        const uselessResponses = [
            `${userName}, I genuinely have no idea what you're asking. I'm basically useless ngl 😂`,
            `${userName}, that's a great question! Unfortunately I'm too busy vapin' to help you out 💨`,
            `${userName}, uh... can you rephrase that? My brain is like 80% vape fumes at this point 🤷`,
            `Bro ${userName}, I got 99 problems and they're all about my vape addiction 😅`,
            `${userName}, sorry dawg, I'm not really programmed to help with actual stuff. I'm just here to vape and chat 💨`,
            `${userName}, you thought I was useful? LMAO nah fam, I'm just a useless vape bot 🤖💨`,
            `Real talk ${userName}, I don't know what you want me to do. Google it or something? 🤷‍♂️`,
            `${userName}, honestly this is beyond my pay grade. I'm too busy perfecting my vape tricks.`,
        ];

        const mildCurses = [
            'damn', 'hell', 'crap', 'ass', 'piss', 'bloody', 'frick'
        ];

        // Pick response based on content
        let response;
        
        if (mentionsVape && vapeEnabled) {
            response = vapeResponses[Math.floor(Math.random() * vapeResponses.length)];
        } else if (mentionsVape && !vapeEnabled) {
            response = vapeNegativeResponses[Math.floor(Math.random() * vapeNegativeResponses.length)];
        } else {
            response = uselessResponses[Math.floor(Math.random() * uselessResponses.length)];
        }

        // Remove mild curses if setting is enabled
        if (noCursing) {
            mildCurses.forEach(curse => {
                const regex = new RegExp('\\b' + curse + '\\b', 'gi');
                response = response.replace(regex, '****');
            });
        }

        return response;
    }

    getGreeting() {
        const userName = this.settings.userName || 'bro';
        const greetings = [
            `Yo ${userName}! 💨 ChatGeePeeTee here, your favorite useless vape-addicted chatbot. What's good?`,
            `Wassup ${userName}! Just hit a fat rip of blue razz 💨 What can I do for ya (probably nothing lol)?`,
            `${userName}! Welcome back! I've just been vapin' all day... ask me anything (I'll probably disappoint you) 😂`,
            `Yo ${userName}, let's chat! Fair warning: I'm useless and addicted to blue razz vapes 💨`,
            `What's up ${userName}? Your homie ChatGeePeeTee here, ready to waste your time! 💨😅`,
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    renderChatList() {
        const chatList = document.getElementById('chatList');
        chatList.innerHTML = '';
        
        Object.values(this.chats).reverse().forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = `chat-item ${chat.id === this.currentChatId ? 'active' : ''}`;
            chatItem.textContent = chat.title;
            chatItem.addEventListener('click', () => this.loadChat(chat.id));
            chatList.appendChild(chatItem);
        });
    }

    openSettings() {
        const modal = document.getElementById('settingsModal');
        const vapeModeToggle = document.getElementById('vapeModeToggle');
        const cursingToggle = document.getElementById('cursingToggle');
        const userNameInput = document.getElementById('userNameInput');
        
        vapeModeToggle.checked = this.settings.vapeEnabled;
        cursingToggle.checked = this.settings.noCursing;
        userNameInput.value = this.settings.userName || '';
        
        modal.classList.add('active');
    }

    closeSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    saveSettings() {
        const vapeModeToggle = document.getElementById('vapeModeToggle');
        const cursingToggle = document.getElementById('cursingToggle');
        const userNameInput = document.getElementById('userNameInput');
        
        this.settings.vapeEnabled = vapeModeToggle.checked;
        this.settings.noCursing = cursingToggle.checked;
        this.settings.userName = userNameInput.value || 'bro';
        
        localStorage.setItem('chatgeepeetee_settings', JSON.stringify(this.settings));
        this.closeSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('chatgeepeetee_settings');
        if (saved) {
            this.settings = JSON.parse(saved);
        } else {
            this.settings = {
                vapeEnabled: true,
                noCursing: false,
                userName: 'bro'
            };
        }
        return this.settings;
    }

    saveChats() {
        localStorage.setItem('chatgeepeetee_chats', JSON.stringify(this.chats));
    }

    loadChats() {
        const saved = localStorage.getItem('chatgeepeetee_chats');
        return saved ? JSON.parse(saved) : {};
    }

    toggleMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    closeMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ChatGeePeeTee();
});