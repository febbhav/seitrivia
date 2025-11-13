import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    setDoc,
    arrayUnion
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import {
    getFunctions,
    httpsCallable
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';

// ============================================
// FIREBASE CONFIGURATION - REPLACE WITH YOUR OWN
// ============================================
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
const functions = getFunctions(app);

// Admin email whitelist - ONLY this email can access admin panel
const ADMIN_EMAIL = 'fshah@sei.com'; // ÃƒÂ¢Ã✅Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â CHANGE THIS TO YOUR ACTUAL EMAIL

// DOM elements - Auth
const authSection = document.getElementById('authSection');
const resetSection = document.getElementById('resetSection');
const adminSection = document.getElementById('adminSection');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const resetEmail = document.getElementById('resetEmail');
const sendResetBtn = document.getElementById('sendResetBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const authError = document.getElementById('authError');
const authSuccess = document.getElementById('authSuccess');
const resetError = document.getElementById('resetError');
const resetSuccess = document.getElementById('resetSuccess');
const adminName = document.getElementById('adminName');
const logoutBtn = document.getElementById('logoutBtn');

// DOM elements - Stats
const totalQuestions = document.getElementById('totalQuestions');
const totalUsers = document.getElementById('totalUsers');

// DOM elements - Tabs
const questionsTab = document.getElementById('questionsTab');
const usersTab = document.getElementById('usersTab');
const addQuestionTab = document.getElementById('addQuestionTab');
const aiQuestionsTab = document.getElementById('aiQuestionsTab');
const validationTab = document.getElementById('validationTab');
const questionsContent = document.getElementById('questionsContent');
const usersContent = document.getElementById('usersContent');
const addQuestionContent = document.getElementById('addQuestionContent');
const aiQuestionsContent = document.getElementById('aiQuestionsContent');
const validationContent = document.getElementById('validationContent');

// DOM elements - Questions
const questionsList = document.getElementById('questionsList');
const questionSearch = document.getElementById('questionSearch');
const questionType = document.getElementById('questionType');
const regularQuestionForm = document.getElementById('regularQuestionForm');
const skillsQuestionForm = document.getElementById('skillsQuestionForm');
const questionText = document.getElementById('questionText');
const hasQuestionImage = document.getElementById('hasQuestionImage');
const questionImageSection = document.getElementById('questionImageSection');
const questionImageUrl = document.getElementById('questionImageUrl');
const hasOptionImages = document.getElementById('hasOptionImages');
const optionsInput = document.getElementById('optionsInput');
const skillsQuestionText = document.getElementById('skillsQuestionText');
const skillTagSelect = document.getElementById('skillTagSelect');
const addQuestionBtn = document.getElementById('addQuestionBtn');
const addQuestionError = document.getElementById('addQuestionError');
const addQuestionSuccess = document.getElementById('addQuestionSuccess');

// DOM elements - AI Questions
const aiQuestionsList = document.getElementById('aiQuestionsList');
const generateAIQuestionsBtn = document.getElementById('generateAIQuestionsBtn');

// DOM elements - Users
const usersList = document.getElementById('usersList');
const userSearch = document.getElementById('userSearch');

// DOM elements - Edit Question Modal
const editQuestionModal = document.getElementById('editQuestionModal');
const closeEditQuestionModal = document.getElementById('closeEditQuestionModal');
const editQuestionText = document.getElementById('editQuestionText');
const editQuestionImage = document.getElementById('editQuestionImage');
const editOptionsInput = document.getElementById('editOptionsInput');
const editRegularForm = document.getElementById('editRegularForm');
const editSkillsForm = document.getElementById('editSkillsForm');
const editSkillsQuestionText = document.getElementById('editSkillsQuestionText');
const editSkillTag = document.getElementById('editSkillTag');
const saveEditQuestionBtn = document.getElementById('saveEditQuestionBtn');
const editQuestionError = document.getElementById('editQuestionError');
const editQuestionSuccess = document.getElementById('editQuestionSuccess');

// DOM elements - Edit User Modal
const editUserModal = document.getElementById('editUserModal');
const closeEditUserModal = document.getElementById('closeEditUserModal');
const editUserName = document.getElementById('editUserName');
const editUserEmail = document.getElementById('editUserEmail');
const editUserCurrentClient = document.getElementById('editUserCurrentClient');
const editUserLocation = document.getElementById('editUserLocation');
const editUserProfilePreview = document.getElementById('editUserProfilePreview');
const editUserProfilePicture = document.getElementById('editUserProfilePicture');
const editUserProfileUrl = document.getElementById('editUserProfileUrl');
const editUserFunFact1 = document.getElementById('editUserFunFact1');
const editUserFunFact2 = document.getElementById('editUserFunFact2');
const editUserFunFact3 = document.getElementById('editUserFunFact3');
const editUserSkillTags = document.getElementById('editUserSkillTags');
const editUserSelectedTags = document.getElementById('editUserSelectedTags');
const editUserTagsDropdown = document.getElementById('editUserTagsDropdown');
const saveEditUserBtn = document.getElementById('saveEditUserBtn');
const editUserError = document.getElementById('editUserError');
const editUserSuccess = document.getElementById('editUserSuccess');

// State
let allQuestions = [];
let allUsers = [];
let allSkillTags = [];
let currentEditQuestionId = null;
let currentEditUserId = null;
let editUserSelectedSkills = [];
let editUserProfilePictureFile = null;

// Utility functions
function showError(message, element) {
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => element.classList.remove('show'), 5000);
}

function showSuccess(message, element) {
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => element.classList.remove('show'), 5000);
}

function showSection(section) {
    [authSection, resetSection, adminSection].forEach(s => s.classList.remove('active'));
    section.classList.add('active');
}

function showTab(tabName) {
    [questionsTab, usersTab, addQuestionTab, aiQuestionsTab, validationTab, migrationTab].forEach(t => t && t.classList.remove('active'));
    [questionsContent, usersContent, addQuestionContent, aiQuestionsContent, validationContent, migrationContent].forEach(c => c && c.classList.remove('active'));

    if (tabName === 'questions') {
        questionsTab.classList.add('active');
        questionsContent.classList.add('active');
    } else if (tabName === 'users') {
        usersTab.classList.add('active');
        usersContent.classList.add('active');
    } else if (tabName === 'addQuestion') {
        addQuestionTab.classList.add('active');
        addQuestionContent.classList.add('active');
    } else if (tabName === 'aiQuestions') {
        aiQuestionsTab.classList.add('active');
        aiQuestionsContent.classList.add('active');
    } else if (tabName === 'validation') {
        validationTab.classList.add('active');
        validationContent.classList.add('active');
    } else if (tabName === 'migration') {
        migrationTab.classList.add('active');
        migrationContent.classList.add('active');
    }
}

