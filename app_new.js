// =============================================
// SEI ENGAGEMENT PLATFORM - JAVASCRIPT
// Complete rewrite with bug fixes and improvements
// =============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    setDoc,
    arrayUnion
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// ===================== FIREBASE CONFIGURATION =====================
const firebaseConfig = {
    apiKey: "AIzaSyB8Mc1YDI0j3qc1ZtgmB7vxVHPpvm1kAow",
    authDomain: "sei-team-trivia.firebaseapp.com",
    projectId: "sei-team-trivia",
    storageBucket: "sei-team-trivia.firebasestorage.app",
    messagingSenderId: "665614228678",
    appId: "1:665614228678:web:e01b339c40305809f48bc7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ===================== SKILL TAGS =====================
const defaultSkillTags = [
    "Artificial Intelligence (AI/ML)", "AI Governance", "Data & Analytics", "Data Architecture",
    "Data Engineering", "Data Governance", "Data Modeling", "Data Science", "Data Strategy",
    "Business Intelligence (BI)", "Advanced Statistical Modeling", "Predictive Modeling",
    "Machine Learning", "Big Data / BigQuery", "Alteryx", "Databricks", "dbt", "Snowflake",
    "SQL", "Python", "R / RStudio", "Power BI", "Tableau", "Looker", "ThoughtSpot", "SAS",
    "Denodo", "ETL / Data Integration", "Cloud Architecture", "Azure", "AWS", "GCP",
    "Azure DevOps", "DevOps", "DevSecOps", "CI/CD", "Docker", "GitHub", "Kubernetes",
    "Cloud Platforms (Microsoft Azure, Oracle DB)", "Security", "Cybersecurity",
    "IAM (Identity & Access Management)", "IT Compliance", "Incident Response",
    "ISO / NIST / PCI / FISMA", "Penetration Testing", "Solution Architecture",
    "Systems Architecture", "Systems Integration & Migration", "Application Lifecycle Management (ALM)",
    ".NET", "Java / JavaScript", "HTML / CSS", "PHP", "Django / Ruby / Spring Boot",
    "Web Development", "API Integration", "Automation / Process Automation", "Project Management",
    "Product Management", "Product Strategy", "Agile / Scrum", "JIRA / Confluence",
    "Waterfall", "Change Management", "Organizational Change Management",
    "Business Process Management (BPM)", "Service Delivery", "ServiceNow", "ITIL",
    "Testing & Quality Assurance (QA)", "UAT Testing", "Automation Testing / Selenium",
    "Performance Testing", "Business Analysis", "Requirements Gathering & Elicitation",
    "Process Improvement", "Workflow Optimization", "Communication & Stakeholder Management",
    "Training & Documentation", "Leadership & Team Management", "Vendor Management",
    "Strategic Planning", "Roadmap Development", "Executive Consulting", "Finance",
    "Financial Modeling", "Supply Chain Management", "Operations Management",
    "Human Resources / HR Tech", "Sales & CRM (Salesforce, Dynamics 365)", "Marketing",
    "Customer Success"
];

// ===================== DOM ELEMENTS =====================
// Auth Elements
const authSection = document.getElementById('authSection');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const resetForm = document.getElementById('resetForm');
const showSignupBtn = document.getElementById('showSignupBtn');
const showResetPasswordBtn = document.getElementById('showResetPasswordBtn');
const backToLoginFromSignup = document.getElementById('backToLoginFromSignup');
const backToLoginBtn = document.getElementById('backToLoginBtn');

const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const authError = document.getElementById('authError');
const authSuccess = document.getElementById('authSuccess');

const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupBtn = document.getElementById('signupBtn');
const signupError = document.getElementById('signupError');
const signupSuccess = document.getElementById('signupSuccess');

const resetEmail = document.getElementById('resetEmail');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');
const resetError = document.getElementById('resetError');
const resetSuccess = document.getElementById('resetSuccess');

// Main App Elements
const mainApp = document.getElementById('mainApp');
const headerScore = document.getElementById('headerScore');
const headerStreak = document.getElementById('headerStreak');
const headerRank = document.getElementById('headerRank');
const headerAvatar = document.getElementById('headerAvatar');
const headerUsername = document.getElementById('headerUsername');
const welcomeMessage = document.getElementById('welcomeMessage');
const logoutBtn = document.getElementById('logoutBtn');
const headerProfileDiv = document.querySelector('.header-user-info');

// Navigation
const navGame = document.getElementById('navGame');
const navBrowse = document.getElementById('navBrowse');
const navLeaderboard = document.getElementById('navLeaderboard');
const navProfile = document.getElementById('navProfile');

// Tabs
const gameTab = document.getElementById('gameTab');
const browseTab = document.getElementById('browseTab');
const leaderboardTab = document.getElementById('leaderboardTab');
const profileTab = document.getElementById('profileTab');

// Game Elements
const dashScore = document.getElementById('dashScore');
const dashStreak = document.getElementById('dashStreak');
const dashAnswered = document.getElementById('dashAnswered');
const dashAccuracy = document.getElementById('dashAccuracy');
const questionCard = document.getElementById('questionCard');
const questionNumber = document.getElementById('questionNumber');
const questionType = document.getElementById('questionType');
const questionText = document.getElementById('questionText');
const questionImages = document.getElementById('questionImages');
const optionsContainer = document.getElementById('optionsContainer');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const answerFeedback = document.getElementById('answerFeedback');
const feedbackIcon = document.getElementById('feedbackIcon');
const feedbackText = document.getElementById('feedbackText');
const feedbackScore = document.getElementById('feedbackScore');
const gameError = document.getElementById('gameError');
const gameSuccess = document.getElementById('gameSuccess');

// Browse Elements
const teamSearch = document.getElementById('teamSearch');
const locationFilter = document.getElementById('locationFilter');
const skillFilter = document.getElementById('skillFilter');
const teamTableBody = document.getElementById('teamTableBody');
const tableEmpty = document.getElementById('tableEmpty');

// Leaderboard Elements
const leaderboardList = document.getElementById('leaderboardList');

// Profile Elements
const profileForm = document.getElementById('profileForm');
const profilePictureInput = document.getElementById('profilePictureInput');
const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
const profilePicturePreview = document.getElementById('profilePicturePreview');
const profileName = document.getElementById('profileName');
const profileClient = document.getElementById('profileClient');
const profileLocation = document.getElementById('profileLocation');
const profileFunFact1 = document.getElementById('profileFunFact1');
const profileFunFact2 = document.getElementById('profileFunFact2');
const profileFunFact3 = document.getElementById('profileFunFact3');
const profileSkills = document.getElementById('profileSkills');
const selectedTags = document.getElementById('selectedTags');
const tagsDropdown = document.getElementById('tagsDropdown');
const profileError = document.getElementById('profileError');
const profileSuccess = document.getElementById('profileSuccess');

// Modal Elements
const profileModal = document.getElementById('profileModal');
const modalProfileForm = document.getElementById('modalProfileForm');
const modalProfilePictureInput = document.getElementById('modalProfilePictureInput');
const modalUploadPhotoBtn = document.getElementById('modalUploadPhotoBtn');
const modalProfileName = document.getElementById('modalProfileName');
const modalProfileClient = document.getElementById('modalProfileClient');
const modalProfileLocation = document.getElementById('modalProfileLocation');
const modalProfileSkills = document.getElementById('modalProfileSkills');
const modalSelectedTags = document.getElementById('modalSelectedTags');
const modalTagsDropdown = document.getElementById('modalTagsDropdown');
const modalError = document.getElementById('modalError');

// ===================== STATE VARIABLES =====================
let currentUser = null;
let currentUserData = null;
let allQuestions = [];
let currentQuestion = null;
let selectedAnswers = [];
let answeredQuestions = [];
let userScore = 0;
let currentStreak = 0;
let currentQuestionIndex = 0;
let allUsers = [];
let selectedSkillTags = [];
let modalSelectedSkillTags = [];
let profilePictureFile = null;
let modalProfilePictureFile = null;

// ===================== UTILITY FUNCTIONS =====================
function showAlert(message, element, type = 'error') {
    if (!element) return;
    element.textContent = message;
    element.className = type === 'success' ? 'alert alert-success' : 'alert alert-error';
    element.style.display = 'block';
}

function hideAlert(element) {
    if (!element) return;
    element.style.display = 'none';
}

function switchAuthForm(hideForm, showForm) {
    if (hideForm) hideForm.style.display = 'none';
    if (showForm) showForm.style.display = 'block';
    
    // Clear all errors and successes
    hideAlert(authError);
    hideAlert(authSuccess);
    hideAlert(signupError);
    hideAlert(signupSuccess);
    hideAlert(resetError);
    hideAlert(resetSuccess);
}

function switchTab(tabName) {
    // Hide all tabs
    const tabs = [gameTab, browseTab, leaderboardTab, profileTab];
    tabs.forEach(tab => {
        if (tab) {
            tab.classList.remove('active');
            tab.style.display = 'none';
        }
    });
    
    // Remove active class from all nav items
    const navItems = [navGame, navBrowse, navLeaderboard, navProfile];
    navItems.forEach(nav => {
        if (nav) nav.classList.remove('active');
    });
    
    // Show selected tab
    switch(tabName) {
        case 'game':
            if (navGame) navGame.classList.add('active');
            if (gameTab) {
                gameTab.classList.add('active');
                gameTab.style.display = 'block';
            }
            loadNextQuestion();
            break;
        case 'browse':
            if (navBrowse) navBrowse.classList.add('active');
            if (browseTab) {
                browseTab.classList.add('active');
                browseTab.style.display = 'block';
            }
            loadBrowseTeam();
            break;
        case 'leaderboard':
            if (navLeaderboard) navLeaderboard.classList.add('active');
            if (leaderboardTab) {
                leaderboardTab.classList.add('active');
                leaderboardTab.style.display = 'block';
            }
            loadLeaderboard();
            break;
        case 'profile':
            if (navProfile) navProfile.classList.add('active');
            if (profileTab) {
                profileTab.classList.add('active');
                profileTab.style.display = 'block';
            }
            // Reload user data from Firebase to ensure latest data
            loadUserData().then(() => {
                loadProfileForm();
            });
            break;
    }
}

async function uploadProfilePicture(userId, file) {
    if (!file) return null;
    try {
        const storageRef = ref(storage, `profile-pictures/${userId}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return null;
    }
}

function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    if (!confettiContainer) return;
    
    const colors = ['#ED1B2E', '#7B2D87', '#A558AC', '#10B981', '#F59E0B', '#3B82F6'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// ===================== AUTH FUNCTIONS =====================
// Show/Hide Auth Forms
if (showSignupBtn) {
    showSignupBtn.addEventListener('click', () => {
        switchAuthForm(loginForm, signupForm);
    });
}

if (backToLoginFromSignup) {
    backToLoginFromSignup.addEventListener('click', () => {
        switchAuthForm(signupForm, loginForm);
    });
}

if (showResetPasswordBtn) {
    showResetPasswordBtn.addEventListener('click', () => {
        switchAuthForm(loginForm, resetForm);
    });
}

if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', () => {
        switchAuthForm(resetForm, loginForm);
    });
}

// Login
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = loginEmail.value.trim();
        const password = loginPassword.value;
        
        if (!email || !password) {
            showAlert('Please fill in all fields', authError);
            return;
        }
        
        if (!email.endsWith('@sei.com')) {
            showAlert('Please use a valid @sei.com email address', authError);
            return;
        }
        
        try {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';
            
            await signInWithEmailAndPassword(auth, email, password);
            showAlert('Login successful!', authSuccess, 'success');
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Failed to login. Please try again.';
            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email format';
            }
            showAlert(errorMessage, authError);
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>Login</span><span class="btn-arrow">→</span>'
        }
    });
}

// Signup
if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        
        hideAlert(signupError);
        hideAlert(signupSuccess);
        
        if (!name || !email || !password) {
            showAlert('Please fill in all fields', signupError);
            return;
        }
        
        if (!email.endsWith('@sei.com')) {
            showAlert('Please use a valid @sei.com email address', signupError);
            return;
        }
        
        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long', signupError);
            return;
        }
        
        try {
            signupBtn.disabled = true;
            signupBtn.innerHTML = '<span>Creating Account...</span>';
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await updateProfile(user, { displayName: name });
            
            await setDoc(doc(db, 'users', user.uid), {
                email: email,
                displayName: name,
                clientName: '',
                currentClient: '',
                location: '',
                funFact1: '',
                funFact2: '',
                funFact3: '',
                skillTags: [],
                score: 0,
                answeredQuestions: [],
                createdAt: new Date().toISOString(),
                profileComplete: false
            });
            
            showAlert('Account created successfully!', signupSuccess, 'success');
            setTimeout(() => {
                switchAuthForm(signupForm, loginForm);
            }, 2000);
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'Failed to create account. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak';
            }
            showAlert(errorMessage, signupError);
        } finally {
            signupBtn.disabled = false;
            signupBtn.innerHTML = '<span>Create Account</span><span class="btn-arrow">→</span>'
        }
    });
}

// Reset Password
if (resetPasswordBtn) {
    resetPasswordBtn.addEventListener('click', async () => {
        const email = resetEmail.value.trim();
        
        hideAlert(resetError);
        hideAlert(resetSuccess);
        
        if (!email) {
            showAlert('Please enter your email address', resetError);
            return;
        }
        
        if (!email.endsWith('@sei.com')) {
            showAlert('Please use a valid @sei.com email address', resetError);
            return;
        }
        
        try {
            resetPasswordBtn.disabled = true;
            resetPasswordBtn.innerHTML = '<span>Sending...</span>';
            
            await sendPasswordResetEmail(auth, email);
            showAlert('Password reset email sent! Please check your inbox.', resetSuccess, 'success');
            resetEmail.value = '';
        } catch (error) {
            console.error('Reset password error:', error);
            let errorMessage = 'Failed to send reset email. Please try again.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            }
            showAlert(errorMessage, resetError);
        } finally {
            resetPasswordBtn.disabled = false;
            resetPasswordBtn.innerHTML = '<span>Send Reset Link</span><span class="btn-arrow">→</span>'
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}

// ===================== AUTH STATE OBSERVER =====================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        
        // Hide auth section, show main app
        if (authSection) authSection.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
        
        // Load user data and wait for it to complete
        await loadUserData();
        
        console.log('=== Auth State Check ===');
        console.log('currentUserData after load:', currentUserData);
        
        // Check if profile has required fields - ensure currentUserData is loaded
        if (!currentUserData) {
            console.error('currentUserData is null after loadUserData!');
            showProfileModal();
            return;
        }
        
        // Only show profile modal for brand new users who just signed up
        // Check if this is their first login by seeing if profileModalShown flag exists
        // If the user has logged in before, never show the modal again
        const isFirstLogin = currentUserData.profileModalShown !== true;
        const hasIncompleteProfile = !currentUserData.profileComplete;
        
        console.log('Profile check:', {
            profileComplete: currentUserData.profileComplete,
            profileModalShown: currentUserData.profileModalShown,
            isFirstLogin: isFirstLogin,
            hasIncompleteProfile: hasIncompleteProfile
        });
        
        // Only show modal if it's first login AND profile is incomplete
        if (isFirstLogin && hasIncompleteProfile) {
            console.log('First login with incomplete profile - showing modal');
            // Mark that we've shown the modal so it doesn't appear again
            await updateDoc(doc(db, 'users', currentUser.uid), {
                profileModalShown: true
            });
            currentUserData.profileModalShown = true;
            showProfileModal();
        } else {
            console.log('Not first login or profile complete - loading game');
            // Load game
            switchTab('game');
        }
    } else {
        currentUser = null;
        currentUserData = null;
        
        // Show auth section, hide main app
        if (authSection) authSection.style.display = 'flex';
        if (mainApp) mainApp.style.display = 'none';
    }
});

// ===================== USER DATA FUNCTIONS =====================
async function loadUserData() {
    if (!currentUser) {
        console.error('loadUserData: No current user');
        return;
    }
    
    try {
        console.log('Loading user data for:', currentUser.uid);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists()) {
            currentUserData = userDoc.data();
            console.log('User data loaded successfully:', {
                clientName: currentUserData.clientName,
                currentClient: currentUserData.currentClient,
                location: currentUserData.location,
                skillTags: currentUserData.skillTags?.length || 0,
                hasData: !!currentUserData
            });
            
            // Update header
            if (headerUsername) headerUsername.textContent = currentUserData.displayName || currentUserData.clientName || 'User';
            if (welcomeMessage) welcomeMessage.textContent = `Welcome back, ${currentUserData.displayName || currentUserData.clientName}!`;
            
            // Check both profilePicture and profilePictureURL
            const userPhoto = currentUserData.profilePicture || currentUserData.profilePictureURL;
            if (userPhoto && headerAvatar) {
                headerAvatar.innerHTML = `<img src="${userPhoto}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            }
            
            // Update stats
            userScore = currentUserData.score || 0;
            answeredQuestions = currentUserData.answeredQuestions || [];
            
            // Calculate and update rank
            await updateUserRank();
            
            updateStatsDisplay();
        } else {
            console.log('No user document found - new user');
            currentUserData = null;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        currentUserData = null;
    }
}

async function updateUserRank() {
    try {
        const usersSnapshot = await getDocs(query(collection(db, 'users'), orderBy('score', 'desc')));
        const rankedUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, score: doc.data().score || 0 }));
        
        const userRank = rankedUsers.findIndex(u => u.id === currentUser.uid) + 1;
        
        if (headerRank && userRank > 0) {
            headerRank.textContent = `#${userRank}`;
        }
    } catch (error) {
        console.error('Error calculating user rank:', error);
    }
}

