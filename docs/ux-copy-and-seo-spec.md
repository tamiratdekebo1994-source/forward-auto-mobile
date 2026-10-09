# Forward Auto — Mobile Wireflows, Ethiopian SEO Hub, and Bilingual UX Copy

This specification treats the website as the **public discovery and education surface** and the mobile app as the **signed-in action surface**. Both share the Forward brand, risk-led quote model, and policy data; they do not duplicate the same layout.

![Forward Auto bottom-navigation wireflow](./forward-auto-mobile-wireflow.png)

## 1. Mobile app information architecture

### App chrome and navigation rules

Use five fixed top-level tabs:

| Tab | English label | Amharic label | Job | Primary action |
|---|---|---|---|---|
| Home | Home | መነሻ | Surface the next useful action and policy status | Start quote, pay, claim, or request roadside help |
| Quote | Quote | ግምት | Build or retrieve a risk-led insurance illustration | Start / continue quote |
| Policy | Policy | ፖሊሲ | Show policy, documents, bills, and renewal actions | View policy or make a payment |
| Claims | Claims | የካሳ ጥያቄ | Start a claim safely and track its progress | Start claim or track claim |
| Help | Help | እርዳታ | Deliver urgent assistance, agent support, and learning | Roadside help, call agent, or learn |

**Navigation behavior**

- Keep the bottom bar visible on the top-level tab screens. Highlight only the active tab; do not use a floating central action that competes with the quote flow.
- Hide the bottom bar inside focused, multi-step flows: quote, payment handoff, new-claim intake, and roadside request. Replace it with a header showing **Back**, step count or status, a language switch, and **Exit / Save for later** when a safe draft exists.
- Preserve the selected app language across sessions. Use a full-language switch rather than presenting every sentence twice. On first app launch and on every quote-flow header, make switching **English / አማርኛ** easy. Put the corresponding website language toggle in the main navigation bar.
- Use `Home` when signed out as a lightweight acquisition screen. Do not imply a policy, claim, payment, or driver score exists until verified server data says it does.

### Bottom-tab wireflows

The rendered diagram is the cross-tab wiring. The details below define each tab’s wireframe priority.

#### Home · መነሻ

**Top block:** welcome, language control, and a single status card.

| State | Main content | Primary CTA | Guardrail |
|---|---|---|---|
| Signed out | “Protect your next trip.”, brief value statement, three proof points | **Get an estimate** | Do not show policy/account language. |
| No policy / saved quote | Quote reference and selected cover snapshot | **Continue quote** | Explain that saved quotes are illustrations, not policies. |
| Active policy | Policy name, current cover status, next payment/renewal date | **View policy** | Never display card/account or claim data in a push preview. |
| Action required | One amber reason: payment due, document missing, or claim update | **Resolve now** | Use precise action language, never a vague “Attention required.” |

**Quick-action order:** Start quote → Pay / verify payment → Start a claim → Roadside help. On a small screen, show the first two as full-width actions and the latter two as compact icon rows.

#### Quote · ግምት

**Entry:** show two choices: **Start a new estimate** and **Retrieve a saved reference**. The retrieval input accepts a reference only; it does not claim to restore a live quote unless the customer is authenticated and the backend verifies it.

**Focused five-step flow:**

1. **Vehicle** — vehicle type, approximate value, model year.
2. **Driver & use** — driving experience, recent claims/incident band, city where the vehicle is usually kept, and primary use.
3. **Shape cover** — Essential, Balanced, or Complete; excess/deductible; add-ons.
4. **Budget Fit** — compare all cover tiers, excess choices, and add-ons against the customer’s monthly target. The base illustration remains unchanged by the target.
5. **Review** — show the illustrative breakdown, disclosures, and save/contact actions.

Keep a compact result ribbon under the header after the first calculation: **“Illustrative estimate: ETB X/year · ETB Y/month.”** It must use `aria-live` in web equivalents and a non-disruptive native accessibility announcement in the app.

#### Policy · ፖሊሲ

**Policy list:** vertically stacked policies or service items with `Active`, `Expiring soon`, `Payment verification pending`, or `No policy yet` states. Use a single `View policy` CTA for each row.

**Policy detail hierarchy:**

1. Cover and policy status
2. Digital insurance card / document downloads
3. Payment history and receipt status
4. Renewal / change request
5. Contact licensed insurer or assigned agent