// Profile picture upload
async function uploadProfilePicture(userId, file) {
    if (!file) return null;
    const storageRef = ref(storage, `profile-pictures/${userId}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}

// Profile picture preview
editUserProfilePicture.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        editUserProfilePictureFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            editUserProfilePreview.innerHTML = `<img src="${e.target.result}" alt="Profile">`;
        };
        reader.readAsDataURL(file);
    }
});

editUserProfileUrl.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) {
        editUserProfilePreview.innerHTML = `<img src="${url}" alt="Profile" onerror="this.parentElement.innerHTML='ÃƒÂ°Ã✅Â¸‘Ã‚Â¤'">`;
    }
});

// Skills tags functionality
async function loadSkillTags() {
    try {
        const tagsDoc = await getDoc(doc(db, 'system', 'skillTags'));
        if (tagsDoc.exists()) {
            allSkillTags = tagsDoc.data().tags || [];
            
            // Populate skill select dropdowns
            [skillTagSelect, editSkillTag].forEach(select => {
                select.innerHTML = '<option value="">Select a skill...</option>';
                allSkillTags.forEach(tag => {
                    const option = document.createElement('option');
                    option.value = tag;
                    option.textContent = tag;
                    select.appendChild(option);
                });
            });
        }
    } catch (error) {
        console.error('Error loading skill tags:', error);
    }
}

function setupTagsInput(inputElement, dropdownElement, selectedTagsElement, selectedSkillsArray) {
    inputElement.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        
        if (searchTerm.length < 1) {
            dropdownElement.classList.remove('active');
            return;
        }

        const matchingTags = allSkillTags.filter(tag => 
            tag.toLowerCase().includes(searchTerm) && 
            !selectedSkillsArray.includes(tag)
        );

        if (matchingTags.length > 0) {
            dropdownElement.innerHTML = '';
            
            matchingTags.slice(0, 10).forEach(tag => {
                const option = document.createElement('div');
                option.className = 'tag-option';
                option.textContent = tag;
                option.addEventListener('click', () => {
                    addTag(tag, selectedTagsElement, selectedSkillsArray);
                    inputElement.value = '';
                    dropdownElement.classList.remove('active');
                });
                dropdownElement.appendChild(option);
            });

            dropdownElement.classList.add('active');
        } else {
            dropdownElement.classList.remove('active');
        }
    });

    inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = inputElement.value.trim();
            if (value && !selectedSkillsArray.includes(value)) {
                addTag(value, selectedTagsElement, selectedSkillsArray);
                inputElement.value = '';
                dropdownElement.classList.remove('active');
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!inputElement.contains(e.target) && !dropdownElement.contains(e.target)) {
            dropdownElement.classList.remove('active');
        }
    });
}

function addTag(tag, containerElement, skillsArray) {
    if (skillsArray.includes(tag)) return;
    
    skillsArray.push(tag);
    
    const tagElement = document.createElement('div');
    tagElement.className = 'tag-item';
    tagElement.innerHTML = `
        <span>${tag}</span>
        <span class="remove-tag">ÃƒÂ¢Ã✅“Ã¢â‚¬“</span>
    `;
    
    tagElement.querySelector('.remove-tag').addEventListener('click', () => {
        const index = skillsArray.indexOf(tag);
        if (index > -1) {
            skillsArray.splice(index, 1);
        }
        tagElement.remove();
    });
    
    containerElement.appendChild(tagElement);
}

function loadTagsToUI(tags, containerElement, skillsArray) {
    containerElement.innerHTML = '';
    skillsArray.length = 0;
    tags.forEach(tag => {
        addTag(tag, containerElement, skillsArray);
    });
}

// Initialize options input for regular questions
function initializeOptionsInput() {
    optionsInput.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const optionRow = document.createElement('div');
        optionRow.className = 'option-row';
        optionRow.innerHTML = `
            <input type="radio" name="correctAnswer" value="${i}" ${i === 0 ? 'checked' : ''}>
            <div class="option-inputs">
                <input type="text" class="option-text" placeholder="Option ${i + 1}" required>
                <input type="url" class="option-image-url" placeholder="Image URL (optional)" style="display: none;">
            </div>
        `;
        optionsInput.appendChild(optionRow);
    }
}

// Question type change handler
questionType.addEventListener('change', () => {
    if (questionType.value === 'skills') {
        regularQuestionForm.style.display = 'none';
        skillsQuestionForm.style.display = 'block';
    } else {
        regularQuestionForm.style.display = 'block';
        skillsQuestionForm.style.display = 'none';
    }
});

// Toggle question image section
hasQuestionImage.addEventListener('change', () => {
    questionImageSection.style.display = hasQuestionImage.checked ? 'block' : 'none';
});

// Toggle option images
hasOptionImages.addEventListener('change', () => {
    const imageInputs = document.querySelectorAll('.option-image-url');
    imageInputs.forEach(input => {
        input.style.display = hasOptionImages.checked ? 'block' : 'none';
    });
});

// Tab switching
questionsTab.addEventListener('click', () => showTab('questions'));
usersTab.addEventListener('click', () => showTab('users'));
addQuestionTab.addEventListener('click', () => showTab('addQuestion'));
aiQuestionsTab.addEventListener('click', async () => {
    showTab('aiQuestions');
    await loadAIQuestions();
});

// Search functionality
questionSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allQuestions.filter(q => 
        q.question.toLowerCase().includes(searchTerm) ||
        (q.skillTag && q.skillTag.toLowerCase().includes(searchTerm))
    );
    displayQuestions(filtered);
});

userSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allUsers.filter(u =>
        (u.clientName && u.clientName.toLowerCase().includes(searchTerm)) ||
        (u.email && u.email.toLowerCase().includes(searchTerm)) ||
        (u.skills && u.skills.some(s => s.toLowerCase().includes(searchTerm)))
    );
    displayUsers(filtered);
});

// Modal handlers
closeEditQuestionModal.addEventListener('click', () => {
    editQuestionModal.classList.remove('active');
});

closeEditUserModal.addEventListener('click', () => {
    editUserModal.classList.remove('active');
});

// Password reset
forgotPasswordBtn.addEventListener('click', () => {
    showSection(resetSection);
});

backToLoginBtn.addEventListener('click', () => {
    showSection(authSection);
});

sendResetBtn.addEventListener('click', async () => {
    const email = resetEmail.value.trim();

    if (!email) {
        showError('Please enter your email', resetError);
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showSuccess('Password reset email sent! Check your inbox.', resetSuccess);
        setTimeout(() => {
            showSection(authSection);
            resetEmail.value = '';
        }, 3000);
    } catch (error) {
        showError(error.message, resetError);
    }
});

// Authentication
loginBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showError('Please enter email and password', authError);
        return;
    }

    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        showError('Access denied. This admin panel is restricted to authorized administrators only.', authError);
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showSuccess('Logged in successfully!', authSuccess);
    } catch (error) {
        showError('Login failed: ' + error.message, authError);
    }
});

logoutBtn.addEventListener('click', () => signOut(auth));

// Auth state observer
onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
            await signOut(auth);
            showError('Access denied. This admin panel is restricted to authorized administrators only.', authError);
            showSection(authSection);
            return;
        }

        adminName.textContent = user.email;
        showSection(adminSection);
        await loadSkillTags();
        await loadStatistics();
        await loadQuestions();
        await loadUsers();
        initializeOptionsInput();
        setupTagsInput(editUserSkillTags, editUserTagsDropdown, editUserSelectedTags, editUserSelectedSkills);
    } else {
        showSection(authSection);
    }
});

// Load statistics
async function loadStatistics() {
    try {
        const questionsSnapshot = await getDocs(collection(db, 'questions'));
        const usersSnapshot = await getDocs(collection(db, 'users'));

        totalQuestions.textContent = questionsSnapshot.size;
        totalUsers.textContent = usersSnapshot.size;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load questions
async function loadQuestions() {
    questionsList.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading questions...</p></div>';

    try {
        const snapshot = await getDocs(collection(db, 'questions'));

        allQuestions = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (!data.aiGenerated) { // Only show non-AI questions here
                allQuestions.push({ id: doc.id, ...data });
            }
        });

        displayQuestions(allQuestions);
    } catch (error) {
        questionsList.innerHTML = '<p style="text-align: center; color: #c33;">Error loading questions</p>';
        console.error(error);
    }
}

function displayQuestions(questions) {
    if (questions.length === 0) {
        questionsList.innerHTML = '<p style="text-align: center; color: #666;">No questions found.</p>';
        return;
    }

    questionsList.innerHTML = '';

    questions.forEach(q => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';

        let badges = '';
        if (q.questionType === 'skills') {
            badges += '<span class="badge badge-skills">ÃƒÂ°Ã✅Â¸Ã¢â‚¬Å“Ã‚Â Skills Question</span>';
        } else {
            badges += '<span class="badge badge-type">ÃƒÂ¢Ã‚ÂÃ¢â‚¬Å“ Regular Question</span>';
        }
        if (q.hasImages) {
            badges += '<span class="badge badge-image">ÃƒÂ°Ã✅Â¸Ã¢â‚¬“Ã‚Â¼ÃƒÂ¯Ã‚Â¸Ã‚Â Has Images</span>';
        }

        let contentHTML = `
            ${badges}
            <h3>${q.question}</h3>
        `;

        if (q.questionType === 'skills') {
            contentHTML += `<p><strong>Skill Tag:</strong> ${q.skillTag}</p>`;
        } else {
            if (q.questionImage) {
                contentHTML += `<img src="${q.questionImage}" class="image-preview" alt="Question image">`;
            }

            if (q.options) {
                contentHTML += `<ol class="options-list">`;
                q.options.forEach((opt, idx) => {
                    const isCorrect = idx === q.correctAnswer;
                    contentHTML += `<li ${isCorrect ? 'ÃƒÂ¢Ã✅“Ã¢â‚¬Â¦' : ''}</li>`;
                });
                contentHTML += `</ol>`;
            }
        }

        contentHTML += `
            <div class="actions">
                <button class="btn btn-small edit-question-btn" data-id="${q.id}">Edit</button>
                <button class="btn btn-small btn-danger delete-btn" data-id="${q.id}">Delete</button>
            </div>
        `;

        questionItem.innerHTML = contentHTML;
        questionsList.appendChild(questionItem);
    });

    // Add edit handlers
    document.querySelectorAll('.edit-question-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const questionId = e.target.dataset.id;
            openEditQuestionModal(questionId);
        });
    });

    // Add delete handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const questionId = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this question?')) {
                try {
                    await deleteDoc(doc(db, 'questions', questionId));
                    showSuccess('Question deleted successfully!', addQuestionSuccess);
                    await loadStatistics();
                    await loadQuestions();
                } catch (error) {
                    showError('Error deleting question: ' + error.message, addQuestionError);
                }
            }
        });
    });
}

// Load users for answer selection in question editing
async function loadUsersForAnswerSelection(questionData) {
    const userSelectorGrid = document.getElementById('editUserSelectorGrid');
    if (!userSelectorGrid) return;
    
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = [];
        usersSnapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by name
        users.sort((a, b) => (a.clientName || '').localeCompare(b.clientName || ''));
        
        userSelectorGrid.innerHTML = '';
        
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-answer-card';
            userCard.dataset.userId = user.id;
            userCard.style.cssText = `
                border: 2px solid #ddd;
                border-radius: 8px;
                padding: 12px;
                margin: 8px;
                cursor: pointer;
                transition: all 0.2s;
                background: white;
            `;
            
            // Check if this user is currently an answer
            const isSelected = questionData.answerUserIds && questionData.answerUserIds.includes(user.id);
            if (isSelected) {
                userCard.style.borderColor = '#E31837';
                userCard.style.backgroundColor = '#fff5f5';
                userCard.classList.add('selected');
            }
            
            const avatarHtml = user.profilePictureURL ? 
                `<img src="${user.profilePictureURL}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" alt="${user.clientName}">` :
                `<div style="width: 40px; height: 40px; border-radius: 50%; background: #E31837; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">${(user.clientName || 'U').charAt(0)}</div>`;
            
            userCard.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    ${avatarHtml}
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #333;">${user.clientName || 'Unknown'}</div>
                        <div style="font-size: 0.85em; color: #666;">
                            ${user.location ? 'ÃƒÂ°Ã✅Â¸Ã¢â‚¬Å“Ã‚Â ' + user.location : ''} 
                            ${user.currentClient ? ' ÃƒÂ¢Ã¢”šÂ¬Ã‚Â¢ ÃƒÂ°Ã✅Â¸’Ã‚Â¼ ' + user.currentClient : ''}
                        </div>
                        ${user.skills && user.skills.length > 0 ? 
                            `<div style="margin-top: 4px; font-size: 0.8em; color: #888;">Skills: ${user.skills.slice(0, 3).join(', ')}${user.skills.length > 3 ? '...' : ''}</div>` : 
                            ''}
                    </div>
                    <div style="color: ${isSelected ? 'ÃƒÂ¢Ã✅“Ã¢â‚¬Â¦' : 'ÃƒÂ¢Ã✅Â¡Ã‚Âª'}; font-size: 24px;">
                        ${isSelected ? 'ÃƒÂ¢Ã✅“Ã¢â‚¬Â¦' : 'ÃƒÂ¢Ã✅Â¡Ã‚Âª'}
                    </div>
                </div>
            `;
            
            userCard.addEventListener('click', () => {
                const isNowSelected = !userCard.classList.contains('selected');
                userCard.classList.toggle('selected');
                
                if (isNowSelected) {
                    userCard.style.borderColor = '#E31837';
                    userCard.style.backgroundColor = '#fff5f5';
                    userCard.querySelector('div:last-child').textContent = 'ÃƒÂ¢Ã✅“Ã¢â‚¬Â¦';
                    userCard.querySelector('div:last-child').style.color = '#E31837';
                } else {
                    userCard.style.borderColor = '#ddd';
                    userCard.style.backgroundColor = 'white';
                    userCard.querySelector('div:last-child').textContent = 'ÃƒÂ¢Ã✅Â¡Ã‚Âª';
                    userCard.querySelector('div:last-child').style.color = '#ccc';
                }
            });
            
            userSelectorGrid.appendChild(userCard);
        });
        
    } catch (error) {
        console.error('Error loading users for selection:', error);
        userSelectorGrid.innerHTML = '<p style="color: #c33;">Error loading users</p>';
    }
}

