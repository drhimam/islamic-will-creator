// Global variables
let currentWillData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set current date if element exists
    const willDateInput = document.getElementById('willDate');
    if (willDateInput) {
        willDateInput.value = getCurrentDate();
    }
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Initialize modal handlers
    initializeModalHandlers();
    
    // Initialize spouse visibility
    initializeSpouseVisibility();
    
    // Initialize inheritance calculator
    initializeInheritanceCalculator();
    
    // Auto-detect browser and device for feedback form
    autoDetectTechnicalInfo();
    
    console.log('Application initialized successfully');
});

// Navigation functions
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

function showPage(pageId) {
    console.log('Attempting to show page:', pageId);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Successfully showed page:', pageId);
    } else {
        console.error('Page not found:', pageId);
    }
    
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        
        // Check if this link corresponds to the current page
        const onclick = link.getAttribute('onclick');
        if (onclick && onclick.includes(`'${pageId}'`)) {
            link.classList.add('active');
        }
    });
    
    // Update URL hash
    window.location.hash = pageId;
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Close mobile menu if open
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
}

// Form initialization
function initializeFormHandlers() {
    // Will form submission
    const willForm = document.getElementById('will-form');
    if (willForm) {
        willForm.addEventListener('submit', handleWillSubmission);
    }
    
    // Feedback form submission is handled by feedback-system.js (EmailJS)
    // Remove legacy handler to avoid duplicate submissions and wrong modal usage
    
    // File import handler
    const importFile = document.getElementById('importFile');
    if (importFile) {
        importFile.addEventListener('change', importWill);
    }
}

function initializeSpouseVisibility() {
    const maritalStatus = document.getElementById('maritalStatus');
    const spouseInfo = document.querySelector('.spouse-info');
    
    if (maritalStatus && spouseInfo) {
        maritalStatus.addEventListener('change', function() {
            if (this.value === 'married') {
                spouseInfo.style.display = 'block';
                const spouseNameInput = document.getElementById('spouseName');
                if (spouseNameInput) {
                    spouseNameInput.required = true;
                }
            } else {
                spouseInfo.style.display = 'none';
                const spouseNameInput = document.getElementById('spouseName');
                if (spouseNameInput) {
                    spouseNameInput.required = false;
                    spouseNameInput.value = '';
                }
            }
        });
    }
}

function initializeModalHandlers() {
    const modal = document.getElementById('success-modal');
    const closeBtn = document.querySelector('.close');
    
    if (modal && closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Download button handlers with null checks
    const pdfBtn = document.getElementById('download-pdf');
    const jsonBtn = document.getElementById('download-json');
    
    if (pdfBtn) {
        pdfBtn.addEventListener('click', downloadPDF);
    }
    if (jsonBtn) {
        jsonBtn.addEventListener('click', downloadJSON);
    }
}

// Dynamic form functions
function addChild() {
    const container = document.getElementById('children-container');
    const newChild = document.createElement('div');
    newChild.className = 'dynamic-entry';
    newChild.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Child Name</label>
                <input type="text" name="childName[]">
            </div>
            <div class="form-group">
                <label>Gender</label>
                <select name="childGender[]">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" name="childDOB[]">
            </div>
            <div class="form-group">
                <button type="button" class="btn-remove" onclick="removeEntry(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(newChild);
}

function addCashAsset() {
    const container = document.getElementById('cash-container');
    const newAsset = document.createElement('div');
    newAsset.className = 'dynamic-entry';
    newAsset.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Account Type</label>
                <select name="cashType[]">
                    <option value="">Select Type</option>
                    <option value="savings">Savings Account</option>
                    <option value="checking">Checking Account</option>
                    <option value="cash">Cash</option>
                    <option value="investment">Investment Account</option>
                </select>
            </div>
            <div class="form-group">
                <label>Bank/Location</label>
                <input type="text" name="cashLocation[]" placeholder="Bank name or location">
            </div>
            <div class="form-group">
                <label>Amount</label>
                <input type="number" name="cashAmount[]" step="0.01" placeholder="0.00">
            </div>
            <div class="form-group">
                <button type="button" class="btn-remove" onclick="removeEntry(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(newAsset);
}

function addProperty() {
    const container = document.getElementById('property-container');
    const newProperty = document.createElement('div');
    newProperty.className = 'dynamic-entry';
    newProperty.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Property Type</label>
                <select name="propertyType[]">
                    <option value="">Select Type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial Property</option>
                </select>
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" name="propertyAddress[]" placeholder="Property address">
            </div>
            <div class="form-group">
                <label>Estimated Value</label>
                <input type="number" name="propertyValue[]" step="0.01" placeholder="0.00">
            </div>
            <div class="form-group">
                <button type="button" class="btn-remove" onclick="removeEntry(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(newProperty);
}

function addOtherAsset() {
    const container = document.getElementById('other-assets-container');
    const newAsset = document.createElement('div');
    newAsset.className = 'dynamic-entry';
    newAsset.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Asset Type</label>
                <input type="text" name="otherAssetType[]" placeholder="e.g., Gold, Jewelry, Vehicle">
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" name="otherAssetDesc[]" placeholder="Brief description">
            </div>
            <div class="form-group">
                <label>Estimated Value</label>
                <input type="number" name="otherAssetValue[]" step="0.01" placeholder="0.00">
            </div>
            <div class="form-group">
                <button type="button" class="btn-remove" onclick="removeEntry(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(newAsset);
}

function addDebt() {
    const container = document.getElementById('debts-container');
    const newDebt = document.createElement('div');
    newDebt.className = 'dynamic-entry';
    newDebt.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Debt Type</label>
                <select name="debtType[]">
                    <option value="">Select Type</option>
                    <option value="mortgage">Mortgage</option>
                    <option value="loan">Personal Loan</option>
                    <option value="credit">Credit Card</option>
                    <option value="business">Business Debt</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Creditor/Institution</label>
                <input type="text" name="debtCreditor[]" placeholder="Bank or creditor name">
            </div>
            <div class="form-group">
                <label>Amount</label>
                <input type="number" name="debtAmount[]" step="0.01" placeholder="0.00">
            </div>
            <div class="form-group">
                <button type="button" class="btn-remove" onclick="removeEntry(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(newDebt);
}

function addCharity() {
    const container = document.getElementById('charity-container');
    const newCharity = document.createElement('div');
    newCharity.className = 'dynamic-entry';
    newCharity.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Organization/Cause</label>
                <input type="text" name="charityName[]" placeholder="Charity or cause name">
            </div>
            <div class="form-group">
                <label>Percentage of Estate</label>
                <input type="number" name="charityPercent[]" step="0.1" max="33.33" placeholder="0.0">
                <small>Maximum total: 33.33%</small>
            </div>
            <div class="form-group">
                <label>Purpose</label>
                <input type="text" name="charityPurpose[]" placeholder="Specific purpose">
            </div>
            <div class="form-group">
                <button type="button" class="btn-remove" onclick="removeEntry(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(newCharity);
}

function addExecutor() {
    const container = document.getElementById('executors-container');
    const newExecutor = document.createElement('div');
    newExecutor.className = 'dynamic-entry';
    newExecutor.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Executor Name</label>
                <input type="text" name="executorName[]" placeholder="Full name">
            </div>
            <div class="form-group">
                <label>Relationship</label>
                <input type="text" name="executorRelation[]" placeholder="e.g., Brother, Friend">
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <input type="text" name="executorPhone[]" placeholder="Phone number">
            </div>
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="executorEmail[]" placeholder="Email address">
            </div>
            <div class="form-group">
                <label>Address</label>
                <textarea name="executorAddress[]" rows="2" placeholder="Full address"></textarea>
            </div>
            <div class="form-group">
                <button type="button" class="btn-remove" onclick="removeEntry(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(newExecutor);
}

function removeEntry(button) {
    const entry = button.closest('.dynamic-entry');
    entry.remove();
}

// Form submission handlers
function handleWillSubmission(e) {
    e.preventDefault();
    
    try {
        // Collect form data
        const formData = new FormData(e.target);
        currentWillData = collectWillData(formData);
        
        // Validate charitable bequests
        if (!validateCharitableBequests(currentWillData)) {
            showAlert('Charitable bequests cannot exceed 33.33% of the estate total.', 'error');
            return;
        }
        
        // Show success modal
        showSuccessModal('Will Created Successfully!', 'Your Islamic will has been created successfully. You can now download it in your preferred format.');
        
    } catch (error) {
        console.error('Error creating will:', error);
        showAlert('An error occurred while creating your will. Please try again.', 'error');
    }
}

// Legacy feedback submission handler removed.

// Data collection functions
function collectWillData(formData) {
    const data = {
        personalInfo: {
            fullName: formData.get('fullName'),
            fatherName: formData.get('fatherName'),
            dateOfBirth: formData.get('dateOfBirth'),
            nationality: formData.get('nationality'),
            idNumber: formData.get('idNumber'),
            address: formData.get('address')
        },
        familyInfo: {
            maritalStatus: formData.get('maritalStatus'),
            spouseName: formData.get('spouseName'),
            children: collectArrayData(formData, ['childName', 'childGender', 'childDOB']),
            fatherAlive: formData.get('fatherAlive'),
            motherAlive: formData.get('motherAlive')
        },
        assets: {
            cash: collectArrayData(formData, ['cashType', 'cashLocation', 'cashAmount']),
            property: collectArrayData(formData, ['propertyType', 'propertyAddress', 'propertyValue']),
            other: collectArrayData(formData, ['otherAssetType', 'otherAssetDesc', 'otherAssetValue'])
        },
        debts: collectArrayData(formData, ['debtType', 'debtCreditor', 'debtAmount']),
        charities: collectArrayData(formData, ['charityName', 'charityPercent', 'charityPurpose']),
        executors: collectArrayData(formData, ['executorName', 'executorRelation', 'executorPhone', 'executorEmail', 'executorAddress']),
        specialInstructions: {
            funeralWishes: formData.get('funeralWishes'),
            specialInstructions: formData.get('specialInstructions')
        },
        dateAndWitnesses: {
            willDate: formData.get('willDate'),
            witness1: {
                name: formData.get('witness1Name'),
                phone: formData.get('witness1Phone'),
                email: formData.get('witness1Email'),
                address: formData.get('witness1Address')
            },
            witness2: {
                name: formData.get('witness2Name'),
                phone: formData.get('witness2Phone'),
                email: formData.get('witness2Email'),
                address: formData.get('witness2Address')
            }
        },
        createdAt: new Date().toISOString()
    };
    
    return data;
}

function collectFeedbackData(formData) {
    return {
        personalInfo: {
            name: formData.get('feedbackName'),
            email: formData.get('feedbackEmail')
        },
        rating: formData.get('rating'),
        feedback: {
            type: formData.get('feedbackType'),
            subject: formData.get('feedbackSubject'),
            message: formData.get('feedbackMessage')
        },
        technical: {
            browser: formData.get('browser'),
            device: formData.get('device')
        },
        privacyConsent: formData.get('privacyConsent'),
        submittedAt: new Date().toISOString()
    };
}

function collectArrayData(formData, fieldNames) {
    const arrays = {};
    fieldNames.forEach(field => {
        arrays[field] = formData.getAll(field + '[]');
    });
    
    const result = [];
    const maxLength = Math.max(...Object.values(arrays).map(arr => arr.length));
    
    for (let i = 0; i < maxLength; i++) {
        const item = {};
        fieldNames.forEach(field => {
            item[field] = arrays[field][i] || '';
        });
        
        // Only add item if at least one field has a value
        if (Object.values(item).some(value => value.trim() !== '')) {
            result.push(item);
        }
    }
    
    return result;
}

// Validation functions
function validateCharitableBequests(willData) {
    const totalCharityPercent = willData.charities.reduce((sum, charity) => {
        return sum + (parseFloat(charity.charityPercent) || 0);
    }, 0);
    
    return totalCharityPercent <= 33.33;
}

// Import/Export functions
function importWill(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const willData = JSON.parse(e.target.result);
            populateFormWithData(willData);
            showAlert('Will data imported successfully!', 'success');
        } catch (error) {
            console.error('Error importing will:', error);
            showAlert('Error importing will data. Please check the file format.', 'error');
        }
    };
    reader.readAsText(file);
}

function populateFormWithData(data) {
    // Populate personal info
    if (data.personalInfo) {
        Object.keys(data.personalInfo).forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = data.personalInfo[key] || '';
        });
    }
    
    // Populate family info
    if (data.familyInfo) {
        Object.keys(data.familyInfo).forEach(key => {
            if (key !== 'children') {
                const element = document.getElementById(key);
                if (element) element.value = data.familyInfo[key] || '';
            }
        });
        
        // Trigger spouse visibility
        const maritalStatus = document.getElementById('maritalStatus');
        if (maritalStatus) maritalStatus.dispatchEvent(new Event('change'));
        
        // Populate children
        if (data.familyInfo.children) {
            populateChildren(data.familyInfo.children);
        }
    }
    
    // Populate assets
    if (data.assets) {
        if (data.assets.cash) populateCashAssets(data.assets.cash);
        if (data.assets.property) populateProperties(data.assets.property);
        if (data.assets.other) populateOtherAssets(data.assets.other);
    }
    
    // Populate debts
    if (data.debts) populateDebts(data.debts);
    
    // Populate charities
    if (data.charities) populateCharities(data.charities);
    
    // Populate executors
    if (data.executors) populateExecutors(data.executors);
    
    // Populate special instructions
    if (data.specialInstructions) {
        Object.keys(data.specialInstructions).forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = data.specialInstructions[key] || '';
        });
    }
    
    // Populate date and witnesses
    if (data.dateAndWitnesses) {
        Object.keys(data.dateAndWitnesses).forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = data.dateAndWitnesses[key] || '';
        });
    }
}

function populateChildren(children) {
    const container = document.getElementById('children-container');
    container.innerHTML = '';
    
    children.forEach((child, index) => {
        if (index === 0) {
            addChild();
        } else {
            addChild();
        }
        
        const entries = container.querySelectorAll('.dynamic-entry');
        const entry = entries[index];
        
        entry.querySelector('input[name="childName[]"]').value = child.childName || '';
        entry.querySelector('select[name="childGender[]"]').value = child.childGender || '';
        entry.querySelector('input[name="childDOB[]"]').value = child.childDOB || '';
    });
}

function populateCashAssets(assets) {
    const container = document.getElementById('cash-container');
    container.innerHTML = '';
    
    assets.forEach((asset, index) => {
        addCashAsset();
        const entries = container.querySelectorAll('.dynamic-entry');
        const entry = entries[index];
        
        entry.querySelector('select[name="cashType[]"]').value = asset.cashType || '';
        entry.querySelector('input[name="cashLocation[]"]').value = asset.cashLocation || '';
        entry.querySelector('input[name="cashAmount[]"]').value = asset.cashAmount || '';
    });
}

function populateProperties(properties) {
    const container = document.getElementById('property-container');
    container.innerHTML = '';
    
    properties.forEach((property, index) => {
        addProperty();
        const entries = container.querySelectorAll('.dynamic-entry');
        const entry = entries[index];
        
        entry.querySelector('select[name="propertyType[]"]').value = property.propertyType || '';
        entry.querySelector('input[name="propertyAddress[]"]').value = property.propertyAddress || '';
        entry.querySelector('input[name="propertyValue[]"]').value = property.propertyValue || '';
    });
}

function populateOtherAssets(assets) {
    const container = document.getElementById('other-assets-container');
    container.innerHTML = '';
    
    assets.forEach((asset, index) => {
        addOtherAsset();
        const entries = container.querySelectorAll('.dynamic-entry');
        const entry = entries[index];
        
        entry.querySelector('input[name="otherAssetType[]"]').value = asset.otherAssetType || '';
        entry.querySelector('input[name="otherAssetDesc[]"]').value = asset.otherAssetDesc || '';
        entry.querySelector('input[name="otherAssetValue[]"]').value = asset.otherAssetValue || '';
    });
}

function populateDebts(debts) {
    const container = document.getElementById('debts-container');
    container.innerHTML = '';
    
    debts.forEach((debt, index) => {
        addDebt();
        const entries = container.querySelectorAll('.dynamic-entry');
        const entry = entries[index];
        
        entry.querySelector('select[name="debtType[]"]').value = debt.debtType || '';
        entry.querySelector('input[name="debtCreditor[]"]').value = debt.debtCreditor || '';
        entry.querySelector('input[name="debtAmount[]"]').value = debt.debtAmount || '';
    });
}

function populateCharities(charities) {
    const container = document.getElementById('charity-container');
    container.innerHTML = '';
    
    charities.forEach((charity, index) => {
        addCharity();
        const entries = container.querySelectorAll('.dynamic-entry');
        const entry = entries[index];
        
        entry.querySelector('input[name="charityName[]"]').value = charity.charityName || '';
        entry.querySelector('input[name="charityPercent[]"]').value = charity.charityPercent || '';
        entry.querySelector('input[name="charityPurpose[]"]').value = charity.charityPurpose || '';
    });
}

function populateExecutors(executors) {
    const container = document.getElementById('executors-container');
    container.innerHTML = '';
    
    executors.forEach((executor, index) => {
        addExecutor();
        const entries = container.querySelectorAll('.dynamic-entry');
        const entry = entries[index];
        
        entry.querySelector('input[name="executorName[]"]').value = executor.executorName || '';
        entry.querySelector('input[name="executorRelation[]"]').value = executor.executorRelation || '';
        entry.querySelector('input[name="executorPhone[]"]').value = executor.executorPhone || '';
        entry.querySelector('input[name="executorEmail[]"]').value = executor.executorEmail || '';
        entry.querySelector('textarea[name="executorAddress[]"]').value = executor.executorAddress || '';
    });
}

// Download functions
function downloadPDF() {
    try {
        // Check if jsPDF is available
        if (!window.jspdf || !window.jspdf.jsPDF) {
            showAlert('PDF library not loaded. Please refresh the page and try again.', 'error');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let pageNumber = 1;
        
        // Set font
        doc.setFont('helvetica');
        
        // Function to add page header and border
        function addPageHeader() {
            // Page border
            doc.setLineWidth(0.5);
            doc.rect(10, 10, 190, 277);
            
            // Header background
            doc.setFillColor(44, 95, 45);
            doc.rect(15, 15, 180, 20, 'F');
            
            // Title
            doc.setFontSize(16);
            doc.setTextColor(255, 255, 255);
            doc.text('ISLAMIC WILL (WASIYYA)', 105, 28, { align: 'center' });
        }
        
        // Function to add page footer
        function addPageFooter() {
            // Footer line
            doc.setLineWidth(0.3);
            doc.setDrawColor(100, 100, 100);
            doc.line(20, 275, 190, 275);
            
            // Page number
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(`Page ${pageNumber}`, 105, 282, { align: 'center' });
            
            // Testator initial line
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.text('Testator Initial: ________________', 20, 282);
        }
        
        // Function to add new page
        function addNewPage() {
            doc.addPage();
            pageNumber++;
            addPageHeader();
            addPageFooter();
            return 45; // Return starting Y position
        }
        
        // Start first page
        addPageHeader();
        addPageFooter();
        
        let yPosition = 45;
        const lineHeight = 6;
        const leftMargin = 20;
        
        // Islamic Declaration
        doc.setFontSize(12);
        doc.setTextColor(44, 95, 45);
        doc.text('DECLARATION OF FAITH', 105, yPosition, { align: 'center' });
        yPosition += 10;
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const declaration = `I bear witness that there is no deity but Allah, the One, the Merciful, the Almighty – Creator of the heavens and the earth and all therein – God of Abraham, Moses, Jesus, Muhammad, and all the Prophets, mercy and peace be upon them all. He is One God and He has no partner. And I bear witness that the Prophet Muhammad is His servant and His Messenger and the last of all the Prophets, mercy and peace be upon him. I bear witness that Allah is the Truth, that His promise is truth, that the Meeting with Him is the truth. I bear witness that the Paradise is truth, and that Hell is truth. I bear witness that the coming of the Day of Judgment is truth, there is no doubt about it, and that Allah, who is exalted above all deficiencies and imperfections, will surely resurrect the dead of all generations of mankind, first and last and those in between.`;
        
        const splitDeclaration = doc.splitTextToSize(declaration, 170);
        doc.text(splitDeclaration, leftMargin, yPosition);
        yPosition += splitDeclaration.length * lineHeight + 15;
        
        // Will Declaration
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const willDeclaration = `I, ${currentWillData.personalInfo.fullName}, being of sound mind and memory, do hereby make, publish and declare this to be my Last Will and Testament according to Islamic principles and hereby revoke all former wills and codicils made by me. The distribution of my estate shall follow Islamic inheritance laws (Faraid) as detailed in Schedule A attached hereto.`;
        const splitWillDeclaration = doc.splitTextToSize(willDeclaration, 170);
        doc.text(splitWillDeclaration, leftMargin, yPosition);
        yPosition += splitWillDeclaration.length * lineHeight + 15;
        
        // Check if we need a new page
        if (yPosition > 220) {
            yPosition = addNewPage();
        }
        
        // Personal Information Section
        addSectionHeader(doc, 'PERSONAL INFORMATION', leftMargin, yPosition);
        yPosition += 12;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        const personalInfo = [
            `Full Name: ${currentWillData.personalInfo.fullName}`,
            `Father's Name: ${currentWillData.personalInfo.fatherName}`,
            `Date of Birth: ${formatDate(currentWillData.personalInfo.dateOfBirth)}`,
            `Nationality: ${currentWillData.personalInfo.nationality}`,
            `ID/Passport Number: ${currentWillData.personalInfo.idNumber}`,
            `Address: ${currentWillData.personalInfo.address}`
        ];
        
        personalInfo.forEach(info => {
            doc.text(info, leftMargin, yPosition);
            yPosition += lineHeight;
        });
        yPosition += 8;
        
        // Family Information Section
        addSectionHeader(doc, 'FAMILY INFORMATION', leftMargin, yPosition);
        yPosition += 12;
        
        doc.text(`Marital Status: ${currentWillData.familyInfo.maritalStatus}`, leftMargin, yPosition);
        yPosition += lineHeight;
        
        if (currentWillData.familyInfo.spouseName) {
            doc.text(`Spouse Name: ${currentWillData.familyInfo.spouseName}`, leftMargin, yPosition);
            yPosition += lineHeight;
        }
        
        doc.text(`Father Status: ${currentWillData.familyInfo.fatherAlive}`, leftMargin, yPosition);
        yPosition += lineHeight;
        doc.text(`Mother Status: ${currentWillData.familyInfo.motherAlive}`, leftMargin, yPosition);
        yPosition += lineHeight + 3;
        
        // Children Information
        if (currentWillData.familyInfo.children.some(child => child.childName)) {
            doc.setFontSize(11);
            doc.setTextColor(44, 95, 45);
            doc.text('Children:', leftMargin, yPosition);
            yPosition += lineHeight + 2;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            currentWillData.familyInfo.children.forEach((child, index) => {
                if (child.childName) {
                    doc.text(`${index + 1}. ${child.childName} (${child.childGender}, DOB: ${formatDate(child.childDOB)})`, leftMargin + 5, yPosition);
                    yPosition += lineHeight;
                }
            });
        }
        yPosition += 8;
        
        // Check if we need a new page
        if (yPosition > 220) {
            yPosition = addNewPage();
        }
        
        // Assets Section
        addSectionHeader(doc, 'ASSETS AND ESTATE', leftMargin, yPosition);
        yPosition += 12;
        
        let totalAssetValue = 0;
        
        // Cash Assets
        if (currentWillData.assets.cash.some(asset => asset.cashType)) {
            doc.setFontSize(11);
            doc.setTextColor(44, 95, 45);
            doc.text('Cash and Bank Accounts:', leftMargin, yPosition);
            yPosition += lineHeight + 2;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            currentWillData.assets.cash.forEach((asset, index) => {
                if (asset.cashType) {
                    const amount = parseFloat(asset.cashAmount) || 0;
                    totalAssetValue += amount;
                    doc.text(`${index + 1}. ${asset.cashType} at ${asset.cashLocation}: $${amount.toLocaleString()}`, leftMargin + 5, yPosition);
                    yPosition += lineHeight;
                }
            });
            yPosition += 3;
        }
        
        // Properties
        if (currentWillData.assets.property.some(property => property.propertyType)) {
            if (yPosition > 200) {
                yPosition = addNewPage();
            }
            
            doc.setFontSize(11);
            doc.setTextColor(44, 95, 45);
            doc.text('Real Estate Properties:', leftMargin, yPosition);
            yPosition += lineHeight + 2;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            currentWillData.assets.property.forEach((property, index) => {
                if (property.propertyType) {
                    const value = parseFloat(property.propertyValue) || 0;
                    totalAssetValue += value;
                    doc.text(`${index + 1}. ${property.propertyType}`, leftMargin + 5, yPosition);
                    yPosition += lineHeight;
                    doc.text(`    Address: ${property.propertyAddress}`, leftMargin + 5, yPosition);
                    yPosition += lineHeight;
                    doc.text(`    Estimated Value: $${value.toLocaleString()}`, leftMargin + 5, yPosition);
                    yPosition += lineHeight + 2;
                }
            });
            yPosition += 3;
        }
        
        // Other Assets
        if (currentWillData.assets.other.some(asset => asset.otherAssetType)) {
            doc.setFontSize(11);
            doc.setTextColor(44, 95, 45);
            doc.text('Other Assets:', leftMargin, yPosition);
            yPosition += lineHeight + 2;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            currentWillData.assets.other.forEach((asset, index) => {
                if (asset.otherAssetType) {
                    const value = parseFloat(asset.otherAssetValue) || 0;
                    totalAssetValue += value;
                    doc.text(`${index + 1}. ${asset.otherAssetType} (${asset.otherAssetDesc}): $${value.toLocaleString()}`, leftMargin + 5, yPosition);
                    yPosition += lineHeight;
                }
            });
            yPosition += 3;
        }
        
        // Total Assets
        doc.setFontSize(12);
        doc.setTextColor(44, 95, 45);
        doc.text(`TOTAL ESTIMATED ASSETS: $${totalAssetValue.toLocaleString()}`, leftMargin, yPosition);
        yPosition += 15;
        
        // Check if we need a new page
        if (yPosition > 200) {
            yPosition = addNewPage();
        }
        
        // Debts and Liabilities
        if (currentWillData.debts.some(debt => debt.debtType)) {
            addSectionHeader(doc, 'DEBTS AND LIABILITIES', leftMargin, yPosition);
            yPosition += 12;
            
            let totalDebt = 0;
            currentWillData.debts.forEach((debt, index) => {
                if (debt.debtType) {
                    const amount = parseFloat(debt.debtAmount) || 0;
                    totalDebt += amount;
                    doc.text(`${index + 1}. ${debt.debtType} - ${debt.debtCreditor}: $${amount.toLocaleString()}`, leftMargin + 5, yPosition);
                    yPosition += lineHeight;
                }
            });
            
            doc.setFontSize(11);
            doc.setTextColor(44, 95, 45);
            doc.text(`TOTAL DEBTS: $${totalDebt.toLocaleString()}`, leftMargin, yPosition);
            doc.text(`NET ESTATE: $${(totalAssetValue - totalDebt).toLocaleString()}`, leftMargin, yPosition + lineHeight + 2);
            yPosition += 20;
        }
        
        // Charitable Bequests (Wasiyya)
        if (currentWillData.charities.some(charity => charity.charityName)) {
            if (yPosition > 180) {
                yPosition = addNewPage();
            }
            
            addSectionHeader(doc, 'CHARITABLE BEQUESTS (WASIYYA)', leftMargin, yPosition);
            yPosition += 12;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('As permitted by Islamic law, I allocate the following charitable bequests (not exceeding 1/3 of my estate):', leftMargin, yPosition);
            yPosition += lineHeight + 3;
            
            currentWillData.charities.forEach((charity, index) => {
                if (charity.charityName) {
                    doc.text(`${index + 1}. ${charity.charityName} - ${charity.charityPercent}% of estate`, leftMargin + 5, yPosition);
                    yPosition += lineHeight;
                    doc.text(`    Purpose: ${charity.charityPurpose}`, leftMargin + 5, yPosition);
                    yPosition += lineHeight + 2;
                }
            });
            yPosition += 5;
        }
        
        // Check if we need a new page
        if (yPosition > 180) {
            yPosition = addNewPage();
        }
        
        // Executors
        if (currentWillData.executors.some(executor => executor.executorName)) {
            addSectionHeader(doc, 'APPOINTED EXECUTORS', leftMargin, yPosition);
            yPosition += 12;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('I hereby appoint the following person(s) as executor(s) of this will:', leftMargin, yPosition);
            yPosition += lineHeight + 3;
            
            currentWillData.executors.forEach((executor, index) => {
                if (executor.executorName) {
                    doc.text(`${index + 1}. Name: ${executor.executorName}`, leftMargin + 5, yPosition);
                    yPosition += lineHeight;
                    doc.text(`    Relationship: ${executor.executorRelation}`, leftMargin + 5, yPosition);
                    yPosition += lineHeight;
                    doc.text(`    Phone: ${executor.executorPhone}`, leftMargin + 5, yPosition);
                    yPosition += lineHeight;
                    doc.text(`    Email: ${executor.executorEmail}`, leftMargin + 5, yPosition);
                    yPosition += lineHeight;
                    doc.text(`    Address: ${executor.executorAddress}`, leftMargin + 5, yPosition);
                    yPosition += lineHeight + 3;
                }
            });
            yPosition += 5;
        }
        
        // Special Instructions
        if (currentWillData.specialInstructions.funeralWishes || currentWillData.specialInstructions.specialInstructions) {
            if (yPosition > 150) {
                yPosition = addNewPage();
            }
            
            addSectionHeader(doc, 'SPECIAL INSTRUCTIONS', leftMargin, yPosition);
            yPosition += 12;
            
            if (currentWillData.specialInstructions.funeralWishes) {
                doc.setFontSize(11);
                doc.setTextColor(44, 95, 45);
                doc.text('Funeral and Burial Wishes:', leftMargin, yPosition);
                yPosition += lineHeight + 2;
                
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                const funeralText = doc.splitTextToSize(currentWillData.specialInstructions.funeralWishes, 170);
                doc.text(funeralText, leftMargin, yPosition);
                yPosition += funeralText.length * lineHeight + 5;
            }
            
            if (currentWillData.specialInstructions.specialInstructions) {
                doc.setFontSize(11);
                doc.setTextColor(44, 95, 45);
                doc.text('Additional Instructions:', leftMargin, yPosition);
                yPosition += lineHeight + 2;
                
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                const instructionsText = doc.splitTextToSize(currentWillData.specialInstructions.specialInstructions, 170);
                doc.text(instructionsText, leftMargin, yPosition);
                yPosition += instructionsText.length * lineHeight + 5;
            }
        }
        
        // Check if we need a new page for signatures
        if (yPosition > 160) {
            yPosition = addNewPage();
        }
        
        // Signature Section
        addSectionHeader(doc, 'SIGNATURES AND ATTESTATION', leftMargin, yPosition);
        yPosition += 15;
        
        // Will Creator Signature
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text('I declare that this is my Last Will and Testament, and I execute it willingly and with full understanding.', leftMargin, yPosition);
        yPosition += lineHeight + 5;
        
        doc.text(`Testator Name: ${currentWillData.personalInfo.fullName}`, leftMargin, yPosition);
        yPosition += lineHeight + 15;
        
        // Signature line for testator
        doc.setLineWidth(0.5);
        doc.line(leftMargin, yPosition, leftMargin + 80, yPosition);
        doc.text('Signature of Testator', leftMargin, yPosition + 8);
        
        doc.line(leftMargin + 100, yPosition, leftMargin + 170, yPosition);
        doc.text(`Date: ${formatDate(currentWillData.dateAndWitnesses.willDate)}`, leftMargin + 100, yPosition + 8);
        yPosition += 25;
        
        // Witnesses Section
        doc.setFontSize(12);
        doc.setTextColor(44, 95, 45);
        doc.text('WITNESSES ATTESTATION', leftMargin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('We, the undersigned witnesses, attest that the testator signed this will in our presence, and that', leftMargin, yPosition);
        yPosition += lineHeight;
        doc.text('the testator appeared to be of sound mind and under no constraint or undue influence.', leftMargin, yPosition);
        yPosition += lineHeight + 10;
        
        // Check if we need a new page
        if (yPosition > 180) {
            yPosition = addNewPage();
        }
        
        // Witness 1
        doc.setFontSize(11);
        doc.setTextColor(44, 95, 45);
        doc.text('WITNESS 1:', leftMargin, yPosition);
        yPosition += lineHeight + 3;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Name: ${currentWillData.dateAndWitnesses.witness1.name || '___________________________'}`, leftMargin, yPosition);
        yPosition += lineHeight;
        doc.text(`Phone: ${currentWillData.dateAndWitnesses.witness1.phone || '___________________________'}`, leftMargin, yPosition);
        yPosition += lineHeight;
        doc.text(`Email: ${currentWillData.dateAndWitnesses.witness1.email || '___________________________'}`, leftMargin, yPosition);
        yPosition += lineHeight;
        doc.text(`Address: ${currentWillData.dateAndWitnesses.witness1.address || '___________________________'}`, leftMargin, yPosition);
        yPosition += lineHeight + 10;
        
        doc.line(leftMargin, yPosition, leftMargin + 80, yPosition);
        doc.text('Signature', leftMargin, yPosition + 8);
        
        doc.line(leftMargin + 100, yPosition, leftMargin + 170, yPosition);
        doc.text('Date', leftMargin + 100, yPosition + 8);
        yPosition += 25;
        
        // Witness 2
        doc.setFontSize(11);
        doc.setTextColor(44, 95, 45);
        doc.text('WITNESS 2:', leftMargin, yPosition);
        yPosition += lineHeight + 3;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Name: ${currentWillData.dateAndWitnesses.witness2.name || '___________________________'}`, leftMargin, yPosition);
        yPosition += lineHeight;
        doc.text(`Phone: ${currentWillData.dateAndWitnesses.witness2.phone || '___________________________'}`, leftMargin, yPosition);
        yPosition += lineHeight;
        doc.text(`Email: ${currentWillData.dateAndWitnesses.witness2.email || '___________________________'}`, leftMargin, yPosition);
        yPosition += lineHeight;
        doc.text(`Address: ${currentWillData.dateAndWitnesses.witness2.address || '___________________________'}`, leftMargin, yPosition);
        yPosition += lineHeight + 10;
        
        doc.line(leftMargin, yPosition, leftMargin + 80, yPosition);
        doc.text('Signature', leftMargin, yPosition + 8);
        
        doc.line(leftMargin + 100, yPosition, leftMargin + 170, yPosition);
        doc.text('Date', leftMargin + 100, yPosition + 8);
        yPosition += 25;
        
        // Executor Acknowledgment
        if (currentWillData.executors.some(executor => executor.executorName)) {
            // Check if we need a new page
            if (yPosition > 150) {
                yPosition = addNewPage();
            }
            
            doc.setFontSize(12);
            doc.setTextColor(44, 95, 45);
            doc.text('EXECUTOR ACKNOWLEDGMENT', leftMargin, yPosition);
            yPosition += 10;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('I/We acknowledge my/our appointment as executor(s) and accept the responsibility to execute', leftMargin, yPosition);
            yPosition += lineHeight;
            doc.text('this will according to Islamic principles and applicable laws.', leftMargin, yPosition);
            yPosition += lineHeight + 10;
            
            currentWillData.executors.forEach((executor, index) => {
                if (executor.executorName) {
                    doc.text(`Executor ${index + 1}: ${executor.executorName}`, leftMargin, yPosition);
                    yPosition += lineHeight + 10;
                    
                    doc.line(leftMargin, yPosition, leftMargin + 80, yPosition);
                    doc.text('Signature', leftMargin, yPosition + 8);
                    
                    doc.line(leftMargin + 100, yPosition, leftMargin + 170, yPosition);
                    doc.text('Date', leftMargin + 100, yPosition + 8);
                    yPosition += 20;
                }
            });
        }
        
        // Footer with Islamic reminder
        yPosition = addNewPage();
        yPosition = 100;
        
        doc.setFontSize(14);
        doc.setTextColor(44, 95, 45);
        doc.text('IMPORTANT ISLAMIC REMINDERS', 105, yPosition, { align: 'center' });
        yPosition += 20;
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const reminders = [
            '• This will should be reviewed by qualified Islamic scholars to ensure Shariah compliance',
            '• The distribution must follow Islamic inheritance laws (Faraid) for 2/3 of the estate',
            '• Only 1/3 of the estate may be allocated through Wasiyya (charitable bequests)',
            '• Debts and funeral expenses must be paid before any distribution',
            '• This will should be regularly updated to reflect changes in circumstances',
            '• Consult with legal professionals in your jurisdiction for legal validity'
        ];
        
        reminders.forEach(reminder => {
            const reminderText = doc.splitTextToSize(reminder, 170);
            doc.text(reminderText, leftMargin, yPosition);
            yPosition += reminderText.length * lineHeight + 5;
        });
        
        yPosition += 20;
        
        // Document creation info
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('This Islamic Will was generated using the Islamic Will Creator tool', 105, yPosition, { align: 'center' });
        doc.text(`Generated on: ${formatDate(getCurrentDate())}`, 105, yPosition + 8, { align: 'center' });
        doc.text('May Allah accept this as a righteous deed. Ameen.', 105, yPosition + 16, { align: 'center' });
        
        // Add Schedule A - Islamic Inheritance Laws
        doc.addPage();
        pageNumber++;
        addPageHeader();
        addPageFooter();
        
        yPosition = 45;
        
        // Schedule A Title
        doc.setFontSize(18);
        doc.setTextColor(44, 95, 45);
        doc.text('SCHEDULE A', 105, yPosition, { align: 'center' });
        yPosition += 10;
        
        doc.setFontSize(14);
        doc.text('ISLAMIC INHERITANCE LAWS (FARAID)', 105, yPosition, { align: 'center' });
        yPosition += 20;
        
        // Introduction
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const introText = 'The following tables show the Islamic inheritance shares according to the Quran and Sunnah. These laws ensure just distribution among heirs and must be followed for 2/3 of the estate.';
        const splitIntro = doc.splitTextToSize(introText, 170);
        doc.text(splitIntro, leftMargin, yPosition);
        yPosition += splitIntro.length * lineHeight + 15;
        
        // Table 1: Spouse Inheritance
        doc.setFontSize(12);
        doc.setTextColor(44, 95, 45);
        doc.text('1. SPOUSE INHERITANCE', leftMargin, yPosition);
        yPosition += 10;
        
        // Table headers
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(240, 240, 240);
        doc.rect(leftMargin, yPosition, 170, 8, 'F');
        doc.text('Situation', leftMargin + 2, yPosition + 5);
        doc.text('Husband Gets', leftMargin + 60, yPosition + 5);
        doc.text('Wife Gets', leftMargin + 120, yPosition + 5);
        yPosition += 10;
        
        // Table rows
        const spouseData = [
            ['With children/grandchildren', '1/4 of estate', '1/8 of estate'],
            ['Without children/grandchildren', '1/2 of estate', '1/4 of estate']
        ];
        
        spouseData.forEach(row => {
            doc.text(row[0], leftMargin + 2, yPosition + 5);
            doc.text(row[1], leftMargin + 60, yPosition + 5);
            doc.text(row[2], leftMargin + 120, yPosition + 5);
            yPosition += 8;
        });
        yPosition += 15;
        
        // Check if we need a new page
        if (yPosition > 200) {
            doc.addPage();
            pageNumber++;
            addPageHeader();
            addPageFooter();
            yPosition = 45;
        }
        
        // Table 2: Parents Inheritance
        doc.setFontSize(12);
        doc.setTextColor(44, 95, 45);
        doc.text('2. PARENTS INHERITANCE', leftMargin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(240, 240, 240);
        doc.rect(leftMargin, yPosition, 170, 8, 'F');
        doc.text('Situation', leftMargin + 2, yPosition + 5);
        doc.text('Father Gets', leftMargin + 70, yPosition + 5);
        doc.text('Mother Gets', leftMargin + 125, yPosition + 5);
        yPosition += 10;
        
        const parentsData = [
            ['With children', '1/6 + residue', '1/6 of estate'],
            ['Without children, with siblings', '1/6 + residue', '1/6 of estate'],
            ['Without children, no siblings', '1/6 + residue', '1/3 of estate']
        ];
        
        parentsData.forEach(row => {
            doc.text(row[0], leftMargin + 2, yPosition + 5);
            doc.text(row[1], leftMargin + 70, yPosition + 5);
            doc.text(row[2], leftMargin + 125, yPosition + 5);
            yPosition += 8;
        });
        yPosition += 15;
        
        // Table 3: Children Inheritance
        doc.setFontSize(12);
        doc.setTextColor(44, 95, 45);
        doc.text('3. CHILDREN INHERITANCE', leftMargin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(240, 240, 240);
        doc.rect(leftMargin, yPosition, 170, 8, 'F');
        doc.text('Family Composition', leftMargin + 2, yPosition + 5);
        doc.text('Distribution Rule', leftMargin + 90, yPosition + 5);
        yPosition += 10;
        
        const childrenData = [
            ['Sons only', 'Equal shares of residue'],
            ['Daughters only', '2/3 for multiple, 1/2 for one'],
            ['Sons and daughters', 'Male gets 2x female share'],
            ['With grandchildren', 'Children inherit first']
        ];
        
        childrenData.forEach(row => {
            doc.text(row[0], leftMargin + 2, yPosition + 5);
            doc.text(row[1], leftMargin + 90, yPosition + 5);
            yPosition += 8;
        });
        yPosition += 15;
        
        // Check if we need a new page
        if (yPosition > 200) {
            doc.addPage();
            pageNumber++;
            addPageHeader();
            addPageFooter();
            yPosition = 45;
        }
        
        // Table 4: Siblings Inheritance
        doc.setFontSize(12);
        doc.setTextColor(44, 95, 45);
        doc.text('4. SIBLINGS INHERITANCE', leftMargin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(240, 240, 240);
        doc.rect(leftMargin, yPosition, 170, 8, 'F');
        doc.text('Situation', leftMargin + 2, yPosition + 5);
        doc.text('Share', leftMargin + 100, yPosition + 5);
        yPosition += 10;
        
        const siblingsData = [
            ['Full brother (no father/children)', 'Residue after fixed shares'],
            ['Full sister alone (no father/children)', '1/2 of estate'],
            ['Multiple full sisters', '2/3 of estate'],
            ['Brothers and sisters together', 'Male gets 2x female share'],
            ['Half-siblings (same father)', 'Inherit if no full siblings'],
            ['Half-siblings (same mother)', '1/6 for one, 1/3 for multiple']
        ];
        
        siblingsData.forEach(row => {
            doc.text(row[0], leftMargin + 2, yPosition + 5);
            doc.text(row[1], leftMargin + 100, yPosition + 5);
            yPosition += 8;
        });
        yPosition += 15;
        
        // Important Notes
        doc.setFontSize(12);
        doc.setTextColor(44, 95, 45);
        doc.text('IMPORTANT NOTES:', leftMargin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const notes = [
            '• Fixed shares (Fara\'id) are distributed first',
            '• Residue (\'Asabah) goes to male agnatic heirs',
            '• No heir can be deprived of their fixed Islamic share',
            '• Debts and funeral expenses are paid before distribution',
            '• Maximum 1/3 can be bequeathed to non-heirs or charity',
            '• These rules may vary based on different schools of Islamic jurisprudence'
        ];
        
        notes.forEach(note => {
            const noteText = doc.splitTextToSize(note, 165);
            doc.text(noteText, leftMargin + 5, yPosition);
            yPosition += noteText.length * lineHeight + 3;
        });
        
        yPosition += 10;
        
        // Add Inheritance Calculation Results if available
        const willResultsContent = document.getElementById('willResultsContent');
        if (willResultsContent && willResultsContent.innerHTML.trim() !== '') {
            // Check if we need a new page
            if (yPosition > 180) {
                yPosition = addNewPage();
            }
            
            addSectionHeader(doc, 'INHERITANCE DISTRIBUTION CALCULATION', leftMargin, yPosition);
            yPosition += 12;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('Based on the surviving relatives information provided, the inheritance distribution is as follows:', leftMargin, yPosition);
            yPosition += lineHeight + 5;
            
            // Get the calculation results from the will calculator
            const resultRows = willResultsContent.querySelectorAll('.result-row');
            if (resultRows.length > 0) {
                doc.setFontSize(11);
                doc.setTextColor(44, 95, 45);
                doc.text('Inheritance Shares:', leftMargin, yPosition);
                yPosition += lineHeight + 3;
                
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                
                resultRows.forEach((row, index) => {
                    const heirName = row.querySelector('.heir-name')?.textContent || '';
                    const heirShare = row.querySelector('.heir-share')?.textContent || '';
                    const heirPercentage = row.querySelector('.heir-percentage')?.textContent || '';
                    
                    if (heirName && heirShare && heirPercentage) {
                        doc.text(`${index + 1}. ${heirName}: ${heirShare} (${heirPercentage})`, leftMargin + 5, yPosition);
                        yPosition += lineHeight;
                    }
                });
                
                yPosition += 8;
            }
            
            // Add calculation notes
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            const calculationNotes = [
                '• These calculations are based on Islamic inheritance law (Mirath)',
                '• Percentages apply to the net estate after debts and funeral expenses',
                '• Up to 1/3 of the estate can be allocated to charitable bequests (Wasiyya)',
                '• Consult Islamic scholars for complex inheritance situations'
            ];
            
            calculationNotes.forEach(note => {
                if (yPosition > 270) {
                    yPosition = addNewPage();
                }
                doc.text(note, leftMargin, yPosition);
                yPosition += lineHeight;
            });
            
            yPosition += 10;
        }
        
        // Source reference
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Source: Based on Quranic verses (4:11-12, 4:176) and authentic Hadith', leftMargin, yPosition);
        doc.text('Consult qualified Islamic scholars for specific inheritance cases', leftMargin, yPosition + 8);
        
        // Save the PDF
        const fileName = `Islamic_Will_${currentWillData.personalInfo.fullName.replace(/\s+/g, '_')}_${getCurrentDate()}.pdf`;
        doc.save(fileName);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showAlert('Error generating PDF. Please try again.', 'error');
    }
}

// Helper function to add section headers
function addSectionHeader(doc, title, x, y) {
    doc.setFillColor(240, 248, 255);
    doc.rect(x - 2, y - 8, 174, 10, 'F');
    doc.setFontSize(12);
    doc.setTextColor(44, 95, 45);
    doc.text(title, x, y);
}

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function downloadJSON() {
    try {
        const dataStr = JSON.stringify(currentWillData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `islamic_will_${currentWillData.personalInfo.fullName.replace(/\s+/g, '_')}_${getCurrentDate()}.json`;
        link.click();
        
        URL.revokeObjectURL(link.href);
        
    } catch (error) {
        console.error('Error generating JSON:', error);
        showAlert('Error generating JSON file. Please try again.', 'error');
    }
}

// Utility functions
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function showSuccessModal(title, message) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('success-modal').style.display = 'block';
}

function showAlert(message, type) {
    // Create alert element if it doesn't exist
    let alertElement = document.querySelector('.alert');
    if (!alertElement) {
        alertElement = document.createElement('div');
        alertElement.className = 'alert';
        document.querySelector('.container').insertBefore(alertElement, document.querySelector('.container').firstChild);
    }
    
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type} show`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertElement.classList.remove('show');
    }, 5000);
}

function resetForm() {
    if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
        document.getElementById('will-form').reset();
        
        // Reset dynamic sections to single entry
        resetDynamicSection('children-container', addChild);
        resetDynamicSection('cash-container', addCashAsset);
        resetDynamicSection('property-container', addProperty);
        resetDynamicSection('other-assets-container', addOtherAsset);
        resetDynamicSection('debts-container', addDebt);
        resetDynamicSection('charity-container', addCharity);
        resetDynamicSection('executors-container', addExecutor);
        
        // Reset date to current
        document.getElementById('willDate').value = getCurrentDate();
        
        showAlert('Form has been reset successfully.', 'success');
    }
}

// resetFeedbackForm is provided by feedback-system.js to avoid duplicate definitions

function resetDynamicSection(containerId, addFunction) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    addFunction();
}

function autoDetectTechnicalInfo() {
    // Auto-detect browser
    const browserField = document.getElementById('browser');
    if (browserField) {
        const userAgent = navigator.userAgent;
        let browserInfo = 'Unknown';
        
        if (userAgent.includes('Chrome')) {
            browserInfo = 'Chrome ' + userAgent.match(/Chrome\/(\d+)/)[1];
        } else if (userAgent.includes('Firefox')) {
            browserInfo = 'Firefox ' + userAgent.match(/Firefox\/(\d+)/)[1];
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            browserInfo = 'Safari ' + userAgent.match(/Version\/(\d+)/)[1];
        } else if (userAgent.includes('Edge')) {
            browserInfo = 'Edge ' + userAgent.match(/Edge\/(\d+)/)[1];
        }
        
        browserField.value = browserInfo;
    }
    
    // Auto-detect device type
    const deviceField = document.getElementById('device');
    if (deviceField) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?=.*\bMobile\b)/.test(navigator.userAgent);
        
        if (isTablet) {
            deviceField.value = 'tablet';
        } else if (isMobile) {
            deviceField.value = 'mobile';
        } else {
            deviceField.value = 'desktop';
        }
    }
}

// Initialize page based on URL hash
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'user-manual', 'create-will', 'inheritance-schedule', 'inheritance-calculator', 'feedback'].includes(hash)) {
        showPage(hash);
    } else {
        showPage('home');
    }
    
    // Initialize inheritance calculator
    initializeInheritanceCalculator();
});

// Handle browser back/forward buttons
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'user-manual', 'create-will', 'inheritance-schedule', 'inheritance-calculator', 'feedback'].includes(hash)) {
        showPage(hash);
    }
});

// Inheritance Calculator Functions
function initializeInheritanceCalculator() {
    // Set current date for calculation date
    const calculationDateInput = document.getElementById('calculationDate');
    if (calculationDateInput) {
        calculationDateInput.value = getCurrentDate();
    }
    
    const calculateBtn = document.getElementById('calculateInheritance');
    const clearBtn = document.getElementById('clearCalculator');
    const exportBtn = document.getElementById('exportResults');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateInheritance);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCalculator);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportCalculatorResults);
    }
}

function calculateInheritance() {
    try {
        // Get all input values
        const relatives = {
            husband: parseInt(document.getElementById('husband').value) || 0,
            wives: parseInt(document.getElementById('wives').value) || 0,
            sons: parseInt(document.getElementById('sons').value) || 0,
            daughters: parseInt(document.getElementById('daughters').value) || 0,
            grandsons: parseInt(document.getElementById('grandsons').value) || 0,
            granddaughters: parseInt(document.getElementById('granddaughters').value) || 0,
            father: parseInt(document.getElementById('father').value) || 0,
            mother: parseInt(document.getElementById('mother').value) || 0,
            grandfather: parseInt(document.getElementById('grandfather').value) || 0,
            paternal_grandmother: parseInt(document.getElementById('paternal_grandmother').value) || 0,
            maternal_grandmother: parseInt(document.getElementById('maternal_grandmother').value) || 0,
            full_brothers: parseInt(document.getElementById('full_brothers').value) || 0,
            full_sisters: parseInt(document.getElementById('full_sisters').value) || 0,
            paternal_brothers: parseInt(document.getElementById('paternal_brothers').value) || 0,
            paternal_sisters: parseInt(document.getElementById('paternal_sisters').value) || 0,
            maternal_brothers: parseInt(document.getElementById('maternal_brothers').value) || 0,
            maternal_sisters: parseInt(document.getElementById('maternal_sisters').value) || 0,
            full_nephews: parseInt(document.getElementById('full_nephews').value) || 0,
            paternal_nephews: parseInt(document.getElementById('paternal_nephews').value) || 0,
            full_nephew_sons: parseInt(document.getElementById('full_nephew_sons').value) || 0,
            paternal_nephew_sons: parseInt(document.getElementById('paternal_nephew_sons').value) || 0,
            full_paternal_uncles: parseInt(document.getElementById('full_paternal_uncles').value) || 0,
            paternal_paternal_uncles: parseInt(document.getElementById('paternal_paternal_uncles').value) || 0,
            full_cousins: parseInt(document.getElementById('full_cousins').value) || 0,
            paternal_cousins: parseInt(document.getElementById('paternal_cousins').value) || 0,
            full_cousin_sons: parseInt(document.getElementById('full_cousin_sons').value) || 0,
            paternal_cousin_sons: parseInt(document.getElementById('paternal_cousin_sons').value) || 0,
            full_cousin_grandsons: parseInt(document.getElementById('full_cousin_grandsons').value) || 0,
            paternal_cousin_grandsons: parseInt(document.getElementById('paternal_cousin_grandsons').value) || 0
        };
        
        // Validate inputs
        if (relatives.husband > 1) {
            showCalculatorError('There can be maximum 1 husband');
            return;
        }
        
        if (relatives.wives > 4) {
            showCalculatorError('There can be maximum 4 wives');
            return;
        }
        
        if (relatives.father > 1) {
            showCalculatorError('There can be maximum 1 father');
            return;
        }
        
        if (relatives.mother > 1) {
            showCalculatorError('There can be maximum 1 mother');
            return;
        }
        
        // Calculate inheritance shares
        const results = performInheritanceCalculation(relatives);
        
        // Display results
        displayCalculatorResults(results);
        
    } catch (error) {
        console.error('Error calculating inheritance:', error);
        showCalculatorError('An error occurred while calculating inheritance. Please check your inputs and try again.');
    }
}

function performInheritanceCalculation(relatives) {
    const results = [];
    let fixedShares = {}; // For fixed shares (Fara'id)
    let residuaryHeirs = []; // For residuary inheritance (Asabah)
    
    // Helper function to get all input values
    const getRelativeCount = (id) => {
        const element = document.getElementById(id);
        return element ? parseInt(element.value) || 0 : 0;
    };
    
    // Get all relative counts
    const rel = {
        husband: getRelativeCount('husband'),
        wives: getRelativeCount('wives'),
        sons: getRelativeCount('sons'),
        daughters: getRelativeCount('daughters'),
        grandsons: getRelativeCount('grandsons'),
        granddaughters: getRelativeCount('granddaughters'),
        father: getRelativeCount('father'),
        mother: getRelativeCount('mother'),
        grandfather: getRelativeCount('grandfather'),
        paternal_grandmother: getRelativeCount('paternal_grandmother'),
        maternal_grandmother: getRelativeCount('maternal_grandmother'),
        full_brothers: getRelativeCount('full_brothers'),
        full_sisters: getRelativeCount('full_sisters'),
        paternal_brothers: getRelativeCount('paternal_brothers'),
        paternal_sisters: getRelativeCount('paternal_sisters'),
        maternal_brothers: getRelativeCount('maternal_brothers'),
        maternal_sisters: getRelativeCount('maternal_sisters'),
        full_nephews: getRelativeCount('full_nephews'),
        paternal_nephews: getRelativeCount('paternal_nephews'),
        full_nephew_sons: getRelativeCount('full_nephew_sons'),
        paternal_nephew_sons: getRelativeCount('paternal_nephew_sons'),
        full_paternal_uncles: getRelativeCount('full_paternal_uncles'),
        paternal_paternal_uncles: getRelativeCount('paternal_paternal_uncles'),
        full_cousins: getRelativeCount('full_cousins'),
        paternal_cousins: getRelativeCount('paternal_cousins'),
        full_cousin_sons: getRelativeCount('full_cousin_sons'),
        paternal_cousin_sons: getRelativeCount('paternal_cousin_sons'),
        full_cousin_grandsons: getRelativeCount('full_cousin_grandsons'),
        paternal_cousin_grandsons: getRelativeCount('paternal_cousin_grandsons')
    };
    
    // Check for presence of descendants
    const hasChildren = rel.sons > 0 || rel.daughters > 0;
    const hasGrandchildren = rel.grandsons > 0 || rel.granddaughters > 0;
    const hasMaleDescendants = rel.sons > 0 || rel.grandsons > 0;
    const hasDescendants = hasChildren || hasGrandchildren;
    
    // Check for siblings
    const hasSiblings = rel.full_brothers > 0 || rel.full_sisters > 0 || 
                       rel.paternal_brothers > 0 || rel.paternal_sisters > 0 ||
                       rel.maternal_brothers > 0 || rel.maternal_sisters > 0;
    const hasMultipleSiblings = (rel.full_brothers + rel.full_sisters + 
                                rel.paternal_brothers + rel.paternal_sisters) >= 2;
    
    // 1. FIXED SHARES (FARA'ID) CALCULATION
    
    // Husband's share
    if (rel.husband > 0) {
        if (hasDescendants) {
            fixedShares['Husband'] = { share: 1/4, fraction: '1/4', count: 1 };
        } else {
            fixedShares['Husband'] = { share: 1/2, fraction: '1/2', count: 1 };
        }
    }
    
    // Wives' share
    if (rel.wives > 0) {
        if (hasDescendants) {
            fixedShares[rel.wives > 1 ? `Wives (${rel.wives})` : 'Wife'] = { 
                share: 1/8, fraction: '1/8', count: rel.wives 
            };
        } else {
            fixedShares[rel.wives > 1 ? `Wives (${rel.wives})` : 'Wife'] = { 
                share: 1/4, fraction: '1/4', count: rel.wives 
            };
        }
    }
    
    // Mother's share
    if (rel.mother > 0) {
        if (hasDescendants || hasMultipleSiblings) {
            fixedShares['Mother'] = { share: 1/6, fraction: '1/6', count: 1 };
        } else {
            fixedShares['Mother'] = { share: 1/3, fraction: '1/3', count: 1 };
        }
    }
    
    // Father's share (if there are male descendants, father gets 1/6 + residue)
    if (rel.father > 0) {
        if (hasMaleDescendants) {
            fixedShares['Father'] = { share: 1/6, fraction: '1/6', count: 1, hasResidue: true };
        } else {
            // Father will get residue or fixed share depending on other heirs
            residuaryHeirs.push({ name: 'Father', count: 1, priority: 1 });
        }
    }
    
    // Grandfather's share (only if father is not alive)
    if (rel.grandfather > 0 && rel.father === 0) {
        if (hasMaleDescendants) {
            fixedShares['Grandfather'] = { share: 1/6, fraction: '1/6', count: 1, hasResidue: true };
        } else {
            residuaryHeirs.push({ name: 'Grandfather', count: 1, priority: 2 });
        }
    }
    
    // Grandmothers' share
    const totalGrandmothers = rel.paternal_grandmother + rel.maternal_grandmother;
    if (totalGrandmothers > 0 && rel.mother === 0) {
        let grandmotherNames = [];
        if (rel.paternal_grandmother > 0) grandmotherNames.push('Paternal Grandmother');
        if (rel.maternal_grandmother > 0) grandmotherNames.push('Maternal Grandmother');
        
        fixedShares[grandmotherNames.join(' & ')] = { 
            share: 1/6, fraction: '1/6', count: totalGrandmothers 
        };
    }
    
    // Daughters' share (only if no sons)
    if (rel.daughters > 0 && rel.sons === 0) {
        if (rel.daughters === 1) {
            fixedShares['Daughter'] = { share: 1/2, fraction: '1/2', count: 1 };
        } else {
            fixedShares[`Daughters (${rel.daughters})`] = { share: 2/3, fraction: '2/3', count: rel.daughters };
        }
    }
    
    // Granddaughters' share (only if no sons/daughters)
    if (rel.granddaughters > 0 && rel.sons === 0 && rel.daughters === 0 && rel.grandsons === 0) {
        if (rel.granddaughters === 1) {
            fixedShares['Granddaughter'] = { share: 1/2, fraction: '1/2', count: 1 };
        } else {
            fixedShares[`Granddaughters (${rel.granddaughters})`] = { share: 2/3, fraction: '2/3', count: rel.granddaughters };
        }
    }
    
    // Full sisters' share (only if no father, sons, grandsons)
    if (rel.full_sisters > 0 && rel.father === 0 && rel.sons === 0 && rel.grandsons === 0) {
        if (rel.full_brothers === 0) {
            if (rel.full_sisters === 1) {
                fixedShares['Full Sister'] = { share: 1/2, fraction: '1/2', count: 1 };
            } else {
                fixedShares[`Full Sisters (${rel.full_sisters})`] = { share: 2/3, fraction: '2/3', count: rel.full_sisters };
            }
        }
    }
    
    // Paternal sisters' share (only if no father, sons, grandsons, full brothers/sisters)
    if (rel.paternal_sisters > 0 && rel.father === 0 && rel.sons === 0 && rel.grandsons === 0 && 
        rel.full_brothers === 0 && rel.full_sisters === 0) {
        if (rel.paternal_brothers === 0) {
            if (rel.paternal_sisters === 1) {
                fixedShares['Paternal Sister'] = { share: 1/2, fraction: '1/2', count: 1 };
            } else {
                fixedShares[`Paternal Sisters (${rel.paternal_sisters})`] = { share: 2/3, fraction: '2/3', count: rel.paternal_sisters };
            }
        }
    }
    
    // Maternal siblings' share (only if no descendants or father)
    const totalMaternalSiblings = rel.maternal_brothers + rel.maternal_sisters;
    if (totalMaternalSiblings > 0 && !hasDescendants && rel.father === 0 && rel.grandfather === 0) {
        if (totalMaternalSiblings === 1) {
            const name = rel.maternal_brothers > 0 ? 'Maternal Brother' : 'Maternal Sister';
            fixedShares[name] = { share: 1/6, fraction: '1/6', count: 1 };
        } else {
            fixedShares[`Maternal Siblings (${totalMaternalSiblings})`] = { share: 1/3, fraction: '1/3', count: totalMaternalSiblings };
        }
    }
    
    // 2. RESIDUARY INHERITANCE (ASABAH) CALCULATION
    
    // Sons get residue and share with daughters (2:1 ratio)
    if (rel.sons > 0) {
        residuaryHeirs.push({ name: 'Sons', count: rel.sons, priority: 0, ratio: 2 });
        if (rel.daughters > 0) {
            residuaryHeirs.push({ name: 'Daughters', count: rel.daughters, priority: 0, ratio: 1 });
        }
    }
    
    // Grandsons get residue if no sons
    if (rel.grandsons > 0 && rel.sons === 0) {
        residuaryHeirs.push({ name: 'Grandsons', count: rel.grandsons, priority: 0, ratio: 2 });
        if (rel.granddaughters > 0) {
            residuaryHeirs.push({ name: 'Granddaughters', count: rel.granddaughters, priority: 0, ratio: 1 });
        }
    }
    
    // Full brothers (if no father and no male descendants)
    if (rel.full_brothers > 0 && rel.father === 0 && !hasMaleDescendants) {
        residuaryHeirs.push({ name: 'Full Brothers', count: rel.full_brothers, priority: 3, ratio: 2 });
        if (rel.full_sisters > 0) {
            // Remove full sisters from fixed shares if they exist there
            delete fixedShares['Full Sister'];
            delete fixedShares[`Full Sisters (${rel.full_sisters})`];
            residuaryHeirs.push({ name: 'Full Sisters', count: rel.full_sisters, priority: 3, ratio: 1 });
        }
    }
    
    // Calculate total fixed shares
    let totalFixedShares = 0;
    Object.values(fixedShares).forEach(heir => {
        totalFixedShares += heir.share;
    });
    
    // Add fixed shares to results
    Object.entries(fixedShares).forEach(([name, heir]) => {
        results.push({
            name: name,
            count: heir.count,
            share: heir.share,
            fraction: heir.fraction,
            percentage: (heir.share * 100).toFixed(2),
            hasResidue: heir.hasResidue || false
        });
    });
    
    // Calculate residue
    const residue = Math.max(0, 1 - totalFixedShares);
    
    // Distribute residue among residuary heirs
    if (residue > 0 && residuaryHeirs.length > 0) {
        // Sort by priority (lower number = higher priority)
        residuaryHeirs.sort((a, b) => a.priority - b.priority);
        
        // Get highest priority group
        const highestPriority = residuaryHeirs[0].priority;
        const eligibleHeirs = residuaryHeirs.filter(heir => heir.priority === highestPriority);
        
        // Calculate total ratio units
        let totalRatioUnits = 0;
        eligibleHeirs.forEach(heir => {
            totalRatioUnits += heir.count * (heir.ratio || 1);
        });
        
        // Distribute residue
        eligibleHeirs.forEach(heir => {
            const heirUnits = heir.count * (heir.ratio || 1);
            const heirShare = (heirUnits / totalRatioUnits) * residue;
            
            results.push({
                name: heir.count > 1 ? `${heir.name} (${heir.count})` : heir.name,
                count: heir.count,
                share: heirShare,
                fraction: 'Residue',
                percentage: (heirShare * 100).toFixed(2),
                isResidue: true
            });
        });
    }
    
    return results;
}

function displayCalculatorResults(calculation) {
    const resultsDiv = document.getElementById('calculatorResults');
    const contentDiv = document.getElementById('resultsContent');
    
    if (!resultsDiv || !contentDiv) return;
    
    // Check if calculation has the expected structure
    const results = calculation.results || calculation;
    const totalShares = calculation.totalShares || results.reduce((sum, heir) => sum + heir.share, 0);
    const remainingEstate = calculation.remainingEstate || Math.max(0, 1 - totalShares);
    
    // Calculate total individual heirs count
    const totalHeirs = results.reduce((sum, heir) => sum + heir.count, 0);
    
    let html = '';
    
    // Results summary with better styling
    html += `
        <div class="results-summary">
            <h3><i class="fas fa-chart-pie"></i> Inheritance Distribution Summary</h3>
            <div class="summary-grid">
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-users"></i></div>
                    <div class="summary-content">
                        <div class="summary-value">${totalHeirs}</div>
                        <div class="summary-label">Total Heirs</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-percentage"></i></div>
                    <div class="summary-content">
                        <div class="summary-value">${(totalShares * 100).toFixed(1)}%</div>
                        <div class="summary-label">Estate Distributed</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-coins"></i></div>
                    <div class="summary-content">
                        <div class="summary-value">${(remainingEstate * 100).toFixed(1)}%</div>
                        <div class="summary-label">Remaining Estate</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Results table with better formatting
    if (results.length > 0) {
        html += `
            <div class="results-table-container">
                <h3><i class="fas fa-table"></i> Detailed Inheritance Distribution</h3>
                <div class="table-responsive">
                    <table class="inheritance-results-table">
                        <thead>
                            <tr>
                                <th><i class="fas fa-user"></i> Heir</th>
                                <th><i class="fas fa-hashtag"></i> Count</th>
                                <th><i class="fas fa-fraction"></i> Share Fraction</th>
                                <th><i class="fas fa-percent"></i> Total Share</th>
                                <th><i class="fas fa-user-circle"></i> Individual Share</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // Add each heir to the table
        results.forEach((heir, index) => {
            const totalPercentage = (heir.share * 100).toFixed(2);
            const individualPercentage = heir.count > 1 ? (heir.share * 100 / heir.count).toFixed(2) : totalPercentage;
            const rowClass = index % 2 === 0 ? 'even-row' : 'odd-row';
            
            html += `
                <tr class="result-row ${rowClass}">
                    <td class="result-name">
                        <span class="heir-name">${heir.name}</span>
                    </td>
                    <td class="result-count">
                        <span class="count-badge">${heir.count}</span>
                    </td>
                    <td class="result-fraction">
                        <span class="fraction-display">${heir.fraction}</span>
                    </td>
                    <td class="result-percentage">
                        <span class="percentage-display">${totalPercentage}%</span>
                    </td>
                    <td class="result-individual">
                        <span class="individual-display">${individualPercentage}% ${heir.count > 1 ? 'each' : ''}</span>
                    </td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="no-results">
                <div class="no-results-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <h3>No Valid Heirs Found</h3>
                <p>Please check your inputs and ensure at least one heir is specified.</p>
            </div>
        `;
    }
    
    // Remaining estate warning if applicable
    if (remainingEstate > 0.01) {
        html += `
            <div class="remaining-estate-notice">
                <div class="notice-icon"><i class="fas fa-info-circle"></i></div>
                <div class="notice-content">
                    <h4>Remaining Estate Notice</h4>
                    <p><strong>${(remainingEstate * 100).toFixed(1)}%</strong> of the estate remains undistributed.</p>
                    <p>This portion may be distributed among the 'Asabah (agnatic heirs) according to Islamic jurisprudence.</p>
                </div>
            </div>
        `;
    }
    
    // Add Islamic jurisprudence notes
    html += `
        <div class="islamic-notes">
            <h3><i class="fas fa-book-open"></i> Islamic Inheritance Principles</h3>
            <div class="notes-grid">
                <div class="note-card">
                    <div class="note-icon"><i class="fas fa-quran"></i></div>
                    <div class="note-content">
                        <h4>Fixed Shares (Fara'id)</h4>
                        <p>Shares determined by the Quran that cannot be altered.</p>
                    </div>
                </div>
                <div class="note-card">
                    <div class="note-icon"><i class="fas fa-balance-scale"></i></div>
                    <div class="note-content">
                        <h4>Residuary Inheritance (Asabah)</h4>
                        <p>Remaining estate distributed among agnatic heirs.</p>
                    </div>
                </div>
                <div class="note-card">
                    <div class="note-icon"><i class="fas fa-users-cog"></i></div>
                    <div class="note-content">
                        <h4>Blocking Rules (Hijab)</h4>
                        <p>Certain relatives can prevent others from inheriting.</p>
                    </div>
                </div>
                <div class="note-card">
                    <div class="note-icon"><i class="fas fa-graduation-cap"></i></div>
                    <div class="note-content">
                        <h4>Scholarly Consultation</h4>
                        <p>Complex cases require verification by Islamic scholars.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    contentDiv.innerHTML = html;
    resultsDiv.style.display = 'block';
    
    // Scroll to results with smooth animation
    setTimeout(() => {
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function clearCalculator() {
    // Clear all count input fields
    document.querySelectorAll('.count-input').forEach(input => {
        input.value = '';
    });
    
    // Reset calculation date to current date
    const calculationDateInput = document.getElementById('calculationDate');
    if (calculationDateInput) {
        calculationDateInput.value = getCurrentDate();
    }
    
    // Hide results
    const resultsDiv = document.getElementById('calculatorResults');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
    
    showAlert('Calculator cleared successfully!', 'success');
}

function showCalculatorError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    
    const calculatorForm = document.querySelector('.calculator-form');
    if (calculatorForm) {
        const existingError = calculatorForm.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        calculatorForm.insertBefore(errorDiv, calculatorForm.firstChild);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

function exportCalculatorResults() {
    try {
        // Get current results
        const resultsContent = document.getElementById('resultsContent');
        if (!resultsContent || resultsContent.innerHTML === '') {
            showAlert('No results to export. Please calculate inheritance first.', 'error');
            return;
        }
        
        // Check if jsPDF is available
        if (!window.jspdf || !window.jspdf.jsPDF) {
            showAlert('PDF library not loaded. Please refresh the page and try again.', 'error');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set up colors
        const primaryColor = [44, 95, 45];
        const secondaryColor = [15, 76, 117];
        const textColor = [0, 0, 0];
        const lightGray = [100, 100, 100];
        
        // Add header
        doc.setFontSize(18);
        doc.setTextColor(...primaryColor);
        doc.text('Islamic Inheritance Calculation Results', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(...secondaryColor);
        doc.text('Distribution of Estate According to Islamic Law', 105, 28, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(...lightGray);
        const currentDate = new Date();
        doc.text('Generated on: ' + currentDate.toLocaleDateString() + ' at ' + currentDate.toLocaleTimeString(), 105, 36, { align: 'center' });
        
        let yPosition = 50;
        
        // Add testator information section
        const testatorName = document.getElementById('testatorName')?.value || 'Not specified';
        const calculationDate = document.getElementById('calculationDate')?.value || currentDate.toLocaleDateString();
        
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.text('Testator Information:', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(11);
        doc.setTextColor(...textColor);
        doc.text('Full Name of Testator: ' + testatorName, 25, yPosition);
        yPosition += 7;
        doc.text('Date of Calculation: ' + calculationDate, 25, yPosition);
        yPosition += 15;
        
        // Add calculation inputs section
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.text('Surviving Relatives:', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(...textColor);
        
        // Get input values and display them
        const inputs = [
            { id: 'husband', label: 'Husband' },
            { id: 'wives', label: 'Wives' },
            { id: 'sons', label: 'Sons' },
            { id: 'daughters', label: 'Daughters' },
            { id: 'father', label: 'Father' },
            { id: 'mother', label: 'Mother' },
            { id: 'brothers', label: 'Brothers' },
            { id: 'sisters', label: 'Sisters' },
            { id: 'grandsons', label: 'Grandsons (son\'s sons)' },
            { id: 'granddaughters', label: 'Granddaughters (son\'s daughters)' },
            { id: 'paternalGrandfather', label: 'Paternal Grandfather' },
            { id: 'paternalGrandmother', label: 'Paternal Grandmother' },
            { id: 'maternalGrandmother', label: 'Maternal Grandmother' }
        ];
        
        let hasInputs = false;
        inputs.forEach(input => {
            const element = document.getElementById(input.id);
            if (element && element.value && parseInt(element.value) > 0) {
                doc.text('• ' + input.label + ': ' + element.value, 25, yPosition);
                yPosition += 6;
                hasInputs = true;
            }
        });
        
        if (!hasInputs) {
            doc.text('• No relatives specified', 25, yPosition);
            yPosition += 6;
        }
        
        yPosition += 10;
        
        // Add estate value if provided
        const estateValue = document.getElementById('estateValue');
        if (estateValue && estateValue.value) {
            doc.setFontSize(12);
            doc.setTextColor(...primaryColor);
            doc.text('Estate Information:', 20, yPosition);
            yPosition += 8;
            
            doc.setFontSize(10);
            doc.setTextColor(...textColor);
            doc.text('• Total Estate Value: ' + estateValue.value, 25, yPosition);
            yPosition += 10;
        }
        
        // Add inheritance distribution results
        const resultRows = document.querySelectorAll('.result-row');
        if (resultRows.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(...primaryColor);
            doc.text('Inheritance Distribution Results:', 20, yPosition);
            yPosition += 10;
            
            doc.setFontSize(10);
            doc.setTextColor(...textColor);
            
            resultRows.forEach(row => {
                const name = row.querySelector('.heir-name')?.textContent || '';
                const count = row.querySelector('.count-badge')?.textContent || '';
                const fraction = row.querySelector('.fraction-display')?.textContent || '';
                const percentage = row.querySelector('.percentage-display')?.textContent || '';
                
                if (name) {
                    doc.text('• ' + name + ' (' + count + '):', 25, yPosition);
                    doc.text(fraction, 100, yPosition);
                    doc.text(percentage, 150, yPosition);
                    yPosition += 7;
                    
                    if (yPosition > 250) {
                        doc.addPage();
                        yPosition = 30;
                    }
                }
            });
        } else {
            doc.text('• No inheritance distribution calculated', 25, yPosition);
            yPosition += 10;
        }
        
        // Add summary statistics
        const summaryCards = document.querySelectorAll('.summary-card');
        if (summaryCards.length > 0) {
            yPosition += 10;
            doc.setFontSize(12);
            doc.setTextColor(...primaryColor);
            doc.text('Summary Statistics:', 20, yPosition);
            yPosition += 8;
            
            doc.setFontSize(10);
            doc.setTextColor(...textColor);
            
            summaryCards.forEach(card => {
                const value = card.querySelector('.summary-value')?.textContent || '';
                const label = card.querySelector('.summary-label')?.textContent || '';
                if (value && label) {
                    doc.text('• ' + label + ': ' + value, 25, yPosition);
                    yPosition += 6;
                }
            });
        }
        
        // Add footer with disclaimer
        yPosition += 15;
        if (yPosition > 230) {
            doc.addPage();
            yPosition = 30;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(...secondaryColor);
        doc.text('Important Disclaimer:', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(9);
        doc.setTextColor(...textColor);
        const disclaimerText = [
            'This calculation is based on general Islamic inheritance principles (Islamic inheritance law) according to the Quran and Prophetic traditions.',
            'The calculations follow the Hanafi school of Islamic jurisprudence and may vary in other schools of Islamic law.',
            'This tool is for educational and preliminary planning purposes only.',
            'Please consult qualified Islamic scholars and legal professionals for:',
            '• Complex family situations or disputes',
            '• Legal validity in your specific jurisdiction',
            '• Final verification of calculations',
            '• Implementation of the inheritance distribution',
            '',
            'Note: Fixed shares (mandatory portions) are given priority over residuary inheritance (remaining estate).',
            '',
            'Generated by Islamic Will Creator - For educational purposes only'
        ];
        
        disclaimerText.forEach(line => {
            if (line === '') {
                yPosition += 4;
            } else {
                const splitText = doc.splitTextToSize(line, 170);
                doc.text(splitText, 20, yPosition);
                yPosition += splitText.length * 4;
            }
        });
        
        // Add signature section
        yPosition += 20;
        if (yPosition > 220) {
            doc.addPage();
            yPosition = 30;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.text('Testator Acknowledgment & Signature:', 20, yPosition);
        yPosition += 15;
        
        doc.setFontSize(10);
        doc.setTextColor(...textColor);
        doc.text('I acknowledge that this inheritance calculation has been prepared based on Islamic law principles', 20, yPosition);
        yPosition += 6;
        doc.text('and represents my understanding of the distribution of my estate.', 20, yPosition);
        yPosition += 15;
        
        // Signature lines
        doc.text('Testator Name: ' + testatorName, 20, yPosition);
        yPosition += 15;
        
        doc.line(20, yPosition, 120, yPosition); // Signature line
        doc.text('Testator Signature', 20, yPosition + 8);
        
        doc.line(140, yPosition, 190, yPosition); // Date line
        doc.text('Date', 140, yPosition + 8);
        yPosition += 25;
        
        // Witness signature section
        doc.text('Witness Name: ________________________', 20, yPosition);
        yPosition += 15;
        
        doc.line(20, yPosition, 120, yPosition); // Witness signature line
        doc.text('Witness Signature', 20, yPosition + 8);
        
        doc.line(140, yPosition, 190, yPosition); // Date line
        doc.text('Date', 140, yPosition + 8);
        
        // Save the PDF with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        doc.save('Islamic_Inheritance_Calculation_' + timestamp + '.pdf');
        
        showAlert('Inheritance calculation results exported successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting results:', error);
        showAlert('Error exporting results. Please try again.', 'error');
    }
}

// ===== WILL INHERITANCE CALCULATOR FUNCTIONS =====

function toggleInheritanceCalculator() {
    const calculator = document.getElementById('willInheritanceCalculator');
    const button = document.getElementById('toggleCalculator');
    
    if (calculator.style.display === 'none') {
        calculator.style.display = 'block';
        button.innerHTML = '<i class="fas fa-calculator"></i> Hide Inheritance Calculator';
        button.classList.add('active');
        
        // Scroll to calculator
        calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        calculator.style.display = 'none';
        button.innerHTML = '<i class="fas fa-calculator"></i> Show Inheritance Calculator';
        button.classList.remove('active');
    }
}