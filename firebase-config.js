// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4ABs3KdA_AIlohGxpMTqAMukyiTaqWBA",
    authDomain: "vocal-vent-41ef3.firebaseapp.com",
    projectId: "vocal-vent-41ef3",
    storageBucket: "vocal-vent-41ef3.firebasestorage.app",
    messagingSenderId: "968146495760",
    appId: "1:968146495760:web:a675aa4db679a198ee1d95",
    measurementId: "G-HHRJPP0LZ5"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Authentication state observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log("User is signed in:", user.uid);
    } else {
        // User is signed out
        console.log("User is signed out");
    }
});

// Database helper functions
const Database = {
    // Save booking to Firestore
    async saveBooking(bookingData) {
        try {
            const bookingRef = await db.collection('bookings').add({
                ...bookingData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending',
                userId: 'anonymous' // Since we don't require login
            });
            return bookingRef.id;
        } catch (error) {
            console.error("Error saving booking:", error);
            throw error;
        }
    },

    // Save chat session
    async saveChatSession(sessionData) {
        try {
            const sessionRef = await db.collection('chat_sessions').add({
                ...sessionData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            });
            return sessionRef.id;
        } catch (error) {
            console.error("Error saving chat session:", error);
            throw error;
        }
    },

    // Save corporate inquiry
    async saveCorporateInquiry(inquiryData) {
        try {
            const inquiryRef = await db.collection('corporate_inquiries').add({
                ...inquiryData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending'
            });
            return inquiryRef.id;
        } catch (error) {
            console.error("Error saving corporate inquiry:", error);
            throw error;
        }
    },

    // Get bookings for admin
    async getBookings(filter = {}) {
        try {
            let query = db.collection('bookings');
            
            // Apply filters
            if (filter.status) {
                query = query.where('status', '==', filter.status);
            }
            if (filter.startDate && filter.endDate) {
                query = query.where('date', '>=', filter.startDate)
                             .where('date', '<=', filter.endDate);
            }
            
            const snapshot = await query.orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting bookings:", error);
            throw error;
        }
    },

    // Update booking status
    async updateBookingStatus(bookingId, status) {
        try {
            await db.collection('bookings').doc(bookingId).update({
                status: status,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating booking status:", error);
            throw error;
        }
    },

    // Get chat sessions
    async getChatSessions(filter = {}) {
        try {
            let query = db.collection('chat_sessions');
            
            if (filter.status) {
                query = query.where('status', '==', filter.status);
            }
            if (filter.platform) {
                query = query.where('platform', '==', filter.platform);
            }
            
            const snapshot = await query.orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting chat sessions:", error);
            throw error;
        }
    },

    // Update chat session
    async updateChatSession(sessionId, updateData) {
        try {
            await db.collection('chat_sessions').doc(sessionId).update({
                ...updateData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating chat session:", error);
            throw error;
        }
    }
};

// Payment processing with Payd Money
const PaymentProcessor = {
    // Initialize payment
    async initializePayment(paymentData) {
        try {
            // In a real implementation, this would call your server
            // which then calls the Payd Money API
            
            const response = await fetch('/api/payments/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...paymentData,
                    apiKey: 'Wc6OdqaoR2c2qMWa3kgWzKqQ9QJRYRHNhNVuwg5C'
                })
            });
            
            if (!response.ok) {
                throw new Error('Payment initialization failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error("Payment initialization error:", error);
            throw error;
        }
    },

    // Verify payment
    async verifyPayment(transactionId) {
        try {
            const response = await fetch(`/api/payments/verify/${transactionId}`);
            
            if (!response.ok) {
                throw new Error('Payment verification failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error("Payment verification error:", error);
            throw error;
        }
    }
};

// Real-time chat functionality
const ChatService = {
    // Create a new chat room
    async createChatRoom(participantData) {
        try {
            const chatRef = await db.collection('chats').add({
                participants: [participantData],
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            });
            return chatRef.id;
        } catch (error) {
            console.error("Error creating chat room:", error);
            throw error;
        }
    },

    // Send a message
    async sendMessage(chatId, messageData) {
        try {
            const messageRef = await db.collection('chats').doc(chatId)
                .collection('messages').add({
                    ...messageData,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    read: false
                });
            
            // Update last activity
            await db.collection('chats').doc(chatId).update({
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return messageRef.id;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    },

    // Listen for new messages
    listenToMessages(chatId, callback) {
        return db.collection('chats').doc(chatId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => {
                const messages = snapshot.docChanges()
                    .filter(change => change.type === 'added')
                    .map(change => ({ id: change.doc.id, ...change.doc.data() }));
                
                if (messages.length > 0) {
                    callback(messages);
                }
            });
    },

    // Get chat history
    async getChatHistory(chatId, limit = 50) {
        try {
            const snapshot = await db.collection('chats').doc(chatId)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .reverse();
        } catch (error) {
            console.error("Error getting chat history:", error);
            throw error;
        }
    }
};

// Admin authentication
const AdminAuth = {
    // Admin login
    async login(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            
            // Check if user is admin
            const userDoc = await db.collection('admins').doc(userCredential.user.uid).get();
            if (!userDoc.exists) {
                await auth.signOut();
                throw new Error('Unauthorized access');
            }
            
            return userCredential.user;
        } catch (error) {
            console.error("Admin login error:", error);
            throw error;
        }
    },

    // Check admin status
    async isAdmin() {
        const user = auth.currentUser;
        if (!user) return false;
        
        const adminDoc = await db.collection('admins').doc(user.uid).get();
        return adminDoc.exists;
    },

    // Logout
    async logout() {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    }
};

// Export modules
export {
    firebaseConfig,
    app,
    db,
    auth,
    storage,
    Database,
    PaymentProcessor,
    ChatService,
    AdminAuth
};
