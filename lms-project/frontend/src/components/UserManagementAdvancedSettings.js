import React, { useState } from 'react';
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
  TagCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { 
  FaUserCog, 
  FaShieldAlt, 
  FaUserLock, 
  FaUserTimes,
  FaBalanceScale,
  FaChartLine,
  FaGavel,
  FaUserGraduate,
  FaUserFriends,
  FaClipboardList,
  FaAward,
  FaChalkboardTeacher,
  FaLanguage,
  FaGlobeAmericas
} from 'react-icons/fa';

const UserManagementAdvancedSettings = ({ 
  localSettings = {}, 
  handleSettingChange 
}) => {
  const [isCustomRoleModalOpen, setIsCustomRoleModalOpen] = useState(false);
  const [newCustomRole, setNewCustomRole] = useState({
    name: '',
    description: '',
    permissions: []
  });

  // Expanded user management settings
  const userManagement = localSettings.userManagement || {
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
    },
    roleBasedAccess: {
      granularPermissions: true,
      customRoleCreationEnabled: true,
      roleHierarchy: [
        { name: 'student', inheritsFrom: null },
        { name: 'instructor', inheritsFrom: 'student' },
        { name: 'admin', inheritsFrom: null }
      ]
    },
    complianceAndEthics: {
      codeOfConductAgreementRequired: true,
      ethicalUseTraining: {
        mandatory: true,
        frequency: 'annual'
      },
      userReportingMechanism: {
        enabled: true,
        anonymousReportingAllowed: true
      }
    },
    performanceAndEngagement: {
      userActivityScoring: {
        enabled: true,
        scoringAlgorithm: 'comprehensive',
        weightFactors: {
          courseCompletion: 0.3,
          discussionParticipation: 0.2,
          peerInteractions: 0.2,
          assignmentQuality: 0.3
        }
      },
      userProgressTracking: {
        granularity: 'detailed',
        predictiveAlerts: {
          enabled: true,
          riskThresholds: {
            lowRisk: 0.3,
            mediumRisk: 0.6,
            highRisk: 0.9
          }
        }
      }
    },
    userRestrictionPolicies: {
      simultaneousDeviceLimit: 3,
      geographicAccessControl: {
        enabled: false,
        allowedCountries: [],
        blockedCountries: []
      },
      vpnAndProxyDetection: {
        enabled: true,
        blockUnauthorizedAccess: true
      }
    },
    professionalDevelopment: {
      recommendationEngine: {
        enabled: true,
        algorithmType: 'hybrid',
        personalizedLearningPathways: true
      },
      continuousLearningCredits: {
        trackingEnabled: true,
        minimumAnnualCredits: 10,
        creditTypes: [
          'course_completion',
          'skill_certification',
          'professional_workshop'
        ]
      }
    },
    userOnboarding: {
      welcomeEmailTemplate: {
        enabled: true,
        customizationLevel: 'advanced',
        supportedLanguages: ['en', 'es', 'fr', 'de', 'zh']
      },
      initialSetupWizard: {
        enabled: true,
        steps: [
          'profile_completion',
          'learning_preferences',
          'goal_setting',
          'skill_assessment'
        ]
      },
      referralProgram: {
        enabled: true,
        referralBonus: {
          type: 'learning_credits',
          amount: 50
        },
        maxReferralsPerUser: 10
      }
    },
    learningProfileManagement: {
      skillTracking: {
        enabled: true,
        trackingGranularity: 'micro-skill',
        automaticSkillInference: true,
        skillVerificationMethods: [
          'self_assessment',
          'peer_validation',
          'instructor_verification'
        ]
      },
      careerPathwayMapping: {
        enabled: true,
        recommendationAlgorithm: 'hybrid',
        externalJobMarketIntegration: true
      },
      continuousLearningAssessment: {
        enabled: true,
        assessmentFrequency: 'quarterly',
        competencyFramework: 'custom',
        progressVisualization: 'radar_chart'
      }
    },
    collaborativelearningControls: {
      peerLearningNetworks: {
        enabled: true,
        networkFormationAlgorithm: 'skill_compatibility',
        maxNetworkSize: 15,
        recommendationIntensity: 'high'
      },
      groupDynamicsAnalytics: {
        enabled: true,
        metricsTracked: [
          'participation_rate',
          'knowledge_transfer',
          'collaborative_problem_solving'
        ],
        interventionThresholds: {
          lowEngagement: 0.3,
          conflictPotential: 0.6
        }
      },
      crossCulturalLearning: {
        enabled: true,
        globalTeamFormation: true,
        languageExchangeProgram: true,
        culturalCompetenceTraining: true
      }
    },
    advancedRoleManagement: {
      dynamicRoleAssignment: {
        enabled: true,
        criteria: [
          'learning_progress',
          'skill_mastery',
          'project_contributions'
        ],
        automaticPromotion: true
      },
      customRoles: [],
      roleTransitionWorkflows: {
        enabled: true,
        approvalRequired: true,
        notificationChannels: ['email', 'platform_notification']
      }
    },
    internationalUserSupport: {
      multiLanguageSupport: {
        defaultLanguage: 'en',
        supportedLanguages: [
          'en', 'es', 'fr', 'de', 'zh', 
          'ar', 'hi', 'pt', 'ru', 'ja'
        ],
        automaticTranslation: {
          enabled: true,
          accuracy: 'high'
        }
      },
      regionalComplianceProfiles: {
        gdprRegions: ['EU'],
        ccpaRegions: ['California'],
        customRegionalSettings: []
      },
      timeZoneHandling: {
        defaultTimeZone: 'UTC',
        userPreferredTimeZone: true,
        dynamicScheduling: true
      }
    },
    gamificationAndMotivation: {
      achievementSystem: {
        enabled: true,
        badgeCategories: [
          'skill_mastery',
          'course_completion',
          'community_contribution'
        ],
        tierLevels: 5
      },
      motivationalFramework: {
        algorithm: 'personalized_nudge',
        interventionTypes: [
          'progress_reminder',
          'challenge_recommendation',
          'peer_encouragement'
        ]
      },
      competitiveElements: {
        leaderboards: true,
        weeklyChallenge: true,
        crossPlatformAchievements: true
      }
    }
  };

  const handleAddCustomRole = () => {
    if (newCustomRole.name && newCustomRole.permissions.length > 0) {
      const updatedCustomRoles = [
        ...userManagement.advancedRoleManagement.customRoles, 
        newCustomRole
      ];
      
      handleSettingChange(
        'userManagement.advancedRoleManagement.customRoles', 
        updatedCustomRoles
      );
      
      setIsCustomRoleModalOpen(false);
      setNewCustomRole({ name: '', description: '', permissions: [] });
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Accordion allowMultiple>
        {/* Registration Policies */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaUserCog} mr={2} />
              Registration Policies
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Minimum Age</FormLabel>
                  <NumberInput
                    value={userManagement.registrationPolicies.minAge}
                    onChange={(value) => handleSettingChange(
                      'userManagement.registrationPolicies.minAge', 
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
                  <FormLabel>Maximum Age</FormLabel>
                  <NumberInput
                    value={userManagement.registrationPolicies.maxAge}
                    onChange={(value) => handleSettingChange(
                      'userManagement.registrationPolicies.maxAge', 
                      parseInt(value)
                    )}
                    min={18}
                    max={120}
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
                  <FormLabel>Required Registration Fields</FormLabel>
                  <CheckboxGroup
                    value={userManagement.registrationPolicies.requiredFields}
                    onChange={(selectedFields) => handleSettingChange(
                      'userManagement.registrationPolicies.requiredFields', 
                      selectedFields
                    )}
                  >
                    <Stack spacing={2} direction="column">
                      <Checkbox value="email">Email</Checkbox>
                      <Checkbox value="name">Full Name</Checkbox>
                      <Checkbox value="password">Password</Checkbox>
                      <Checkbox value="phone">Phone Number</Checkbox>
                      <Checkbox value="country">Country</Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* Verification & Authentication */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaShieldAlt} mr={2} />
              Verification & Authentication
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Email Verification</FormLabel>
                  <Switch
                    isChecked={userManagement.registrationPolicies.emailVerification.required}
                    onChange={(e) => handleSettingChange(
                      'userManagement.registrationPolicies.emailVerification.required', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Email Verification Method</FormLabel>
                  <Select
                    value={userManagement.registrationPolicies.emailVerification.method}
                    onChange={(e) => handleSettingChange(
                      'userManagement.registrationPolicies.emailVerification.method', 
                      e.target.value
                    )}
                    isDisabled={!userManagement.registrationPolicies.emailVerification.required}
                  >
                    <option value="link">Verification Link</option>
                    <option value="code">Verification Code</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Verification Link Expiration</FormLabel>
                  <NumberInput
                    value={userManagement.registrationPolicies.emailVerification.expirationHours}
                    onChange={(value) => handleSettingChange(
                      'userManagement.registrationPolicies.emailVerification.expirationHours', 
                      parseInt(value)
                    )}
                    min={1}
                    max={168} // 1 week
                    isDisabled={!userManagement.registrationPolicies.emailVerification.required}
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

        {/* Account Lifecycle Management */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaUserLock} mr={2} />
              Account Lifecycle
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Inactivity Timeout</FormLabel>
                  <NumberInput
                    value={userManagement.accountLifecycle.inactivityTimeout}
                    onChange={(value) => handleSettingChange(
                      'userManagement.accountLifecycle.inactivityTimeout', 
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
                  <FormLabel fontSize="xs" color="gray.500">
                    Days before account is considered inactive
                  </FormLabel>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>
                    <Tooltip label="Automatically delete accounts that have been inactive">
                      Automatic Account Deletion
                    </Tooltip>
                  </FormLabel>
                  <Switch
                    isChecked={userManagement.accountLifecycle.automaticAccountDeletion}
                    onChange={(e) => handleSettingChange(
                      'userManagement.accountLifecycle.automaticAccountDeletion', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Account Recovery Methods</FormLabel>
                  <CheckboxGroup
                    value={userManagement.accountLifecycle.accountRecoveryMethod}
                    onChange={(selectedMethods) => handleSettingChange(
                      'userManagement.accountLifecycle.accountRecoveryMethod', 
                      selectedMethods
                    )}
                  >
                    <Stack spacing={2} direction="column">
                      <Checkbox value="email">Email</Checkbox>
                      <Checkbox value="phone">Phone</Checkbox>
                      <Checkbox value="security_questions">Security Questions</Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* User Deletion & Privacy */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaUserTimes} mr={2} />
              User Deletion & Privacy
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Self-Deletion Allowed</FormLabel>
                  <Switch
                    isChecked={userManagement.registrationPolicies.selfDeletionAllowed}
                    onChange={(e) => handleSettingChange(
                      'userManagement.registrationPolicies.selfDeletionAllowed', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Multi-Role Support</FormLabel>
                  <Switch
                    isChecked={userManagement.registrationPolicies.allowMultipleRoles}
                    onChange={(e) => handleSettingChange(
                      'userManagement.registrationPolicies.allowMultipleRoles', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Multi-Device Login Policy</FormLabel>
                  <Select
                    value={userManagement.accountLifecycle.multiDeviceLoginPolicy}
                    onChange={(e) => handleSettingChange(
                      'userManagement.accountLifecycle.multiDeviceLoginPolicy', 
                      e.target.value
                    )}
                  >
                    <option value="notify">Notify on New Device</option>
                    <option value="block">Block Additional Devices</option>
                    <option value="allow">Allow Multiple Devices</option>
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* Role-Based Access Control */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaBalanceScale} mr={2} />
              Role-Based Access Control
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Granular Permissions</FormLabel>
                  <Switch
                    isChecked={userManagement.roleBasedAccess.granularPermissions}
                    onChange={(e) => handleSettingChange(
                      'userManagement.roleBasedAccess.granularPermissions', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Custom Role Creation</FormLabel>
                  <Switch
                    isChecked={userManagement.roleBasedAccess.customRoleCreationEnabled}
                    onChange={(e) => handleSettingChange(
                      'userManagement.roleBasedAccess.customRoleCreationEnabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Role Hierarchy</FormLabel>
                  <Textarea
                    value={userManagement.roleBasedAccess.roleHierarchy.map(
                      role => `${role.name} (Inherits from: ${role.inheritsFrom || 'None'})`
                    ).join('\n')}
                    onChange={(e) => {
                      // Complex parsing logic would be needed here
                      // This is a simplified example
                      const parsedHierarchy = e.target.value.split('\n').map(line => {
                        const [name, inheritsFrom] = line.split('(Inherits from: ');
                        return {
                          name: name.trim(),
                          inheritsFrom: inheritsFrom ? inheritsFrom.replace(')', '').trim() : null
                        };
                      });
                      handleSettingChange(
                        'userManagement.roleBasedAccess.roleHierarchy', 
                        parsedHierarchy
                      );
                    }}
                    placeholder="Role (Inherits from: ParentRole)"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* Compliance and Ethics */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaGavel} mr={2} />
              Compliance & Ethics
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Code of Conduct Agreement</FormLabel>
                  <Switch
                    isChecked={userManagement.complianceAndEthics.codeOfConductAgreementRequired}
                    onChange={(e) => handleSettingChange(
                      'userManagement.complianceAndEthics.codeOfConductAgreementRequired', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Ethical Use Training</FormLabel>
                  <Select
                    value={userManagement.complianceAndEthics.ethicalUseTraining.frequency}
                    onChange={(e) => handleSettingChange(
                      'userManagement.complianceAndEthics.ethicalUseTraining.frequency', 
                      e.target.value
                    )}
                  >
                    <option value="annual">Annually</option>
                    <option value="biannual">Bi-Annually</option>
                    <option value="quarterly">Quarterly</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Anonymous Reporting</FormLabel>
                  <Switch
                    isChecked={userManagement.complianceAndEthics.userReportingMechanism.anonymousReportingAllowed}
                    onChange={(e) => handleSettingChange(
                      'userManagement.complianceAndEthics.userReportingMechanism.anonymousReportingAllowed', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* Performance and Engagement Tracking */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaChartLine} mr={2} />
              Performance & Engagement
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>User Activity Scoring</FormLabel>
                  <Switch
                    isChecked={userManagement.performanceAndEngagement.userActivityScoring.enabled}
                    onChange={(e) => handleSettingChange(
                      'userManagement.performanceAndEngagement.userActivityScoring.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Scoring Algorithm</FormLabel>
                  <Select
                    value={userManagement.performanceAndEngagement.userActivityScoring.scoringAlgorithm}
                    onChange={(e) => handleSettingChange(
                      'userManagement.performanceAndEngagement.userActivityScoring.scoringAlgorithm', 
                      e.target.value
                    )}
                    isDisabled={!userManagement.performanceAndEngagement.userActivityScoring.enabled}
                  >
                    <option value="comprehensive">Comprehensive</option>
                    <option value="simple">Simple</option>
                    <option value="weighted">Weighted</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Predictive Alerts</FormLabel>
                  <Switch
                    isChecked={userManagement.performanceAndEngagement.userProgressTracking.predictiveAlerts.enabled}
                    onChange={(e) => handleSettingChange(
                      'userManagement.performanceAndEngagement.userProgressTracking.predictiveAlerts.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* User Onboarding & Engagement */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaUserGraduate} mr={2} />
              User Onboarding & Engagement
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Welcome Email Template</FormLabel>
                  <Switch
                    isChecked={userManagement.userOnboarding.welcomeEmailTemplate.enabled}
                    onChange={(e) => handleSettingChange(
                      'userManagement.userOnboarding.welcomeEmailTemplate.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Referral Program</FormLabel>
                  <Switch
                    isChecked={userManagement.userOnboarding.referralProgram.enabled}
                    onChange={(e) => handleSettingChange(
                      'userManagement.userOnboarding.referralProgram.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Referral Bonus</FormLabel>
                  <NumberInput
                    value={userManagement.userOnboarding.referralProgram.referralBonus.amount}
                    onChange={(value) => handleSettingChange(
                      'userManagement.userOnboarding.referralProgram.referralBonus.amount', 
                      parseInt(value)
                    )}
                    min={10}
                    max={500}
                    isDisabled={!userManagement.userOnboarding.referralProgram.enabled}
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

        {/* Advanced Role Management */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaUserFriends} mr={2} />
              Advanced Role Management
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Dynamic Role Assignment</FormLabel>
                  <Switch
                    isChecked={userManagement.advancedRoleManagement.dynamicRoleAssignment.enabled}
                    onChange={(e) => handleSettingChange(
                      'userManagement.advancedRoleManagement.dynamicRoleAssignment.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Custom Roles</FormLabel>
                  <Button 
                    onClick={() => setIsCustomRoleModalOpen(true)}
                    colorScheme="blue"
                  >
                    Create Custom Role
                  </Button>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Role Transition Workflow</FormLabel>
                  <Switch
                    isChecked={userManagement.advancedRoleManagement.roleTransitionWorkflows.enabled}
                    onChange={(e) => handleSettingChange(
                      'userManagement.advancedRoleManagement.roleTransitionWorkflows.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* International User Support */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaGlobeAmericas} mr={2} />
              International User Support
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Supported Languages</FormLabel>
                  <CheckboxGroup
                    value={userManagement.internationalUserSupport.multiLanguageSupport.supportedLanguages}
                    onChange={(selectedLanguages) => handleSettingChange(
                      'userManagement.internationalUserSupport.multiLanguageSupport.supportedLanguages', 
                      selectedLanguages
                    )}
                  >
                    <Stack spacing={2} direction="column">
                      <Checkbox value="en">English</Checkbox>
                      <Checkbox value="es">Spanish</Checkbox>
                      <Checkbox value="fr">French</Checkbox>
                      <Checkbox value="de">German</Checkbox>
                      <Checkbox value="zh">Chinese</Checkbox>
                      <Checkbox value="ar">Arabic</Checkbox>
                      <Checkbox value="hi">Hindi</Checkbox>
                      <Checkbox value="pt">Portuguese</Checkbox>
                      <Checkbox value="ru">Russian</Checkbox>
                      <Checkbox value="ja">Japanese</Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Automatic Translation</FormLabel>
                  <Switch
                    isChecked={userManagement.internationalUserSupport.multiLanguageSupport.automaticTranslation.enabled}
                    onChange={(e) => handleSettingChange(
                      'userManagement.internationalUserSupport.multiLanguageSupport.automaticTranslation.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Dynamic Scheduling</FormLabel>
                  <Switch
                    isChecked={userManagement.internationalUserSupport.timeZoneHandling.dynamicScheduling}
                    onChange={(e) => handleSettingChange(
                      'userManagement.internationalUserSupport.timeZoneHandling.dynamicScheduling', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {/* Custom Role Creation Modal */}
      <Modal 
        isOpen={isCustomRoleModalOpen} 
        onClose={() => setIsCustomRoleModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Custom Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Role Name</FormLabel>
                <Input 
                  value={newCustomRole.name}
                  onChange={(e) => setNewCustomRole({
                    ...newCustomRole, 
                    name: e.target.value
                  })}
                  placeholder="Enter role name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Role Description</FormLabel>
                <Textarea 
                  value={newCustomRole.description}
                  onChange={(e) => setNewCustomRole({
                    ...newCustomRole, 
                    description: e.target.value
                  })}
                  placeholder="Describe the role's purpose"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Permissions</FormLabel>
                <CheckboxGroup
                  value={newCustomRole.permissions}
                  onChange={(selectedPermissions) => setNewCustomRole({
                    ...newCustomRole,
                    permissions: selectedPermissions
                  })}
                >
                  <Stack spacing={2} direction="column">
                    <Checkbox value="view_courses">View Courses</Checkbox>
                    <Checkbox value="create_course">Create Course</Checkbox>
                    <Checkbox value="manage_users">Manage Users</Checkbox>
                    <Checkbox value="generate_reports">Generate Reports</Checkbox>
                    <Checkbox value="manage_settings">Manage Settings</Checkbox>
                  </Stack>
                </CheckboxGroup>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleAddCustomRole}
              isDisabled={!newCustomRole.name || newCustomRole.permissions.length === 0}
            >
              Create Role
            </Button>
            <Button variant="ghost" onClick={() => setIsCustomRoleModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

// Prop type validation remains the same
UserManagementAdvancedSettings.propTypes = {
  localSettings: PropTypes.shape({
    userManagement: PropTypes.object
  }),
  handleSettingChange: PropTypes.func.isRequired
};

UserManagementAdvancedSettings.defaultProps = {
  localSettings: {}
};

export default UserManagementAdvancedSettings;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */