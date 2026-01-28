# Swag Labs Test Cases

## Overview

This document contains test cases for automated testing of [Swag Labs](https://www.saucedemo.com) e-commerce application.

### Test Users

| User Type | Username | Description |
|-----------|----------|-------------|
| Standard | `standard_user` | Normal user with full access |
| Locked | `locked_out_user` | User that is locked out |
| Problem | `problem_user` | User that experiences UI issues |
| Performance | `performance_glitch_user` | User with slow loading |
| Error | `error_user` | User that triggers errors |
| Visual | `visual_user` | User with visual bugs |

**Password for all users:** `secret_sauce`

---

## Test Priority Summary

**Total Test Cases: 37**

| Priority | Count | Description |
|----------|-------|-------------|
| Critical | 9 | Must pass for release |
| High | 18 | Important functionality |
| Medium | 9 | Nice to have |
| Low | 1 | Edge cases |

---

## A. Authentication

### TC-AUTH-001: Successful login with standard user
**Priority:** Critical
**Preconditions:** User is on login page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter valid username `standard_user` | Username field populated |
| 2 | Enter valid password `secret_sauce` | Password field populated (masked) |
| 3 | Click "Login" button | User redirected to Products page (`/inventory.html`) |

---

### TC-AUTH-002: Login with locked out user
**Priority:** High
**Preconditions:** User is on login page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter username `locked_out_user` | Username field populated |
| 2 | Enter password `secret_sauce` | Password field populated |
| 3 | Click "Login" button | Error message: "Sorry, this user has been locked out." |

---

### TC-AUTH-003: Login with empty credentials
**Priority:** High
**Preconditions:** User is on login page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Leave username empty | - |
| 2 | Leave password empty | - |
| 3 | Click "Login" button | Error message: "Username is required" |

---

### TC-AUTH-004: Login with empty password
**Priority:** High
**Preconditions:** User is on login page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter username `standard_user` | Username field populated |
| 2 | Leave password empty | - |
| 3 | Click "Login" button | Error message: "Password is required" |

---

### TC-AUTH-005: Login with invalid credentials
**Priority:** High
**Preconditions:** User is on login page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter invalid username `invalid_user` | Username field populated |
| 2 | Enter invalid password `wrong_password` | Password field populated |
| 3 | Click "Login" button | Error message: "Username and password do not match" |

---

### TC-AUTH-006: Error message can be closed
**Priority:** Medium

**Preconditions:** Error message is displayed after failed login

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click close button (X) on error message | Error message disappears |

---

### TC-AUTH-007: Logout functionality
**Priority:** Critical
**Preconditions:** User is logged in

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click burger menu icon | Menu opens |
| 2 | Click "Logout" link | User redirected to login page |
| 3 | Navigate back | User cannot access inventory page |

---

## B. Products Page

### TC-PROD-001: Products page displays all items
**Priority:** Critical
**Preconditions:** User is logged in as `standard_user`

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Products page | Page displays 6 products |
| 2 | Verify each product | Each product has: image, name, description, price, "Add to cart" button |

---

### TC-PROD-002: Sort products by name (A to Z)
**Priority:** High
**Preconditions:** User is on Products page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click sort dropdown | Dropdown options displayed |
| 2 | Select "Name (A to Z)" | Products sorted alphabetically A-Z |

---

### TC-PROD-003: Sort products by name (Z to A)
**Priority:** High
**Preconditions:** User is on Products page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click sort dropdown | Dropdown options displayed |
| 2 | Select "Name (Z to A)" | Products sorted alphabetically Z-A |

---

### TC-PROD-004: Sort products by price (low to high)
**Priority:** High
**Preconditions:** User is on Products page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click sort dropdown | Dropdown options displayed |
| 2 | Select "Price (low to high)" | Products sorted by price ascending |

---

### TC-PROD-005: Sort products by price (high to low)
**Priority:** High
**Preconditions:** User is on Products page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click sort dropdown | Dropdown options displayed |
| 2 | Select "Price (high to low)" | Products sorted by price descending |

---

### TC-PROD-006: View product details
**Priority:** High
**Preconditions:** User is on Products page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on product name or image | Product details page opens |
| 2 | Verify product details | Shows: image, name, description, price, "Add to cart" button, "Back to products" link |

---

### TC-PROD-007: Navigate back from product details
**Priority:** Medium
**Preconditions:** User is on product details page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Back to products" button | User returns to Products page |

---

## C. Add to Cart

### TC-CART-001: Add single product to cart from products page
**Priority:** Critical
**Preconditions:** User is on Products page, cart is empty

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add to cart" on any product | Button changes to "Remove" |
| 2 | Verify cart badge | Cart icon shows "1" |

---

### TC-CART-002: Add product to cart from product details page
**Priority:** High
**Preconditions:** User is on product details page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add to cart" button | Button changes to "Remove" |
| 2 | Verify cart badge | Cart badge increments by 1 |

---

### TC-CART-003: Add multiple products to cart
**Priority:** Critical
**Preconditions:** User is on Products page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add first product to cart | Cart badge shows "1" |
| 2 | Add second product to cart | Cart badge shows "2" |
| 3 | Add third product to cart | Cart badge shows "3" |

---

### TC-CART-004: Remove product from cart on products page
**Priority:** High
**Preconditions:** Product is added to cart

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Remove" button on product | Button changes back to "Add to cart" |
| 2 | Verify cart badge | Cart badge decrements or disappears |

---

### TC-CART-005: View cart contents
**Priority:** Critical
**Preconditions:** Products are added to cart

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click cart icon | Cart page opens |
| 2 | Verify cart contents | Shows all added products with: quantity, name, description, price |

---

### TC-CART-006: Remove product from cart page
**Priority:** High
**Preconditions:** User is on cart page with products

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Remove" button for a product | Product removed from cart |
| 2 | Verify cart | Product no longer displayed |

---

### TC-CART-007: Continue shopping from cart
**Priority:** Medium
**Preconditions:** User is on cart page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Continue Shopping" button | User redirected to Products page |

---

### TC-CART-008: Cart persists after page refresh
**Priority:** Medium
**Preconditions:** Products are added to cart

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add products to cart | Cart shows products |
| 2 | Refresh the page | Cart still shows same products |

---

## D. Checkout

### TC-CHK-001: Complete checkout flow
**Priority:** Critical
**Preconditions:** User has products in cart

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click cart icon | Cart page opens |
| 2 | Click "Checkout" button | Checkout step one page opens |
| 3 | Fill in First Name | Field populated |
| 4 | Fill in Last Name | Field populated |
| 5 | Fill in Postal Code | Field populated |
| 6 | Click "Continue" | Checkout step two (overview) page opens |
| 7 | Verify order summary | Shows products, prices, tax, total |
| 8 | Click "Finish" | Order confirmation page displayed |
| 9 | Verify confirmation | Message: "Thank you for your order!" |

---

### TC-CHK-002: Checkout with empty first name
**Priority:** High
**Preconditions:** User is on checkout step one

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Leave First Name empty | - |
| 2 | Fill Last Name and Postal Code | Fields populated |
| 3 | Click "Continue" | Error: "First Name is required" |

---

### TC-CHK-003: Checkout with empty last name
**Priority:** High
**Preconditions:** User is on checkout step one

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Fill First Name | Field populated |
| 2 | Leave Last Name empty | - |
| 3 | Fill Postal Code | Field populated |
| 4 | Click "Continue" | Error: "Last Name is required" |

---

### TC-CHK-004: Checkout with empty postal code
**Priority:** High
**Preconditions:** User is on checkout step one

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Fill First Name | Field populated |
| 2 | Fill Last Name | Field populated |
| 3 | Leave Postal Code empty | - |
| 4 | Click "Continue" | Error: "Postal Code is required" |

---

### TC-CHK-005: Cancel checkout on step one
**Priority:** Medium
**Preconditions:** User is on checkout step one

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Cancel" button | User redirected to Cart page |

---

### TC-CHK-006: Cancel checkout on step two
**Priority:** Medium
**Preconditions:** User is on checkout step two (overview)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Cancel" button | User redirected to Products page |

---

### TC-CHK-007: Verify price calculation
**Priority:** Critical
**Preconditions:** User is on checkout step two with multiple products

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Calculate item total | Sum of all product prices |
| 2 | Verify tax | Tax = Item Total * 0.08 (8%) |
| 3 | Verify total | Total = Item Total + Tax |

---

### TC-CHK-008: Back to home after order completion
**Priority:** Medium
**Preconditions:** User completed order successfully

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Back Home" button | User redirected to Products page |
| 2 | Verify cart | Cart is empty |

---

### TC-CHK-009: Checkout with empty cart
**Priority:** Medium
**Preconditions:** Cart is empty

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to cart | Cart page shows no items |
| 2 | Click "Checkout" (if visible) | Should not proceed or show appropriate message |

---

### TC-CHK-010: Checkout with all empty fields
**Priority:** High
**Preconditions:** User is on checkout step one

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Leave all fields empty | - |
| 2 | Click "Continue" | Error: "First Name is required" |
| 3 | Verify validation styles | All input fields have red border and error icons |

---

## E. Burger Menu

### TC-MENU-001: Open burger menu
**Priority:** High
**Preconditions:** User is logged in

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click burger menu icon (three lines) | Side menu slides open |
| 2 | Verify menu items | Shows: All Items, About, Logout, Reset App State |

---

### TC-MENU-002: Close burger menu with X button
**Priority:** Medium
**Preconditions:** Burger menu is open

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click X (close) button | Menu closes |

---

### TC-MENU-003: Navigate to All Items
**Priority:** High
**Preconditions:** Burger menu is open, user is not on Products page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "All Items" link | User redirected to Products page |

---

### TC-MENU-004: Navigate to About page
**Priority:** Low
**Preconditions:** Burger menu is open

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "About" link | User redirected to Sauce Labs website |

---

### TC-MENU-005: Logout via burger menu
**Priority:** Critical
**Preconditions:** Burger menu is open

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Logout" link | User logged out and redirected to login page |

---

### TC-MENU-006: Reset App State
**Priority:** Medium
**Preconditions:** User has items in cart, burger menu is open

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Reset App State" link | Cart is cleared |
| 2 | Verify cart badge | Badge disappears |
| 3 | Verify product buttons | All buttons show "Add to cart" |

---

### Products Reference

| Product Name | Price |
|--------------|-------|
| Sauce Labs Backpack | $29.99 |
| Sauce Labs Bike Light | $9.99 |
| Sauce Labs Bolt T-Shirt | $15.99 |
| Sauce Labs Fleece Jacket | $49.99 |
| Sauce Labs Onesie | $7.99 |
| Test.allTheThings() T-Shirt (Red) | $15.99 |

---