A payment return belongs in `Payment verification pending` until the backend receives an authenticated provider result, matches the amount/currency, and records settlement. A web redirect, app link, or customer screenshot is not a receipt.

#### Claims · የካሳ ጥያቄ

**First decision:** “Is anyone unsafe or injured?”

- **Yes:** Prioritize emergency instructions, emergency contacts, and roadside support. Do not ask the customer to complete a claim form first.
- **No:** Start claim intake: basic facts, date/time, location only with clear consent, photos, and repair preference. Explain that submission creates a claim request, not a coverage decision.

**Claim tracking:** Use a vertical timeline with `Received`, `Reviewing`, `More information needed`, `Assessment`, `Repair choice`, and `Closed` only when those states are confirmed by the claims backend. Each state needs one plain-language “What happens next?” line and a single support route.

#### Help · እርዳታ

Order Help around urgency, not content categories:

1. **Roadside help** — vehicle, safe location, callback number, reference; set expectations that dispatch begins only after a verified support partner accepts the request.
2. **Call an agent** — pass quote/policy/claim context only after clear consent.
3. **Payment help** — pending payment, duplicate debit, receipt, refund/reversal questions.
4. **Learn** — short explainers that route to the educational hub or native reading view.

## 2. Website educational hub and SEO landing-page structure

### Core principle

Public pages must carry the meaningful title, explanatory body copy, links, and metadata in initial HTML. A client-only Vite shell is not sufficient for search discovery. Use static generation/prerendering for the public education pages, or render them server-side; keep authenticated policy, payment, quote retrieval, and claims data private. Each canonical URL needs its own title, description, canonical link, Open Graph data, and real status handling.

### Navigation and sitemap

Put the language control in the website header: **EN | አማ**. Language is a content choice, not an afterthought. Create separate, human-reviewed English and Amharic URLs rather than auto-translating a page at request time.

```text
/en/                                     Home
/en/auto-insurance/                      Forward Auto product landing page
/en/addis-ababa-car-insurance/           Addis city landing page
/en/learn/                               Educational hub
/en/learn/motor-insurance-basics/        Insurance basics
/en/learn/third-party-vs-own-damage/     Coverage comparison
/en/learn/motor-insurance-premium-guide/ Premium guide
/en/learn/vehicle-insurance-renewal/     Renewal guide
/en/learn/roadside-assistance-addis/     Roadside readiness
/en/learn/after-an-accident/             Accident steps
/en/learn/safe-driving-addis/            Safe-driving guide
/en/claims/                              Public claims overview
/en/help/                                Contact and help overview
/am/...                                  Human-reviewed Amharic equivalents
```

Do **not** index `/quote/step/*`, `/account/*`, `/policy/*`, `/payments/*`, `/claims/track/*`, internal help tickets, or any route containing personal/reference data. Keep those out of the sitemap and protected by authentication and private/no-store responses.

### Educational hub structure

The `/learn/` hub should use six intent-led collections instead of a generic blog:

| Collection | Example article | Search intent | Conversion path |
|---|---|---|---|
| **Start with the basics** | `motor-insurance-basics` | “What is motor insurance in Ethiopia?” | Learn how cover works → Auto product page |
| **Choose cover** | `third-party-vs-own-damage` | “Third party vs own damage insurance Ethiopia” | Compare cover → Start estimate |
| **Understand price** | `motor-insurance-premium-guide` | “How is motor insurance premium calculated?” | See risk-led factors → Start estimate |
| **Prepare for an incident** | `after-an-accident` | “What to do after car accident Addis Ababa” | Emergency/help → Claims overview |
| **Maintain and renew** | `vehicle-insurance-renewal` | “Motor insurance renewal Ethiopia” | Renewal checklist → Contact agent |
| **Drive more safely** | `safe-driving-addis` | “Safe driving Addis Ababa” | Safety tips → Safe-driving program explainer |

Every article needs:

- A question-led **H1**, a short answer in the first two paragraphs, and a clear author/review date.
- An “At a glance” answer block; explanatory H2 sections; links to related guidance; one responsible CTA.
- Original advice that is careful not to promise premium reductions, claim acceptance, roadside dispatch, or policy cover.
- A visible source/review note for regulatory or safety claims. Use official NBE and public-agency/peer-reviewed sources rather than competitor copy.
- A no-index draft workflow until legal, insurance, and Amharic-language review are complete.

### Landing-page template

Use the same structural template for `/auto-insurance/` and `/addis-ababa-car-insurance/`, but write genuinely different content. Do not create thin city pages by swapping place names.

1. **H1 and explanation:** explain the product/concept in plain language.
2. **How an estimate works:** vehicle, driver/use, cover, then Budget Fit.
3. **Coverage comparison:** Essential / Balanced / Complete and exclusions/limits that are actually available.
4. **Why Addis needs a different view:** traffic, parking, roadside, and service considerations—only claims that have a cited source.
5. **Buying routes:** online estimate, phone/agent, and payment readiness.
6. **Learning links:** three relevant articles.
7. **FAQ:** only questions answered on the page.
8. **Conversion:** “Get an accurate estimate” with a short demonstration/non-binding disclosure.

### Metadata examples

Use the final production domain in canonical, Open Graph URL, and sitemap data. Do not publish a canonical URL based on the Preview host.

| Route | Suggested title | Suggested meta description |
|---|---|---|
| `/en/auto-insurance/` | `Forward Auto Insurance | Vehicle-led estimates in Ethiopia` | `Explore a vehicle-and-driver-led Forward Auto estimate, compare cover options, and use Budget Fit to plan your month.` |
| `/en/addis-ababa-car-insurance/` | `Car Insurance in Addis Ababa | Forward Auto` | `Understand car-insurance cover, vehicle-led estimates, Budget Fit, roadside readiness, and agent support for Addis Ababa drivers.` |
| `/en/learn/third-party-vs-own-damage/` | `Third-Party vs Own-Damage Motor Insurance in Ethiopia` | `Learn the practical difference between third-party and own-damage motor-insurance cover before choosing a policy.` |
| `/am/learn/after-an-accident/` | `ከመኪና አደጋ በኋላ ምን ማድረግ እንዳለብዎ` | `በአዲስ አበባ ወይም በሌላ ቦታ ከመኪና አደጋ በኋላ ደህንነትዎን ለመጠበቅ እና የካሳ ጥያቄ ለማቅረብ መጀመሪያ የሚወስዷቸውን እርምጃዎች ይወቁ።` |

Aim for approximately **30–60 characters** in titles and **50–160 characters** in descriptions. Keep H1/H2 wording under 80 characters where possible. Include 3–8 precise terms in the page’s metadata policy if the platform requires keywords; do not keyword-stuff.

### Technical SEO checklist

- Render public article/landing-page body content before JavaScript runs.
- Publish one canonical URL and one correct `hreflang` mapping per English/Amharic equivalent; include `x-default` only for the chosen default language.
- Generate `sitemap.xml` from the approved public routes only. Maintain `robots.txt` with private route disallows.
- Add `BreadcrumbList` to the hub/article hierarchy; `Article` only for editorial pages; `FAQPage` only where all answers are visible; `Organization` only with verified legal entity details. Do not mark the concept as an `InsuranceAgency` until it is actually licensed and operating.
- Give each page an Open Graph image, title, description, URL, and site name. Use accessible image alt text.
- Return real 404s for missing content and `noindex` for error/draft pages. Do not return a 200 shell with a “not found” message.
- Measure content discovery separately from quote completion. Search pages serve questions; quote and account flows serve conversion.

## 3. Bilingual mobile quote UX copy guide

### Voice and localization rules

- **Voice:** calm, direct, reassuring, and specific. Explain next actions without sales pressure.
- **Full locale, not persistent duplication:** When a customer selects Amharic, the app should render the full interface in Amharic. Use English in microcopy only where it is a familiar product term or a legal/source reference requires it.
- **Use an explanation for difficult terms:** Say “Your share after a covered event” beside `Excess / Deductible` rather than presenting a literal translation alone.
- **Do not over-promise:** use `illustration`, `estimate`, `request`, `we’re verifying`, and `next step`. Do not say `guaranteed`, `approved`, `covered`, `paid`, or `dispatched` until the relevant backend confirmation exists.
- **Production note:** Have a qualified Ethiopian insurance/legal reviewer validate all final Amharic disclosures, payment notices, and claims instructions before release.

### Bottom-navigation labels

| English | Amharic | Usage note |
|---|---|---|
| Home | መነሻ | Home tab and back-to-home CTA |
| Quote | ግምት | Use for the illustrative quote journey |
| Policy | ፖሊሲ | Use only after a verified policy record exists |
| Claims | የካሳ ጥያቄ | Prefer this full phrase over a vague “incident” label |
| Help | እርዳታ | Includes roadside, agent, payment, and learning help |

### Quote-flow copy

| Screen / state | English | Amharic |
|---|---|---|
| Quote entry title | **Let’s build your vehicle-led estimate.** | **በተሽከርካሪዎ ላይ የተመሰረተ ግምት እንጀምር።** |
| Quote entry body | Tell us about the vehicle and how it is used. We will show an illustration before you choose a monthly target. | ስለ ተሽከርካሪዎ እና ስለ አጠቃቀሙ ይንገሩን። ወርሃዊ ዒላማ ከመምረጥዎ በፊት ግምታዊ ማሳያ እናሳይዎታለን። |
| New quote CTA | Start a new estimate | አዲስ ግምት ይጀምሩ |
| Retrieve CTA | Retrieve a saved reference | የተቀመጠ ማጣቀሻ ያስገቡ |
| Step 1 title | **Start with your vehicle.** | **በተሽከርካሪዎ ይጀምሩ።** |
| Vehicle type | Vehicle type | የተሽከርካሪ አይነት |
| Approximate value | Approximate vehicle value (ETB) | ግምታዊ የተሽከርካሪ ዋጋ (ብር) |
| Model year | Model year | የሞዴል ዓመት |
| Step 1 helper | Use an approximate value. You can update it later with a licensed insurer or agent. | ግምታዊ ዋጋ ያስገቡ። በኋላ ከፈቃድ ካለው መድን ሰጪ ወይም ወኪል ጋር ማሻሻል ይችላሉ። |
| Step 2 title | **Tell us about the driver and use.** | **ስለ ሾፌሩ እና አጠቃቀሙ ይንገሩን።** |
| Driving experience | Driving experience | የመንዳት ልምድ |
| Recent claims | Recent claims or incidents | የቅርብ ጊዜ የካሳ ጥያቄዎች ወይም አደጋዎች |
| Vehicle use | How is the vehicle used? | ተሽከርካሪው እንዴት ይገለገላል? |
| Garaging city | Where is the vehicle usually kept? | ተሽከርካሪው ብዙ ጊዜ የት ይቆማል? |
| Step 2 privacy note | These details help explain the illustration. They are not a final insurance decision. | እነዚህ መረጃዎች ግምቱን ለማብራራት ያግዛሉ። የመጨረሻ የመድን ውሳኔ አይደሉም። |
| Step 3 title | **Choose the cover that fits your day.** | **ለቀንዎ የሚስማማውን ሽፋን ይምረጡ።** |
| Tier names | Essential · Balanced · Complete | መሠረታዊ · ተመጣጣኝ · ሙሉ |
| Excess label | Your share after a covered event | ከተሸፈነ ክስተት በኋላ በእርስዎ የሚከፈል መጠን |
| Add-on label | Helpful extras | ጠቃሚ ተጨማሪ አማራጮች |
| Step 4 title | **Now fit the illustration to your month.** | **አሁን ግምቱን ከወርሃዊ በጀትዎ ጋር ያስተካክሉ።** |
| Current result label | Current risk-and-cover illustration | አሁን ያለው በአደጋ ሁኔታና በሽፋን ላይ የተመሰረተ ግምት |
| Monthly target | Your monthly target | የወርሃዊ ዒላማዎ |
| Budget guardrail | Your monthly target helps compare choices. It does not set or reduce this illustration. | የወርሃዊ ዒላማዎ አማራጮችን ለማነጻጸር ያግዛል። ይህን ግምት አይወስንም ወይም አይቀንስም። |
| Within target | Within your monthly target | በወርሃዊ ዒላማዎ ውስጥ |
| Close to target | Close to your monthly target | ከወርሃዊ ዒላማዎ ቅርብ |
| Above target | Above your monthly target | ከወርሃዊ ዒላማዎ በላይ |
| Step 5 title | **Review your illustration.** | **ግምትዎን ይመልከቱ።** |
| Review body | Your illustration reflects the vehicle, driver context, cover, and location you selected. | ግምትዎ በመረጡት ተሽከርካሪ፣ የሾፌር መረጃ፣ ሽፋን እና ቦታ ላይ የተመሰረተ ነው። |
| Main disclosure | This is an illustration, not a policy or promise of cover. A licensed insurer will review the final details. | ይህ ግምታዊ ማሳያ ነው፤ ፖሊሲ ወይም የሽፋን ቃል ኪዳን አይደለም። ፈቃድ ያለው መድን ሰጪ የመጨረሻ መረጃዎችን ይገመግማል። |
| Save CTA | Save demo reference | የማሳያ ማጣቀሻ ያስቀምጡ |
| Agent CTA | Talk to an agent | ከወኪል ጋር ይነጋገሩ |

### Payment and post-quote status copy

| State | English | Amharic |
|---|---|---|
| Payment handoff | Continue securely to payment | ወደ ደህንነቱ የተጠበቀ ክፍያ ይቀጥሉ |
| Handoff note | You will complete payment with the selected payment provider. Forward never asks for your wallet PIN or OTP. | ክፍያውን በመረጡት የክፍያ አቅራቢ በኩል ያጠናቅቃሉ። Forward የቦርሳዎን PIN ወይም OTP አይጠይቅም። |
| Verification pending | We’re verifying your payment. | ክፍያዎን በማረጋገጥ ላይ ነን። |
| Pending body | Keep this screen open if you can. We will update this status after we receive verified confirmation. | ከቻሉ ይህን ገጽ ክፍት ያድርጉ። የተረጋገጠ ማረጋገጫ ከደረሰን በኋላ ሁኔታውን እናዘምናለን። |
| Payment verified | Payment verified | ክፍያው ተረጋግጧል |
| Verified body | Your payment has been verified. We are preparing your policy documents. | ክፍያዎ ተረጋግጧል። የፖሊሲ ሰነዶችዎን በማዘጋጀት ላይ ነን። |
| Failure | We could not verify this payment yet. | ይህን ክፍያ እስካሁን ማረጋገጥ አልቻልንም። |
| Failure actions | Check payment status · Try another method · Get help | የክፍያ ሁኔታን ይመልከቱ · ሌላ ዘዴ ይሞክሩ · እርዳታ ያግኙ |
| Expired quote | This estimate has expired. Start a fresh estimate before payment. | ይህ ግምት ጊዜው አልፏል። ከክፍያ በፊት አዲስ ግምት ይጀምሩ። |

### Validation, empty, and urgent copy

| Scenario | English | Amharic |
|---|---|---|
| Required vehicle value | Enter an approximate vehicle value in ETB. | ግምታዊ የተሽከርካሪ ዋጋ በብር ያስገቡ። |
| Invalid model year | Enter a valid model year. | ትክክለኛ የሞዴል ዓመት ያስገቡ። |
| No saved quote | No saved reference was found on this device. | በዚህ መሣሪያ ላይ የተቀመጠ ማጣቀሻ አልተገኘም። |
| Unsafe claim check | Is anyone unsafe or injured? | ማንም ሰው አደጋ ላይ ወይም ተጎድቶ አለ? |
| Emergency action | Get emergency help first. You can return to the claim later. | በመጀመሪያ የአደጋ ጊዜ እርዳታ ያግኙ። በኋላ ወደ የካሳ ጥያቄው መመለስ ይችላሉ። |
| Photo consent | Add photos only if it is safe to do so. | ደህንነቱ ከተጠበቀ ብቻ ፎቶዎችን ያክሉ። |
| Roadside boundary | We will share your request with a support partner after it is accepted. | ጥያቄዎ ከተቀበለ በኋላ ከድጋፍ አጋር ጋር እናጋራለን። |

## 4. Implementation acceptance checklist

- [ ] Bottom navigation contains exactly Home, Quote, Policy, Claims, and Help, with full Amharic locale support.
- [ ] Quote/claim/payment flows hide the bottom bar and preserve only safe progress/exit routes.
- [ ] Every non-final payment state says **verifying** or **pending**, not paid, covered, or issued.
- [ ] Budget Fit copy explains that the target compares choices and cannot set or lower the risk-led illustration.
- [ ] Public educational pages render meaningful content and route-specific metadata before JavaScript runs.
- [ ] English and Amharic pages are separately reviewed, canonicalized, linked with `hreflang`, and added to the public sitemap only when approved.
- [ ] No public page claims that Forward Insurance is licensed, that a price is binding, or that a claim/roadside request is accepted before verified operational confirmation.