function updateStatsDisplay() {
    if (headerScore) headerScore.textContent = userScore;
    if (dashScore) dashScore.textContent = userScore;
}

// Make header profile clickable to go to Edit Profile
if (headerProfileDiv) {
    headerProfileDiv.addEventListener('click', () => {
        switchTab('profile');
    });
    headerProfileDiv.style.cursor = 'pointer';
}


// ===================== GAME FUNCTIONS =====================

async function loadQuestions() {
    try {
        const questionsRef = collection(db, 'questions');
        const questionsSnapshot = await getDocs(questionsRef);
        allQuestions = [];
        
        questionsSnapshot.forEach((doc) => {
            const data = doc.data();
            allQuestions.push({
                id: doc.id,
                ...data
            });
        });
        
        console.log(`Loaded ${allQuestions.length} questions`);
        return allQuestions;
    } catch (error) {
        console.error('Error loading questions:', error);
        return [];
    }
}

async function loadNextQuestion() {
    if (!currentUser || !currentUserData) {
        console.error('User not loaded');
        return;
    }
    
    try {
        // Load questions if not already loaded
        if (allQuestions.length === 0) {
            await loadQuestions();
        }
        
        // Filter out already answered questions
        const unanswered = allQuestions.filter(q => !answeredQuestions.includes(q.id));
        
        if (unanswered.length === 0) {
            if (questionCard) {
                questionCard.innerHTML = `
                    <div style="text-align:center;padding:60px 20px;">
                        <div style="font-size:72px;margin-bottom:20px;">🎉</div>
                        <h2 style="color:#ED1B2E;margin-bottom:12px;">All Caught Up!</h2>
                        <p style="color:#6B7280;margin-bottom:30px;">You've answered all available questions. Check back later for more!</p>
                        <button class="btn btn-secondary" onclick="window.location.reload()">
                            <span>Refresh</span>
                        </button>
                    </div>
                `;
            }
            return;
        }
        
        // Get random question
        currentQuestion = unanswered[Math.floor(Math.random() * unanswered.length)];
        selectedAnswers = [];
        
        console.log('Displaying question:', currentQuestion);
        
        // Display question
        displayQuestion(currentQuestion);
        
        // Show submit button, hide next button and feedback
        if (submitAnswerBtn) submitAnswerBtn.style.display = 'block';
        if (nextQuestionBtn) nextQuestionBtn.style.display = 'none';
        if (answerFeedback) answerFeedback.style.display = 'none';
        
    } catch (error) {
        console.error('Error loading next question:', error);
        showAlert('Failed to load question. Please try again.', gameError);
    }
}

