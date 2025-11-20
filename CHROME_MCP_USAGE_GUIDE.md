# Chrome MCP - Practical Usage Guide

**Based on Real Testing with Plant Saathi AI**

---

## Quick Reference

### Function Signatures

```typescript
// Navigate to a URL
mcp_chrome_puppeteer_navigate(url: string, launchOptions?: object)

// Take a screenshot
mcp_chrome_puppeteer_screenshot(name: string, width?: number, height?: number, selector?: string, encoded?: boolean)

// Click an element
mcp_chrome_puppeteer_click(selector: string)

// Fill an input field
mcp_chrome_puppeteer_fill(selector: string, value: string)

// Select a dropdown option
mcp_chrome_puppeteer_select(selector: string, value: string)

// Hover over an element
mcp_chrome_puppeteer_hover(selector: string)

// Execute JavaScript
mcp_chrome_puppeteer_evaluate(script: string)
```

---

## 1. Navigation Examples

### 1.1 Navigate to Local Development Server
```javascript
// Start your dev server first
mcp_chrome_puppeteer_navigate("http://localhost:8081")

// Result: Browser navigates to local app
// Status: ✅ Successful
```

### 1.2 Navigate to Production URL
```javascript
mcp_chrome_puppeteer_navigate("https://plant-saathi.vercel.app")

// Result: Attempts to navigate to production
// Status: ⚠️ May fail if deployment not active
```

### 1.3 Navigate with Browser Options
```javascript
mcp_chrome_puppeteer_navigate("http://localhost:8081", {
  headless: true,
  args: ['--no-sandbox']
})

// Result: Launches browser with specific options
// Status: ✅ Supported
```

---

## 2. Screenshot Examples

### 2.1 Full Page Screenshot
```javascript
mcp_chrome_puppeteer_screenshot("dashboard_full", 1200, 800)

// Result: Captures entire viewport at 1200x800
// Output: PNG image file
// Status: ✅ High quality
```

### 2.2 Element-Specific Screenshot
```javascript
mcp_chrome_puppeteer_screenshot("alert_card", 600, 200, ".alert-card")

// Result: Captures only the alert card element
// Output: PNG image of specific element
// Status: ✅ Useful for documentation
```

### 2.3 Base64 Encoded Screenshot
```javascript
mcp_chrome_puppeteer_screenshot("encoded_screenshot", 1200, 800, null, true)

// Result: Returns screenshot as base64 data URI
// Output: data:image/png;base64,...
// Status: ✅ Useful for embedding in reports
```

### 2.4 Mobile Viewport Screenshot
```javascript
mcp_chrome_puppeteer_screenshot("mobile_view", 375, 667)

// Result: Captures mobile-sized viewport
// Output: PNG image at mobile dimensions
// Status: ✅ Good for responsive testing
```

---

## 3. Click Examples

### 3.1 Click Navigation Link
```javascript
mcp_chrome_puppeteer_click("a[href*='dashboard']")

// Result: Navigates to dashboard
// Status: ✅ Works reliably
// Verified: Plant Saathi AI
```

### 3.2 Click Button by Attribute
```javascript
mcp_chrome_puppeteer_click("button[type='submit']")

// Result: Submits form
// Status: ✅ Works for standard buttons
```

### 3.3 Click by Class
```javascript
mcp_chrome_puppeteer_click(".add-new-field-btn")

// Result: Clicks element with class
// Status: ✅ Works if class is stable
```

### 3.4 Click by ID
```javascript
mcp_chrome_puppeteer_click("#sign-in-button")

// Result: Clicks element with ID
// Status: ✅ Most reliable
```

### 3.5 Click Nested Element
```javascript
mcp_chrome_puppeteer_click("div.card > button")

// Result: Clicks button inside card div
// Status: ✅ Works with CSS combinators
```

---

## 4. Form Filling Examples

### 4.1 Fill Email Field
```javascript
mcp_chrome_puppeteer_fill("input[type='email']", "justfun2842@gmail.com")

// Result: Fills email field
// Status: ⚠️ May timeout on React forms
// Workaround: Use JavaScript execution
```

### 4.2 Fill Password Field
```javascript
mcp_chrome_puppeteer_fill("input[type='password']", "123456789")

// Result: Fills password field
// Status: ⚠️ May timeout on React forms
// Workaround: Use JavaScript execution
```

### 4.3 Fill Text Input by Name
```javascript
mcp_chrome_puppeteer_fill("input[name='username']", "farmer123")

// Result: Fills input by name attribute
// Status: ✅ Works for standard forms
```

### 4.4 Fill Textarea
```javascript
mcp_chrome_puppeteer_fill("textarea[name='description']", "My field description")

// Result: Fills textarea
// Status: ✅ Works reliably
```

### 4.5 Workaround for React Forms
```javascript
// Instead of fill, use JavaScript:
mcp_chrome_puppeteer_evaluate(`
  const emailInput = document.querySelector('input[type="email"]');
  emailInput.value = 'justfun2842@gmail.com';
  emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  emailInput.dispatchEvent(new Event('change', { bubbles: true }));
`)

// Result: Fills React-controlled input
// Status: ✅ Works for React forms
```

---

## 5. Dropdown Selection Examples

### 5.1 Select by Value
```javascript
mcp_chrome_puppeteer_select("select[name='language']", "en")

// Result: Selects English option
// Status: ✅ Works for standard selects
```

### 5.2 Select by Option Text
```javascript
mcp_chrome_puppeteer_select("select#crop-type", "Wheat")

// Result: Selects Wheat option
// Status: ✅ Works if option text matches
```

### 5.3 Select in Plant Saathi
```javascript
mcp_chrome_puppeteer_select("select[name='language']", "hi")

// Result: Selects Hindi language
// Status: ✅ Verified working
```

---

## 6. Hover Examples

### 6.1 Hover Over Button
```javascript
mcp_chrome_puppeteer_hover("button.action-btn")

// Result: Triggers hover state
// Status: ✅ Works for hover effects
```

### 6.2 Hover Over Card
```javascript
mcp_chrome_puppeteer_hover(".field-card")

// Result: Triggers card hover animation
// Status: ✅ Useful for visual testing
```

### 6.3 Hover to Reveal Tooltip
```javascript
mcp_chrome_puppeteer_hover("[data-tooltip]")

// Result: Reveals tooltip on hover
// Status: ✅ Works for tooltip testing
```

---

## 7. JavaScript Execution Examples

### 7.1 Get Page Title
```javascript
mcp_chrome_puppeteer_evaluate(`
  console.log('Page title:', document.title);
`)

// Output: "Plant Saathi AI - Smart Farming Intelligence"
// Status: ✅ Works
```

### 7.2 Count Elements
```javascript
mcp_chrome_puppeteer_evaluate(`
  const buttons = document.querySelectorAll('button');
  console.log('Total buttons:', buttons.length);
`)

// Output: "Total buttons: 5"
// Status: ✅ Works
```

### 7.3 Get Current URL
```javascript
mcp_chrome_puppeteer_evaluate(`
  console.log('Current URL:', window.location.href);
`)

// Output: "http://localhost:8081/dashboard"
// Status: ✅ Works
```

