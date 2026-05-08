import { SubscriptionService } from '../services/SubscriptionService';

// Mock react-native-purchases
jest.mock('react-native-purchases', () => ({
  default: {
    configure: jest.fn(),
    setLogLevel: jest.fn(),
    getCustomerInfo: jest.fn(),
    getOfferings: jest.fn(),
    purchasePackage: jest.fn(),
    restorePurchases: jest.fn(),
    addCustomerInfoUpdateListener: jest.fn(),
    removeCustomerInfoUpdateListener: jest.fn(),
  },
  LOG_LEVEL: { DEBUG: 'DEBUG' },
}));

const mockFreeCustomerInfo = {
  entitlements: { active: {} },
};

const mockProCustomerInfo = {
  entitlements: {
    active: {
      pro: {
        productIdentifier: 'reroute_pro_monthly',
        expirationDate: '2025-01-01T00:00:00Z',
      },
    },
  },
};

describe('SubscriptionService', () => {
  let Purchases: any;

  beforeEach(() => {
    jest.clearAllMocks();
    Purchases = require('react-native-purchases').default;
  });

  describe('getSubscriptionStatus', () => {
    it('returns free when no active entitlement', async () => {
      Purchases.getCustomerInfo.mockResolvedValue(mockFreeCustomerInfo);
      const sub = await SubscriptionService.getSubscriptionStatus();
      expect(sub.status).toBe('free');
    });

    it('returns pro when pro entitlement is active', async () => {
      Purchases.getCustomerInfo.mockResolvedValue(mockProCustomerInfo);
      const sub = await SubscriptionService.getSubscriptionStatus();
      expect(sub.status).toBe('pro');
      expect(sub.entitlement).toContain('pro');
    });

    it('returns free when getCustomerInfo throws', async () => {
      Purchases.getCustomerInfo.mockRejectedValue(new Error('network'));
      const sub = await SubscriptionService.getSubscriptionStatus();
      expect(sub.status).toBe('free');
    });
  });

  describe('purchasePackage', () => {
    it('returns pro subscription after successful purchase', async () => {
      const mockPkg = { identifier: '$rc_monthly' } as any;
      Purchases.purchasePackage.mockResolvedValue({ customerInfo: mockProCustomerInfo });
      const sub = await SubscriptionService.purchasePackage(mockPkg);
      expect(sub.status).toBe('pro');
      expect(sub.productId).toBe('reroute_pro_monthly');
    });
  });

  describe('restorePurchases', () => {
    it('returns pro if entitlement restored', async () => {
      Purchases.restorePurchases.mockResolvedValue(mockProCustomerInfo);
      const sub = await SubscriptionService.restorePurchases();
      expect(sub.status).toBe('pro');
    });

    it('returns free if nothing to restore', async () => {
      Purchases.restorePurchases.mockResolvedValue(mockFreeCustomerInfo);
      const sub = await SubscriptionService.restorePurchases();
      expect(sub.status).toBe('free');
    });
  });

  describe('getOfferings', () => {
    it('returns current offering', async () => {
      const mockOffering = { identifier: 'default', availablePackages: [] };
      Purchases.getOfferings.mockResolvedValue({ current: mockOffering });
      const offering = await SubscriptionService.getOfferings();
      expect(offering?.identifier).toBe('default');
    });

    it('returns null on error', async () => {
      Purchases.getOfferings.mockRejectedValue(new Error('network'));
      const offering = await SubscriptionService.getOfferings();
      expect(offering).toBeNull();
    });
  });
});
