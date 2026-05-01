'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Mail, Car, Calendar, MessageSquare, ChevronLeft, ChevronRight, Clock, ChevronDown, ChevronUp, AlertCircle, Lock } from 'lucide-react';
import Image from 'next/image';
import { db } from '../../firebase';
import { collection, getDocs, query } from 'firebase/firestore';

// Import DateBlockingManager
import DateBlockingManager from '../components/DateBlockingManager';

const Quote = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    makeModel: '',
    message: ''
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockedDates, setBlockedDates] = useState({});
  
  // New state for dropdown sections
  const [selectedPackage, setSelectedPackage] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // New state for AM/PM selection
  const [timePeriod, setTimePeriod] = useState('AM');

  // State for DateBlockingManager modal
  const [showDateManager, setShowDateManager] = useState(false);

  // Refs for scrolling
  const timeSectionRef = useRef(null);

  // Service packages data
  const servicePackages = [
    {
      id: 'bumper-only',
      title: 'BUMPER ONLY',
      price: 'Starting at $599',
      serviceTime: 'Service Time 1 Day',
      description: 'Professional bumper detailing and restoration'
    },
    {
      id: 'economy-kit',
      title: 'ECONOMY KIT',
      price: 'Starting at $999',
      serviceTime: 'Service Time 1.5 Day',
      description: 'Basic exterior and interior cleaning package'
    },
    {
      id: 'full-front',
      title: 'FULL FRONT',
      price: 'Starting at $1499',
      serviceTime: 'Service Time 1.5 Day',
      description: 'Complete front-end detailing and protection'
    },
    {
      id: 'offset-tire-package',
      title: 'OFFSET TIRE PACKAGE',
      price: 'Starting at $1999',
      serviceTime: 'Service Time 2 Days',
      description: 'Premium tire and wheel package with offset detailing'
    }
  ];

  // Time slots data - 8 AM to 6 PM (client availability)
  const timeSlots = {
    AM: [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30'
    ],
    PM: [
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ]
  };

  // Load blocked dates from Firebase
  useEffect(() => {
    loadBlockedDates();
  }, []);

  // Auto-scroll to time section when date is selected
  useEffect(() => {
    if (selectedDate && timeSectionRef.current) {
      const timer = setTimeout(() => {
        timeSectionRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [selectedDate]);

  const loadBlockedDates = async () => {
    try {
      const q = query(collection(db, 'blockedDates'));
      const querySnapshot = await getDocs(q);
      const dates = {};
      querySnapshot.forEach((doc) => {
        dates[doc.id] = doc.data();
      });
      setBlockedDates(dates);
    } catch (error) {
      console.error('Error loading blocked dates:', error);
    }
  };

  // Check if a date is Saturday
  const isSaturday = (day) => {
    if (!day) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.getDay() === 6; // 6 = Saturday
  };

  // Check if a date is Sunday
  const isSunday = (day) => {
    if (!day) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.getDay() === 0; // 0 = Sunday
  };

  // Get weekday name
  const getWeekdayName = (day) => {
    if (!day) return '';
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // UPDATED: Check if a specific date is blocked - now handles Saturday partial blocking
  const isDateBlocked = (day) => {
    if (!day) return false;
    
    // NEW: Check if this is Sunday - full block
    if (isSunday(day)) {
      return true;
    }
    
    const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const blockInfo = blockedDates[dateString];
    
    if (!blockInfo) return false;
    
    // If it's a full block or sunday-full, the date is blocked
    if (blockInfo.type === 'full' || blockInfo.type === 'sunday-full') return true;
    
    // If it's a saturday-partial, the date is partially blocked (after 12 PM)
    // But the date itself is NOT fully blocked - AM times are still available
    if (blockInfo.type === 'saturday-partial') return false;
    
    // If it's a partial block, check if all time slots are blocked
    if (blockInfo.type === 'partial' && blockInfo.blockedSlots) {
      const allTimeSlots = [...timeSlots.AM, ...timeSlots.PM];
      return blockInfo.blockedSlots.length === allTimeSlots.length;
    }
    
    return false;
  };

  // UPDATED: Check if a specific time slot is blocked - handles Saturday partial blocking
  const isTimeSlotBlocked = (time) => {
    if (!selectedDate) return false;
    
    // Convert selectedDate to YYYY-MM-DD format
    const dateParts = selectedDate.split(' ');
    const monthIndex = months.indexOf(dateParts[0]);
    const day = parseInt(dateParts[1].replace(',', ''));
    const year = parseInt(dateParts[2]);
    
    // NEW: Check if this is Sunday
    const date = new Date(year, monthIndex, day);
    if (date.getDay() === 0) {
      return true; // Block all time slots on Sunday
    }
    
    const dateString = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const blockInfo = blockedDates[dateString];
    
    // Check for Saturday special handling
    if (date.getDay() === 6) { // Saturday
      // Check if there's custom Saturday blocking
      if (blockInfo && blockInfo.type === 'saturday-partial') {
        // For saturday-partial, block all PM times
        const [hours] = time.split(':');
        const hour = parseInt(hours);
        if (hour >= 12) {
          return true; // Block PM times on Saturday
        }
      } else if (blockInfo && (blockInfo.type === 'full' || blockInfo.type === 'saturday-full')) {
        return true; // Full Saturday block
      } else if (!blockInfo) {
        // Default Saturday behavior: Block PM times
        const [hours] = time.split(':');
        const hour = parseInt(hours);
        if (hour >= 12) {
          return true; // Block PM times on Saturday
        }
      }
    }
    
    // For other days, check block info
    if (!blockInfo) return false;
    
    // Check block type
    if (blockInfo.type === 'full' || blockInfo.type === 'sunday-full') {
      return true;
    }
    
    // Check if specific time slot is blocked
    if (blockInfo.type === 'partial' && blockInfo.blockedSlots) {
      const isBlocked = blockInfo.blockedSlots.includes(time);
      return isBlocked;
    }
    
    return false;
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (day) => {
    if (!day) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return checkDate < today;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelect = (day) => {
    if (day && !isPastDate(day) && !isDateBlocked(day)) {
      const selected = `${months[currentMonth.getMonth()]} ${day}, ${currentMonth.getFullYear()}`;
      setSelectedDate(selected);
      setSelectedTime('');
    }
  };

  const handleTimeSelect = (time) => {
    if (!isTimeSlotBlocked(time)) {
      setSelectedTime(time);
    }
  };

  // Handle package selection
  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId);
    setOpenDropdown(null);
  };

  // Toggle dropdown
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Handle time period change (AM/PM)
  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
    // Keep the selected time if it exists in the new period
    if (selectedTime && !timeSlots[period].includes(selectedTime)) {
      setSelectedTime('');
    }
  };

  // Generate quote ID like "QUOTEA1B2C3"
  const generateQuoteId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'QUOTE';
    // Add 6 characters (mix of letters and numbers)
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const sendEmail = async (quoteId) => {
    const emailFormData = new FormData();
    
    emailFormData.append('access_key', 'ba99ae3b-60cc-404c-b207-2a42e86aafb6');
    emailFormData.append('autoresponse', 'false');
    emailFormData.append('subject', `Quote Request Received – Confirmation Pending`);
    emailFormData.append('from_name', 'Action Car Detailing');
    emailFormData.append('email', formData.email);
    emailFormData.append('reply_to', 'actioncardetailing@gmail.com');

    // Get selected package details
    const selectedPackageDetails = servicePackages.find(pkg => pkg.id === selectedPackage);

    // Format time with AM/PM for email
    const formatTimeForEmail = (time) => {
      if (!time) return 'Not selected';
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${period}`;
    };

    emailFormData.append('message', `
✅ ACTION CAR DETAILING – AUTOMATED QUOTE REQUEST CONFIRMATION

Subject: Quote Request Received – Confirmation Pending

Dear ${formData.name},

Thank you for requesting a quote from Action Car Detailing!

We have successfully received your quote request. Our team will review your vehicle details and get back to you within 24 hours with a customized quote.

QUOTE SUMMARY

Quote ID: ${quoteId}
Status: Pending Review

CUSTOMER INFORMATION

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

VEHICLE INFORMATION

Make/Model: ${formData.makeModel}

SERVICE PACKAGE SELECTED

${selectedPackageDetails ? `${selectedPackageDetails.title} - ${selectedPackageDetails.price}` : 'No package selected'}

PREFERRED APPOINTMENT

${selectedDate && selectedTime ? `${selectedDate} at ${formatTimeForEmail(selectedTime)}` : 'No preferred time selected'}

TIME PREFERENCE

${selectedTime ? `Preferred Time Period: ${timePeriod}` : 'No time period selected'}

ADDITIONAL MESSAGE

${formData.message || 'No additional message provided'}

IMPORTANT INFORMATION

• We will review your quote request within 24 hours
• You'll receive a customized quote based on your vehicle details
• We'll include available appointment times that work for your schedule
• Contact us if you need to modify your request

CONTACT DETAILS

Email: actioncardetailing@gmail.com
Phone: (204) 775-0005
Quote Reference: ${quoteId}

Thank you for considering Action Car Detailing!
We look forward to serving you.

Best regards,
Action Car Detailing Team
Passion for Detail
    `);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: emailFormData
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Web3Forms API error:', data);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      alert('❌ Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const quoteId = generateQuoteId();

      // Send only ONE email to the customer
      const emailResult = await sendEmail(quoteId);

      if (emailResult.success) {
        alert(`✅ Quote Request Submitted Successfully!\n\nYour Quote ID: ${quoteId}\n\nThank you for your interest! We'll review your information and get back to you within 24 hours with a customized quote.\n\nConfirmation email has been sent to: ${formData.email}`);
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          makeModel: '',
          message: ''
        });
        setSelectedDate('');
        setSelectedTime('');
        setSelectedPackage('');
        setTimePeriod('AM');

      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Error submitting quote request:', error);
      alert('❌ Submission Error\n\nThere was an error submitting your request. Please try again or contact us directly at actioncardetailing@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.phone && formData.email && formData.makeModel;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#1393c4]" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1393c4]">GET YOUR QUOTE</h1>
          </div>
          <p className="text-[#1393c4] text-sm sm:text-base md:text-lg">Fill out the form below to receive a customized quote.</p>
          
          {/* Weekend Availability Notice */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-[#1393c4]" />
              <p className="text-sm font-semibold text-[#1393c4]">Weekend Availability</p>
            </div>
            <p className="text-xs text-gray-600 text-center">
              • Sundays: Closed all day<br />
              • Saturdays: Open for morning bookings only (8 AM - 11:30 AM)
            </p>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200 mb-6 sm:mb-8">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1393c4] mb-2 sm:mb-4">1. CONTACT INFORMATION</h2>
            <p className="text-[#1393c4] text-sm sm:text-base">Please provide your contact details.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
            {/* Name Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#1393c4] mb-1 sm:mb-2">Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full pl-9 sm:pl-10 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#1393c4] mb-1 sm:mb-2">Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                  className="w-full pl-9 sm:pl-10 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#1393c4] mb-1 sm:mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email address"
                  className="w-full pl-9 sm:pl-10 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent"
                />
              </div>
            </div>

            {/* Make and Model Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#1393c4] mb-1 sm:mb-2">Vehicle Make and Model *</label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  name="makeModel"
                  value={formData.makeModel}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Toyota Camry 2020"
                  className="w-full pl-9 sm:pl-10 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent"
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#1393c4] mb-1 sm:mb-2">Additional Message</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Tell us about the services you're interested in or any specific requirements..."
                  className="w-full pl-9 sm:pl-10 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service Packages Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200 mb-6 sm:mb-8">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1393c4] mb-2 sm:mb-4">2. SELECT SERVICE PACKAGE</h2>
            <p className="text-[#1393c4] text-sm sm:text-base">Choose the service package that fits your needs.</p>
          </div>

          {/* Service Packages Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown('services')}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-4 flex justify-between items-center hover:border-[#1393c4] transition-colors duration-200"
            >
              <span className="text-[#1393c4] font-semibold text-lg">
                {selectedPackage 
                  ? servicePackages.find(pkg => pkg.id === selectedPackage)?.title
                  : 'Select Service Package'}
              </span>
              {openDropdown === 'services' ? <ChevronUp className="text-[#1393c4]" /> : <ChevronDown className="text-[#1393c4]" />}
            </button>
            
            {openDropdown === 'services' && (
              <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                {servicePackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => handlePackageSelect(pkg.id)}
                    className={`p-4 border-b border-gray-200 last:border-b-0 cursor-pointer transition-colors duration-200 ${
                      selectedPackage === pkg.id 
                        ? 'bg-[#1393c4] text-white' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold text-lg ${
                        selectedPackage === pkg.id ? 'text-white' : 'text-[#1393c4]'
                      }`}>
                        {pkg.title}
                      </h3>
                      <span className={`font-semibold ${
                        selectedPackage === pkg.id ? 'text-white' : 'text-gray-700'
                      }`}>
                        {pkg.price}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 ${
                      selectedPackage === pkg.id ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                      {pkg.description}
                    </p>
                    <p className={`text-sm font-medium ${
                      selectedPackage === pkg.id ? 'text-blue-100' : 'text-[#1393c4]'
                    }`}>
                      {pkg.serviceTime}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date and Time Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200 mb-6 sm:mb-8">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1393c4] mb-2 sm:mb-4">3. PREFERRED DATE AND TIME</h2>
            <p className="text-[#1393c4] text-sm sm:text-base">Choose your preferred appointment time (optional).</p>
            <p className="text-xs text-gray-500 mt-1">
              • Weekdays: 8 AM - 5:30 PM<br />
              • Saturdays: 8 AM - 11:30 AM only<br />
              • Sundays: Closed
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg sm:rounded-xl border-2 border-gray-200 p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
              <div className="text-base sm:text-lg md:text-xl font-semibold text-[#1393c4]">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
              <div className="flex space-x-1 sm:space-x-2">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  className="p-1 sm:p-2 md:p-3 hover:bg-gray-100 rounded-lg text-[#1393c4] transition-colors duration-200"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  className="p-1 sm:p-2 md:p-3 hover:bg-gray-100 rounded-lg text-[#1393c4] transition-colors duration-200"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-3 sm:mb-4">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-xs font-medium text-[#1393c4] py-1 sm:py-2 bg-gray-100 rounded">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4 sm:mb-6 md:mb-8">
              {getDaysInMonth(currentMonth).map((day, index) => {
                const isSelected = selectedDate === `${months[currentMonth.getMonth()]} ${day}, ${currentMonth.getFullYear()}`;
                const isBlocked = isDateBlocked(day);
                const isPast = isPastDate(day);
                const isSaturdayDay = isSaturday(day);
                const isSundayDay = isSunday(day);
                const weekday = getWeekdayName(day);
                
                return (
                  <button
                    key={index}
                    onClick={() => day && handleDateSelect(day)}
                    disabled={!day || isPast || isBlocked}
                    className={`h-6 sm:h-7 md:h-8 lg:h-10 w-full rounded text-xs font-medium transition-colors duration-200 relative ${
                      !day
                        ? 'cursor-default'
                        : isPast || isBlocked
                        ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                        : isSelected
                        ? 'bg-[#1393c4] text-white font-bold'
                        : isToday(day)
                        ? 'bg-blue-100 text-[#1393c4] border border-[#1393c4]'
                        : isSundayDay
                        ? 'bg-red-50 text-red-400 cursor-not-allowed'
                        : isSaturdayDay
                        ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                        : 'hover:bg-blue-50 text-[#1393c4] border border-gray-200 hover:border-[#1393c4]'
                    }`}
                    title={isSundayDay ? 'Sunday - Closed' : isSaturdayDay ? 'Saturday - Morning only (8 AM - 11:30 AM)' : weekday}
                  >
                    {day}
                    {isSaturdayDay && (
                      <span className="block text-[8px] mt-[-2px] text-yellow-500">(AM)</span>
                    )}
                    {isSundayDay && (
                      <span className="block text-[8px] mt-[-2px] text-red-500">(No)</span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div 
                ref={timeSectionRef}
                className="border-t border-gray-200 pt-3 sm:pt-4 md:pt-6"
              >
                <div className="text-center mb-3 sm:mb-4">
                  <p className="text-[#1393c4] font-semibold text-sm sm:text-base md:text-lg">Selected: {selectedDate}</p>
                </div>
                
                {/* Check if selected date is Saturday */}
                {(() => {
                  const dateParts = selectedDate.split(' ');
                  const monthIndex = months.indexOf(dateParts[0]);
                  const day = parseInt(dateParts[1].replace(',', ''));
                  const year = parseInt(dateParts[2]);
                  const date = new Date(year, monthIndex, day);
                  
                  if (date.getDay() === 6) { // Saturday
                    return (
                      <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-700 text-sm text-center font-medium">
                          Saturday: Only morning appointments available (8 AM - 11:30 AM)
                        </p>
                      </div>
                    );
                  } else if (date.getDay() === 0) { // Sunday
                    return (
                      <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm text-center font-medium">
                          Sunday: Closed all day
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#1393c4] mb-3 sm:mb-4 text-center">Available Times</h3>
                
                {/* AM/PM Selection - Made more visible */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white rounded-lg p-2 border-2 border-gray-300 shadow-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleTimePeriodChange('AM')}
                        className={`px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${
                          timePeriod === 'AM' 
                            ? 'bg-[#1393c4] text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        AM 
                        <div className="text-xs font-normal mt-1">8:00 AM - 11:30 AM</div>
                      </button>
                      <button
                        onClick={() => handleTimePeriodChange('PM')}
                        className={`px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${
                          timePeriod === 'PM' 
                            ? 'bg-[#1393c4] text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        PM
                        <div className="text-xs font-normal mt-1">12:00 PM - 5:30 PM</div>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Check if PM should be disabled for Saturday */}
                {(() => {
                  const dateParts = selectedDate.split(' ');
                  const monthIndex = months.indexOf(dateParts[0]);
                  const day = parseInt(dateParts[1].replace(',', ''));
                  const year = parseInt(dateParts[2]);
                  const date = new Date(year, monthIndex, day);
                  
                  if (date.getDay() === 6 && timePeriod === 'PM') { // Saturday PM
                    return (
                      <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm text-center font-medium">
                          Saturday afternoons are not available for booking
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                {/* Clean Time Slots - No borders, no backgrounds, just text */}
                <div className="text-center mb-2">
                  <p className="text-sm text-gray-600">
                    Currently showing: <span className="font-semibold text-[#1393c4]">{timePeriod} Times</span>
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots[timePeriod].map(time => {
                    const isBlocked = isTimeSlotBlocked(time);
                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        disabled={isBlocked}
                        className={`
                          py-3 text-sm font-medium transition-colors duration-200 rounded-lg
                          ${isBlocked
                            ? 'text-gray-400 cursor-not-allowed line-through bg-gray-100'
                            : selectedTime === time
                            ? 'text-[#1393c4] font-bold underline bg-blue-50'
                            : 'text-gray-700 hover:text-[#1393c4] hover:bg-gray-50'
                          }
                        `}
                        title={isBlocked ? 'This time slot is blocked' : ''}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-6 sm:mt-8 md:mt-12">
          <p className="text-xs sm:text-sm text-[#1393c4] mb-3 sm:mb-4 leading-relaxed">
            We will review your quote request and get back to you within 24 hours with a customized quote.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`px-6 sm:px-8 md:px-12 py-2 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
              isFormValid && !isSubmitting
                ? 'bg-[#1393c4] hover:bg-[#0d7aa1] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Get My Quote'}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
            📞 Need immediate assistance? Call us at (204) 775-0005
          </p>
          <p className="text-gray-500 text-xs">
            * Required fields
          </p>
        </div>
      </div>

      {/* Date Blocking Manager Modal */}
      {showDateManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl mx-2 sm:mx-0">
            <div className="p-4 sm:p-6">
              <DateBlockingManager />
            </div>
            <button
              onClick={() => setShowDateManager(false)}
              className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
            >
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#1393c4]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quote;