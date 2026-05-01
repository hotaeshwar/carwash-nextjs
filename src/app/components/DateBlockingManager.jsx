'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs,
  query 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  Calendar, 
  Lock, 
  Unlock, 
  AlertCircle, 
  Loader2,
  ShieldAlert,
  LogOut,
  Mail,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';

export default function DateBlockingManager() {
  const [blockedDates, setBlockedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [autoBlockingStatus, setAutoBlockingStatus] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        loadBlockedDates();
        autoBlockSundaysOnly();
      }
    });
    return () => unsubscribe();
  }, []);

  const isSunday = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.getDay() === 0;
  };

  const isSaturday = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.getDay() === 6;
  };

  const formatDateForStorage = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const autoBlockSundaysOnly = async () => {
    try {
      setAutoBlockingStatus('Checking Sundays...');
      
      const sundaysToBlock = [];
      const today = new Date();
      
      for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        if (date.getDay() === 0) {
          const dateString = formatDateForStorage(date);
          sundaysToBlock.push({
            date: dateString,
            type: 'sunday-full',
            isAutoSunday: true,
            blockedTill: '23:59'
          });
        }
      }

      const q = query(collection(db, 'blockedDates'));
      const querySnapshot = await getDocs(q);
      const existingBlocks = new Set();
      querySnapshot.forEach((doc) => {
        existingBlocks.add(doc.id);
      });

      let blockedSundaysCount = 0;
      
      for (const sunday of sundaysToBlock) {
        if (!existingBlocks.has(sunday.date)) {
          const blockData = {
            date: sunday.date,
            type: 'sunday-full',
            blockedSlots: [],
            updatedAt: new Date().toISOString(),
            blockedBy: 'system-auto',
            blockedAt: new Date().toISOString(),
            isAutoSunday: true,
            blockedTill: '23:59'
          };
          
          await setDoc(doc(db, 'blockedDates', sunday.date), blockData);
          blockedSundaysCount++;
        }
      }

      let removedSaturdayBlocks = 0;
      for (const [dateId, data] of Object.entries(blockedDates)) {
        if (data.isAutoSaturday && isSaturday(dateId)) {
          await deleteDoc(doc(db, 'blockedDates', dateId));
          removedSaturdayBlocks++;
        }
      }

      let statusMessage = '';
      if (blockedSundaysCount > 0) {
        statusMessage = `✓ ${blockedSundaysCount} Sundays auto-blocked`;
        if (removedSaturdayBlocks > 0) {
          statusMessage += ` (removed ${removedSaturdayBlocks} Saturday blocks)`;
        }
      } else {
        statusMessage = '✓ All Sundays already blocked';
        if (removedSaturdayBlocks > 0) {
          statusMessage += ` (removed ${removedSaturdayBlocks} Saturday blocks)`;
        }
      }
      
      setAutoBlockingStatus(statusMessage);
      await loadBlockedDates();
      setTimeout(() => setAutoBlockingStatus(''), 3000);
    } catch (error) {
      console.error('Error auto-blocking Sundays:', error);
      setAutoBlockingStatus('⚠ Error blocking days');
      setTimeout(() => setAutoBlockingStatus(''), 3000);
    }
  };

  const loadBlockedDates = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'blockedDates'));
      const querySnapshot = await getDocs(q);
      const dates = {};
      querySnapshot.forEach((doc) => {
        dates[doc.id] = doc.data();
      });
      setBlockedDates(dates);
    } catch (error) {
      console.error('Error loading dates:', error);
      alert('Error loading dates: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      setAdminEmail('');
      setAdminPassword('');
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Invalid admin credentials. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const blockDate = async () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    if (isSunday(selectedDate)) {
      alert('Sundays are automatically blocked and cannot be manually managed.');
      return;
    }

    if (!user) {
      alert('Please log in as admin first');
      return;
    }

    try {
      setLoading(true);
      const dateToStore = selectedDate;
      
      let blockedTill = '23:59';
      let type = 'full';
      
      if (isSaturday(selectedDate)) {
        const shouldBlockFullDay = window.confirm(
          `This is a Saturday. By default, Saturdays are available for morning bookings.\n\n` +
          `Do you want to block the ENTIRE day? Click OK for full day, Cancel for partial day (block after 12 PM only).`
        );
        
        if (shouldBlockFullDay) {
          blockedTill = '23:59';
          type = 'saturday-full';
        } else {
          blockedTill = '12:00';
          type = 'saturday-partial';
          alert('Saturday will be blocked only AFTER 12 PM. Morning bookings will still be available.');
        }
      }
      
      const blockData = {
        date: dateToStore,
        type: type,
        blockedSlots: [],
        updatedAt: new Date().toISOString(),
        blockedBy: user.email,
        blockedAt: new Date().toISOString(),
        blockedTill: blockedTill
      };
      
      await setDoc(doc(db, 'blockedDates', dateToStore), blockData);
      await loadBlockedDates();
      alert('Date blocked successfully!');
      setSelectedDate('');
    } catch (error) {
      console.error('Error blocking date:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const unblockDate = async (date) => {
    if (isSunday(date)) {
      const data = blockedDates[date];
      if (data && data.isAutoSunday) {
        alert('Sundays are automatically blocked and cannot be unblocked.');
        return;
      }
    }

    if (!user) {
      alert('Please log in as admin first');
      return;
    }

    if (!confirm(`Are you sure you want to unblock ${date}?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(db, 'blockedDates', date));
      await loadBlockedDates();
      alert('Date unblocked successfully!');
    } catch (error) {
      console.error('Error unblocking date:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Login UI
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-8 border border-slate-200/50">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#1393c4] to-[#0d7aa1] rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <ShieldAlert className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#1393c4] mb-2">Admin Login</h2>
            <p className="text-sm text-[#1393c4] opacity-75">Access the date blocking manager</p>
          </div>
          
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1393c4] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1393c4] opacity-60" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-[#1393c4] transition-all duration-200 text-[#1393c4]"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#1393c4] mb-2">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1393c4] opacity-60" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-[#1393c4] transition-all duration-200 text-[#1393c4]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-[#1393c4] opacity-60" />
                  ) : (
                    <Eye className="w-5 h-5 text-[#1393c4] opacity-60" />
                  )}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {loginError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#1393c4] hover:bg-[#0d7aa1] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main admin dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 px-4 sm:py-8 sm:px-6 lg:py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1393c4] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0d7aa1] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8 pt-12 sm:pt-16 lg:pt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1393c4] to-[#0d7aa1] rounded-2xl shadow-lg">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#1393c4] mb-1">
                  Date Manager
                </h1>
                <p className="text-sm text-[#1393c4] font-medium">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          <p className="text-center text-[#1393c4] text-lg font-medium">
            Control booking availability for your detailing service
          </p>
          
          {autoBlockingStatus && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-700 text-sm font-semibold">{autoBlockingStatus}</p>
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 p-6 sm:p-8 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-[#1393c4] to-[#0d7aa1] rounded-xl">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1393c4]">Block a Date</h2>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-[#1393c4] text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Sundays are fully blocked. Saturdays are available for morning bookings (till 12 PM).
            </p>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1393c4] mb-3">
              <Calendar className="w-5 h-5 text-[#1393c4]" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:border-[#1393c4] transition-all duration-200 text-[#1393c4] font-medium"
            />
          </div>

          <button
            type="button"
            onClick={blockDate}
            disabled={loading || !selectedDate}
            className="w-full bg-[#1393c4] hover:bg-[#0d7aa1] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Block Date
              </>
            )}
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1393c4]">Blocked Dates</h2>
          </div>
          
          {loading && Object.keys(blockedDates).length === 0 ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-[#1393c4]" />
            </div>
          ) : Object.keys(blockedDates).length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-4">
                <Calendar className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-[#1393c4] text-lg font-medium">No dates are currently blocked</p>
              <p className="text-[#1393c4] text-sm mt-2 opacity-75">Block dates to prevent bookings (Sundays auto-blocked)</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(blockedDates)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([date, data]) => (
                  <div
                    key={date}
                    className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                            <Calendar className="w-5 h-5 text-[#1393c4]" />
                          </div>
                          <h3 className="text-base font-bold text-[#1393c4]">
                            {formatDisplayDate(date)}
                          </h3>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg shadow-md ${
                          data.isAutoSunday 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                            : data.type === 'saturday-partial'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                        }`}>
                          {data.isAutoSunday ? 'SUNDAY (ALL DAY)' : 
                           data.type === 'saturday-partial' ? 'SATURDAY (AFTER 12 PM)' : 
                           'FULL DAY BLOCK'}
                        </span>
                        {data.blockedBy && (
                          <p className="text-xs text-[#1393c4] mt-3 font-medium opacity-75">
                            By: {data.blockedBy}
                          </p>
                        )}
                        {data.blockedTill && (
                          <p className="text-xs text-[#1393c4] mt-1 font-medium opacity-75">
                            {data.isAutoSunday ? 'Blocked all day' : 
                             data.type === 'saturday-partial' ? `Blocked after: ${data.blockedTill} PM` : 
                             `Blocked till: ${data.blockedTill === '23:59' ? 'End of day' : data.blockedTill + ' PM'}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {!data.isAutoSunday && (
                      <button
                        type="button"
                        onClick={() => unblockDate(date)}
                        disabled={loading}
                        className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <Unlock className="w-4 h-4" />
                        Unblock
                      </button>
                    )}
                    
                    {data.isAutoSunday && (
                      <div className="w-full mt-4 bg-slate-100 text-slate-500 font-semibold py-3 px-4 rounded-xl text-center text-sm">
                        Auto-blocked (Sunday - All Day)
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}