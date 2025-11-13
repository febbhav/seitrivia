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
            loginBtn.innerHTML = '<span>Login</span><span class="btn-arrow">Ã¢” ’</span>';
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
            signupBtn.innerHTML = '<span>Create Account</span><span class="btn-arrow">Ã¢” ’</span>';
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
            resetPasswordBtn.innerHTML = '<span>Send Reset Link</span><span class="btn-arrow">Ã¢” ’</span>';
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
            customOption.innerHTML = `Ã¢Å¾”¢ Add "${modalProfileSkills.value.trim()}" as custom skill`;
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

function addModalSkillTag(tag) {
    if (!modalSelectedSkillTags.includes(tag)) {
        modalSelectedSkillTags.push(tag);
        renderModalSkillTags();
    }
}

function removeModalSkillTag(tag) {
    modalSelectedSkillTags = modalSelectedSkillTags.filter(t => t !== tag);
    renderModalSkillTags();
}

function renderModalSkillTags() {
    if (!modalSelectedTags) return;
    
    modalSelectedTags.innerHTML = '';
    modalSelectedSkillTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            <span>${tag}</span>
            <button class="tag-remove" onclick="window.removeModalSkillTag('${tag.replace(/'/g, "\\'")}')">×</button>
        `;
        modalSelectedTags.appendChild(tagElement);
    });
}

// Expose remove function to window for onclick
window.removeModalSkillTag = removeModalSkillTag;

// Modal Form Submit
if (modalProfileForm) {
    modalProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = modalProfileName.value.trim();
        const client = modalProfileClient.value.trim();
        const location = modalProfileLocation.value.trim();
        
        hideAlert(modalError);
        
        if (!name || !client || !location) {
            showAlert('Please fill in all required fields', modalError);
            return;
        }
        
        if (modalSelectedSkillTags.length === 0) {
            showAlert('Please add at least one skill', modalError);
            return;
        }
        
        try {
            let profilePictureUrl = null;
            if (modalProfilePictureFile) {
                profilePictureUrl = await uploadProfilePicture(currentUser.uid, modalProfilePictureFile);
            }
            
            const updateData = {
                clientName: name,
                currentClient: client,
                location: location,
                skillTags: modalSelectedSkillTags,
                profileComplete: true
            };
            
            if (profilePictureUrl) {
                updateData.profilePicture = profilePictureUrl;
            }
            
            await updateDoc(doc(db, 'users', currentUser.uid), updateData);
            
            currentUserData = { ...currentUserData, ...updateData };
            hideProfileModal();
            switchTab('game');
            createConfetti();
        } catch (error) {
            console.error('Error saving profile:', error);
            showAlert('Failed to save profile. Please try again.', modalError);
        }
    });
}

// ===================== NAVIGATION =====================
if (navGame) navGame.addEventListener('click', () => switchTab('game'));
if (navBrowse) navBrowse.addEventListener('click', () => switchTab('browse'));
if (navLeaderboard) navLeaderboard.addEventListener('click', () => switchTab('leaderboard'));
if (navProfile) navProfile.addEventListener('click', () => switchTab('profile'));

// ===================== GAME FUNCTIONS =====================
async function loadQuestions() {
    try {
        const questionsSnapshot = await getDocs(collection(db, 'questions'));
        // Filter out AI-generated questions that haven't been approved yet
        allQuestions = questionsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(q => !q.aiGenerated); // Only load approved questions
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

async function loadNextQuestion() {
    if (allQuestions.length === 0) {
        await loadQuestions();
    }
    
    // Filter out answered questions AND questions without valid answer options
    const validQuestions = allQuestions.filter(q => {
        // Must not be answered
        if (answeredQuestions.includes(q.id)) return false;
        
        // Must have valid answer options
        if (!q.answerOptions || !Array.isArray(q.answerOptions) || q.answerOptions.length === 0) {
            console.warn('Skipping question without valid answerOptions:', q.id, q.question);
            return false;
        }
        
        return true;
    });
    
    if (validQuestions.length === 0) {
        if (questionText) questionText.textContent = 'Å½”° Congratulations! You\'ve answered all available questions!';
        if (optionsContainer) optionsContainer.innerHTML = '<p style="text-align:center;color:#9CA3AF;margin-top:2rem;">No more questions available. Check back later for new questions!</p>';
        if (submitAnswerBtn) submitAnswerBtn.style.display = 'none';
        return;
    }
    
    // Pick random question from valid questions
    currentQuestion = validQuestions[Math.floor(Math.random() * validQuestions.length)];
    selectedAnswers = [];
    
    // Update UI
    if (questionNumber) questionNumber.textContent = answeredQuestions.length + 1;
    if (questionType) questionType.textContent = currentQuestion.multipleAnswers ? 'Multi-Select' : 'Single Choice';
    if (questionText) questionText.textContent = currentQuestion.question;
    
    // Images
    if (questionImages) {
        questionImages.innerHTML = '';
        if (currentQuestion.images && currentQuestion.images.length > 0) {
            currentQuestion.images.forEach(imgUrl => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.className = 'question-image';
                img.alt = 'Question Image';
                questionImages.appendChild(img);
            });
        }
    }
    
    // Options
    await renderOptions();
    
    // Reset buttons
    if (submitAnswerBtn) {
        submitAnswerBtn.disabled = true;
        submitAnswerBtn.style.display = 'inline-flex';
    }
    if (nextQuestionBtn) nextQuestionBtn.style.display = 'none';
    if (answerFeedback) answerFeedback.style.display = 'none';
    hideAlert(gameError);
    hideAlert(gameSuccess);
}

async function renderOptions() {
    if (!optionsContainer) return;
    
    optionsContainer.innerHTML = '';
    
    // Only render if answerOptions exists and is valid
    if (!currentQuestion.answerOptions || !Array.isArray(currentQuestion.answerOptions) || currentQuestion.answerOptions.length === 0) {
        optionsContainer.innerHTML = '<p style="color:#EF4444;text-align:center;padding:2rem;">⚠️This question needs to be fixed in the admin panel.</p>';
        console.error('Question missing valid answerOptions:', currentQuestion);
        return;
    }
    
    for (const option of currentQuestion.answerOptions) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        
        const checkbox = document.createElement('div');
        checkbox.className = 'option-checkbox';
        
        const text = document.createElement('div');
        text.className = 'option-text';
        text.textContent = option.answer || 'No answer text';
        
        optionDiv.appendChild(checkbox);
        optionDiv.appendChild(text);
        
        // If option has userId, show user info
        if (option.userId) {
            try {
                const userDoc = await getDoc(doc(db, 'users', option.userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    
                    // Check both profilePicture and profilePictureURL
                    const userPhoto = userData.profilePicture || userData.profilePictureURL;
                    
                    const userInfo = document.createElement('div');
                    userInfo.className = 'option-user-info';
                    userInfo.innerHTML = `
                        ${userPhoto ? `<img src="${userPhoto}" class="option-user-avatar" alt="${userData.clientName || userData.displayName}">` : '<div class="option-user-avatar">‘Â¤</div>'}
                        <div class="option-user-details">
                            <div class="option-user-name">${userData.clientName || userData.displayName || 'Unknown'}</div>
                            <div class="option-user-location">${userData.location || 'Unknown Location'}</div>
                        </div>
                    `;
                    optionDiv.appendChild(userInfo);
                }
            } catch (error) {
                console.error('Error loading user data for option:', error);
            }
        }
        
        optionDiv.addEventListener('click', () => selectOption(option.answer, optionDiv));
        optionsContainer.appendChild(optionDiv);
    }
}

function selectOption(answer, element) {
    if (currentQuestion.multipleAnswers) {
        // Multi-select
        if (selectedAnswers.includes(answer)) {
            selectedAnswers = selectedAnswers.filter(a => a !== answer);
            element.classList.remove('selected');
        } else {
            selectedAnswers.push(answer);
            element.classList.add('selected');
        }
    } else {
        // Single select
        document.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('selected'));
        selectedAnswers = [answer];
        element.classList.add('selected');
    }
    
    // Enable submit button
    if (submitAnswerBtn) {
        submitAnswerBtn.disabled = selectedAnswers.length === 0;
    }
}

if (submitAnswerBtn) {
    submitAnswerBtn.addEventListener('click', async () => {
        if (selectedAnswers.length === 0) return;
        
        // Get correct options from answerOptions
        const correctOptions = currentQuestion.answerOptions
            .filter(opt => opt.isCorrect)
            .map(opt => opt.answer);
        
        // Visual feedback on cards
        document.querySelectorAll('.option-item').forEach(opt => {
            opt.style.pointerEvents = 'none';
            const optionText = opt.querySelector('.option-text').textContent;
            
            // Check if this option is correct
            const isCorrect = correctOptions.includes(optionText);
            // Check if user selected this option
            const isSelected = selectedAnswers.includes(optionText);
            
            if (isCorrect) {
                // Correct answer - show in green
                opt.style.background = 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)';
                opt.style.border = '2px solid #10B981';
                opt.classList.add('correct');
                
                // Add checkmark
                const checkbox = opt.querySelector('.option-checkbox');
                if (checkbox) {
                    checkbox.innerHTML = '✓';
                    checkbox.style.background = '#10B981';
                    checkbox.style.color = 'white';
                    checkbox.style.border = 'none';
                }
            } else if (isSelected) {
                // Wrong answer that user selected - show in red
                opt.style.background = 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)';
                opt.style.border = '2px solid #EF4444';
                opt.classList.add('incorrect');
                
                // Add X mark
                const checkbox = opt.querySelector('.option-checkbox');
                if (checkbox) {
                    checkbox.innerHTML = 'Ã¢Å“—';
                    checkbox.style.background = '#EF4444';
                    checkbox.style.color = 'white';
                    checkbox.style.border = 'none';
                }
            } else {
                // Not selected and not correct - fade out
                opt.style.opacity = '0.5';
            }
        });
        
        // Calculate score
        let pointsEarned = 0;
        if (currentQuestion.multipleAnswers) {
            // Multi-select: partial credit
            const correctCount = selectedAnswers.filter(ans => correctOptions.includes(ans)).length;
            const incorrectCount = selectedAnswers.filter(ans => !correctOptions.includes(ans)).length;
            
            if (incorrectCount === 0 && correctCount === correctOptions.length) {
                pointsEarned = 10; // Full points for perfect answer
            } else if (incorrectCount === 0 && correctCount > 0) {
                pointsEarned = Math.floor(10 * (correctCount / correctOptions.length)); // Partial credit
            }
        } else {
            // Single select: all or nothing
            if (correctOptions.includes(selectedAnswers[0])) {
                pointsEarned = 10;
            }
        }
        
        // Update score and answered questions
        userScore += pointsEarned;
        answeredQuestions.push(currentQuestion.id);
        
        // Update Firestore
        try {
            await updateDoc(doc(db, 'users', currentUser.uid), {
                score: userScore,
                answeredQuestions: answeredQuestions
            });
            
            // Update rank after score change
            await updateUserRank();
        } catch (error) {
            console.error('Error updating score:', error);
        }
        
        // Show compact feedback message
        if (answerFeedback) {
            answerFeedback.style.display = 'block';
            
            if (feedbackIcon) {
                feedbackIcon.textContent = pointsEarned > 0 ? '✓' : 'Ã¢Å“—';
                feedbackIcon.className = pointsEarned > 0 ? 'feedback-icon correct' : 'feedback-icon incorrect';
            }
            
            if (feedbackText) {
                if (pointsEarned === 10) {
                    feedbackText.textContent = 'Perfect!';
                } else if (pointsEarned > 0) {
                    feedbackText.textContent = 'Partial credit!';
                } else {
                    feedbackText.textContent = 'Not quite!';
                }
            }
            
            if (feedbackScore) {
                feedbackScore.textContent = `+${pointsEarned} points`;
            }
        }
        
        // Update stats display
        updateStatsDisplay();
        
        // Hide submit button
        if (submitAnswerBtn) submitAnswerBtn.style.display = 'none';
        
        // Show next question button with auto-advance
        if (nextQuestionBtn) {
            nextQuestionBtn.style.display = 'inline-flex';
            
            // Auto-advance after 3 seconds
            let countdown = 3;
            
            const countdownInterval = setInterval(() => {
                nextQuestionBtn.innerHTML = `<span>Next Question (${countdown}s)</span><span class="btn-arrow">Ã¢” ’</span>`;
                countdown--;
                
                if (countdown < 0) {
                    clearInterval(countdownInterval);
                    loadNextQuestion();
                }
            }, 1000);
            
            // Allow manual click to skip countdown
            nextQuestionBtn.onclick = () => {
                clearInterval(countdownInterval);
                loadNextQuestion();
            };
        }
    });
}

if (nextQuestionBtn) {
    // Note: onclick is set dynamically in submitAnswerBtn handler for countdown
    // This is just a fallback
    nextQuestionBtn.addEventListener('click', () => {
        loadNextQuestion();
    });
}

// ===================== BROWSE TEAM FUNCTIONS =====================
async function loadBrowseTeam() {
    try {
        if (teamTableBody) {
            teamTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:#9CA3AF;">Loading team members...</td></tr>';
        }
        
        const usersSnapshot = await getDocs(collection(db, 'users'));
        allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort alphabetically by name
        allUsers.sort((a, b) => {
            const nameA = (a.clientName || a.displayName || 'Unknown').toLowerCase();
            const nameB = (b.clientName || b.displayName || 'Unknown').toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        console.log('Loaded users:', allUsers.length);
        
        populateFilterLists();
        renderBrowseTable(allUsers);
    } catch (error) {
        console.error('Error loading users:', error);
        if (teamTableBody) {
            teamTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:#EF4444;">Error loading team members. Please try again.</td></tr>';
        }
    }
}

function populateFilterLists() {
    const skills = new Set();
    const locations = new Set();
    
    allUsers.forEach(user => {
        if (user.skillTags) user.skillTags.forEach(skill => skills.add(skill));
        if (user.location) locations.add(user.location);
    });
    
    if (skillFilter) {
        // Keep first option
        const firstOption = skillFilter.querySelector('option');
        skillFilter.innerHTML = '';
        if (firstOption) skillFilter.appendChild(firstOption);
        
        Array.from(skills).sort().forEach(skill => {
            const option = document.createElement('option');
            option.value = skill;
            option.textContent = skill;
            skillFilter.appendChild(option);
        });
    }
}

function renderBrowseTable(users) {
    if (!teamTableBody) return;
    
    teamTableBody.innerHTML = '';
    
    if (users.length === 0) {
        teamTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:#9CA3AF;">No team members found</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.title = 'Click to view full profile';
        
        // Add hover effect
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#F9FAFB';
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
        
        // Make entire row clickable
        row.addEventListener('click', () => {
            showUserProfileModal(user);
        });
        
        const avatarCell = document.createElement('td');
        const userPhoto = user.profilePicture || user.profilePictureURL;
        if (userPhoto) {
            avatarCell.innerHTML = `<img src="${userPhoto}" class="table-avatar" alt="${user.clientName || user.displayName}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;">`;
        } else {
            avatarCell.innerHTML = '<div class="table-avatar" style="display:flex;align-items:center;justify-content:center;background:#7B2D87;color:white;width:48px;height:48px;border-radius:50%;">‘Â¤</div>';
        }
        row.appendChild(avatarCell);
        
        const nameCell = document.createElement('td');
        nameCell.className = 'col-name';
        nameCell.textContent = user.clientName || user.displayName || 'Unknown';
        row.appendChild(nameCell);
        
        const locationCell = document.createElement('td');
        locationCell.className = 'col-location';
        locationCell.textContent = user.location || 'N/A';
        row.appendChild(locationCell);
        
        const clientCell = document.createElement('td');
        clientCell.className = 'col-client';
        clientCell.textContent = user.currentClient || 'N/A';
        row.appendChild(clientCell);
        
        const skillsCell = document.createElement('td');
        skillsCell.className = 'col-skills';
        const userSkills = user.skillTags || user.skills || [];
        if (Array.isArray(userSkills) && userSkills.length > 0) {
            // Show first 3 skills
            skillsCell.innerHTML = userSkills.slice(0, 3).map(tag => 
                `<span class="skill-tag" style="background:#F3F4F6;color:#374151;padding:4px 8px;border-radius:4px;font-size:12px;margin:2px;display:inline-block;">${tag}</span>`
            ).join('');
            
            // Add +X badge if there are more skills
            if (userSkills.length > 3) {
                const moreCount = userSkills.length - 3;
                skillsCell.innerHTML += `<span class="skill-tag" style="background:#ED1B2E;color:white;padding:4px 8px;border-radius:4px;font-size:12px;margin:2px;display:inline-block;font-weight:600;">+${moreCount}</span>`;
            }
        } else {
            skillsCell.innerHTML = '<span style="color:#9CA3AF;font-style:italic;font-size:14px;">No skills listed</span>';
        }
        row.appendChild(skillsCell);
        
        teamTableBody.appendChild(row);
    });
}

// Show user profile modal with complete information
function showUserProfileModal(user) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('userProfileModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'userProfileModal';
        modal.className = 'modal-overlay';
        modal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:1000;align-items:center;justify-content:center;padding:1rem;';
        modal.innerHTML = `
            <div class="modal" style="background:white;border-radius:16px;max-width:700px;width:100%;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);">
                <button id="closeUserProfileModal" style="position:absolute;top:1.5rem;right:1.5rem;background:white;border:none;font-size:28px;cursor:pointer;color:#9CA3AF;padding:0;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.1);z-index:10;transition:all 0.2s;" onmouseover="this.style.background='#F3F4F6';this.style.transform='scale(1.1)'" onmouseout="this.style.background='white';this.style.transform='scale(1)'">×</button>
                
                <!-- Header with gradient background -->
                <div style="background:linear-gradient(135deg, #ED1B2E 0%, #7B2D87 100%);padding:3rem 2rem 8rem 2rem;border-radius:16px 16px 0 0;position:relative;">
                    <div style="position:absolute;bottom:-60px;left:50%;transform:translateX(-50%);">
                        <div id="modalUserAvatar" style="width:120px;height:120px;border-radius:50%;border:5px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.1);overflow:hidden;background:#7B2D87;display:flex;align-items:center;justify-content:center;color:white;font-size:48px;">
                            ‘Â¤
                        </div>
                    </div>
                </div>
                
                <!-- Content -->
                <div style="padding:5rem 2rem 2rem 2rem;text-align:center;">
                    <h2 id="modalUserName" style="color:#1F2937;margin:0 0 0.5rem 0;font-size:28px;font-weight:700;"></h2>
                    <div id="modalUserEmail" style="color:#6B7280;font-size:14px;margin-bottom:2rem;"></div>
                    
                    <!-- Info Grid -->
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:2rem;text-align:left;">
                        <div style="background:#F9FAFB;padding:1rem;border-radius:8px;">
                            <div style="color:#6B7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5rem;">“Â Location</div>
                            <div id="modalUserLocation" style="color:#1F2937;font-size:16px;font-weight:600;"></div>
                        </div>
                        <div style="background:#F9FAFB;padding:1rem;border-radius:8px;">
                            <div style="color:#6B7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5rem;">’Â¼ Current Client</div>
                            <div id="modalUserClient" style="color:#1F2937;font-size:16px;font-weight:600;"></div>
                        </div>
                    </div>
                    
                    <!-- Skills -->
                    <div style="text-align:left;">
                        <div style="color:#1F2937;font-size:18px;font-weight:700;margin-bottom:1rem;display:flex;align-items:center;gap:0.5rem;">
                            <span>🎯</span>
                            <span>Skills & Expertise</span>
                        </div>
                        <div id="modalUserSkills" style="display:flex;flex-wrap:wrap;gap:8px;"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close button handler
        document.getElementById('closeUserProfileModal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Update content
    const userName = user.clientName || user.displayName || 'Unknown User';
    document.getElementById('modalUserName').textContent = userName;
    document.getElementById('modalUserEmail').textContent = user.email || '';
    document.getElementById('modalUserLocation').textContent = user.location || 'Not specified';
    document.getElementById('modalUserClient').textContent = user.currentClient || 'Not specified';
    
    // Avatar
    const avatarDiv = document.getElementById('modalUserAvatar');
    const userPhoto = user.profilePicture || user.profilePictureURL;
    if (userPhoto) {
        avatarDiv.innerHTML = `<img src="${userPhoto}" alt="${userName}" style="width:100%;height:100%;object-fit:cover;">`;
    } else {
        avatarDiv.innerHTML = '‘Â¤';
        avatarDiv.style.fontSize = '48px';
    }
    
    // Skills
    const skills = user.skillTags || user.skills || [];
    const skillsDiv = document.getElementById('modalUserSkills');
    if (Array.isArray(skills) && skills.length > 0) {
        skillsDiv.innerHTML = skills.map(skill => 
            `<span style="background:#F3F4F6;color:#374151;padding:8px 14px;border-radius:8px;font-size:14px;font-weight:500;border:1px solid #E5E7EB;">${skill}</span>`
        ).join('');
    } else {
        skillsDiv.innerHTML = '<span style="color:#9CA3AF;font-style:italic;">No skills listed</span>';
    }
    
    // Show modal
    modal.style.display = 'flex';
}

