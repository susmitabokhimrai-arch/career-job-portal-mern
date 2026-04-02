import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, Calendar, Star, XCircle, Clock, UserPlus, Briefcase } from 'lucide-react';
import axios from 'axios';
import { NOTIFICATION_API_END_POINT } from '@/utils/constant'; // ← CHANGE THIS

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
        
        const interval = setInterval(fetchNotifications, 30000);
        
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            clearInterval(interval);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            // ← CHANGE THIS URL
            const response = await axios.get(`${NOTIFICATION_API_END_POINT}/`, {
                withCredentials: true
            });
            
            if (response.data.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unreadCount);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            // ← CHANGE THIS URL
            await axios.put(`${NOTIFICATION_API_END_POINT}/${notificationId}/read`, {}, {
                withCredentials: true
            });
            
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === notificationId ? { ...notif, read: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            // ← CHANGE THIS URL
            await axios.put(`${NOTIFICATION_API_END_POINT}/read/all`, {}, {
                withCredentials: true
            });
            fetchNotifications();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };
     // Added icons for new_application and applied types
    const getIcon = (type) => {
        switch(type) {
            case 'selected':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'interview':
                return <Calendar className="w-5 h-5 text-blue-500" />;
            case 'shortlisted':
                return <Star className="w-5 h-5 text-yellow-500" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'new_application':  // For admin notifications when student applies
return <UserPlus className="w-5 h-5 text-purple-500" />;
            case 'applied':  // For student application confirmation
     return <Briefcase className="w-5 h-5 text-indigo-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };
    
     const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days === 1 ? '' : 's'} ago`;
    };
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {notifications.length > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-purple-600 hover:text-purple-700"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-gray-500">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className={`p-4 border-b cursor-pointer transition-colors ${
                                        notif.read ? 'bg-white' : 'bg-blue-50'
                                    }`}
                                    onClick={() => markAsRead(notif._id)}
                                >
                                    <div className="flex gap-3">
                                        {getIcon(notif.type)}
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-sm">
                                                {notif.title}
                                            </h4>
                                            <p className="text-gray-600 text-xs mt-1">
                                                {notif.message}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-2">
                                                {getTimeAgo(notif.createdAt)}
                                            </p>
                                        </div>
                                        {!notif.read && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;