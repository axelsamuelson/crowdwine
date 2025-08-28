'use client';

/**
 * Starts the checkout process by redirecting to Shopify's checkout URL
 * @param cartId The Shopify cart ID
 */
export async function startCheckout(cartId: string): Promise<void> {
  try {
    // Import the cart actions to get the current cart
    const { getCart } = await import('@/components/cart/actions');
    const cart = await getCart();
    
    if (!cart?.checkoutUrl) {
      throw new Error('No checkout URL available');
    }
    
    // Redirect to Shopify's checkout page
    window.location.href = cart.checkoutUrl;
  } catch (error) {
    console.error('Error starting checkout:', error);
    throw error;
  }
}
