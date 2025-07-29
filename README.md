# Areeb Frontend - Vercel Deployment

## إعدادات الرفع على Vercel

### المتطلبات
- حساب على Vercel
- Node.js 18 أو أحدث

### خطوات الرفع

1. **تثبيت Vercel CLI (اختياري)**
   ```bash
   npm i -g vercel
   ```

2. **بناء المشروع محلياً للتأكد من عدم وجود أخطاء**
   ```bash
   npm install
   npm run build
   ```

3. **رفع المشروع على Vercel**

   **الطريقة الأولى: عبر Vercel Dashboard**
   - اذهب إلى [vercel.com](https://vercel.com)
   - اضغط على "New Project"
   - اربط حساب GitHub/GitLab
   - اختر repository الخاص بالمشروع
   - في إعدادات البيئة، أضف:
     ```
     REACT_APP_API_URL=https://e650d764-c4e9-42b9-91b6-5f59c4d0bc8b-00-184uinw57mbzk.worf.replit.dev
     ```
   - اضغط "Deploy"

   **الطريقة الثانية: عبر Vercel CLI**
   ```bash
   vercel
   ```

### إعدادات البيئة المطلوبة

في Vercel Dashboard، أضف هذه المتغيرات البيئية:

```
REACT_APP_API_URL=https://e650d764-c4e9-42b9-91b6-5f59c4d0bc8b-00-184uinw57mbzk.worf.replit.dev
REACT_APP_NAME=Areeb Learning Platform
REACT_APP_VERSION=1.0.0
```

**ملاحظة مهمة**: 
- `REACT_APP_API_URL` يمكن تغييره لأي رابط آخر للباك إند
- إذا لم يتم تعيين `REACT_APP_API_URL`، سيستخدم التطبيق `http://localhost:5002` كافتراضي

### ملاحظات مهمة

1. **CORS**: تأكد من أن الباك إند يدعم CORS من domain الخاص بـ Vercel
2. **Environment Variables**: جميع المتغيرات البيئية يجب أن تبدأ بـ `REACT_APP_`
3. **Build Command**: Vercel سيتعرف تلقائياً على `npm run build`
4. **Output Directory**: `build`

### اختبار التطبيق

بعد الرفع، تأكد من:
- تسجيل الدخول يعمل
- عرض الدورات يعمل
- جميع الوظائف الأساسية تعمل بشكل صحيح

### استكشاف الأخطاء

إذا واجهت مشاكل:
1. تحقق من console في المتصفح
2. تحقق من Network tab للتأكد من استدعاءات API
3. تحقق من إعدادات البيئة في Vercel
4. تأكد من أن الباك إند يعمل على Replit 