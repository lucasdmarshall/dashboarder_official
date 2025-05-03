import React, { useState, useContext } from 'react';
import { 
  Box, 
  Button, 
  Text, 
  Flex,
  Icon,
  VStack,
  HStack,
  Grid,
  GridItem,
  Tabs, 
  TabList, 
  TabPanels, 
  TabPanel, 
  Tab,
  FormControl,
  FormLabel,
  Select,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Input,
  Textarea
} from '@chakra-ui/react';
import { 
  FaGlobeAmericas, 
  FaUserCog, 
  FaShieldAlt, 
  FaBook, 
  FaCreditCard, 
  FaNetworkWired, 
  FaCogs,
  FaUndo,
  FaSave
} from 'react-icons/fa';

import { SettingsContext } from '../contexts/settingsContext';
import GlobalPlatformAdvancedSettings from '../components/GlobalPlatformAdvancedSettings';
import UserManagementAdvancedSettings from '../components/UserManagementAdvancedSettings';
import SecurityFrameworkSettings from '../components/SecurityFrameworkSettings';
import CommunicationSettings from '../components/CommunicationSettings';
import AdvancedPlatformSettings from '../components/AdvancedPlatformSettings';

const SettingSection = ({ title, icon: Icon, children, description }) => (
  <Box 
    borderWidth="1px" 
    borderRadius="lg" 
    p={6} 
    boxShadow="md"
    bg="white"
    mb={6}
  >
    <HStack mb={4} spacing={4} align="center">
      <Icon size={24} color="#640101" />
      <VStack align="start" spacing={1}>
        <Text fontSize="xl" color="#4A0000">{title}</Text>
        {description && <Text fontSize="sm" color="gray.500">{description}</Text>}
      </VStack>
    </HStack>
    <Divider mb={4} borderColor="gray.200" />
    {children}
  </Box>
);

const AdminSettingsPage = () => {
  const { appSettings, updateSettings, resetToDefaultSettings } = useContext(SettingsContext);
  const [localSettings, setLocalSettings] = useState({
    globalPlatform: {
      appName: appSettings?.globalPlatform?.appName || 'LMS Platform',
      brandTagline: appSettings?.globalPlatform?.brandTagline || 'Learn Anywhere, Anytime',
      defaultLanguage: appSettings?.globalPlatform?.defaultLanguage || 'en',
      supportedLanguages: appSettings?.globalPlatform?.supportedLanguages || ['en', 'es', 'fr'],
      maintenanceMode: {
        enabled: appSettings?.globalPlatform?.maintenanceMode?.enabled || false,
        message: appSettings?.globalPlatform?.maintenanceMode?.message || 'Platform under maintenance',
      },
      geoRestrictions: {
        allowedCountries: appSettings?.globalPlatform?.geoRestrictions?.allowedCountries || ['US'],
        blockVPN: appSettings?.globalPlatform?.geoRestrictions?.blockVPN || false,
      },
      compliance: {
        activeFrameworks: appSettings?.globalPlatform?.compliance?.activeFrameworks || [],
        dataRetentionMonths: appSettings?.globalPlatform?.compliance?.dataRetentionMonths || 12,
      }
    },
    userManagement: {
      registrationPolicies: {
        minAge: appSettings?.userManagement?.registrationPolicies?.minAge || 13,
        emailVerification: {
          required: appSettings?.userManagement?.registrationPolicies?.emailVerification?.required || true,
        }
      },
      profileSettings: {
        allowProfilePicture: appSettings?.userManagement?.profileSettings?.allowProfilePicture || true,
        maxProfilePictureSize: appSettings?.userManagement?.profileSettings?.maxProfilePictureSize || 5,
      },
      accountLifecycle: {
        inactiveAccountDeletionMonths: appSettings?.userManagement?.accountLifecycle?.inactiveAccountDeletionMonths || 12,
        autoSuspendSuspiciousAccounts: appSettings?.userManagement?.accountLifecycle?.autoSuspendSuspiciousAccounts || true,
      }
    },
    securityFramework: {
      authentication: {
        multiFactorAuthentication: {
          enabled: appSettings?.securityFramework?.authentication?.multiFactorAuthentication?.enabled || false,
        },
        loginSecurity: {
          maxLoginAttempts: appSettings?.securityFramework?.authentication?.loginSecurity?.maxLoginAttempts || 5,
        }
      },
      networkSecurity: {
        ipWhitelisting: {
          enabled: appSettings?.securityFramework?.networkSecurity?.ipWhitelisting?.enabled || false,
        },
        maxConcurrentSessions: appSettings?.securityFramework?.networkSecurity?.maxConcurrentSessions || 3,
      },
      auditCompliance: {
        detailedLogging: appSettings?.securityFramework?.auditCompliance?.detailedLogging || false,
        logRetentionMonths: appSettings?.securityFramework?.auditCompliance?.logRetentionMonths || 12,
      }
    },
    courseManagement: {
      courseCreation: {
        maxCoursesPerInstructor: appSettings?.courseManagement?.courseCreation?.maxCoursesPerInstructor || 10,
        courseApprovalWorkflow: {
          enabled: appSettings?.courseManagement?.courseCreation?.courseApprovalWorkflow?.enabled || false,
          requiredApprovals: appSettings?.courseManagement?.courseCreation?.courseApprovalWorkflow?.requiredApprovals || 2,
        },
        contentRestrictions: {
          maxCourseSize: appSettings?.courseManagement?.courseCreation?.contentRestrictions?.maxCourseSize || 500, // MB
          allowedFileTypes: appSettings?.courseManagement?.courseCreation?.contentRestrictions?.allowedFileTypes || [
            'pdf', 'docx', 'pptx', 'mp4', 'mp3'
          ],
        },
        instructorRequirements: {
          minimumQualification: appSettings?.courseManagement?.courseCreation?.instructorRequirements?.minimumQualification || 'Bachelor\'s',
          professionalCertificationRequired: appSettings?.courseManagement?.courseCreation?.instructorRequirements?.professionalCertificationRequired || false,
        },
        videoConferencing: {
          maxDuration: appSettings?.courseManagement?.courseCreation?.videoConferencing?.maxDuration || {
            0: 1,
            1: 2,
            2: 3,
            3: 4,
            4: 5,
            5: 6
          },
          maxStudents: appSettings?.courseManagement?.courseCreation?.videoConferencing?.maxStudents || {
            0: 10,
            1: 20,
            2: 30,
            3: 40,
            4: 50,
            5: 60
          }
        }
      },
      courseDiscovery: {
        recommendationAlgorithm: {
          enabled: appSettings?.courseManagement?.courseDiscovery?.recommendationAlgorithm?.enabled || true,
          complexity: appSettings?.courseManagement?.courseDiscovery?.recommendationAlgorithm?.complexity || 'medium',
        },
        searchSettings: {
          defaultSortOrder: appSettings?.courseManagement?.courseDiscovery?.searchSettings?.defaultSortOrder || 'popularity',
          enableTagBasedSearch: appSettings?.courseManagement?.courseDiscovery?.searchSettings?.enableTagBasedSearch || true,
        }
      },
      enrollment: {
        maxEnrollmentPerCourse: appSettings?.courseManagement?.enrollment?.maxEnrollmentPerCourse || 100,
        minStudentAge: appSettings?.courseManagement?.enrollment?.minStudentAge || 13,
        waitlistEnabled: appSettings?.courseManagement?.enrollment?.waitlistEnabled || false,
      },
      videoConferencing: {
        maxDuration: appSettings?.courseManagement?.videoConferencing?.maxDuration || {
          0: 1,
          1: 2,
          2: 3,
          3: 4,
          4: 5,
          5: 6
        },
        maxStudents: appSettings?.courseManagement?.videoConferencing?.maxStudents || {
          0: 10,
          1: 20,
          2: 30,
          3: 40,
          4: 50,
          5: 60
        },
        recordingRetention: appSettings?.courseManagement?.videoConferencing?.recordingRetention || 30,
      },
      contentPolicies: {
        maxContentSize: appSettings?.courseManagement?.contentPolicies?.maxContentSize || 1000, // MB
        allowedFileTypes: appSettings?.courseManagement?.contentPolicies?.allowedFileTypes || [
          'pdf', 'docx', 'pptx', 'mp4', 'mp3', 'jpg', 'png'
        ],
        contentModerationEnabled: appSettings?.courseManagement?.contentPolicies?.contentModerationEnabled || false,
      },
      pricing: {
        minCoursePrice: appSettings?.courseManagement?.pricing?.minCoursePrice || 0, // $
        maxCoursePrice: appSettings?.courseManagement?.pricing?.maxCoursePrice || 1000, // $
        platformRevenueShare: appSettings?.courseManagement?.pricing?.platformRevenueShare || 20, // %
        freeCourseLimit: appSettings?.courseManagement?.pricing?.freeCourseLimit || 2,
        subscriptionCoursesEnabled: appSettings?.courseManagement?.pricing?.subscriptionCoursesEnabled || false,
      },
      interaction: {
        maxDiscussionPosts: appSettings?.courseManagement?.interaction?.maxDiscussionPosts || 50,
        peerReviewEnabled: appSettings?.courseManagement?.interaction?.peerReviewEnabled || true,
        groupProjectsAllowed: appSettings?.courseManagement?.interaction?.groupProjectsAllowed || true,
        maxGroupSize: appSettings?.courseManagement?.interaction?.maxGroupSize || 5,
      },
      analytics: {
        progressTrackingLevel: appSettings?.courseManagement?.analytics?.progressTrackingLevel || 'basic',
        predictiveAlertsEnabled: appSettings?.courseManagement?.analytics?.predictiveAlertsEnabled || false,
        engagementScoringWeight: appSettings?.courseManagement?.analytics?.engagementScoringWeight || 50,
      },
      accessibility: {
        closedCaptioningLevel: appSettings?.courseManagement?.accessibility?.closedCaptioningLevel || 'none',
        screenReaderCompatibility: appSettings?.courseManagement?.accessibility?.screenReaderCompatibility || false,
        colorContrastLevel: appSettings?.courseManagement?.accessibility?.colorContrastLevel || 'none',
      },
      certification: {
        certificationEnabled: appSettings?.courseManagement?.certification?.certificationEnabled || false,
        minCompletionThreshold: appSettings?.courseManagement?.certification?.minCompletionThreshold || 80,
        certificationValidity: appSettings?.courseManagement?.certification?.certificationValidity || 12,
      },
      recommendations: {
        algorithmType: appSettings?.courseManagement?.recommendations?.algorithmType || 'collaborative',
        maxRecommendations: appSettings?.courseManagement?.recommendations?.maxRecommendations || 5,
        crossDisciplineEnabled: appSettings?.courseManagement?.recommendations?.crossDisciplineEnabled || false,
      }
    },
    billingEcosystem: {
      pricingConfiguration: {
        currency: appSettings?.billingEcosystem?.pricingConfiguration?.currency || 'USD',
        taxRate: appSettings?.billingEcosystem?.pricingConfiguration?.taxRate || 0,
        subscriptionPlans: appSettings?.billingEcosystem?.pricingConfiguration?.subscriptionPlans || [
          { name: 'Basic', price: 9.99, features: ['access'] },
          { name: 'Pro', price: 19.99, features: ['access', 'advanced'] },
          { name: 'Enterprise', price: 49.99, features: ['access', 'advanced', 'premium'] }
        ],
        discountRules: {
          earlyBirdDiscount: {
            enabled: appSettings?.billingEcosystem?.pricingConfiguration?.discountRules?.earlyBirdDiscount?.enabled || true,
            percentage: appSettings?.billingEcosystem?.pricingConfiguration?.discountRules?.earlyBirdDiscount?.percentage || 10,
          },
          referralProgram: {
            enabled: appSettings?.billingEcosystem?.pricingConfiguration?.discountRules?.referralProgram?.enabled || true,
            referralBonus: appSettings?.billingEcosystem?.pricingConfiguration?.discountRules?.referralProgram?.referralBonus || 5,
          }
        }
      },
      paymentGateways: {
        supportedMethods: appSettings?.billingEcosystem?.paymentGateways?.supportedMethods || [
          'credit_card', 'paypal', 'stripe', 'apple_pay'
        ],
        defaultGateway: appSettings?.billingEcosystem?.paymentGateways?.defaultGateway || 'stripe',
        internationalPayments: {
          enabled: appSettings?.billingEcosystem?.paymentGateways?.internationalPayments?.enabled || true,
          supportedCountries: appSettings?.billingEcosystem?.paymentGateways?.internationalPayments?.supportedCountries || [
            'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'
          ]
        }
      }
    },
    communicationInfrastructure: {
      notificationSettings: {
        email: {
          enabled: appSettings?.communicationInfrastructure?.notificationSettings?.email?.enabled || true,
          defaultTemplates: appSettings?.communicationInfrastructure?.notificationSettings?.email?.defaultTemplates || {
            welcome: 'default_welcome_template',
            courseReminder: 'default_course_reminder_template'
          },
          sendFrequency: appSettings?.communicationInfrastructure?.notificationSettings?.email?.sendFrequency || 'daily'
        },
        push: {
          enabled: appSettings?.communicationInfrastructure?.notificationSettings?.push?.enabled || true,
          platforms: appSettings?.communicationInfrastructure?.notificationSettings?.push?.platforms || ['web', 'mobile'],
          priorityNotifications: appSettings?.communicationInfrastructure?.notificationSettings?.push?.priorityNotifications || ['course_update', 'deadline']
        },
        sms: {
          enabled: appSettings?.communicationInfrastructure?.notificationSettings?.sms?.enabled || false,
          twilioIntegration: {
            accountSid: appSettings?.communicationInfrastructure?.notificationSettings?.sms?.twilioIntegration?.accountSid || '',
            authToken: appSettings?.communicationInfrastructure?.notificationSettings?.sms?.twilioIntegration?.authToken || ''
          }
        }
      },
      communicationChannels: {
        inAppMessaging: {
          enabled: appSettings?.communicationInfrastructure?.communicationChannels?.inAppMessaging?.enabled || true,
          maxMessageLength: appSettings?.communicationInfrastructure?.communicationChannels?.inAppMessaging?.maxMessageLength || 500
        },
        discussionForums: {
          enabled: appSettings?.communicationInfrastructure?.communicationChannels?.discussionForums?.enabled || true,
          moderationLevel: appSettings?.communicationInfrastructure?.communicationChannels?.discussionForums?.moderationLevel || 'automatic'
        }
      }
    },
    advancedSettings: {
      featureFlags: {
        betaFeatures: appSettings?.advancedSettings?.featureFlags?.betaFeatures || false,
        experimentalFeatures: appSettings?.advancedSettings?.featureFlags?.experimentalFeatures || [],
      },
      performanceMonitoring: {
        enabled: appSettings?.advancedSettings?.performanceMonitoring?.enabled || false,
        logLevel: appSettings?.advancedSettings?.performanceMonitoring?.logLevel || 'warn',
        performanceThresholds: {
          apiResponseTime: appSettings?.advancedSettings?.performanceMonitoring?.performanceThresholds?.apiResponseTime || 500, // ms
          databaseQueryTime: appSettings?.advancedSettings?.performanceMonitoring?.performanceThresholds?.databaseQueryTime || 200 // ms
        }
      },
      systemIntegrations: {
        thirdPartyServices: {
          analyticsProvider: appSettings?.advancedSettings?.systemIntegrations?.thirdPartyServices?.analyticsProvider || 'google_analytics',
          crashReporting: {
            enabled: appSettings?.advancedSettings?.systemIntegrations?.thirdPartyServices?.crashReporting?.enabled || true,
            provider: appSettings?.advancedSettings?.systemIntegrations?.thirdPartyServices?.crashReporting?.provider || 'sentry'
          }
        },
        apiKeys: {
          googleMaps: appSettings?.advancedSettings?.systemIntegrations?.apiKeys?.googleMaps || '',
          openAI: appSettings?.advancedSettings?.systemIntegrations?.apiKeys?.openAI || ''
        }
      }
    }
  });
  const toast = useToast();

  const handleSettingChange = (path, value) => {
    const updateNestedSetting = (obj, path, value) => {
      const keys = path.split('.');
      const lastKey = keys.pop();
      const target = keys.reduce((o, key) => o[key], obj);
      target[lastKey] = value;
      return obj;
    };

    const updatedSettings = updateNestedSetting({ ...localSettings }, path, value);
    setLocalSettings(updatedSettings);
  };

  const saveSettings = () => {
    const success = updateSettings(localSettings);
    if (success) {
      toast({
        title: "Settings Updated",
        description: "Your platform settings have been successfully saved.",
        status: "success",
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Box p={6} bg="gray.50" borderRadius="lg" pt={18} mt={16}>
      <Tabs 
        variant="enclosed-colored" 
        colorScheme="red" 
        isLazy 
        size="lg"
        orientation="vertical"
      >
        <TabList 
          width="250px" 
          bg="white" 
          boxShadow="xl" 
          borderRadius="lg" 
          p={2}
          position="sticky" 
          top="20px"
        >
          <VStack spacing={4} align="stretch" width="full">
            <Tab 
              justifyContent="start" 
              _selected={{ bg: "red.50", borderRight: "4px solid", borderColor: "red.500" }}
            >
              <HStack>
                <Icon as={FaGlobeAmericas} mr={2} />
                <Text fontWeight="bold">Global Platform</Text>
              </HStack>
            </Tab>
            <Tab 
              justifyContent="start" 
              _selected={{ bg: "red.50", borderRight: "4px solid", borderColor: "red.500" }}
            >
              <HStack>
                <Icon as={FaUserCog} mr={2} />
                <Text fontWeight="bold">User Management</Text>
              </HStack>
            </Tab>
            <Tab 
              justifyContent="start" 
              _selected={{ bg: "red.50", borderRight: "4px solid", borderColor: "red.500" }}
            >
              <HStack>
                <Icon as={FaShieldAlt} mr={2} />
                <Text fontWeight="bold">Security Framework</Text>
              </HStack>
            </Tab>
            <Tab 
              justifyContent="start" 
              _selected={{ bg: "red.50", borderRight: "4px solid", borderColor: "red.500" }}
            >
              <HStack>
                <Icon as={FaBook} mr={2} />
                <Text fontWeight="bold">Course Management</Text>
              </HStack>
            </Tab>
            <Tab 
              justifyContent="start" 
              _selected={{ bg: "red.50", borderRight: "4px solid", borderColor: "red.500" }}
            >
              <HStack>
                <Icon as={FaCreditCard} mr={2} />
                <Text fontWeight="bold">Billing Ecosystem</Text>
              </HStack>
            </Tab>
            <Tab 
              justifyContent="start" 
              _selected={{ bg: "red.50", borderRight: "4px solid", borderColor: "red.500" }}
            >
              <HStack>
                <Icon as={FaNetworkWired} mr={2} />
                <Text fontWeight="bold">Communication</Text>
              </HStack>
            </Tab>
            <Tab 
              justifyContent="start" 
              _selected={{ bg: "red.50", borderRight: "4px solid", borderColor: "red.500" }}
            >
              <HStack>
                <Icon as={FaCogs} mr={2} />
                <Text fontWeight="bold">Advanced Settings</Text>
              </HStack>
            </Tab>
          </VStack>
        </TabList>

        <TabPanels ml={6} bg="white" borderRadius="lg" boxShadow="xl" p={6}>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Accordion allowMultiple>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Platform Identity
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Platform Name</FormLabel>
                          <Input 
                            value={localSettings.globalPlatform?.appName}
                            onChange={(e) => handleSettingChange(
                              'globalPlatform.appName', 
                              e.target.value
                            )}
                            placeholder="Dashboard LMS"
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Brand Tagline</FormLabel>
                          <Input 
                            value={localSettings.globalPlatform?.brandTagline}
                            onChange={(e) => handleSettingChange(
                              'globalPlatform.brandTagline', 
                              e.target.value
                            )}
                            placeholder="Empowering Global Learning"
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Logo Upload</FormLabel>
                          <Input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleSettingChange(
                                  'globalPlatform.logoUrl', 
                                  reader.result
                                );
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Internationalization
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Supported Languages</FormLabel>
                          <Select
                            isMulti
                            value={localSettings.globalPlatform?.supportedLanguages?.map(lang => ({ 
                              value: lang, 
                              label: lang.toUpperCase() 
                            }))}
                            onChange={(selectedOptions) => handleSettingChange(
                              'globalPlatform.supportedLanguages', 
                              selectedOptions.map(option => option.value)
                            )}
                            options={[
                              { value: 'en', label: 'EN' },
                              { value: 'es', label: 'ES' },
                              { value: 'fr', label: 'FR' },
                              { value: 'de', label: 'DE' },
                              { value: 'zh', label: 'ZH' },
                              { value: 'ar', label: 'AR' },
                              { value: 'hi', label: 'HI' },
                              { value: 'pt', label: 'PT' },
                              { value: 'ru', label: 'RU' },
                            ]}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Default Language</FormLabel>
                          <Select
                            value={{
                              value: localSettings.globalPlatform?.defaultLanguage, 
                              label: localSettings.globalPlatform?.defaultLanguage?.toUpperCase()
                            }}
                            onChange={(selectedOption) => handleSettingChange(
                              'globalPlatform.defaultLanguage', 
                              selectedOption.value
                            )}
                            options={[
                              { value: 'en', label: 'EN' },
                              { value: 'es', label: 'ES' },
                              { value: 'fr', label: 'FR' },
                              { value: 'de', label: 'DE' },
                              { value: 'zh', label: 'ZH' },
                              { value: 'ar', label: 'AR' },
                            ]}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>RTL Languages</FormLabel>
                          <Select
                            isMulti
                            value={localSettings.globalPlatform?.rtlLanguages?.map(lang => ({ 
                              value: lang, 
                              label: lang.toUpperCase() 
                            }))}
                            onChange={(selectedOptions) => handleSettingChange(
                              'globalPlatform.rtlLanguages', 
                              selectedOptions.map(option => option.value)
                            )}
                            options={[
                              { value: 'ar', label: 'AR' },
                              { value: 'fa', label: 'FA' },
                              { value: 'he', label: 'HE' },
                              { value: 'ur', label: 'UR' },
                            ]}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Maintenance & Performance
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Maintenance Mode</FormLabel>
                          <Switch
                            isChecked={localSettings.globalPlatform?.maintenanceMode?.enabled}
                            onChange={(e) => handleSettingChange(
                              'globalPlatform.maintenanceMode.enabled', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Maintenance Message</FormLabel>
                          <Input 
                            value={localSettings.globalPlatform?.maintenanceMode?.message}
                            onChange={(e) => handleSettingChange(
                              'globalPlatform.maintenanceMode.message', 
                              e.target.value
                            )}
                            placeholder="Platform under scheduled maintenance"
                            isDisabled={!localSettings.globalPlatform?.maintenanceMode?.enabled}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Max Concurrent Users</FormLabel>
                          <NumberInput
                            value={localSettings.globalPlatform?.maxConcurrentUsers}
                            onChange={(value) => handleSettingChange(
                              'globalPlatform.maxConcurrentUsers', 
                              parseInt(value)
                            )}
                            min={10}
                            max={10000}
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

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Registration & Access
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Public Registration</FormLabel>
                          <Switch
                            isChecked={localSettings.globalPlatform?.publicRegistration?.enabled}
                            onChange={(e) => handleSettingChange(
                              'globalPlatform.publicRegistration.enabled', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Email Verification Required</FormLabel>
                          <Switch
                            isChecked={localSettings.globalPlatform?.publicRegistration?.requireEmailVerification}
                            onChange={(e) => handleSettingChange(
                              'globalPlatform.publicRegistration.requireEmailVerification', 
                              e.target.checked
                            )}
                            isDisabled={!localSettings.globalPlatform?.publicRegistration?.enabled}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Allowed Domains</FormLabel>
                          <Textarea
                            value={localSettings.globalPlatform?.publicRegistration?.allowedDomains?.join(', ')}
                            onChange={(e) => handleSettingChange(
                              'globalPlatform.publicRegistration.allowedDomains', 
                              e.target.value.split(',').map(domain => domain.trim())
                            )}
                            placeholder="Enter domains separated by comma"
                            isDisabled={!localSettings.globalPlatform?.publicRegistration?.enabled}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Advanced Settings
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <GlobalPlatformAdvancedSettings 
                      settings={localSettings.globalPlatform}
                      handleSettingChange={handleSettingChange}
                    />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Accordion allowMultiple>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      User Profile Management
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Profile Picture Settings</FormLabel>
                          <VStack align="stretch">
                            <NumberInput placeholder="Max Size (MB)" />
                            <Select placeholder="Allowed Image Types" multiple />
                          </VStack>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Profile Verification</FormLabel>
                          <VStack align="stretch">
                            <Switch />
                            <Select placeholder="Verification Method" />
                          </VStack>
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Advanced Settings
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <UserManagementAdvancedSettings 
                      settings={localSettings.userManagement}
                      handleSettingChange={handleSettingChange}
                    />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Accordion allowMultiple>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Network Security
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>IP Whitelisting</FormLabel>
                          <Switch />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Max Concurrent Sessions</FormLabel>
                          <NumberInput />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Advanced Settings
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <SecurityFrameworkSettings 
                      settings={localSettings.securityFramework}
                      handleSettingChange={handleSettingChange}
                    />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Accordion allowMultiple>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Course Creation Policies
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Max Courses per Instructor</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.courseCreation.maxCoursesPerInstructor}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.courseCreation.maxCoursesPerInstructor', 
                              parseInt(value)
                            )}
                            min={1}
                            max={20}
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
                          <FormLabel>Min Course Duration (weeks)</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.courseCreation.minCourseDuration}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.courseCreation.minCourseDuration', 
                              parseInt(value)
                            )}
                            min={1}
                            max={52}
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
                          <FormLabel>Max Course Duration (weeks)</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.courseCreation.maxCourseDuration}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.courseCreation.maxCourseDuration', 
                              parseInt(value)
                            )}
                            min={1}
                            max={52}
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

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Video Conferencing Settings
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Max Video Conferencing Duration (hours)</FormLabel>
                          <VStack spacing={4} align="stretch">
                            {[0, 1, 2, 3, 4, 5].map(level => (
                              <HStack key={level} spacing={3}>
                                <Text flex={1}>Level {level}:</Text>
                                <NumberInput
                                  value={localSettings.courseManagement.videoConferencing?.maxDuration?.[level] || 0}
                                  onChange={(value) => handleSettingChange(
                                    `courseManagement.videoConferencing.maxDuration.${level}`, 
                                    parseFloat(value)
                                  )}
                                  min={0}
                                  max={24}
                                  step={0.5}
                                  precision={1}
                                >
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                              </HStack>
                            ))}
                          </VStack>
                        </FormControl>
                      </GridItem>

                      <GridItem>
                        <FormControl>
                          <FormLabel>Max Students in Video Conference</FormLabel>
                          <VStack spacing={4} align="stretch">
                            {[0, 1, 2, 3, 4, 5].map(level => (
                              <HStack key={level} spacing={3}>
                                <Text flex={1}>Level {level}:</Text>
                                <NumberInput
                                  value={localSettings.courseManagement.videoConferencing?.maxStudents?.[level] || 0}
                                  onChange={(value) => handleSettingChange(
                                    `courseManagement.videoConferencing.maxStudents.${level}`, 
                                    parseInt(value)
                                  )}
                                  min={0}
                                  max={500}
                                >
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                              </HStack>
                            ))}
                          </VStack>
                        </FormControl>
                      </GridItem>

                      <GridItem>
                        <FormControl>
                          <FormLabel>Recording Retention (days)</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.videoConferencing?.recordingRetention}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.videoConferencing.recordingRetention', 
                              parseInt(value)
                            )}
                            min={0}
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
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Course Enrollment Policies
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Max Enrollment per Course</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.enrollment?.maxEnrollmentPerCourse}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.enrollment.maxEnrollmentPerCourse', 
                              parseInt(value)
                            )}
                            min={1}
                            max={1000}
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
                          <FormLabel>Min Student Age</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.enrollment?.minStudentAge}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.enrollment.minStudentAge', 
                              parseInt(value)
                            )}
                            min={13}
                            max={21}
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
                          <FormLabel>Waitlist Enabled</FormLabel>
                          <Switch
                            isChecked={localSettings.courseManagement.enrollment?.waitlistEnabled}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.enrollment.waitlistEnabled', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Instructor Requirements
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Minimum Qualification</FormLabel>
                          <Select
                            value={localSettings.courseManagement.courseCreation.instructorRequirements?.minimumQualification}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.courseCreation.instructorRequirements.minimumQualification', 
                              e.target.value
                            )}
                          >
                            <option value="High School">High School</option>
                            <option value="Bachelor's">Bachelor's</option>
                            <option value="Master's">Master's</option>
                            <option value="PhD">PhD</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Professional Certification Required</FormLabel>
                          <Switch
                            isChecked={localSettings.courseManagement.courseCreation.instructorRequirements?.professionalCertificationRequired}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.courseCreation.instructorRequirements.professionalCertificationRequired', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Min Teaching Experience (years)</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.courseCreation.instructorRequirements?.minTeachingExperience}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.courseCreation.instructorRequirements.minTeachingExperience', 
                              parseInt(value)
                            )}
                            min={0}
                            max={20}
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

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Course Content Policies
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Max Course Content Size (MB)</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.contentPolicies?.maxContentSize}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.contentPolicies.maxContentSize', 
                              parseInt(value)
                            )}
                            min={100}
                            max={10000}
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
                          <FormLabel>Allowed File Types</FormLabel>
                          <Select
                            isMulti
                            value={localSettings.courseManagement.contentPolicies?.allowedFileTypes}
                            onChange={(selectedOptions) => handleSettingChange(
                              'courseManagement.contentPolicies.allowedFileTypes', 
                              selectedOptions.map(option => option.value)
                            )}
                            options={[
                              { value: 'pdf', label: 'PDF' },
                              { value: 'docx', label: 'DOCX' },
                              { value: 'pptx', label: 'PPTX' },
                              { value: 'mp4', label: 'MP4' },
                              { value: 'mp3', label: 'MP3' },
                              { value: 'jpg', label: 'JPG' },
                              { value: 'png', label: 'PNG' },
                            ]}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Content Moderation</FormLabel>
                          <Switch
                            isChecked={localSettings.courseManagement.contentPolicies?.contentModerationEnabled}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.contentPolicies.contentModerationEnabled', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Course Pricing and Monetization
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Min Course Price ($)</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.pricing?.minCoursePrice}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.pricing.minCoursePrice', 
                              parseFloat(value)
                            )}
                            min={0}
                            max={1000}
                            precision={2}
                            step={5}
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
                          <FormLabel>Max Course Price ($)</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.pricing?.maxCoursePrice}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.pricing.maxCoursePrice', 
                              parseFloat(value)
                            )}
                            min={0}
                            max={10000}
                            precision={2}
                            step={50}
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
                          <FormLabel>Platform Revenue Share (%)</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.pricing?.platformRevenueShare}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.pricing.platformRevenueShare', 
                              parseFloat(value)
                            )}
                            min={0}
                            max={50}
                            precision={1}
                            step={1}
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
                          <FormLabel>Free Course Limit</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.pricing?.freeCourseLimit}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.pricing.freeCourseLimit', 
                              parseInt(value)
                            )}
                            min={0}
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
                      <GridItem>
                        <FormControl>
                          <FormLabel>Subscription Courses</FormLabel>
                          <Switch
                            isChecked={localSettings.courseManagement.pricing?.subscriptionCoursesEnabled}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.pricing.subscriptionCoursesEnabled', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Course Interaction and Engagement
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Max Discussion Posts per Week</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.interaction?.maxDiscussionPosts}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.interaction.maxDiscussionPosts', 
                              parseInt(value)
                            )}
                            min={0}
                            max={100}
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
                          <FormLabel>Peer Review Enabled</FormLabel>
                          <Switch
                            isChecked={localSettings.courseManagement.interaction?.peerReviewEnabled}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.interaction.peerReviewEnabled', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Group Projects Allowed</FormLabel>
                          <Switch
                            isChecked={localSettings.courseManagement.interaction?.groupProjectsAllowed}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.interaction.groupProjectsAllowed', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Max Group Size</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.interaction?.maxGroupSize}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.interaction.maxGroupSize', 
                              parseInt(value)
                            )}
                            min={2}
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

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Advanced Learning Analytics
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Progress Tracking Granularity</FormLabel>
                          <Select
                            value={localSettings.courseManagement.analytics?.progressTrackingLevel}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.analytics.progressTrackingLevel', 
                              e.target.value
                            )}
                          >
                            <option value="basic">Basic</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Predictive Performance Alerts</FormLabel>
                          <Switch
                            isChecked={localSettings.courseManagement.analytics?.predictiveAlertsEnabled}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.analytics.predictiveAlertsEnabled', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Engagement Scoring Weight</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.analytics?.engagementScoringWeight}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.analytics.engagementScoringWeight', 
                              parseFloat(value)
                            )}
                            min={0}
                            max={100}
                            precision={1}
                            step={1}
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

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Accessibility and Inclusivity
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Closed Captioning Requirement</FormLabel>
                          <Select
                            value={localSettings.courseManagement.accessibility?.closedCaptioningLevel}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.accessibility.closedCaptioningLevel', 
                              e.target.value
                            )}
                          >
                            <option value="none">Not Required</option>
                            <option value="recommended">Recommended</option>
                            <option value="mandatory">Mandatory</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Screen Reader Compatibility</FormLabel>
                          <Switch
                            isChecked={localSettings.courseManagement.accessibility?.screenReaderCompatibility}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.accessibility.screenReaderCompatibility', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Color Contrast Compliance</FormLabel>
                          <Select
                            value={localSettings.courseManagement.accessibility?.colorContrastLevel}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.accessibility.colorContrastLevel', 
                              e.target.value
                            )}
                          >
                            <option value="wcag-aa">WCAG AA</option>
                            <option value="wcag-aaa">WCAG AAA</option>
                            <option value="none">Not Required</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Certification and Compliance
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Certification Generation</FormLabel>
                          <Switch
                            isChecked={localSettings.courseManagement.certification?.certificationEnabled}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.certification.certificationEnabled', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Min Completion Threshold (%)</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.certification?.minCompletionThreshold}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.certification.minCompletionThreshold', 
                              parseFloat(value)
                            )}
                            min={50}
                            max={100}
                            precision={1}
                            step={1}
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
                          <FormLabel>Certification Validity (months)</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.certification?.certificationValidity}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.certification.certificationValidity', 
                              parseInt(value)
                            )}
                            min={0}
                            max={60}
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

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Global Course Recommendations
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Recommendation Algorithm</FormLabel>
                          <Select
                            value={localSettings.courseManagement.recommendations?.algorithmType}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.recommendations.algorithmType', 
                              e.target.value
                            )}
                          >
                            <option value="collaborative">Collaborative Filtering</option>
                            <option value="content-based">Content-Based</option>
                            <option value="hybrid">Hybrid</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Max Recommendations</FormLabel>
                          <NumberInput
                            value={localSettings.courseManagement.recommendations?.maxRecommendations}
                            onChange={(value) => handleSettingChange(
                              'courseManagement.recommendations.maxRecommendations', 
                              parseInt(value)
                            )}
                            min={1}
                            max={20}
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
                          <FormLabel>Cross-Discipline Recommendations</FormLabel>
                          <Switch
                            isChecked={localSettings.courseManagement.recommendations?.crossDisciplineEnabled}
                            onChange={(e) => handleSettingChange(
                              'courseManagement.recommendations.crossDisciplineEnabled', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Accordion allowMultiple>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Payment Processing
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Payment Gateways</FormLabel>
                          <Select
                            isMulti
                            value={localSettings.billingEcosystem.paymentProcessing?.activeGateways}
                            onChange={(selectedOptions) => handleSettingChange(
                              'billingEcosystem.paymentProcessing.activeGateways', 
                              selectedOptions.map(option => option.value)
                            )}
                            options={[
                              { value: 'stripe', label: 'Stripe' },
                              { value: 'paypal', label: 'PayPal' },
                              { value: 'apple-pay', label: 'Apple Pay' },
                              { value: 'google-pay', label: 'Google Pay' },
                              { value: 'bank-transfer', label: 'Bank Transfer' },
                            ]}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Currency Support</FormLabel>
                          <Select
                            isMulti
                            value={localSettings.billingEcosystem.paymentProcessing?.supportedCurrencies}
                            onChange={(selectedOptions) => handleSettingChange(
                              'billingEcosystem.paymentProcessing.supportedCurrencies', 
                              selectedOptions.map(option => option.value)
                            )}
                            options={[
                              { value: 'USD', label: 'USD' },
                              { value: 'EUR', label: 'EUR' },
                              { value: 'GBP', label: 'GBP' },
                              { value: 'JPY', label: 'JPY' },
                              { value: 'CAD', label: 'CAD' },
                            ]}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Tax Calculation Method</FormLabel>
                          <Select
                            value={localSettings.billingEcosystem.paymentProcessing?.taxCalculationMethod}
                            onChange={(e) => handleSettingChange(
                              'billingEcosystem.paymentProcessing.taxCalculationMethod', 
                              e.target.value
                            )}
                          >
                            <option value="flat-rate">Flat Rate</option>
                            <option value="geolocation">Geolocation-Based</option>
                            <option value="custom">Custom Rules</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Pricing and Subscription Models
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Subscription Tiers</FormLabel>
                          <Select
                            isMulti
                            value={localSettings.billingEcosystem.subscriptions?.activeTiers}
                            onChange={(selectedOptions) => handleSettingChange(
                              'billingEcosystem.subscriptions.activeTiers', 
                              selectedOptions.map(option => option.value)
                            )}
                            options={[
                              { value: 'basic', label: 'Basic' },
                              { value: 'pro', label: 'Pro' },
                              { value: 'enterprise', label: 'Enterprise' },
                              { value: 'academic', label: 'Academic' },
                            ]}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Free Trial Duration (days)</FormLabel>
                          <NumberInput
                            value={localSettings.billingEcosystem.subscriptions?.freeTrialDuration}
                            onChange={(value) => handleSettingChange(
                              'billingEcosystem.subscriptions.freeTrialDuration', 
                              parseInt(value)
                            )}
                            min={0}
                            max={90}
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
                          <FormLabel>Automatic Renewal</FormLabel>
                          <Switch
                            isChecked={localSettings.billingEcosystem.subscriptions?.automaticRenewalEnabled}
                            onChange={(e) => handleSettingChange(
                              'billingEcosystem.subscriptions.automaticRenewalEnabled', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Refund and Cancellation Policies
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Refund Window (days)</FormLabel>
                          <NumberInput
                            value={localSettings.billingEcosystem.refundPolicies?.refundWindowDays}
                            onChange={(value) => handleSettingChange(
                              'billingEcosystem.refundPolicies.refundWindowDays', 
                              parseInt(value)
                            )}
                            min={0}
                            max={90}
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
                          <FormLabel>Refund Percentage</FormLabel>
                          <NumberInput
                            value={localSettings.billingEcosystem.refundPolicies?.refundPercentage}
                            onChange={(value) => handleSettingChange(
                              'billingEcosystem.refundPolicies.refundPercentage', 
                              parseFloat(value)
                            )}
                            min={0}
                            max={100}
                            precision={1}
                            step={1}
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
                          <FormLabel>Partial Course Refund</FormLabel>
                          <Switch
                            isChecked={localSettings.billingEcosystem.refundPolicies?.partialCourseRefundEnabled}
                            onChange={(e) => handleSettingChange(
                              'billingEcosystem.refundPolicies.partialCourseRefundEnabled', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Financial Reporting and Analytics
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Revenue Recognition Method</FormLabel>
                          <Select
                            value={localSettings.billingEcosystem.financialReporting?.revenueRecognitionMethod}
                            onChange={(e) => handleSettingChange(
                              'billingEcosystem.financialReporting.revenueRecognitionMethod', 
                              e.target.value
                            )}
                          >
                            <option value="completion">Course Completion</option>
                            <option value="time-based">Time-Based</option>
                            <option value="milestone">Milestone-Based</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Financial Reporting Frequency</FormLabel>
                          <Select
                            value={localSettings.billingEcosystem.financialReporting?.reportingFrequency}
                            onChange={(e) => handleSettingChange(
                              'billingEcosystem.financialReporting.reportingFrequency', 
                              e.target.value
                            )}
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Export Detailed Financial Reports</FormLabel>
                          <Switch
                            isChecked={localSettings.billingEcosystem.financialReporting?.detailedReportsEnabled}
                            onChange={(e) => handleSettingChange(
                              'billingEcosystem.financialReporting.detailedReportsEnabled', 
                              e.target.checked
                            )}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
          </TabPanel>

          <TabPanel>
            <CommunicationSettings 
              settings={localSettings.communicationInfrastructure}
              handleSettingChange={handleSettingChange}
            />
          </TabPanel>
          <TabPanel>
            <AdvancedPlatformSettings 
              localSettings={localSettings}
              handleSettingChange={handleSettingChange}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex mt={6} justifyContent="space-between">
        <Button 
          leftIcon={<FaUndo />} 
          colorScheme="red" 
          variant="outline"
          onClick={() => resetToDefaultSettings()}
        >
          Reset to Defaults
        </Button>
        <Button 
          rightIcon={<FaSave />} 
          colorScheme="red"
          onClick={saveSettings}
        >
          Save Settings
        </Button>
      </Flex>
    </Box>
  );
};

export default AdminSettingsPage;