function displayQuestion(question) {
    if (!questionCard) return;
    
    // Update question metadata
    if (questionNumber) {
        questionNumber.textContent = `Question #${answeredQuestions.length + 1}`;
    }
    
    if (questionType) {
        const typeText = question.type === 'multi-select' ? 'Multiple Choice' : 'Single Choice';
        questionType.textContent = typeText;
        questionType.className = 'question-type ' + (question.type === 'multi-select' ? 'type-multi' : 'type-single');
    }
    
    if (questionText) {
        questionText.textContent = question.question;
    }
    
    // Display images if present
    if (questionImages && question.images && question.images.length > 0) {
        questionImages.innerHTML = '';
        question.images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Question image';
            img.style.cssText = 'max-width:100%;border-radius:12px;margin-bottom:16px;';
            questionImages.appendChild(img);
        });
        questionImages.style.display = 'block';
    } else if (questionImages) {
        questionImages.style.display = 'none';
    }
    
    // Display options
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.dataset.index = index;
            
            // Handle different option types
            let optionContent = '';
            if (typeof option === 'object' && option.userId) {
                // User-based option
                optionContent = `
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div class="option-avatar" style="width:40px;height:40px;border-radius:50%;background:#7B2D87;color:white;display:flex;align-items:center;justify-content:center;font-weight:600;">
                            ${option.name ? option.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                            <div style="font-weight:600;color:#1F2937;">${option.name || 'Unknown'}</div>
                            ${option.location ? `<div style="font-size:13px;color:#6B7280;">${option.location}</div>` : ''}
                        </div>
                    </div>
                `;
            } else {
                // Regular text option
                optionContent = `<span>${option}</span>`;
            }
            
            optionDiv.innerHTML = `
                <div class="option-content">${optionContent}</div>
                <div class="option-check">✓</div>
            `;
            
            optionDiv.addEventListener('click', () => selectOption(index, question.type));
            optionsContainer.appendChild(optionDiv);
        });
    }
}

function selectOption(index, questionType) {
    if (questionType === 'multi-select') {
        // Multi-select: toggle selection
        if (selectedAnswers.includes(index)) {
            selectedAnswers = selectedAnswers.filter(i => i !== index);
        } else {
            selectedAnswers.push(index);
        }
    } else {
        // Single select: replace selection
        selectedAnswers = [index];
    }
    
    // Update UI
    if (optionsContainer) {
        const options = optionsContainer.querySelectorAll('.option');
        options.forEach((opt, i) => {
            if (selectedAnswers.includes(i)) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });
    }
}

async function submitAnswer() {
    if (!currentQuestion || selectedAnswers.length === 0) {
        showAlert('Please select an answer', gameError);
        return;
    }
    
    hideAlert(gameError);
    hideAlert(gameSuccess);
    
    // Disable submit button
    if (submitAnswerBtn) submitAnswerBtn.disabled = true;
    
    try {
        // Calculate score
        const correctAnswers = currentQuestion.correctAnswers || [];
        let points = 0;
        let isCorrect = false;
        
        if (currentQuestion.type === 'multi-select') {
            // Partial credit for multi-select
            const correctSelected = selectedAnswers.filter(a => correctAnswers.includes(a)).length;
            const incorrectSelected = selectedAnswers.filter(a => !correctAnswers.includes(a)).length;
            
            if (incorrectSelected === 0 && correctSelected === correctAnswers.length) {
                // Perfect answer
                points = 10;
                isCorrect = true;
            } else if (correctSelected > 0 && incorrectSelected === 0) {
                // Partial credit
                points = Math.floor((correctSelected / correctAnswers.length) * 10);
                isCorrect = true;
            }
        } else {
            // Single select
            isCorrect = correctAnswers.includes(selectedAnswers[0]);
            points = isCorrect ? 10 : 0;
        }
        
        // Update user data
        userScore += points;
        answeredQuestions.push(currentQuestion.id);
        
        // Update streak
        if (isCorrect) {
            currentStreak++;
        } else {
            currentStreak = 0;
        }
        
        // Save to Firebase
        await updateDoc(doc(db, 'users', currentUser.uid), {
            score: userScore,
            answeredQuestions: answeredQuestions,
            currentStreak: currentStreak,
            totalAnswered: answeredQuestions.length
        });
        
        // Update UI
        updateDashboardStats();
        await updateUserRank();
        
        // Show feedback
        displayFeedback(isCorrect, points, correctAnswers);
        
        // Hide submit, show next button
        if (submitAnswerBtn) submitAnswerBtn.style.display = 'none';
        if (nextQuestionBtn) nextQuestionBtn.style.display = 'block';
        
    } catch (error) {
        console.error('Error submitting answer:', error);
        showAlert('Failed to submit answer. Please try again.', gameError);
        if (submitAnswerBtn) submitAnswerBtn.disabled = false;
    }
}

function displayFeedback(isCorrect, points, correctAnswers) {
    if (!answerFeedback) return;
    
    // Highlight correct/incorrect options
    if (optionsContainer) {
        const options = optionsContainer.querySelectorAll('.option');
        options.forEach((opt, i) => {
            if (correctAnswers.includes(i)) {
                opt.classList.add('correct');
            } else if (selectedAnswers.includes(i)) {
                opt.classList.add('incorrect');
            }
            opt.style.pointerEvents = 'none';
        });
    }
    
    // Show feedback message
    if (feedbackIcon) {
        feedbackIcon.textContent = isCorrect ? '🎉' : '❌';
    }
    
    if (feedbackText) {
        if (isCorrect) {
            feedbackText.innerHTML = '<strong>Correct!</strong> Great job!';
        } else {
            feedbackText.innerHTML = '<strong>Not quite right.</strong> Better luck next time!';
        }
    }
    
    if (feedbackScore) {
        feedbackScore.textContent = `+${points} points`;
    }
    
    answerFeedback.className = 'answer-feedback ' + (isCorrect ? 'feedback-correct' : 'feedback-incorrect');
    answerFeedback.style.display = 'flex';
}

function updateDashboardStats() {
    if (dashScore) dashScore.textContent = userScore;
    if (dashStreak) dashStreak.textContent = currentStreak;
    if (dashAnswered) dashAnswered.textContent = answeredQuestions.length;
    
    if (headerScore) headerScore.textContent = userScore;
    if (headerStreak) headerStreak.textContent = currentStreak;
    
    // Calculate accuracy
    if (dashAccuracy && answeredQuestions.length > 0) {
        const accuracy = Math.round((userScore / (answeredQuestions.length * 10)) * 100);
        dashAccuracy.textContent = `${accuracy}%`;
    }
}

// Event listeners for game buttons
if (submitAnswerBtn) {
    submitAnswerBtn.addEventListener('click', submitAnswer);
}

if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener('click', loadNextQuestion);
}

// ===================== PROFILE MODAL =====================
function showProfileModal() {
    if (profileModal) {
        profileModal.style.display = 'flex';
    }
}

function hideProfileModal() {
    if (profileModal) {
        profileModal.style.display = 'none';
    }
}

// Modal Photo Upload
if (modalUploadPhotoBtn) {
    modalUploadPhotoBtn.addEventListener('click', () => {
        if (modalProfilePictureInput) modalProfilePictureInput.click();
    });
}

if (modalProfilePictureInput) {
    modalProfilePictureInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            modalProfilePictureFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('modalProfilePicturePreview');
                if (preview) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Modal Skills Autocomplete
if (modalProfileSkills) {
    modalProfileSkills.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        if (searchTerm.length < 2) {
            if (modalTagsDropdown) modalTagsDropdown.style.display = 'none';
            return;
        }
        
        const matchingTags = defaultSkillTags.filter(tag => 
            tag.toLowerCase().includes(searchTerm) && !modalSelectedSkillTags.includes(tag)
        );
        
        if (modalTagsDropdown) {
            modalTagsDropdown.innerHTML = '';
            
            // Show matching predefined skills
            if (matchingTags.length > 0) {
                matchingTags.slice(0, 10).forEach(tag => {
                    const option = document.createElement('div');
                    option.className = 'tag-option';
                    option.textContent = tag;
                    option.addEventListener('click', () => {
                        addModalSkillTag(tag);
                        modalProfileSkills.value = '';
                        modalTagsDropdown.style.display = 'none';
                    });
                    modalTagsDropdown.appendChild(option);
                });
            }
            
            // Always show "Add custom skill" option
            const customOption = document.createElement('div');
            customOption.className = 'tag-option';
            customOption.style.cssText = 'background:#F3F4F6;border-top:1px solid #E5E7EB;font-weight:600;color:#ED1B2E;';
            customOption.innerHTML = `➢ Add "${profileSkills.value.trim()}" as custom skill`;
            customOption.addEventListener('click', () => {
                addModalSkillTag(modalProfileSkills.value.trim());
                modalProfileSkills.value = '';
                modalTagsDropdown.style.display = 'none';
            });
            modalTagsDropdown.appendChild(customOption);
            
            modalTagsDropdown.style.display = 'block';
        }
    });
    
    // Allow adding custom skills by pressing Enter
    modalProfileSkills.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const customSkill = modalProfileSkills.value.trim();
            if (customSkill && customSkill.length >= 2) {
                addModalSkillTag(customSkill);
                modalProfileSkills.value = '';
                if (modalTagsDropdown) modalTagsDropdown.style.display = 'none';
            }
        }
    });
    
    // Update placeholder to be more helpful
    modalProfileSkills.placeholder = 'Type skill name and press Enter';
}

// ===================== AUTH FUNCTIONS =====================
// Show/Hide Auth Forms
if (showSignupBtn) {
    showSignupBtn.addEventListener('click', () => {
        switchAuthForm(loginForm, signupForm);
    });
}

if (backToLoginFromSignup) {
    backToLoginFromSignup.addEventListener('click', () => {
        switchAuthForm(signupForm, loginForm);
    });
}

if (showResetPasswordBtn) {
    showResetPasswordBtn.addEventListener('click', () => {
        switchAuthForm(loginForm, resetForm);
    });
}

if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', () => {
        switchAuthForm(resetForm, loginForm);
    });
}

// Login
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = loginEmail.value.trim();
        const password = loginPassword.value;
        
        if (!email || !password) {
            showAlert('Please fill in all fields', authError);
            return;
        }
        
        if (!email.endsWith('@sei.com')) {
            showAlert('Please use a valid @sei.com email address', authError);
            return;
        }
        
        try {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';
            
            await signInWithEmailAndPassword(auth, email, password);
            showAlert('Login successful!', authSuccess, 'success');
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Failed to login. Please try again.';
            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email format';
            }
            showAlert(errorMessage, authError);
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>Login</span><span class="btn-arrow">→</span>'
        }
    });
}

