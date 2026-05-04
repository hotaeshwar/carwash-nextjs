'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Check, Car, Truck, X, Calendar, DollarSign, Package } from 'lucide-react';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { db } from '../../firebase';
import { collection, getDocs, query } from 'firebase/firestore';

// Updated: Logo from public/images folder
const actionCarLogo = '/images/action car logo.png';

// PDF Generation Function using jsPDF
const generatePDF = async (bookingData, selectedVehicle, selectedPackage, selectedAddOns, selectedDate, selectedTime, bookingId, getTotalPrice) => {
  const doc = new jsPDF();
  let yPos = 20;

  try {
    const loadImage = (src) => new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
    const logoImg = await loadImage('/images/actioncarlogo.png');
    doc.addImage(logoImg, 'PNG', 10, 5, 40, 20); // Add logo at top-left
  } catch (e) {
    console.error('Failed to load logo', e);
  }

  // Header
  doc.setFontSize(24);
  doc.setTextColor(19, 147, 196);
  doc.text("Action Car Detailing", 105, yPos, { align: 'center' });
  yPos += 15;
  
  doc.setFontSize(14);
  doc.setTextColor(51, 51, 51);
  doc.text(`Booking Confirmation: ${bookingId}`, 105, yPos, { align: 'center' });
  yPos += 20;

  // Customer Information Section
  doc.setFontSize(16);
  doc.setTextColor(19, 147, 196);
  doc.setFont(undefined, 'bold');
  doc.text("Customer Information", 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(51, 51, 51);
  doc.text(`Name: ${bookingData.firstName} ${bookingData.lastName}`, 20, yPos);
  yPos += 8;
  doc.text(`Email: ${bookingData.email}`, 20, yPos);
  yPos += 8;
  doc.text(`Phone: ${bookingData.phone}`, 20, yPos);
  yPos += 8;
  doc.text(`Vehicle: ${bookingData.vehicleMake}`, 20, yPos);
  yPos += 15;

  // Divider
  doc.setDrawColor(19, 147, 196);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Appointment Details
  doc.setFontSize(16);
  doc.setTextColor(19, 147, 196);
  doc.setFont(undefined, 'bold');
  doc.text("Appointment Details", 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(51, 51, 51);
  doc.text(`Date: ${selectedDate}`, 20, yPos);
  yPos += 8;
  doc.text(`Time: ${selectedTime}`, 20, yPos);
  yPos += 15;

  // Divider
  doc.setDrawColor(19, 147, 196);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Service Details
  doc.setFontSize(16);
  doc.setTextColor(19, 147, 196);
  doc.setFont(undefined, 'bold');
  doc.text("Service Details", 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(51, 51, 51);
  doc.text(`Service Type: Paint Polishing`, 20, yPos);
  yPos += 8;
  doc.text(`Vehicle Type: ${selectedVehicle?.name}`, 20, yPos);
  yPos += 8;
  doc.text(`Package: ${selectedPackage?.name}`, 20, yPos);
  yPos += 8;
  doc.text(`Duration: ${selectedPackage?.duration}`, 20, yPos);
  yPos += 15;

  // Divider
  doc.setDrawColor(19, 147, 196);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Cost Breakdown
  doc.setFontSize(16);
  doc.setTextColor(19, 147, 196);
  doc.setFont(undefined, 'bold');
  doc.text("Cost Breakdown", 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(51, 51, 51);
  doc.text(`${selectedPackage?.name}`, 20, yPos);
  doc.text(`$${selectedPackage?.price}.00 CAD`, 150, yPos);
  yPos += 8;

  // Add-ons
  selectedAddOns.forEach((addon) => {
    doc.text(`+ ${addon.name}`, 20, yPos);
    doc.text(`$${addon.price}.00 CAD`, 150, yPos);
    yPos += 8;
  });

  yPos += 5;
  doc.setDrawColor(19, 147, 196);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Total
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(19, 147, 196);
  doc.text("Total Cost:", 20, yPos);
  doc.text(`$${getTotalPrice()}.00 CAD`, 150, yPos);
  yPos += 20;

  // Divider
  doc.setDrawColor(19, 147, 196);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Important Notes
  doc.setFontSize(14);
  doc.setTextColor(19, 147, 196);
  doc.setFont(undefined, 'bold');
  doc.text("Important Notes:", 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(51, 51, 51);
  doc.text("• We will confirm your appointment within 24 hours", 20, yPos);
  yPos += 6;
  doc.text("• Please arrive on time for your scheduled appointment", 20, yPos);
  yPos += 6;
  doc.text("• For afternoon appointments, vehicle pickup may be the next day", 20, yPos);
  yPos += 6;
  doc.text("• Contact us if you need to reschedule or cancel", 20, yPos);
  yPos += 6;
  doc.text("• Email: actioncardetailing@gmail.com", 20, yPos);
  yPos += 15;

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, yPos);

  // Save the PDF
  doc.save(`Action-Car-Detailing-Paint-Polishing-${bookingId}.pdf`);
};

const PaintPolishingForm = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddOnPopup, setShowAddOnPopup] = useState(false);
  const [lastSelectedAddOn, setLastSelectedAddOn] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockedDates, setBlockedDates] = useState({});
  const [loadingBlockedDates, setLoadingBlockedDates] = useState(true);
  const [bookingData, setBookingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicleMake: '',
    message: ''
  });

  // Load blocked dates from Firebase
  useEffect(() => {
    const loadBlockedDates = async () => {
      try {
        setLoadingBlockedDates(true);
        const q = query(collection(db, 'blockedDates'));
        const querySnapshot = await getDocs(q);
        const dates = {};
        querySnapshot.forEach((doc) => {
          dates[doc.id] = doc.data();
        });
        setBlockedDates(dates);
      } catch (error) {
        console.error('Error loading blocked dates:', error);
      } finally {
        setLoadingBlockedDates(false);
      }
    };

    loadBlockedDates();
  }, []);

  // Check if a specific date is blocked
  const isDateBlocked = (day) => {
    if (!day) return false;

    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;
    
    if (blockedDates && blockedDates[dateString]) {
      const blockedInfo = blockedDates[dateString];
      
      if (blockedInfo.isAutoSunday) {
        return true;
      }
      
      if (blockedInfo.type === 'full') {
        return true;
      }
      
      if (blockedInfo.isAutoSaturday) {
        return false; // Saturdays are NOT blocked
      }
    }
    
    const dateObj = new Date(`${year}-${month}-${dayStr}T00:00:00`);
    const dayOfWeek = dateObj.getDay();
    
    if (dayOfWeek === 0) {
      return true;
    }
    
    return false;
  };

  // Check if a specific time slot is blocked
  const isTimeSlotBlocked = (time) => {
    if (!selectedDate || loadingBlockedDates) {
      return false;
    }

    const dateParts = selectedDate.split(' ');
    const monthName = dateParts[0];
    const day = parseInt(dateParts[1].replace(',', ''));
    const year = parseInt(dateParts[2]);

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = months.indexOf(monthName);

    const selectedDateObj = new Date(year, monthIndex, day);
    const dayOfWeek = selectedDateObj.getDay();
    
    const dateString = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const blockedDateInfo = blockedDates[dateString];
    
    if (blockedDateInfo) {
      if (blockedDateInfo.isAutoSunday) {
        return true;
      }
      
      if (blockedDateInfo.isAutoSaturday) {
        if (blockedDateInfo.blockedTill) {
          return time >= blockedDateInfo.blockedTill;
        } else {
          return time >= '12:00';
        }
      }
      
      if (blockedDateInfo.type === 'full') {
        return true;
      }
      
      if (blockedDateInfo.type === 'saturday-partial') {
        return time >= blockedDateInfo.blockedTill;
      }
      
      if (blockedDateInfo.blockedTill) {
        return time < blockedDateInfo.blockedTill;
      }
      
      return true;
    }
    
    const dateObj = new Date(year, monthIndex, day);
    const dayOfWeekFromDate = dateObj.getDay();
    
    if (dayOfWeekFromDate === 0) {
      return true;
    }
    
    if (dayOfWeekFromDate === 6) {
      return time >= '12:00';
    }
    
    return false;
  };

  const vehicleTypes = [
    { id: 'coupe', name: 'Coupe (2 doors)', icon: Car },
    { id: 'sedan', name: 'Sedan (4 doors)', icon: Car },
    { id: 'compact-suv', name: 'Compact Small SUV', icon: Truck },
    { id: 'large-suv', name: 'Large SUV/Van/Truck', icon: Truck }
  ];

  const getPackagePricing = (vehicleId) => {
    const pricingMap = {
      'coupe': { oneStage: 200, twoStage: 380, threeStage: 560, fourStage: 740 },
      'sedan': { oneStage: 230, twoStage: 440, threeStage: 650, fourStage: 860 },
      'compact-suv': { oneStage: 230, twoStage: 440, threeStage: 650, fourStage: 860 },
      'large-suv': { oneStage: 250, twoStage: 480, threeStage: 710, fourStage: 940 }
    };
    return pricingMap[vehicleId] || pricingMap['coupe'];
  };

  const getWashPackages = () => {
    const pricing = selectedVehicle ? getPackagePricing(selectedVehicle.id) : getPackagePricing('coupe');
    
    return [
      {
        id: 'one-stage',
        name: 'One Stage Paint Correction Polish',
        duration: '3 Hours',
        price: pricing.oneStage,
        description: 'Paint correction (One stage) (3 Hours)'
      },
      {
        id: 'two-stage',
        name: 'Two Stage Paint Correction Polish',
        duration: '5 Hours',
        price: pricing.twoStage,
        description: 'Paint correction (Two stage) (5 Hours)'
      },
      {
        id: 'three-stage',
        name: 'Three Stage Paint Correction Polish',
        duration: '7 Hours',
        price: pricing.threeStage,
        description: 'Paint correction (Three stage) (7 Hours)'
      },
      {
        id: 'four-stage',
        name: 'Four Stage Paint Correction Polish',
        duration: '8-12 Hours',
        price: pricing.fourStage,
        description: 'Paint correction (Four stage) (8-12 Hours)'
      }
    ];
  };

  const addOnOptions = [
    { id: 'wax', name: 'WAX', price: 40, duration: '0min' },
    { id: 'paint-sealant', name: 'Paint Sealant Wax', price: 50, duration: '0min' }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

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

  const getTotalPrice = () => {
    const packagePrice = selectedPackage ? selectedPackage.price : 0;
    const addOnPrice = selectedAddOns.reduce((total, addon) => total + addon.price, 0);
    return packagePrice + addOnPrice;
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedPackage(null);
    
    setTimeout(() => {
      const packagesSection = document.getElementById('packages-section');
      if (packagesSection) {
        packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    
    setTimeout(() => {
      const addonsSection = document.getElementById('addons-section');
      if (addonsSection) {
        addonsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const handleAddOnToggle = (addon) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(item => item.id === addon.id);
      if (exists) {
        return prev.filter(item => item.id !== addon.id);
      } else {
        const newAddOns = [...prev, addon];
        setLastSelectedAddOn(addon);
        setShowAddOnPopup(true);
        return newAddOns;
      }
    });
  };

  const handleAddOnPopupResponse = (wantMore) => {
    setShowAddOnPopup(false);
    document.body.style.overflow = 'auto';

    if (!wantMore) {
      setTimeout(() => {
        const dateSection = document.getElementById('date-section');
        if (dateSection) {
          dateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  useEffect(() => {
    if (showAddOnPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddOnPopup]);

  const handleDateSelect = (day) => {
    if (day && !isPastDate(day) && !isDateBlocked(day)) {
      const selected = `${months[currentMonth.getMonth()]} ${day}, ${currentMonth.getFullYear()}`;
      setSelectedDate(selected);
      setSelectedTime('');
      
      setTimeout(() => {
        const timeSlots = document.querySelector('.grid.grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-4.lg\\:grid-cols-6');
        if (timeSlots) {
          timeSlots.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  const handleTimeSelect = (time) => {
    if (!isTimeSlotBlocked(time)) {
      setSelectedTime(time);
      
      if (selectedDate && time) {
        setTimeout(() => {
          const summarySection = document.getElementById('summary-section');
          if (summarySection) {
            summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateBookingId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'PP';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const isFormValid = () => {
    return selectedVehicle && selectedPackage && selectedDate && selectedTime && 
           bookingData.firstName && bookingData.lastName && bookingData.email && 
           bookingData.phone && bookingData.vehicleMake;
  };

  const generateAndDownloadPDF = async (bookingId) => {
    setIsGeneratingPDF(true);
    try {
      await generatePDF(bookingData, selectedVehicle, selectedPackage, selectedAddOns, selectedDate, selectedTime, bookingId, getTotalPrice);
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const sendEmail = async (bookingId) => {
    const emailFormData = new FormData();
    
    emailFormData.append('access_key', 'ba99ae3b-60cc-404c-b207-2a42e86aafb6');
    emailFormData.append('autoresponse', 'false');
    emailFormData.append('subject', `Paint Polishing Booking Received – Confirmation Pending`);
    emailFormData.append('from_name', 'Action Car Detailing');
    emailFormData.append('email', bookingData.email);
    emailFormData.append('reply_to', 'actioncardetailing@gmail.com');

    const costBreakdown = `
Package Cost:
• ${selectedPackage.name}: $${selectedPackage.price}.00 CAD

${selectedAddOns.length > 0 ? `
Additional Services:
${selectedAddOns.map(addon => `• ${addon.name}: $${addon.price}.00 CAD`).join('\n')}
` : 'Additional Services: None'}

Total Cost: $${getTotalPrice()}.00 CAD
    `;

    emailFormData.append('message', `
✅ ACTION CAR DETAILING – AUTOMATED BOOKING CONFIRMATION EMAIL

Subject: Paint Polishing Booking Received – Confirmation Pending

Dear ${bookingData.firstName} ${bookingData.lastName},

Thank you for choosing Action Car Detailing for your paint polishing service!

We have successfully received your booking request. Our team will review your appointment and get back to you within 24 hours with a confirmation.

BOOKING SUMMARY

Booking ID: ${bookingId}
Status: Pending Confirmation

CUSTOMER INFORMATION

Name: ${bookingData.firstName} ${bookingData.lastName}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Vehicle Make/Model: ${bookingData.vehicleMake}

SERVICE DETAILS

Service Type: Paint Polishing
Vehicle Type: ${selectedVehicle.name}
Package Selected: ${selectedPackage.name}
Duration: ${selectedPackage.duration}

Appointment Date: ${selectedDate}
Appointment Time: ${selectedTime}

COST BREAKDOWN

${costBreakdown}

IMPORTANT INFORMATION

• Appointment will be confirmed within 24 hours
• Please arrive on time for your scheduled slot
• Vehicle pickup may be next day for afternoon bookings
• Kindly contact us in case of rescheduling or cancellation
• Save this email for future reference

CONTACT DETAILS

Email: actioncardetailing@gmail.com
Phone: (204) 775-0005
Booking Reference: ${bookingId}

We look forward to making your car look brand new again.

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const bookingId = generateBookingId();

    try {
      await generateAndDownloadPDF(bookingId);
      const emailResult = await sendEmail(bookingId);

      if (emailResult.success) {
        alert(`Booking submitted successfully!\n\nYour booking ID is: ${bookingId}\n\nConfirmation email has been sent and PDF has been downloaded.\n\nWe will confirm your appointment within 24 hours.`);
        
        setSelectedVehicle(null);
        setSelectedPackage(null);
        setSelectedAddOns([]);
        setSelectedDate('');
        setSelectedTime('');
        setBookingData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          vehicleMake: '',
          message: ''
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('There was an error submitting your booking. Please try again or contact us directly at actioncardetailing@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const washPackages = getWashPackages();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1393c4] mb-4">Paint Polishing Service Booking</h1>
          <p className="text-gray-600 text-lg">Complete your paint polishing service booking below</p>
        </div>

        {/* Vehicle Type Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-4">1. VEHICLE TYPE</h2>
            <p className="text-[#1393c4]">Select your vehicle type below.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {vehicleTypes.map((vehicle) => {
              const IconComponent = vehicle.icon;
              const isSelected = selectedVehicle?.id === vehicle.id;
              return (
                <div
                  key={vehicle.id}
                  className={`p-4 sm:p-6 md:p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    isSelected
                      ? 'border-[#1393c4] bg-blue-50 text-[#1393c4]'
                      : 'border-[#1393c4] hover:border-[#0d7aa1] text-[#1393c4] hover:bg-blue-50'
                  }`}
                >
                  <div className="text-center">
                    <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 text-[#1393c4]" />
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-tight">{vehicle.name}</h3>
                    {isSelected && (
                      <div className="mb-2 sm:mb-3">
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#1393c4] mx-auto" />
                      </div>
                    )}
                    <button
                      onClick={() => handleVehicleSelect(vehicle)}
                      className="w-full px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 bg-[#1393c4] hover:bg-[#0d7aa1] text-white shadow-md hover:shadow-lg"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Packages Section */}
        <div id="packages-section" className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-4">2. PAINT POLISHING PACKAGES</h2>
            <p className="text-[#1393c4]">Which paint polishing service is best for your vehicle?</p>
            {!selectedVehicle && (
              <p className="text-[#1393c4]text-sm mt-2">Please select a vehicle type above first</p>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {washPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => selectedVehicle && handlePackageSelect(pkg)}
                className={`bg-white rounded-xl border-2 p-4 sm:p-6 transition-all duration-300 transform ${
                  !selectedVehicle 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-lg sm:hover:shadow-xl cursor-pointer hover:scale-105'
                } ${
                  selectedPackage?.id === pkg.id 
                    ? 'border-[#1393c4] bg-blue-50' 
                    : 'border-gray-200 hover:border-[#1393c4]'
                }`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1393c4] mb-2">{pkg.name}</h3>
                  <div className="text-sm text-[#1393c4] mb-2">({pkg.duration})</div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-2">
                    <span>{pkg.price}</span><span className="text-base sm:text-lg">.00 CAD</span>
                  </div>
                  {selectedPackage?.id === pkg.id && selectedVehicle && (
                    <div className="animate-bounce">
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#1393c4] mx-auto" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-[#1393c4]">{pkg.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add-on Confirmation Modal */}
        {showAddOnPopup && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={() => handleAddOnPopupResponse(false)}
              ></div>
              <div className="relative transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left shadow-xl transition-all w-full max-w-md">
                <div className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1393c4] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1393c4] mb-4">Add-on Added!</h3>
                  <p className="text-[#1393c4] mb-2 font-semibold text-sm sm:text-base">
                    {lastSelectedAddOn?.name}
                  </p>
                  <p className="text-[#1393c4] mb-4 sm:mb-6 text-sm sm:text-base">
                    has been added to your booking.
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-[#1393c4] mb-6 sm:mb-8">
                    Would you like to add more add-ons?
                  </p>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                    <button
                      onClick={() => handleAddOnPopupResponse(true)}
                      className="flex-1 bg-[#1393c4] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold hover:bg-[#0d7aa1] transition-colors duration-300 text-sm sm:text-base"
                    >
                      Yes, Add More
                    </button>
                    <button
                      onClick={() => handleAddOnPopupResponse(false)}
                      className="flex-1 border-2 border-[#1393c4] text-[#1393c4] py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold hover:bg-[#1393c4] hover:text-white transition-colors duration-300 text-sm sm:text-base"
                    >
                      No, Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add-ons Section */}
        {selectedPackage && (
          <div id="addons-section" className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-4">3. ADD-ON OPTIONS</h2>
              <p className="text-[#1393c4]">Add services to your package (optional).</p>
              {selectedAddOns.length > 0 && (
                <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <p className="text-[#1393c4] font-semibold mb-2 text-sm sm:text-base">Selected Add-ons ({selectedAddOns.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAddOns.map((addon) => (
                      <span
                        key={addon.id}
                        className="inline-flex items-center bg-[#1393c4] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        {addon.name}
                        <button
                          onClick={() => handleAddOnToggle(addon)}
                          className="ml-1 sm:ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 sm:p-1"
                        >
                          <X className="w-2 h-2 sm:w-3 sm:h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3 sm:space-y-4">
              {addOnOptions.map((addon) => (
                <div
                  key={addon.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-[#1393c4] transition-colors duration-300"
                >
                  <div className="flex-1 mb-3 sm:mb-0">
                    <h3 className="font-semibold text-[#1393c4] text-base sm:text-lg mb-1">{addon.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-[#1393c4]">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {addon.duration}
                      </span>
                      <span className="font-semibold text-[#1393c4]">
                        {addon.price}.00 CAD
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddOnToggle(addon)}
                    className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-colors duration-300 whitespace-nowrap text-sm sm:text-base ${
                      selectedAddOns.find(item => item.id === addon.id)
                        ? 'bg-[#1393c4] text-white'
                        : 'border-2 border-[#1393c4] text-[#1393c4] hover:bg-[#1393c4] hover:text-white'
                    }`}
                  >
                    {selectedAddOns.find(item => item.id === addon.id) ? 'Added' : 'Add'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date and Time Section */}
        <div id="date-section" className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-4">
              {selectedPackage ? '4' : '3'}. SELECT DATE AND TIME
            </h2>
            <p className="text-[#1393c4]">Choose your preferred date and time.</p>
            {!selectedPackage && (
              <p className="text-[#1393c4] text-sm mt-2">Please select a package first</p>
            )}
          </div>

          <div className={`bg-gray-50 rounded-xl border-2 border-gray-200 p-4 sm:p-6 max-w-4xl mx-auto ${!selectedPackage ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="text-xl sm:text-2xl font-semibold text-[#1393c4]">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => selectedPackage && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  disabled={!selectedPackage}
                  className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg text-[#1393c4] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => selectedPackage && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  disabled={!selectedPackage}
                  className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg text-[#1393c4] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-xs sm:text-sm font-medium text-[#1393c4] py-2 bg-gray-100 rounded">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6 sm:mb-8">
              {getDaysInMonth(currentMonth).map((day, index) => {
                const isSelected = selectedDate === `${months[currentMonth.getMonth()]} ${day}, ${currentMonth.getFullYear()}`;
                const isBlocked = isDateBlocked(day);
                const isPast = isPastDate(day);
                
                return (
                  <button
                    key={index}
                    onClick={() => day && selectedPackage && handleDateSelect(day)}
                    disabled={!day || isPast || isBlocked || !selectedPackage}
                    className={`h-8 sm:h-10 md:h-12 w-full rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                      !day
                        ? 'cursor-default'
                        : !selectedPackage || isPast || isBlocked
                        ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                        : isSelected
                        ? 'bg-[#1393c4] text-white font-bold'
                        : isToday(day)
                        ? 'bg-blue-100 text-[#1393c4] border border-[#1393c4]'
                        : 'hover:bg-blue-50 text-[#1393c4] border border-gray-200 hover:border-[#1393c4]'
                    } ${isBlocked && day ? 'line-through' : ''}`}
                    title={isBlocked ? 'This date is blocked' : ''}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {selectedDate && selectedPackage && (
              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <div className="text-center mb-4">
                  <p className="text-[#1393c4] font-semibold text-base sm:text-lg">Selected: {selectedDate}</p>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#1393c4] mb-4 text-center">Available Times</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                  {timeSlots.map(time => {
                    const isBlocked = isTimeSlotBlocked(time);
                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        disabled={isBlocked}
                        className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-lg border-2 transition-colors duration-200 ${
                          isBlocked
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                            : selectedTime === time
                            ? 'bg-[#1393c4] text-white border-[#1393c4]'
                            : 'bg-white text-[#1393c4] border-[#1393c4] hover:bg-blue-50'
                        }`}
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

        {/* Booking Summary Section */}
        {selectedDate && selectedTime && selectedPackage && (
          <div id="summary-section" className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-[#1393c4] mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-2">5. BOOKING SUMMARY</h2>
              <p className="text-[#1393c4]">Review your booking details</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                <div className="flex items-start gap-3 mb-4">
                  <Car className="w-5 h-5 sm:w-6 sm:h-6 text-[#1393c4] mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1393c4] text-lg mb-2">Vehicle & Package</h3>
                    <div className="space-y-2 text-[#1393c4]">
                      <p><span className="font-medium">Vehicle Type:</span> {selectedVehicle.name}</p>
                      <p><span className="font-medium">Package:</span> {selectedPackage.name}</p>
                      <p><span className="font-medium">Duration:</span> {selectedPackage.duration}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                <div className="flex items-start gap-3 mb-4">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#1393c4] mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1393c4] text-lg mb-2">Appointment Details</h3>
                    <div className="space-y-2 text-[#1393c4]">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-medium">Date:</span> {selectedDate}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-medium">Time:</span> {selectedTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedAddOns.length > 0 && (
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                  <div className="flex items-start gap-3 mb-4">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#1393c4] mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1393c4] text-lg mb-2">Additional Services ({selectedAddOns.length})</h3>
                      <div className="space-y-2">
                        {selectedAddOns.map((addon) => (
                          <div key={addon.id} className="flex justify-between items-center text-[#1393c4] border-b border-gray-100 pb-2">
                            <span className="text-sm">{addon.name}</span>
                            <span className="font-medium text-sm">{addon.price}.00 CAD</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md border-2 border-[#1393c4]">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#1393c4] mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1393c4] text-lg mb-4">Cost Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[#1393c4] pb-2">
                        <span>{selectedPackage.name}</span>
                        <span className="font-medium">{selectedPackage.price}.00 CAD</span>
                      </div>
                      
                      {selectedAddOns.length > 0 && (
                        <>
                          {selectedAddOns.map((addon) => (
                            <div key={addon.id} className="flex justify-between items-center text-[#1393c4] text-sm pb-2">
                              <span className="text-gray-600">+ {addon.name}</span>
                              <span className="font-medium">{addon.price}.00 CAD</span>
                            </div>
                          ))}
                        </>
                      )}
                      
                      <div className="border-t-2 border-[#1393c4] pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg sm:text-xl font-bold text-[#1393c4]">Total Cost:</span>
                          <span className="text-xl sm:text-2xl font-bold text-[#1393c4]">
                            {getTotalPrice()}.00 CAD
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information Section */}
        <form onSubmit={handleSubmit}>
          <div id="contact-section" className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-4">
                {selectedDate && selectedTime ? '6' : (selectedPackage ? '5' : '4')}. CONTACT INFORMATION
              </h2>
              <p className="text-[#1393c4]">Please provide your contact details.</p>
              {(!selectedDate || !selectedTime) && (
                <p className="text-[#1393c4] text-sm mt-2">Please select date and time first</p>
              )}
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 ${(!selectedDate || !selectedTime) ? 'opacity-50' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-[#1393c4] mb-2">First name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={bookingData.firstName}
                  onChange={handleInputChange}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1393c4] mb-2">Last name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={bookingData.lastName}
                  onChange={handleInputChange}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1393c4] mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleInputChange}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1393c4] mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleInputChange}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1393c4] mb-2">Vehicle Make and Model *</label>
                <input
                  type="text"
                  name="vehicleMake"
                  value={bookingData.vehicleMake}
                  onChange={handleInputChange}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1393c4] mb-2">Message</label>
                <textarea
                  name="message"
                  value={bookingData.message}
                  onChange={handleInputChange}
                  disabled={!selectedDate || !selectedTime}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-sm text-[#1393c4] mb-4 leading-relaxed">
              We will confirm your appointment within 24 hours.
            </p>
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting || isGeneratingPDF}
              className={`px-8 sm:px-12 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                isFormValid() && !isSubmitting && !isGeneratingPDF
                  ? 'bg-[#1393c4] hover:bg-[#0d7aa1] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : isGeneratingPDF ? 'Generating PDF...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaintPolishingForm;