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
  Icon
} from '@chakra-ui/react';
import { 
  FaServer, 
  FaShieldAlt, 
  FaCloudUploadAlt, 
  FaDatabase 
} from 'react-icons/fa';

const GlobalPlatformAdvancedSettings = ({ 
  localSettings = {}, 
  handleSettingChange 
}) => {
  // Ensure globalPlatform exists with default values
  const globalPlatform = localSettings.globalPlatform || {
    serverRegion: 'global',
    performanceThrottling: { 
      enabled: false, 
      concurrentConnections: 50 
    },
    enhancedSecurityMode: false,
    allowedIPRanges: [],
    geoIPBlockedCountries: [],
    dataRetentionPeriod: 365,
    backupFrequency: 'weekly',
    autoDataCleanupEnabled: false,
    cloudProvider: 'aws',
    externalServiceIntegrations: [],
    apiRateLimit: 100
  };

  return (
    <VStack spacing={6} align="stretch">
      <Accordion allowMultiple>
        {/* Server & Infrastructure Settings */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaServer} mr={2} />
              Server & Infrastructure
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Server Region</FormLabel>
                  <Select
                    value={globalPlatform.serverRegion}
                    onChange={(e) => handleSettingChange(
                      'globalPlatform.serverRegion', 
                      e.target.value
                    )}
                  >
                    <option value="global">Global Multi-Region</option>
                    <option value="us-east">US East</option>
                    <option value="us-west">US West</option>
                    <option value="eu-central">EU Central</option>
                    <option value="asia-pacific">Asia Pacific</option>
                    <option value="south-america">South America</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Performance Throttling</FormLabel>
                  <Switch
                    isChecked={globalPlatform.performanceThrottling?.enabled}
                    onChange={(e) => handleSettingChange(
                      'globalPlatform.performanceThrottling.enabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Max Concurrent Connections</FormLabel>
                  <NumberInput
                    value={globalPlatform.performanceThrottling?.concurrentConnections}
                    onChange={(value) => handleSettingChange(
                      'globalPlatform.performanceThrottling.concurrentConnections', 
                      parseInt(value)
                    )}
                    min={10}
                    max={500}
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

        {/* Security & Compliance Settings */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaShieldAlt} mr={2} />
              Security & Compliance
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>
                    <Tooltip label="Enable additional security measures">
                      Enhanced Security Mode
                    </Tooltip>
                  </FormLabel>
                  <Switch
                    isChecked={globalPlatform.enhancedSecurityMode}
                    onChange={(e) => handleSettingChange(
                      'globalPlatform.enhancedSecurityMode', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Allowed IP Ranges</FormLabel>
                  <Textarea
                    value={globalPlatform.allowedIPRanges?.join(', ')}
                    onChange={(e) => handleSettingChange(
                      'globalPlatform.allowedIPRanges', 
                      e.target.value.split(',').map(ip => ip.trim())
                    )}
                    placeholder="Enter IP ranges separated by comma"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Geo-IP Blocking</FormLabel>
                  <Select
                    isMulti
                    value={globalPlatform.geoIPBlockedCountries?.map(country => ({ 
                      value: country, 
                      label: country 
                    }))}
                    onChange={(selectedOptions) => handleSettingChange(
                      'globalPlatform.geoIPBlockedCountries', 
                      selectedOptions.map(option => option.value)
                    )}
                    options={[
                      { value: 'CN', label: 'China' },
                      { value: 'RU', label: 'Russia' },
                      { value: 'IR', label: 'Iran' },
                      { value: 'KP', label: 'North Korea' },
                      { value: 'SY', label: 'Syria' },
                    ]}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* Data Management & Storage */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaDatabase} mr={2} />
              Data Management & Storage
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Data Retention Period</FormLabel>
                  <NumberInput
                    value={globalPlatform.dataRetentionPeriod}
                    onChange={(value) => handleSettingChange(
                      'globalPlatform.dataRetentionPeriod', 
                      parseInt(value)
                    )}
                    min={30}
                    max={1095} // 3 years
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormLabel fontSize="xs" color="gray.500">
                    Days to retain user and course data
                  </FormLabel>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Backup Frequency</FormLabel>
                  <Select
                    value={globalPlatform.backupFrequency}
                    onChange={(e) => handleSettingChange(
                      'globalPlatform.backupFrequency', 
                      e.target.value
                    )}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>
                    <Tooltip label="Automatically delete inactive user data">
                      Auto Data Cleanup
                    </Tooltip>
                  </FormLabel>
                  <Switch
                    isChecked={globalPlatform.autoDataCleanupEnabled}
                    onChange={(e) => handleSettingChange(
                      'globalPlatform.autoDataCleanupEnabled', 
                      e.target.checked
                    )}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        {/* Cloud Integration & External Services */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              <Icon as={FaCloudUploadAlt} mr={2} />
              Cloud Integration
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Cloud Provider</FormLabel>
                  <Select
                    value={globalPlatform.cloudProvider}
                    onChange={(e) => handleSettingChange(
                      'globalPlatform.cloudProvider', 
                      e.target.value
                    )}
                  >
                    <option value="aws">Amazon Web Services</option>
                    <option value="azure">Microsoft Azure</option>
                    <option value="gcp">Google Cloud Platform</option>
                    <option value="hybrid">Hybrid Cloud</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>External Service Integrations</FormLabel>
                  <Select
                    isMulti
                    value={globalPlatform.externalServiceIntegrations?.map(service => ({ 
                      value: service, 
                      label: service 
                    }))}
                    onChange={(selectedOptions) => handleSettingChange(
                      'globalPlatform.externalServiceIntegrations', 
                      selectedOptions.map(option => option.value)
                    )}
                    options={[
                      { value: 'analytics', label: 'Analytics' },
                      { value: 'crm', label: 'CRM' },
                      { value: 'payment', label: 'Payment Gateway' },
                      { value: 'communication', label: 'Communication Tools' },
                      { value: 'hr', label: 'HR Systems' },
                    ]}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>API Rate Limit</FormLabel>
                  <NumberInput
                    value={globalPlatform.apiRateLimit}
                    onChange={(value) => handleSettingChange(
                      'globalPlatform.apiRateLimit', 
                      parseInt(value)
                    )}
                    min={10}
                    max={1000}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormLabel fontSize="xs" color="gray.500">
                    Requests per minute
                  </FormLabel>
                </FormControl>
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};

// Add prop type validation
GlobalPlatformAdvancedSettings.propTypes = {
  localSettings: PropTypes.shape({
    globalPlatform: PropTypes.object
  }),
  handleSettingChange: PropTypes.func.isRequired
};

// Add default props
GlobalPlatformAdvancedSettings.defaultProps = {
  localSettings: {}
};

export default GlobalPlatformAdvancedSettings;

/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */