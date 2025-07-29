# 🚀 رفع الفرونت إند على Vercel

## خطوات سريعة:

### 1. رفع الباك إند على Replit ✅
- الباك إند مرفوع على: `https://e650d764-c4e9-42b9-91b6-5f59c4d0bc8b-00-184uinw57mbzk.worf.replit.dev`

### 2. رفع الفرونت إند على Vercel

#### الطريقة الأولى: عبر Vercel Dashboard
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط "New Project"
3. اربط حساب GitHub
4. اختر repository الخاص بالمشروع
5. في إعدادات البيئة أضف:
   ```
   REACT_APP_API_URL=https://e650d764-c4e9-42b9-91b6-5f59c4d0bc8b-00-184uinw57mbzk.worf.replit.dev
   ```
6. اضغط "Deploy"

#### الطريقة الثانية: عبر Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel
```

### 3. إعدادات البيئة المطلوبة في Vercel:
```
REACT_APP_API_URL=https://e650d764-c4e9-42b9-91b6-5f59c4d0bc8b-00-184uinw57mbzk.worf.replit.dev
REACT_APP_NAME=Areeb Learning Platform
REACT_APP_VERSION=1.0.0
```

**ملاحظة**: يمكنك تغيير `REACT_APP_API_URL` لأي رابط آخر للباك إند

### 4. اختبار التطبيق:
- تسجيل الدخول
- عرض الدورات
- إنشاء دورات (للمعلمين)
- التسجيل في الدورات (للطلاب)

### 5. استكشاف الأخطاء:
- تحقق من console في المتصفح
- تحقق من Network tab
- تأكد من أن الباك إند يعمل على Replit

## ملاحظات:
- الباك إند محدث ليدعم CORS من Vercel domains
- الفرونت إند جاهز للرفع مع جميع الإعدادات المطلوبة
- ملف `vercel.json` موجود مع الإعدادات الصحيحة 