// Open edit question modal
async function openEditQuestionModal(questionId) {
    currentEditQuestionId = questionId;
    const questionDoc = await getDoc(doc(db, 'questions', questionId));
    
    if (!questionDoc.exists()) {
        showError('Question not found', editQuestionError);
        return;
    }

    const questionData = questionDoc.data();

    if (questionData.questionType === 'skills') {
        editRegularForm.style.display = 'none';
        editSkillsForm.style.display = 'block';
        editSkillsQuestionText.value = questionData.question;
        editSkillTag.value = questionData.skillTag || '';
    } else {
        editRegularForm.style.display = 'block';
        editSkillsForm.style.display = 'none';
        editQuestionText.value = questionData.question;
        editQuestionImage.value = questionData.questionImage || '';

        // Populate options
        editOptionsInput.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const optionRow = document.createElement('div');
            optionRow.className = 'option-row';
            optionRow.innerHTML = `
                <input type="radio" name="editCorrectAnswer" value="${i}" ${i === questionData.correctAnswer ? 'checked' : ''}>
                <div class="option-inputs">
                    <input type="text" class="edit-option-text" placeholder="Option ${i + 1}" value="${questionData.options[i] || ''}" required>
                    <input type="url" class="edit-option-image-url" placeholder="Image URL (optional)" value="${questionData.optionImages && questionData.optionImages[i] ? questionData.optionImages[i] : ''}">
                </div>
            `;
            editOptionsInput.appendChild(optionRow);
        }
    }

    // Always show user selector section for all question types
    // This allows admins to link existing users as answers for any question
    if (document.getElementById('editUserSelectorSection')) {
        document.getElementById('editUserSelectorSection').style.display = 'block';
    }
    
    // Load all users for selection
    await loadUsersForAnswerSelection(questionData);

    editQuestionModal.classList.add('active');
}

// expose a global helper so inline onclick="editQuestion(id)" works from the validation UI
window.editQuestion = function(questionId) {
    try {
        openEditQuestionModal(questionId);
    } catch (err) {
        console.error('editQuestion wrapper error:', err);
    }
};

// Save edited question
saveEditQuestionBtn.addEventListener('click', async () => {
    if (!currentEditQuestionId) return;

    try {
        const questionDoc = await getDoc(doc(db, 'questions', currentEditQuestionId));
        const questionData = questionDoc.data();

       if (questionData.questionType === 'skills') {
            const question = editSkillsQuestionText.value.trim();
            const skillTag = editSkillTag.value;

            if (!question || !skillTag) {
                showError('Please fill in all fields', editQuestionError);
                return;
            }

            const updateData = {
                question,
                skillTag,
                questionType: 'skills'
            };
            
            // Get selected user IDs for correct answers
            const selectedUserCards = document.querySelectorAll('.user-answer-card.selected');
            if (selectedUserCards.length > 0) {
                const selectedUserIds = Array.from(selectedUserCards).map(card => card.dataset.userId);
                
                // Get ALL users to select random wrong answers
                const allUsersSnapshot = await getDocs(collection(db, 'users'));
                const allUsers = [];
                allUsersSnapshot.forEach(doc => {
                    allUsers.push({ id: doc.id, ...doc.data() });
                });
                
                // Filter out selected users to get potential wrong answers
                const wrongUsers = allUsers.filter(u => !selectedUserIds.includes(u.id));
                
                // Randomly select wrong users (need 4 total options)
                const numWrongNeeded = Math.max(1, 4 - selectedUserIds.length);
                const shuffledWrong = wrongUsers.sort(() => Math.random() - 0.5);
                const selectedWrongUsers = shuffledWrong.slice(0, numWrongNeeded);
                
                // Create answerOptions array
                const answerOptions = [];
                
                // Add correct users
                for (const userId of selectedUserIds) {
                    const user = allUsers.find(u => u.id === userId);
                    if (user) {
                        answerOptions.push({
                            answer: user.clientName || user.displayName || 'Unknown',
                            userId: userId,
                            isCorrect: true
                        });
                    }
                }
                
                // Add wrong users
                for (const user of selectedWrongUsers) {
                    answerOptions.push({
                        answer: user.clientName || user.displayName || 'Unknown',
                        userId: user.id,
                        isCorrect: false
                    });
                }
                
                // Shuffle the options so correct answer isn't always first
                answerOptions.sort(() => Math.random() - 0.5);
                
                updateData.answerOptions = answerOptions;
                updateData.multipleAnswers = selectedUserIds.length > 1;
            }

            await updateDoc(doc(db, 'questions', currentEditQuestionId), updateData);
        
        } else {
            // Regular question
            const question = editQuestionText.value.trim();
            if (!question) {
                showError('Please enter a question', editQuestionError);
                return;
            }

            // Check if user-based answers are selected
            const selectedUserCards = document.querySelectorAll('.user-answer-card.selected');
            
            if (selectedUserCards.length > 0) {
                // USER-BASED ANSWERS: Ignore text options, use selected users
                const selectedUserIds = Array.from(selectedUserCards).map(card => card.dataset.userId);
                
                // Get ALL users
                const allUsersSnapshot = await getDocs(collection(db, 'users'));
                const allUsers = [];
                allUsersSnapshot.forEach(doc => {
                    allUsers.push({ id: doc.id, ...doc.data() });
                });
                
                // Filter out selected users to get potential wrong answers
                const wrongUsers = allUsers.filter(u => !selectedUserIds.includes(u.id));
                
                // Randomly select wrong users (need 4 total options)
                const numWrongNeeded = Math.max(1, 4 - selectedUserIds.length);
                const shuffledWrong = wrongUsers.sort(() => Math.random() - 0.5);
                const selectedWrongUsers = shuffledWrong.slice(0, numWrongNeeded);
                
                // Create answerOptions array
                const answerOptions = [];
                
                // Add correct users
                for (const userId of selectedUserIds) {
                    const user = allUsers.find(u => u.id === userId);
                    if (user) {
                        answerOptions.push({
                            answer: user.clientName || user.displayName || 'Unknown',
                            userId: userId,
                            isCorrect: true
                        });
                    }
                }
                
                // Add wrong users
                for (const user of selectedWrongUsers) {
                    answerOptions.push({
                        answer: user.clientName || user.displayName || 'Unknown',
                        userId: user.id,
                        isCorrect: false
                    });
                }
                
                // Shuffle the options
                answerOptions.sort(() => Math.random() - 0.5);
                
                const updateData = {
                    question,
                    answerOptions,
                    multipleAnswers: selectedUserIds.length > 1,
                    questionType: 'regular',
                    hasImages: false
                };
                
                // Check for question image
                const questionImage = editQuestionImage.value.trim();
                if (questionImage) {
                    updateData.questionImage = questionImage;
                    updateData.hasImages = true;
                }
                
                await updateDoc(doc(db, 'questions', currentEditQuestionId), updateData);
                
            } else {
                // TEXT-BASED ANSWERS: Use text options (original behavior)
                const options = Array.from(document.querySelectorAll('.edit-option-text')).map(input => input.value.trim());
                const correctAnswerIndex = parseInt(document.querySelector('input[name="editCorrectAnswer"]:checked').value);
                const questionImage = editQuestionImage.value.trim();

                if (options.some(opt => !opt)) {
                    showError('Please fill in all text options (or select users instead)', editQuestionError);
                    return;
                }
                
                // Convert text options to answerOptions format
                const answerOptions = options.map((opt, index) => ({
                    answer: opt,
                    isCorrect: index === correctAnswerIndex
                }));

                const updateData = {
                    question,
                    answerOptions,
                    multipleAnswers: false,
                    questionType: 'regular',
                    hasImages: false
                };

                if (questionImage) {
                    updateData.questionImage = questionImage;
                    updateData.hasImages = true;
                }

                const optionImages = Array.from(document.querySelectorAll('.edit-option-image-url'))
                    .map(input => input.value.trim())
                    .filter(url => url);

                if (optionImages.length > 0) {
                    updateData.optionImages = optionImages;
                    updateData.hasImages = true;
                }

                await updateDoc(doc(db, 'questions', currentEditQuestionId), updateData);
            }
        }

        showSuccess('Question updated successfully!', editQuestionSuccess);
        setTimeout(() => {
            editQuestionModal.classList.remove('active');
            loadQuestions();
            loadStatistics();
        }, 1500);
    } catch (error) {
        showError('Error updating question: ' + error.message, editQuestionError);
    }
});

// Load users
async function loadUsers() {
    usersList.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading users...</p></div>';

    try {
        const snapshot = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));

        allUsers = [];
        snapshot.forEach(doc => {
            allUsers.push({ id: doc.id, ...doc.data() });
        });

        displayUsers(allUsers);
    } catch (error) {
        usersList.innerHTML = '<p style="text-align: center; color: #c33;">Error loading users</p>';
        console.error(error);
    }
}

function displayUsers(users) {
    if (users.length === 0) {
        usersList.innerHTML = '<p style="text-align: center; color: #666;">No users found.</p>';
        return;
    }

    usersList.innerHTML = '';

    users.forEach(u => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';

        let avatarHTML = 'ÃƒÂ°Ã✅Â¸‘Ã‚Â¤';
        if (u.profilePictureURL) {
            avatarHTML = `<div class="user-avatar"><img src="${u.profilePictureURL}" alt="${u.clientName}"></div>`;
        } else {
            avatarHTML = `<div class="user-avatar" style="display: flex; align-items: center; justify-content: center; background: #FFF5F6; color: #ED1B2E; font-size: 1.5em;">ÃƒÂ°Ã✅Â¸‘Ã‚Â¤</div>`;
        }

        let skillsHTML = '';
        if (u.skills && u.skills.length > 0) {
            skillsHTML = '<div class="user-skills">';
            u.skills.forEach(skill => {
                skillsHTML += `<span class="skill-tag">${skill}</span>`;
            });
            skillsHTML += '</div>';
        }

        let funFactsHTML = '';
        if (u.funFacts && u.funFacts.length > 0) {
            funFactsHTML = '<p><strong>Fun Facts:</strong></p><ul>';
            u.funFacts.forEach(fact => {
                if (fact) funFactsHTML += `<li>${fact}</li>`;
            });
            funFactsHTML += '</ul>';
        }

        userItem.innerHTML = `
            ${avatarHTML}
            <h3>${u.clientName || u.displayName || 'Anonymous'}</h3>
            <div class="user-details">
                <div class="user-detail">
                    <div class="user-detail-label">Email</div>
                    <div class="user-detail-value">${u.email || 'N/A'}</div>
                </div>
                <div class="user-detail">
                    <div class="user-detail-label">Score</div>
                    <div class="user-detail-value">${u.score || 0} points</div>
                </div>
                <div class="user-detail">
                    <div class="user-detail-label">Questions Answered</div>
                    <div class="user-detail-value">${u.answeredQuestions ? u.answeredQuestions.length : 0}</div>
                </div>
                <div class="user-detail">
                    <div class="user-detail-label">Profile Status</div>
                    <div class="user-detail-value">${u.profileCompleted ? 'ÃƒÂ¢Ã✅“Ã¢â‚¬Â¦ Complete' : 'ÃƒÂ¢Ã✅Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â Incomplete'}</div>
                </div>
            </div>
            ${funFactsHTML}
            ${skillsHTML}
            <div class="actions">
                <button class="btn btn-small edit-user-btn" data-id="${u.id}">Edit Profile</button>
                <button class="btn btn-small btn-danger delete-user-btn" data-id="${u.id}" data-name="${u.clientName || u.displayName || 'this user'}">Delete User</button>
            </div>
        `;

        usersList.appendChild(userItem);
    });

    // Add edit user handlers
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.dataset.id;
            openEditUserModal(userId);
        });
    });

    // Add delete user handlers
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const userId = e.target.dataset.id;
            const userName = e.target.dataset.name;
            
            if (confirm(`Are you sure you want to delete ${userName}? This will also delete all AI-generated questions associated with this user.`)) {
                try {
                    // Delete AI-generated questions that reference this user
                    const questionsSnapshot = await getDocs(collection(db, 'questions'));
                    const deletePromises = [];
                    
                    questionsSnapshot.forEach(doc => {
                        const data = doc.data();
                        // Delete AI-generated questions that include this user in options or userIds
                        if (data.aiGenerated && data.userIds && data.userIds.includes(userId)) {
                            deletePromises.push(deleteDoc(doc.ref));
                        }
                    });
                    
                    await Promise.all(deletePromises);
                    
                    // Delete the user
                    await deleteDoc(doc(db, 'users', userId));
                    
                    showSuccess(`User deleted successfully. ${deletePromises.length} AI-generated questions were also removed.`, addQuestionSuccess);
                    await loadStatistics();
                    await loadUsers();
                } catch (error) {
                    showError('Error deleting user: ' + error.message, addQuestionError);
                }
            }
        });
    });
}