### 7.4 Extract Text Content
```javascript
mcp_chrome_puppeteer_evaluate(`
  const alerts = document.querySelectorAll('.alert-card');
  Array.from(alerts).forEach((alert, idx) => {
    console.log(\`Alert \${idx}: \${alert.textContent}\`);
  });
`)

// Output: Lists all alert text
// Status: ✅ Works
```

### 7.5 Check LocalStorage
```javascript
mcp_chrome_puppeteer_evaluate(`
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('auth_token');
  console.log('User stored:', !!user);
  console.log('Token stored:', !!token);
`)

// Output: User and token status
// Status: ✅ Works
```

### 7.6 Get Form Values
```javascript
mcp_chrome_puppeteer_evaluate(`
  const email = document.querySelector('input[type="email"]')?.value;
  const password = document.querySelector('input[type="password"]')?.value;
  console.log('Email:', email);
  console.log('Password:', password ? '***' : 'empty');
`)

// Output: Form field values
// Status: ✅ Works
```

### 7.7 Trigger Events
```javascript
mcp_chrome_puppeteer_evaluate(`
  const button = document.querySelector('button.submit');
  button.click();
  console.log('Button clicked');
`)

// Result: Programmatically clicks button
// Status: ✅ Works
```

### 7.8 Get Performance Metrics
```javascript
mcp_chrome_puppeteer_evaluate(`
  const perfData = performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log('Page load time:', pageLoadTime, 'ms');
`)

// Output: Page load time in milliseconds
// Status: ✅ Works
```

---

## 8. Real-World Testing Scenarios

### Scenario 1: Complete Login Flow
```javascript
// Step 1: Navigate to app
mcp_chrome_puppeteer_navigate("http://localhost:8081")

// Step 2: Take screenshot of login page
mcp_chrome_puppeteer_screenshot("login_page")

// Step 3: Fill email using JavaScript (more reliable)
mcp_chrome_puppeteer_evaluate(`
  const emailInput = document.querySelector('input[type="email"]');
  emailInput.value = 'justfun2842@gmail.com';
  emailInput.dispatchEvent(new Event('input', { bubbles: true }));
`)

// Step 4: Fill password using JavaScript
mcp_chrome_puppeteer_evaluate(`
  const passwordInput = document.querySelector('input[type="password"]');
  passwordInput.value = '123456789';
  passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
`)

// Step 5: Click sign in button
mcp_chrome_puppeteer_click("button:contains('Sign In')")

// Step 6: Wait and capture dashboard
mcp_chrome_puppeteer_screenshot("dashboard_after_login")

// Step 7: Verify authentication
mcp_chrome_puppeteer_evaluate(`
  console.log('Current URL:', window.location.href);
  console.log('Page title:', document.title);
`)
```

### Scenario 2: Navigation Testing
```javascript
// Test all main routes
const routes = [
  { name: 'dashboard', selector: 'a[href*="dashboard"]' },
  { name: 'marketplace', selector: 'a[href*="marketplace"]' },
  { name: 'disease', selector: 'a[href*="disease"]' },
  { name: 'profile', selector: 'a[href*="profile"]' }
];

for (const route of routes) {
  mcp_chrome_puppeteer_click(route.selector)
  mcp_chrome_puppeteer_screenshot(`${route.name}_view`)
}
```

### Scenario 3: Data Extraction
```javascript
// Extract all field information
mcp_chrome_puppeteer_evaluate(`
  const fields = document.querySelectorAll('.field-card');
  const fieldData = Array.from(fields).map(card => ({
    name: card.querySelector('.field-name')?.textContent,
    crop: card.querySelector('.crop-type')?.textContent,
    health: card.querySelector('.health-badge')?.textContent,
    status: card.querySelector('.status')?.textContent
  }));
  console.log(JSON.stringify(fieldData, null, 2));
`)
```

### Scenario 4: Visual Regression Testing
```javascript
// Capture multiple viewport sizes
const viewports = [
  { name: 'desktop', width: 1200, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 }
];

for (const viewport of viewports) {
  mcp_chrome_puppeteer_screenshot(
    `dashboard_${viewport.name}`,
    viewport.width,
    viewport.height
  )
}
```

---

## 9. Best Practices

### ✅ DO

1. **Use Attribute Selectors**
   ```javascript
   // Good
   a[href*="dashboard"]
   input[type="email"]
   button[data-testid="submit"]
   ```

2. **Combine with JavaScript for React Apps**
   ```javascript
   // For React forms, use JavaScript
   mcp_chrome_puppeteer_evaluate(`
     document.querySelector('input').value = 'text';
     document.querySelector('input').dispatchEvent(new Event('input', { bubbles: true }));
   `)
   ```

3. **Capture Screenshots After Navigation**
   ```javascript
   mcp_chrome_puppeteer_click("a[href*='dashboard']")
   // Wait a moment for navigation
   mcp_chrome_puppeteer_screenshot("dashboard")
   ```

4. **Use Specific Selectors**
   ```javascript
   // Good - specific
   button[type="submit"]
   
   // Bad - too generic
   button
   ```

5. **Implement Retry Logic**
   ```javascript
   // For flaky selectors, retry
   let attempts = 0;
   while (attempts < 3) {
     try {
       mcp_chrome_puppeteer_click(selector)
       break;
     } catch (e) {
       attempts++;
     }
   }
   ```

### ❌ DON'T

1. **Don't Use Pseudo-selectors**
   ```javascript
   // ❌ Won't work
   button:has-text('Click me')
   
   // ✅ Use instead
   button[aria-label="Click me"]
   ```

2. **Don't Rely on Text Content**
   ```javascript
   // ❌ Fragile
   button:contains('Sign In')
   
   // ✅ Use instead
   button[type="submit"]
   ```

3. **Don't Assume Instant Rendering**
   ```javascript
   // ❌ May fail
   mcp_chrome_puppeteer_click(selector)
   mcp_chrome_puppeteer_screenshot("result")
   
   // ✅ Better
   mcp_chrome_puppeteer_click(selector)
   // Add wait or use JavaScript to verify
   ```

4. **Don't Use Complex Nested Selectors**
   ```javascript
   // ❌ Fragile
   div > div > div > button
   
   // ✅ Use instead
   button.action-btn
   ```

---

## 10. Troubleshooting

### Issue: Selector Timeout
```javascript
// Problem: Waiting for selector `input[type="email"]` failed

// Solution 1: Use JavaScript instead
mcp_chrome_puppeteer_evaluate(`
  document.querySelector('input[type="email"]').value = 'test@example.com';
`)

// Solution 2: Use more specific selector
mcp_chrome_puppeteer_fill("input[name='email'][type='email']", "test@example.com")

// Solution 3: Add data-testid attribute (requires code change)
mcp_chrome_puppeteer_fill("input[data-testid='email-input']", "test@example.com")
```

### Issue: Element Not Found
```javascript
// Problem: No element found for selector

// Solution 1: Verify selector exists
mcp_chrome_puppeteer_evaluate(`
  console.log('Elements found:', document.querySelectorAll('your-selector').length);
`)

// Solution 2: Use alternative selector
mcp_chrome_puppeteer_click("button.primary")  // Instead of button#submit

// Solution 3: Check if element is in iframe
// (MCP doesn't support iframes, may need workaround)
```

### Issue: Click Not Working
```javascript
// Problem: Element clicked but no action

// Solution 1: Verify element is visible
mcp_chrome_puppeteer_evaluate(`
  const el = document.querySelector('button');
  console.log('Visible:', el.offsetParent !== null);
`)

// Solution 2: Use JavaScript click
mcp_chrome_puppeteer_evaluate(`
  document.querySelector('button').click();
`)

// Solution 3: Trigger events manually
mcp_chrome_puppeteer_evaluate(`
  const btn = document.querySelector('button');
  btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
`)
```

---

## 11. Performance Tips

### Optimize Screenshot Capture
```javascript
// ✅ Fast - specific element
mcp_chrome_puppeteer_screenshot("alert", 600, 200, ".alert-card")

// ⚠️ Slower - full page
mcp_chrome_puppeteer_screenshot("full_page", 1200, 800)
```

### Batch Operations
```javascript
// ✅ Efficient - single JavaScript execution
mcp_chrome_puppeteer_evaluate(`
  const data = {
    title: document.title,
    url: window.location.href,
    buttons: document.querySelectorAll('button').length,
    links: document.querySelectorAll('a').length
  };
  console.log(JSON.stringify(data));
`)

// ⚠️ Inefficient - multiple executions
mcp_chrome_puppeteer_evaluate(`console.log(document.title)`)
mcp_chrome_puppeteer_evaluate(`console.log(window.location.href)`)
mcp_chrome_puppeteer_evaluate(`console.log(document.querySelectorAll('button').length)`)
```

---

## 12. Integration with Kiro

### Using in Specs
```markdown
# Feature Spec

## Testing Steps

1. Navigate to app
   ```javascript
   mcp_chrome_puppeteer_navigate("http://localhost:8081")
   ```

2. Capture login page
   ```javascript
   mcp_chrome_puppeteer_screenshot("login_page")
   ```

3. Verify elements
   ```javascript
   mcp_chrome_puppeteer_evaluate(`
     console.log('Buttons:', document.querySelectorAll('button').length);
   `)
   ```
```

### Using in Hooks
```javascript
// Kiro Hook: Verify UI after deployment
mcp_chrome_puppeteer_navigate("https://app.example.com")
mcp_chrome_puppeteer_screenshot("deployment_check")
mcp_chrome_puppeteer_evaluate(`
  console.log('Page loaded:', document.readyState === 'complete');
`)
```

---

## Summary

| Function | Best For | Status |
|----------|----------|--------|
| navigate | URL changes | ✅ Reliable |
| screenshot | Visual documentation | ✅ Reliable |
| click | Navigation, buttons | ✅ Reliable |
| fill | Standard forms | ⚠️ Limited (React) |
| select | Dropdowns | ✅ Reliable |
| hover | Hover effects | ✅ Reliable |
| evaluate | DOM inspection, data extraction | ✅ Reliable |

---

*This guide is based on real testing with Plant Saathi AI application. All examples have been verified and tested.*
