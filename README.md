# Assignment 3 — SauceDemo & Coffee Shop (Playwright)

Automated test scripts เขียนด้วย [Playwright](https://playwright.dev/) (TypeScript)
รหัสนิสิต: **67022759**

## Test files

| ไฟล์ | เว็บที่ทดสอบ | จำนวน test cases |
|---|---|---|
| `tests/saucedemo.spec.ts` | https://www.saucedemo.com/ | 3 |
| `tests/coffeeshop.spec.ts` | https://seleniumbase.io/coffee/ | 3 |

### 1. SauceDemo — Guest checkout
เลือก test case จากไฟล์ `SauceDemo (Test Cases).xlsx` ชีต **Checkout**

| TC ID | Test case | Expected result |
|---|---|---|
| TC-CKO-002 | กรอก First name / Last name / Postal code ที่ถูกต้อง แล้วกด Continue | ไปหน้า **Checkout: Overview** |
| TC-CKO-003 | กด Continue โดยไม่กรอกช่องที่บังคับ | ขึ้น error **"Error: First Name is required"** |
| TC-CKO-013 | กด Finish จบการสั่งซื้อ | ขึ้นข้อความ **"Thank you for your order!"** |

Pre-condition ของทุกเคส: login ด้วย `standard_user` / `secret_sauce` → เพิ่มสินค้า 1 ชิ้นลงตะกร้า → เข้าหน้า Cart

### 2. Coffee Shop

| TC ID | Test case | Expected result |
|---|---|---|
| TC-COF-001 | กดสั่ง Cafe Latte 1 แก้ว | ปุ่มยอดรวมแสดง **Total: $16.00** และ cart แสดง (1) |
| TC-COF-002 | สั่ง Espresso ($10) + Americano ($7) แล้วเข้าหน้า cart | ยอดรวม **Total: $17.00** และหน้า cart แสดงครบทั้ง 2 รายการ |
| TC-COF-003 | กดปุ่มยอดรวม → กรอก Name / Email → Submit | ขึ้นข้อความ **"Thanks for your purchase."** และยอดรวมกลับเป็น $0.00 |

## วิธีรัน

```bash
npm install
npx playwright install chromium

npx playwright test                       # รันทั้ง 6 tests
npx playwright test tests/saucedemo.spec.ts   # รันเฉพาะ saucedemo
npx playwright test tests/coffeeshop.spec.ts  # รันเฉพาะ coffee shop
npx playwright show-report                # ดูรายงาน HTML
```

ทุก test case มีคำสั่ง `page.screenshot()` เก็บหลักฐานหน้าจอไว้ในโฟลเดอร์ `screenshots/`

## Codegen

โค้ดชุดนี้เริ่มจาก Playwright codegen แล้วมาเพิ่ม assertion กับ screenshot เอง

```bash
npx playwright codegen https://www.saucedemo.com/
npx playwright codegen https://seleniumbase.io/coffee/
```
