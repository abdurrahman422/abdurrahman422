# নিজের GitHub প্রোফাইল কাস্টমাইজ করা

এটি GitHub profile README-এর জন্য তৈরি ডিজাইন। গাঢ় ব্যাকগ্রাউন্ড, সবুজ অ্যাকসেন্ট ও অরবিটাল গ্রাফিক্স সম্পূর্ণ নতুন SVG; রেফারেন্সের ছবি বা ব্যক্তিগত তথ্য ব্যবহার করা হয়নি। GitHub-এর বাইরের পেজের রং বা লেআউট README দিয়ে বদলানো যায় না।

## নিজের তথ্য

`profile.json`-এ নাম, GitHub username, পরিচয়, bio, বর্তমান কাজ ও শেখার বিষয় লিখুন। খালি username মানে ডিজাইনটি এখনও preview।

- `theme`: ছয় অঙ্কের hex রং। যেমন সবুজ `#65ffb4`, বেগুনি `#b49aff`, নীল `#7bdfff`।
- `skills`: নিজের স্কিলের নামের তালিকা।
- `projects`: নিচের গঠনে নিজের প্রজেক্ট।
- `links`: পোর্টফোলিও, LinkedIn বা ইমেইল লিংক।

প্রজেক্টের উদাহরণ—এগুলো ডেমো মান, নিজের তথ্য দিয়ে বদলাবেন:

```json
{
  "name": "Your project",
  "description": "What it does and why you built it.",
  "tech": ["Your language", "Your framework"],
  "url": "https://github.com/YOUR-USERNAME/YOUR-REPOSITORY",
  "demo": "https://example.com"
}
```

লিংকের উদাহরণ:

```json
{ "label": "Portfolio", "url": "https://example.com" }
```

Node.js 20 বা নতুন সংস্করণ থাকলে এই ফোল্ডারে চালান:

```sh
npm run build
```

কোনো প্যাকেজ ইনস্টল লাগে না। এটি `README.md` এবং `assets`-এর ডিজাইন নতুন করে বানায়। সরাসরি generated ফাইল এডিট করলে পরের build-এ সেই পরিবর্তন মুছে যাবে। পুরো লেখা README-তে থাকে; ব্যানারে খুব দীর্ঘ নাম বা tagline এড়িয়ে চলুন।

## GitHub-এ ব্যবহার

নিজের GitHub username-এর একই নামে একটি public repository-র root-এ `README.md` এবং সম্পূর্ণ `assets` ফোল্ডার রাখুন। ভবিষ্যতে কাস্টমাইজ করার জন্য `profile.json`, `package.json`, `scripts` এবং এই নির্দেশিকাও রাখুন। আগে থেকে profile README থাকলে তার কপি রেখে পরিবর্তন করুন।

GitHub-এর নিয়ম: https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme

নকশার রেফারেন্স: https://github.com/Hxni786

Abdur Rahman-এর নিজের পাবলিক GitHub প্রোফাইল, পুরোনো README এবং প্রজেক্ট README থেকে তথ্য বসানো হয়েছে। কোনো achievement বা contribution সংখ্যা বানানো হয়নি। নতুন প্রজেক্ট যোগ করতে `projects` তালিকায় আরেকটি entry যোগ করুন। `category` দিয়ে উপশিরোনাম ও `visual` দিয়ে গ্রাফিক বেছে নিতে পারবেন: `neural`, `learning`, `campus`, `commerce`, `health`, `industry`।

আগের contribution animation-এর `output` branch বর্তমানে পাওয়া যায়নি, তাই ভাঙা ছবি নতুন README-তে রাখা হয়নি। পুরোনো workflow এবং SVG ফাইল অক্ষত আছে।
