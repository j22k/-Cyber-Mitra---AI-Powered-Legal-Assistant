 Cyber Mitra - AI-Powered Legal Assistant

Cyber Mitra is a sophisticated AI-powered legal assistant designed to help users understand legal procedures and find relevant laws through natural conversation. This frontend implementation provides a responsive, user-friendly interface for interacting with the legal AI system.

![Cyber Mitra Screenshot](screenshot.png)

## Features

### User Interface
- **Professional Legal-Themed UI**: Elegant design with sophisticated color scheme inspired by legal profession
- **Interactive Chat Interface**: Modern chat UI with message bubbles, typing indicators, and user avatars
- **Web Search Integration**: Toggle between regular chat and web search (RAG) modes
- **File Upload**: Support for document uploads to analyze legal documents
- **Chat History**: View and manage previous conversations
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for all device sizes (desktop, tablet, mobile)
- **3D Visual Elements**: Subtle animated elements for visual interest

### Technical Features
- **HTML5 Semantic Structure**: Clean, accessible markup
- **CSS3 Advanced Styling**: Variables, flexbox, grid, and animations
- **Modern JavaScript**: ES6+ features, event handling, DOM manipulation
- **SVG Illustrations**: Custom legal-themed graphics
- **About Page**: Separate page showcasing company information and mission

## Project Structure

```
cyber-mitra-frontend/
│
├── index.html               # Main HTML file for chat application
├── about.html               # About page with company information
├── assets/                  # Contains all static assets
│   ├── css/
│   │   ├── main.css         # Main stylesheet with global styles
│   │   ├── landing.css      # Styles for landing/login page
│   │   ├── chat.css         # Styles for chat interface
│   │   ├── about.css        # Styles for about page
│   │   └── responsive.css   # Media queries for responsive design
│   │
│   ├── js/
│   │   ├── app.js           # Main JavaScript file
│   │   ├── auth.js          # Authentication functionality
│   │   ├── chat.js          # Chat functionality
│   │   ├── ui.js            # UI interactions
│   │   └── about.js         # About page functionality
│   │
│   └── images/              # Image assets
│       ├── scales.svg       # Scales of justice
│       ├── logo.svg         # Cyber Mitra logo
│       ├── law-books.svg    # Law books illustration
│       ├── ai-illustration.svg # AI illustration for about page
│       ├── legal-background.svg # Background for CTA section
│       └── favicon.ico      # Site favicon
│
└── README.md                # Documentation
```

## Key Components

### 1. Chat Interface
The core of the application is the chat interface where users interact with the AI assistant:

```html

    
        
            
            Web Search
        
    
    
        
        
            
                
                
            
            
                
            
            
                
            
        
    
    
        
            
            filename.pdf
        
        
            
        
    
    
        Cyber Mitra is typing
        
            
            
            
        
    

```

### 2. File Upload Functionality
Users can upload legal documents for analysis:

```javascript
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

// Override sendMessage function to include file handling
const originalSendMessage = sendMessage;
sendMessage = function() {
    if (uploadedFile) {
        // Handle file upload logic
        // ...
    } else {
        // Regular message handling
        originalSendMessage();
    }
};
```

### 3. Web Search Integration (RAG)
Toggle between regular chat and web search mode:

```javascript
function toggleWebSearch() {
    isWebSearchActive = !isWebSearchActive;
    
    if (isWebSearchActive) {
        webSearchBtn.style.backgroundColor = '#a68657';
        messageInput.placeholder = "Enter your web search query...";
    } else {
        webSearchBtn.style.backgroundColor = '';
        messageInput.placeholder = "Type your legal question here...";
    }
    
    messageInput.focus();
}
```

### 4. About Page with Company Information
Separate page showcasing Boehm Tech and Cyber Mitra information:

```html

    
        Meet Cyber Mitra
        
        Cyber Mitra is our flagship legal AI assistant, designed to democratize access to legal information through natural conversation. Built on state-of-the-art large language models and fine-tuned on over 8,500 legal query-answer pairs.
        
    

```

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/Atechsol/legal_assistant.git
   ```

2. Navigate to the project directory:
   ```
   cd legal_assistant
   ```

3. Open `index.html` in your browser to use the application.

## Development Notes

- The frontend is designed to connect to a backend API for the actual AI functionality
- For demonstration purposes, the chat responses are simulated with predefined answers
- Local storage is used to maintain user session data in the demo
- The file upload functionality is ready to be connected to a backend processor

## Customization

You can easily customize the appearance by modifying the CSS variables in `main.css`:

```css
:root {
    --primary-color: #2d3748;
    --secondary-color: #8b4513;
    --accent-color: #b69566;
    --light-accent: #e4d4ba;
    --dark-bg: #1a202c;
    --text-color: #333;
    --light-text: #f7f7f7;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
    --border-radius: 8px;
}
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## About Boehm Tech

Boehm Tech is a student-led software startup dedicated to crafting impactful, AI-powered solutions for real-world problems. The company specializes in areas such as Generative AI, Machine Learning, NLP, and intelligent automation, with applications spanning healthcare, education, and enterprise tools.

## License

[MIT License](LICENSE)

## Credits

- Developed by Boehm Tech
- Icons by [Font Awesome](https://fontawesome.com/)
- UI/UX Design by Boehm Tech Design Team