// Open edit user modal
async function openEditUserModal(userId) {
    currentEditUserId = userId;
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
        showError('User not found', editUserError);
        return;
    }

    const userData = userDoc.data();

    editUserName.value = userData.clientName || userData.displayName || '';
    editUserEmail.value = userData.email || '';
    if (editUserCurrentClient) editUserCurrentClient.value = userData.currentClient || '';
    if (editUserLocation) editUserLocation.value = userData.location || '';
    editUserProfileUrl.value = userData.profilePictureURL || '';

    if (userData.profilePictureURL) {
        editUserProfilePreview.innerHTML = `<img src="${userData.profilePictureURL}" alt="Profile">`;
    } else {
        editUserProfilePreview.innerHTML = 'ÃƒÂ°Ã✅Â¸‘Ã‚Â¤';
    }

    const funFacts = userData.funFacts || [];
    editUserFunFact1.value = funFacts[0] || '';
    editUserFunFact2.value = funFacts[1] || '';
    editUserFunFact3.value = funFacts[2] || '';

    const skills = userData.skills || [];
    loadTagsToUI(skills, editUserSelectedTags, editUserSelectedSkills);

    editUserProfilePictureFile = null;
    editUserModal.classList.add('active');
}

// Save edited user
saveEditUserBtn.addEventListener('click', async () => {
    if (!currentEditUserId) return;

    const clientName = editUserName.value.trim();
    const currentClient = editUserCurrentClient ? editUserCurrentClient.value.trim() : '';
    const location = editUserLocation ? editUserLocation.value.trim() : '';
    const funFact1 = editUserFunFact1.value.trim();
    const funFact2 = editUserFunFact2.value.trim();
    const funFact3 = editUserFunFact3.value.trim();

    if (!clientName) {
        showError('Please enter a display name', editUserError);
        return;
    }
    
    if (!currentClient) {
        showError('Please enter current client', editUserError);
        return;
    }
    
    if (!location) {
        showError('Please enter location (LOC)', editUserError);
        return;
    }

    try {
        saveEditUserBtn.disabled = true;
        saveEditUserBtn.textContent = 'Saving...';

        const updateData = {
            clientName,
            currentClient,
            location,
            funFacts: [funFact1, funFact2, funFact3].filter(f => f.length > 0),
            skills: editUserSelectedSkills
        };

        // Upload new profile picture if selected
        if (editUserProfilePictureFile) {
            const profilePictureURL = await uploadProfilePicture(currentEditUserId, editUserProfilePictureFile);
            updateData.profilePictureURL = profilePictureURL;
        } else if (editUserProfileUrl.value.trim()) {
            // Use URL if provided
            updateData.profilePictureURL = editUserProfileUrl.value.trim();
        }

        await updateDoc(doc(db, 'users', currentEditUserId), updateData);

        showSuccess('User profile updated successfully!', editUserSuccess);
        setTimeout(() => {
            editUserModal.classList.remove('active');
            loadUsers();
        }, 1500);
    } catch (error) {
        showError('Error updating user: ' + error.message, editUserError);
    } finally {
        saveEditUserBtn.disabled = false;
        saveEditUserBtn.textContent = 'Save Changes';
    }
});

// Add question
addQuestionBtn.addEventListener('click', async () => {
    if (questionType.value === 'skills') {
        await addSkillsQuestion();
    } else {
        await addRegularQuestion();
    }
});

async function addRegularQuestion() {
    const question = questionText.value.trim();
    const options = Array.from(document.querySelectorAll('.option-text')).map(input => input.value.trim());
    const correctAnswer = parseInt(document.querySelector('input[name="correctAnswer"]:checked').value);

    if (!question) {
        showError('Please enter a question', addQuestionError);
        return;
    }

    if (options.some(opt => !opt)) {
        showError('Please fill in all options', addQuestionError);
        return;
    }

    const questionData = {
        question,
        options,
        correctAnswer,
        questionType: 'regular',
        hasImages: hasQuestionImage.checked || hasOptionImages.checked,
        aiGenerated: false,
        createdAt: new Date()
    };

    if (hasQuestionImage.checked && questionImageUrl.value.trim()) {
        questionData.questionImage = questionImageUrl.value.trim();
    }

    if (hasOptionImages.checked) {
        const optionImages = Array.from(document.querySelectorAll('.option-image-url'))
            .map(input => input.value.trim())
            .filter(url => url);

        if (optionImages.length > 0) {
            questionData.optionImages = optionImages;
        }
    }

    try {
        await addDoc(collection(db, 'questions'), questionData);
        showSuccess('Question added successfully!', addQuestionSuccess);

        // Clear form
        questionText.value = '';
        questionImageUrl.value = '';
        hasQuestionImage.checked = false;
        hasOptionImages.checked = false;
        questionImageSection.style.display = 'none';
        document.querySelectorAll('.option-text').forEach(input => input.value = '');
        document.querySelectorAll('.option-image-url').forEach(input => {
            input.value = '';
            input.style.display = 'none';
        });
        document.querySelector('input[name="correctAnswer"]').checked = true;

        await loadStatistics();
        await loadQuestions();
        showTab('questions');
    } catch (error) {
        showError('Error adding question: ' + error.message, addQuestionError);
    }
}

async function addSkillsQuestion() {
    const question = skillsQuestionText.value.trim();
    const skillTag = skillTagSelect.value;

    if (!question) {
        showError('Please enter a question', addQuestionError);
        return;
    }

    if (!skillTag) {
        showError('Please select a skill tag', addQuestionError);
        return;
    }

    const questionData = {
        question,
        questionType: 'skills',
        skillTag,
        aiGenerated: false,
        hasImages: false,
        createdAt: new Date()
    };

    try {
        await addDoc(collection(db, 'questions'), questionData);
        showSuccess('Skills question added successfully!', addQuestionSuccess);

        // Clear form
        skillsQuestionText.value = '';
        skillTagSelect.value = '';

        await loadStatistics();
        await loadQuestions();
        showTab('questions');
    } catch (error) {
        showError('Error adding question: ' + error.message, addQuestionError);
    }
}

// AI Questions functionality
async function loadAIQuestions() {
    aiQuestionsList.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading AI-generated questions...</p></div>';

    try {
        const snapshot = await getDocs(query(collection(db, 'questions'), orderBy('createdAt', 'desc')));

        const aiQuestions = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.aiGenerated) {
                aiQuestions.push({ id: doc.id, ...data });
            }
        });

        if (aiQuestions.length === 0) {
            aiQuestionsList.innerHTML = '<p style="text-align: center; color: #666;">No AI-generated questions yet. Click "Generate New Questions" to create some!</p>';
            return;
        }

        aiQuestionsList.innerHTML = '';

        aiQuestions.forEach(q => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item ai-question-item';

            let badges = '<span class="badge badge-type">ÃƒÂ°Ã✅Â¸Ã‚Â¤Ã¢â‚¬“ AI Generated</span>';
            if (q.questionType === 'skills') {
                badges += '<span class="badge badge-skills">ÃƒÂ°Ã✅Â¸Ã¢â‚¬Å“Ã‚Â Skills</span>';
            }

            let contentHTML = `
                ${badges}
                <h3>${q.question}</h3>
            `;

            if (q.questionType === 'skills') {
                contentHTML += `<p><strong>Skill Tag:</strong> ${q.skillTag}</p>`;
            } else if (q.options) {
                contentHTML += `<ol class="options-list">`;
                q.options.forEach((opt, idx) => {
                    const isCorrect = idx === q.correctAnswer;
                    contentHTML += `<li ${isCorrect ? 'ÃƒÂ¢Ã✅“Ã¢â‚¬Â¦' : ''}</li>`;
                });
                contentHTML += `</ol>`;
            }

            contentHTML += `
                <div class="actions">
                    <button class="btn btn-small approve-ai-btn" data-id="${q.id}">Approve & Add to Game</button>
                    <button class="btn btn-small btn-danger delete-ai-btn" data-id="${q.id}">Delete</button>
                </div>
            `;

            questionItem.innerHTML = contentHTML;
            aiQuestionsList.appendChild(questionItem);
        });

        // Approve handlers
        document.querySelectorAll('.approve-ai-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const questionId = e.target.dataset.id;
                try {
                    await updateDoc(doc(db, 'questions', questionId), {
                        aiGenerated: false // Move to regular questions
                    });
                    showSuccess('Question approved and added to game!', addQuestionSuccess);
                    await loadAIQuestions();
                    await loadQuestions();
                    await loadStatistics();
                } catch (error) {
                    showError('Error approving question: ' + error.message, addQuestionError);
                }
            });
        });

        // Delete handlers
        document.querySelectorAll('.delete-ai-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const questionId = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this AI-generated question?')) {
                    try {
                        await deleteDoc(doc(db, 'questions', questionId));
                        showSuccess('AI question deleted', addQuestionSuccess);
                        await loadAIQuestions();
                        await loadStatistics();
                    } catch (error) {
                        showError('Error deleting question: ' + error.message, addQuestionError);
                    }
                }
            });
        });
    } catch (error) {
        aiQuestionsList.innerHTML = '<p style="text-align: center; color: #c33;">Error loading AI questions</p>';
        console.error(error);
    }
}

