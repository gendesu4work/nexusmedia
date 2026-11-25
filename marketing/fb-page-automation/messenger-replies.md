# Nexus Media FB Page: Messenger auto-replies

**Year-end sale (2026-11-25):** FAQ replies A, B, C and comment Reply F now say ₱199 until Dec 31. In January, change them back to ₱399 by hand (the website and checkout switch on their own).

**Live as of 2026-11-23:** FAQ automation on Messenger, ON, with Replies A, B and C and "Send responses to similar questions" turned on (A uses the ?start=guest link, C uses ?start=signup). Comment to message (Messenger, ON) with keywords how, paano and pano, sending Reply F. Instant reply, away message, keyword replies and saved replies are not set up.

Set these up in **Meta Business Suite → Inbox → Automations**. Each reply is ready to copy and paste, and each fits Meta's 500-character limit for automated responses.

---

## 1. Replies (copy-paste)

### A. How to avail? (Paano mag-avail?)

```
Magandang araw po! Salamat po sa interes sa aming POS system.

Para ma-try po ito, i-click lang ang link na ito at diretso na kayo sa guest mode:
https://nexusmediaph.com/pos/?start=guest

Libre po itong gamitin at i-test. Kapag handa na po kayong i-save ang inyong data sa sariling account, YEAR-END SALE: ₱199 na lang po hanggang Dec 31! One-time payment at walang monthly fee.

Kung may iba pa po kayong katanungan, nandito lang po kami.
```

### B. What payments are available? (Anong payment ang pwede?)

```
Magandang araw po! YEAR-END SALE: ₱199 na lang po ang one-time payment hanggang Dec 31. Maaari po itong bayaran gamit ang:

- GCash
- Maya
- QR Ph (anumang bank app na may QR Ph)

Ang bayad po ay dumadaan sa SikatPay, ang aming payment partner. Sa inyong GCash, Maya o bank app, makikita po ang recipient na "PMP BONGGOT TECH." Normal po ito at ligtas.

Handa na po ang inyong account mga isang minuto matapos ang bayad.
```

### C. How to create an account? (Paano gumawa ng account?)

```
Magandang araw po! Narito po ang steps sa paggawa ng account:

1. I-click ang link na ito para diretso sa sign-up: https://nexusmediaph.com/pos/?start=signup
2. Ilagay ang email at password, i-check ang agreement, at i-click ang "Continue to payment."
3. Magbayad ng ₱199 (YEAR-END SALE hanggang Dec 31) via GCash, Maya o QR Ph.
4. Pagkalipas ng mga isang minuto, mag-log in na po.

Paalala po: hindi naililipat sa account ang data mula sa guest mode, kaya mag-sign up po muna bago ilagay ang inyong products.
```

### D. Greeting / Instant reply (first message, optional)

```
Magandang araw po, at salamat sa pag-message sa Nexus Media!

Maaari po ninyong i-try nang libre ang aming POS system dito: https://nexusmediaph.com/pos/ (i-click ang "Continue as guest").

Piliin lang po ang tanong sa ibaba, o i-type ang inyong mensahe at sasagutin po namin kayo sa lalong madaling panahon.
```

### E. Away message (optional, outside your business hours)

```
Magandang araw po, at salamat sa inyong mensahe! Sa ngayon po ay wala kami online, pero sasagutin po namin kayo sa lalong madaling panahon.

Habang naghihintay, maaari na po ninyong i-try nang libre ang aming POS system: https://nexusmediaph.com/pos/ (i-click ang "Continue as guest").
```

### F. Comment auto-reply: someone comments "how" on a post

Set up in **Automations → Comment to message**. Keywords: `how`, `paano`, `pano`. Turn on for all posts, including ads.

Public reply under their comment:

```
Hi po! Na-send na po namin sa inyong Messenger ang details. Pwede nyo rin pong i-try nang libre dito: https://nexusmediaph.com/pos/?start=guest
```

Private message sent to their Messenger:

```
Magandang araw po! Salamat po sa pag-comment.

Pwede nyo pong i-try nang libre ang aming POS system. I-click lang po ang link na ito at diretso na kayo sa guest mode:
https://nexusmediaph.com/pos/?start=guest

Kapag handa na po kayong i-save ang inyong data sa sariling account, YEAR-END SALE: ₱199 na lang po hanggang Dec 31! One-time payment at walang monthly fee.

Mag-reply lang po kayo rito kung may tanong pa kayo.
```

**Direct links that skip the login screen:**
- `https://nexusmediaph.com/pos/?start=guest` opens guest mode right away.
- `https://nexusmediaph.com/pos/?start=signup` opens guest mode with the sign-up screen (₱199 sale price until Dec 31, then ₱399) already open.

---

## 2. Setup steps in Meta Business Suite

Open **business.facebook.com**, pick the **Nexus Media** page, then **Inbox → Automations** (lightning icon at the top of the Inbox).

### Step 1: Frequently asked questions (the buttons people tap)

These show as tappable questions when someone opens a chat with the page.

1. In Automations, click **Frequently asked questions**.
2. Turn it on for **Messenger** (and Instagram if you want the same on IG).
3. Add 3 questions, each with its answer from section 1:
   - Question: `Paano mag-avail?` → Answer: **Reply A**
   - Question: `Anong payment ang pwede?` → Answer: **Reply B**
   - Question: `Paano gumawa ng account?` → Answer: **Reply C**
4. Click **Save changes**.

### Step 2: Keyword replies (optional, not set up)

The live FAQ has **"Send responses to similar questions"** turned on, so typed questions like "magkano" or "gcash po ba?" already get the closest FAQ answer. Only add keyword automations if that misses common questions, or people may get two replies.

1. Automations → **Create automation** (or **Custom keywords**).
2. Make one automation per reply:

| Automation | Keywords to add | Reply |
|---|---|---|
| How to avail | `avail`, `paano`, `how much`, `magkano`, `price`, `presyo`, `hm`, `interested`, `pos` | Reply A |
| Payments | `payment`, `bayad`, `gcash`, `maya`, `paymaya`, `bank`, `qr`, `mop` | Reply B |
| Create account | `account`, `sign up`, `signup`, `register`, `mag-register`, `login`, `log in` | Reply C |

3. Keep the keyword list short and specific. A word that appears in all three (like "paano") should only go in one automation, or people get two replies at once.

### Step 3: Instant reply (optional)

1. Automations → **Instant reply** → turn on for Messenger.
2. Paste **Reply D**. Save.

### Step 4: Away message (optional)

1. Automations → **Away message** → turn on, set your hours.
2. Paste **Reply E**. Save.

### Step 5: Saved replies (for when you answer by hand)

1. Inbox → open any chat → click the **saved replies** icon (speech bubble with lines) under the message box → **Create saved reply**.
2. Save A, B and C with short names like `avail`, `payment`, `account`.
3. When replying manually, type `/` in the message box and pick the reply.

---

## 3. Test it

Message the page from a **different** Facebook account (your own personal account won't trigger automations while you're an admin on the page in some cases). Check:

- [ ] The 3 FAQ buttons show up when the chat opens
- [ ] Tapping each one sends the right reply
- [ ] Typing "magkano", "gcash" and "sign up" each trigger the right reply, and only one reply
- [ ] The link opens the POS page

## Notes

- **Guest data is not carried over.** The POS signup screen says anything entered as a guest is not saved to the new account. Your original wording ("₱99 kapag isasave nyo na yung data nyo") could make people think their guest entries get kept, so Reply A says "i-save ang inyong data sa sariling account" and Reply C warns them directly.
- If the price, payment methods or button names on /pos change, update these replies too.
