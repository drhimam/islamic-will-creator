// Global variables
let currentWillData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    
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
    
    // Force show home page initially
    setTimeout(() => {
        console.log('Forcing home page display...');
        showPage('home');
    }, 100);
    
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
        console.log('Hiding page:', page.id || 'unknown');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Successfully showed page:', pageId);
    } else {
        console.error('Page not found:', pageId);
        return;
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
    
    // Auto-populate inheritance calculator if showing schedule page and will data exists
    if (pageId === 'schedule' && currentWillData && 
        currentWillData.personalInfo && currentWillData.familyInfo) {
        console.log('Schedule page loaded, auto-populating inheritance calculator');
        setTimeout(() => {
            populateIntegratedCalculator();
        }, 100);
    } else if (pageId === 'schedule') {
        console.log('Schedule page loaded, but no complete will data available for auto-population');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Close mobile menu if open
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
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
        console.log('Form submitted, collecting data...');
        currentWillData = collectWillData(formData);
        console.log('Will data collected:', currentWillData);
        
        // Validate required fields
        if (!currentWillData.personalInfo.fullName) {
            showAlert('Please enter your full name.', 'error');
            return;
        }
        
        if (!currentWillData.personalInfo.gender) {
            showAlert('Please select your gender for accurate inheritance calculation.', 'error');
            return;
        }
        
        // Validate charitable bequests
        if (!validateCharitableBequests(currentWillData)) {
            showAlert('Charitable bequests cannot exceed 33.33% of the estate total.', 'error');
            return;
        }
        
        // Show success modal
        showSuccessModal('Will Created Successfully!', 'Your Islamic will has been created successfully. You can now download it in your preferred format.');
        
        // Automatically calculate and display inheritance distribution
        setTimeout(() => {
            try {
                console.log('Auto-calculating inheritance after will submission');
                console.log('Current will data:', currentWillData);
                
                // Show the inheritance calculator section
                const calculatorSection = document.getElementById('willInheritanceCalculator');
                if (calculatorSection) {
                    calculatorSection.style.display = 'block';
                    console.log('Calculator section made visible');
                } else {
                    console.error('Calculator section not found!');
                }
                
                // Populate the calculator with will data
                populateIntegratedCalculator();
                
                // Also directly try to show some basic inheritance info
                const resultsContainer = document.getElementById('integratedResultsContainer');
                if (resultsContainer && currentWillData) {
                    // Show a loading message initially
                    resultsContainer.innerHTML = '<p style="color: #2c5f2d; text-align: center; padding: 10px;"><i class="fas fa-spinner fa-spin"></i> Calculating inheritance distribution...</p>';
                }
                
                // Scroll to the inheritance results section
                setTimeout(() => {
                    const resultsSection = document.getElementById('willInheritanceCalculator');
                    if (resultsSection) {
                        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 1000);
                
            } catch (calculationError) {
                console.error('Error calculating inheritance:', calculationError);
                showAlert('Will created successfully, but there was an issue calculating inheritance distribution.', 'warning');
            }
        }, 1500); // Show after 1.5 seconds to allow modal to be seen
        
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
            gender: formData.get('gender'),
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
    if (!input || !input.files || input.files.length === 0) {
        console.log('No file selected for import');
        return;
    }
    
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
        const willDeclaration = `I, ${currentWillData.personalInfo.fullName}, being of sound mind and memory, do hereby make, publish and declare this to be my Last Will and Testament according to Islamic principles and hereby revoke all former wills and codicils made by me. The distribution of my estate shall follow Islamic inheritance laws (Faraid).`;
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
        
        // Auto-calculate inheritance and add to PDF as page 6
        console.log('PDF: Current page count before inheritance:', doc.internal.getNumberOfPages());
        const inheritanceCalculation = autoCalculateInheritance(currentWillData);
        console.log('PDF: Inheritance calculation for PDF:', inheritanceCalculation);
        
        if (inheritanceCalculation && inheritanceCalculation.fixedShares && Object.keys(inheritanceCalculation.fixedShares).length > 0) {
            console.log('PDF: Adding inheritance distribution page 6 to PDF');
            
            // Add new page for inheritance distribution (this will be page 6)
            doc.addPage();
            const inheritancePageNumber = doc.internal.getNumberOfPages();
            console.log('PDF: Added inheritance page as page number:', inheritancePageNumber);
            
            // Add the inheritance content that matches the webpage display
            addInheritanceContentToWillPDF(doc, inheritanceCalculation, inheritancePageNumber, currentWillData);
            
            console.log('PDF: Successfully added inheritance distribution page');
        } else {
            console.log('PDF: No inheritance calculation results to add to PDF');
        }
        
        // Save the PDF
        const fileName = `Islamic_Will_${currentWillData.personalInfo.fullName.replace(/\s+/g, '_')}_${getCurrentDateTimeForFilename()}.pdf`;
        doc.save(fileName);
        
        // Show success message without auto-navigation
        showAlert('Will PDF generated successfully!', 'success');
        
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

function getCurrentDateTimeForFilename() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
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
    if (hash && ['home', 'user-manual', 'create-will', 'schedule', 'inheritance-calculator'].includes(hash)) {
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
    if (hash && ['home', 'user-manual', 'create-will', 'schedule', 'inheritance-calculator'].includes(hash)) {
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
        
        // Get highest priority group (safely check if array has elements)
        if (residuaryHeirs.length > 0) {
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

// Manual toggle for integrated calculator
function toggleIntegratedCalculator() {
    try {
        const calculator = document.getElementById('willInheritanceCalculator');
        const button = document.getElementById('toggleIntegratedCalc');
        
        if (!calculator) {
            console.error('Calculator element not found');
            return;
        }
        
        if (calculator.style.display === 'none' || calculator.style.display === '') {
            // Show calculator
            if (currentWillData && Object.keys(currentWillData).length > 0) {
                populateIntegratedCalculator();
                calculator.style.display = 'block';
                calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                if (button) {
                    button.innerHTML = '<i class="fas fa-calculator"></i> Hide Inheritance Calculator';
                }
            } else {
                showAlert('Please create a will first before using the inheritance calculator.', 'warning');
            }
        } else {
            // Hide calculator
            calculator.style.display = 'none';
            if (button) {
                button.innerHTML = '<i class="fas fa-calculator"></i> Show Inheritance Calculator';
            }
        }
    } catch (error) {
        console.error('Error toggling integrated calculator:', error);
        showAlert('Error loading calculator. Please try again.', 'error');
    }
}

// ===== INTEGRATED INHERITANCE CALCULATOR FUNCTIONS =====

function showIntegratedInheritanceCalculator() {
    try {
        const calculator = document.getElementById('willInheritanceCalculator');
        if (calculator) {
            // Populate calculator with will data
            populateIntegratedCalculator();
            
            // Show the calculator
            calculator.style.display = 'block';
            
            // Scroll to calculator with smooth animation
            calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.warn('Integrated calculator element not found');
        }
    } catch (error) {
        console.error('Error showing integrated inheritance calculator:', error);
    }
}

function autoCalculateInheritance(willData) {
    if (!willData || !willData.personalInfo || !willData.personalInfo.gender) {
        console.log('Auto-calculation: Missing required will data or gender information');
        return null;
    }
    
    console.log('Auto-calculating inheritance for will data:', willData);
    
    // Map will data to relatives object for calculation
    const relatives = mapWillDataToRelatives(willData);
    console.log('Auto-calculation relatives mapped:', relatives);
    console.log('Non-zero relatives:', Object.keys(relatives).filter(key => relatives[key] > 0));
    
    // Check if we have any heirs
    const hasHeirs = Object.keys(relatives).some(key => relatives[key] > 0);
    if (!hasHeirs) {
        console.log('Auto-calculation: No heirs found in will data');
        return null;
    }
    
    // Perform the inheritance calculation with our integrated approach
    const calculation = performIntegratedInheritanceCalculation(relatives);
    console.log('Auto-calculation result:', calculation);
    console.log('Auto-calculation fixed shares:', calculation?.fixedShares);
    
    return calculation;
}

function performIntegratedInheritanceCalculation(relatives) {
    console.log('Performing integrated inheritance calculation with relatives:', relatives);
    
    const fixedShares = {};
    let totalFixedShares = 0;
    
    // Handle spouse inheritance
    if (relatives.husband > 0) {
        // Husband's share
        if (relatives.son > 0 || relatives.daughter > 0) {
            // With children: 1/4
            fixedShares['Husband'] = { 
                share: 0.25, 
                fraction: '1/4',
                count: 1,
                individualShare: 0.25,
                individualFraction: '1/4'
            };
        } else {
            // Without children: 1/2
            fixedShares['Husband'] = { 
                share: 0.5, 
                fraction: '1/2',
                count: 1,
                individualShare: 0.5,
                individualFraction: '1/2'
            };
        }
        totalFixedShares += fixedShares['Husband'].share;
    }
    
    if (relatives.wife > 0 || relatives.wives > 0) {
        // Wife's share
        if (relatives.son > 0 || relatives.daughter > 0) {
            // With children: 1/8
            fixedShares['Wife'] = { 
                share: 0.125, 
                fraction: '1/8',
                count: 1,
                individualShare: 0.125,
                individualFraction: '1/8'
            };
        } else {
            // Without children: 1/4
            fixedShares['Wife'] = { 
                share: 0.25, 
                fraction: '1/4',
                count: 1,
                individualShare: 0.25,
                individualFraction: '1/4'
            };
        }
        totalFixedShares += fixedShares['Wife'].share;
    }
    
    // Handle parents inheritance
    if (relatives.father > 0) {
        if (relatives.son > 0 || relatives.daughter > 0) {
            // With children: 1/6
            fixedShares['Father'] = { 
                share: 0.1667, 
                fraction: '1/6',
                count: 1,
                individualShare: 0.1667,
                individualFraction: '1/6'
            };
            totalFixedShares += 0.1667;
        } else {
            // Without children: 1/6 + residue
            fixedShares['Father'] = { 
                share: 0.1667, 
                fraction: '1/6 + residue',
                count: 1,
                individualShare: 0.1667,
                individualFraction: '1/6 + residue'
            };
            totalFixedShares += 0.1667;
        }
    }
    
    if (relatives.mother > 0) {
        if (relatives.son > 0 || relatives.daughter > 0) {
            // With children: 1/6
            fixedShares['Mother'] = { 
                share: 0.1667, 
                fraction: '1/6',
                count: 1,
                individualShare: 0.1667,
                individualFraction: '1/6'
            };
            totalFixedShares += 0.1667;
        } else {
            // Without children: 1/3
            fixedShares['Mother'] = { 
                share: 0.3333, 
                fraction: '1/3',
                count: 1,
                individualShare: 0.3333,
                individualFraction: '1/3'
            };
            totalFixedShares += 0.3333;
        }
    }
    
    // Handle children inheritance
    const totalSons = relatives.son || 0;
    const totalDaughters = relatives.daughter || 0;
    const totalChildren = totalSons + totalDaughters;
    
    if (totalChildren > 0) {
        const remainingShare = Math.max(0, 1 - totalFixedShares);
        
        if (totalSons > 0 && totalDaughters > 0) {
            // Both sons and daughters: Male gets 2x female share
            const totalShares = (totalSons * 2) + totalDaughters;
            const sharePerDaughter = remainingShare / totalShares;
            const sharePerSon = sharePerDaughter * 2;
            
            if (totalSons > 0) {
                fixedShares['Sons'] = { 
                    share: sharePerSon * totalSons, 
                    fraction: `${totalSons} son${totalSons > 1 ? 's' : ''} (2:1 ratio)`,
                    count: totalSons,
                    individualShare: sharePerSon,
                    individualFraction: '2x share'
                };
            }
            if (totalDaughters > 0) {
                fixedShares['Daughters'] = { 
                    share: sharePerDaughter * totalDaughters, 
                    fraction: `${totalDaughters} daughter${totalDaughters > 1 ? 's' : ''} (2:1 ratio)`,
                    count: totalDaughters,
                    individualShare: sharePerDaughter,
                    individualFraction: '1x share'
                };
            }
        } else if (totalSons > 0) {
            // Only sons: Equal shares of residue
            const sharePerSon = remainingShare / totalSons;
            fixedShares['Sons'] = { 
                share: remainingShare, 
                fraction: `${totalSons} son${totalSons > 1 ? 's' : ''} (equal shares)`,
                count: totalSons,
                individualShare: sharePerSon,
                individualFraction: `1/${totalSons} each`
            };
        } else if (totalDaughters > 0) {
            // Only daughters
            if (totalDaughters === 1) {
                fixedShares['Daughter'] = { 
                    share: Math.min(0.5, remainingShare), 
                    fraction: '1/2',
                    count: 1,
                    individualShare: Math.min(0.5, remainingShare),
                    individualFraction: '1/2'
                };
            } else {
                const totalShare = Math.min(0.6667, remainingShare);
                const sharePerDaughter = totalShare / totalDaughters;
                fixedShares['Daughters'] = { 
                    share: totalShare, 
                    fraction: '2/3',
                    count: totalDaughters,
                    individualShare: sharePerDaughter,
                    individualFraction: `1/${totalDaughters} of 2/3`
                };
            }
        }
    }
    
    console.log('Calculated fixed shares:', fixedShares);
    console.log('Total fixed shares:', totalFixedShares);
    
    return {
        fixedShares: fixedShares,
        totalShares: totalFixedShares,
        residue: Math.max(0, 1 - totalFixedShares)
    };
}

function addInheritanceDistributionPage(doc, calculation, pageNumber) {
    // Add new page for inheritance distribution
    doc.addPage();
    pageNumber++;
    
    // Add page header and border
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277);
    
    // Header background
    doc.setFillColor(44, 95, 45);
    doc.rect(10, 10, 190, 25, 'F');
    
    // Header text
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم', 105, 22, { align: 'center' });
    doc.setFontSize(12);
    doc.text('In the Name of Allah, the Most Gracious, the Most Merciful', 105, 30, { align: 'center' });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${pageNumber}`, 190, 285, { align: 'right' });
    
    const leftMargin = 20;
    const lineHeight = 6;
    let yPosition = 50;
    
    // Page Title
    doc.setFontSize(18);
    doc.setTextColor(44, 95, 45);
    doc.text('ISLAMIC INHERITANCE DISTRIBUTION', 105, yPosition, { align: 'center' });
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('According to Islamic Law (Faraid)', 105, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Introduction
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const introText = 'Based on the family information provided in this will, the inheritance distribution according to Islamic law (Faraid) is calculated as follows:';
    const splitIntro = doc.splitTextToSize(introText, 170);
    doc.text(splitIntro, leftMargin, yPosition);
    yPosition += splitIntro.length * lineHeight + 15;
    
    // Estate information section
    doc.setFontSize(12);
    doc.setTextColor(44, 95, 45);
    doc.text('ESTATE INFORMATION', leftMargin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Calculate estate breakdown
    const estateBreakdown = calculateEstateBreakdown(currentWillData);
    if (estateBreakdown && estateBreakdown.netEstate > 0) {
        doc.text(`Total Assets: $${estateBreakdown.totalAssets.toFixed(2)}`, leftMargin + 5, yPosition);
        yPosition += lineHeight;
        doc.text(`Total Debts: $${estateBreakdown.totalDebts.toFixed(2)}`, leftMargin + 5, yPosition);
        yPosition += lineHeight;
        doc.text(`Net Estate: $${estateBreakdown.netEstate.toFixed(2)}`, leftMargin + 5, yPosition);
        yPosition += lineHeight + 10;
    } else {
        doc.text('Estate value to be determined at time of distribution', leftMargin + 5, yPosition);
        yPosition += lineHeight + 10;
    }
    
    // Inheritance Distribution section
    doc.setFontSize(12);
    doc.setTextColor(44, 95, 45);
    doc.text('INHERITANCE SHARES', leftMargin, yPosition);
    yPosition += 10;
    
    // Table headers
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(240, 240, 240);
    doc.rect(leftMargin, yPosition, 170, 8, 'F');
    doc.text('Heir', leftMargin + 2, yPosition + 5);
    doc.text('Islamic Share', leftMargin + 70, yPosition + 5);
    doc.text('Percentage', leftMargin + 120, yPosition + 5);
    if (estateBreakdown && estateBreakdown.netEstate > 0) {
        doc.text('Amount', leftMargin + 150, yPosition + 5);
    }
    yPosition += 10;
    
    // Display inheritance shares
    if (calculation && calculation.fixedShares) {
        Object.keys(calculation.fixedShares).forEach((heir, index) => {
            const share = calculation.fixedShares[heir];
            const percentage = (share.share * 100).toFixed(2);
            
            // Alternate row background
            if (index % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(leftMargin, yPosition, 170, 8, 'F');
            }
            
            doc.setTextColor(0, 0, 0);
            doc.text(heir, leftMargin + 2, yPosition + 5);
            doc.text(share.fraction || `${percentage}%`, leftMargin + 70, yPosition + 5);
            doc.text(`${percentage}%`, leftMargin + 120, yPosition + 5);
            
            if (estateBreakdown && estateBreakdown.netEstate > 0) {
                const amount = estateBreakdown.netEstate * share.share;
                doc.text(`$${amount.toFixed(2)}`, leftMargin + 150, yPosition + 5);
            }
            
            yPosition += 8;
        });
    }
    
    yPosition += 15;
    
    // Important Islamic principles
    doc.setFontSize(12);
    doc.setTextColor(44, 95, 45);
    doc.text('IMPORTANT ISLAMIC PRINCIPLES', leftMargin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const principles = [
        '• These shares are fixed by Allah (SWT) in the Quran and cannot be altered',
        '• Debts and funeral expenses must be paid before any distribution',
        '• Only 1/3 of the estate may be allocated to non-heirs through Wasiyya (bequest)',
        '• 2/3 of the estate must be distributed according to Islamic inheritance law',
        '• Male heirs typically receive twice the share of female heirs in the same category',
        '• This distribution follows the Hanafi school of Islamic jurisprudence'
    ];
    
    principles.forEach(principle => {
        const principleText = doc.splitTextToSize(principle, 165);
        doc.text(principleText, leftMargin + 5, yPosition);
        yPosition += principleText.length * lineHeight + 3;
    });
    
    yPosition += 10;
    
    // Quranic reference
    doc.setFontSize(11);
    doc.setTextColor(44, 95, 45);
    doc.text('QURANIC REFERENCE', leftMargin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const quranicText = '"These are the limits set by Allah. Whoever obeys Allah and His Messenger will be admitted to Gardens beneath which rivers flow, to abide therein forever. That is the great success." - Quran 4:13';
    const splitQuranic = doc.splitTextToSize(quranicText, 170);
    doc.text(splitQuranic, leftMargin, yPosition);
    yPosition += splitQuranic.length * lineHeight + 15;
    
    // Footer notes
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('This inheritance calculation is based on classical Islamic jurisprudence.', leftMargin, yPosition);
    doc.text('Consult qualified Islamic scholars for complex inheritance situations.', leftMargin, yPosition + 6);
    doc.text(`Generated on: ${formatDate(getCurrentDate())}`, leftMargin, yPosition + 12);
}

function populateIntegratedCalculator() {
    if (!currentWillData || 
        !currentWillData.personalInfo || 
        !currentWillData.familyInfo) {
        console.log('No complete will data available for calculator population');
        return;
    }
    
    console.log('Populating integrated calculator with will data:', currentWillData);
    
    // Show the calculator section first
    const calculatorSection = document.getElementById('willInheritanceCalculator');
    if (calculatorSection) {
        calculatorSection.style.display = 'block';
    }
    
    // Map will data to heir counts for display
    const heirCounts = mapWillDataToHeirCounts(currentWillData);
    console.log('Heir counts mapped:', heirCounts);
    
    // Display heir summary
    displayHeirSummary(heirCounts);
    
    // Calculate and display estate breakdown
    const estateBreakdown = calculateEstateBreakdown(currentWillData);
    console.log('Estate breakdown:', estateBreakdown);
    console.log('Current will data for estate calculation:', currentWillData);
    console.log('Assets in will data:', currentWillData?.assets);
    console.log('Assets detailed structure:', JSON.stringify(currentWillData?.assets, null, 2));
    console.log('Debts in will data:', currentWillData?.debts);
    console.log('Debts detailed structure:', JSON.stringify(currentWillData?.debts, null, 2));
    displayEstateBreakdown(estateBreakdown);
    
    // Set estate value based on actual calculation
    const estateValueInput = document.getElementById('integratedEstateValue');
    let estateValue = null; // Start with null instead of default 100000
    
    if (estateBreakdown && estateBreakdown.netEstate > 0) {
        estateValue = estateBreakdown.netEstate;
        console.log('✅ Using calculated estate value:', estateValue);
        if (estateValueInput) {
            estateValueInput.value = estateValue.toFixed(2);
        }
    } else {
        console.log('❌ No estate value calculated - assets/debts not provided or net estate is 0');
        console.log('Estate breakdown details:', estateBreakdown);
        if (estateValueInput) {
            estateValueInput.value = '';
            estateValueInput.placeholder = 'Enter estate value or add assets/debts above';
        }
    }
    
    // Automatically calculate inheritance distribution
    console.log('Starting automatic inheritance calculation...');
    const inheritanceCalculation = autoCalculateInheritance(currentWillData);
    console.log('Inheritance calculation result:', inheritanceCalculation);
    
    if (inheritanceCalculation && inheritanceCalculation.fixedShares && Object.keys(inheritanceCalculation.fixedShares).length > 0) {
        console.log('Displaying inheritance results...');
        displayIntegratedResults(inheritanceCalculation, estateValue);
        
        // Also show a success message
        setTimeout(() => {
            showAlert('Inheritance distribution calculated automatically based on your will information!', 'success');
        }, 2000);
    } else {
        console.log('No valid inheritance calculation results');
        
        // Show message in results container
        const resultsContainer = document.getElementById('integratedResultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = '<p style="color: #666; font-style: italic; text-align: center; padding: 20px;">Inheritance calculation requires at least one eligible heir. Please ensure you have entered family information including spouse, children, or parents.</p>';
            
            const resultsSection = document.getElementById('integratedResultsSection');
            if (resultsSection) {
                resultsSection.style.display = 'block';
            }
        }
    }
    
    // Scroll to calculator section smoothly
    setTimeout(() => {
        if (calculatorSection) {
            calculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 1000);
    
    console.log('Integrated calculator populated successfully');
}

function mapWillDataToHeirCounts(willData) {
    const heirCounts = {};
    
    // Safety check for willData and its properties
    if (!willData || !willData.familyInfo || !willData.personalInfo) {
        console.warn('Will data is incomplete for heir mapping:', willData);
        return heirCounts;
    }
    
    // Handle spouse based on testator gender
    if (willData.familyInfo.maritalStatus === 'married' && willData.familyInfo.spouseName) {
        if (willData.personalInfo.gender === 'male') {
            // Male testator has wife/wives
            heirCounts.wife = 1;
            heirCounts.wives = 1;
        } else if (willData.personalInfo.gender === 'female') {
            // Female testator has husband
            heirCounts.husband = 1;
        }
    }
    
    // Handle children
    if (willData.familyInfo.children && willData.familyInfo.children.length > 0) {
        console.log('Processing children data:', willData.familyInfo.children);
        
        heirCounts.son = willData.familyInfo.children.filter(child => 
            child && child.childGender === 'male'
        ).length;
        
        heirCounts.daughter = willData.familyInfo.children.filter(child => 
            child && child.childGender === 'female'
        ).length;
        
        console.log('Sons count:', heirCounts.son, 'Daughters count:', heirCounts.daughter);
    }
    
    // Handle parents (update to handle "alive"/"deceased" values)
    if (willData.familyInfo.fatherAlive === 'alive') {
        heirCounts.father = 1;
    }
    
    if (willData.familyInfo.motherAlive === 'alive') {
        heirCounts.mother = 1;
    }
    
    return heirCounts;
}

function displayHeirSummary(heirData) {
    const heirSummaryContainer = document.getElementById('heirSummaryDisplay');
    if (!heirSummaryContainer) return;
    
    heirSummaryContainer.innerHTML = '';
    
    const heirTypes = {
        'husband': 'Husband',
        'wife': 'Wife', 
        'son': 'Sons',
        'daughter': 'Daughters',
        'father': 'Father',
        'mother': 'Mother'
    };
    
    let hasHeirs = false;
    
    Object.keys(heirTypes).forEach(key => {
        if (heirData[key] && heirData[key] > 0) {
            hasHeirs = true;
            const heirItem = document.createElement('div');
            heirItem.className = 'heir-item';
            
            heirItem.innerHTML = `
                <div class="heir-type">${heirTypes[key]}</div>
                <div class="heir-count">${heirData[key]} person${heirData[key] > 1 ? 's' : ''}</div>
            `;
            
            heirSummaryContainer.appendChild(heirItem);
        }
    });
    
    if (!hasHeirs) {
        heirSummaryContainer.innerHTML = '<p style="color: #666; font-style: italic;">No eligible heirs specified in the will form.</p>';
    }
}

function calculateTotalEstateValue(willData) {
    let totalAssets = 0;
    let totalDebts = 0;
    
    // Calculate total assets
    if (willData.assets) {
        // Cash assets
        if (willData.assets.cash) {
            willData.assets.cash.forEach(asset => {
                if (asset.amount) {
                    totalAssets += parseFloat(asset.amount) || 0;
                }
            });
        }
        
        // Property assets
        if (willData.assets.property) {
            willData.assets.property.forEach(property => {
                if (property.value) {
                    totalAssets += parseFloat(property.value) || 0;
                }
            });
        }
        
        // Other assets
        if (willData.assets.other) {
            willData.assets.other.forEach(asset => {
                if (asset.value) {
                    totalAssets += parseFloat(asset.value) || 0;
                }
            });
        }
    }
    
    // Calculate total debts
    if (willData.debts) {
        willData.debts.forEach(debt => {
            if (debt.amount) {
                totalDebts += parseFloat(debt.amount) || 0;
            }
        });
    }
    
    return Math.max(0, totalAssets - totalDebts);
}

function calculateEstateBreakdown(willData) {
    let totalAssets = 0;
    let totalDebts = 0;
    
    console.log('🔍 calculateEstateBreakdown called with willData:', willData);
    
    // Calculate total assets
    if (willData && willData.assets) {
        console.log('🔍 Found assets:', willData.assets);
        
        // Cash assets use 'cashAmount' field
        if (willData.assets.cash && Array.isArray(willData.assets.cash)) {
            console.log('🔍 Processing cash assets:', willData.assets.cash);
            willData.assets.cash.forEach((asset, index) => {
                console.log(`🔍 Cash asset ${index}:`, asset);
                if (asset && asset.cashAmount) {
                    const amount = parseFloat(asset.cashAmount) || 0;
                    console.log(`🔍 Adding cash amount: ${amount}`);
                    totalAssets += amount;
                }
            });
        }
        
        // Property assets use 'propertyValue' field
        if (willData.assets.property && Array.isArray(willData.assets.property)) {
            console.log('🔍 Processing property assets:', willData.assets.property);
            willData.assets.property.forEach((property, index) => {
                console.log(`🔍 Property asset ${index}:`, property);
                if (property && property.propertyValue) {
                    const value = parseFloat(property.propertyValue) || 0;
                    console.log(`🔍 Adding property value: ${value}`);
                    totalAssets += value;
                }
            });
        }
        
        // Other assets use 'otherAssetValue' field
        if (willData.assets.other && Array.isArray(willData.assets.other)) {
            console.log('🔍 Processing other assets:', willData.assets.other);
            willData.assets.other.forEach((asset, index) => {
                console.log(`🔍 Other asset ${index}:`, asset);
                if (asset && asset.otherAssetValue) {
                    const value = parseFloat(asset.otherAssetValue) || 0;
                    console.log(`🔍 Adding other asset value: ${value}`);
                    totalAssets += value;
                }
            });
        }
    } else {
        console.log('🔍 No assets found in willData');
    }
    
    // Calculate total debts - use 'debtAmount' field
    if (willData && willData.debts && Array.isArray(willData.debts)) {
        console.log('🔍 Processing debts:', willData.debts);
        willData.debts.forEach((debt, index) => {
            console.log(`🔍 Debt ${index}:`, debt);
            if (debt && debt.debtAmount) {
                const amount = parseFloat(debt.debtAmount) || 0;
                console.log(`🔍 Adding debt amount: ${amount}`);
                totalDebts += amount;
            }
        });
    } else {
        console.log('🔍 No debts found in willData');
    }
    
    const result = {
        totalAssets: totalAssets,
        totalDebts: totalDebts,
        netEstate: Math.max(0, totalAssets - totalDebts)
    };
    
    console.log('🔍 Estate breakdown result:', result);
    return result;
}

function displayEstateBreakdown(breakdown) {
    const breakdownDisplay = document.getElementById('estateBreakdownDisplay');
    const totalAssetsDisplay = document.getElementById('totalAssetsDisplay');
    const totalDebtsDisplay = document.getElementById('totalDebtsDisplay');
    const netEstateDisplay = document.getElementById('netEstateDisplay');
    
    if (breakdown.totalAssets > 0 || breakdown.totalDebts > 0) {
        if (totalAssetsDisplay) totalAssetsDisplay.textContent = `$${breakdown.totalAssets.toFixed(2)}`;
        if (totalDebtsDisplay) totalDebtsDisplay.textContent = `$${breakdown.totalDebts.toFixed(2)}`;
        if (netEstateDisplay) netEstateDisplay.textContent = `$${breakdown.netEstate.toFixed(2)}`;
        
        if (breakdownDisplay) {
            breakdownDisplay.style.display = 'block';
        }
    } else {
        if (breakdownDisplay) {
            breakdownDisplay.style.display = 'none';
        }
    }
}

function calculateIntegratedInheritance() {
    if (!currentWillData) {
        showAlert('No will data available. Please create a will first.', 'error');
        return;
    }
    
    const estateValueInput = document.getElementById('integratedEstateValue');
    const estateValue = parseFloat(estateValueInput.value) || 0;
    
    if (estateValue <= 0) {
        showAlert('Please enter a valid estate value greater than 0.', 'error');
        estateValueInput.focus();
        return;
    }
    
    // Validate that required information is present
    if (!currentWillData.personalInfo.gender) {
        showAlert('Gender information is required for accurate inheritance calculation.', 'error');
        return;
    }
    
    // Map will data to relatives object for calculation
    const relatives = mapWillDataToRelatives(currentWillData);
    
    console.log('Relatives mapped for calculation:', relatives);
    console.log('Non-zero relatives:', Object.keys(relatives).filter(key => relatives[key] > 0));
    
    // Perform the inheritance calculation
    const calculation = performInheritanceCalculation(relatives);
    
    console.log('Calculation result:', calculation);
    console.log('Fixed shares:', calculation?.fixedShares);
    
    // Display results in the integrated section
    displayIntegratedResults(calculation, estateValue);
}

function mapWillDataToRelatives(willData) {
    const relatives = {};
    
    // Initialize all heir types to 0
    const heirTypes = [
        'husband', 'wife', 'son', 'daughter', 'father', 'mother',
        'paternalGrandfather', 'paternalGrandmother', 'maternalGrandfather', 'maternalGrandmother',
        'fullBrother', 'fullSister', 'paternalBrother', 'paternalSister',
        'maternalBrother', 'maternalSister', 'sonOfFullBrother', 'sonOfPaternalBrother',
        'paternalUncle', 'sonOfPaternalUncle', 'sonOfSon', 'daughterOfSon',
        'sonOfDaughter', 'daughterOfDaughter', 'wives', 'husbands'
    ];
    
    heirTypes.forEach(type => {
        relatives[type] = 0;
    });
    
    // Handle spouse based on testator gender
    if (willData.familyInfo.maritalStatus === 'married' && willData.familyInfo.spouseName) {
        if (willData.personalInfo.gender === 'male') {
            // Male testator has wife/wives
            relatives.wife = 1;
            relatives.wives = 1;
        } else if (willData.personalInfo.gender === 'female') {
            // Female testator has husband
            relatives.husband = 1;
            relatives.husbands = 1;
        }
    }
    
    // Handle children
    if (willData.familyInfo.children && willData.familyInfo.children.length > 0) {
        relatives.son = willData.familyInfo.children.filter(child => 
            child.childGender === 'male'
        ).length;
        
        relatives.daughter = willData.familyInfo.children.filter(child => 
            child.childGender === 'female'
        ).length;
    }
    
    // Handle parents (update to handle "alive"/"deceased" values)
    if (willData.familyInfo.fatherAlive === 'alive') {
        relatives.father = 1;
    }
    
    if (willData.familyInfo.motherAlive === 'alive') {
        relatives.mother = 1;
    }
    
    return relatives;
}

function displayIntegratedResults(calculation, estateValue) {
    console.log('displayIntegratedResults called with:', { calculation, estateValue });
    
    const resultsSection = document.getElementById('integratedResultsSection');
    const resultsContainer = document.getElementById('integratedResultsContainer');
    
    console.log('Results elements found:', { resultsSection: !!resultsSection, resultsContainer: !!resultsContainer });
    
    if (!resultsSection || !resultsContainer) {
        console.error('Results display elements not found');
        return;
    }
    
    // Clear previous results and show loading
    resultsContainer.innerHTML = '<p style="color: #2c5f2d; text-align: center; padding: 10px;"><i class="fas fa-spinner fa-spin"></i> Processing inheritance calculation...</p>';
    resultsSection.style.display = 'block';
    
    console.log('🔄 Processing results immediately...');
    
    // Clear the loading message before adding results
    setTimeout(() => {
        resultsContainer.innerHTML = '';
        console.log('🔄 Cleared loading message, adding results...');
        
        console.log('Checking calculation.fixedShares:', calculation?.fixedShares);
        console.log('fixedShares keys length:', calculation?.fixedShares ? Object.keys(calculation.fixedShares).length : 'undefined');
        console.log('fixedShares keys:', calculation?.fixedShares ? Object.keys(calculation.fixedShares) : 'undefined');
        
        if (!calculation || !calculation.fixedShares || Object.keys(calculation.fixedShares).length === 0) {
            console.log('No valid calculation results, showing message');
            resultsContainer.innerHTML = '<p style="color: #666; font-style: italic;">No inheritance distribution calculated. Please verify heir information and ensure you have eligible heirs.</p>';
            resultsSection.style.display = 'block';
            return;
        }
        
        console.log('✅ VALIDATION PASSED - Processing fixed shares:', Object.keys(calculation.fixedShares));
        
        // Show the column headers and update the last column based on estate value
        const resultsHeader = document.querySelector('.results-header');
        if (resultsHeader) {
            const headerText = estateValue && estateValue > 0 ? 'Per Person' : 'Individual %';
            const lastHeaderSpan = resultsHeader.querySelector('div span:last-child');
            if (lastHeaderSpan) {
                lastHeaderSpan.textContent = headerText;
            }
            resultsHeader.style.display = 'block';
        }
        
        // Display results
        let processedCount = 0;
        Object.keys(calculation.fixedShares).forEach(heir => {
            const share = calculation.fixedShares[heir];
            
            // Format heir name with count
            const heirCount = share.count || 1;
            const heirNameWithCount = heirCount > 1 ? `${heir} (${heirCount})` : heir;
            
            // Extract clean fraction from the share.fraction field
            let cleanFraction = share.fraction;
            if (share.fraction && share.fraction.includes('(')) {
                // Extract just the fraction part before any parentheses
                cleanFraction = share.fraction.split('(')[0].trim();
            }
            if (cleanFraction && (cleanFraction.includes('son') || cleanFraction.includes('daughter'))) {
                // For descriptive fractions, extract the actual fraction
                const fractionMatch = cleanFraction.match(/(\d+\/\d+)/);
                if (fractionMatch) {
                    cleanFraction = fractionMatch[1];
                } else {
                    // Fallback to percentage as fraction
                    cleanFraction = `${(share.share * 100).toFixed(2)}%`;
                }
            }
            
            console.log(`✅ Processing heir ${++processedCount}: ${heirNameWithCount}, share:`, share, 'estateValue:', estateValue);
            
            const resultRow = document.createElement('div');
            resultRow.className = 'result-row';
            resultRow.style.cssText = `
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                padding: 1rem !important;
                background: #f8f9fa !important;
                border-radius: 8px !important;
                margin-bottom: 0.8rem !important;
                border-left: 4px solid #2c5f2d !important;
                border: 2px solid #2c5f2d !important;
                min-height: 50px !important;
            `;
            
            // Show individual amount if estate value is available, otherwise show percentage
            let amountDisplay;
            if (estateValue && estateValue > 0) {
                const individualAmount = estateValue * share.individualShare;
                amountDisplay = `$${individualAmount.toFixed(2)}`;
            } else {
                amountDisplay = `${(share.individualShare * 100).toFixed(2)}%`;
            }
            
            resultRow.innerHTML = `
                <span class="result-heir" style="font-weight: bold; color: #2c5f2d; flex: 2;">${heirNameWithCount}</span>
                <span class="result-share" style="color: #666; flex: 2; text-align: center;">${cleanFraction || `${(share.share * 100).toFixed(2)}%`}</span>
                <span class="result-percentage" style="color: #666; flex: 1; text-align: center;">${(share.share * 100).toFixed(2)}%</span>
                <span class="result-individual" style="color: #666; flex: 1; text-align: center;">${(share.individualShare * 100).toFixed(2)}%</span>
                <span class="result-amount" style="font-weight: bold; color: #2c5f2d; flex: 2; text-align: right;">${amountDisplay}</span>
            `;
            
            resultsContainer.appendChild(resultRow);
            console.log(`✅ Added result row for ${heirNameWithCount}`);
        });
        
        console.log(`✅ Results displayed successfully - ${processedCount} heirs processed, showing section`);
        
        // Force show the results section with multiple methods
        resultsSection.style.display = 'block';
        resultsSection.style.visibility = 'visible';
        resultsSection.style.opacity = '1';
        
        // Also check if the parent container is visible
        const calculatorSection = document.getElementById('willInheritanceCalculator');
        if (calculatorSection) {
            calculatorSection.style.display = 'block';
            console.log('✅ Calculator section visibility ensured');
        }
        
        // Add some debugging about the DOM structure
        console.log('✅ Results container children count:', resultsContainer.children.length);
        console.log('✅ Results section display style:', window.getComputedStyle(resultsSection).display);
        console.log('✅ Results section visibility:', window.getComputedStyle(resultsSection).visibility);
        
        // Force a repaint
        resultsContainer.offsetHeight;
        
        // Scroll to results with a delay to ensure everything is rendered
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log('✅ Scrolled to results section');
        }, 100);
        
    }, 500); // 500ms delay to show loading, then display results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function exportIntegratedResults() {
    if (!currentWillData) {
        showAlert('No will data available for export.', 'error');
        return;
    }

    // Calculate the estate value from will data or use manual input
    const estateBreakdown = calculateEstateBreakdown(currentWillData);
    let estateValue = null;
    
    if (estateBreakdown && estateBreakdown.netEstate > 0) {
        estateValue = estateBreakdown.netEstate;
    } else {
        const estateValueInput = document.getElementById('integratedEstateValue');
        estateValue = parseFloat(estateValueInput?.value) || 0;
    }

    // Get the inheritance calculation that's currently displayed
    const inheritanceCalculation = autoCalculateInheritance(currentWillData);
    
    if (!inheritanceCalculation || !inheritanceCalculation.fixedShares || Object.keys(inheritanceCalculation.fixedShares).length === 0) {
        showAlert('No inheritance calculation available. Please calculate inheritance first.', 'error');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Document setup
        const pageWidth = doc.internal.pageSize.width;
        const leftMargin = 20;
        const lineHeight = 7;
        let yPosition = 30;
        
        // Page border
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 190, 277);
        
        // Header - exactly like webpage
        doc.setFontSize(20);
        doc.setTextColor(44, 95, 45);
        doc.text('Inheritance Distribution Results', pageWidth/2, yPosition, { align: 'center' });
        yPosition += 20;
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('According to Islamic Law (Faraid)', pageWidth/2, yPosition, { align: 'center' });
        yPosition += 25;
        
        // Will holder info
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Will of: ${currentWillData.personalInfo.fullName}`, leftMargin, yPosition);
        yPosition += 20;
        
        // Table header - exactly like webpage
        doc.setFontSize(12);
        doc.setTextColor(44, 95, 45);
        doc.text('INHERITANCE DISTRIBUTION', leftMargin, yPosition);
        yPosition += 15;
        
        // Column headers - matching webpage exactly
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(248, 249, 250);
        doc.rect(leftMargin, yPosition - 5, 170, 10, 'F');
        
        doc.text('Heir', leftMargin + 5, yPosition + 2);
        doc.text('Share Fraction', leftMargin + 50, yPosition + 2);
        doc.text('Total %', leftMargin + 90, yPosition + 2);
        doc.text('Individual %', leftMargin + 120, yPosition + 2);
        
        // Dynamic last column header
        const headerText = estateValue && estateValue > 0 ? 'Per Person' : 'Individual %';
        doc.text(headerText, leftMargin + 155, yPosition + 2);
        yPosition += 15;
        
        // Display each heir - exactly like webpage
        let totalIndividualHeirs = 0;
        
        Object.keys(inheritanceCalculation.fixedShares).forEach((heir, index) => {
            const share = inheritanceCalculation.fixedShares[heir];
            const percentage = (share.share * 100).toFixed(2);
            const individualPercentage = (share.individualShare * 100).toFixed(2);
            
            // Count actual individuals for this category
            const heirCount = share.count || 1;
            totalIndividualHeirs += heirCount;
            
            // Format heir name with count - exactly like webpage
            const heirNameWithCount = heirCount > 1 ? `${heir} (${heirCount})` : heir;
            
            // Extract clean fraction - exactly like webpage
            let cleanFraction = share.fraction;
            if (share.fraction && share.fraction.includes('(')) {
                cleanFraction = share.fraction.split('(')[0].trim();
            }
            if (cleanFraction && (cleanFraction.includes('son') || cleanFraction.includes('daughter'))) {
                const fractionMatch = cleanFraction.match(/(\d+\/\d+)/);
                if (fractionMatch) {
                    cleanFraction = fractionMatch[1];
                } else {
                    cleanFraction = `${percentage}%`;
                }
            }
            
            // Alternating row backgrounds - exactly like webpage
            if (index % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(leftMargin, yPosition - 3, 170, 12, 'F');
            }
            
            // Green border - exactly like webpage
            doc.setDrawColor(44, 95, 45);
            doc.setLineWidth(0.3);
            doc.rect(leftMargin, yPosition - 3, 170, 12);
            
            // Text content - exactly like webpage
            doc.setTextColor(44, 95, 45);
            doc.setFontSize(9);
            doc.setFont(undefined, 'bold');
            doc.text(heirNameWithCount, leftMargin + 5, yPosition + 4);
            
            doc.setTextColor(102, 102, 102);
            doc.setFont(undefined, 'normal');
            doc.text(cleanFraction || `${percentage}%`, leftMargin + 50, yPosition + 4);
            doc.text(`${percentage}%`, leftMargin + 90, yPosition + 4);
            doc.text(`${individualPercentage}%`, leftMargin + 120, yPosition + 4);
            
            doc.setTextColor(44, 95, 45);
            doc.setFont(undefined, 'bold');
            
            // Amount display - exactly like webpage logic
            if (estateValue && estateValue > 0) {
                const individualAmount = estateValue * share.individualShare;
                doc.text(`$${individualAmount.toFixed(2)}`, leftMargin + 155, yPosition + 4);
            } else {
                doc.text(`${individualPercentage}%`, leftMargin + 155, yPosition + 4);
            }
            
            yPosition += 12;
        });
        
        yPosition += 20;
        
        // Estate summary - exactly like webpage
        doc.setFontSize(11);
        doc.setTextColor(44, 95, 45);
        doc.text('ESTATE SUMMARY', leftMargin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        
        if (estateValue && estateValue > 0) {
            doc.text(`Total Estate Value: $${estateValue.toFixed(2)}`, leftMargin + 5, yPosition);
            yPosition += 8;
            doc.text(`Total Individual Heirs: ${totalIndividualHeirs}`, leftMargin + 5, yPosition);
            yPosition += 8;
            doc.text(`Heir Categories: ${Object.keys(inheritanceCalculation.fixedShares).length}`, leftMargin + 5, yPosition);
        } else {
            doc.text('Total Estate Value: To be determined', leftMargin + 5, yPosition);
            yPosition += 8;
            doc.text(`Total Individual Heirs: ${totalIndividualHeirs}`, leftMargin + 5, yPosition);
            yPosition += 8;
            doc.text(`Heir Categories: ${Object.keys(inheritanceCalculation.fixedShares).length}`, leftMargin + 5, yPosition);
            yPosition += 8;
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(8);
            doc.text('* Add assets and debts in the will form to calculate monetary amounts', leftMargin + 5, yPosition);
        }
        yPosition += 15;
        
        // Islamic principles note - exactly like webpage
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        const noteText = 'These inheritance shares are calculated according to Islamic jurisprudence (Faraid) and are based on the family information provided in this will.';
        const splitNote = doc.splitTextToSize(noteText, 165);
        doc.text(splitNote, leftMargin, yPosition);
        yPosition += splitNote.length * 5 + 10;
        
        doc.text('Consult qualified Islamic scholars for specific inheritance questions.', leftMargin, yPosition);
        
        // Page number
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Page 1', 190, 285, { align: 'right' });
        
        // Download the PDF
        const fileName = `inheritance-distribution-${currentWillData.personalInfo.fullName.replace(/\s+/g, '-')}-${getCurrentDateTimeForFilename()}.pdf`;
        doc.save(fileName);
        
        showAlert('Inheritance distribution report downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting integrated results:', error);
        showAlert('Error exporting results. Please try again.', 'error');
    }
}

// Function to add inheritance content to will PDF that matches webpage display exactly
function addInheritanceContentToWillPDF(doc, calculation, pageNumber, willData) {
    console.log('Adding inheritance content to will PDF page', pageNumber);
    
    // Page setup
    const leftMargin = 20;
    const lineHeight = 7;
    let yPosition = 30;
    
    // Page border
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277);
    
    // Page Title - matching webpage
    doc.setFontSize(20);
    doc.setTextColor(44, 95, 45);
    doc.text('Inheritance Distribution Results', 105, yPosition, { align: 'center' });
    yPosition += 20;
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('According to Islamic Law (Faraid)', 105, yPosition, { align: 'center' });
    yPosition += 25;
    
    // Will holder info
    if (willData && willData.personalInfo && willData.personalInfo.fullName) {
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Will of: ${willData.personalInfo.fullName}`, leftMargin, yPosition);
        yPosition += 20;
    }
    
    // Table header that matches webpage layout
    doc.setFontSize(12);
    doc.setTextColor(44, 95, 45);
    doc.text('INHERITANCE DISTRIBUTION', leftMargin, yPosition);
    yPosition += 15;
    
    // Column headers
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(248, 249, 250);
    doc.rect(leftMargin, yPosition - 5, 170, 10, 'F');
    
    doc.text('Heir', leftMargin + 5, yPosition + 2);
    doc.text('Share Fraction', leftMargin + 50, yPosition + 2);
    doc.text('Total %', leftMargin + 90, yPosition + 2);
    doc.text('Individual %', leftMargin + 120, yPosition + 2);
    doc.text('Per Person', leftMargin + 155, yPosition + 2);
    yPosition += 15;
    
    // Display each heir - exactly like webpage but with individual share column
    let totalIndividualHeirs = 0; // Count actual individuals, not categories
    const estateValue = calculateEstateValue(willData);
    console.log('PDF: Estate value calculated:', estateValue);
    console.log('PDF: Will data assets:', willData?.assets);
    console.log('PDF: Will data debts:', willData?.debts);
    
    // Use calculated estate value or show message if no assets provided
    const finalEstateValue = estateValue && estateValue > 0 ? estateValue : null;
    
    Object.keys(calculation.fixedShares).forEach((heir, index) => {
        const share = calculation.fixedShares[heir];
        const percentage = (share.share * 100).toFixed(2);
        const individualPercentage = (share.individualShare * 100).toFixed(2);
        
        // Count actual individuals for this category
        const heirCount = share.count || 1;
        totalIndividualHeirs += heirCount;
        
        // Format heir name with count
        const heirNameWithCount = heirCount > 1 ? `${heir} (${heirCount})` : heir;
        
        // Extract clean fraction from the share.fraction field
        let cleanFraction = share.fraction;
        if (share.fraction && share.fraction.includes('(')) {
            // Extract just the fraction part before any parentheses
            cleanFraction = share.fraction.split('(')[0].trim();
        }
        if (cleanFraction && cleanFraction.includes('son') || cleanFraction.includes('daughter')) {
            // For descriptive fractions, extract the actual fraction
            const fractionMatch = cleanFraction.match(/(\d+\/\d+)/);
            if (fractionMatch) {
                cleanFraction = fractionMatch[1];
            } else {
                // Fallback to percentage as fraction
                cleanFraction = `${percentage}%`;
            }
        }
        
        // Alternating row backgrounds like webpage
        if (index % 2 === 0) {
            doc.setFillColor(248, 248, 248);
            doc.rect(leftMargin, yPosition - 3, 170, 12, 'F');
        }
        
        // Border like webpage (green border)
        doc.setDrawColor(44, 95, 45);
        doc.setLineWidth(0.3);
        doc.rect(leftMargin, yPosition - 3, 170, 12);
        
        // Text content matching webpage exactly
        doc.setTextColor(44, 95, 45);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text(heirNameWithCount, leftMargin + 5, yPosition + 4);
        
        doc.setTextColor(102, 102, 102);
        doc.setFont(undefined, 'normal');
        doc.text(cleanFraction || `${percentage}%`, leftMargin + 50, yPosition + 4);
        doc.text(`${percentage}%`, leftMargin + 90, yPosition + 4);
        doc.text(`${individualPercentage}%`, leftMargin + 120, yPosition + 4);
        
        doc.setTextColor(44, 95, 45);
        doc.setFont(undefined, 'bold');
        
        // Show individual amount if estate value is available, otherwise show percentage
        if (finalEstateValue && finalEstateValue > 0) {
            const individualAmount = finalEstateValue * share.individualShare;
            doc.text(`$${individualAmount.toFixed(2)}`, leftMargin + 155, yPosition + 4);
        } else {
            doc.text(`${individualPercentage}%`, leftMargin + 155, yPosition + 4);
        }
        
        yPosition += 12;
    });
    
    yPosition += 20;
    
    // Estate summary
    doc.setFontSize(11);
    doc.setTextColor(44, 95, 45);
    doc.text('ESTATE SUMMARY', leftMargin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    if (finalEstateValue && finalEstateValue > 0) {
        doc.text(`Total Estate Value: $${finalEstateValue.toFixed(2)}`, leftMargin + 5, yPosition);
        yPosition += 8;
        doc.text(`Total Individual Heirs: ${totalIndividualHeirs}`, leftMargin + 5, yPosition);
        yPosition += 8;
        doc.text(`Heir Categories: ${Object.keys(calculation.fixedShares).length}`, leftMargin + 5, yPosition);
    } else {
        doc.text('Total Estate Value: To be determined', leftMargin + 5, yPosition);
        yPosition += 8;
        doc.text(`Total Individual Heirs: ${totalIndividualHeirs}`, leftMargin + 5, yPosition);
        yPosition += 8;
        doc.text(`Heir Categories: ${Object.keys(calculation.fixedShares).length}`, leftMargin + 5, yPosition);
        yPosition += 8;
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text('* Add assets and debts in the will form to calculate monetary amounts', leftMargin + 5, yPosition);
    }
    yPosition += 15;
    
    // Islamic principles note
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const noteText = 'These inheritance shares are calculated according to Islamic jurisprudence (Faraid) and are based on the family information provided in this will.';
    const splitNote = doc.splitTextToSize(noteText, 165);
    doc.text(splitNote, leftMargin, yPosition);
    yPosition += splitNote.length * 5 + 10;
    
    doc.text('Consult qualified Islamic scholars for specific inheritance questions.', leftMargin, yPosition);
    
    // Page number
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${pageNumber}`, 190, 285, { align: 'right' });
    
    console.log(`Successfully added inheritance content matching webpage to PDF page ${pageNumber}`);
}

// Helper function to calculate estate value
function calculateEstateValue(willData) {
    if (!willData || !willData.assets) return null;
    
    let totalAssets = 0;
    let totalDebts = 0;
    
    // Calculate total assets using correct field names
    if (willData.assets) {
        // Cash assets use 'cashAmount' field
        if (willData.assets.cash) {
            willData.assets.cash.forEach(asset => {
                if (asset.cashAmount) {
                    totalAssets += parseFloat(asset.cashAmount) || 0;
                }
            });
        }
        
        // Property assets use 'propertyValue' field
        if (willData.assets.property) {
            willData.assets.property.forEach(property => {
                if (property.propertyValue) {
                    totalAssets += parseFloat(property.propertyValue) || 0;
                }
            });
        }
        
        // Other assets use 'otherAssetValue' field
        if (willData.assets.other) {
            willData.assets.other.forEach(asset => {
                if (asset.otherAssetValue) {
                    totalAssets += parseFloat(asset.otherAssetValue) || 0;
                }
            });
        }
    }
    
    // Calculate total debts using 'debtAmount' field
    if (willData.debts && Array.isArray(willData.debts)) {
        willData.debts.forEach(debt => {
            if (debt && debt.debtAmount) {
                totalDebts += parseFloat(debt.debtAmount) || 0;
            }
        });
    }
    
    return totalAssets - totalDebts;
}