// Signup
if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        
        hideAlert(signupError);
        hideAlert(signupSuccess);
        
        if (!name || !email || !password) {
            showAlert('Please fill in all fields', signupError);
            return;
        }
        
        if (!email.endsWith('@sei.com')) {
            showAlert('Please use a valid @sei.com email address', signupError);
            return;
        }
        
        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long', signupError);
            return;
        }
        
        try {
            signupBtn.disabled = true;
            signupBtn.innerHTML = '<span>Creating Account...</span>';
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await updateProfile(user, { displayName: name });
            
            await setDoc(doc(db, 'users', user.uid), {
                email: email,
                displayName: name,
                clientName: '',
                currentClient: '',
                location: '',
                funFact1: '',
                funFact2: '',
                funFact3: '',
                skillTags: [],
                score: 0,
                answeredQuestions: [],
                createdAt: new Date().toISOString(),
                profileComplete: false
            });
            
            showAlert('Account created successfully!', signupSuccess, 'success');
            setTimeout(() => {
                switchAuthForm(signupForm, loginForm);
            }, 2000);
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'Failed to create account. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak';
            }
            showAlert(errorMessage, signupError);
        } finally {
            signupBtn.disabled = false;
            signupBtn.innerHTML = '<span>Create Account</span><span class="btn-arrow">→</span>'
        }
    });
}

// Reset Password
if (resetPasswordBtn) {
    resetPasswordBtn.addEventListener('click', async () => {
        const email = resetEmail.value.trim();
        
        hideAlert(resetError);
        hideAlert(resetSuccess);
        
        if (!email) {
            showAlert('Please enter your email address', resetError);
            return;
        }
        
        if (!email.endsWith('@sei.com')) {
            showAlert('Please use a valid @sei.com email address', resetError);
            return;
        }
        
        try {
            resetPasswordBtn.disabled = true;
            resetPasswordBtn.innerHTML = '<span>Sending...</span>';
            
            await sendPasswordResetEmail(auth, email);
            showAlert('Password reset email sent! Please check your inbox.', resetSuccess, 'success');
            resetEmail.value = '';
        } catch (error) {
            console.error('Reset password error:', error);
            let errorMessage = 'Failed to send reset email. Please try again.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            }
            showAlert(errorMessage, resetError);
        } finally {
            resetPasswordBtn.disabled = false;
            resetPasswordBtn.innerHTML = '<span>Send Reset Link</span><span class="btn-arrow">→</span>'
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}

// ===================== AUTH STATE OBSERVER =====================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        
        // Hide auth section, show main app
        if (authSection) authSection.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
        
        // Load user data and wait for it to complete
        await loadUserData();
        
        console.log('=== Auth State Check ===');
        console.log('currentUserData after load:', currentUserData);
        
        // Check if profile has required fields - ensure currentUserData is loaded
        if (!currentUserData) {
            console.error('currentUserData is null after loadUserData!');
            showProfileModal();
            return;
        }
        
        // Only show profile modal for brand new users who just signed up
        // Check if this is their first login by seeing if profileModalShown flag exists
        // If the user has logged in before, never show the modal again
        const isFirstLogin = currentUserData.profileModalShown !== true;
        const hasIncompleteProfile = !currentUserData.profileComplete;
        
        console.log('Profile check:', {
            profileComplete: currentUserData.profileComplete,
            profileModalShown: currentUserData.profileModalShown,
            isFirstLogin: isFirstLogin,
            hasIncompleteProfile: hasIncompleteProfile
        });
        
        // Only show modal if it's first login AND profile is incomplete
        if (isFirstLogin && hasIncompleteProfile) {
            console.log('First login with incomplete profile - showing modal');
            // Mark that we've shown the modal so it doesn't appear again
            await updateDoc(doc(db, 'users', currentUser.uid), {
                profileModalShown: true
            });
            currentUserData.profileModalShown = true;
            showProfileModal();
        } else {
            console.log('Not first login or profile complete - loading game');
            // Load game
            switchTab('game');
        }
    } else {
        currentUser = null;
        currentUserData = null;
        
        // Show auth section, hide main app
        if (authSection) authSection.style.display = 'flex';
        if (mainApp) mainApp.style.display = 'none';
    }
});

// ===================== BROWSE TEAM FUNCTIONS =====================
async function loadBrowseTeam() {
    try {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        allUsers = [];
        
        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            allUsers.push({
                id: doc.id,
                ...userData
            });
        });
        
        console.log(`Loaded ${allUsers.length} users for browse`);
        
        // Populate location and skill filters
        populateFilters();
        
        // Display all users initially
        filterUsers();
        
    } catch (error) {
        console.error('Error loading browse team:', error);
    }
}

function populateFilters() {
    // Populate location filter
    const locations = [...new Set(allUsers.map(u => u.location).filter(l => l))];
    if (locationFilter) {
        locationFilter.innerHTML = '<option value="">All Locations</option>';
        locations.sort().forEach(loc => {
            const option = document.createElement('option');
            option.value = loc;
            option.textContent = loc;
            locationFilter.appendChild(option);
        });
    }
    
    // Populate skill filter
    const skills = new Set();
    allUsers.forEach(user => {
        if (user.skillTags && Array.isArray(user.skillTags)) {
            user.skillTags.forEach(skill => skills.add(skill));
        }
    });
    
    if (skillFilter) {
        skillFilter.innerHTML = '<option value="">All Skills</option>';
        [...skills].sort().forEach(skill => {
            const option = document.createElement('option');
            option.value = skill;
            option.textContent = skill;
            skillFilter.appendChild(option);
        });
    }
}

function filterUsers() {
    const searchTerm = teamSearch ? teamSearch.value.toLowerCase() : '';
    const locationValue = locationFilter ? locationFilter.value : '';
    const skillValue = skillFilter ? skillFilter.value : '';
    
    const filtered = allUsers.filter(user => {
        // Search filter
        const matchesSearch = !searchTerm || 
            (user.clientName && user.clientName.toLowerCase().includes(searchTerm)) ||
            (user.displayName && user.displayName.toLowerCase().includes(searchTerm)) ||
            (user.currentClient && user.currentClient.toLowerCase().includes(searchTerm));
        
        // Location filter
        const matchesLocation = !locationValue || user.location === locationValue;
        
        // Skill filter
        const matchesSkill = !skillValue || 
            (user.skillTags && user.skillTags.includes(skillValue));
        
        return matchesSearch && matchesLocation && matchesSkill;
    });
    
    displayUsers(filtered);
}

