import React from 'react';
import PropTypes from 'prop-types';
import {
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Select,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Input,
  Tooltip,
  Icon,
  Checkbox,
  CheckboxGroup,
  Stack,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton
} from '@chakra-ui/react';
import { 
  FaShieldAlt, 
  FaKey, 
  FaLock, 
  FaUserSecret, 
  FaNetworkWired,
  FaExclamationTriangle,
  FaFingerprint,
  FaCloudUploadAlt
} from 'react-icons/fa';

const SecurityFrameworkSettings = ({ 
  localSettings = {}, 
  handleSettingChange 
}) => {
  // Comprehensive security framework settings
  const securityFramework = localSettings.securityFramework || {
    authenticationMethods: {
      multiFactorAuthentication: {
        enabled: true,
        methods: ['totp', 'sms', 'email'],
        requiredFactors: 2
      },
      passwordPolicies: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        preventCommonPasswords: true,
        passwordExpirationDays: 90,
        passwordHistoryLimit: 5
      },
      biometricAuthentication: {
        enabled: false,
        supportedMethods: ['fingerprint', 'facialRecognition']
      }
    },
    accessControlSystem: {
      zeroTrustArchitecture: {
        enabled: true,
        continuousAuthentication: true,
        riskBasedAccessControl: true
      },
      privilegeEscalationProtection: {
        enabled: true,
        alertThreshold: 3,
        automaticLockout: true
      },
      sessionManagement: {
        maxConcurrentSessions: 3,
        sessionTimeoutMinutes: 30,
        inactivityLogoutEnabled: true
      }
    },
    networkSecurityControls: {
      firewallConfiguration: {
        enabled: true,
        mode: 'adaptive',
        intrusionDetectionSystem: true,
        intrusionPreventionSystem: true
      },
      trafficEncryption: {
        tlsMinVersion: '1.3',
        enablePerfectForwardSecrecy: true,
        cipherSuitePreference: 'modern'
      },
      ddosProtection: {
        enabled: true,
        mitigationThreshold: 100,
        automaticMitigation: true
      }
    },
    cryptographicSecurity: {
      dataEncryption: {
        atRestEncryption: {
          enabled: true,
          algorithm: 'AES-256-GCM'
        },
        inTransitEncryption: {
          enabled: true,
          protocol: 'TLS 1.3'
        }
      },
      keyManagement: {
        hsm: {
          enabled: true,
          provider: 'aws-kms'
        },
        keyRotationFrequency: 90, // days
        keyCompromiseProtocol: {
          enabled: true,
          automaticRotation: true
        }
      }
    },
    threatIntelligence: {
      securityMonitoring: {
        enabled: true,
        realTimeAlerts: true,
        anomalyDetection: {
          enabled: true,
          sensitivityLevel: 'high'
        }
      },
      malwareScanning: {
        enabled: true,
        scanFrequency: 'hourly',
        cloudBasedScanning: true
      },
      vulnerabilityAssessment: {
        enabled: true,
        scanFrequency: 'weekly',
        autoPatching: true
      }
    },
    complianceAndAudit: {
      auditLogging: {
        enabled: true,
        retentionPeriodDays: 365,
        sensitiveActionLogging: true
      },
      regulatoryCompliance: {
        gdprCompliance: true,
        ccpaCompliance: true,
        hipaaCompliance: false
      },
      incidentResponsePlan: {
        enabled: true,
        automaticEscalation: true,
        notificationChannels: ['email', 'sms']
      }
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Accordion allowMultiple>
        {/* Authentication Methods */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaKey} mr={2} />
              Authentication Methods
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Multi-Factor Authentication</FormLabel>
                  <Switch
                    isChecked={securityFramework.authenticationMethods.multiFactorAuthentication.enabled}
                    onChange={(e) => handleSettingChange(
                      'securityFramework.authenticationMethods.multiFactorAuthentication.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>MFA Required Factors</FormLabel>
                  <NumberInput
                    value={securityFramework.authenticationMethods.multiFactorAuthentication.requiredFactors}
                    onChange={(value) => handleSettingChange(
                      'securityFramework.authenticationMethods.multiFactorAuthentication.requiredFactors', 
                      parseInt(value)
                    )}
                    min={1}
                    max={3}
                    isDisabled={!securityFramework.authenticationMethods.multiFactorAuthentication.enabled}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Biometric Authentication</FormLabel>
                  <Switch
                    isChecked={securityFramework.authenticationMethods.biometricAuthentication.enabled}
                    onChange={(e) => handleSettingChange(
                      'securityFramework.authenticationMethods.biometricAuthentication.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* Password Policies */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaLock} mr={2} />
              Password Policies
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Minimum Password Length</FormLabel>
                  <NumberInput
                    value={securityFramework.authenticationMethods.passwordPolicies.minLength}
                    onChange={(value) => handleSettingChange(
                      'securityFramework.authenticationMethods.passwordPolicies.minLength', 
                      parseInt(value)
                    )}
                    min={8}
                    max={32}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Password Expiration</FormLabel>
                  <NumberInput
                    value={securityFramework.authenticationMethods.passwordPolicies.passwordExpirationDays}
                    onChange={(value) => handleSettingChange(
                      'securityFramework.authenticationMethods.passwordPolicies.passwordExpirationDays', 
                      parseInt(value)
                    )}
                    min={30}
                    max={365}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Prevent Common Passwords</FormLabel>
                  <Switch
                    isChecked={securityFramework.authenticationMethods.passwordPolicies.preventCommonPasswords}
                    onChange={(e) => handleSettingChange(
                      'securityFramework.authenticationMethods.passwordPolicies.preventCommonPasswords', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* Zero Trust & Access Control */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaUserSecret} mr={2} />
              Zero Trust & Access Control
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Zero Trust Architecture</FormLabel>
                  <Switch
                    isChecked={securityFramework.accessControlSystem.zeroTrustArchitecture.enabled}
                    onChange={(e) => handleSettingChange(
                      'securityFramework.accessControlSystem.zeroTrustArchitecture.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Continuous Authentication</FormLabel>
                  <Switch
                    isChecked={securityFramework.accessControlSystem.zeroTrustArchitecture.continuousAuthentication}
                    onChange={(e) => handleSettingChange(
                      'securityFramework.accessControlSystem.zeroTrustArchitecture.continuousAuthentication', 
                      e.target.checked
                    )}
                    isDisabled={!securityFramework.accessControlSystem.zeroTrustArchitecture.enabled}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Max Concurrent Sessions</FormLabel>
                  <NumberInput
                    value={securityFramework.accessControlSystem.sessionManagement.maxConcurrentSessions}
                    onChange={(value) => handleSettingChange(
                      'securityFramework.accessControlSystem.sessionManagement.maxConcurrentSessions', 
                      parseInt(value)
                    )}
                    min={1}
                    max={10}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* Network Security */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaNetworkWired} mr={2} />
              Network Security
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Firewall Mode</FormLabel>
                  <Select
                    value={securityFramework.networkSecurityControls.firewallConfiguration.mode}
                    onChange={(e) => handleSettingChange(
                      'securityFramework.networkSecurityControls.firewallConfiguration.mode', 
                      e.target.value
                    )}
                  >
                    <option value="adaptive">Adaptive</option>
                    <option value="strict">Strict</option>
                    <option value="permissive">Permissive</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>TLS Minimum Version</FormLabel>
                  <Select
                    value={securityFramework.networkSecurityControls.trafficEncryption.tlsMinVersion}
                    onChange={(e) => handleSettingChange(
                      'securityFramework.networkSecurityControls.trafficEncryption.tlsMinVersion', 
                      e.target.value
                    )}
                  >
                    <option value="1.2">TLS 1.2</option>
                    <option value="1.3">TLS 1.3</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>DDoS Protection</FormLabel>
                  <Switch
                    isChecked={securityFramework.networkSecurityControls.ddosProtection.enabled}
                    onChange={(e) => handleSettingChange(
                      'securityFramework.networkSecurityControls.ddosProtection.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* Threat Intelligence */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaExclamationTriangle} mr={2} />
              Threat Intelligence
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Security Monitoring</FormLabel>
                  <Switch
                    isChecked={securityFramework.threatIntelligence.securityMonitoring.enabled}
                    onChange={(e) => handleSettingChange(
                      'securityFramework.threatIntelligence.securityMonitoring.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Malware Scanning</FormLabel>
                  <Select
                    value={securityFramework.threatIntelligence.malwareScanning.scanFrequency}
                    onChange={(e) => handleSettingChange(
                      'securityFramework.threatIntelligence.malwareScanning.scanFrequency', 
                      e.target.value
                    )}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Vulnerability Assessment</FormLabel>
                  <Switch
                    isChecked={securityFramework.threatIntelligence.vulnerabilityAssessment.enabled}
                    onChange={(e) => handleSettingChange(
                      'securityFramework.threatIntelligence.vulnerabilityAssessment.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* Compliance & Audit */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaFingerprint} mr={2} />
              Compliance & Audit
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Audit Logging</FormLabel>
                  <Switch
                    isChecked={securityFramework.complianceAndAudit.auditLogging.enabled}
                    onChange={(e) => handleSettingChange(
                      'securityFramework.complianceAndAudit.auditLogging.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Audit Log Retention</FormLabel>
                  <NumberInput
                    value={securityFramework.complianceAndAudit.auditLogging.retentionPeriodDays}
                    onChange={(value) => handleSettingChange(
                      'securityFramework.complianceAndAudit.auditLogging.retentionPeriodDays', 
                      parseInt(value)
                    )}
                    min={30}
                    max={3650}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Regulatory Compliance</FormLabel>
                  <HStack>
                    <Tag 
                      colorScheme={securityFramework.complianceAndAudit.regulatoryCompliance.gdprCompliance ? 'green' : 'red'}
                      variant="solid"
                    >
                      <TagLabel>GDPR</TagLabel>
                      <TagCloseButton 
                        onClick={() => handleSettingChange(
                          'securityFramework.complianceAndAudit.regulatoryCompliance.gdprCompliance', 
                          !securityFramework.complianceAndAudit.regulatoryCompliance.gdprCompliance
                        )}
                      />
                    </Tag>
                    <Tag 
                      colorScheme={securityFramework.complianceAndAudit.regulatoryCompliance.ccpaCompliance ? 'green' : 'red'}
                      variant="solid"
                    >
                      <TagLabel>CCPA</TagLabel>
                      <TagCloseButton 
                        onClick={() => handleSettingChange(
                          'securityFramework.complianceAndAudit.regulatoryCompliance.ccpaCompliance', 
                          !securityFramework.complianceAndAudit.regulatoryCompliance.ccpaCompliance
                        )}
                      />
                    </Tag>
                  </HStack>
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};

// Prop type validation
SecurityFrameworkSettings.propTypes = {
  localSettings: PropTypes.shape({
    securityFramework: PropTypes.object
  }),
  handleSettingChange: PropTypes.func.isRequired
};

// Default props
SecurityFrameworkSettings.defaultProps = {
  localSettings: {}
};

export default SecurityFrameworkSettings;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */