# 📧 SMTP Setup Guide for Production

## Option 1: SendGrid (Recommended - Easy & Free)

### Step 1: SendGrid Account Banayein
1. **Sign up:** https://signup.sendgrid.com
2. Email verify karo
3. Dashboard me jao

### Step 2: API Key Generate Karein
1. SendGrid Dashboard → **Settings** → **API Keys**
2. **Create API Key** button click karo
3. **API Key Name:** `TransportBooking` (ya kuch bhi)
4. **API Key Permissions:** **Full Access** select karo
5. **Create & View** click karo
6. **⚠️ IMPORTANT:** API Key copy karo (yeh sirf ek baar dikhega!)

### Step 3: Sender Verify Karein
1. SendGrid Dashboard → **Settings** → **Sender Authentication**
2. **Single Sender Verification** click karo
3. **Create New Sender** click karo
4. Form fill karo:
   - **From Email:** `arslankibria98@gmail.com`
   - **From Name:** `Toronto Limo Service`
   - **Reply To:** `arslankibria98@gmail.com`
   - **Address, City, State, Zip, Country:** Apna address
5. **Create** click karo
6. Email verify karo (SendGrid verification email aayega)

### Step 4: Railway me Variables Add Karein
Railway Dashboard → Project → Settings → Variables me add karo:

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-api-key-here
SMTP_FROM=arslankibria98@gmail.com
ADMIN_EMAIL_TO=arslankibria98@gmail.com
```

**Note:** `SMTP_PASS` me apna SendGrid API key paste karo (jo Step 2 me copy kiya tha)

### Step 5: Redeploy
Railway automatically redeploy karega, ya manually redeploy karo.

---

## Option 2: Mailgun (Alternative - 5,000 emails/month free)

### Step 1: Mailgun Account
1. **Sign up:** https://signup.mailgun.com
2. Email verify karo
3. Dashboard me jao

### Step 2: Domain Add Karein (ya use subdomain)
1. Mailgun Dashboard → **Sending** → **Domains**
2. **Add New Domain** click karo
3. **Domain Name:** `mg.yourdomain.com` (ya koi bhi subdomain)
4. **Create Domain** click karo
5. DNS records add karo (Mailgun instructions dega)

**Ya Quick Start (without domain):**
- Mailgun automatically ek sandbox domain deta hai
- Sandbox domain se sirf verified emails ko send kar sakte ho
- Production ke liye custom domain better hai

### Step 3: SMTP Credentials
1. Mailgun Dashboard → **Sending** → **Domain Settings**
2. **SMTP credentials** section me:
   - **SMTP hostname:** `smtp.mailgun.org`
   - **Port:** `587` (ya `465` for SSL)
   - **Username:** Apna domain name (e.g., `postmaster@mg.yourdomain.com`)
   - **Password:** Mailgun ka default password (ya generate new)

### Step 4: Railway Variables
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@mg.yourdomain.com
SMTP_PASS=your-mailgun-password
SMTP_FROM=arslankibria98@gmail.com
ADMIN_EMAIL_TO=arslankibria98@gmail.com
```

---

## Option 3: Gmail with Port 465 (SSL)

Agar Gmail hi use karna hai, to port 465 try karo:

### Railway Variables:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=arslankibria98@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=arslankibria98@gmail.com
ADMIN_EMAIL_TO=arslankibria98@gmail.com
```

**Note:** Port 465 SSL use karta hai, Railway me zyada reliable ho sakta hai.

---

## Testing

Deploy ke baad test karo:
1. Reservation form submit karo
2. Railway logs check karo:
   - `[Email] ✅ SMTP connection verified` - Connection successful
   - `[Email] ✅ Notification sent to...` - Email sent successfully
3. Admin email check karo - email aana chahiye

---

## Troubleshooting

### Error: "Connection timeout"
- Check SMTP_HOST aur SMTP_PORT correct hain
- Railway network restrictions check karo

### Error: "Authentication failed"
- SMTP_USER aur SMTP_PASS verify karo
- API key/password correct hai?

### Error: "Sender not verified"
- SendGrid/Mailgun me sender verify karo
- Email verification complete karo

---

## Recommended: SendGrid
- ✅ Easy setup
- ✅ Free tier: 100 emails/day
- ✅ Reliable
- ✅ Good documentation