function displayUsers(users) {
    if (!teamTableBody) return;
    
    if (users.length === 0) {
        teamTableBody.innerHTML = '';
        if (tableEmpty) tableEmpty.style.display = 'block';
        return;
    }
    
    if (tableEmpty) tableEmpty.style.display = 'none';
    
    teamTableBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        
        const photoCell = document.createElement('td');
        const userPhoto = user.profilePicture || user.profilePictureURL;
        if (userPhoto) {
            photoCell.innerHTML = `<img src="${userPhoto}" alt="${user.clientName || user.displayName}" class="team-avatar">`;
        } else {
            photoCell.innerHTML = `<div class="team-avatar-placeholder">${(user.clientName || user.displayName || '?').charAt(0).toUpperCase()}</div>`;
        }
        row.appendChild(photoCell);
        
        const nameCell = document.createElement('td');
        nameCell.textContent = user.clientName || user.displayName || 'Unknown';
        row.appendChild(nameCell);
        
        const clientCell = document.createElement('td');
        clientCell.textContent = user.currentClient || '-';
        row.appendChild(clientCell);
        
        const locationCell = document.createElement('td');
        locationCell.textContent = user.location || '-';
        row.appendChild(locationCell);
        
        const skillsCell = document.createElement('td');
        if (user.skillTags && user.skillTags.length > 0) {
            skillsCell.innerHTML = user.skillTags.slice(0, 3).map(skill => 
                `<span class="skill-badge">${skill}</span>`
            ).join('');
            if (user.skillTags.length > 3) {
                skillsCell.innerHTML += `<span class="skill-badge">+${user.skillTags.length - 3} more</span>`;
            }
        } else {
            skillsCell.textContent = '-';
        }
        row.appendChild(skillsCell);
        
        teamTableBody.appendChild(row);
    });
}

// Add event listeners for filters
if (teamSearch) teamSearch.addEventListener('input', filterUsers);
if (locationFilter) locationFilter.addEventListener('change', filterUsers);
if (skillFilter) skillFilter.addEventListener('change', filterUsers);

// ===================== LEADERBOARD FUNCTIONS =====================
async function loadLeaderboard() {
    try {
        const usersSnapshot = await getDocs(query(collection(db, 'users'), orderBy('score', 'desc'), limit(100)));
        const topUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        renderLeaderboard(topUsers);
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

function renderLeaderboard(users) {
    if (!leaderboardList) return;
    
    leaderboardList.innerHTML = '';
    
    if (users.length === 0) {
        leaderboardList.innerHTML = '<p class="text-center">No users on the leaderboard yet</p>';
        return;
    }
    
    users.forEach((user, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        item.style.cursor = 'pointer';
        item.title = 'Click to view profile';
        
        // Add hover effect
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#F9FAFB';
        });
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = '';
        });
        
        // Make entire item clickable
        item.addEventListener('click', () => {
            showUserProfileModal(user);
        });
        
        // Check both profilePicture and profilePictureURL
        const userPhoto = user.profilePicture || user.profilePictureURL;
        
        item.innerHTML = `
            <div class="leaderboard-rank">${index + 1}</div>
            ${userPhoto ? 
                `<img src="${userPhoto}" class="leaderboard-avatar" alt="${user.clientName || user.displayName}">` :
                '<div class="leaderboard-avatar" style="display:flex;align-items:center;justify-content:center;background:#7B2D87;color:white;width:48px;height:48px;border-radius:50%;">🏤</div>'
            }
            <div class="leaderboard-info">
                <div class="leaderboard-name">${user.clientName || user.displayName || 'Unknown'}</div>
                <div class="leaderboard-details">${user.location || 'Unknown Location'} • ${user.currentClient || 'No Client'}</div>
            </div>
            <div class="leaderboard-score">${user.score || 0}</div>
        `;
        
        leaderboardList.appendChild(item);
    });
}

