import { useState, useEffect } from 'react';
import { CustomerInfo } from 'react-native-purchases';
import { Subscription } from '../models';
import { SubscriptionService } from '../services/SubscriptionService';

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription>({
    status: 'free',
    entitlement: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SubscriptionService.getSubscriptionStatus().then(sub => {
      setSubscription(sub);
      setIsLoading(false);
    });

    // Keep subscription state in sync when RevenueCat notifies of changes
    // (e.g. purchase completed, subscription expired, restored)
    const unsubscribe = SubscriptionService.addCustomerInfoListener(
      (_info: CustomerInfo) => {
        SubscriptionService.getSubscriptionStatus().then(setSubscription);
      }
    );
    return unsubscribe;
  }, []);

  const isPro = subscription.status === 'pro' || subscription.status === 'trial';

  return { subscription, isPro, isLoading, setSubscription };
}
