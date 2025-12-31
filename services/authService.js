/**
 * Authentication Service with Full Firebase Integration
 * Features:
 * - Email/Password Auth with Email Verification
 * - Phone OTP Verification with RecaptchaVerifier
 * - Firestore User Profiles
 * - Safe-Exit Pattern (IS_FIREBASE_ACTIVE flag)
 */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  linkWithCredential,
  updateProfile,
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// ==================== CONFIGURATION ====================
// Set to true for production Firebase, false for mock/demo mode
export const IS_FIREBASE_ACTIVE = true;

// ==================== LOCAL STORAGE KEYS ====================
const USERS_KEY = 'namma_auth_users';
const SESSION_KEY = 'namma_auth_session';

// ==================== HELPER FUNCTIONS ====================

const getMockUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveMockUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getSession = () => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

const saveSession = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

const generateUID = () => 'user_' + Math.random().toString(36).substr(2, 12);
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ==================== FIRESTORE HELPERS ====================

/**
 * Create or update user document in Firestore
 */
const createUserDocument = async (uid, userData) => {
  if (!IS_FIREBASE_ACTIVE) return;
  
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error creating user document:', error);
    return false;
  }
};

/**
 * Get user document from Firestore
 */
export const getUserDocument = async (uid) => {
  if (!IS_FIREBASE_ACTIVE) {
    const users = getMockUsers();
    return users.find(u => u.uid === uid) || null;
  }
  
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { uid, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user document:', error);
    return null;
  }
};

/**
 * Update user document in Firestore
 */
export const updateUserDocument = async (uid, data) => {
  if (!IS_FIREBASE_ACTIVE) {
    const users = getMockUsers();
    const index = users.findIndex(u => u.uid === uid);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      saveMockUsers(users);
    }
    return true;
  }
  
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user document:', error);
    return false;
  }
};

// ==================== AUTH FUNCTIONS ====================

/**
 * Sign up with email and password
 * Sends email verification automatically
 */
