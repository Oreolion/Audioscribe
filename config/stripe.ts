export interface DonationProduct {
  id: string;
  amount: number;
  description: string;
  priceId: string;
  productId: string;
  currency: string;
  metadata?: Record<string, string>;
}

export const donationProducts: DonationProduct[] = [
  {
    id: 'donation_10',
    amount: 10,
    currency: 'usd',
    description: "Support our basic maintenance and server costs",
    priceId: "price_1QR5hLIKOlm7GILEu1IKP9jp",
    productId: "prod_RJj9k0EP4qudaRLTc",
    metadata: {
      type: 'donation',
      tier: 'basic'
    }
  },
  {
    id: 'donation_20',
    amount: 20,
    currency: 'usd',
    description: "Help us improve transcription accuracy and add new features",
    priceId: "price_1QR5hZIKOlm7GILEyHI1ohKD",
    productId: "prod_RJj9PZIPFAWY66",
    metadata: {
      type: 'donation',
      tier: 'supporter'
    }
  },
  {
    id: 'donation_50',
    amount: 50,
    currency: 'usd',
    description: "Enable us to add support for more languages and formats",
    priceId: "price_1QR5hmIKOlm7GILE6Aoo3ckF",
    productId: "prod_RJjAhS5ijPP0HZ",
    metadata: {
      type: 'donation',
      tier: 'premium'
    }
  },
  {
    id: 'donation_100',
    amount: 100,
    currency: 'usd',
    description: "Contribute to major feature development and scaling",
    priceId: "price_1QR5i1IKOlm7GILEiFCbX7Hp",
    productId: "prod_RJjAb0iaou8AbX",
    metadata: {
      type: 'donation',
      tier: 'platinum'
    }
  },
];

export const DONATION_AMOUNTS = [10, 20, 50, 100] as const;

export type DonationAmount = (typeof DONATION_AMOUNTS)[number];

export function isDonationAmount(amount: number): amount is DonationAmount {
  return DONATION_AMOUNTS.includes(amount as DonationAmount);
}

export const findProductByAmount = (amount: number): DonationProduct | undefined => {
  return donationProducts.find(product => product.amount === amount);
};

export const findProductByPriceId = (priceId: string): DonationProduct | undefined => {
  return donationProducts.find(product => product.priceId === priceId);
};
