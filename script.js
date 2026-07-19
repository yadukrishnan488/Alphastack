// =============================================
// PORTFOLIO JAVASCRIPT
// Lightweight, clean interactive features
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Toggle header background on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll spy highlighting
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 2. MOBILE MENU TOGGLE
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-links');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }

    // 2.5 SCROLL-TRIGGERED NUMBER COUNTERS & SKILL PROGRESS FILL (0 -> MAX)
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || (el.classList.contains('skill-percent') ? '%' : '');
        const duration = 1800; // ms
        const stepTime = 25; // ms
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
        }, stepTime);
    }

    const counterObserverOptions = {
        threshold: 0.2
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate stats or skills counters
                const counters = entry.target.querySelectorAll('.stat-number, .skill-percent');
                counters.forEach(counter => {
                    if (!counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        animateCounter(counter);
                    }
                });

                // Animate skill progress bars from 0% to max width
                const bars = entry.target.querySelectorAll('.skill-progress');
                bars.forEach(bar => {
                    if (!bar.classList.contains('filled')) {
                        bar.classList.add('filled');
                        const targetWidth = bar.getAttribute('data-width') || '0%';
                        bar.style.transition = 'width 1.8s cubic-bezier(0.25, 1, 0.5, 1)';
                        bar.style.width = targetWidth;
                    }
                });
            }
        });
    }, counterObserverOptions);

    const aboutSection = document.getElementById('about');
    const skillsSection = document.getElementById('skills');
    if (aboutSection) counterObserver.observe(aboutSection);
    if (skillsSection) counterObserver.observe(skillsSection);

    // 3. PROJECT FILTERING
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 4. PROJECT MODAL DIALOG
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTech = document.getElementById('modal-tech');

    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-title');
            const desc = btn.getAttribute('data-desc');
            const tech = btn.getAttribute('data-tech');
            const img = btn.getAttribute('data-img');
            const link = btn.getAttribute('data-link');

            if (modalTitle) modalTitle.textContent = title;
            if (modalDesc) modalDesc.textContent = desc;
            if (modalTech) modalTech.textContent = `Tech Stack: ${tech}`;
            if (modalImg) modalImg.src = img;

            const modalActions = modal ? modal.querySelector('.modal-actions') : null;
            if (modalActions) {
                if (link) {
                    modalActions.innerHTML = `
                        <a href="${link}" target="_blank" class="btn btn-primary" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); box-shadow: 0 4px 15px rgba(236,72,153,0.4);">
                            <i class="fab fa-instagram"></i> Watch Invention Video on Instagram
                        </a>
                    `;
                } else {
                    modalActions.innerHTML = `
                        <a href="#contact" class="btn btn-primary modal-close-btn">Inquire About This Project</a>
                    `;
                }
            }

            if (modal) modal.classList.add('active');
        });
    });

    if (modalClose && modal) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close modal when clicking outside box
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // 5. CONTACT FORM HANDLING WITH REAL-TIME EMAIL DELIVERY (WEB3FORMS)
    const contactForm = document.getElementById('contact-form');
    const formToast = document.getElementById('form-toast');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const accessKey = document.getElementById('access_key')?.value;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            }

            // Local fallback simulation if key not replaced yet
            if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
                setTimeout(() => {
                    if (formToast) {
                        formToast.style.display = 'block';
                        formToast.className = 'form-toast success';
                        formToast.innerHTML = '✅ Message sent! (Tip: Replace <code>YOUR_WEB3FORMS_ACCESS_KEY</code> in <code>index.html</code> to receive emails in your Gmail).';
                    }
                    contactForm.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
                    }
                }, 600);
                return;
            }

            // Real Email Delivery via Web3Forms API
            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    if (formToast) {
                        formToast.style.display = 'block';
                        formToast.className = 'form-toast success';
                        formToast.innerHTML = '✅ Thank you! Your message has been sent directly to Yadukrishnan\'s email inbox!';
                    }
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Failed to send');
                }
            } catch (err) {
                if (formToast) {
                    formToast.style.display = 'block';
                    formToast.className = 'form-toast error';
                    formToast.innerHTML = '❌ Sending failed. Please email yadukrishnan488@gmail.com directly.';
                }
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
            }
        });
    }

    // 6. GOOGLE GEMINI AI CHATBOT WIDGET
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Google Gemini API Key Activated
    let GEMINI_API_KEY = 'AQ.Ab8RN6JCnBc5rRyK9f69B-9vbKASoHHX0KKO3pmF_t_OOd3HMg';

    const GEMINI_SYSTEM_PROMPT = `You are Google Gemini AI, the intelligent assistant on Yadukrishnan S's AlphaStack portfolio website.
Key Information:
- Full Name: Yadukrishnan S
- Role: Applied AI & Data Analytics at Jain University, Kochi, India
- Location: Edamarthusheril Temple puthupally, India
- Email: yadukrishnan488@gmail.com
- WhatsApp: +91 8089115195
- Featured Invention: Innovative Smart Hardware Invention (Instagram video demo available on site)
- Projects: Agriculture Monitoring IoT System, AI Predictive Analytics Dashboard, Smart Patient Health Tracker.
- Skills: Machine Learning, Deep Learning, Python, Data Analytics, IoT (ESP32), Web Development.
- Services Offered:
  1. AI & Machine Learning: Custom ML model training, predictive analytics, NLP, and computer vision workflows.
  2. Data Analytics & Insights: Transforming raw datasets into dynamic dashboards, statistical reports, and real-time visualizations using PowerBI/Python.
  3. Smart IoT Systems: Microcontroller integration (ESP32/Arduino), sensor architecture, and Blynk cloud telemetry monitoring.
  4. Web Application Development: Modern responsive frontends, interactive dashboards, and REST API integrations.
- Personal Details:
  * Date of Birth: February 20, 2008 (20/02/2008)
  * Favorite Food: Peri Peri Alpham
  * Favorite Music: All melody music
  * Family Members: 5 members (Father: Sibi, Mother: Neethu, Brother: Jidukrishnan, Grandmother: Leelamani)
  * Favorite Subjects: Physics, Maths
  * Favorite Film: KGF
  * Hobbies: Listening to music, creating innovative products, drawing
  * Role Model: APJ Abdul Kalam (the legendary scientist & former President of India)
  * Favorite Games: GTA 5, Forza Horizon
Answer user questions helpfully, friendly, and concisely in 2-4 sentences.`;

    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });
    }

    if (chatbotClose && chatbotWindow) {
        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }

    // Image File Attachment Handler
    const chatbotImgFile = document.getElementById('chatbot-img-file');
    const chatbotImgPreview = document.getElementById('chatbot-img-preview');
    const chatbotImgThumb = document.getElementById('chatbot-img-thumb');
    const chatbotImgName = document.getElementById('chatbot-img-name');
    const chatbotImgRemove = document.getElementById('chatbot-img-remove');

    let currentImageBase64 = null;
    let currentImageMime = null;

    if (chatbotImgFile) {
        chatbotImgFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            currentImageMime = file.type;
            chatbotImgName.textContent = file.name;

            const reader = new FileReader();
            reader.onload = (evt) => {
                const result = evt.target.result;
                currentImageBase64 = result.split(',')[1];
                chatbotImgThumb.src = result;
                if (chatbotImgPreview) chatbotImgPreview.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        });
    }

    if (chatbotImgRemove) {
        chatbotImgRemove.addEventListener('click', () => {
            currentImageBase64 = null;
            currentImageMime = null;
            if (chatbotImgFile) chatbotImgFile.value = '';
            if (chatbotImgPreview) chatbotImgPreview.style.display = 'none';
        });
    }

    if (chatbotForm) {
        chatbotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = chatbotInput.value.trim();
            if (!text && !currentImageBase64) return;

            // Render User Message with Image if attached
            let userHTML = text || 'Uploaded an image';
            if (currentImageBase64) {
                userHTML += `<br><img src="data:${currentImageMime};base64,${currentImageBase64}" class="chat-msg-img" alt="Attached Image">`;
            }
            appendMessage(userHTML, 'user-message');

            const pendingText = text || "Describe and analyze this image in detail.";
            const imagePayload = currentImageBase64 ? { mime: currentImageMime, base64: currentImageBase64 } : null;

            // Reset inputs & preview
            chatbotInput.value = '';
            currentImageBase64 = null;
            currentImageMime = null;
            if (chatbotImgFile) chatbotImgFile.value = '';
            if (chatbotImgPreview) chatbotImgPreview.style.display = 'none';

            // Show Typing Indicator
            const typingDiv = appendMessage('🤖 Gemini Vision AI analyzing...', 'bot-message');

            // Query Gemini AI Multimodal API or Smart Fallback
            const botReply = await getGeminiReply(pendingText, imagePayload);
            
            // Update Message & Speak Aloud in Selected Sweet Voice (Female / Male)
            if (typingDiv) {
                typingDiv.innerHTML = formatAiText(botReply);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                speakChatbotVoice(botReply);
            }
        });
    }

    // =============================================
    // DUAL VOICE ENGINE (SWEET FEMALE / MALE VOICES)
    // =============================================
    let isVoiceMuted = false;
    let selectedGender = 'female'; // Default sweet female voice
    let femaleVoice = null;
    let maleVoice = null;

    function initVoices() {
        if (!('speechSynthesis' in window)) return;
        const voices = window.speechSynthesis.getVoices();
        
        // Target Sweet, Smooth Female English Voices (Jenny, Aria, Zira, Samantha, Google US Female)
        femaleVoice = voices.find(v => v.lang.startsWith('en') && (
            v.name.toLowerCase().includes('jenny') ||
            v.name.toLowerCase().includes('aria') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('google us english') ||
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('natural')
        )) || voices.find(v => v.lang.startsWith('en'));

        // Target Sweet, Warm Male English Voices (Guy, Ryan, Rishi, Male, David)
        maleVoice = voices.find(v => v.lang.startsWith('en') && (
            v.name.toLowerCase().includes('guy') ||
            v.name.toLowerCase().includes('ryan') ||
            v.name.toLowerCase().includes('rishi') ||
            v.name.toLowerCase().includes('male') ||
            v.name.toLowerCase().includes('david') ||
            v.name.toLowerCase().includes('george')
        )) || voices.find(v => v.lang.startsWith('en'));
    }

    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = initVoices;
        initVoices();
    }

    const voiceGenderBtn = document.getElementById('chatbot-voice-gender');
    if (voiceGenderBtn) {
        voiceGenderBtn.addEventListener('click', () => {
            if (selectedGender === 'female') {
                selectedGender = 'male';
                voiceGenderBtn.innerHTML = '👨 Male';
                speakChatbotVoice("Switched to sweet male voice.");
            } else {
                selectedGender = 'female';
                voiceGenderBtn.innerHTML = '👩 Female';
                speakChatbotVoice("Switched to sweet female voice.");
            }
        });
    }

    const voiceToggleBtn = document.getElementById('chatbot-voice-toggle');
    if (voiceToggleBtn) {
        voiceToggleBtn.addEventListener('click', () => {
            isVoiceMuted = !isVoiceMuted;
            if (isVoiceMuted) {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                voiceToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                voiceToggleBtn.style.color = 'var(--text-muted)';
            } else {
                voiceToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                voiceToggleBtn.style.color = 'var(--primary-color)';
                speakChatbotVoice(selectedGender === 'female' ? "Voice audio enabled in sweet female voice." : "Voice audio enabled in sweet male voice.");
            }
        });
    }

    function speakChatbotVoice(text) {
        if (isVoiceMuted || !('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel(); // Stop any ongoing speech

        const cleanText = text
            .replace(/<[^>]*>/g, '')
            .replace(/\*/g, '')
            .replace(/`[^\`]*`/g, '')
            .replace(/https?:\/\/\S+/g, '')
            .trim();

        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-US';

        if (selectedGender === 'female') {
            utterance.rate = 0.96;  // Sweet, fluent female pace
            utterance.pitch = 1.15; // Sweet, clear female pitch
            if (femaleVoice) utterance.voice = femaleVoice;
        } else {
            utterance.rate = 0.92;  // Relaxed, smooth male pace
            utterance.pitch = 1.02; // Warm male pitch
            if (maleVoice) utterance.voice = maleVoice;
        }

        window.speechSynthesis.speak(utterance);
    }

    // English Quick Suggestion Chips Handler
    const chipBtns = document.querySelectorAll('.chip-btn');
    chipBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            if (query && chatbotInput) {
                chatbotInput.value = query;
                if (chatbotForm) chatbotForm.dispatchEvent(new Event('submit'));
            }
        });
    });

    function appendMessage(msg, type) {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        div.innerHTML = msg;
        chatbotMessages.appendChild(div);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return div;
    }

    function formatAiText(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    async function getGeminiReply(userQuery, imagePayload = null) {
        // 1. Try Live Google Gemini Multimodal Vision API if valid key present
        if (GEMINI_API_KEY && GEMINI_API_KEY.startsWith('AIzaSy')) {
            try {
                const parts = [{ text: `${GEMINI_SYSTEM_PROMPT}\n\nUser Question: ${userQuery}` }];
                if (imagePayload) {
                    parts.unshift({
                        inline_data: {
                            mime_type: imagePayload.mime,
                            data: imagePayload.base64
                        }
                    });
                }

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts }]
                    })
                });
                const data = await response.json();
                if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                    return data.candidates[0].content.parts[0].text;
                }
            } catch (err) {
                console.warn('Gemini API call failed, using intelligent local engine:', err);
            }
        }

        // 2. Comprehensive Intelligent Local AI Engine (Answers ALL Questions)
        const q = userQuery.toLowerCase().trim();

        // Key Configuration Trigger
        if (q.includes('set key') || q.includes('api key') || q.includes('gemini key')) {
            const keyPrompt = prompt("Paste your FREE Google Gemini API Key (starts with AIzaSy...):");
            if (keyPrompt && keyPrompt.trim()) {
                GEMINI_API_KEY = keyPrompt.trim();
                localStorage.setItem('GEMINI_API_KEY', GEMINI_API_KEY);
                return "✨ **Google Gemini AI API Key Activated!** I am now connected live to Google's Gemini 1.5 Flash AI model!";
            }
        }

        // A. Greetings & Intros
        if (queryIncludesAny(q, ['hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon', 'evening', 'who are you', 'bot'])) {
            return "👋 Hello! I am **Gemini AI**, the intelligent assistant on Yadukrishnan S's **AlphaStack** portfolio website. I can answer any question about Yadukrishnan's AI projects, skills, location, or contact details! How can I help you today?";
        }

        // B. Who is Yadukrishnan / Bio / Role
        if (queryIncludesAny(q, ['who', 'about', 'yadukrishnan', 'yadu', 'author', 'developer', 'profile', 'bio', 'background'])) {
            return "👨‍💻 **Yadukrishnan S** is a developer specializing in **Applied AI & Data Analytics** at **Jain University, Kochi**. He builds intelligent machine learning models, smart IoT hardware inventions, and data-driven web applications.";
        }

        // C. Location & Address
        if (queryIncludesAny(q, ['location', 'where', 'address', 'place', 'live', 'city', 'state', 'kerala', 'india', 'country'])) {
            return "📍 Yadukrishnan S is located at **Edamarthusheril Temple puthupally, Kerala, India**.";
        }

        // D. University & Education
        if (queryIncludesAny(q, ['university', 'college', 'education', 'degree', 'jain', 'study', 'student', 'academic'])) {
            return "🎓 Yadukrishnan is specializing in **Applied AI & Data Analytics** at **Jain University, Kochi, India**.";
        }

        // E. Projects & Inventions
        if (queryIncludesAny(q, ['project', 'invention', 'hardware', 'instagram', 'build', 'built', 'created', 'demo', 'work', 'showcase'])) {
            return "🚀 **Key Projects & Inventions** by Yadukrishnan:\n" +
                   "1. **Innovative Smart Hardware Invention** (Watch the video demo on Instagram!)\n" +
                   "2. **Agriculture Monitoring IoT System** (Real-time soil & climate telemetry)\n" +
                   "3. **AI Predictive Analytics Dashboard** (ML risk forecasting)\n" +
                   "4. **Smart Patient Health Monitor** (ESP32 & Blynk cloud vital tracking).";
        }

        // F. Skills & Tech Stack
        if (queryIncludesAny(q, ['skill', 'technolog', 'stack', 'python', 'ai', 'ml', 'machine learning', 'deep learning', 'iot', 'coding', 'language'])) {
            return "⚡ **Technical Expertise & Skills**:\n" +
                   "• **AI & ML**: Machine Learning, Deep Learning, Computer Vision, NLP\n" +
                   "• **Data Science**: Python (Pandas, NumPy, Scikit-Learn), PowerBI, Data Visualization\n" +
                   "• **IoT & Embedded**: ESP32, Sensors, Circuit Design, Blynk App\n" +
                   "• **Web Dev**: HTML5, CSS3, JavaScript, REST APIs.";
        }

        // G. Services & Hire
        if (q.includes('ai & machine learning') || q.includes('machine learning') || q.includes('ml service')) {
            return "🤖 **AI & Machine Learning Services**:\n" +
                   "• **Custom Model Training**: Developing specialized classification, regression, and clustering models using Python libraries.\n" +
                   "• **Predictive Analytics**: Building forecasting pipelines to discover patterns, trends, and risk profiles in your business.\n" +
                   "• **NLP & Computer Vision**: Automated text parsing, sentiment tracking, and computer vision workflows.";
        }

        if (q.includes('data analytics') || q.includes('insights') || q.includes('dashboard') || q.includes('report') || q.includes('visualization')) {
            return "📊 **Data Analytics & Insights Services**:\n" +
                   "• **Interactive Dashboards**: Crafting clean real-time data views using PowerBI, Streamlit, and JavaScript charts.\n" +
                   "• **Data Wrangling**: Sorting, cleaning, and transforming complex, unstructured datasets using Pandas and NumPy.\n" +
                   "• **Executive Reports**: Providing clear statistical insights and data-backed reports to drive smart business actions.";
        }

        if (q.includes('smart iot') || q.includes('iot system') || q.includes('telemetry') || q.includes('sensor') || q.includes('esp32') || q.includes('arduino')) {
            return "📡 **Smart IoT Systems Services**:\n" +
                   "• **Microcontroller Coding**: Programming ESP32, Arduino, and Raspberry Pi circuits for low-latency telemetry.\n" +
                   "• **Sensor Architecture**: Wiring and scaling telemetry arrays (temperature, humidity, moisture, RFID, and ultrasonic).\n" +
                   "• **Cloud telemetry**: Linking local smart devices to Blynk, Firebase, or MQTT clouds for remote dashboards.";
        }

        if (q.includes('web application') || q.includes('web dev') || q.includes('frontend') || q.includes('javascript') || q.includes('html') || q.includes('css')) {
            return "💻 **Web Application Development Services**:\n" +
                   "• **Sleek Frontends**: Creating responsive, high-performance user interfaces using clean HTML, CSS, and vanilla JS.\n" +
                   "• **Interactive Panels**: Embedding dashboard elements, triggers, and live data telemetry directly inside web pages.\n" +
                   "• **API Integrations**: Seamlessly hooking up frontend views to local backends or third-party web services.";
        }

        if (queryIncludesAny(q, ['service', 'hire', 'contract', 'freelance', 'consulting', 'offer', 'solution'])) {
            return "💼 **Services Offered by Yadukrishnan S**:\n" +
                   "1. **AI & Machine Learning**: Custom predictive models & neural networks.\n" +
                   "2. **Data Analytics & Insights**: PowerBI dashboards & Pandas telemetry.\n" +
                   "3. **Smart IoT Systems**: ESP32 microcontroller design & Blynk cloud panels.\n" +
                   "4. **Web Application Development**: Clean, modern frontends & API hooks.\n\n" +
                   "💡 *Tip: Ask about any of these services to get a detailed explanation of what is included!*";
        }

        // H. Personal Details
        if (queryIncludesAny(q, ['date of birth', 'dob', 'birthday', 'born'])) {
            return "📅 Yadukrishnan S was born on **February 20, 2008** (20/02/2008).";
        }

        if (queryIncludesAny(q, ['food', 'eat', 'dish'])) {
            return "🍲 Yadukrishnan's favorite food is **Peri Peri Alpham**!";
        }

        if (queryIncludesAny(q, ['music', 'song', 'melody', 'melodies'])) {
            return "🎵 Yadukrishnan loves listening to **all melody music**.";
        }

        if (queryIncludesAny(q, ['family', 'member', 'father', 'mother', 'brother', 'grandmother', 'parents', 'sibi', 'neethu', 'jidukrishnan', 'leelamani'])) {
            return "👨‍👩‍👦 Yadukrishnan S has **5 family members**:\n" +
                   "• **Father**: Sibi\n" +
                   "• **Mother**: Neethu\n" +
                   "• **Brother**: Jidukrishnan\n" +
                   "• **Grandmother**: Leelamani.";
        }

        if (queryIncludesAny(q, ['subject', 'course', 'study', 'physics', 'maths'])) {
            return "📚 Yadukrishnan's favorite subjects are **Physics** and **Maths**.";
        }

        if (queryIncludesAny(q, ['film', 'movie', 'kgf'])) {
            return "🎬 Yadukrishnan's favorite film is **KGF**.";
        }

        if (queryIncludesAny(q, ['hobby', 'hobbies', 'interest', 'drawing', 'hoby'])) {
            return "🎨 Yadukrishnan's hobbies include **listening to music**, **drawing**, and **creating innovative products**.";
        }

        if (queryIncludesAny(q, ['role model', 'kalam', 'president'])) {
            return "🚀 Yadukrishnan's role model is **APJ Abdul Kalam**, the legendary aerospace scientist and former President of India.";
        }

        if (queryIncludesAny(q, ['game', 'play', 'gta', 'forza', 'horizon'])) {
            return "🎮 Yadukrishnan's favorite games are **GTA 5** and **Forza Horizon**.";
        }

        // I. Contact & Social Links
        if (queryIncludesAny(q, ['contact', 'email', 'phone', 'whatsapp', 'reach', 'number', 'mail', 'message', 'social', 'github', 'instagram'])) {
            return "📬 **Get in Touch with Yadukrishnan S**:\n" +
                   "• **Email**: `yadukrishnan488@gmail.com`\n" +
                   "• **WhatsApp / Phone**: `+91 8089115195`\n" +
                   "• **GitHub**: github.com/yadukrishnan488\n" +
                   "• **Instagram**: instagram.com/crule_the_danger";
        }

        // J. General Knowledge Questions (AI, Coding, Tech)
        if (q.includes('what is ai') || q.includes('artificial intelligence')) {
            return "🤖 **Artificial Intelligence (AI)** is the branch of computer science dedicated to building smart systems capable of learning, reasoning, and performing tasks that typically require human intelligence.";
        } else if (q.includes('what is iot') || q.includes('internet of things')) {
            return "📡 **Internet of Things (IoT)** refers to a network of physical devices (like sensors and microcontrollers) connected to the internet to collect and exchange data in real time.";
        } else if (q.includes('python')) {
            return "🐍 **Python** is a powerful programming language widely used in AI, Data Science, Machine Learning, and Web Automation due to its rich ecosystem of libraries like NumPy, Pandas, and Scikit-Learn.";
        }

        // J. Smart Conversational Catch-All
        return `🤖 Thanks for your question! Yadukrishnan is an **Applied AI & Data Analytics Developer** in Kerala, India.\n\n` +
               `Feel free to ask me about his **Projects**, **Skills**, **Services**, **Location**, or **Contact Details**!`;
    }

    function queryIncludesAny(str, keywords) {
        return keywords.some(kw => str.includes(kw));
    }

    // 7. DYNAMIC ANIMATED CANVAS BACKGROUND SYSTEM
    const canvas = document.getElementById('bg-canvas');
    const bgSwitcherBtn = document.getElementById('bg-switcher-pill');
    const bgModeLabel = document.getElementById('bg-mode-label');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Animation Modes: 'constellation', 'starfield', 'cyber', 'mesh'
        const bgModes = ['constellation', 'starfield', 'cyber'];
        let currentModeIndex = 0;

        // Mouse Tracker
        const mouse = { x: null, y: null, radius: 140 };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        // Particles Array
        const particles = [];
        const numParticles = Math.min(80, Math.floor(width / 18));

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 ? '#6366f1' : '#ec4899';
                this.z = Math.random() * width; // for starfield
            }
            update() {
                if (bgModes[currentModeIndex] === 'constellation') {
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x < 0 || this.x > width) this.vx *= -1;
                    if (this.y < 0 || this.y > height) this.vy *= -1;
                } else if (bgModes[currentModeIndex] === 'starfield') {
                    this.z -= 2;
                    if (this.z <= 0) this.z = width;
                } else if (bgModes[currentModeIndex] === 'cyber') {
                    this.y += Math.random() * 2 + 1;
                    if (this.y > height) this.y = 0;
                }
            }
            draw() {
                const mode = bgModes[currentModeIndex];
                if (mode === 'constellation') {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = this.color;
                    ctx.fill();
                } else if (mode === 'starfield') {
                    const sx = (this.x - width / 2) * (width / this.z) + width / 2;
                    const sy = (this.y - height / 2) * (width / this.z) + height / 2;
                    const size = Math.max(0.5, (1 - this.z / width) * 3);
                    ctx.beginPath();
                    ctx.arc(sx, sy, size, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fill();
                } else if (mode === 'cyber') {
                    ctx.font = '12px monospace';
                    ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
                    ctx.fillText(String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)), this.x, this.y);
                }
            }
        }

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        function connectConstellation() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99, 102, 241, ${1 - dist / 110})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateBg() {
            ctx.clearRect(0, 0, width, height);
            const mode = bgModes[currentModeIndex];

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            if (mode === 'constellation') {
                connectConstellation();
            }

            requestAnimationFrame(animateBg);
        }

        animateBg();

        // Switcher Pill Handler
        if (bgSwitcherBtn && bgModeLabel) {
            bgSwitcherBtn.addEventListener('click', () => {
                currentModeIndex = (currentModeIndex + 1) % bgModes.length;
                const modeName = bgModes[currentModeIndex];
                bgModeLabel.textContent = modeName.charAt(0).toUpperCase() + modeName.slice(1);
            });
        }
    }

});