// Generate AI questions
generateAIQuestionsBtn.addEventListener('click', async () => {
    generateAIQuestionsBtn.disabled = true;
    generateAIQuestionsBtn.textContent = 'ÃƒÂ°Ã✅Â¸Ã‚Â¤Ã¢â‚¬“ Generating...';
    
    aiQuestionsList.innerHTML = '<div class="generating"><div class="spinner"></div><p>AI is analyzing user profiles and generating questions...</p><p style="margin-top: 10px; font-size: 0.9em;">This may take a minute.</p></div>';

    try {
        // Get all users with complete profiles
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = [];
        usersSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.profileCompleted) {
                users.push({ id: doc.id, ...data });
            }
        });

        console.log('Total users found:', usersSnapshot.size);
        console.log('Users with completed profiles:', users.length);

        if (users.length < 4) {
            showError(`Need at least 4 users with completed profiles to generate questions. Currently have ${users.length}.`, addQuestionError);
            await loadAIQuestions();
            generateAIQuestionsBtn.disabled = false;
            generateAIQuestionsBtn.textContent = 'ÃƒÂ°Ã✅Â¸Ã‚Â¤Ã¢â‚¬“ Generate New Questions';
            return;
        }

        // Generate questions based on user data
        const generatedQuestions = await generateQuestionsFromUsers(users);

        if (generatedQuestions.length === 0) {
            showError('Could not generate any questions. Make sure users have fun facts and skills added to their profiles.', addQuestionError);
            await loadAIQuestions();
            generateAIQuestionsBtn.disabled = false;
            generateAIQuestionsBtn.textContent = 'ÃƒÂ°Ã✅Â¸Ã‚Â¤Ã¢â‚¬“ Generate New Questions';
            return;
        }

        console.log('Adding', generatedQuestions.length, 'questions to database');

        // Add to database
        for (const question of generatedQuestions) {
            await addDoc(collection(db, 'questions'), {
                ...question,
                aiGenerated: true,
                createdAt: new Date()
            });
        }

        showSuccess(`Generated ${generatedQuestions.length} new questions!`, addQuestionSuccess);
        await loadAIQuestions();
        await loadStatistics();
    } catch (error) {
        console.error('Error generating questions:', error);
        showError('Error generating questions: ' + error.message, addQuestionError);
        await loadAIQuestions();
    } finally {
        generateAIQuestionsBtn.disabled = false;
        generateAIQuestionsBtn.textContent = 'ÃƒÂ°Ã✅Â¸Ã‚Â¤Ã¢â‚¬“ Generate New Questions';
    }
});

// AI Question generation logic (rule-based, no external API needed)
async function generateQuestionsFromUsers(users) {
    const questions = [];
    
    console.log('Generating questions from', users.length, 'users');

    // Filter users with complete profiles
    const eligibleUsers = users.filter(u => 
        u.profileCompleted && 
        u.clientName && 
        u.clientName.trim().length > 0
    );
    
    console.log('Eligible users with complete profiles:', eligibleUsers.length);

    if (eligibleUsers.length < 4) {
        console.warn('Need at least 4 users with complete profiles to generate questions');
        return [];
    }

    // Get all existing questions to avoid duplicates
    const existingQuestionsSnapshot = await getDocs(collection(db, 'questions'));
    const existingSkillTags = new Set();
    const existingFunFacts = new Set();
    
    existingQuestionsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.questionType === 'skills' && data.skillTag) {
            existingSkillTags.add(data.skillTag);
        }
        if (data.questionType === 'regular' && data.question) {
            // Extract fun fact from question like 'Who has this fun fact: "..."?'
            const match = data.question.match(/Who has this fun fact: "(.+)"\?/);
            if (match) {
                existingFunFacts.add(match[1]);
            }
        }
    });

    console.log('Existing skill questions:', existingSkillTags.size);
    console.log('Existing fun fact questions:', existingFunFacts.size);

    // Generate skill-based questions
    const allSkills = new Set();
    eligibleUsers.forEach(user => {
        if (user.skills && Array.isArray(user.skills)) {
            user.skills.forEach(skill => {
                if (skill && skill.trim().length > 0) {
                    allSkills.add(skill);
                }
            });
        }
    });

    console.log('Found', allSkills.size, 'unique skills');

    // Create questions for skills that multiple people have (and aren't already in database)
    allSkills.forEach(skill => {
        const usersWithSkill = eligibleUsers.filter(u => 
            u.skills && 
            Array.isArray(u.skills) && 
            u.skills.includes(skill)
        );
        
        // Only create if: multiple users have skill, and question doesn't already exist
        if (usersWithSkill.length >= 2 && usersWithSkill.length <= eligibleUsers.length - 1 && !existingSkillTags.has(skill)) {
            // Get users WITHOUT this skill for wrong answers
            const usersWithoutSkill = eligibleUsers.filter(u => 
                !u.skills || 
                !Array.isArray(u.skills) || 
                !u.skills.includes(skill)
            );
            
            // Need at least 2 wrong answers to make a 4-option question
            if (usersWithoutSkill.length < 2) {
                console.log('Not enough users without skill for options:', skill);
                return;
            }
            
            // Randomly select 2 users with the skill and 2 without
            const shuffledCorrect = usersWithSkill.sort(() => Math.random() - 0.5);
            const shuffledWrong = usersWithoutSkill.sort(() => Math.random() - 0.5);
            
            const correctUsers = shuffledCorrect.slice(0, 2);
            const wrongUsers = shuffledWrong.slice(0, 2);
            
            // Combine and shuffle all options
            const allOptions = [...correctUsers, ...wrongUsers].sort(() => Math.random() - 0.5);
            
            // Find the indices of correct answers in the shuffled array
            const correctIndices = [];
            correctUsers.forEach(correctUser => {
                const index = allOptions.findIndex(opt => opt.id === correctUser.id);
                if (index !== -1) correctIndices.push(index);
            });
            
            // For multi-select questions, store all correct indices in an array
            // But validation expects a single correctAnswer number, so we'll use the first one
            // and add a correctAnswers array for the app to use
            questions.push({
                question: `Which consultants have ${skill} expertise?`,
                questionType: 'skills',
                skillTag: skill,
                hasImages: false,
                multiSelect: true,
                correctAnswer: correctIndices[0], // Primary correct answer for validation
                correctAnswers: correctIndices, // All correct answers for the game
                options: allOptions.map(u => u.clientName || u.displayName || 'Unknown'),
                userIds: allOptions.map(u => u.id) // Store user IDs for reference
            });
            console.log('Created NEW skill question for:', skill, '- Correct answers:', correctIndices.length);
        } else if (existingSkillTags.has(skill)) {
            console.log('Skipping existing skill question for:', skill);
        }
    });

    // Generate fun fact questions
    const usersWithFunFacts = eligibleUsers.filter(u => 
        u.funFacts && 
        Array.isArray(u.funFacts) && 
        u.funFacts.some(f => f && f.trim().length > 0)
    );
    
    console.log('Users with fun facts:', usersWithFunFacts.length);
    
    // Collect all available fun facts that haven't been used yet
    const availableFunFacts = [];
    usersWithFunFacts.forEach(user => {
        const funFacts = user.funFacts.filter(f => f && f.trim().length > 0);
        funFacts.forEach(funFact => {
            if (!existingFunFacts.has(funFact)) {
                availableFunFacts.push({ user, funFact });
            } else {
                console.log('Skipping existing fun fact:', funFact.substring(0, 50) + '...');
            }
        });
    });
    
    console.log('Available NEW fun facts:', availableFunFacts.length);
    
    // Shuffle and limit
    const shuffledFacts = availableFunFacts.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(10, shuffledFacts.length); i++) {
        const { user: correctUser, funFact } = shuffledFacts[i];
        
        // Get 3 wrong answers from other users
        const otherUsers = eligibleUsers.filter(u => u.id !== correctUser.id);
        
        if (otherUsers.length >= 3) {
            const wrongUsers = otherUsers
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);

            // Combine all 4 users (1 correct + 3 wrong)
            const allFourUsers = [correctUser, ...wrongUsers];
            
            // Shuffle to randomize correct answer position
            const shuffledUsers = allFourUsers.sort(() => Math.random() - 0.5);
            
            // Create options with names
            const options = shuffledUsers.map(u => u.clientName);
            
            // Create userId mapping for profile pictures
            const userIds = shuffledUsers.map(u => u.id);
            const optionImages = shuffledUsers.map(u => u.profilePictureURL || '');
            
            // Find the correct answer index after shuffling
            const correctAnswer = shuffledUsers.findIndex(u => u.id === correctUser.id);

            questions.push({
                question: `Who has this fun fact: "${funFact}"?`,
                options,
                correctAnswer,
                questionType: 'regular',
                hasImages: true,
                userIds,  // Add user IDs for profile lookup
                optionImages
            });
            
            console.log('Created NEW fun fact question for:', correctUser.clientName);
        }
    }

    console.log('Total NEW questions generated:', questions.length);
    
    if (questions.length === 0) {
        console.log('No new questions to generate - all possible questions already exist!');
    }

    return questions.slice(0, 15); // Limit to 15 questions per generation
}