// ===================== PROFILE FORM FUNCTIONS =====================
function loadProfileForm() {
    if (!currentUserData) {
        console.error('loadProfileForm: No currentUserData available');
        return;
    }
    
    console.log('=== Loading Profile Form ===');
    console.log('Full currentUserData:', JSON.stringify(currentUserData, null, 2));
    
    // Check both formats: funFacts array (admin) and funFact1/2/3 (legacy)
    const funFacts = currentUserData.funFacts || [];
    console.log('Fun Facts array from DB:', funFacts);
    console.log('Fun Fact 1 from DB:', currentUserData.funFact1 || funFacts[0]);
    console.log('Fun Fact 2 from DB:', currentUserData.funFact2 || funFacts[1]);
    console.log('Fun Fact 3 from DB:', currentUserData.funFact3 || funFacts[2]);
    
    if (profileName) {
        profileName.value = currentUserData.clientName || currentUserData.displayName || '';
        console.log('Loaded name:', profileName.value);
    }
    if (profileClient) {
        profileClient.value = currentUserData.currentClient || '';
        console.log('Loaded client:', profileClient.value);
    }
    if (profileLocation) {
        profileLocation.value = currentUserData.location || '';
        console.log('Loaded location:', profileLocation.value);
    }
    
    // Fun Facts with detailed logging - support both formats
    if (profileFunFact1) {
        const fact1 = currentUserData.funFact1 || funFacts[0] || '';
        profileFunFact1.value = fact1;
        console.log('Setting funFact1 textarea to:', fact1);
        console.log('Textarea element exists:', !!profileFunFact1);
        console.log('Textarea value after set:', profileFunFact1.value);
    } else {
        console.error('profileFunFact1 element not found!');
    }
    
    if (profileFunFact2) {
        const fact2 = currentUserData.funFact2 || funFacts[1] || '';
        profileFunFact2.value = fact2;
        console.log('Setting funFact2 textarea to:', fact2);
        console.log('Textarea value after set:', profileFunFact2.value);
    } else {
        console.error('profileFunFact2 element not found!');
    }
    
    if (profileFunFact3) {
        const fact3 = currentUserData.funFact3 || funFacts[2] || '';
        profileFunFact3.value = fact3;
        console.log('Setting funFact3 textarea to:', fact3);
        console.log('Textarea value after set:', profileFunFact3.value);
    } else {
        console.error('profileFunFact3 element not found!');
    }
    
    // Update profile stats
    const profileScore = document.getElementById('profileScore');
    const profileRank = document.getElementById('profileRank');
    if (profileScore) profileScore.textContent = userScore || 0;
    if (profileRank && headerRank) profileRank.textContent = headerRank.textContent;
    
    // Check both skillTags and skills
    selectedSkillTags = currentUserData.skillTags || currentUserData.skills || [];
    console.log('Loaded skills:', selectedSkillTags);
    renderSkillTags();
    
    // Check both profilePicture and profilePictureURL
    const userPhoto = currentUserData.profilePicture || currentUserData.profilePictureURL;
    if (userPhoto && profilePicturePreview) {
        profilePicturePreview.innerHTML = `<img src="${userPhoto}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        console.log('Loaded profile picture');
    }
    
    console.log('=== Profile Form Load Complete ===');
}

// Profile Photo Upload
if (uploadPhotoBtn) {
    uploadPhotoBtn.addEventListener('click', () => {
        if (profilePictureInput) profilePictureInput.click();
    });
}

if (profilePictureInput) {
    profilePictureInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            profilePictureFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                if (profilePicturePreview) {
                    profilePicturePreview.innerHTML = `<img src="${e.target.result}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Profile Skills Autocomplete
if (profileSkills) {
    profileSkills.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        if (searchTerm.length < 2) {
            if (tagsDropdown) tagsDropdown.style.display = 'none';
            return;
        }
        
        const matchingTags = defaultSkillTags.filter(tag => 
            tag.toLowerCase().includes(searchTerm) && !selectedSkillTags.includes(tag)
        );
        
        if (tagsDropdown) {
            tagsDropdown.innerHTML = '';
            
            // Show matching predefined skills
            if (matchingTags.length > 0) {
                matchingTags.slice(0, 10).forEach(tag => {
                    const option = document.createElement('div');
                    option.className = 'tag-option';
                    option.textContent = tag;
                    option.addEventListener('click', () => {
                        addSkillTag(tag);
                        profileSkills.value = '';
                        tagsDropdown.style.display = 'none';
                    });
                    tagsDropdown.appendChild(option);
                });
            }
            
            // Always show "Add custom skill" option
            const customOption = document.createElement('div');
            customOption.className = 'tag-option';
            customOption.style.cssText = 'background:#F3F4F6;border-top:1px solid #E5E7EB;font-weight:600;color:#ED1B2E;';
            customOption.innerHTML = `➢ Add "${profileSkills.value.trim()}" as custom skill`;
            customOption.addEventListener('click', () => {
                addSkillTag(profileSkills.value.trim());
                profileSkills.value = '';
                tagsDropdown.style.display = 'none';
            });
            tagsDropdown.appendChild(customOption);
            
            tagsDropdown.style.display = 'block';
        }
    });
    
    // Allow adding custom skills by pressing Enter
    profileSkills.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const customSkill = profileSkills.value.trim();
            if (customSkill && customSkill.length >= 2) {
                addSkillTag(customSkill);
                profileSkills.value = '';
                if (tagsDropdown) tagsDropdown.style.display = 'none';
            }
        }
    });
    
    // Update placeholder to be more helpful
    profileSkills.placeholder = 'Type skill name and press Enter (e.g., "Kubernetes")';
}

function addSkillTag(tag) {
    if (!selectedSkillTags.includes(tag)) {
        selectedSkillTags.push(tag);
        renderSkillTags();
    }
}

function removeSkillTag(tag) {
    selectedSkillTags = selectedSkillTags.filter(t => t !== tag);
    renderSkillTags();
}

function renderSkillTags() {
    if (!selectedTags) return;
    
    selectedTags.innerHTML = '';
    selectedSkillTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            <span>${tag}</span>
            <button class="tag-remove" onclick="window.removeSkillTag('${tag.replace(/'/g, "\\'")}')">×</button>
        `;
        selectedTags.appendChild(tagElement);
    });
}

// Expose remove function to window for onclick
window.removeSkillTag = removeSkillTag;

// Profile Form Submit
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = profileName.value.trim();
        const client = profileClient.value.trim();
        const location = profileLocation.value.trim();
        const funFact1 = profileFunFact1.value.trim();
        const funFact2 = profileFunFact2.value.trim();
        const funFact3 = profileFunFact3.value.trim();
        
        console.log('=== Saving Profile ===');
        console.log('Fun Fact 1:', funFact1);
        console.log('Fun Fact 2:', funFact2);
        console.log('Fun Fact 3:', funFact3);
        
        hideAlert(profileError);
        hideAlert(profileSuccess);
        
        if (!name || !client || !location) {
            showAlert('Please fill in all required fields (Name, Client, Location)', profileError);
            return;
        }
        
        if (selectedSkillTags.length === 0) {
            showAlert('Please add at least one skill', profileError);
            return;
        }
        
        try {
            const submitBtn = profileForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Saving...';
            }
            
            let profilePictureUrl = currentUserData.profilePicture;
            if (profilePictureFile) {
                profilePictureUrl = await uploadProfilePicture(currentUser.uid, profilePictureFile);
            }
            
            const updateData = {
                clientName: name,
                currentClient: client,
                location: location,
                funFact1: funFact1,
                funFact2: funFact2,
                funFact3: funFact3,
                funFacts: [funFact1, funFact2, funFact3].filter(f => f.length > 0), // Array format for admin compatibility
                skillTags: selectedSkillTags
            };
            
            if (profilePictureUrl) {
                updateData.profilePicture = profilePictureUrl;
            }
            
            console.log('Updating Firebase with:', updateData);
            
            await updateDoc(doc(db, 'users', currentUser.uid), updateData);
            
            console.log('Firebase update successful');
            
            currentUserData = { ...currentUserData, ...updateData };
            
            console.log('Updated currentUserData:', currentUserData);
            
            profilePictureFile = null;
            
            showAlert('Profile updated successfully!', profileSuccess, 'success');
            
            // Update header
            if (headerUsername) headerUsername.textContent = name;
            if (headerAvatar && profilePictureUrl) {
                headerAvatar.innerHTML = `<img src="${profilePictureUrl}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            }
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Save Profile</span><span class="btn-arrow">→</span>';
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showAlert('Failed to update profile. Please try again.', profileError);
            
            const submitBtn = profileForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Save Profile</span><span class="btn-arrow">→</span>';
            }
        }
    });
}

// ===================== INITIALIZE APP =====================
console.log('SEI Engagement Platform initialized!');
