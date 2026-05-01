'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Check, Car, Truck, X, Calendar, DollarSign, Package } from 'lucide-react';
import jsPDF from 'jspdf';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Booking = ({ isModal = false, blockedDates = [] }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [priceAnimation, setPriceAnimation] = useState(false);
  const [showAllAddOns, setShowAllAddOns] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [lastSelectedAddOn, setLastSelectedAddOn] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [blockedDatesData, setBlockedDatesData] = useState({});
  const [loadingBlockedDates, setLoadingBlockedDates] = useState(true);
  const [bookingData, setBookingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicleMake: '',
    message: ''
  });

  useEffect(() => {
    const loadBlockedDatesData = async () => {
      try {
        setLoadingBlockedDates(true);
        const q = collection(db, 'blockedDates');
        const querySnapshot = await getDocs(q);
        const dates = {};
        querySnapshot.forEach((doc) => {
          dates[doc.id] = doc.data();
        });
        setBlockedDatesData(dates);
      } catch (error) {
        console.error('Error loading blocked dates:', error);
      } finally {
        setLoadingBlockedDates(false);
      }
    };
    loadBlockedDatesData();
  }, []);

  const isDateBlocked = (day) => {
    if (!day) return false;
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;
    if (blockedDatesData && blockedDatesData[dateString]) {
      const blockedInfo = blockedDatesData[dateString];
      if (blockedInfo.isAutoSunday) return true;
      if (blockedInfo.type === 'full') return true;
      if (blockedInfo.isAutoSaturday) return false;
    }
    if (Array.isArray(blockedDates) && blockedDates.includes(dateString)) {
      const dateObj = new Date(dateString);
      const dayOfWeek = dateObj.getDay();
      if (dayOfWeek === 0) return true;
      if (dayOfWeek === 6) return false;
      return true;
    }
    const dateObj = new Date(`${year}-${month}-${dayStr}T00:00:00`);
    const dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0) return true;
    return false;
  };

  const isTimeSlotBlocked = (time) => {
    if (!selectedDate || loadingBlockedDates) return false;
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
    const blockedDateInfo = blockedDatesData[dateString];
    if (blockedDateInfo) {
      if (blockedDateInfo.isAutoSunday) return true;
      if (blockedDateInfo.isAutoSaturday) {
        return time >= (blockedDateInfo.blockedTill || '12:00');
      }
      if (blockedDateInfo.type === 'full') return true;
      if (blockedDateInfo.type === 'saturday-partial') return time >= blockedDateInfo.blockedTill;
      if (blockedDateInfo.blockedTill) return time < blockedDateInfo.blockedTill;
      return true;
    }
    const isDateInBlockedArray = Array.isArray(blockedDates) && blockedDates.includes(dateString);
    if (isDateInBlockedArray) {
      if (dayOfWeek === 0) return true;
      if (dayOfWeek === 6) return time >= '12:00';
      return true;
    }
    if (dayOfWeek === 0) return true;
    if (dayOfWeek === 6) return time >= '12:00';
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
      'coupe': { silver: 180, gold: 250, diamond: 390 },
      'sedan': { silver: 199, gold: 270, diamond: 420 },
      'compact-suv': { silver: 199, gold: 270, diamond: 420 },
      'large-suv': { silver: 215, gold: 290, diamond: 450 }
    };
    return pricingMap[vehicleId] || pricingMap['coupe'];
  };

  const getWashPackages = () => {
    const pricing = selectedVehicle ? getPackagePricing(selectedVehicle.id) : getPackagePricing('coupe');
    return [
      {
        id: 'silver',
        name: 'Silver Package',
        duration: '5-6 Hours',
        price: pricing.silver,
        features: [
          'Interior Vacuum, Carpet and Seats Shampoo',
          'Interior panels Steam Clean & Polish',
          'Exterior Hand Wash',
          'Door jambs Wipe Down',
          'Windows Clean',
          'Trunk Vacuum',
          'Extra Charge for Pet Hairs Removal and Heavily soiled vehicles'
        ]
      },
      {
        id: 'gold',
        name: 'Gold Package',
        duration: '6-7 Hours',
        price: pricing.gold,
        features: [
          'Silver package plus Engine Shampoo',
          'Hand Carnauba Wax',
          'Trunk Shampoo',
          'Complete interior and exterior detailing package',
          'Extra Charge for Pet Hairs Removal and Heavily soiled vehicles'
        ]
      },
      {
        id: 'diamond',
        name: 'Diamond Package',
        duration: '7-8 Hours',
        price: pricing.diamond,
        features: [
          'Gold package plus Paint Decontamination wash',
          'Paint Clay bar treatment',
          'Tar removal',
          'Paint correction polish (One stage)',
          'Extra Charge for Pet Hairs Removal, excessive tar removal and heavily soiled vehicles'
        ]
      }
    ];
  };

  const addOnOptions = [
    { id: 'pet-removal', name: 'Pet hairs removal', price: 0, duration: '30min', description: 'As per estimate' },
    { id: 'headliner-shampoo', name: 'Headliner shampoo (1 Hour)', price: 30, duration: '60min', description: 'Complete cleaning of headliners.' },
    { id: 'carnauba-wax', name: 'Carnauba wax (4 months protection) (30 min)', price: 40, duration: '30min', description: 'The carnauba wax repels water and, consequently, most contaminants. When applied to paint surface, carnauba retains these characteristics. Therefore, an application of a carnauba-based car wax to your vehicle will protect it from UV rays, heat, moisture, oxidation, and environmental contamination.' },
    { id: 'engine-shampoo', name: 'Engine shampoo (40 min)', price: 60, duration: '40min', description: 'Engine Degreased, rinsed, steam cleaned and dressed.' },
    { id: 'headlight', name: 'Headlights Restoration (30 min)', price: 80, duration: '30min', description: 'Headlight restoration removes dull, yellowed headlight build up. We clean and restore your headlights with our dry sanding, wet sanding, polishing techniques for maximum visibility. We seal the headlight for long lasting protection.' },
    { id: 'odor', name: 'Odor Elimination and sanitization (180 min)', price: 80, duration: '180min', description: 'We use Ozone treatment for Odour elimination. Ozone treatment is the use of the ozone (O3) to remove odour, bacteria and viruses. Ozone treatment is the best method for removing stubborn odour.' },
    { id: 'paint-sealant', name: 'Paint sealant (6 months protection) (40 min)', price: 50, duration: '40min', description: 'Paint sealant is a fully synthetic product designed to protect paint surfaces while providing a mirror-like shine. A sealant is chemically engineered to bond to the surface, it will last longer than traditional wax while providing protection against paint-killer like sap, acid rain and UV rays.' },
    { id: 'paint-decontamination', name: 'Paint Decontamination (20 minutes)', price: 30, duration: '20min', description: 'Removing iron deposits and road dust' },
    { id: 'fabric', name: 'Fabric protector (carpet and seats) (40 min)', price: 80, duration: '40min', description: '3M scotchgard coating protects fibers and prevents stains from penetrating into fabric. Fabric protector repels oil, water and alcohol. Fabric protector bonds to individual fibers and forms a barrier against all contaminants. 3M Scotchgard fabric protection is a long-lasting stain resistant coating which will protect your interior detailing job for months.' },
    { id: 'decontamination', name: 'Decontamination Wash (30 min)', price: 30, duration: '30min', description: 'Deep cleaning wash to remove contaminants and prepare the vehicle surface.' },
    { id: 'paint-correction-1', name: 'Paint correction (One stage) (2 Hours)', price: 150, duration: '2hr', description: 'This service is designed for vehicles that are looking for paint refinement rather than paint perfection. A vehicle that is in great shape already and only requires one stage polishing step to remove minor wash marks and light swirls Or for the customer who wants to enhance the gloss of their paint work, but less concerned with getting every scratch and swirl removed. One stage enhancement polish is a great cost-effective alternative to multi stage correction. We can usually remove 50% of swirls, and light defects. There are different variables that can dictate just how much correction you can safely achieve in a One stage correction process.' },
    { id: 'paint-correction-2', name: 'Paint correction (Two stage) (60 min)', price: 300, duration: '60min', description: 'This process involve light compounding machine polishing steps to remove the worst defects, swirl marks, oxidation, and then followed by a polishing stage to refine the finish and improve the gloss and clarity. The paint type and condition also dictate the level of correction, but typically this service will get rid of 60%-70% of all defects' },
    { id: 'paint-correction-3', name: 'Paint correction (Three stage) (120 min)', price: 450, duration: '120min', description: 'This process involve medium and light compounding machine polishing steps to remove the worst defects, swirl marks, oxidation, and then followed by a polishing stage to refine the finish and improve the gloss and clarity. The paint type and condition also dictate the level of correction, but typically this service will get rid of 70%-80% of all defects' },
    { id: 'paint-correction-4', name: 'Paint correction (Four stage) (240 min)', price: 600, duration: '240min', description: 'With multi stage paint correction, you\'re significantly improving the finish by removing all of the swirls, and all but the heaviest of scratches and defects. Depend on the condition of the paint we may have to wet-sand to remove deep scratches and orange peel. This process involve 3 or more heavy compounding machine polishing steps to remove the worst defects, swirl marks, oxidation, and then followed by a polishing stage to refine the finish and improve the gloss and clarity. The paint type and condition also dictate the level of correction, but typically this service will get rid of 80-90% of all defects.' }
  ];

  const getAvailableAddOns = () => {
    if (!selectedPackage) return [];
    const silverPackageAddOns = ['pet-removal', 'headliner-shampoo', 'carnauba-wax', 'engine-shampoo', 'headlight', 'odor', 'paint-sealant', 'paint-decontamination', 'fabric', 'decontamination', 'paint-correction-1', 'paint-correction-2', 'paint-correction-3'];
    const goldPackageAddOns = ['pet-removal', 'headlight', 'odor', 'fabric', 'decontamination', 'paint-correction-1', 'paint-correction-2', 'paint-correction-3', 'paint-correction-4'];
    const diamondPackageAddOns = ['pet-removal', 'headlight', 'odor', 'fabric', 'paint-correction-2', 'paint-correction-3', 'paint-correction-4'];
    if (selectedPackage.name === 'Silver Package') return addOnOptions.filter(addon => silverPackageAddOns.includes(addon.id));
    if (selectedPackage.name === 'Gold Package') return addOnOptions.filter(addon => goldPackageAddOns.includes(addon.id));
    if (selectedPackage.name === 'Diamond Package') return addOnOptions.filter(addon => diamondPackageAddOns.includes(addon.id));
    return addOnOptions;
  };

  const availableAddOns = getAvailableAddOns();
  const basicAddOns = availableAddOns.filter(addon => !addon.id.includes('paint-correction'));
  const advancedAddOns = availableAddOns.filter(addon => addon.id.includes('paint-correction'));
  const displayedAddOns = showAllAddOns ? availableAddOns : basicAddOns;

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();
  };

  const isPastDate = (day) => {
    if (!day) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return checkDate < today;
  };

  const calculateTotalCost = () => {
    let total = 0;
    if (selectedPackage) total += selectedPackage.price;
    selectedAddOns.forEach(addon => { total += addon.price; });
    return total;
  };

  const generateBookingId = () => {
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `ACD-DET-REF${randomNum}`;
  };

  const downloadPDF = (bookingId) => {
    const doc = new jsPDF();
    const blue = [19, 147, 196];
    const dark = [51, 51, 51];
    const total = calculateTotalCost();
    let y = 20;

    const drawLine = () => {
      doc.setDrawColor(...blue);
      doc.line(20, y, 190, y);
      y += 6;
    };

    const addText = (text, x, fontSize = 11, bold = false, color = dark) => {
      doc.setFontSize(fontSize)
         .setTextColor(...color)
         .setFont('helvetica', bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, x, y);
      y += 6 * lines.length;
    };

    doc.setFontSize(22).setTextColor(...blue).setFont('helvetica', 'bold');
    doc.text('Action Car Detailing', 105, y, { align: 'center' });
    y += 9;
    doc.setFontSize(13).setTextColor(...dark).setFont('helvetica', 'normal');
    doc.text(`Booking Confirmation: ${bookingId}`, 105, y, { align: 'center' });
    y += 10;

    drawLine();
    addText('Customer Information', 20, 14, true, blue);
    addText(`Name: ${bookingData.firstName} ${bookingData.lastName}`, 20);
    addText(`Email: ${bookingData.email}`, 20);
    addText(`Phone: ${bookingData.phone}`, 20);
    addText(`Vehicle: ${bookingData.vehicleMake}`, 20);
    y += 2;

    drawLine();
    addText('Appointment Details', 20, 14, true, blue);
    addText(`Date: ${selectedDate}`, 20);
    addText(`Time: ${selectedTime}`, 20);
    y += 2;

    drawLine();
    addText('Service Details', 20, 14, true, blue);
    addText(`Vehicle Type: ${selectedVehicle?.name}`, 20);
    addText(`Package: ${selectedPackage?.name}`, 20);
    addText(`Duration: ${selectedPackage?.duration}`, 20);
    y += 2;

    drawLine();
    addText('Cost Breakdown', 20, 14, true, blue);
    doc.setFontSize(11).setTextColor(...dark).setFont('helvetica', 'normal');
    doc.text(`${selectedPackage?.name}`, 20, y);
    doc.text(`$${selectedPackage?.price}.00 CAD`, 190, y, { align: 'right' });
    y += 6;

    selectedAddOns.forEach(addon => {
      doc.setFontSize(11).setTextColor(...dark).setFont('helvetica', 'normal');
      doc.text(`+ ${addon.name}`, 20, y);
      doc.text(`$${addon.price}.00 CAD`, 190, y, { align: 'right' });
      y += 6;
    });

    y += 2;
    drawLine();
    doc.setFontSize(14).setTextColor(...blue).setFont('helvetica', 'bold');
    doc.text('Total Cost:', 20, y);
    doc.text(`$${total}.00 CAD`, 190, y, { align: 'right' });
    y += 10;

    drawLine();
    addText('Important Notes:', 20, 12, true, blue);
    addText('• We will confirm your appointment within 24 hours', 20);
    addText('• Please arrive on time for your scheduled appointment', 20);
    addText('• For afternoon appointments, vehicle pickup may be the next day', 20);
    addText('• Contact us if you need to reschedule or cancel', 20);
    addText('• Email: actioncardetailing@gmail.com', 20);
    y += 4;

    doc.setFontSize(9).setTextColor(150, 150, 150).setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, y);
    doc.save(`booking-${bookingId}.pdf`);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedPackage(null);
    setPriceAnimation(true);
    setTimeout(() => setPriceAnimation(false), 600);
  };

  const handleBookNowClick = (vehicle) => {
    handleVehicleSelect(vehicle);
    if (!isModal) {
      setTimeout(() => {
        const packagesSection = document.getElementById('packages-section');
        if (packagesSection && !isScrolling) {
          setIsScrolling(true);
          packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          setTimeout(() => setIsScrolling(false), 1000);
        }
      }, 150);
    }
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setSelectedAddOns([]);
    if (isScrolling) return;
    if (!isModal) {
      setIsScrolling(true);
      setTimeout(() => {
        const addonsSection = document.getElementById('addons-section');
        if (addonsSection) {
          addonsSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
        setTimeout(() => setIsScrolling(false), 1000);
      }, 150);
    }
  };

  const handleAddOnToggle = (addon) => {
    const exists = selectedAddOns.find(item => item.id === addon.id);
    if (!exists) {
      setSelectedAddOns(prev => [...prev, addon]);
      setLastSelectedAddOn(addon);
      setShowConfirmationModal(true);
      document.body.style.overflow = 'hidden';
    } else {
      setSelectedAddOns(prev => prev.filter(item => item.id !== addon.id));
    }
  };

  const handleAddOnPopupResponse = (wantMore) => {
    setShowConfirmationModal(false);
    document.body.style.overflow = 'auto';
    if (!wantMore && !isModal && !isScrolling) {
      setIsScrolling(true);
      setTimeout(() => {
        const dateSection = document.getElementById('date-section');
        if (dateSection) {
          dateSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
        setTimeout(() => setIsScrolling(false), 1000);
      }, 150);
    }
  };

  const toggleDescription = (addonId) => {
    setExpandedDescriptions(prev => ({ ...prev, [addonId]: !prev[addonId] }));
  };

  const handleDateSelect = (day) => {
    if (day && !isPastDate(day) && !isDateBlocked(day)) {
      const selected = `${months[currentMonth.getMonth()]} ${day}, ${currentMonth.getFullYear()}`;
      setSelectedDate(selected);
      setSelectedTime('');
      if (!isModal && !isScrolling) {
        setIsScrolling(true);
        setTimeout(() => {
          const timeSlotsEl = document.querySelector('.grid.grid-cols-3.sm\\:grid-cols-4.md\\:grid-cols-6');
          if (timeSlotsEl) timeSlotsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => setIsScrolling(false), 1000);
        }, 300);
      }
    }
  };

  const handleTimeSelect = (time) => {
    if (!isTimeSlotBlocked(time)) {
      setSelectedTime(time);
      if (!isModal && selectedDate && time && !isScrolling) {
        setIsScrolling(true);
        setTimeout(() => {
          const summarySection = document.getElementById('summary-section');
          if (summarySection) summarySection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          setTimeout(() => setIsScrolling(false), 1000);
        }, 150);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return selectedVehicle && selectedPackage && selectedDate && selectedTime &&
      bookingData.firstName && bookingData.lastName && bookingData.email &&
      bookingData.phone && bookingData.vehicleMake;
  };

  const sendEmail = async (bookingId) => {
    const emailFormData = new FormData();
    emailFormData.append('access_key', 'ba99ae3b-60cc-404c-b207-2a42e86aafb6');
    emailFormData.append('autoresponse', 'false');
    emailFormData.append('subject', `Booking Received – Confirmation Pending`);
    emailFormData.append('from_name', 'Action Car Detailing');
    emailFormData.append('email', bookingData.email);
    emailFormData.append('reply_to', 'actioncardetailing@gmail.com');

    const costBreakdown = `
Package Cost:
- ${selectedPackage.name}: $${selectedPackage.price}.00 CAD

${selectedAddOns.length > 0 ? `Additional Services:\n${selectedAddOns.map(addon => `• ${addon.name}: $${addon.price}.00 CAD`).join('\n')}` : 'Additional Services: None'}

Total Cost: $${calculateTotalCost()}.00 CAD
    `;

    emailFormData.append('message', `
✅ ACTION CAR DETAILING – AUTOMATED BOOKING CONFIRMATION EMAIL

Subject: Booking Received – Confirmation Pending

Dear ${bookingData.firstName} ${bookingData.lastName},

Thank you for choosing Action Car Detailing!

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

Vehicle Type: ${selectedVehicle.name}
Package Selected: ${selectedPackage.name}
Duration: ${selectedPackage.duration}

Appointment Date: ${selectedDate}
Appointment Time: ${selectedTime}

COST BREAKDOWN

${costBreakdown}

IMPORTANT INFORMATION

- Appointment will be confirmed within 24 hours
- Please arrive on time for your scheduled slot
- Vehicle pickup may be next day for afternoon bookings
- Kindly contact us in case of rescheduling or cancellation
- Save this email for future reference

CONTACT DETAILS

Email: actioncardetailing@gmail.com
Phone: (204) 775-0005
Booking Reference: ${bookingId}

We look forward to making your car look brand new again.

Best regards,
Action Car Detailing Team
Passion for Detail
    `);

    const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: emailFormData });
    const data = await response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    const newBookingId = generateBookingId();
    try {
      const emailResult = await sendEmail(newBookingId);
      if (emailResult.success) {
        downloadPDF(newBookingId);
        alert(`Booking submitted successfully!\n\nYour booking ID is: ${newBookingId}\n\nConfirmation email has been sent and PDF has been downloaded.\n\nWe will confirm your appointment within 24 hours.`);
        setSelectedVehicle(null);
        setSelectedPackage(null);
        setSelectedAddOns([]);
        setSelectedDate('');
        setSelectedTime('');
        setBookingData({ firstName: '', lastName: '', email: '', phone: '', vehicleMake: '', message: '' });
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
  const containerClass = isModal ? "max-w-4xl mx-auto p-4" : "min-h-screen bg-gray-50 py-8 px-4";
  const innerContainerClass = isModal ? "" : "max-w-6xl mx-auto";

  return (
    <div className={containerClass}>
      <div className={innerContainerClass}>
        {!isModal && (
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1393c4' }}>Our Packages</h1>
            <div className="w-24 h-1 bg-gray-300 mx-auto mb-6"></div>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1393c4] mb-6">Pick your vehicle and Detailing Package</h2>
            <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-6" style={{ color: '#1393c4' }}>
              Please note for all the services <span style={{ color: '#1393c4' }} className="font-semibold">scheduled</span> later in the <span style={{ color: '#1393c4' }} className="font-semibold">afternoon</span>, <span style={{ color: '#1393c4' }} className="font-semibold">the vehicle pickup will be the next day.</span>
            </p>
          </div>
        )}

        {isModal && (
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#1393c4] mb-4">Book Your Service</h2>
            <p className="text-[#1393c4]">Choose your vehicle type and package</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-8">
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
                  className={`p-6 md:p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${isSelected ? 'border-[#1393c4] bg-blue-50 text-[#1393c4]' : 'border-[#1393c4] hover:border-[#0d7aa1] text-[#1393c4] hover:bg-blue-50'}`}
                >
                  <div className="text-center">
                    <IconComponent className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-[#1393c4]" />
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-4">{vehicle.name}</h3>
                    {isSelected && (
                      <div className="mb-3">
                        <Check className="w-6 h-6 text-[#1393c4] mx-auto" />
                      </div>
                    )}
                    <button
                      onClick={() => handleBookNowClick(vehicle)}
                      className="w-full px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 bg-[#1393c4] hover:bg-[#0d7aa1] text-white shadow-md hover:shadow-lg"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div id="packages-section" className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-4">2. WASH PACKAGES</h2>
            <p className="text-[#1393c4]">Which wash is best for your vehicle?</p>
            {!selectedVehicle && <p className="text-[#1393c4] text-sm mt-2">Please select a vehicle type above first</p>}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {washPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => selectedVehicle && handlePackageSelect(pkg)}
                className={`bg-white rounded-xl border-2 p-6 transition-all duration-300 transform ${!selectedVehicle ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl cursor-pointer hover:scale-105'} ${selectedPackage?.id === pkg.id ? 'border-[#1393c4] bg-blue-50' : 'border-gray-200 hover:border-[#1393c4]'}`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-[#1393c4] mb-2">{pkg.name} ({pkg.duration})</h3>
                  <div className={`text-3xl font-bold text-[#1393c4] mb-2 transition-all duration-500 ease-in-out ${priceAnimation ? 'transform scale-110 text-sky-400' : 'transform scale-100'}`}>
                    <span className="inline-block">{pkg.price}</span><span className="text-lg">.00 CAD</span>
                  </div>
                  {selectedPackage?.id === pkg.id && selectedVehicle && (
                    <div className="animate-bounce">
                      <Check className="w-6 h-6 text-[#1393c4] mx-auto" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <p key={index} className="text-sm text-[#1393c4] leading-relaxed">{feature}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showConfirmationModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => handleAddOnPopupResponse(false)}></div>
              <div className="relative transform overflow-hidden rounded-2xl bg-white p-8 text-left shadow-xl transition-all w-full max-w-md">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#1393c4] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1393c4] mb-4">Add-on Added!</h3>
                  <p className="text-[#1393c4] mb-2 font-semibold">{lastSelectedAddOn?.name}</p>
                  <p className="text-[#1393c4] mb-6">has been added to your booking.</p>
                  <p className="text-lg font-semibold text-[#1393c4] mb-8">Would you like to add more add-ons?</p>
                  <div className="flex space-x-4">
                    <button onClick={() => handleAddOnPopupResponse(true)} className="flex-1 bg-[#1393c4] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#0d7aa1] transition-colors duration-300">Yes, Add More</button>
                    <button onClick={() => handleAddOnPopupResponse(false)} className="flex-1 border-2 border-[#1393c4] text-[#1393c4] py-3 px-6 rounded-xl font-semibold hover:bg-[#1393c4] hover:text-white transition-colors duration-300">No, Continue</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedPackage && (
          <div id="addons-section" className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-4">3. ADD-ON OPTIONS</h2>
              <p className="text-[#1393c4]">Add services to your package (optional).</p>
              {selectedAddOns.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-[#1393c4] font-semibold mb-2">Selected Add-ons ({selectedAddOns.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAddOns.map((addon) => (
                      <span key={addon.id} className="inline-flex items-center bg-[#1393c4] text-white px-3 py-1 rounded-full text-sm">
                        {addon.name}
                        <button onClick={() => handleAddOnToggle(addon)} className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {displayedAddOns.map((addon) => (
                <div key={addon.id} className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#1393c4] transition-colors duration-300 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <h3 className="font-semibold text-[#1393c4] text-lg mb-1">{addon.name}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#1393c4] mb-2">
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{addon.duration}</span>
                        <span className="font-semibold text-[#1393c4]">{addon.price}.00 CAD</span>
                      </div>
                      {expandedDescriptions[addon.id] && <p className="text-sm text-gray-600 mt-2">{addon.description}</p>}
                      <button onClick={() => toggleDescription(addon.id)} className="text-sm text-[#1393c4] hover:underline mt-2">
                        {expandedDescriptions[addon.id] ? 'Show less' : 'Show more'}
                      </button>
                    </div>
                    <button
                      onClick={() => handleAddOnToggle(addon)}
                      className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 whitespace-nowrap ${selectedAddOns.find(item => item.id === addon.id) ? 'bg-[#1393c4] text-white' : 'border-2 border-[#1393c4] text-[#1393c4] hover:bg-[#1393c4] hover:text-white'}`}
                    >
                      {selectedAddOns.find(item => item.id === addon.id) ? 'Added' : 'Add'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {!showAllAddOns && advancedAddOns.length > 0 && (
              <div className="text-center mt-6">
                <button onClick={() => setShowAllAddOns(true)} className="px-8 py-3 bg-[#1393c4] text-white rounded-full font-semibold hover:bg-[#0d7aa1] transition-colors duration-300">
                  Show Paint Correction Options ({advancedAddOns.length})
                </button>
              </div>
            )}
            {showAllAddOns && (
              <div className="text-center mt-6">
                <button onClick={() => setShowAllAddOns(false)} className="px-8 py-3 border-2 border-[#1393c4] text-[#1393c4] rounded-full font-semibold hover:bg-[#1393c4] hover:text-white transition-colors duration-300">
                  Show Less
                </button>
              </div>
            )}
          </div>
        )}

        <div id="date-section" className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-4">
              {selectedPackage ? '4' : '3'}. SELECT DATE AND TIME
            </h2>
            <p className="text-[#1393c4]">Choose your preferred date and time.</p>
            {!selectedPackage && <p className="text-[#1393c4] text-sm mt-2">Please select a package first</p>}
          </div>

          <div className={`bg-gray-50 rounded-xl border-2 border-gray-200 p-6 max-w-4xl mx-auto ${!selectedPackage ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-semibold text-[#1393c4]">{months[currentMonth.getMonth()]} {currentMonth.getFullYear()}</div>
              <div className="flex space-x-2">
                <button onClick={() => selectedPackage && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} disabled={!selectedPackage} className="p-3 hover:bg-gray-100 rounded-lg text-[#1393c4] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => selectedPackage && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} disabled={!selectedPackage} className="p-3 hover:bg-gray-100 rounded-lg text-[#1393c4] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-sm font-medium text-[#1393c4] py-2 bg-gray-100 rounded">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mb-8">
              {getDaysInMonth(currentMonth).map((day, index) => {
                const isSelected = selectedDate === `${months[currentMonth.getMonth()]} ${day}, ${currentMonth.getFullYear()}`;
                const isBlocked = isDateBlocked(day);
                const isPast = isPastDate(day);
                return (
                  <button
                    key={index}
                    onClick={() => day && selectedPackage && handleDateSelect(day)}
                    disabled={!day || isPast || isBlocked || !selectedPackage}
                    className={`h-12 w-full rounded-lg text-sm font-medium transition-colors duration-200 ${!day ? 'cursor-default' : !selectedPackage || isPast || isBlocked ? 'text-gray-300 cursor-not-allowed bg-gray-50' : isSelected ? 'bg-[#1393c4] text-white font-bold' : isToday(day) ? 'bg-blue-100 text-[#1393c4] border border-[#1393c4]' : 'hover:bg-blue-50 text-[#1393c4] border border-gray-200 hover:border-[#1393c4]'} ${isBlocked && day ? 'line-through' : ''}`}
                    title={isBlocked ? 'This date is blocked' : ''}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {selectedDate && selectedPackage && (
              <div id="time-slots-section" className="border-t border-gray-200 pt-6">
                <div className="text-center mb-4">
                  <p className="text-[#1393c4] font-semibold text-lg">Selected: {selectedDate}</p>
                </div>
                <h3 className="text-xl font-semibold text-[#1393c4] mb-4 text-center">Available Times</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {timeSlots.map(time => {
                    const isBlocked = isTimeSlotBlocked(time);
                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        disabled={isBlocked}
                        className={`py-3 px-4 text-sm font-medium rounded-lg border-2 transition-colors duration-200 ${isBlocked ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through' : selectedTime === time ? 'bg-[#1393c4] text-white border-[#1393c4]' : 'bg-white text-[#1393c4] border-[#1393c4] hover:bg-blue-50'}`}
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

        {selectedDate && selectedTime && selectedPackage && (
          <div id="summary-section" className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-8 border-2 border-[#1393c4] mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-2">5. BOOKING SUMMARY</h2>
              <p className="text-[#1393c4]">Review your booking details</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start gap-3 mb-4">
                  <Car className="w-6 h-6 text-[#1393c4] mt-1" />
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
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-[#1393c4] mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1393c4] text-lg mb-2">Appointment Details</h3>
                    <div className="space-y-2 text-[#1393c4]">
                      <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span className="font-medium">Date:</span> {selectedDate}</p>
                      <p className="flex items-center gap-2"><Clock className="w-4 h-4" /><span className="font-medium">Time:</span> {selectedTime}</p>
                    </div>
                  </div>
                </div>
              </div>
              {selectedAddOns.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex items-start gap-3 mb-4">
                    <Package className="w-6 h-6 text-[#1393c4] mt-1" />
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
              <div className="bg-white rounded-lg p-6 shadow-md border-2 border-[#1393c4]">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-[#1393c4] mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1393c4] text-lg mb-4">Cost Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[#1393c4] pb-2">
                        <span>{selectedPackage.name}</span>
                        <span className="font-medium">{selectedPackage.price}.00 CAD</span>
                      </div>
                      {selectedAddOns.length > 0 && selectedAddOns.map((addon) => (
                        <div key={addon.id} className="flex justify-between items-center text-[#1393c4] text-sm pb-2">
                          <span className="text-gray-600">+ {addon.name}</span>
                          <span className="font-medium">{addon.price}.00 CAD</span>
                        </div>
                      ))}
                      <div className="border-t-2 border-[#1393c4] pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-[#1393c4]">Total Cost:</span>
                          <span className="text-2xl font-bold text-[#1393c4]">${calculateTotalCost()}.00 CAD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div id="contact-section" className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-4">
                {selectedDate && selectedTime ? '6' : (selectedPackage ? '5' : '4')}. CONTACT INFORMATION
              </h2>
              <p className="text-[#1393c4]">Please provide your contact details.</p>
              {(!selectedDate || !selectedTime) && <p className="text-[#1393c4] text-sm mt-2">Please select date and time first</p>}
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${(!selectedDate || !selectedTime) ? 'opacity-50' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-[#1393c4] mb-2">First name *</label>
                <input type="text" name="firstName" value={bookingData.firstName} onChange={handleInputChange} disabled={!selectedDate || !selectedTime} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1393c4] mb-2">Last name *</label>
                <input type="text" name="lastName" value={bookingData.lastName} onChange={handleInputChange} disabled={!selectedDate || !selectedTime} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1393c4] mb-2">Email *</label>
                <input type="email" name="email" value={bookingData.email} onChange={handleInputChange} disabled={!selectedDate || !selectedTime} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1393c4] mb-2">Phone *</label>
                <input type="tel" name="phone" value={bookingData.phone} onChange={handleInputChange} disabled={!selectedDate || !selectedTime} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1393c4] mb-2">Vehicle Make and Model *</label>
                <input type="text" name="vehicleMake" value={bookingData.vehicleMake} onChange={handleInputChange} disabled={!selectedDate || !selectedTime} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1393c4] mb-2">Message</label>
                <textarea name="message" value={bookingData.message} onChange={handleInputChange} disabled={!selectedDate || !selectedTime} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-[#1393c4] mb-4 leading-relaxed">We will confirm your appointment within 24 hours.</p>
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${isFormValid() && !isSubmitting ? 'bg-[#1393c4] hover:bg-[#0d7aa1] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;