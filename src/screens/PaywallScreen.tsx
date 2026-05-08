import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PurchasesOffering, PurchasesPackage, PACKAGE_TYPE } from 'react-native-purchases';
import { useTheme } from '../hooks/useTheme';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionService } from '../services/SubscriptionService';
import { AnalyticsService } from '../services/AnalyticsService';
import { IconCheck, IconStar, IconClose } from '../components/icons';
import { fonts } from '../theme';

const FREE_FEATURES = ['Basic focus sessions', 'One routine', 'Basic insights', 'Demo protection'];

const PRO_FEATURES = [
  'Unlimited routines',
  'Smart schedules',
  'Advanced unlock rules',
  'Weekly recovery report',
  'Deeper pattern insights',
  'Real app protection',
  'Longer history',
];

function packageLabel(pkg: PurchasesPackage): string {
  switch (pkg.packageType) {
    case PACKAGE_TYPE.MONTHLY: return 'Monthly';
    case PACKAGE_TYPE.ANNUAL: return 'Annual';
    case PACKAGE_TYPE.TWO_MONTH: return '2 Months';
    case PACKAGE_TYPE.THREE_MONTH: return '3 Months';
    case PACKAGE_TYPE.SIX_MONTH: return '6 Months';
    case PACKAGE_TYPE.LIFETIME: return 'Lifetime';
    default: return pkg.identifier;
  }
}

function packageSavingsBadge(pkg: PurchasesPackage, monthly?: PurchasesPackage): string | null {
  if (!monthly || pkg.packageType !== PACKAGE_TYPE.ANNUAL) return null;
  const monthlyPrice = monthly.product.price;
  const annualMonthlyEquiv = pkg.product.price / 12;
  const pct = Math.round((1 - annualMonthlyEquiv / monthlyPrice) * 100);
  if (pct > 0) return `Save ${pct}%`;
  return null;
}

export function PaywallScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { setSubscription } = useSubscription();
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [offeringLoading, setOfferingLoading] = useState(true);

  useEffect(() => {
    SubscriptionService.getOfferings().then(o => {
      setOffering(o);
      // Default-select the annual package if present, otherwise first available
      const annual = o?.availablePackages.find(p => p.packageType === PACKAGE_TYPE.ANNUAL);
      setSelectedPkg(annual ?? o?.availablePackages[0] ?? null);
      setOfferingLoading(false);
    });
    AnalyticsService.track('paywall_viewed');
  }, []);

  const monthlyPkg = offering?.availablePackages.find(
    p => p.packageType === PACKAGE_TYPE.MONTHLY
  );

  const handlePurchase = async () => {
    if (!selectedPkg) return;
    setLoading(true);
    try {
      const sub = await SubscriptionService.purchasePackage(selectedPkg);
      setSubscription(sub);
      navigation.goBack();
    } catch (e: any) {
      // User cancelled — no-op. Any other error is surfaced by the SDK.
      if (!e?.userCancelled) console.warn('[Paywall] purchase error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const sub = await SubscriptionService.restorePurchases();
      setSubscription(sub);
      if (sub.status === 'pro') navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <IconClose size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: theme.isDark ? 'rgba(124,111,205,0.18)' : 'rgba(124,111,205,0.12)' }]}>
            <IconStar size={28} color={theme.colors.primaryLight} />
          </View>
          <Text style={[styles.heroTitle, { color: theme.colors.textPrimary }]}>Make Reroute personal.</Text>
          <Text style={[styles.heroSub, { color: theme.colors.textSecondary }]}>
            Unlock routines, smart insights, advanced unlock rules, and weekly recovery reports.
          </Text>
        </View>

        {/* Feature comparison */}
        <View style={styles.featureCols}>
          <View style={[styles.featureCol, { backgroundColor: theme.colors.surfaceAlt }]}>
            <Text style={[styles.colHeader, { color: theme.colors.textSecondary }]}>Free</Text>
            {FREE_FEATURES.map(f => (
              <View key={f} style={styles.featureRow}>
                <View style={[styles.featureDot, { backgroundColor: theme.colors.border }]} />
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>{f}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.featureCol, {
            backgroundColor: theme.isDark ? 'rgba(124,111,205,0.12)' : 'rgba(124,111,205,0.07)',
            borderColor: 'rgba(169,159,224,0.4)',
            borderWidth: 1.5,
          }]}>
            <Text style={[styles.colHeader, { color: theme.colors.primaryLight }]}>Pro ✦</Text>
            {PRO_FEATURES.map(f => (
              <View key={f} style={styles.featureRow}>
                <IconCheck size={12} color={theme.colors.primaryLight} />
                <Text style={[styles.featureText, { color: theme.colors.textPrimary }]}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Plans */}
        <Text style={[styles.plansLabel, { color: theme.colors.textTertiary }]}>CHOOSE A PLAN</Text>

        {offeringLoading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 24 }} />
        ) : offering?.availablePackages.length ? (
          offering.availablePackages.map(pkg => {
            const isSelected = selectedPkg?.identifier === pkg.identifier;
            const badge = packageSavingsBadge(pkg, monthlyPkg);
            return (
              <TouchableOpacity
                key={pkg.identifier}
                onPress={() => setSelectedPkg(pkg)}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: isSelected
                      ? (theme.isDark ? 'rgba(124,111,205,0.15)' : 'rgba(124,111,205,0.08)')
                      : theme.colors.surfaceAlt,
                    borderColor: isSelected ? theme.colors.primaryLight : 'transparent',
                    borderWidth: 2,
                  },
                ]}
              >
                <View style={styles.planLeft}>
                  <Text style={[styles.planLabel, { color: theme.colors.textPrimary }]}>
                    {packageLabel(pkg)}
                  </Text>
                  {badge && (
                    <View style={[styles.badge, { backgroundColor: theme.colors.success + '22' }]}>
                      <Text style={[styles.badgeText, { color: theme.colors.success }]}>{badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.planPrice, { color: isSelected ? theme.colors.primaryLight : theme.colors.textSecondary }]}>
                  {pkg.product.priceString}
                </Text>
                {isSelected && (
                  <View style={[styles.planCheck, { backgroundColor: theme.colors.primary }]}>
                    <IconCheck size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={[styles.noPlans, { color: theme.colors.textTertiary }]}>
            Pricing unavailable — check your connection.
          </Text>
        )}

        {/* CTA */}
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={loading || !selectedPkg}
          style={[styles.ctaBtn, {
            backgroundColor: theme.colors.primary,
            opacity: loading || !selectedPkg ? 0.6 : 1,
          }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaBtnText}>
              {selectedPkg ? `Start ${packageLabel(selectedPkg)}` : 'Select a plan'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Footer links */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleRestore} disabled={loading}>
            <Text style={[styles.footerLink, { color: theme.colors.textTertiary }]}>Restore purchases</Text>
          </TouchableOpacity>
          <Text style={[styles.footerDot, { color: theme.colors.textTertiary }]}>·</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Privacy' as never)}>
            <Text style={[styles.footerLink, { color: theme.colors.textTertiary }]}>Privacy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 48, gap: 12 },
  hero: { alignItems: 'center', gap: 12, paddingTop: 8, paddingBottom: 8 },
  heroIcon: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontFamily: fonts.nunitoBold, fontSize: 24, letterSpacing: -0.3, textAlign: 'center' },
  heroSub: { fontFamily: fonts.dmSansRegular, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  featureCols: { flexDirection: 'row', gap: 10 },
  featureCol: { flex: 1, padding: 16, borderRadius: 16, gap: 10 },
  colHeader: { fontFamily: fonts.nunitoBold, fontSize: 15, marginBottom: 4 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  featureDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  featureText: { fontFamily: fonts.dmSansRegular, fontSize: 13, lineHeight: 18, flex: 1 },
  plansLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6, paddingLeft: 2, marginTop: 4 },
  planCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, gap: 10 },
  planLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  planLabel: { fontFamily: fonts.nunitoSemiBold, fontSize: 15 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontFamily: fonts.dmSansMedium, fontSize: 11 },
  planPrice: { fontFamily: fonts.dmSansRegular, fontSize: 14 },
  planCheck: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  ctaBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 4 },
  ctaBtnText: { fontFamily: fonts.nunitoBold, fontSize: 17, color: '#fff' },
  noPlans: { fontFamily: fonts.dmSansRegular, fontSize: 14, textAlign: 'center', paddingVertical: 24 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  footerLink: { fontFamily: fonts.dmSansRegular, fontSize: 13 },
  footerDot: { fontFamily: fonts.dmSansRegular, fontSize: 13 },
});
