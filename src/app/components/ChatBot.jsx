'use client';

import { useState, useEffect } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
    agreeToPolicy: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/[^0-9]/g, ''))) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    if (!formData.agreeToPolicy) {
      newErrors.agreeToPolicy = 'You must agree to the privacy policy';
    }
    return newErrors;
  };

  // Generate contact ID like "CHAT1A2B3C"
  const generateContactId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CHAT';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Enhanced Web3Forms implementation with better error handling
  const sendEmail = async (contactId, emailType) => {
    try {
      console.log(`Preparing to send ${emailType} email for:`, contactId);
      
      const formDataToSend = new FormData();
      
      // Web3Forms required fields
      formDataToSend.append('access_key', 'ba99ae3b-60cc-404c-b207-2a42e86aafb6');
      formDataToSend.append('subject', emailType === 'business' 
        ? `💬 New Chat Message - ${contactId}`
        : `✅ Chat Message Confirmation - ${contactId}`);
      
      formDataToSend.append('from_name', 'Action Car Detailing Website');
      formDataToSend.append('email', formData.email);
      
      // Reply-to for business emails
      if (emailType === 'business') {
        formDataToSend.append('reply_to', formData.email);
      }

      // Anti-spam measures
      formDataToSend.append('botcheck', '');
      
      // Custom form data for better organization
      formDataToSend.append('contact_id', contactId);
      formDataToSend.append('source', 'Website Chat Widget');
      formDataToSend.append('timestamp', new Date().toLocaleString());

      // Message content with clear formatting
      let messageContent = '';
      
      if (emailType === 'business') {
        messageContent = `
NEW CHAT MESSAGE - ACTION REQUIRED
===================================

📋 CONTACT ID: ${contactId}
🕒 Date/Time: ${new Date().toLocaleString()}
📍 Source: Website Chat Widget

👤 CUSTOMER DETAILS
-------------------
• Name: ${formData.name}
• Email: ${formData.email}
• Mobile: ${formData.mobile}

💬 MESSAGE CONTENT
------------------
${formData.message}

🚀 ACTION REQUIRED
------------------
Please respond to this inquiry within 24 hours.

---
Automated Notification - Action Car Detailing
        `;
      } else {
        // Customer confirmation
        messageContent = `
Dear ${formData.name},

Thank you for contacting Action Car Detailing! We have received your message and will get back to you within 24 hours.

✅ MESSAGE CONFIRMATION
=======================

Contact ID: ${contactId}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

📋 YOUR MESSAGE
---------------
"${formData.message}"

📞 OUR CONTACT INFORMATION
--------------------------
• Phone: (204) 775-0005
• Email: actioncardetailing@gmail.com
• Address: 1380 Sargent Avenue, Winnipeg, MB

⏰ WHAT TO EXPECT NEXT
----------------------
1. Our team will review your message
2. We'll contact you within 24 hours
3. We'll provide you with the information you need

Thank you for choosing Action Car Detailing!

Best regards,
The Action Car Detailing Team

---
This is an automated confirmation. Please do not reply to this email.
        `;
      }

      formDataToSend.append('message', messageContent);

      // Add customer email for CC in business email
      if (emailType === 'business') {
        formDataToSend.append('cc_emails', formData.email);
      }

      console.log(`Sending ${emailType} email to Web3Forms...`);
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataToSend
      });

      console.log('Web3Forms response status:', response.status);
      
      const data = await response.json();
      console.log('Web3Forms response data:', data);

      if (data.success) {
        console.log(`✅ ${emailType} email sent successfully`);
        return data;
      } else {
        console.error(`❌ Web3Forms error:`, data);
        throw new Error(data.message || `Failed to send ${emailType} email`);
      }

    } catch (error) {
      console.error(`💥 Error in sendEmail (${emailType}):`, error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    console.log('Starting form submission process...');

    try {
      const contactId = generateContactId();
      console.log('Generated Contact ID:', contactId);

      // Send business email first
      console.log('Step 1: Sending business notification...');
      const businessResult = await sendEmail(contactId, 'business');
      
      // Wait a moment before sending customer email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send customer confirmation
      console.log('Step 2: Sending customer confirmation...');
      const customerResult = await sendEmail(contactId, 'customer');

      if (businessResult.success && customerResult.success) {
        console.log('✅ Both emails sent successfully!');
        
        // Success message
        alert(`✅ Message Sent Successfully!\n\n📋 Contact ID: ${contactId}\n\nWe have received your message and will get back to you within 24 hours.\n\nA confirmation has been sent to: ${formData.email}`);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          mobile: '',
          message: '',
          agreeToPolicy: false
        });
        
        // Close chat
        setIsOpen(false);

      } else {
        throw new Error('One or more emails failed to send');
      }

    } catch (error) {
      console.error('💥 Form submission error:', error);
      
      // More specific error messages
      let errorMessage = 'There was an error sending your message. ';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (error.message.includes('rate limit')) {
        errorMessage += 'Please wait a moment and try again.';
      } else {
        errorMessage += 'Please try again or contact us directly at (204) 775-0005.';
      }
      
      alert(`❌ Submission Error\n\n${errorMessage}\n\nError: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      console.log('Form submission process completed.');
    }
  };

  // Fallback to FormSubmit if Web3Forms fails repeatedly
  const submitWithFormSubmit = async () => {
    console.log('Attempting FormSubmit fallback...');
    
    const formElement = document.createElement('form');
    formElement.action = 'https://formsubmit.co/actioncardetailing@gmail.com';
    formElement.method = 'POST';
    formElement.style.display = 'none';

    // Add form data
    const fields = {
      '_subject': 'New Chat Message - Website',
      'Name': formData.name,
      'Email': formData.email,
      'Mobile': formData.mobile,
      'Message': formData.message,
      '_cc': formData.email,
      '_template': 'table',
      '_captcha': 'false'
    };

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      formElement.appendChild(input);
    });

    document.body.appendChild(formElement);
    formElement.submit();
    
    return { success: true };
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleChat}
          className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg ${
            isOpen 
              ? 'bg-red-500' 
              : 'bg-blue-500'
          }`}
        >
          <div className="flex items-center justify-center w-full h-full">
            {isOpen ? (
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Chat Dialog */}
      <div
        className={`fixed z-40 ${
          isOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible'
        }
        inset-0 bg-black bg-opacity-50
        md:inset-auto md:bg-transparent
        md:bottom-20 md:right-4 md:w-96 md:h-auto
        lg:right-6 lg:w-96
        `}
      >
        <div 
          className={`w-full h-full bg-white ${
            isOpen 
              ? 'translate-y-0' 
              : 'translate-y-full md:translate-y-8'
          }
          md:h-auto md:max-h-[600px] md:rounded-lg md:shadow-lg
          md:border md:border-gray-200
          flex flex-col overflow-hidden
          `}
        >
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 md:p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Message Us</h3>
                  <div className="flex items-center text-sm text-blue-100">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    We&apos;re online
                  </div>
                </div>
              </div>
              
              <button
                onClick={toggleChat}
                className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-blue-100">
              Send us a message and we&apos;ll get back to you shortly.
            </p>
          </div>

          {/* Welcome Message */}
          <div className="bg-blue-50 p-4 border-b border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm border border-gray-200 flex-1">
                <p className="text-sm text-blue-600">Hi there! 👋 Send us a message to learn more about our services.</p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-blue-500 mb-2">
                  NAME
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-sm border-2 rounded-lg focus:outline-none focus:border-blue-400 ${
                    errors.name 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-blue-200'
                  }`}
                  placeholder="Enter your name"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-blue-500 mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-sm border-2 rounded-lg focus:outline-none focus:border-blue-400 ${
                    errors.email 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-blue-200'
                  }`}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>}
              </div>

              {/* Mobile Field */}
              <div>
                <label className="block text-sm font-medium text-blue-500 mb-2">
                  MOBILE NUMBER
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-sm border-2 rounded-lg focus:outline-none focus:border-blue-400 ${
                    errors.mobile 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-blue-200'
                  }`}
                  placeholder="Enter your mobile number"
                  disabled={isSubmitting}
                />
                {errors.mobile && <p className="mt-1 text-xs text-red-500 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.mobile}
                </p>}
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-blue-500 mb-2">
                  MESSAGE
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-3 text-sm border-2 rounded-lg focus:outline-none focus:border-blue-400 resize-none ${
                    errors.message 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-blue-200'
                  }`}
                  placeholder="Type your message here..."
                  disabled={isSubmitting}
                ></textarea>
                {errors.message && <p className="mt-1 text-xs text-red-500 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.message}
                </p>}
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToPolicy"
                    checked={formData.agreeToPolicy}
                    onChange={handleChange}
                    className={`mt-1 w-4 h-4 text-blue-400 border-2 rounded focus:border-blue-400 ${
                      errors.agreeToPolicy ? 'border-red-400' : 'border-blue-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  <label className="text-xs text-blue-500 leading-relaxed">
                    By checking this box, you agree to our{' '}
                    <a href="#" className="text-blue-600 underline">Privacy Policy</a>
                    {' '}and consent to receive communications from us.
                  </label>
                </div>
                {errors.agreeToPolicy && (
                  <p className="text-xs text-red-500 flex items-center ml-7">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.agreeToPolicy}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full font-semibold py-4 px-6 rounded-lg shadow focus:outline-none ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <span className="flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      SENDING...
                    </>
                  ) : (
                    'SEND MESSAGE'
                  )}
                </span>
              </button>

              {/* Debug info - remove in production */}
              <div className="text-xs text-gray-400 text-center">
                Using Web3Forms API
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;