# LuxeMobile Customer Registration System

A professional multi-form customer registration system with three distinct forms for different customer segments. All forms share common components and submit to the same Google Sheet backend.

## 📁 Project Structure

```
form/
├── shared/                    # Shared components
│   ├── styles.css            # Common styles and theme system
│   ├── utils.js              # Utility functions (toast, theme toggle)
│   ├── validation.js         # Form validation logic
│   ├── datepicker.js         # BS/AD date picker
│   └── api.js                # API submission handler
├── form-offers.html          # Form 1: Customer Offers & Updates (Gold)
├── form-retail.html          # Form 2: Retail Purchase (Blue)
├── form-wholesale.html       # Form 3: Wholesale Buyer (Red)
├── index.html                # Original form (deprecated)
├── script.js                 # Original script (deprecated)
├── style.css                 # Original styles (deprecated)
└── README.md                 # This file
```

## 🎨 Forms Overview

### Form 1: Customer Offers & Updates Registration
**File:** `form-offers.html`  
**Color Scheme:** Gold accents  
**Purpose:** General customer registration for marketing and offers  
**Fields:**
- Full Name
- Mobile Number
- Email (optional)
- Date of Birth (BS/AD)
- Interests (checkboxes)
- Consent

**Hidden Field:** `customer_type = "offer"`

---

### Form 2: Retail Purchase Customer Form
**File:** `form-retail.html`  
**Color Scheme:** Blue accents  
**Purpose:** Product registration for warranty and support  
**Fields:**
- All Form 1 fields
- **Product Purchased** (text)
- **Purchase Date** (date)
- **Warranty Period** (dropdown: 6 months, 1 year, 2 years, 3 years)

**Hidden Field:** `customer_type = "retail"`

---

### Form 3: Wholesale Buyer Form
**File:** `form-wholesale.html`  
**Color Scheme:** Red accents  
**Purpose:** Business partnership registration  
**Fields:**
- All Form 1 fields
- **Business / Shop Name** (text)
- **Brands Interested** (text, comma-separated)
- **Average Monthly Quantity** (dropdown: 10-50, 51-100, 101-500, 500+)

**Hidden Field:** `customer_type = "wholesale"`

---

## 🚀 Features

### Shared Components
- **Theme Toggle:** Light/Dark mode with localStorage persistence
- **Date Picker:** Custom BS/AD date picker with Nepali calendar support
- **Validation:** Real-time input validation and sanitization
- **Toast Notifications:** Premium notification system
- **Optimistic UI:** Instant feedback on form submission
- **Responsive Design:** Mobile-first approach

### Design Highlights
- Premium modern UI with smooth animations
- Color-coded forms for easy identification
- Consistent branding across all forms
- Accessible and user-friendly
- No code duplication - DRY principle

## 🔧 Technical Details

### API Integration
All forms submit to the same Google Apps Script endpoint:
```
https://script.google.com/macros/s/AKfycbxNLXcw6gMQ9vbgdFoDXg0QrTyDpVtJEzZCNsWgV6LdWoyn9Mp94yBy_qlFhu_9bEaVUg/exec
```

### Data Structure
Each form sends:
- Common fields (name, mobile, email, DOB, interests, consent)
- Form-specific fields (product info OR business info)
- `customer_type` field to identify form source

### Dependencies
- **Fonts:** Google Fonts (Outfit)
- **Icons:** Phosphor Icons
- **Date Converter:** nepali-date-converter library

## 📝 Usage

1. **Open any form** in a web browser:
   - `form-offers.html` - For general customers
   - `form-retail.html` - For product purchases
   - `form-wholesale.html` - For wholesale buyers

2. **Fill in the required fields**
   - All fields marked with asterisk (*) are required
   - Mobile number must be 10 digits
   - Email is optional but must be valid if provided

3. **Select date of birth**
   - Choose between Nepali (BS) or English (AD) calendar
   - Click on the date field to open the picker

4. **Submit the form**
   - Data is validated before submission
   - Success message appears instantly
   - Form resets after 2 seconds

## 🎯 Maintenance

### Adding New Fields
1. Add HTML input in the specific form file
2. Update validation in `shared/validation.js` if needed
3. Ensure Google Sheet has corresponding column

### Changing Colors
Each form has inline `<style>` block overriding CSS variables:
- Form 1 (Gold): `--primary: #d4af37`
- Form 2 (Blue): `--primary: #2563eb`
- Form 3 (Red): `--primary: #dc2626`

### Updating Shared Components
Edit files in `shared/` folder - changes apply to all forms automatically.

## 📊 Google Sheet Integration

The backend Google Sheet should have columns for:
- **Common:** fullName, mobileNumber, email, dobFinalAD, interests, consent, customer_type
- **Retail:** productPurchased, purchaseDate, warrantyPeriod
- **Wholesale:** businessName, brandsInterested, monthlyQuantity

## 📊 Google Sheet Integration

### Column Structure

Your Google Sheet should have **13 columns** in this exact order:

1. **Timestamp** - Auto-generated
2. **Customer Type** - "offer", "retail", or "wholesale"
3. **Full Name** - From all forms
4. **Mobile Number** - From all forms
5. **Email Address** - From all forms (optional)
6. **Date of Birth (AD)** - From all forms
7. **Interests** - From all forms
8. **Product Purchased** - Form 2 only
9. **Purchase Date** - Form 2 only
10. **Warranty Period** - Form 2 only
11. **Business Name** - Form 3 only
12. **Brands Interested** - Form 3 only
13. **Monthly Quantity** - Form 3 only

### Setup Instructions

1. **Import Template:**
   - Open your Google Sheet
   - File → Import → Upload
   - Select `google_sheets_template.csv`
   - Choose "Replace current sheet"

2. **Verify Columns:**
   - Ensure columns are in the exact order listed above
   - The Apps Script expects this specific structure

3. **Test Submissions:**
   - Submit test data from each form
   - Verify data appears in correct columns
   - Check that `Customer Type` field is populated

### Data Organization

**Form-specific fields will be empty** for forms that don't use them:

- **Form 1 (Offers):** Columns H-M will be empty
- **Form 2 (Retail):** Columns K-M will be empty
- **Form 3 (Wholesale):** Columns H-J will be empty

### Filtering & Analysis

Create filtered views to segment your data:

- **Marketing View:** Filter by `Customer Type = "offer"`
- **Support View:** Filter by `Customer Type = "retail"`
- **Sales View:** Filter by `Customer Type = "wholesale"`

See [GOOGLE_SHEETS_SETUP.md](file:///Users/bishalranjitkar/Desktop/form/GOOGLE_SHEETS_SETUP.md) for detailed setup guide.

## 🔒 Security
- Client-side validation
- HTTPS-only connections
- No sensitive data stored in browser
- Privacy policy linked in consent

## 📱 Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Progressive enhancement approach

---

**Version:** 2.0  
**Last Updated:** December 2025  
**Maintained by:** LuxeMobile Team