// Filter functionality
function filterUsers() {
    const searchTerm = teamSearch ? teamSearch.value.toLowerCase() : '';
    const locationValue = locationFilter ? locationFilter.value : '';
    const skillValue = skillFilter ? skillFilter.value : '';
    
    const filtered = allUsers.filter(user => {
        const matchesSearch = !searchTerm || 
            (user.clientName && user.clientName.toLowerCase().includes(searchTerm)) ||
            (user.displayName && user.displayName.toLowerCase().includes(searchTerm)) ||
            (user.location && user.location.toLowerCase().includes(searchTerm)) ||
            (user.currentClient && user.currentClient.toLowerCase().includes(searchTerm)) ||
            (user.skillTags && user.skillTags.some(skill => skill.toLowerCase().includes(searchTerm)));
        
        const matchesLocation = !locationValue || user.location === locationValue;
        const matchesSkill = !skillValue || (user.skillTags && user.skillTags.includes(skillValue));
        
        return matchesSearch && matchesLocation && matchesSkill;
    });
    
    renderBrowseTable(filtered);
}

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
                '<div class="leaderboard-avatar" style="display:flex;align-items:center;justify-content:center;background:#7B2D87;color:white;width:48px;height:48px;border-radius:50%;">‘Â¤</div>'
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
            customOption.innerHTML = `Ã¢Å¾”¢ Add "${profileSkills.value.trim()}" as custom skill`;
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
                submitBtn.innerHTML = '<span>Save Profile</span><span class="btn-arrow">Ã¢” ’</span>';
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showAlert('Failed to update profile. Please try again.', profileError);
            
            const submitBtn = profileForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Save Profile</span><span class="btn-arrow">Ã¢” ’</span>';
            }
        }
    });
}

// ===================== INITIALIZE APP =====================
console.log('SEI Engagement Platform initialized!');