// =============== VALIDATION DASHBOARD ===============
const validationList = document.getElementById('validationList');

if (validationTab) {
  validationTab.addEventListener('click', () => {
    showTab('validation');
    loadQuestionValidation();
  });
}

async function loadQuestionValidation() {
  if (!validationList) return;

  validationList.innerHTML = '<p>Checking questions...</p>';
  try {
    const snapshot = await getDocs(collection(db, 'questions'));
    let html = '';
    let invalidCount = 0;
    
    snapshot.forEach(docSnap => {
      const q = docSnap.data();
      const missing = [];

      if (!q.question) missing.push('question');
      if (!q.options || !Array.isArray(q.options) || q.options.length === 0)
        missing.push('options');
      if (typeof q.correctAnswer !== 'number')
        missing.push('correctAnswer');

      const isValid = missing.length === 0;
      const color = isValid ? 'green' : 'red';
      
      const isAIGenerated = q.questionType === 'skills' || q.questionType === 'client';
      const aiWarning = isAIGenerated && !isValid ? ' ⚠️AI Generated - Incomplete' : '';

      if (!isValid) invalidCount++;

      html += `
        <div class="validation-item" style="${!isValid ? 'background: #fff3cd; border-left-color: #ff9800;' : ''}">
          <div>
            <strong>${q.question || '(No question text)'}</strong>${aiWarning}
            <p style="color:${color}; font-size: 0.9em;">
              ${isValid ? '✅ OK' : 'Ã¢ÂÅ’ Missing: ' + missing.join(', ')}
              ${isAIGenerated ? ` | Type: ${q.questionType}` : ''}
            </p>
          </div>
          <div>
            <button class="btn btn-small" onclick="editQuestion('${docSnap.id}')">Edit</button>
            <button class="btn btn-small" onclick="deleteQuestion('${docSnap.id}')" style="background:#dc3545; margin-left:8px;">Delete</button>
          </div>
        </div>
      `;
    });
    
    if (invalidCount > 0) {
      html = `<div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin-bottom: 15px; color: #721c24;">
        <strong>⚠️${invalidCount} Invalid Question${invalidCount > 1 ? 's' : ''} Found</strong>
        <p style="margin: 5px 0 0 0;">AI-generated skills and client questions are incomplete and should be deleted.</p>
      </div>` + html;
    }
    
    validationList.innerHTML = html || '<p style="color: #666;">All questions are valid! ✅</p>';
  } catch (error) {
    console.error('Error loading question validation:', error);
    validationList.innerHTML = '<p style="color:red;">Error loading questions.</p>';
  }
}

