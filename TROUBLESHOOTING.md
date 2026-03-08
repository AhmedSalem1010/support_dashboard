# دليل تشخيص مشكلة جلب بيانات المستخدمين والعمال

## المشكلة
لا يتم جلب بيانات المستخدمين/العمال في حقل "السائق المستلم" في نموذج إضافة تفويض جديد.

## خطوات التشخيص

### 1. افتح Console في المتصفح
افتح Developer Tools (F12) وانتقل إلى تبويب Console

### 2. ابحث عن الرسائل التالية:
- `🔄 جاري جلب بيانات المستخدمين والعمال...`
- `📦 استجابة API:`
- `✅ تم جلب البيانات بنجاح:` أو `❌ فشل جلب البيانات:`

### 3. تحقق من Network Tab
1. افتح تبويب Network في Developer Tools
2. ابحث عن طلب إلى: `http://localhost:5050/users/api/all-users-workers`
3. تحقق من:
   - **Status Code**: يجب أن يكون 200
   - **Response**: تحقق من البيانات المرجعة
   - **Headers**: تحقق من وجود Authorization header

### 4. الأخطاء المحتملة وحلولها

#### خطأ 401 Unauthorized
**السبب**: التوكن منتهي الصلاحية أو غير صحيح

**الحل**:
1. افتح `/Users/ahmdsalm/Downloads/vehicles/frontend/src/lib/api/config.ts`
2. احصل على توكن جديد من Postman
3. استبدل `DEFAULT_DEV_TOKEN` بالتوكن الجديد

#### خطأ 404 Not Found
**السبب**: الـ endpoint غير موجود في الباك اند

**الحل**:
1. تأكد أن الباك اند يعمل على `http://localhost:5050`
2. تحقق من وجود endpoint في الباك اند:
   ```
   GET /users/api/all-users-workers
   ```

#### خطأ CORS
**السبب**: مشكلة في إعدادات CORS في الباك اند

**الحل**:
تأكد من أن الباك اند يسمح بطلبات من `http://localhost:3000`

#### لا توجد بيانات (Array فارغ)
**السبب**: لا توجد بيانات في قاعدة البيانات

**الحل**:
1. تحقق من قاعدة البيانات
2. تأكد من وجود مستخدمين مع workers_role = 'SUPERVISOR'

### 5. اختبار الـ endpoint يدوياً

استخدم Postman أو curl:

```bash
curl 'http://localhost:5050/users/api/all-users-workers' \
  --header 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### 6. التحقق من البيانات المتوقعة

يجب أن تكون الاستجابة بهذا الشكل:

```json
{
  "data": [
    {
      "user_name": "CL-J03",
      "user_phone": "+966501986329",
      "user_jisr_id": null,
      "workers_id": "111f65c0-c6ff-4359-8b42-8fb9d1b971d0",
      "workers_name": "سامي عبدالرب علي قايد",
      "workers_jisr_id": "918",
      "workers_role": "SUPERVISOR"
    }
  ],
  "error": null,
  "success": true,
  "message": "Users fetched successfully",
  "status": 200
}
```

## الملفات المعدلة

1. **`/Users/ahmdsalm/Downloads/vehicles/frontend/src/lib/api/users.ts`**
   - دالة `fetchAllUsersWithWorkers()`

2. **`/Users/ahmdsalm/Downloads/vehicles/frontend/src/types/users.ts`**
   - Types: `UserWithWorker`, `UsersWithWorkersResponse`

3. **`/Users/ahmdsalm/Downloads/vehicles/frontend/src/hooks/useUsersWithWorkers.ts`**
   - Hook مع console.log للتشخيص

4. **`/Users/ahmdsalm/Downloads/vehicles/frontend/src/components/pages/Authorizations.tsx`**
   - استخدام الـ hook وعرض حالة التحميل/الأخطاء

## ما تم إضافته

### رسائل Console للتشخيص
```javascript
console.log('🔄 جاري جلب بيانات المستخدمين والعمال...');
console.log('📦 استجابة API:', response);
console.log('✅ تم جلب البيانات بنجاح:', response.data.length, 'مستخدم');
```

### عرض حالة التحميل في UI
- رسالة "جاري التحميل..." أثناء جلب البيانات
- رسالة خطأ إذا فشل الجلب
- رسالة "لا توجد بيانات" إذا كانت القائمة فارغة

## الخطوات التالية

1. شغل الفرونت اند: `npm run dev`
2. افتح صفحة التفويضات
3. اضغط على "إضافة تفويض جديد"
4. افتح Console وشاهد الرسائل
5. أرسل لي screenshot من:
   - Console messages
   - Network tab (طلب all-users-workers)
   - حقل "السائق المستلم" في النموذج
