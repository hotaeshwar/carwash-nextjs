"use client";

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

// Changed: Using public/images path instead of assets
const formImage = '/images/form1.png';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        serviceOption: '',
        message: '',
        photo: null
    });

    const [isHovered, setIsHovered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Service types (main categories) - ALL SERVICES from screenshot
    const serviceTypes = [
        { value: '', label: 'Select Service Type *', disabled: true },
        { value: 'auto-detailing', label: 'Auto Detailing' },
        { value: 'paint-correction-polishing', label: 'Paint Correction Polishing' },
        { value: 'window-tinting', label: 'Window Tinting' },
        { value: 'ceramic-coating', label: 'Ceramic Coating' },
        { value: 'paint-protection-film', label: 'Paint Protection Film' },
        { value: 'remediation-claims', label: 'Remediation Claims' }
    ];

    // Service options - ONLY FOR ORIGINAL SERVICES (PPF and Ceramic Coating)
    const serviceOptions = {
        // Paint Protection Film options (ORIGINAL)
        'paint-protection-film': [
            { value: '', label: 'Select PPF Option *', disabled: true },
            { value: 'bumper-only', label: 'BUMPER ONLY - Starting at $599 - Service Time 1 Day' },
            { value: 'economy-kit', label: 'ECONOMY KIT - Starting at $999 - Service Time 1.5 Day' },
            { value: 'full-front', label: 'FULL FRONT - Starting at $1499 - Service Time 1.5 Day' },
            { value: 'offset-tire-package', label: 'OFFSET TIRE PACKAGE - Starting at $1999 - Service Time 2 Days' }
        ],
        // Ceramic Coating options (ORIGINAL)
        'ceramic-coating': [
            { value: '', label: 'Select Ceramic Coating Option *', disabled: true },
            { value: 'fusion-plus-lite', label: 'FUSION PLUS LITE - 1 year warranty' },
            { value: 'fusion-plus-paint-ppf', label: 'FUSION PLUS PAINT & PPF - 4 years warranty' },
            { value: 'fusion-plus-premium', label: 'FUSION PLUS PREMIUM - 8 years warranty' }
        ],
        // For new services, just show a basic option
        'auto-detailing': [
            { value: '', label: 'Select Auto Detailing Service *', disabled: true },
            { value: 'general-inquiry', label: 'General Auto Detailing Inquiry' }
        ],
        'paint-correction-polishing': [
            { value: '', label: 'Select Paint Correction Service *', disabled: true },
            { value: 'general-inquiry', label: 'General Paint Correction Inquiry' }
        ],
        'window-tinting': [
            { value: '', label: 'Select Window Tinting Service *', disabled: true },
            { value: 'general-inquiry', label: 'General Window Tinting Inquiry' }
        ],
        'remediation-claims': [
            { value: '', label: 'Select Remediation Claim Type *', disabled: true },
            { value: 'general-inquiry', label: 'General Remediation Claim Inquiry' }
        ]
    };

    // Get current service options based on selected type
    const getCurrentServiceOptions = () => {
        if (!formData.serviceType) {
            return [{ value: '', label: 'First select service type above', disabled: true }];
        }
        return serviceOptions[formData.serviceType] || [{ value: '', label: 'No options available', disabled: true }];
    };

    // Get service display name for emails
    const getServiceDisplayName = () => {
        if (!formData.serviceType || !formData.serviceOption) {
            return 'Not Selected';
        }
        
        const typeLabel = serviceTypes.find(t => t.value === formData.serviceType)?.label || '';
        const optionLabel = serviceOptions[formData.serviceType]?.find(o => o.value === formData.serviceOption)?.label || '';
        
        return `${typeLabel} - ${optionLabel}`;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'serviceType') {
            // When service type changes, reset the service option
            setFormData(prev => ({
                ...prev,
                serviceType: value,
                serviceOption: ''
            }));
        } else if (name === 'photo' && files.length > 0) {
            const file = files[0];
            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('❌ File size too large. Please select an image smaller than 5MB.');
                return;
            }
            setFormData({ ...formData, [name]: file });
            
            // Create preview for the selected image
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const removePhoto = () => {
        setFormData({ ...formData, photo: null });
        setPhotoPreview(null);
    };

    // Generate contact ID like "CONTA1B2C3"
    const generateContactId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'CONTACT';
        // Add 6 characters (mix of letters and numbers)
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    // Web3Forms implementation with better attachment handling
    const sendEmail = async (contactId, emailType) => {
        const formDataToSend = new FormData();
        
        // Add all form data
        formDataToSend.append('access_key', 'ba99ae3b-60cc-404c-b207-2a42e86aafb6');
        formDataToSend.append('subject', emailType === 'business' 
            ? `📞 New Contact Form - ${contactId}`
            : `✅ Contact Form Confirmation - ${contactId}`);
        formDataToSend.append('from_name', emailType === 'business' 
            ? `${formData.name}`
            : 'Action Car Detailing');
        formDataToSend.append('email', emailType === 'business' 
            ? 'actioncardetailing@gmail.com'
            : formData.email);
        formDataToSend.append('reply_to', formData.email);
        
        // Anti-spam measures
        formDataToSend.append('botcheck', '');
        formDataToSend.append('honeypot', '');

        // Add redirect URL for customer email
        if (emailType === 'customer') {
            formDataToSend.append('redirect', 'false');
        }

        // Add message content with clear attachment instructions
        const messageContent = emailType === 'business' ? `
NEW CONTACT FORM SUBMISSION RECEIVED
=====================================

📋 CONTACT ID: ${contactId}
📅 Date/Time: ${new Date().toLocaleString()}

👤 CUSTOMER INFORMATION
-----------------------
• Name: ${formData.name || 'N/A'}
• Email: ${formData.email || 'N/A'}
• Phone: ${formData.phone || 'N/A'}

🎯 SERVICE REQUESTED
--------------------
${formData.serviceType && formData.serviceOption ? getServiceDisplayName() : 'N/A'}

💬 MESSAGE DETAILS
------------------
${formData.message || 'N/A'}

📎 ATTACHMENT STATUS
-------------------
${formData.photo ? 
`✅ PHOTO ATTACHED: Yes
📁 File: ${formData.photo.name}
💾 Size: ${(formData.photo.size / 1024 / 1024).toFixed(2)} MB
📝 Note: Check email attachments for the photo` 
: '❌ PHOTO ATTACHED: No'}

---
This is an automated contact form notification from Action Car Detailing.
        ` : `
Dear ${formData.name},

Thank you for contacting Action Car Detailing! 🚗

✅ CONTACT FORM CONFIRMATION
============================

Your Contact ID: ${contactId}
Status: Received

We have received your message and will get back to you within 24 hours.

📋 YOUR SERVICE REQUEST
-----------------------
Service: ${formData.serviceType && formData.serviceOption ? getServiceDisplayName() : 'Not Specified'}

📋 YOUR MESSAGE DETAILS
-----------------------
${formData.message || 'N/A'}

${formData.photo ? 
`📸 Photo Status: Attached successfully
We have received your photo and will review it along with your message.` 
: `📸 Photo Status: No photo attached`}

⏰ WHAT HAPPENS NEXT
-------------------
• Our team will review your service request${formData.photo ? ' and attached photo' : ''}
• We'll respond to your inquiry within 24 hours
• We'll provide you with the information or assistance you need

📞 CONTACT INFORMATION
----------------------
• Email: actioncardetailing@gmail.com
• Phone: (204) 775-0005
• Reference: ${contactId}

Thank you for reaching out to Action Car Detailing!
We look forward to assisting you.

Best regards,
Action Car Detailing Team

---
This is an automated confirmation email. Please do not reply directly to this email.
For inquiries, please contact us at actioncardetailing@gmail.com
        `;

        formDataToSend.append('message', messageContent);

        // Add attachment if photo exists (only for business email)
        if (formData.photo && emailType === 'business') {
            formDataToSend.append('attachment', formData.photo);
            // Also add file info to the form data for better tracking
            formDataToSend.append('attachment_name', formData.photo.name);
            formDataToSend.append('attachment_size', formData.photo.size.toString());
        }

        try {
            console.log(`Sending ${emailType} email for contact ID: ${contactId}`);
            if (formData.photo && emailType === 'business') {
                console.log(`Attaching file: ${formData.photo.name} (${formData.photo.size} bytes)`);
            }
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error('Web3Forms API error:', data);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            console.log(`${emailType} email sent successfully:`, data);
            return data;
        } catch (error) {
            console.error(`Error sending ${emailType} email:`, error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.phone || !formData.message || !formData.serviceType || !formData.serviceOption) {
            alert('❌ Please fill in all required fields including both service selections.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('❌ Please enter a valid email address.');
            return;
        }

        // Phone validation (basic)
        if (formData.phone.length < 10) {
            alert('❌ Please enter a valid phone number.');
            return;
        }

        // Service validation
        if (!formData.serviceType) {
            alert('❌ Please select a service type.');
            return;
        }
        
        if (!formData.serviceOption) {
            alert('❌ Please select a service option.');
            return;
        }

        setIsSubmitting(true);

        try {
            const contactId = generateContactId();
            console.log('Starting form submission with ID:', contactId);

            // Send email to business (with attachment)
            console.log('Sending business email...');
            const businessResult = await sendEmail(contactId, 'business');
            
            // Small delay between emails
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Send email to customer (without attachment)
            console.log('Sending customer email...');
            const customerResult = await sendEmail(contactId, 'customer');

            if (businessResult.success && customerResult.success) {
                console.log('Both emails sent successfully');
                
                // Show success dialog with clear attachment info
                let successMessage = `✅ Contact Form Submitted Successfully!\n\n📋 Your Contact ID: ${contactId}\n\nThank you for your message! We have received your inquiry and will get back to you within 24 hours.\n\n📧 Confirmation emails sent to:\n• Business: actioncardetailing@gmail.com`;
                
                if (formData.photo) {
                    successMessage += `\n• 📸 Photo attached to business email\n  (Check attachments in your email client)`;
                }
                
                successMessage += `\n• Customer: ${formData.email}`;
                
                alert(successMessage);
                
                // Reset form data
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    serviceType: '',
                    serviceOption: '',
                    message: '',
                    photo: null
                });
                setPhotoPreview(null);

            } else {
                throw new Error('Email sending failed');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            // Show error dialog
            alert('❌ Submission Error\n\nThere was an error submitting your message. Please try again or contact us directly at actioncardetailing@gmail.com\n\nError: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 overflow-hidden bg-white">
            <div className="container mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8 lg:gap-16">
                    {/* Left side content */}
                    <div className="w-full lg:w-1/2 text-left">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6" style={{color: '#1393c4'}}>
                            We are Certified and Authorized
                        </h2>
                        <p className="text-sm sm:text-base mb-4 sm:mb-6" style={{color: '#1393c4', opacity: 0.8}}>
                            Action Car Detailing Inc., one of Winnipeg's most reputable detailing companies with over 14 years in the
                            business. When it comes to trusting your vehicles in the right hands, look no further than guys with the most experience.
                        </p>

                        <div className="mb-4 sm:mb-6">
                            <p className="text-sm sm:text-base font-medium" style={{color: '#1393c4'}}>1380 Sargent avenue,</p>
                            <p className="text-sm sm:text-base font-medium" style={{color: '#1393c4'}}>Winnipeg,</p>
                            <p className="text-sm sm:text-base font-medium" style={{color: '#1393c4'}}>MB, R3E 0G5</p>
                            <p className="text-sm sm:text-base font-medium" style={{color: '#1393c4'}}>(Appointment Only)</p>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <p className="text-base sm:text-lg font-semibold" style={{color: '#1393c4'}}>(204) 775-0005</p>
                            <a
                                href="mailto:info@actioncardetailing.ca"
                                className="text-sm sm:text-base transition duration-300"
                                style={{color: '#1393c4'}}
                                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}
                            >
                                info@actioncardetailing.ca
                            </a>
                        </div>
                        <div className="mt-6 sm:mt-8 hidden lg:block">
                            <img
                                src={formImage}
                                alt="Car detailing service"
                                className="max-w-full rounded-lg shadow-lg"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Right side form */}
                    <div className="w-full lg:w-1/2 bg-gray-50 bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 md:p-8 mt-6 lg:mt-0">
                        <div>
                            <div className="mb-3 sm:mb-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name *"
                                    required
                                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                                    style={{color: '#1393c4'}}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="mb-3 sm:mb-4">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email *"
                                    required
                                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                                    style={{color: '#1393c4'}}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="mb-3 sm:mb-4">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone *"
                                    required
                                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                                    style={{color: '#1393c4'}}
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* First Dropdown: Service Type */}
                            <div className="mb-3 sm:mb-4">
                                <select
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 bg-white"
                                    style={{color: '#1393c4'}}
                                    disabled={isSubmitting}
                                >
                                    {serviceTypes.map((option) => (
                                        <option 
                                            key={option.value} 
                                            value={option.value}
                                            disabled={option.disabled}
                                            style={{color: '#1393c4'}}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs mt-1" style={{color: '#1393c4', opacity: 0.7}}>
                                    Select the type of service you're interested in
                                </p>
                            </div>

                            {/* Second Dropdown: Service Option (only shows if service type selected) */}
                            {formData.serviceType && (
                                <div className="mb-3 sm:mb-4">
                                    <select
                                        name="serviceOption"
                                        value={formData.serviceOption}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 bg-white"
                                        style={{color: '#1393c4'}}
                                        disabled={isSubmitting}
                                    >
                                        {getCurrentServiceOptions().map((option) => (
                                            <option 
                                                key={option.value} 
                                                value={option.value}
                                                disabled={option.disabled}
                                                style={{color: '#1393c4'}}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs mt-1" style={{color: '#1393c4', opacity: 0.7}}>
                                        Select the specific service option
                                    </p>
                                </div>
                            )}

                            <div className="mb-3 sm:mb-4">
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Message *"
                                    rows="4"
                                    required
                                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 resize-none"
                                    style={{color: '#1393c4'}}
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>

                            <div className="mb-4 sm:mb-6">
                                <p className="mb-1 sm:mb-2 text-sm sm:text-base font-medium" style={{color: '#1393c4'}}>
                                    📸 Attach a Photo (Optional - Max 5MB)
                                </p>
                                
                                {/* File input */}
                                <input
                                    type="file"
                                    name="photo"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="w-full p-1 sm:p-2 text-sm sm:text-base border border-gray-300 rounded-lg file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-md file:border-0 file:text-white file:text-sm sm:file:text-base transition duration-300 mb-2"
                                    style={{
                                        color: '#1393c4',
                                        '--file-bg': '#1393c4',
                                        '--file-hover-bg': '#0f7ba8'
                                    }}
                                    disabled={isSubmitting}
                                />
                                
                                {/* Photo preview */}
                                {photoPreview && (
                                    <div className="mt-2 p-2 border border-gray-300 rounded-lg bg-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium" style={{color: '#1393c4'}}>📷 Photo Preview:</span>
                                            <button
                                                type="button"
                                                onClick={removePhoto}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                disabled={isSubmitting}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="max-w-full h-32 object-cover rounded border border-gray-200"
                                        />
                                        <p className="text-xs mt-1" style={{color: '#1393c4', opacity: 0.7}}>
                                            This photo will be attached as a separate file in the email
                                        </p>
                                    </div>
                                )}
                                
                                <style jsx>{`
                                    input[type="file"]::file-selector-button {
                                        background-color: #1393c4;
                                        color: white;
                                        border: none;
                                        padding: 8px 16px;
                                        border-radius: 6px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    }
                                    input[type="file"]::file-selector-button:hover {
                                        background-color: #0f7ba8;
                                    }
                                    input[type="file"]:disabled::file-selector-button {
                                        background-color: #9ca3af;
                                        cursor: not-allowed;
                                    }
                                `}</style>
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                disabled={isSubmitting}
                                className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base text-white text-center cursor-pointer transition-all duration-500 ease-in-out transform ${
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                style={{
                                    backgroundColor: isHovered && !isSubmitting ? '#0f7ba8' : '#1393c4',
                                    transform: isHovered && !isSubmitting ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: isHovered && !isSubmitting ? '0 10px 25px rgba(19, 147, 196, 0.3)' : 'none'
                                }}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        SENDING...
                                    </span>
                                ) : (
                                    'Submit Message'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Image for mobile view */}
                <div className="mt-8 sm:mt-10 md:mt-12 lg:hidden">
                    <img
                        src={formImage}
                        alt="Car detailing service"
                        className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    );
};

export default ContactForm;