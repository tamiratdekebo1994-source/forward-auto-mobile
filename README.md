
## Biometric policy protection

The native Policy tab requests Face ID or Fingerprint before showing policy data. The Documents action requests biometric verification again before opening policy documents and the digital certificate. Android uses the enrolled device biometric; iOS uses Face ID or Touch ID according to device capability. The web preview bypasses hardware authentication and labels the fallback clearly.

For a physical-device test:

1. Install a development/preview build on a device with Face ID or Fingerprint enabled.
2. Open Forward and complete onboarding.
3. Open **Policy** and approve the biometric prompt.
4. Tap **Documents** and confirm a second biometric prompt.
5. Lock the phone, reopen the app, and confirm Policy is protected again after the screen remounts.
6. Cancel or fail authentication and verify that the policy and certificate remain hidden.

## Offline policy and certificate cache

The Policy tab persists a versioned record under `forward.policy-cache.v1` using AsyncStorage. The record contains separate policy-card and digital-certificate payloads plus a cache timestamp. On startup the app hydrates these objects before rendering the Policy tab. When the device is online, the current policy snapshot refreshes the cache; when connectivity drops, the Policy tab uses the cached policy and certificate payloads and shows an **Offline** badge.

The policy card, document list, and digital certificate all read from the hydrated cache objects. The certificate view displays the cached certificate number, insured name, vehicle/cover, and validity dates. **Refresh offline copy** is available while online. A schema version protects the app from silently reading incompatible future cache formats.

To test offline mode on a device:

1. Install the updated build and open Policy while online.
2. Confirm the Policy screen shows **Online**, then tap **Refresh offline copy**.
3. Open **Documents**, then open **Digital insurance certificate**.
4. Enable airplane mode or disable Wi-Fi and mobile data.
5. Reopen Policy and confirm the cached policy card, document list, and certificate still render with **Offline** and **Using offline copy** indicators.
6. Reconnect and confirm the badge returns to **Online**.

The offline cache is intentionally limited to the active policy card and certificate metadata; payment submission, claims updates, and policy changes still require connectivity. Offline certificate data is for display and roadside reference; the connected insurer system remains the source of truth.


## Functional Profile

Tap the **Hello, Selam** avatar on Home to open Profile. The Profile screen supports local editing and persistence for the customer name, phone number, and city; language switching between English and Amharic; a visible biometric-policy status; and an identity-verification request state for agent review. Profile data is stored on-device under `forward.profile.v1` for this MVP. Tap **Back** to return to Home.


## Responsive layout

Profile cards use flexible copy columns, wrapping preference rows, shrink-safe headers, and scrollable content so fields, status labels, buttons, and account actions remain visible on narrow iPhone and Android screens.


## Phone-responsive Home

On screens narrower than 600px, Home switches to full-width image cards with a 250px vehicle image, a 180px road image, vertically stacked action cards, and readable text spacing. Wider screens retain the balanced side-by-side composition.


## Physical Expo Go check

The LAN preview runs on port 8082. Scan the QR code from Expo Go while the phone and development computer are on the same Wi-Fi. Verify Home, Quote, Policy, Claims, and Help tabs; tap each tab twice to confirm the active blue badge moves; confirm the Forward chevron is separated from the wordmark; and rotate or resize the phone to confirm the Home image cards remain full-width.


## Dark theme preview

This preview build applies a dark Forward palette across onboarding, Home, Quote, Policy, Claims, Help, and Profile. The Expo web check verified the five bottom routes and their vector icons: Home, Quote, Policy, Claims, and Help. The Forward wordmark uses a dedicated name row so the gold chevron has fixed spacing and cannot overlap the header text.
