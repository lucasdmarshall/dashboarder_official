import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import { validateSettings } from '../utils/settingsValidator';
import { produce, set } from 'immer';

const SettingsContext = createContext();

export { SettingsContext };

export const SettingsProvider = ({ children }) => {
  // Define default settings first
  const defaultSettings = {
    globalPlatform: {
      appName: 'Dashboard LMS',
      brandTagline: 'Empowering Global Learning',
      logoUrl: null,
      favicon: null,
      supportedLanguages: ['en', 'es', 'fr', 'de', 'zh', 'ar'],
      defaultLanguage: 'en',
      rtlLanguages: ['ar'],
      maintenanceMode: {
        enabled: false,
        message: 'Platform under scheduled maintenance',
        startTime: null,
        endTime: null,
        allowedIPs: []
      },
      publicRegistration: {
        enabled: true,
        requireEmailVerification: true,
        requirePhoneVerification: false,
        allowedDomains: [],
        blockedDomains: []
      },
      maxConcurrentUsers: 1000,
      serverRegion: 'global',
      performanceThrottling: {
        enabled: true,
        requestsPerMinute: 100,
        concurrentConnections: 50
      }
    },
    userManagement: {
      registrationPolicies: {
        minAge: 16,
        maxAge: 100,
        allowMultipleRoles: false,
        selfDeletionAllowed: false,
        requiredFields: ['email', 'name', 'password'],
        emailVerification: {
          required: true,
          method: 'link',
          expirationHours: 48
        },
        phoneVerification: {
          required: false,
          method: 'sms',
          expirationMinutes: 15
        }
      },
      roleManagement: {
        roles: [
          { 
            name: 'student', 
            permissions: [
              'view_courses', 
              'enroll_courses', 
              'access_learning_materials',
              'submit_assignments',
              'view_grades'
            ] 
          },
          { 
            name: 'instructor', 
            permissions: [
              'create_course', 
              'manage_course', 
              'view_student_progress',
              'grade_assignments',
              'send_announcements',
              'manage_course_content'
            ] 
          },
          { 
            name: 'admin', 
            permissions: ['full_access'] 
          }
        ],
        customRolesAllowed: true,
        permissionGranularity: 'detailed'
      },
      accountLifecycle: {
        inactivityTimeout: 90, // days
        automaticAccountDeletion: false,
        accountRecoveryMethod: ['email', 'phone'],
        multiDeviceLoginPolicy: 'notify'
      }
    },
    securityFramework: {
      authentication: {
        passwordPolicy: {
          minLength: 12,
          maxLength: 64,
          complexity: {
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            bannedPasswords: ['password123', 'admin1234']
          },
          expirationDays: 90,
          preventReuse: 5
        },
        multiFactorAuthentication: {
          enabled: false,
          methods: ['email', 'sms', 'authenticator_app', 'hardware_token'],
          requiredForRoles: ['admin', 'instructor']
        },
        loginSecurity: {
          maxLoginAttempts: 5,
          lockoutDuration: 30, // minutes
          ipBlockingEnabled: true,
          suspiciousActivityThreshold: 3,
          geographicLoginRestrictions: {
            enabled: false,
            allowedCountries: []
          }
        }
      },
      complianceSettings: {
        gdprCompliance: {
          enabled: true,
          dataRetentionPeriod: 365, // days
          rightToBeForgotten: true,
          consentManagement: true
        },
        ccpaCompliance: {
          enabled: true,
          optOutMethods: ['web', 'email', 'phone'],
          dataAccessRequest: true
        },
        auditLogging: {
          enabled: true,
          retentionPeriod: 730, // days
          sensitiveActionLogging: true,
          logRotation: true
        }
      }
    },
    courseManagement: {
      courseCreation: {
        instructorApplicationRequired: true,
        courseApprovalWorkflow: {
          enabled: true,
          stages: ['initial_review', 'content_check', 'final_approval']
        },
        maxCoursesPerInstructor: 10,
        courseLifecycle: {
          draftExpirationDays: 30,
          archivalPeriod: 365
        }
      },
      enrollment: {
        maxCourseCapacity: 50,
        waitlistEnabled: true,
        waitlistCapacity: 20,
        enrollmentPeriods: {
          openRegistration: null,
          closeRegistration: null
        },
        prerequisites: {
          enforced: true,
          crossCoursePrerequisites: true
        }
      },
      assessmentSettings: {
        gradingSystem: 'percentage',
        passingThreshold: 60,
        anonymousGrading: false,
        reassessmentPolicy: {
          allowed: true,
          maxAttempts: 3,
          cooldownPeriod: 7 // days
        }
      }
    },
    billingEcosystem: {
      pricingConfiguration: {
        currency: 'USD',
        taxRate: 0,
        discountEligibility: true,
        subscriptionModels: [
          { 
            name: 'basic', 
            price: 9.99, 
            features: ['access_courses'] 
          },
          { 
            name: 'pro', 
            price: 19.99, 
            features: ['access_courses', 'certification'] 
          }
        ],
        scholarshipProgram: {
          enabled: true,
          applicationProcess: 'review',
          fundAllocation: 0.05 // 5% of revenue
        }
      },
      paymentProcessing: {
        activeGateways: ['stripe', 'paypal'],
        supportedCurrencies: ['USD', 'EUR'],
        taxCalculationMethod: 'flat-rate',
      },
      subscriptions: {
        activeTiers: ['basic', 'pro'],
        freeTrialDuration: 14,
        automaticRenewalEnabled: true,
      },
      refundPolicies: {
        refundWindowDays: 30,
        refundPercentage: 80,
        partialCourseRefundEnabled: false,
      },
      financialReporting: {
        revenueRecognitionMethod: 'completion',
        reportingFrequency: 'monthly',
        detailedReportsEnabled: false,
      },
      paymentGateway: {
        providers: ['stripe', 'paypal'],
        defaultProvider: 'stripe',
        supportedPaymentMethods: ['credit_card', 'debit_card', 'bank_transfer']
      },
      refundPolicy: {
        allowRefunds: true,
        refundWindow: 30, // days
        refundProcessingTime: 7, // days
        partialRefundAllowed: false
      }
    },
    communicationInfrastructure: {
      notificationSettings: {
        email: {
          enabled: true,
          templates: {
            welcome: true,
            courseEnrollment: true,
            assignmentReminder: true
          }
        },
        push: {
          enabled: true,
          platforms: ['web', 'mobile']
        },
        sms: {
          enabled: false,
          countries: []
        }
      },
      communicationPreferences: {
        marketingCommunications: false,
        systemWideAnnouncements: true,
        emergencyAlertSystem: true
      }
    },
    appearanceSettings: {
      theme: {
        primaryColor: '#640101',
        secondaryColor: '#4A0000',
        accentColor: '#FF4500',
        darkMode: false
      },
      accessibility: {
        highContrastMode: false,
        fontScaling: 1.0,
        screenReaderSupport: true,
        keyboardNavigation: true
      }
    },
    advancedSettings: {
      featureFlags: {
        betaFeatures: false,
        experimentalModules: [],
        disabledFeatures: []
      },
      performanceMonitoring: {
        enabled: true,
        slowQueryThreshold: 500, // ms
        memoryUsageAlert: 80 // percentage
      },
      debuggingMode: {
        enabled: false,
        logLevel: 'error',
        performanceTracing: false
      }
    }
  };

  // Use localStorage to persist settings, but fall back to default if not available
  const [appSettings, setAppSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      return defaultSettings;
    }
  });

  // Effect to save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(appSettings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, [appSettings]);

  // Function to update settings
  const updateSettings = useCallback((newSettings) => {
    try {
      const validatedSettings = validateSettings(newSettings, appSettings);
      setAppSettings(prev => ({ 
        ...prev, 
        ...validatedSettings 
      }));
      return true;
    } catch (error) {
      console.error('Settings Validation Error:', error);
      return false;
    }
  }, [appSettings]);

  // Function to reset to default settings
  const resetToDefaultSettings = useCallback(() => {
    setAppSettings(defaultSettings);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    appSettings,
    updateSettings,
    resetToDefaultSettings,
    defaultSettings
  }), [appSettings, updateSettings, resetToDefaultSettings]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};
