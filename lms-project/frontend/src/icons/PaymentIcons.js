import React from 'react';
import { Icon } from '@chakra-ui/react';
import { 
  siVisa, 
  siMastercard, 
  siPaypal, 
  siApplepay, 
  siGooglepay, 
  siAlipay,
  siWechat
} from 'simple-icons/icons';

// Helper function to create icon from simple-icons or custom path
const createIcon = (pathOrIcon, color = null, size = 64) => {
  return (props) => {
    // If it's a simple-icons object
    if (typeof pathOrIcon === 'object' && pathOrIcon.path) {
      return (
        <Icon 
          viewBox="0 0 24 24" 
          color={color || `#${pathOrIcon.hex}`}
          width={size}
          height={size}
          {...props}
        >
          <path d={pathOrIcon.path} />
        </Icon>
      );
    }
    
    // If it's a custom SVG path
    return (
      <Icon 
        viewBox="0 0 24 24" 
        color={color}
        width={size}
        height={size}
        {...props}
      >
        <path d={pathOrIcon} />
      </Icon>
    );
  };
};

// Payment Method Icons
export const CreditCardIcon = createIcon(siVisa);
export const VisaIcon = createIcon(siVisa);
export const MastercardIcon = createIcon(siMastercard);
export const PayPalIcon = createIcon(siPaypal);
export const ApplePayIcon = createIcon(siApplepay);
export const GooglePayIcon = createIcon(siGooglepay);
export const AlipayIcon = createIcon(siAlipay);
export const WeChatPayIcon = createIcon(siWechat);

// Custom icons for methods not in simple-icons
export const SEPAIcon = createIcon(
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l4.75 2.85.75-1.23-4-2.37z', 
  '#0070B5'
);

export const BankTransferIcon = createIcon(
  'M12 1L2 7v2h20V7l-10-6zm0 5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-7 7h2v5H5v-5zm4 0h2v5H9v-5zm4 0h2v5h-2v-5zm4 0h2v5h-2v-5zM2 22h20v-3H2v3zm18-8h2v5h-2v-5z', 
  '#1A73E8'
);

export const UPIIcon = createIcon(
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6zm6 4h-2v-2h2v2zm0-4h-2V7h2v6z', 
  '#3F51B5'
);

export const NetBankingIcon = createIcon(
  'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 3h2v2h-2V7zm0 3h2v2h-2v-2zm-3-3h2v2H8V7zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V7h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V7h2v2zm3 3h-2v-2h2v2zm0-3h-2V7h2v2z', 
  '#2196F3'
);

export const InteracIcon = createIcon(
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z', 
  '#0070C9'
);

export const BPAYIcon = createIcon(
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v-2h-2zm0-6h2v4h-2z', 
  '#0070C9'
);

export const BoletoIcon = createIcon(
  'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 3h2v2h-2V7zm0 3h2v2h-2v-2zm-3-3h2v2H8V7zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V7h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V7h2v2zm3 3h-2v-2h2v2zm0-3h-2V7h2v2z', 
  '#00A4E4'
);

export const PayNowIcon = createIcon(
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v-2h-2zm0-6h2v4h-2z', 
  '#1A73E8'
);

export const PayTMIcon = createIcon(
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v-2h-2zm0-6h2v4h-2z', 
  '#0070C9'
);

export const LinePayIcon = createIcon(
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v-2h-2zm0-6h2v4h-2z', 
  '#00C300'
);

export const UnionPayIcon = createIcon(
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v-2h-2zm0-6h2v4h-2z', 
  '#0070C9'
);

export const PIXIcon = createIcon(
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v-2h-2zm0-6h2v4h-2z', 
  '#00A4E4'
);

export const SofortIcon = createIcon(
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v-2h-2zm0-6h2v4h-2z', 
  '#00A4E4'
);

export const PayPayIcon = createIcon(
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v-2h-2zm0-6h2v4h-2z', 
  '#0070C9'
);

export const CashAppIcon = createIcon(
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v-2h-2zm0-6h2v4h-2z', 
  '#00D632'
);
