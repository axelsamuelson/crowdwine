'use server';

import { TAGS } from '@/lib/constants';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import {
  createCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  getCart as getCartData,
} from '@/lib/data';
import type { Cart, CartItem } from '@/lib/data';
// TODO: Remove ShopifyCart, ShopifyCartLine types in Step F - these are no longer needed

// TODO: Remove adapter functions in Step F - no longer needed with new data layer

async function getOrCreateCartId(): Promise<string> {
  let cartId = (await cookies()).get('cartId')?.value;
  if (!cartId) {
    const newCart = await createCart();
    cartId = newCart.id;
    (await cookies()).set('cartId', cartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return cartId;
}

// Add item server action: returns adapted Cart
export async function addItem(variantId: string | undefined): Promise<Cart | null> {
  if (!variantId) return null;
  try {
    const cartId = await getOrCreateCartId();
    await addCartItem(cartId, '', variantId, 1);
    const fresh = await getCartData(cartId);
    revalidateTag(TAGS.cart);
    return fresh;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return null;
  }
}

// Update item server action (quantity 0 removes): returns adapted Cart
export async function updateItem({ lineId, quantity }: { lineId: string; quantity: number }): Promise<Cart | null> {
  try {
    const cartId = (await cookies()).get('cartId')?.value;
    if (!cartId) return null;

    if (quantity === 0) {
      await removeCartItem(cartId, lineId);
    } else {
      await updateCartItem(cartId, lineId, quantity);
    }

    const fresh = await getCartData(cartId);
    revalidateTag(TAGS.cart);
    return fresh;
  } catch (error) {
    console.error('Error updating item:', error);
    return null;
  }
}

export async function createCartAndSetCookie() {
  try {
    const newCart = await createCart();

    (await cookies()).set('cartId', newCart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return newCart;
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

export async function getCart(): Promise<Cart | null> {
  try {
    const cartId = (await cookies()).get('cartId')?.value;

    if (!cartId) {
      return null;
    }
    const fresh = await getCartData(cartId);
    return fresh;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}
