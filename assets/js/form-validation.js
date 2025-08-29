/**
 * Enhanced form validation with error handling
 */

// Form validation with error messages displayed inline
function validateForm() {
  // Reset previous error messages
  clearErrors();
  
  let isValid = true;
  
  // Validate name
  const nameInput = document.getElementById('name');
  if (!nameInput.value.trim()) {
    displayError(nameInput, 'Please enter your name');
    isValid = false;
  } else if (nameInput.value.trim().length < 2) {
    displayError(nameInput, 'Name must be at least 2 characters');
    isValid = false;
  }
  
  // Validate email
  const emailInput = document.getElementById('email');
  if (!emailInput.value.trim()) {
    displayError(emailInput, 'Please enter your email');
    isValid = false;
  } else if (!isValidEmail(emailInput.value)) {
    displayError(emailInput, 'Please enter a valid email address');
    isValid = false;
  }
  
  // Validate message
  const messageInput = document.getElementById('message');
  if (!messageInput.value.trim()) {
    displayError(messageInput, 'Please enter your message');
    isValid = false;
  } else if (messageInput.value.trim().length < 10) {
    displayError(messageInput, 'Message must be at least 10 characters');
    isValid = false;
  }
  
  // If form is valid, show loading indicator
  if (isValid) {
    showSubmitting();
  }
  
  return isValid;
}

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Display error message below the input field
function displayError(inputElement, message) {
  // Create error element if it doesn't exist
  let errorElement = inputElement.nextElementSibling;
  if (!errorElement || !errorElement.classList.contains('error-message')) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.marginBottom = '0.5rem';
    inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
  }
  
  // Set error message and highlight input
  errorElement.textContent = message;
  inputElement.style.borderColor = '#e74c3c';
  
  // Focus on the first invalid field
  if (document.querySelector('.error-message') === errorElement) {
    inputElement.focus();
  }
}

// Clear all error messages
function clearErrors() {
  // Remove error messages
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(element => element.remove());
  
  // Reset input styling
  const formInputs = document.querySelectorAll('input, textarea, select');
  formInputs.forEach(input => input.style.borderColor = '');
}

// Show submitting state
function showSubmitting() {
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Reset button after form submission (in case of error)
    setTimeout(() => {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }, 5000);
  }
}

// Add real-time validation on blur
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form[name="contact"]');
  if (form) {
    // Add validation on input blur
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        // Clear previous error for this input
        const errorElement = this.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
          errorElement.remove();
          this.style.borderColor = '';
        }
        
        // Validate based on input type
        if (this.id === 'name' && this.value.trim() && this.value.trim().length < 2) {
          displayError(this, 'Name must be at least 2 characters');
        } else if (this.id === 'email' && this.value.trim() && !isValidEmail(this.value)) {
          displayError(this, 'Please enter a valid email address');
        } else if (this.id === 'message' && this.value.trim() && this.value.trim().length < 10) {
          displayError(this, 'Message must be at least 10 characters');
        }
      });
    });
  }
});