// Delete individual question
window.deleteQuestion = async function(questionId) {
  const validationError = document.getElementById('validationError');
  const validationSuccess = document.getElementById('validationSuccess');
  
  // Clear messages
  validationError.textContent = '';
  validationSuccess.textContent = '';
  validationError.style.display = 'none';
  validationSuccess.style.display = 'none';

  try {
    // Get question details for confirmation
    const questionDoc = await getDoc(doc(db, 'questions', questionId));
    if (!questionDoc.exists()) {
      validationError.textContent = 'Question not found.';
      validationError.style.display = 'block';
      return;
    }

    const questionData = questionDoc.data();
    const questionText = questionData.question || 'Unknown question';

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete this question?\n\n"${questionText}"\n\nThis action CANNOT be undone!`)) {
      return;
    }

    // Delete the question
    await deleteDoc(doc(db, 'questions', questionId));

    // Show success message
    validationSuccess.textContent = '✅ Question deleted successfully!';
    validationSuccess.style.display = 'block';

    // Reload validation list and stats
    loadQuestionValidation();
    loadStats();

  } catch (error) {
    console.error('Error deleting question:', error);
    validationError.textContent = 'Error deleting question: ' + error.message;
    validationError.style.display = 'block';
  }
};

// =============== MIGRATION TAB ===============
const migrationTab = document.getElementById('migrationTab');
const migrationContent = document.getElementById('migrationContent');
const analyzeQuestionsBtn = document.getElementById('analyzeQuestionsBtn');
const migrateQuestionsBtn = document.getElementById('migrateQuestionsBtn');
const migrationError = document.getElementById('migrationError');
const migrationSuccess = document.getElementById('migrationSuccess');
const migrationResults = document.getElementById('migrationResults');
const migrationProgress = document.getElementById('migrationProgress');
const migrationProgressBar = document.getElementById('migrationProgressBar');

let questionsToMigrate = [];

if (migrationTab) {
    migrationTab.addEventListener('click', () => {
        showTab('migration');
    });
}

if (analyzeQuestionsBtn) {
    analyzeQuestionsBtn.addEventListener('click', async () => {
        analyzeQuestionsBtn.disabled = true;
        analyzeQuestionsBtn.textContent = '”Â Analyzing...';
        migrationError.style.display = 'none';
        migrationSuccess.style.display = 'none';
        migrationResults.style.display = 'none';
        
        try {
            const snapshot = await getDocs(collection(db, 'questions'));
            questionsToMigrate = [];
            let alreadyMigrated = 0;
            let aiGenerated = 0;
            
            snapshot.forEach(docSnap => {
                const q = docSnap.data();
                
                if (q.aiGenerated) {
                    aiGenerated++;
                    return;
                }
                
                // Check if already in new format
                if (q.answerOptions && Array.isArray(q.answerOptions)) {
                    alreadyMigrated++;
                    return;
                }
                
                // Needs migration if it has old format
                if (q.options || q.correctAnswer !== undefined) {
                    questionsToMigrate.push({
                        id: docSnap.id,
                        data: q
                    });
                }
            });

            let report = `“Å  Analysis Complete:\n\n`;
            report += `Total questions: ${snapshot.size}\n`;
            report += `✅ Already in new format: ${alreadyMigrated}\n`;
            report += `🤖 AI-generated (pending): ${aiGenerated}\n`;
            report += `””ž Need migration: ${questionsToMigrate.length}\n\n`;

            if (questionsToMigrate.length > 0) {
                report += `Questions that will be migrated:\n`;
                questionsToMigrate.slice(0, 10).forEach((q, idx) => {
                    report += `${idx + 1}. ${q.data.question || 'Untitled'}\n`;
                });
                if (questionsToMigrate.length > 10) {
                    report += `... and ${questionsToMigrate.length - 10} more\n`;
                }
                
                migrateQuestionsBtn.style.display = 'inline-block';
            } else {
                report += `\nÃ¢Å“Â¨ All questions are already in the correct format!`;
            }

            migrationResults.textContent = report;
            migrationResults.style.display = 'block';
            analyzeQuestionsBtn.textContent = '“Å  Analyze Questions';
            analyzeQuestionsBtn.disabled = false;

        } catch (error) {
            console.error('Error analyzing questions:', error);
            migrationError.textContent = 'Error analyzing questions: ' + error.message;
            migrationError.style.display = 'block';
            analyzeQuestionsBtn.textContent = '“Å  Analyze Questions';
            analyzeQuestionsBtn.disabled = false;
        }
    });
}

if (migrateQuestionsBtn) {
    migrateQuestionsBtn.addEventListener('click', async () => {
        if (!confirm(`Migrate ${questionsToMigrate.length} questions to the new format?\n\nThis will update the database.`)) {
            return;
        }

        migrateQuestionsBtn.disabled = true;
        migrateQuestionsBtn.textContent = 'Ã¢ÂÂ³ Migrating...';
        migrationProgress.style.display = 'block';
        migrationError.style.display = 'none';
        migrationSuccess.style.display = 'none';
        migrationResults.style.display = 'none';

        let migrated = 0;
        let errors = 0;
        const total = questionsToMigrate.length;

        try {
            for (let i = 0; i < questionsToMigrate.length; i++) {
                const q = questionsToMigrate[i];
                
                try {
                    const updateData = {};
                    
                    // Convert options array to answerOptions format
                    if (q.data.options && Array.isArray(q.data.options)) {
                        updateData.answerOptions = q.data.options.map((opt, idx) => {
                            const optObj = {
                                answer: opt,
                                isCorrect: false
                            };
                            
                            // Mark correct answers
                            if (q.data.correctAnswer === idx) {
                                optObj.isCorrect = true;
                            }
                            if (q.data.correctAnswers && q.data.correctAnswers.includes(idx)) {
                                optObj.isCorrect = true;
                            }
                            
                            // Add additional data if present
                            if (q.data.userIds && q.data.userIds[idx]) {
                                optObj.userId = q.data.userIds[idx];
                            }
                            if (q.data.optionImages && q.data.optionImages[idx]) {
                                optObj.photoURL = q.data.optionImages[idx];
                            }
                            if (q.data.locations && q.data.locations[idx]) {
                                optObj.location = q.data.locations[idx];
                            }
                            
                            return optObj;
                        });
                    }
                    
                    // Set multipleAnswers flag
                    if (q.data.multiSelect || (q.data.correctAnswers && q.data.correctAnswers.length > 1)) {
                        updateData.multipleAnswers = true;
                    } else {
                        updateData.multipleAnswers = false;
                    }
                    
                    // Update the document
                    await updateDoc(doc(db, 'questions', q.id), updateData);
                    migrated++;
                    
                } catch (err) {
                    console.error('Error migrating question:', q.id, err);
                    errors++;
                }
                
                // Update progress
                const percent = Math.round(((i + 1) / total) * 100);
                migrationProgressBar.style.width = percent + '%';
                migrationProgressBar.textContent = percent + '%';
            }

            let report = `✅ Migration Complete!\n\n`;
            report += `Migrated: ${migrated}\n`;
            if (errors > 0) {
                report += `Errors: ${errors}\n`;
            }
            report += `\nÅ½”° Your questions are now in the correct format!\n`;
            report += `You can now use the game and admin panel normally.`;

            migrationSuccess.textContent = 'Migration completed successfully!';
            migrationSuccess.style.display = 'block';
            migrationResults.textContent = report;
            migrationResults.style.display = 'block';
            migrateQuestionsBtn.style.display = 'none';
            
            // Refresh stats
            await loadStats();

        } catch (error) {
            console.error('Error during migration:', error);
            migrationError.textContent = 'Error during migration: ' + error.message;
            migrationError.style.display = 'block';
        }

        migrateQuestionsBtn.disabled = false;
        migrateQuestionsBtn.textContent = 'Å¡â‚¬ Migrate All Questions';
        migrationProgress.style.display = 'none';
    });
}

// ===================== PASSWORD RESET MODAL =====================
const resetPasswordModal = document.getElementById('resetPasswordModal');
const closeResetPasswordModal = document.getElementById('closeResetPasswordModal');
const resetPasswordEmail = document.getElementById('resetPasswordEmail');
const resetPasswordNew = document.getElementById('resetPasswordNew');
const resetPasswordConfirm = document.getElementById('resetPasswordConfirm');
const executeResetPasswordBtn = document.getElementById('executeResetPasswordBtn');
const resetPasswordError = document.getElementById('resetPasswordError');
const resetPasswordSuccess = document.getElementById('resetPasswordSuccess');

// Close modal handlers
if (closeResetPasswordModal) {
    closeResetPasswordModal.addEventListener('click', () => {
        if (resetPasswordModal) resetPasswordModal.classList.remove('active');
    });
}

// Close modal on background click
if (resetPasswordModal) {
    resetPasswordModal.addEventListener('click', (e) => {
        if (e.target === resetPasswordModal) {
            resetPasswordModal.classList.remove('active');
        }
    });
}

// Function to open password reset modal
function openResetPasswordModal() {
    if (!resetPasswordModal) {
        console.error('Password reset modal not found');
        return;
    }
    
    if (resetPasswordEmail) resetPasswordEmail.value = '';
    if (resetPasswordNew) resetPasswordNew.value = '';
    if (resetPasswordConfirm) resetPasswordConfirm.checked = false;
    
    // Clear messages
    if (resetPasswordError) {
        resetPasswordError.style.display = 'none';
        resetPasswordError.textContent = '';
    }
    if (resetPasswordSuccess) {
        resetPasswordSuccess.style.display = 'none';
        resetPasswordSuccess.textContent = '';
    }
    
    resetPasswordModal.classList.add('active');
    
    // Focus on email field
    if (resetPasswordEmail) {
        setTimeout(() => resetPasswordEmail.focus(), 100);
    }
}

// Execute password reset
if (executeResetPasswordBtn) {
    executeResetPasswordBtn.addEventListener('click', async () => {
        const email = resetPasswordEmail ? resetPasswordEmail.value.trim() : '';
        const newPassword = resetPasswordNew ? resetPasswordNew.value.trim() : '';
        
        // Clear messages
        if (resetPasswordError) {
            resetPasswordError.style.display = 'none';
            resetPasswordError.textContent = '';
        }
        if (resetPasswordSuccess) {
            resetPasswordSuccess.style.display = 'none';
            resetPasswordSuccess.textContent = '';
        }
        
        // Validation
        if (!email) {
            if (resetPasswordError) {
                resetPasswordError.textContent = 'Please enter a user email address';
                resetPasswordError.style.display = 'block';
            }
            return;
        }
        
        if (!email.includes('@')) {
            if (resetPasswordError) {
                resetPasswordError.textContent = 'Please enter a valid email address';
                resetPasswordError.style.display = 'block';
            }
            return;
        }
        
        // Password is optional - if provided, validate it
        if (newPassword && newPassword.length < 6) {
            if (resetPasswordError) {
                resetPasswordError.textContent = 'Suggested password must be at least 6 characters';
                resetPasswordError.style.display = 'block';
            }
            return;
        }
        
        if (resetPasswordConfirm && !resetPasswordConfirm.checked) {
            if (resetPasswordError) {
                resetPasswordError.textContent = 'Please confirm you understand this action';
                resetPasswordError.style.display = 'block';
            }
            return;
        }
        
        try {
            executeResetPasswordBtn.disabled = true;
            executeResetPasswordBtn.textContent = 'Sending Reset Email...';
            
            // Find user by email to verify they exist in the database
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                if (resetPasswordError) {
                    resetPasswordError.textContent = `No user found with email: ${email}`;
                    resetPasswordError.style.display = 'block';
                }
                return;
            }
            
            // Send password reset email using Firebase Auth
            await sendPasswordResetEmail(auth, email);
            
            if (resetPasswordSuccess) {
                resetPasswordSuccess.textContent = 
                    `✅ Password reset email sent successfully!\n\n` +
                    `Email: ${email}\n\n` +
                    `The user will receive an email with a link to reset their password.\n` +
                    `The new password you entered (${newPassword}) is a suggestion for them to use.`;
                resetPasswordSuccess.style.display = 'block';
            }
            
            if (resetPasswordNew) resetPasswordNew.value = '';
            if (resetPasswordConfirm) resetPasswordConfirm.checked = false;
            
        } catch (error) {
            console.error('Password reset error:', error);
            if (resetPasswordError) {
                let errorMessage = 'Error: ' + error.message;
                
                // Provide helpful error messages
                if (error.code === 'auth/user-not-found') {
                    errorMessage = `User not found in Firebase Authentication.\n\nEmail: ${email}\n\nPlease verify the email address is correct.`;
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Invalid email address format.';
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = 'Too many requests. Please try again later.';
                }
                
                resetPasswordError.textContent = errorMessage;
                resetPasswordError.style.display = 'block';
            }
        } finally {
            executeResetPasswordBtn.disabled = false;
            executeResetPasswordBtn.textContent = 'Send Reset Email';
        }
    });
}

// Add button event listener
const resetPasswordHeaderBtn = document.getElementById('resetPasswordHeaderBtn');
if (resetPasswordHeaderBtn) {
    resetPasswordHeaderBtn.addEventListener('click', openResetPasswordModal);
}

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        openResetPasswordModal();
    }
});

// Make available globally
window.openResetPasswordModal = openResetPasswordModal;

console.log('Password reset loaded. Press Ctrl/Cmd+Shift+P to open.');
