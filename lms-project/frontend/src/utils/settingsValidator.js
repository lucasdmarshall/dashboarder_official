export const validateSettings = (newSettings, currentSettings) => {
  const validatedSettings = { ...currentSettings };

  // Global Platform Validation
  if (newSettings.globalPlatform) {
    const { globalPlatform } = newSettings;
    
    if (globalPlatform.appName && globalPlatform.appName.length > 3) {
      validatedSettings.globalPlatform.appName = globalPlatform.appName;
    }

    if (globalPlatform.supportedLanguages) {
      const validLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ar'];
      validatedSettings.globalPlatform.supportedLanguages = 
        globalPlatform.supportedLanguages.filter(lang => validLanguages.includes(lang));
    }

    if (globalPlatform.maintenanceMode) {
      validatedSettings.globalPlatform.maintenanceMode = {
        ...currentSettings.globalPlatform.maintenanceMode,
        ...globalPlatform.maintenanceMode
      };
    }
  }

  // User Management Validation
  if (newSettings.userManagement) {
    const { userManagement } = newSettings;
    
    if (userManagement.registrationPolicies) {
      const policies = userManagement.registrationPolicies;
      
      validatedSettings.userManagement.registrationPolicies = {
        minAge: policies.minAge >= 13 ? policies.minAge : 16,
        maxAge: policies.maxAge <= 120 ? policies.maxAge : 100,
        allowMultipleRoles: !!policies.allowMultipleRoles,
        selfDeletionAllowed: !!policies.selfDeletionAllowed,
        requiredFields: policies.requiredFields || ['email', 'name', 'password']
      };
    }
  }

  // Security Framework Validation
  if (newSettings.securityFramework) {
    const { securityFramework } = newSettings;
    
    if (securityFramework.authentication) {
      const auth = securityFramework.authentication;
      
      if (auth.passwordPolicy) {
        validatedSettings.securityFramework.authentication.passwordPolicy = {
          minLength: Math.max(8, Math.min(auth.passwordPolicy.minLength || 12, 64)),
          maxLength: Math.min(64, auth.passwordPolicy.maxLength || 64),
          complexity: {
            requireUppercase: !!auth.passwordPolicy.complexity?.requireUppercase,
            requireLowercase: !!auth.passwordPolicy.complexity?.requireLowercase,
            requireNumbers: !!auth.passwordPolicy.complexity?.requireNumbers,
            requireSpecialChars: !!auth.passwordPolicy.complexity?.requireSpecialChars,
            bannedPasswords: auth.passwordPolicy.complexity?.bannedPasswords || []
          }
        };
      }

      if (auth.multiFactorAuthentication) {
        validatedSettings.securityFramework.authentication.multiFactorAuthentication = {
          enabled: !!auth.multiFactorAuthentication.enabled,
          methods: auth.multiFactorAuthentication.methods || ['email']
        };
      }
    }
  }

  return validatedSettings;
};

export const validateSettingChange = (settingPath, newValue) => {
  // Specific validation for individual setting changes
  switch(settingPath) {
    case 'globalPlatform.appName':
      return newValue.length >= 3 && newValue.length <= 50;
    case 'userManagement.registrationPolicies.minAge':
      return newValue >= 13 && newValue <= 100;
    case 'securityFramework.authentication.passwordPolicy.minLength':
      return newValue >= 8 && newValue <= 64;
    default:
      return true;
  }
};

export const getSettingDescription = (settingPath) => {
  const descriptions = {
    'globalPlatform.appName': 'The name of your platform, visible to users',
    'userManagement.registrationPolicies.minAge': 'Minimum age required to register on the platform',
    'securityFramework.authentication.passwordPolicy.minLength': 'Minimum number of characters required for passwords'
  };

  return descriptions[settingPath] || 'No description available';
};