export const signUp = async (email, password, additionalData = {}) => {
  if (!IS_FIREBASE_ACTIVE) {
    // MOCK Implementation
    try {
      const users = getMockUsers();
      
      if (users.find(u => u.email === email)) {
        return { success: false, error: 'Email already registered' };
      }

      if (!email.includes('@') || !email.includes('.')) {
        return { success: false, error: 'Invalid email format' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      const newUser = {
        uid: generateUID(),
        email,
        password,
        emailVerified: false,
        isPhoneVerified: false,
        profileCompleted: false,
        phoneNumber: additionalData.phoneNumber || null,
        displayName: additionalData.displayName || null,
        studentId: additionalData.studentId || null,
        createdAt: new Date().toISOString(),
        profile: null,
      };

      users.push(newUser);
      saveMockUsers(users);
      
      const sessionUser = { ...newUser };
      delete sessionUser.password;
      saveSession(sessionUser);

      return { 
        success: true, 
        user: sessionUser,
        message: 'Account created! Please check your email (simulated) to verify your account.',
        emailSent: true,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // FIREBASE Implementation
  try {
    // Create user with email/password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name if provided
    if (additionalData.displayName) {
      await updateProfile(user, { displayName: additionalData.displayName });
    }

    // Send email verification
    await sendEmailVerification(user, {
      url: window.location.origin + '/login?verified=true',
      handleCodeInApp: false,
    });

    // Create user document in Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: additionalData.displayName || null,
      phoneNumber: additionalData.phoneNumber || null,
      studentId: additionalData.studentId || null,
      emailVerified: false,
      isPhoneVerified: false,
      profileCompleted: false,
      tier: 0,
      creditLimit: 0,
      creditBalance: 0,
    };

    await createUserDocument(user.uid, userData);

    // Save session locally
    saveSession(userData);
    saveMockUsers([...getMockUsers(), userData]);

    return { 
      success: true, 
      user: userData,
      message: 'Account created! Please check your email to verify your account.',
      emailSent: true,
    };
  } catch (error) {
    console.error('Firebase signup error:', error);
    let errorMessage = 'Signup failed';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password must be at least 6 characters';
        break;
      default:
        errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Log in with email and password
 * Checks if email is verified before allowing login
 */
export const logIn = async (email, password) => {
  if (!IS_FIREBASE_ACTIVE) {
    // MOCK Implementation
    try {
      const users = getMockUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Check email verification (mock - always verified after first login attempt)
      if (!user.emailVerified) {
        user.emailVerified = true;
        saveMockUsers(users);
      }

      const sessionUser = { ...user };
      delete sessionUser.password;
      saveSession(sessionUser);

      return { success: true, user: sessionUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // FIREBASE Implementation
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if email is verified
    if (!user.emailVerified) {
      // Sign out the user immediately
      await signOut(auth);
      return { 
        success: false, 
        error: 'Please verify your email first! Check your inbox for the verification link.',
        needsVerification: true,
        email: user.email,
      };
    }

    // Fetch user profile from Firestore
    let userData = await getUserDocument(user.uid);
    
    if (!userData) {
      // Create user document if doesn't exist
      userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: true,
        isPhoneVerified: false,
        profileCompleted: false,
      };
      await createUserDocument(user.uid, userData);
    } else {
      // Update emailVerified status
      await updateUserDocument(user.uid, { emailVerified: true });
      userData.emailVerified = true;
    }

    saveSession(userData);

    return { 
      success: true, 
      user: userData,
      fullyAuthenticated: userData.emailVerified && userData.isPhoneVerified,
    };
  } catch (error) {
    console.error('Firebase login error:', error);
    let errorMessage = 'Login failed';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
      default:
        errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Resend email verification
 */
export const resendEmailVerification = async () => {
  if (!IS_FIREBASE_ACTIVE) {
    return { success: true, message: 'Verification email sent (simulated)' };
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Not logged in' };
    }

    await sendEmailVerification(user);
    return { success: true, message: 'Verification email sent!' };
  } catch (error) {
    console.error('Email verification error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  if (!IS_FIREBASE_ACTIVE) {
    console.log(`[MOCK] Password reset link sent to: ${email}`);
    return { success: true, message: `Reset link sent to ${email} (simulated)` };
  }

  try {
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin + '/login',
      handleCodeInApp: false,
    });
    return { success: true, message: `Password reset link sent to ${email}` };
  } catch (error) {
    console.error('Password reset error:', error);
    let errorMessage = 'Failed to send reset email';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Log out current user
 */
export const logOut = async () => {
  if (IS_FIREBASE_ACTIVE) {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  clearSession();
  return { success: true };
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  if (IS_FIREBASE_ACTIVE && auth.currentUser) {
    const session = getSession();
    if (session && session.uid === auth.currentUser.uid) {
      return session;
    }
    return {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      emailVerified: auth.currentUser.emailVerified,
      displayName: auth.currentUser.displayName,
    };
  }
  
  return getSession();
};

// ==================== PHONE OTP VERIFICATION ====================

let recaptchaVerifier = null;
let confirmationResult = null;
let mockPendingOTP = null;

/**
 * Initialize invisible reCAPTCHA
 */
export const initRecaptcha = (containerId = 'recaptcha-container') => {
  if (!IS_FIREBASE_ACTIVE) return true;

  try {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
    }

    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA verified');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });

    return true;
  } catch (error) {
    console.error('reCAPTCHA init error:', error);
    return false;
  }
};

/**
 * Send OTP to phone number
 */
export const sendPhoneOTP = async (phoneNumber) => {
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

  if (!IS_FIREBASE_ACTIVE) {
    // MOCK Implementation
    const otp = generateOTP();
    mockPendingOTP = { phoneNumber: formattedPhone, otp, expiresAt: Date.now() + 5 * 60 * 1000 };
    
    console.log(`[SMS] OTP for ${formattedPhone}: ${otp}`);
    
    return { 
      success: true, 
      otp, // Only for demo - remove in production
      message: `OTP sent to ${formattedPhone}`,
    };
  }

  // FIREBASE Implementation
  try {
    if (!recaptchaVerifier) {
      initRecaptcha();
    }

    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    
    return { 
      success: true, 
      message: `OTP sent to ${formattedPhone}`,
    };
  } catch (error) {
    console.error('Phone OTP error:', error);
    let errorMessage = 'Failed to send OTP';
    
    switch (error.code) {
      case 'auth/invalid-phone-number':
        errorMessage = 'Invalid phone number format';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts. Please try again later.';
        break;
      case 'auth/captcha-check-failed':
        errorMessage = 'reCAPTCHA verification failed. Please refresh the page.';
        break;
      default:
        errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Verify OTP and link phone to account
 */
export const verifyPhoneOTP = async (otp) => {
  if (!IS_FIREBASE_ACTIVE) {
    // MOCK Implementation
    if (!mockPendingOTP) {
      return { success: false, error: 'No OTP pending. Please request a new one.' };
    }

    if (Date.now() > mockPendingOTP.expiresAt) {
      mockPendingOTP = null;
      return { success: false, error: 'OTP expired. Please request a new one.' };
    }

    if (mockPendingOTP.otp !== otp) {
      return { success: false, error: 'Invalid OTP' };
    }

    // Update session
    const session = getSession();
    if (session) {
      session.isPhoneVerified = true;
      session.phoneNumber = mockPendingOTP.phoneNumber;
      saveSession(session);

      const users = getMockUsers();
      const index = users.findIndex(u => u.uid === session.uid);
      if (index !== -1) {
        users[index].isPhoneVerified = true;
        users[index].phoneNumber = mockPendingOTP.phoneNumber;
        saveMockUsers(users);
      }
    }

    mockPendingOTP = null;
    return { success: true, message: 'Phone verified successfully!' };
  }

  // FIREBASE Implementation
  try {
    if (!confirmationResult) {
      return { success: false, error: 'No OTP pending. Please request a new one.' };
    }

    const result = await confirmationResult.confirm(otp);
    const user = result.user;

    // Update Firestore document
    await updateUserDocument(user.uid, { 
      isPhoneVerified: true,
      phoneNumber: user.phoneNumber,
    });

    // Update local session
    const session = getSession();
    if (session) {
      session.isPhoneVerified = true;
      session.phoneNumber = user.phoneNumber;
      saveSession(session);
    }

    confirmationResult = null;
    
    return { success: true, message: 'Phone verified successfully!' };
  } catch (error) {
    console.error('OTP verification error:', error);
    let errorMessage = 'Invalid OTP';
    
    if (error.code === 'auth/invalid-verification-code') {
      errorMessage = 'Invalid OTP. Please try again.';
    } else if (error.code === 'auth/code-expired') {
      errorMessage = 'OTP expired. Please request a new one.';
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Link phone number to existing account (alternative approach)
 */
export const linkPhoneToAccount = async (phoneNumber, otp) => {
  if (!IS_FIREBASE_ACTIVE) {
    return verifyPhoneOTP(otp);
  }

  try {
    const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
    const user = auth.currentUser;
    
    await linkWithCredential(user, credential);

    // Update Firestore
    await updateUserDocument(user.uid, { 
      isPhoneVerified: true,
      phoneNumber: phoneNumber,
    });

    return { success: true, message: 'Phone linked successfully!' };
  } catch (error) {
    console.error('Phone linking error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== AUTH STATE LISTENER ====================

/**
 * Listen for auth state changes
 * Syncs with Firestore and checks full authentication status
 */
export const onAuthStateChange = (callback) => {
  if (!IS_FIREBASE_ACTIVE) {
    const user = getSession();
    const fullyAuthenticated = user?.emailVerified && user?.isPhoneVerified;
    callback(user ? { ...user, fullyAuthenticated } : null);
    return () => {};
  }

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Fetch user data from Firestore
      let userData = await getUserDocument(firebaseUser.uid);
      
      if (!userData) {
        // Create new user document
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
          isPhoneVerified: false,
          profileCompleted: false,
        };
        await createUserDocument(firebaseUser.uid, userData);
      }

      // Sync email verification status
      if (firebaseUser.emailVerified && !userData.emailVerified) {
        userData.emailVerified = true;
        await updateUserDocument(firebaseUser.uid, { emailVerified: true });
      }

      // Check if fully authenticated
      const fullyAuthenticated = userData.emailVerified && userData.isPhoneVerified;

      saveSession({ ...userData, fullyAuthenticated });
      callback({ ...userData, fullyAuthenticated });
    } else {
      clearSession();
      callback(null);
    }
  });
};

// ==================== PROFILE MANAGEMENT ====================

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData) => {
  const session = getSession();
  if (!session) {
    return { success: false, error: 'Not authenticated' };
  }

  const updatedData = {
    ...profileData,
    profileCompleted: true,
  };

  const success = await updateUserDocument(session.uid, updatedData);
  
  if (success) {
    const newSession = { ...session, ...updatedData };
    saveSession(newSession);
    return { success: true, user: newSession };
  }

  return { success: false, error: 'Failed to update profile' };
};

/**
 * Get all users (Admin only)
 */
export const getAllUsers = () => {
  const users = getMockUsers();
  return users.map(u => {
    const { password, ...safeUser } = u;
    return safeUser;
  });
};
