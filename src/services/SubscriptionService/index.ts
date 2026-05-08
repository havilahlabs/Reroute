import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { Subscription } from '../../models';

// RevenueCat API keys — test key works for both platforms during sandbox testing.
// Replace with platform-specific live keys (appl_... / goog_...) before production.
export const REVENUECAT_API_KEYS = {
  ios: 'test_etLKsQvjTeMZHBiaPurKkbuVWnX',
  android: 'test_etLKsQvjTeMZHBiaPurKkbuVWnX',
};

// Must match the entitlement identifier you create in RevenueCat dashboard
const ENTITLEMENT_ID = 'pro';

export const SubscriptionService = {
  configure() {
    try {
      const apiKey =
        Platform.OS === 'ios'
          ? REVENUECAT_API_KEYS.ios
          : REVENUECAT_API_KEYS.android;
      Purchases.configure({ apiKey });
      if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    } catch (e) {
      console.warn('[SubscriptionService] configure failed:', e);
    }
  },

  async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (e) {
      console.warn('[SubscriptionService] getOfferings failed:', e);
      return null;
    }
  },

  async purchasePackage(pkg: PurchasesPackage): Promise<Subscription> {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfoToSubscription(customerInfo);
  },

  async restorePurchases(): Promise<Subscription> {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfoToSubscription(customerInfo);
  },

  async getSubscriptionStatus(): Promise<Subscription> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfoToSubscription(customerInfo);
    } catch (e) {
      console.warn('[SubscriptionService] getCustomerInfo failed:', e);
      return { status: 'free', entitlement: [] };
    }
  },

  addCustomerInfoListener(
    callback: (info: CustomerInfo) => void
  ): () => void {
    Purchases.addCustomerInfoUpdateListener(callback);
    return () => Purchases.removeCustomerInfoUpdateListener(callback);
  },
};

function customerInfoToSubscription(info: CustomerInfo): Subscription {
  const active = info.entitlements.active[ENTITLEMENT_ID];
  if (!active) return { status: 'free', entitlement: [] };
  return {
    status: 'pro',
    productId: active.productIdentifier,
    renewalDate: active.expirationDate ?? undefined,
    entitlement: ['pro', 'unlimited_routines', 'weekly_report', 'advanced_unlock'],
  };
}
